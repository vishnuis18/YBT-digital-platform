"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { formatPrice, formatDate } from "@/lib/utils";
import { IOrder } from "@/types";
import {
  FileText,
  Download,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function UserOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch("/api/orders")
        .then((res) => {
          if (!res.ok) return { orders: [] };
          return res.json();
        })
        .then((data) => {
          setOrders(data.orders || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-16 text-center text-slate-500">Loading your orders...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Authentication Required</h2>
        <p className="text-sm text-slate-500 mt-2">Please sign in to view your purchased orders and invoices.</p>
        <Link href="/login?redirect=/orders" className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Order History & Invoices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your past transactions, print receipts, and access your digital assets.
          </p>
        </div>
        <Link
          href="/downloads"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors self-start"
        >
          <Download className="w-4 h-4" />
          <span>Go to My Downloads</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No orders found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            You have not placed any orders yet. Browse our catalog to purchase digital templates.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* Order Header Bar */}
              <div className="p-4 sm:p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-slate-400 block">Order Number</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date Placed</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Amount</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <a
                  href={`/api/invoices/${order._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Invoice ({order.invoiceNumber})</span>
                </a>
              </div>

              {/* Items List */}
              <div className="p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Digital Asset • File: {item.fileName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatPrice(item.price)}
                      </span>
                      <Link
                        href="/downloads"
                        className="px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
