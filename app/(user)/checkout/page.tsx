"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Download,
  FileText,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCoupon = searchParams.get("coupon") || "";

  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [paymentGateway, setPaymentGateway] = useState<"demo" | "razorpay" | "stripe" | "paypal">("demo");
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [notes, setNotes] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Validate initial coupon if passed
  useEffect(() => {
    if (initialCoupon && subtotal > 0) {
      fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: initialCoupon, subtotal }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setCouponDiscount(data.discountAmount);
            setCouponApplied(true);
          }
        });
    }
  }, [initialCoupon, subtotal]);

  // Tax and final total calculations
  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
  const taxRate = 18;
  const taxAmount = Math.round(((discountedSubtotal * taxRate) / 100) * 100) / 100;
  const totalAmount = Math.round((discountedSubtotal + taxAmount) * 100) / 100;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponDiscount(data.discountAmount);
        setCouponApplied(true);
      } else {
        setCouponDiscount(0);
        setCouponApplied(false);
        setCouponError(data.message || "Invalid coupon code");
      }
    } catch {
      setCouponError("Failed to validate coupon");
    }
  };

  const handleProcessCheckout = async () => {
    if (!user) {
      router.push(`/login?redirect=/checkout`);
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // 1. Initialize order
      const initRes = await fetch("/api/checkout/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          paymentGateway,
          couponCode: couponApplied ? couponCode : undefined,
          notes,
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok) {
        throw new Error(initData.error || "Failed to initialize checkout");
      }

      const { order, gatewayData } = initData;

      // 2. Process Verification / Gateway simulation
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          paymentGateway,
          razorpayPaymentId: paymentGateway === "razorpay" ? `rzp_pay_${Date.now()}` : undefined,
          razorpayOrderId: gatewayData.razorpayOrderId,
          razorpaySignature: "mock_rzp_sig",
          stripePaymentIntentId: paymentGateway === "stripe" ? `pi_${Date.now()}` : undefined,
          paypalOrderId: paymentGateway === "paypal" ? `PAYPAL_ORDER_${Date.now()}` : undefined,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Payment verification failed");
      }

      // 3. Clear shopping cart and display success
      clearCart();
      setCompletedOrder(verifyData.order);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) {
    return <div className="p-16 text-center text-slate-500">Preparing checkout session...</div>;
  }

  // If order was completed successfully, show post-purchase receipt & download cards
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in-50">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            Order #{completedOrder.orderNumber}
          </span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white mt-3">
            Payment Completed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2">
            Your digital product license and download tokens have been created. You can download your assets now or anytime from your dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-left">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Purchased Products:
          </h3>
          <div className="space-y-3">
            {completedOrder.items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <span className="text-xs text-slate-400">
                    File: {item.fileName}
                  </span>
                </div>
                <Link
                  href="/downloads"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/25 hover:bg-primary-600 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download File
                </Link>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={`/api/invoices/${completedOrder._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              Download Official Invoice ({completedOrder.invoiceNumber})
            </a>
            <Link
              href="/orders"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold text-center hover:bg-slate-800 transition-colors"
            >
              View in My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Your Cart is Empty</h1>
        <p className="text-sm text-slate-500 mt-2">Add digital products to your cart before proceeding to checkout.</p>
        <Link href="/products" className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete your purchase to receive instant access to your digital files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer & Payment Method (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Details Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              1. Customer Information
            </h2>

            {user ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs">
                <p className="text-slate-500">Purchasing as:</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {user.name} ({user.email})
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Download tokens and invoice receipt will be registered to this account.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                <span>You are not signed in. </span>
                <Link href={`/login?redirect=/checkout`} className="font-bold underline ml-1">
                  Click here to sign in or create an account
                </Link>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                2. Select Payment Gateway
              </h2>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Configurable by Admin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "demo",
                  title: "⚡ Demo Test Checkout",
                  desc: "Instant sandbox test without real card",
                  badge: "Recommended for Demo",
                },
                {
                  id: "stripe",
                  title: "Stripe",
                  desc: "Credit/Debit Card, Apple Pay, Google Pay",
                  badge: "Global",
                },
                {
                  id: "razorpay",
                  title: "Razorpay",
                  desc: "UPI, Netbanking, Cards & Wallets",
                  badge: "India / International",
                },
                {
                  id: "paypal",
                  title: "PayPal",
                  desc: "PayPal Balance or Connected Cards",
                  badge: "International",
                },
              ].map((gw) => (
                <label
                  key={gw.id}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentGateway === gw.id
                      ? "border-primary bg-primary/10 dark:bg-primary/20 ring-2 ring-primary/30"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <input
                      type="radio"
                      name="paymentGateway"
                      value={gw.id}
                      checked={paymentGateway === gw.id}
                      onChange={() => setPaymentGateway(gw.id as any)}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    {gw.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {gw.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                      {gw.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {gw.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Note input */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Order Notes / Reference (Optional)
              </label>
              <textarea
                placeholder="Any special instructions or tax ID reference..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Order Review
            </h2>

            {/* Products List Preview */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]">
                    {item.product.title}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatPrice(item.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Application */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. YBT20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs font-semibold uppercase rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
              {couponApplied && (
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Coupon '{couponCode}' applied!
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST / VAT ({taxRate}%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  +{formatPrice(taxAmount)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount</span>
                <span className="text-primary">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Complete Purchase Button */}
            <button
              onClick={handleProcessCheckout}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/25 hover:shadow-primary/35 transition-all disabled:opacity-50 hover:scale-[1.02]"
            >
              {isProcessing ? (
                <span>Authorizing Payment...</span>
              ) : (
                <>
                  <span>Pay {formatPrice(totalAmount)} & Download</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-400 text-center space-y-1">
              <p>🔒 256-Bit SSL Encrypted & PCI Compliant</p>
              <p>By completing purchase, you agree to the standard commercial license terms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-slate-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
