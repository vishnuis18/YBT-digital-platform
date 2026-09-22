"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, Search, Shield, LifeBuoy, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/AuthProvider";

export function MobileAppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="md:hidden sticky top-0 z-30 w-full bg-white/60 dark:bg-[#070510]/55 backdrop-blur-md border-b border-slate-200/80 dark:border-[#22183c] px-4 py-3 flex items-center justify-between transition-colors">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#6432a3] flex items-center justify-center text-white shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-white">
          <span className="text-[#9d7cf4] dark:text-[#b49bfa] font-bold">YBT</span> Digital
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-2 rounded-xl text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-[#16112d] border border-slate-200/60 dark:border-[#2b1f48] focus:outline-none"
          aria-label="Toggle Menu"
        >
          {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-white/95 dark:bg-[#0c081e]/95 backdrop-blur-md p-6 flex flex-col justify-between animate-in fade-in-50">
          <div className="space-y-4">
            <Link
              href="/products"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#15102c] font-semibold text-slate-900 dark:text-white"
            >
              <Search className="w-5 h-5 text-primary" />
              Search & Browse Catalog
            </Link>
            <Link
              href="/faq"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#15102c] font-semibold text-slate-900 dark:text-white"
            >
              <FileText className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </Link>
            <Link
              href="/contact"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#15102c] font-semibold text-slate-900 dark:text-white"
            >
              <LifeBuoy className="w-5 h-5 text-primary" />
              Customer Support
            </Link>

            {user && (user.role === "SUPER_ADMIN" || user.role === "EDITOR") && (
              <Link
                href="/admin/dashboard"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-primary/10 font-bold text-primary"
              >
                <Shield className="w-5 h-5" />
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                }}
                className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-sm font-semibold"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setDrawerOpen(false)}
                  className="py-3 rounded-xl bg-primary text-white text-center text-sm font-semibold shadow-md shadow-primary/30"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
