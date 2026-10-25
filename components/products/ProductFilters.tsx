"use client";

import React from "react";
import { ICategory } from "@/types";
import { LayoutGrid, List, ArrowUpDown, Layers } from "lucide-react";

export type ViewMode = "deck" | "grid" | "list";

interface ProductFiltersProps {
  categories: ICategory[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  activeSort: string;
  onSortChange: (sort: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalProducts: number;
}

export function ProductFilters({
  categories,
  activeCategory,
  onCategoryChange,
  activeSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalProducts,
}: ProductFiltersProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Category Pills Bar (Horizontal Scrollable on mobile) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === "all"
              ? "bg-gradient-to-r from-[#6432a3] to-purple-600 text-white border border-purple-400/40 shadow-lg shadow-purple-900/40 scale-[1.02]"
              : "bg-white dark:bg-[#120c2b]/70 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/40 hover:bg-purple-50 dark:hover:bg-[#181138] hover:text-purple-700 dark:hover:text-white"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.slug
                ? "bg-gradient-to-r from-[#6432a3] to-purple-600 text-white border border-purple-400/40 shadow-lg shadow-purple-900/40 scale-[1.02]"
                : "bg-white dark:bg-[#120c2b]/70 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/40 hover:bg-purple-50 dark:hover:bg-[#181138] hover:text-purple-700 dark:hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Control Bar (Count, Sort, Deck/Grid/List toggle) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0e0924]/85 backdrop-blur-md border border-slate-200/80 dark:border-purple-500/20 shadow-lg shadow-purple-900/5 dark:shadow-purple-950/20">
        <div className="text-xs font-medium text-slate-500 dark:text-zinc-400">
          Showing <span className="font-bold text-slate-900 dark:text-purple-300">{totalProducts}</span> digital products
        </div>

        <div className="flex items-center gap-3">
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <select
              value={activeSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#181136] border border-slate-200/80 dark:border-purple-500/25 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400/60 cursor-pointer"
            >
              <option value="popularity">Most Popular</option>
              <option value="newest">Newest Releases</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* View Toggle (3D Deck, Grid, List) */}
          <div className="flex items-center bg-slate-100 dark:bg-[#181136] p-1 rounded-xl border border-slate-200/80 dark:border-purple-500/25">
            <button
              onClick={() => onViewModeChange("deck")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "deck"
                  ? "bg-white dark:bg-gradient-to-r dark:from-[#6432a3] dark:to-purple-600 text-purple-700 dark:text-white shadow-md shadow-purple-900/10 dark:shadow-purple-900/40 border border-purple-200/70 dark:border-transparent"
                  : "text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white"
              }`}
              title="3D Coverflow Deck View"
              aria-label="3D Coverflow Deck View"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gradient-to-r dark:from-[#6432a3] dark:to-purple-600 text-purple-700 dark:text-white shadow-md shadow-purple-900/10 dark:shadow-purple-900/40 border border-purple-200/70 dark:border-transparent"
                  : "text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white"
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-gradient-to-r dark:from-[#6432a3] dark:to-purple-600 text-purple-700 dark:text-white shadow-md shadow-purple-900/10 dark:shadow-purple-900/40 border border-purple-200/70 dark:border-transparent"
                  : "text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white"
              }`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
