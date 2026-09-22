"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please agree to the Terms & Conditions to continue");
      return;
    }

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    if (!fullName || fullName.length < 2) {
      setError("Please enter your name (at least 2 characters)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      login(data.user);
      router.push("/");
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
            tagline="Join thousands of developers, designers, and creators building with YBT Digital."
          />
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex flex-col justify-center px-4 py-4 sm:px-8 sm:py-6 md:px-6 md:py-8 lg:px-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Create an account
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/60 mt-1.5 font-normal">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-400 hover:text-primary-300 font-semibold underline underline-offset-4 decoration-primary-500/40 hover:decoration-primary-300 transition-all"
              >
                Log in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300 flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5">
            {/* Name Fields (First and Last name) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClasses}
              />
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={`${inputClasses} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-300/50 hover:text-white transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-purple-200/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-purple-500/40 bg-[#16102e] text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary-400 hover:text-primary-300 underline underline-offset-2">
                    Terms &amp; Conditions
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-[0_4px_25px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_30px_rgba(124,58,237,0.55)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create account</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-500/20" />
            </div>
            <span className="relative px-3 text-xs text-purple-300/50 bg-[#0d091f] dark:bg-[#0b081c]">
              Or register with
            </span>
          </div>

          {/* Social Logins */}
          <SocialAuthButtons />
        </div>
      </div>
    </div>
  );
}
