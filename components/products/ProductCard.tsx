"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/CartProvider";
import { Star, ShoppingBag, ArrowUpRight, Tag, Sparkles } from "lucide-react";

export function ProductCard({
  product,
  viewMode = "grid",
  isFeaturedDeck = false,
}: {
  product: IProduct;
  viewMode?: "deck" | "grid" | "list";
  isFeaturedDeck?: boolean;
}) {
  const { addItem } = useCart();
  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const categoryName = typeof product.category === "object" ? product.category.name : "Digital Asset";

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row items-center gap-4 p-4 rounded-[26px] bg-white dark:bg-[#100b24] border border-slate-200/80 dark:border-purple-900/30 hover:border-primary/50 dark:hover:border-purple-500/50 shadow-sm hover:shadow-xl transition-all duration-300">
        <Link
          href={`/products/${product.slug}`}
          className="relative w-full sm:w-56 h-40 rounded-[20px] overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0"
        >
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Price Pill */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-white text-xs font-black flex items-center gap-1.5 shadow-lg">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">{formatPrice(currentPrice)}</span>
          </div>

          {hasDiscount && (
            <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
              SALE
            </span>
          )}
        </Link>

        <div className="flex-1 w-full flex flex-col justify-between py-1">
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
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                {product.title}
              </h3>
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-purple-900/30">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Total Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addItem(product);
                }}
                className="w-10 h-10 rounded-full bg-slate-950 dark:bg-primary text-white flex items-center justify-center hover:scale-105 transition-all shadow-md"
                title="Add to Cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
              <Link
                href={`/products/${product.slug}`}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-slate-700 dark:text-purple-300 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-105"
                title="View Product"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid / Deck mode card (Styled exactly like the sample example)
  return (
    <div
      className={`group relative flex flex-col rounded-[28px] sm:rounded-[32px] bg-white dark:bg-[#100b24] transition-all duration-300 p-3 sm:p-4 overflow-hidden ${
        isFeaturedDeck
          ? "border-[1.5px] border-purple-500/80 dark:border-purple-400/80 shadow-2xl shadow-purple-950/40 scale-[1.01]"
          : "border-[1.5px] border-purple-300/70 dark:border-purple-400/60 hover:border-purple-400 dark:hover:border-purple-300/80 shadow-md hover:shadow-xl hover:-translate-y-0.5"
      }`}
    >
      {/* Thumbnail */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-[22px] overflow-hidden bg-slate-100 dark:bg-slate-800 block flex-shrink-0"
      >
        <Image
          src={product.thumbnailUrl}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Rating Badge (top right pill) */}
        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold flex items-center gap-1 border border-white/10 shadow-md">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
        </div>

        {/* Discount Sale Badge */}
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
            SALE
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="pt-3.5 pb-1 px-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Subtitle / Category */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mb-1">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="font-semibold uppercase tracking-wider text-[10px] text-primary">
              {categoryName}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Description Snippet */}
          <p className="mt-2 text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* 3 Metrics Stats Row */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-[#150f30]/60 border border-slate-100 dark:border-purple-900/30 text-center">
            <div>
              <span className="text-[9px] uppercase font-semibold text-slate-400 dark:text-zinc-400 block">Rating</span>
              <span className="text-xs font-bold text-amber-500 dark:text-amber-400 flex items-center justify-center gap-0.5 mt-0.5">
                ★ {product.rating.toFixed(1)}
              </span>
            </div>
            <div className="border-x border-slate-200 dark:border-purple-900/40">
              <span className="text-[9px] uppercase font-semibold text-slate-400 dark:text-zinc-400 block">Format</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-purple-200 truncate block px-0.5 mt-0.5">
                {product.tags?.[0] || "Digital"}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-semibold text-slate-400 dark:text-zinc-400 block">Delivery</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-purple-200 block mt-0.5">
                Instant
              </span>
            </div>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-purple-900/25 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block">
              Price
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addItem(product);
              }}
              className="w-10 h-10 rounded-full bg-primary hover:bg-purple-700 dark:hover:bg-purple-600 text-white flex items-center justify-center active:scale-95 transition-all shadow-md shadow-purple-900/20 dark:shadow-purple-900/30"
              title="Add to Cart"
              aria-label="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <Link
              href={`/products/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all active:scale-95"
              title="View Product"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
