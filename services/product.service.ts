import connectDB from "@/lib/db";
import Product, { IProductDocument } from "@/models/Product";
import Category from "@/models/Category";
import { IProduct } from "@/types";
import { SAMPLE_PRODUCTS } from "@/lib/mock-data";

export interface ProductFilterOptions {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "popularity" | "price_asc" | "price_desc" | "newest" | "rating";
  status?: "active" | "inactive" | "all";
  page?: number;
  limit?: number;
}

function getMockFilteredProducts(options: ProductFilterOptions = {}) {
  const {
    categorySlug,
    search,
    minPrice,
    maxPrice,
    sortBy = "popularity",
    status = "active",
    page = 1,
    limit = 12,
  } = options;

  let filtered = [...SAMPLE_PRODUCTS];

  if (status !== "all") {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (categorySlug && categorySlug !== "all") {
    filtered = filtered.filter((p) => {
      const catSlug = typeof p.category === "object" ? p.category.slug : p.category;
      return catSlug === categorySlug;
    });
  }

  if (search && search.trim() !== "") {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (minPrice !== undefined && !isNaN(minPrice)) {
    filtered = filtered.filter((p) => (p.salePrice ?? p.price) >= minPrice);
  }
  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    filtered = filtered.filter((p) => (p.salePrice ?? p.price) <= maxPrice);
  }

  if (sortBy === "price_asc") {
    filtered.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  } else if (sortBy === "price_desc") {
    filtered.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  } else if (sortBy === "newest") {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    filtered.sort((a, b) => b.salesCount - a.salesCount);
  }

  const total = filtered.length;
  const skip = (page - 1) * limit;
  const paginated = filtered.slice(skip, skip + limit);

  return {
    products: paginated,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    },
  };
}

export class ProductService {
  static async getProducts(options: ProductFilterOptions = {}) {
    try {
      await connectDB();
      const {
        categorySlug,
        search,
        minPrice,
        maxPrice,
        sortBy = "popularity",
        status = "active",
        page = 1,
        limit = 12,
      } = options;

      const query: any = {};

      if (status !== "all") {
        query.status = status;
      }

      if (categorySlug && categorySlug !== "all") {
        const cat = (await Category.findOne({ slug: categorySlug })) as any;
        if (cat) {
          query.category = cat._id;
        }
      }

      if (search && search.trim() !== "") {
        const searchRegex = new RegExp(search.trim(), "i");
        query.$or = [
          { title: searchRegex },
          { shortDescription: searchRegex },
          { tags: searchRegex },
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = minPrice;
        if (maxPrice !== undefined) query.price.$lte = maxPrice;
      }

      let sort: any = { salesCount: -1 };
      if (sortBy === "price_asc") sort = { price: 1 };
      else if (sortBy === "price_desc") sort = { price: -1 };
      else if (sortBy === "newest") sort = { createdAt: -1 };
      else if (sortBy === "rating") sort = { rating: -1, reviewsCount: -1 };

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        Product.find(query)
          .populate("category", "name slug icon")
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(query),
      ]);

      if (products && products.length > 0) {
        return {
          products: JSON.parse(JSON.stringify(products)) as IProduct[],
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        };
      }
    } catch (e) {
      console.warn("MongoDB offline or empty, using sample catalog:", e);
    }

    // Fallback to sample products (1 per category)
    return getMockFilteredProducts(options);
  }

  static async getFeaturedProducts(limit = 6): Promise<IProduct[]> {
    try {
      await connectDB();
      const products = await Product.find({ status: "active" })
        .populate("category", "name slug icon")
        .sort({ salesCount: -1, rating: -1 })
        .limit(limit)
        .lean();

      if (products && products.length > 0) {
        return JSON.parse(JSON.stringify(products));
      }
    } catch (e) {
      // fallback
    }

    return JSON.parse(JSON.stringify(SAMPLE_PRODUCTS.slice(0, limit)));
  }

  static async getProductBySlug(slug: string): Promise<IProduct | null> {
    try {
      await connectDB();
      const product = await Product.findOne({ slug })
        .populate("category", "name slug icon")
        .lean();

      if (product) return JSON.parse(JSON.stringify(product));
    } catch (e) {
      // fallback
    }

    const found = SAMPLE_PRODUCTS.find((p) => p.slug === slug);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  static async getRelatedProducts(productId: string, categoryId: string, limit = 3): Promise<IProduct[]> {
    try {
      await connectDB();
      const products = await Product.find({
        _id: { $ne: productId },
        category: categoryId,
        status: "active",
      })
        .populate("category", "name slug icon")
        .limit(limit)
        .lean();

      if (products && products.length > 0) {
        return JSON.parse(JSON.stringify(products));
      }
    } catch (e) {
      // fallback
    }

    const fallback = SAMPLE_PRODUCTS.filter((p) => p._id !== productId).slice(0, limit);
    return JSON.parse(JSON.stringify(fallback));
  }

  static async createProduct(data: Partial<IProductDocument>): Promise<IProduct> {
    await connectDB();
    const product = await Product.create(data);
    const populated = await Product.findById(product._id).populate("category", "name slug icon").lean();
    return JSON.parse(JSON.stringify(populated));
  }

  static async updateProduct(id: string, updates: Partial<IProductDocument>): Promise<IProduct | null> {
    await connectDB();
    const updated = await Product.findByIdAndUpdate(id, updates, { new: true })
      .populate("category", "name slug icon")
      .lean();
    if (!updated) return null;
    return JSON.parse(JSON.stringify(updated));
  }

  static async deleteProduct(id: string): Promise<boolean> {
    await connectDB();
    const res = await Product.findByIdAndDelete(id);
    return !!res;
  }
}
