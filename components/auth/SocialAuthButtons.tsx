"use client";

import React, { useState } from "react";

export function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
      />
    </svg>
  );
}

export function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.96 2.77 1 .08 2.07-.52 2.69-1.27z" />
    </svg>
  );
}

interface SocialAuthButtonsProps {
  onNotice?: (provider: string) => void;
}

export function SocialAuthButtons({ onNotice }: SocialAuthButtonsProps) {
  const [internalNotice, setInternalNotice] = useState<string | null>(null);

  const handleClick = (provider: string) => {
    if (onNotice) {
      onNotice(provider);
    } else {
      setInternalNotice(`${provider} sign-in will be available soon! Please use email or demo credentials.`);
      setTimeout(() => setInternalNotice(null), 3500);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleClick("Google")}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-purple-500/25 hover:border-purple-500/50 bg-[#16102e]/80 hover:bg-[#1f1642] text-white text-xs font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-sm"
        >
          <GoogleIcon className="w-4 h-4 flex-shrink-0" />
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleClick("Apple")}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-purple-500/25 hover:border-purple-500/50 bg-[#16102e]/80 hover:bg-[#1f1642] text-white text-xs font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-sm"
        >
          <AppleIcon className="w-4 h-4 flex-shrink-0" />
          <span>Apple</span>
        </button>
      </div>

      {internalNotice && (
        <p className="text-[11px] text-center text-purple-300 bg-purple-950/40 border border-purple-500/30 rounded-lg py-1.5 px-3 animate-fade-in">
          {internalNotice}
        </p>
      )}
    </div>
  );
}
