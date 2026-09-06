"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/CartProvider";
import { Star, ShoppingBag, ArrowUpRight, Tag } from "lucide-react";

export function ProductCard({
  product,
  viewMode = "grid",
}: {
  product: IProduct;
  viewMode?: "grid" | "list";
}) {
  const { addItem } = useCart();
  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const categoryName = typeof product.category === "object" ? product.category.name : "Digital Asset";

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300">
        <Link
          href={`/products/${product.slug}`}
          className="relative w-full sm:w-52 h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0"
        >
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Prominent Price Tag Pill */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-white text-xs font-black flex items-center gap-1.5 shadow-lg">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">{formatPrice(currentPrice)}</span>
          </div>

          {hasDiscount && (
            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
              SALE
            </span>
          )}
        </Link>

        <div className="flex-1 w-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {categoryName}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
              </div>
            </div>

            <Link href={`/products/${product.slug}`}>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                {product.title}
              </h3>
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {product.shortDescription}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Price Tag
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => addItem(product)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-primary hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </button>
              <Link
                href={`/products/${product.slug}`}
                className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
                title="Open and view product"
              >
                <span>View</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Thumbnail */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 block"
      >
        <Image
          src={product.thumbnailUrl}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Price Tag Badge on Thumbnail */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-white shadow-xl flex items-center gap-1.5 group-hover:border-emerald-400 transition-colors">
          <Tag className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-black text-emerald-300 tracking-tight">
            {formatPrice(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Rating and Sale Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {hasDiscount && (
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              SALE
            </span>
          )}
          <div className="px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            {categoryName}
          </span>
          <Link href={`/products/${product.slug}`} className="block mt-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Price Tag
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addItem(product)}
              className="p-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white shadow-md shadow-primary/20 transition-all hover:scale-105"
              title="Add to Cart"
              aria-label="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Open and view details"
            >
              <span>View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
