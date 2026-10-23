import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, DownloadCloud } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative w-full bg-[#070510] text-zinc-400 border-t border-purple-900/20 pt-16 pb-24 md:pb-12 mt-20 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-purple-900/20 text-zinc-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Instant Delivery</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Receive download links and access directly in your dashboard right after checkout.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Verified & Secure</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                All templates, API engines, and software packages are audited for quality and security.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Lifetime Updates</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Re-download future updates and new releases anytime at no extra fee.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Brand & Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="sm:col-span-2 lg:col-span-2 pr-0 lg:pr-8">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6432a3] to-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                YBT Digital
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              The premier digital product marketplace for modern web developers, SaaS founders, and UI designers.
            </p>
          </div>

          {/* Column: Digital Products */}
          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Digital Products
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/products?category=full-stack-templates" className="text-zinc-400 hover:text-white transition-colors">
                  Full Stack Boilerplates
                </Link>
              </li>
              <li>
                <Link href="/products?category=ui-ux-design-systems" className="text-zinc-400 hover:text-white transition-colors">
                  UI & Design Systems
                </Link>
              </li>
              <li>
                <Link href="/products?category=mobile-app-kits" className="text-zinc-400 hover:text-white transition-colors">
                  Mobile App Kits
                </Link>
              </li>
              <li>
                <Link href="/products?category=apis-microservices" className="text-zinc-400 hover:text-white transition-colors">
                  APIs & Microservices
                </Link>
              </li>
              <li>
                <Link href="/products?category=ai-prompts-guides" className="text-zinc-400 hover:text-white transition-colors">
                  AI Prompts & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Customer Center */}
          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Customer Center
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/profile" className="text-zinc-400 hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-zinc-400 hover:text-white transition-colors">
                  Order History & Invoices
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-zinc-400 hover:text-white transition-colors">
                  My Downloads
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-zinc-400 hover:text-white transition-colors">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-400 hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Administration */}
          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Administration
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/admin/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Admin Portal Login
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Copyright & Info Bar */}
        <div className="pt-8 pb-4 border-t border-purple-900/20 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 YBT Digital. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-zinc-400">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>

        {/* 4. Giant Brand Display Watermark */}
        <div className="relative pt-6 sm:pt-8 md:pt-10 overflow-hidden select-none pointer-events-none">
          <h2 className="text-[12.5vw] sm:text-[13vw] md:text-[12vw] lg:text-[11vw] font-black tracking-tighter uppercase leading-[0.8] text-center w-full bg-gradient-to-b from-[#c084fc] via-[#7c3aed]/40 to-transparent bg-clip-text text-transparent">
            YBT DIGITAL
          </h2>
        </div>
      </div>
    </footer>
  );
}
