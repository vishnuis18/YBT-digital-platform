import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, DownloadCloud, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-24 md:pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800 text-slate-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Instant Delivery</h4>
              <p className="text-xs text-slate-400 mt-1">
                Receive download links and access directly in your dashboard right after checkout.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Verified & Secure</h4>
              <p className="text-xs text-slate-400 mt-1">
                All templates, API engines, and software packages are audited for quality and security.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Lifetime Updates</h4>
              <p className="text-xs text-slate-400 mt-1">
                Re-download future updates and new releases anytime at no extra fee.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                YBT Digital
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              The premier digital product marketplace for modern web developers, SaaS founders, and UI designers.
            </p>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Digital Products
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=full-stack-templates" className="hover:text-white transition-colors">
                  Full Stack Boilerplates
                </Link>
              </li>
              <li>
                <Link href="/products?category=ui-ux-design-systems" className="hover:text-white transition-colors">
                  UI & Design Systems
                </Link>
              </li>
              <li>
                <Link href="/products?category=mobile-app-kits" className="hover:text-white transition-colors">
                  Mobile App Kits
                </Link>
              </li>
              <li>
                <Link href="/products?category=apis-microservices" className="hover:text-white transition-colors">
                  APIs & Microservices
                </Link>
              </li>
              <li>
                <Link href="/products?category=ai-prompts-guides" className="hover:text-white transition-colors">
                  AI Prompts & Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Customer Center
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Order History & Invoices
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-white transition-colors">
                  My Downloads
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Administration
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin/login" className="hover:text-indigo-400 transition-colors">
                  Admin Portal Login
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 YBT Digital. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
