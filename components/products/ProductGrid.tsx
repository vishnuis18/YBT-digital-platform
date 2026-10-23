"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { IProduct } from "@/types";
import { ProductCard } from "./ProductCard";
import { PackageOpen, ChevronLeft, ChevronRight, Play, Pause, Sparkles } from "lucide-react";

export function ProductGrid({
  products,
  viewMode = "deck",
  loading = false,
}: {
  products: IProduct[];
  viewMode?: "deck" | "grid" | "list";
  loading?: boolean;
}) {
  const total = products.length;

  // We use a virtual extended index across a 3x loop so cards always slide smoothly in their natural direction without flying across
  const [virtualIndex, setVirtualIndex] = useState(
    total > 0 ? total + Math.floor(total / 2) : 0
  );
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync virtual index when product count changes
  useEffect(() => {
    if (total > 0) {
      setVirtualIndex(total + Math.floor(total / 2));
    }
  }, [total]);

  // Handle seamless invisible reset to middle set when sliding out of bounds
  const scheduleResetIfNeeded = useCallback(
    (newIndex: number) => {
      if (total <= 0) return;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

      resetTimerRef.current = setTimeout(() => {
        if (newIndex >= total * 2 || newIndex < total) {
          setIsTransitioning(false);
          const normalized = ((newIndex % total) + total) % total;
          setVirtualIndex(total + normalized);

          // Restore smooth transition on next tick
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(true);
            });
          });
        }
      }, 620);
    },
    [total]
  );

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setIsTransitioning(true);
    setVirtualIndex((prev) => {
      const nextVal = prev - 1;
      scheduleResetIfNeeded(nextVal);
      return nextVal;
    });
  }, [total, scheduleResetIfNeeded]);

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setIsTransitioning(true);
    setVirtualIndex((prev) => {
      const nextVal = prev + 1;
      scheduleResetIfNeeded(nextVal);
      return nextVal;
    });
  }, [total, scheduleResetIfNeeded]);

  const goToOffset = useCallback(
    (offset: number) => {
      if (offset === 0 || total === 0) return;
      setIsTransitioning(true);
      setVirtualIndex((prev) => {
        const nextVal = prev + offset;
        scheduleResetIfNeeded(nextVal);
        return nextVal;
      });
    },
    [total, scheduleResetIfNeeded]
  );

  // Auto-rotation timer: smooth, calm, pauses on hover/touch
  useEffect(() => {
    if (viewMode !== "deck" || total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [viewMode, total, isPaused, nextSlide]);

  // Touch gesture support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  if (loading) {
    return (
      <div
        className={
          viewMode === "list"
            ? "space-y-4"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        }
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-[28px] bg-white dark:bg-[#100b24] border border-slate-200/80 dark:border-purple-900/30 p-4 animate-pulse h-96"
          >
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-[20px] mb-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-6" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-purple-900/40 bg-white/50 dark:bg-[#100b24]/40">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-purple-950/40 flex items-center justify-center text-slate-400 dark:text-purple-400 mx-auto mb-4 border border-slate-200 dark:border-purple-800/40">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          No products found
        </h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
          Try changing your search keywords or clearing your active filters.
        </p>
      </div>
    );
  }

  // 1. Professional & Smooth 3D Deck Coverflow View with Atmospheric Background
  if (viewMode === "deck") {
    // Extended virtual products triplication (Set 0, Set 1, Set 2) to guarantee smooth linear flow
    const virtualItems = [...products, ...products, ...products];
    const normalizedActiveIndex = ((virtualIndex % total) + total) % total;

    return (
      <div
        className="relative w-full py-8 sm:py-12 px-2 sm:px-6 flex flex-col items-center justify-center overflow-hidden select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ================= BACKGROUND AESTHETICS ================= */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* 1. Central Luminous Nebula Aura directly behind active card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-gradient-to-tr from-purple-600/25 via-violet-500/20 to-fuchsia-600/15 blur-[140px] rounded-full" />
          
          {/* 2. Secondary Top Atmospheric Flare */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[320px] bg-indigo-500/15 blur-[160px] rounded-full" />

          {/* 3. Deep Concentric Orbital Rings (Giving 3D spatial depth) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full border border-purple-500/15 opacity-60 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] rounded-full border border-purple-500/10 opacity-40 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1120px] h-[1120px] rounded-full border border-purple-500/[0.04] opacity-25 pointer-events-none" />

          {/* 4. Fine Dot-Matrix Constellation Grid with Smooth Radial Fade */}
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage: `radial-gradient(rgba(192, 132, 252, 0.45) 1px, transparent 1px)`,
              backgroundSize: `28px 28px`,
              maskImage: `radial-gradient(ellipse 70% 60% at 50% 50%, black 25%, transparent 80%)`,
              WebkitMaskImage: `radial-gradient(ellipse 70% 60% at 50% 50%, black 25%, transparent 80%)`,
            }}
          />

          {/* 5. Grounded Horizon Pedestal Light Beam below the cards */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[85%] max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent blur-[1px]" />
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[60%] max-w-2xl h-[2px] bg-gradient-to-r from-transparent via-violet-400/50 to-transparent blur-[2px]" />
        </div>

        {/* ================= 3D STACKED CAROUSEL STAGE ================= */}
        <div className="relative w-full max-w-6xl h-[560px] sm:h-[600px] flex items-center justify-center z-10">
          {virtualItems.map((product, vIdx) => {
            const offset = vIdx - virtualIndex;
            const absOffset = Math.abs(offset);

            // Outside the 5 active deck slots + 1 buffer slot: completely hide to save GPU cycles
            if (absOffset > 3) {
              return null;
            }

            // Geometry calculations matching reference layout exactly (Upright, zero tilt, clean stepped offsets)
            let translateX = "0%";
            let scale = 1;
            let zIndex = 30;
            let opacity = 1;
            let shadowClass = "shadow-2xl";

            if (offset === 0) {
              scale = 1.04;
              zIndex = 30;
              opacity = 1;
              translateX = "0%";
              shadowClass = "shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(124,58,237,0.35)]";
            } else if (offset === -1) {
              scale = 0.88;
              zIndex = 20;
              opacity = 0.92;
              translateX = "-62%";
              shadowClass = "shadow-[0_20px_45px_-10px_rgba(0,0,0,0.85),0_0_25px_rgba(124,58,237,0.18)] hover:opacity-100";
            } else if (offset === 1) {
              scale = 0.88;
              zIndex = 20;
              opacity = 0.92;
              translateX = "62%";
              shadowClass = "shadow-[0_20px_45px_-10px_rgba(0,0,0,0.85),0_0_25px_rgba(124,58,237,0.18)] hover:opacity-100";
            } else if (offset === -2) {
              scale = 0.76;
              zIndex = 10;
              opacity = 0.75;
              translateX = "-118%";
              shadowClass = "shadow-[0_15px_30px_-10px_rgba(0,0,0,0.7),0_0_15px_rgba(124,58,237,0.12)] hover:opacity-90";
            } else if (offset === 2) {
              scale = 0.76;
              zIndex = 10;
              opacity = 0.75;
              translateX = "118%";
              shadowClass = "shadow-[0_15px_30px_-10px_rgba(0,0,0,0.7),0_0_15px_rgba(124,58,237,0.12)] hover:opacity-90";
            } else if (offset === -3) {
              // Smooth exit/entry buffer left
              scale = 0.65;
              zIndex = 0;
              opacity = 0;
              translateX = "-165%";
            } else if (offset === 3) {
              // Smooth exit/entry buffer right
              scale = 0.65;
              zIndex = 0;
              opacity = 0;
              translateX = "165%";
            }

            return (
              <div
                key={`virtual-${vIdx}-${product._id?.toString() || product.slug}`}
                onClickCapture={(e) => {
                  if (offset !== 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    goToOffset(offset);
                  }
                }}
                onClick={(e) => {
                  if (offset !== 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    goToOffset(offset);
                  }
                }}
                style={{
                  transform: `translateX(${translateX}) scale(${scale})`,
                  zIndex,
                  opacity,
                  transition: isTransitioning
                    ? "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease, box-shadow 500ms ease"
                    : "none",
                }}
                className={`absolute cursor-pointer w-[280px] sm:w-[320px] md:w-[335px] rounded-[28px] sm:rounded-[32px] ${shadowClass} ${
                  offset !== 0 ? "[&_a]:pointer-events-none [&_button]:pointer-events-none" : ""
                }`}
              >
                <ProductCard
                  product={product}
                  viewMode="grid"
                  isFeaturedDeck={offset === 0}
                />
              </div>
            );
          })}
        </div>

        {/* ================= CONTROLS ROW ================= */}
        <div className="flex items-center gap-4 sm:gap-5 mt-4 z-40">
          <button
            onClick={prevSlide}
            className="w-11 h-11 rounded-full bg-[#150f2e]/90 hover:bg-primary text-white border border-purple-500/30 flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 group"
            title="Previous product"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#150f2e]/70 border border-purple-500/20 backdrop-blur-md">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const targetOffset = i - normalizedActiveIndex;
                  goToOffset(targetOffset);
                }}
                className={`transition-all duration-300 rounded-full ${
                  i === normalizedActiveIndex
                    ? "w-8 h-2.5 bg-gradient-to-r from-purple-500 to-violet-400 shadow-md shadow-purple-500/50"
                    : "w-2.5 h-2.5 bg-purple-900/60 hover:bg-purple-600"
                }`}
                title={`Go to product ${i + 1}`}
                aria-label={`Go to product ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-11 h-11 rounded-full bg-[#150f2e]/90 hover:bg-primary text-white border border-purple-500/30 flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 group"
            title="Next product"
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Continuous Cycle Play/Pause Button */}
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-[#150f2e]/80 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-primary flex items-center justify-center transition-all shadow-md ml-1"
            title={isPaused ? "Resume continuous rotation" : "Pause rotation"}
            aria-label={isPaused ? "Resume continuous rotation" : "Pause rotation"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 ml-0.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    );
  }

  // 2. Standard Grid & List Views
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}
