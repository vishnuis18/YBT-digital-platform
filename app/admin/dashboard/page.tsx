"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  TrendingUp,
  Percent,
  Receipt,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load analytics");
        return res.json();
      })
      .then((data) => {
        setMetrics(data.metrics);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-16 text-center text-slate-500">Loading store analytics...</div>;
  }

  if (!metrics) {
    return (
      <div className="p-12 text-center text-slate-500">
        Unable to load dashboard metrics. Ensure you are signed in with an administrative account.
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(metrics.totalRevenue),
      desc: "All verified paid orders",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders,
      desc: "Digital purchases completed",
      icon: ShoppingBag,
      color: "from-purple-600 to-violet-700",
    },
    {
      title: "Registered Users",
      value: metrics.totalUsers,
      desc: "Customer accounts",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Active Products",
      value: metrics.totalProducts,
      desc: "Catalog templates & kits",
      icon: Package,
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Executive Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time store performance, revenue breakdown, and digital transactions overview.
        </p>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">
                  {card.value}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{card.desc}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-lg shadow-purple-500/10 flex-shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Metrics (Taxes, Discounts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-primary/10 dark:bg-primary/20 border border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-950 dark:text-purple-200">
                GST / VAT Tax Collected
              </span>
              <p className="text-lg font-bold text-primary dark:text-white">
                {formatPrice(metrics.totalTaxCollected)}
              </p>
            </div>
          </div>
          <Link
            href="/admin/analytics"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Reports</span> <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Total Promotional Discounts
              </span>
              <p className="text-lg font-bold text-emerald-900 dark:text-white">
                {formatPrice(metrics.totalDiscounts)}
              </p>
            </div>
          </div>
          <Link
            href="/admin/coupons"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Coupons</span> <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Tables Grid: Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent Transactions
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-primary hover:underline"
            >
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Gateway</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {metrics.recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      {order.customerName}
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-3 uppercase text-[11px] font-bold text-slate-500">
                      {order.paymentGateway}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Top Selling Products
            </h3>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-primary hover:underline"
            >
              Manage Catalog
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.topSellingProducts.map((product: any) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {product.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {product.salesCount} total sales
                  </span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatPrice(product.salePrice ?? product.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
