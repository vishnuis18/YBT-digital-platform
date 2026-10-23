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
  ChevronRight,
  Star,
  CheckCircle2,
  HelpCircle,
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

      {/* 2. Featured Products Section */}
      <section className="pt-10 sm:pt-14 pb-16 md:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181232]/80 border border-purple-500/30 text-purple-200 text-xs font-medium backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Handpicked Releases</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Featured <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">Digital Products</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              Explore handpicked SaaS boilerplates, UI systems, and backend engines crafted for high performance.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/25 hover:border-purple-400/40 text-xs font-semibold text-purple-200 hover:text-white transition-all shadow-sm self-start sm:self-end group"
          >
            <span>View all products</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 group-hover:text-purple-200 transition-transform" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} viewMode="deck" />
      </section>

      {/* 4. Testimonials Section (Matching YBT Digital cosmic theme) */}
      <section className="relative py-20 md:py-28 bg-[#070512] text-white border-y border-purple-900/25 overflow-hidden">
        {/* Ambient Cosmic Lighting */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[350px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[140px] rounded-full pointer-events-none" />

        {/* Subtle dot matrix pattern */}
        <div
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px)`,
            backgroundSize: `24px 24px`,
            maskImage: `radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)`,
            WebkitMaskImage: `radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-3.5 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Loved by <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">5,000+ Developers</span> & Founders
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 leading-relaxed">
              See what creators and engineering teams have built with our digital products.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
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
                className="group relative p-7 rounded-[28px] sm:rounded-[32px] bg-gradient-to-b from-[#130d2a]/95 via-[#0f0a22]/95 to-[#0b071a]/95 border border-purple-500/20 hover:border-purple-500/50 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-purple-950/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Ambient corner glow on hover */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-600/15 rounded-full blur-2xl group-hover:bg-purple-600/25 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Top Bar: Stars & Verified Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testi.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.35)]"
                        />
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold tracking-wide">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                    "{testi.content}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-7 pt-5 border-t border-purple-900/30 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#6432a3] to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-purple-900/40 ring-2 ring-purple-500/30 flex-shrink-0">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white tracking-tight">
                      {testi.name}
                    </h5>
                    <span className="text-xs text-purple-300/80 font-medium block mt-0.5">
                      {testi.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Dynamic FAQ Section (Matching YBT Digital cosmic theme) */}
      <section className="relative py-20 md:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
        {/* Ambient Cosmic Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-600/15 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-3.5 backdrop-blur-md shadow-sm">
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Got Questions?</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Frequently Asked <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 max-w-xl mx-auto leading-relaxed">
              Everything you need to know about our digital templates, licenses, payment gateways, and instant downloads.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <details
                key={faq._id}
                className="group p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#120c2b]/95 via-[#0e0824]/95 to-[#0a061c]/95 border border-purple-500/20 hover:border-purple-500/50 open:border-purple-500/60 open:bg-[#150e32]/95 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-purple-950/40 transition-all duration-300 overflow-hidden"
              >
                <summary className="font-heading font-semibold text-sm sm:text-base text-slate-100 group-hover:text-white cursor-pointer list-none flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-300 text-xs font-bold flex items-center justify-center flex-shrink-0 border border-purple-500/20 group-open:bg-primary group-open:text-white transition-colors">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 group-open:bg-primary text-purple-300 group-open:text-white border border-purple-500/25 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-open:rotate-90 shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </summary>
                <div className="mt-4 pt-4 border-t border-purple-500/15 pl-10 pr-2">
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner (Styled to match YBT Digital theme) */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#130d2e] via-[#0f0a26] to-[#0a061c] p-8 sm:p-14 text-center shadow-2xl shadow-purple-950/40 overflow-hidden">
          {/* Subtle Ambient Glow inside CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-48 bg-purple-600/15 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Ready to ship your product <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">10x faster?</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg mx-auto">
              Join thousands of developers and designers building with YBT Digital assets today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#6432a3] to-purple-600 hover:from-[#753cb8] hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-900/50 transition-all hover:scale-[1.02]"
              >
                Browse All Products
              </Link>
              <Link
                href="/faq"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-purple-500/25 text-white font-semibold text-sm transition-all hover:scale-[1.02]"
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
