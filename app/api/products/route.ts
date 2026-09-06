import { NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "popularity";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;

    const data = await ProductService.getProducts({
      categorySlug,
      search,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit,
      status: "active",
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}
