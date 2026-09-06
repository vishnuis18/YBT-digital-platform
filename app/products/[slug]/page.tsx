import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductService } from "@/services/product.service";
import { formatPrice, formatBytes } from "@/lib/utils";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductCard } from "@/components/products/ProductCard";
import { IProduct } from "@/types";
import {
  Star,
  CheckCircle2,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  FileCode,
  Tag,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await ProductService.getProductBySlug(slug);
    if (!product) return { title: "Product Not Found" };

    return {
      title: `${product.title} – YBT Digital`,
      description: product.shortDescription,
    };
  } catch {
    return { title: "Product – YBT Digital" };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    product = await ProductService.getProductBySlug(slug);
    if (product) {
      const categoryId = typeof product.category === "object" ? (product.category as any)._id : product.category;
      relatedProducts = await ProductService.getRelatedProducts(product._id, categoryId, 3);
    }
  } catch (err) {
    console.warn("Product detail fetch error:", err);
  }

  if (!product) {
    notFound();
  }

  const categoryName = typeof product.category === "object" ? product.category.name : "Digital Asset";
  const categorySlug = typeof product.category === "object" ? product.category.slug : "";
  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {categorySlug && (
          <>
            <Link
              href={`/products?category=${categorySlug}`}
              className="hover:text-primary transition-colors"
            >
              {categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Media Gallery + Description (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Hero Image */}
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-lg">
            <Image
              src={product.thumbnailUrl}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-md">
                SAVE {(100 - (product.salePrice! / product.price) * 100).toFixed(0)}%
              </span>
            )}
          </div>

          {/* Screenshots Gallery */}
          {product.screenshots && product.screenshots.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Product Preview Screenshots
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.screenshots.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 group"
                  >
                    <Image
                      src={img}
                      alt={`${product.title} screenshot ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Description */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Product Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>

            {/* Features List */}
            {product.features && product.features.length > 0 && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  What's Included:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.features.map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Purchase Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-primary text-xs font-bold uppercase tracking-wider">
                  {categoryName}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {product.title}
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Tag className="w-4 h-4 text-emerald-500" />
                  <span>Price Tag</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg">
                  Instant Access
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                    {formatPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
                    Save {formatPrice(product.price - currentPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Client interactive buttons (Add to Cart / Buy Now) */}
            <ProductDetailClient product={product} />

            {/* Demo Link */}
            {product.demoUrl && (
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Explore Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}

            {/* Asset specifications */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <FileCode className="w-3.5 h-3.5" /> File Type:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{product.fileName.split(".").pop()?.toUpperCase()} Archive</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Download className="w-3.5 h-3.5" /> File Size:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatBytes(product.fileSize || 15000000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5" /> License:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Commercial & Personal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Zap className="w-3.5 h-3.5" /> Future Updates:
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Lifetime Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Similar Digital Products
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              You might also be interested in these related items.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p: IProduct) => (
              <ProductCard key={p._id} product={p} viewMode="grid" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
