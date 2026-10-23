"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters, ViewMode } from "@/components/products/ProductFilters";
import { ICategory, IProduct } from "@/types";
import { SAMPLE_CATEGORIES } from "@/lib/mock-data";
import { Search, Sparkles, SlidersHorizontal, X } from "lucide-react";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "popularity";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>(SAMPLE_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("deck");
  const [searchInput, setSearchInput] = useState(searchParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);


  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categoryParam && categoryParam !== "all") params.set("category", categoryParam);
        if (searchParam) params.set("search", searchParam);
        if (sortParam) params.set("sortBy", sortParam);
        if (minPriceParam) params.set("minPrice", minPriceParam);
        if (maxPriceParam) params.set("maxPrice", maxPriceParam);
        params.set("limit", "24");

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryParam, searchParam, sortParam, minPriceParam, maxPriceParam]);

  const updateFilters = (newParams: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === "" || val === "all") {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });
    router.push(`/products?${current.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handlePriceApply = () => {
    updateFilters({ minPrice, maxPrice });
    setShowMobileFilterModal(false);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/products");
    setShowMobileFilterModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 md:pb-24">
      {/* Header Banner */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181232]/80 border border-purple-500/30 text-purple-200 text-xs font-medium mb-3 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Curated Catalog</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Explore <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">Digital Products</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
          Browse verified SaaS boilerplates, Figma systems, flutter apps, and APIs built by expert creators.
        </p>
      </div>

      {/* Search and Price Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/80 pointer-events-none" />
          <input
            type="text"
            placeholder="Search keywords, technologies (e.g. Next.js, Figma, Flutter)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-24 py-3 text-xs sm:text-sm rounded-2xl bg-white dark:bg-[#120c2b]/80 border border-slate-200/80 dark:border-purple-500/25 hover:dark:border-purple-500/40 focus:dark:border-purple-400/70 focus:dark:bg-[#160e34] text-slate-900 dark:text-zinc-100 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6432a3] to-purple-600 hover:from-[#753cb8] hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/40 transition-all hover:scale-[1.02]"
          >
            Search
          </button>
        </form>

        {/* Desktop Price Inputs */}
        <div className="hidden md:flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-white dark:bg-[#120c2b]/80 border border-slate-200/80 dark:border-purple-500/25 shadow-sm">
          <span className="text-xs text-purple-300 font-medium whitespace-nowrap">Price ($):</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-20 px-2.5 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-[#181136] border border-slate-200/60 dark:border-purple-500/20 text-slate-900 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-purple-400/50"
          />
          <span className="text-xs text-purple-400/50">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20 px-2.5 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-[#181136] border border-slate-200/60 dark:border-purple-500/20 text-slate-900 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-purple-400/50"
          />
          <button
            onClick={handlePriceApply}
            className="px-3.5 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Category Pills & Sorting Bar */}
      <ProductFilters
        categories={categories}
        activeCategory={categoryParam}
        onCategoryChange={(slug) => updateFilters({ category: slug })}
        activeSort={sortParam}
        onSortChange={(sort) => updateFilters({ sort })}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalProducts={products.length}
      />

      {/* Product Grid / List */}
      <ProductGrid products={products} viewMode={viewMode} loading={loading} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
