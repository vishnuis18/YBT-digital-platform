"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface AuthVisualPanelProps {
  title?: string;
  tagline?: string;
}

export function AuthVisualPanel({
  title = "Capturing Moments,\nCreating Memories",
  tagline = "Access world-class digital assets, production templates & developer tools.",
}: AuthVisualPanelProps) {
  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[620px] rounded-[22px] overflow-hidden flex flex-col justify-between p-6 sm:p-8 text-white select-none border border-white/10 shadow-inner">
      {/* Background Image */}
      <Image
        src="/auth-bg.jpg"
        alt="Cosmic dunes night aesthetic"
        fill
        priority
        className="object-cover object-center scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Atmospheric Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070510]/95 via-purple-950/20 to-[#070510]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-purple-900/15 mix-blend-color-dodge pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary-600/90 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg shadow-primary-900/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-black text-xl tracking-wider text-white drop-shadow-md">
            YBT
          </span>
        </Link>

        {/* Back to website pill button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-medium text-white/90 transition-all border border-white/15 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Back to website</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-10 mt-auto pt-16">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white leading-tight tracking-tight whitespace-pre-line drop-shadow-md">
          {title}
        </h2>
        {tagline && (
          <p className="text-xs text-purple-200/80 mt-2.5 max-w-xs leading-relaxed font-normal">
            {tagline}
          </p>
        )}

        {/* Carousel / Progress indicators */}
        <div className="flex items-center gap-2 mt-6">
          <span className="w-8 h-1 rounded-full bg-white shadow-sm" />
          <span className="w-2.5 h-1 rounded-full bg-white/35" />
          <span className="w-2.5 h-1 rounded-full bg-white/35" />
        </div>
      </div>
    </div>
  );
}
