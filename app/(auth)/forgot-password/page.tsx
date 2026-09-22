"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process request");
      setSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#16102e] hover:bg-[#1a1338] focus:bg-[#1b143a] border border-purple-500/20 hover:border-purple-500/35 focus:border-primary-500 text-white placeholder:text-purple-300/40 focus:outline-none focus:ring-2 focus:ring-primary-500/25 transition-all";

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-background relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Split-Screen Container */}
      <div className="w-full max-w-5xl rounded-[26px] sm:rounded-[32px] bg-[#0d091f]/95 dark:bg-[#0b081c]/95 border border-purple-500/20 shadow-[0_25px_80px_-15px_rgba(109,40,217,0.35)] backdrop-blur-xl p-3 sm:p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-6 items-stretch relative z-10">
        {/* Left Visual Panel */}
        <div className="w-full md:w-[46%] lg:w-[44%] shrink-0">
          <AuthVisualPanel
            title={"Capturing Moments,\nCreating Memories"}
            tagline="Seamless account recovery for your digital assets, downloads, and orders."
          />
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-8 md:px-6 md:py-10 lg:px-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/60 mt-1.5 font-normal">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-primary-400 hover:text-primary-300 font-semibold underline underline-offset-4 decoration-primary-500/40 hover:decoration-primary-300 transition-all"
              >
                Back to sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-emerald-200">Reset instructions generated!</p>
                  <p className="text-emerald-300/80">{success.message}</p>
                </div>
              </div>

              {success.resetUrl && (
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-2">
                  <span className="font-bold text-primary-300 block">Demo Reset Link:</span>
                  <Link
                    href={success.resetUrl}
                    className="text-primary-400 hover:text-primary-300 underline break-all font-mono text-[11px]"
                  >
                    Click here to complete password reset
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="inline-block w-full py-3.5 rounded-xl bg-[#16102e] hover:bg-[#1f1642] border border-purple-500/25 text-center text-xs font-semibold text-white transition-all"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter your registered e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClasses}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-[0_4px_25px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_30px_rgba(124,58,237,0.55)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending instructions...</span>
                  </>
                ) : (
                  <span>Send Reset Instructions</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
