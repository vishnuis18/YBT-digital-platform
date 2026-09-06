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
    <div className="md:hidden sticky top-0 z-30 w-full glass border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-white">
          YBT <span className="text-primary font-bold">Digital</span>
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 flex flex-col justify-between animate-in fade-in-50">
          <div className="space-y-4">
            <Link
              href="/products"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white"
            >
              <Search className="w-5 h-5 text-primary" />
              Search & Browse Catalog
            </Link>
            <Link
              href="/faq"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white"
            >
              <FileText className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </Link>
            <Link
              href="/contact"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white"
            >
              <LifeBuoy className="w-5 h-5 text-primary" />
              Customer Support
            </Link>

            {user && (user.role === "SUPER_ADMIN" || user.role === "EDITOR") && (
              <Link
                href="/admin/dashboard"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 font-bold text-indigo-600 dark:text-indigo-400"
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
