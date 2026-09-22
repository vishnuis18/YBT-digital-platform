import React from "react";

export function TrustedClients() {
  return (
    <div className="mt-10 sm:mt-14 max-w-5xl mx-auto w-full">
      <p className="text-center text-xs sm:text-sm font-medium text-zinc-300/80 mb-5 tracking-wide">
        Our Trusted Clients
      </p>

      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-14 opacity-90">
        {/* 1. CALGARY FOOD BANK */}
        <div className="flex items-center gap-2 text-white">
          <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 40 40" fill="none">
            <path
              d="M10 22C10 28 14.5 32 20 32C25.5 32 30 28 30 22H10Z"
              fill="white"
            />
            <path
              d="M20 8C17 11 17 15 20 18C23 15 23 11 20 8Z"
              fill="white"
            />
            <path
              d="M14 10C12 12.5 13 16 16 18C15 15 15 12 14 10Z"
              fill="white"
            />
            <path
              d="M26 10C28 12.5 27 16 24 18C25 15 25 12 26 10Z"
              fill="white"
            />
          </svg>
          <div className="leading-tight text-left">
            <div className="text-[11px] font-black tracking-wider uppercase">CALGARY</div>
            <div className="text-[10px] font-bold tracking-tight">FOOD BANK</div>
          </div>
        </div>

        {/* 2. SAIT */}
        <div className="flex items-center gap-2 text-white">
          <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="6" stroke="white" strokeWidth="2.5" />
            <ellipse cx="18" cy="18" rx="14" ry="5.5" stroke="white" strokeWidth="2" transform="rotate(-30 18 18)" />
            <ellipse cx="18" cy="18" rx="14" ry="5.5" stroke="white" strokeWidth="2" transform="rotate(30 18 18)" />
            <ellipse cx="18" cy="18" rx="14" ry="5.5" stroke="white" strokeWidth="2" transform="rotate(90 18 18)" />
          </svg>
          <span className="text-xl font-black tracking-wider text-white">SAIT</span>
        </div>

        {/* 3. rimes */}
        <div className="flex items-center text-white">
          <span className="text-2xl font-black lowercase tracking-tighter text-white">
            rimes
          </span>
        </div>

        {/* 4. Nationwide */}
        <div className="flex items-center gap-2 text-white">
          <svg className="w-6 h-7 flex-shrink-0" viewBox="0 0 24 28" fill="none">
            <rect x="2" y="2" width="20" height="24" rx="2" stroke="white" strokeWidth="2.2" />
            <path d="M7 20L12 8L17 20L14 20L12 15L10 20Z" fill="white" />
          </svg>
          <span className="text-base font-bold tracking-tight text-white flex items-center">
            Nationwide<span className="text-[9px] align-super ml-0.5 font-normal">®</span>
          </span>
        </div>

        {/* 5. AIMCo */}
        <div className="flex items-center gap-1.5 text-white">
          <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="11" stroke="white" strokeWidth="3" strokeDasharray="50 15" strokeLinecap="round" />
            <path d="M14 6L14 14L20 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="text-lg font-bold tracking-tight text-white">AIMCo</span>
        </div>

        {/* 6. COGNA_RANDOM */}
        <div className="flex items-center text-white">
          <span className="text-sm font-black tracking-widest uppercase text-white/95 font-mono">
            COGNA_RANDOM
          </span>
        </div>
      </div>
    </div>
  );
}
