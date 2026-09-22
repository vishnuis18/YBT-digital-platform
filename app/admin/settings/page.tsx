"use client";

import React, { useEffect, useState } from "react";
import { IGlobalSettings } from "@/services/settings.service";
import {
  Settings,
  CreditCard,
  Percent,
  Sparkles,
  Mail,
  CheckCircle2,
  AlertCircle,
  Save,
  Shield,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<IGlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Forbidden - Super Admin only");
      setSettings(data.settings);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setSettings(data.settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-500">Loading store settings...</div>;
  }

  if (!settings) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Shield className="w-12 h-12 mx-auto text-slate-400 mb-3" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Super Admin Access Required
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {errorMessage || "Only Super Administrators can modify global payment gateway API keys and tax rates."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Store Configuration & Gateway Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure dynamic payment gateways, GST/VAT tax rules, website branding, and automated notifications.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 text-xs font-bold animate-in fade-in-50">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Payment Gateways Architecture */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Payment Gateway Integration
                </h3>
                <p className="text-xs text-slate-400">
                  Switch the active payment gateway and update live/sandbox API credentials.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Active Gateway:</span>
              <select
                value={settings.payment.activeGateway}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payment: { ...settings.payment, activeGateway: e.target.value as any },
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="demo">⚡ Demo Mode (Development & Testing)</option>
                <option value="stripe">Stripe Payments</option>
                <option value="razorpay">Razorpay Gateway</option>
                <option value="paypal">PayPal Commerce</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Razorpay */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Razorpay API Keys</h4>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Key ID</label>
                <input
                  type="text"
                  value={settings.payment.razorpay.keyId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: {
                        ...settings.payment,
                        razorpay: { ...settings.payment.razorpay, keyId: e.target.value },
                      },
                    })
                  }
                  placeholder="rzp_test_..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Key Secret</label>
                <input
                  type="password"
                  value={settings.payment.razorpay.keySecret}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: {
                        ...settings.payment,
                        razorpay: { ...settings.payment.razorpay, keySecret: e.target.value },
                      },
                    })
                  }
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Stripe */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Stripe API Keys</h4>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Publishable Key</label>
                <input
                  type="text"
                  value={settings.payment.stripe.publishableKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: {
                        ...settings.payment,
                        stripe: { ...settings.payment.stripe, publishableKey: e.target.value },
                      },
                    })
                  }
                  placeholder="pk_test_..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Secret Key</label>
                <input
                  type="password"
                  value={settings.payment.stripe.secretKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: {
                        ...settings.payment,
                        stripe: { ...settings.payment.stripe, secretKey: e.target.value },
                      },
                    })
                  }
                  placeholder="sk_test_••••"
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>

            {/* PayPal */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">PayPal Credentials</h4>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Client ID</label>
                <input
                  type="text"
                  value={settings.payment.paypal.clientId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: {
                        ...settings.payment,
                        paypal: { ...settings.payment.paypal, clientId: e.target.value },
                      },
                    })
                  }
                  placeholder="paypal_client_id..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Client Secret</label>
                <input
                  type="password"
                  value={settings.payment.paypal.clientSecret}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: {
                        ...settings.payment,
                        paypal: { ...settings.payment.paypal, clientSecret: e.target.value },
                      },
                    })
                  }
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Tax Settings */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Tax & GST/VAT Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Set store tax percentage for automated invoice calculations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tax Label
              </label>
              <input
                type="text"
                value={settings.tax.taxName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    tax: { ...settings.tax, taxName: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.tax.taxRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    tax: { ...settings.tax, taxRate: parseFloat(e.target.value) || 0 },
                  })
                }
                min="0"
                step="0.1"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="taxEnabled"
                checked={settings.tax.enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    tax: { ...settings.tax, enabled: e.target.checked },
                  })
                }
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="taxEnabled" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Enable Tax calculation on orders
              </label>
            </div>
          </div>
        </div>

        {/* 3. Branding & Store Metadata */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Website Branding & Footer
              </h3>
              <p className="text-xs text-slate-400">
                Custom store title, support email, phone, and invoice footer copy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Site Name
              </label>
              <input
                type="text"
                value={settings.branding.siteName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    branding: { ...settings.branding, siteName: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                value={settings.branding.supportEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    branding: { ...settings.branding, supportEmail: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Site Tagline
              </label>
              <input
                type="text"
                value={settings.branding.siteTagline}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    branding: { ...settings.branding, siteTagline: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Invoice & Footer Text
              </label>
              <input
                type="text"
                value={settings.branding.footerText}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    branding: { ...settings.branding, footerText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Automated Notifications */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Email Notification Automations
              </h3>
              <p className="text-xs text-slate-400">
                Trigger email receipts and notifications on customer purchase events.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email.orderConfirmation}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, orderConfirmation: e.target.checked },
                  })
                }
                className="rounded text-primary focus:ring-primary"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Send Order Confirmation & Download Links immediately after checkout
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email.failedPayment}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, failedPayment: e.target.checked },
                  })
                }
                className="rounded text-primary focus:ring-primary"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Send Failed Payment Alert if webhook returns transaction decline
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email.ticketReply}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, ticketReply: e.target.checked },
                  })
                }
                className="rounded text-primary focus:ring-primary"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Send Notification when Admin replies to customer support ticket
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-primary/25 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save All Store Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
