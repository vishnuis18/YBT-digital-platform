import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductService } from "@/services/product.service";
import { FAQService } from "@/services/faq.service";
import { ProductGrid } from "@/components/products/ProductGrid";
import { TrustedClients } from "@/components/home/TrustedClients";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Lock,
  Layers,
  ChevronRight,
  Star,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let faqs: any[] = [];

  try {
    featuredProducts = await ProductService.getFeaturedProducts(6);
  } catch (e) {
    console.warn("Featured products fetch notice:", e);
  }

  try {
    faqs = await FAQService.getPublicFAQs();
  } catch (e) {
    console.warn("FAQ fetch notice:", e);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section matching reference image */}
      <section className="relative overflow-hidden min-h-screen -mt-14 md:-mt-16 pt-20 md:pt-24 pb-8 sm:pb-12 flex flex-col justify-center border-b border-purple-900/20 bg-[#070510] text-white">
        {/* User-provided Cosmic Spotlight & Curved Horizon Background */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <Image
            src="/hero-bg.png"
            alt="Hero Glow Background"
            fill
            priority
            quality={100}
            className="object-cover object-center"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full flex flex-col items-center justify-center my-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181232]/80 border border-purple-500/30 text-purple-200 text-xs font-medium mb-4 sm:mb-5 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Next-Generation Digital Marketplace</span>
          </div>

          {/* Heading with modern bold sans font matching reference */}
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white tracking-tight max-w-5xl mx-auto leading-[1.12]">
            Supercharge Your Next Project<br className="hidden sm:inline" />{" "}
            With <span className="text-[#a78bfa] dark:text-[#bda4fd]">Premium Digital Assets</span>
          </h1>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Production-ready Next.js SaaS boilerplates, Figma design systems, full-stack templates, and APIs. Instant download with lifetime updates.
          </p>

          {/* Action CTA matching reference */}
          <div className="mt-6 flex justify-center">
            <Link
              href="/products"
              className="px-8 py-3.5 rounded-2xl bg-[#542d91] hover:bg-[#6334ad] text-white text-sm font-semibold shadow-lg shadow-purple-950/70 hover:shadow-purple-900/50 flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02]"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trusted Clients row */}
          <TrustedClients />
        </div>
      </section>

      {/* 2. Categories Highlight */}
      <section className="py-12 bg-white dark:bg-[#0a0718] border-b border-slate-200/80 dark:border-[#221a3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {[
              { name: "Full Stack Templates", slug: "full-stack-templates", icon: Code2, count: "1 Template" },
              { name: "UI Design Systems", slug: "ui-ux-design-systems", icon: Layers, count: "1 System" },
              { name: "Mobile App Kits", slug: "mobile-app-kits", icon: Zap, count: "1 App Kit" },
              { name: "APIs & Microservices", slug: "apis-microservices", icon: Lock, count: "1 Engine" },
              { name: "AI Prompts & Guides", slug: "ai-prompts-guides", icon: Sparkles, count: "1 Guide" },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#120e26] border border-slate-200/80 dark:border-[#241a3d] hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all group flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-0.5">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Releases</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Featured Digital Products
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-600 group"
          >
            <span>View all products</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} viewMode="grid" />
      </section>

      {/* 4. Testimonials Section */}
      <section className="py-16 bg-purple-50/40 dark:bg-[#0c081e] border-y border-purple-100/80 dark:border-[#22183c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Loved by 5,000+ Developers & Founders
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-2">
              See what creators and engineering teams have built with our digital products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "David Chen",
                role: "Founder at LaunchFast",
                content:
                  "The SaaS Starter Kit saved our startup at least 6 weeks of boilerplate work. Clean architecture, great authentication flow, and Stripe integration was ready in minutes.",
                rating: 5,
              },
              {
                name: "Sarah Jenkins",
                role: "Senior UI/UX Designer",
                content:
                  "The Ultimate Figma Design System is hands down the most comprehensive auto-layout library I have purchased. The variables and dark mode support are top tier.",
                rating: 5,
              },
              {
                name: "Marcus Vance",
                role: "Full Stack Engineer",
                content:
                  "Super clean Node.js and Next.js code. The tokenized download system and instant invoice generator make this store a joy to use as a customer.",
                rating: 5,
              },
            ].map((testi, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#110d26] border border-purple-100/80 dark:border-[#241a3d] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-400">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed italic">
                    "{testi.content}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-purple-50 dark:border-[#241a3d] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold flex items-center justify-center text-xs">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white">
                      {testi.name}
                    </h5>
                    <span className="text-[11px] text-slate-400">{testi.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Dynamic FAQ Section */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq._id}
              className="group p-5 rounded-2xl bg-white dark:bg-[#110d26] border border-purple-100/80 dark:border-[#241a3d] transition-colors open:border-primary/40"
            >
              <summary className="font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                <span>{faq.question}</span>
                <span className="ml-4 transition-transform group-open:rotate-90 text-primary">
                  <ChevronRight className="w-5 h-5" />
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-white dark:bg-[#110d26] border border-purple-100 dark:border-[#241a3d] p-8 sm:p-14 text-center shadow-sm relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Ready to ship your product 10x faster?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
              Join thousands of developers and designers building with YBT Digital assets today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/products"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-semibold text-sm shadow-sm transition-all hover:scale-[1.02]"
              >
                Browse All Products
              </Link>
              <Link
                href="/faq"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
