"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types";
import { useCart } from "@/components/CartProvider";
import { ShoppingBag, ArrowRight, Check } from "lucide-react";

export function ProductDetailClient({ product }: { product: IProduct }) {
  const router = useRouter();
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const isAlreadyInCart = items.some((i) => i.product._id === product._id);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product);
    router.push("/checkout");
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleBuyNow}
        className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all hover:scale-[1.02]"
      >
        <span>Buy Now & Download</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <button
        onClick={handleAddToCart}
        disabled={isAlreadyInCart}
        className={`w-full py-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
          isAlreadyInCart
            ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 cursor-default"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        {isAlreadyInCart ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Already In Cart</span>
          </>
        ) : added ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Added to Cart!</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
}
