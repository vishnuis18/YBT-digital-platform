"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Explore Digital Products
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
          Browse verified SaaS boilerplates, Figma systems, flutter apps, and APIs built by expert creators.
        </p>
      </div>

      {/* Search and Price Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords, technologies (e.g. Next.js, Figma, Flutter)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-24 py-3 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-600 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Desktop Price Inputs */}
        <div className="hidden md:flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 pl-2 font-medium">Price ($):</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-20 px-2.5 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none"
          />
          <span className="text-xs text-slate-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20 px-2.5 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none"
          />
          <button
            onClick={handlePriceApply}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-xs font-semibold transition-colors"
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
