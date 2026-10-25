"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount, setIsOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    if (!userDropdown) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdown(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userDropdown]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Products", href: "/products" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#070512]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-purple-900/20 shadow-sm shadow-purple-900/5 dark:shadow-purple-950/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7a3cdb] via-[#6432a3] to-[#482082] border border-purple-400/30 flex items-center justify-center text-white shadow-md shadow-purple-900/40 group-hover:scale-105 group-hover:shadow-purple-700/50 transition-all">
            <Sparkles className="w-4 h-4 text-purple-100" />
          </div>
          <div className="flex items-center font-heading">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              YBT
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight ml-1">
              Digital
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 outline-none ${
                  isActive
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-200 border border-purple-200/80 dark:border-purple-500/30 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center relative max-w-xs w-full"
        >
          <Search className="w-3.5 h-3.5 absolute left-3.5 text-slate-400 dark:text-purple-400/80 pointer-events-none" />
          <input
            type="text"
            placeholder="Search templates, kits, APIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-11 py-2 text-xs rounded-xl bg-slate-100 dark:bg-[#120c2b]/80 border border-slate-200 dark:border-purple-500/20 hover:border-purple-300 dark:hover:border-purple-500/35 focus:border-purple-500 dark:focus:border-purple-400/60 focus:bg-white dark:focus:bg-[#160f35] text-slate-900 dark:text-zinc-100 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 backdrop-blur-sm"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-purple-950/60 border border-slate-300/60 dark:border-purple-500/25 text-[10px] font-mono text-slate-600 dark:text-purple-300">
            <span>⌘K</span>
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Cart Icon */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 rounded-xl text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#140e2d] dark:hover:bg-[#1d143f] border border-slate-200/80 dark:border-purple-500/25 hover:border-purple-500/40 transition-all shadow-sm"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-300/90" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-purple-900/50 animate-pulse">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Auth or Dropdown */}
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-[#140e2d] hover:bg-slate-200 dark:hover:bg-[#1d143f] border border-slate-200/80 dark:border-purple-500/25 hover:border-purple-500/40 transition-all text-xs font-semibold text-slate-800 dark:text-zinc-200 shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-purple-950/40">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block max-w-[110px] truncate text-slate-800 dark:text-slate-200">
                  {user.name}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 dark:text-purple-300/70 transition-transform duration-200 ${
                    userDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white dark:bg-[#0f0924] shadow-2xl shadow-purple-950/20 dark:shadow-purple-950/60 border border-slate-200 dark:border-purple-500/25 py-2 z-50 backdrop-blur-xl animate-in fade-in-50 zoom-in-95 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-purple-500/15 bg-purple-50/60 dark:bg-purple-950/20">
                      <p className="text-[10px] uppercase font-semibold tracking-wider text-purple-600 dark:text-purple-300">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    {(user.role === "SUPER_ADMIN" || user.role === "EDITOR") && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-purple-50/60 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4 text-purple-600 dark:text-purple-400/80" />
                      My Profile
                    </Link>

                    <Link
                      href="/downloads"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-purple-50/60 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4 text-purple-600 dark:text-purple-400/80" />
                      My Downloads
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-purple-50/60 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-white transition-colors"
                    >
                      <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400/80" />
                      Order History & Invoices
                    </Link>

                    <Link
                      href="/support"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-purple-50/60 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-white transition-colors"
                    >
                      <LifeBuoy className="w-4 h-4 text-purple-600 dark:text-purple-400/80" />
                      Support Center
                    </Link>

                    <div className="border-t border-slate-100 dark:border-purple-500/15 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] rounded-xl transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-900/30 transition-all hover:scale-[1.02]"
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
