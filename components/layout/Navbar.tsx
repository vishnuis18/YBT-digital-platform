"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  ShoppingBag,
  Search,
  User,
  Shield,
  Download,
  LifeBuoy,
  LogOut,
  ChevronDown,
  Sparkles,
  Layers,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { itemCount, setIsOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdown, setUserDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/60 dark:bg-[#070510]/55 dark:border-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-[#6432a3] flex items-center justify-center text-white shadow-md shadow-purple-950/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-[#9d7cf4] dark:text-[#b49bfa]">
              YBT
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight ml-1">
              Digital
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-100 dark:text-zinc-300">
          <Link
            href="/"
            className="hover:text-primary dark:hover:text-white transition-colors outline-none focus:outline-none"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="hover:text-primary dark:hover:text-white transition-colors outline-none focus:outline-none"
          >
            Explore Products
          </Link>
          <Link
            href="/faq"
            className="hover:text-primary dark:hover:text-white transition-colors outline-none focus:outline-none"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary dark:hover:text-white transition-colors outline-none focus:outline-none"
          >
            Contact
          </Link>
        </nav>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center relative max-w-xs w-full"
        >
          <Search className="w-4 h-4 absolute left-3.5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search templates, kits, APIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-[#130f28] border border-slate-200/80 dark:border-[#2b1f48] text-slate-900 dark:text-zinc-100 focus:border-primary focus:bg-white dark:focus:bg-[#171233] focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-400"
          />
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Cart Icon */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#16112d] dark:hover:bg-[#1d163a] border border-slate-200/60 dark:border-[#2b1f48] transition-colors"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-primary/40 animate-pulse">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Auth or Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0f0b20] shadow-xl border border-slate-200 dark:border-[#241a3d] py-2 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-[#241a3d]">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user.email}
                      </p>
                    </div>

                    {(user.role === "SUPER_ADMIN" || user.role === "EDITOR") && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#181232] transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>

                    <Link
                      href="/downloads"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#181232] transition-colors"
                    >
                      <Download className="w-4 h-4 text-slate-400" />
                      My Downloads
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#181232] transition-colors"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      Order History & Invoices
                    </Link>

                    <Link
                      href="/support"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#181232] transition-colors"
                    >
                      <LifeBuoy className="w-4 h-4 text-slate-400" />
                      Support Center
                    </Link>

                    <div className="border-t border-slate-100 dark:border-[#241a3d] mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-primary dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#542d91] hover:bg-[#6334ad] text-white shadow-md shadow-purple-950/40 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
