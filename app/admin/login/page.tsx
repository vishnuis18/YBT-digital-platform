"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Shield, Mail, Lock, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to authenticate administrator");
      }

      login(data.user);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillSuperAdmin = () => {
    setEmail("admin@ybtdigital.com");
    setPassword("Admin@123");
  };

  const handleFillEditor = () => {
    setEmail("editor@ybtdigital.com");
    setPassword("Editor@123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#070510] text-slate-100">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto shadow-xl shadow-primary/30">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            YBT Digital Admin Portal
          </h1>
          <p className="text-xs text-slate-400">
            Secure administrative control panel and RBAC management.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0b20] border border-[#241a3d] shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="admin@ybtdigital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#15102c] border border-[#2b1f48] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#15102c] border border-[#2b1f48] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Admin Portal"}
            </button>
          </form>

          {/* Preset Buttons for Demo / Testing */}
          <div className="pt-4 border-t border-[#241a3d] space-y-2">
            <span className="text-[11px] text-slate-400 font-semibold block">
              Quick Role Switcher (Development):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleFillSuperAdmin}
                className="py-2 px-3 rounded-xl bg-[#1c1538] hover:bg-[#251c4a] text-xs font-bold text-slate-200 transition-colors text-left flex items-center justify-between"
              >
                <span>Super Admin</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                type="button"
                onClick={handleFillEditor}
                className="py-2 px-3 rounded-xl bg-[#1c1538] hover:bg-[#251c4a] text-xs font-bold text-slate-200 transition-colors text-left flex items-center justify-between"
              >
                <span>Content Editor</span>
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
