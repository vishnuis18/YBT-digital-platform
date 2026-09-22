"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponMessage(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponDiscount(data.discountAmount);
        setCouponMessage({ text: data.message, isError: false });
      } else {
        setCouponDiscount(0);
        setCouponMessage({ text: data.message || "Invalid coupon", isError: true });
      }
    } catch {
      setCouponMessage({ text: "Failed to validate coupon", isError: true });
    } finally {
      setCouponLoading(false);
    }
  };

  const estimatedTax = Math.round((Math.max(0, subtotal - couponDiscount) * 0.18) * 100) / 100;
  const estimatedTotal = Math.round((Math.max(0, subtotal - couponDiscount) + estimatedTax) * 100) / 100;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          Explore our collection of production-ready SaaS boilerplates, UI kits, and digital tools.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-600 transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Shopping Cart
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your digital products and apply discount coupons before proceeding to checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <Image
                      src={item.product.thumbnailUrl}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Instant Digital Download • Commercial License
                    </p>
                    <span className="inline-block mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      Digital Asset
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {formatPrice(item.price)}
                  </span>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-2">
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors"
            >
              Clear entire cart
            </button>
            <Link
              href="/products"
              className="text-xs font-bold text-primary hover:text-primary-600 transition-colors"
            >
              + Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Order Summary
            </h2>

            {/* Coupon Code Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Have a Promo / Coupon Code?
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. YBT20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold uppercase rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold disabled:opacity-50 transition-colors"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </form>

              {couponMessage && (
                <p
                  className={`text-xs mt-2 font-medium ${
                    couponMessage.isError ? "text-red-500" : "text-emerald-500 flex items-center gap-1"
                  }`}
                >
                  {!couponMessage.isError && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount ({couponCode})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Tax (18% GST/VAT)</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  +{formatPrice(estimatedTax)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Estimated Total</span>
                <span>{formatPrice(estimatedTotal)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                const query = couponDiscount > 0 ? `?coupon=${encodeURIComponent(couponCode)}` : "";
                router.push(`/checkout${query}`);
              }}
              className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all hover:scale-[1.02]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted 256-bit Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Instant download token delivered immediately</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
