"use client";

import React, { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  Download,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [salesReport, setSalesReport] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/admin/analytics?days=${days}`)
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data.metrics);
        setSalesReport(data.salesReport || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [days]);

  if (loading) {
    return <div className="p-16 text-center text-slate-500">Loading sales reports...</div>;
  }

  const maxRevenue = Math.max(...salesReport.map((s) => s.revenue), 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Sales & Tax Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Historical sales volume, revenue breakdown, and tax collection reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Total Period Revenue</span>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">
            {formatPrice(salesReport.reduce((sum, r) => sum + r.revenue, 0))}
          </h3>
          <span className="text-[11px] text-emerald-500 font-bold mt-1 block">
            ↑ Verified Transactions
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Total Units Sold</span>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">
            {salesReport.reduce((sum, r) => sum + r.sales, 0)} items
          </h3>
          <span className="text-[11px] text-indigo-500 font-bold mt-1 block">
            Digital Downloads
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">GST / VAT Collection</span>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">
            {formatPrice(salesReport.reduce((sum, r) => sum + r.tax, 0))}
          </h3>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Automated Tax Compliance
          </span>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Revenue Trend ({days} Days)
        </h3>

        <div className="h-64 flex items-end gap-1 sm:gap-2 pt-8 pb-2">
          {salesReport.slice(-30).map((day, idx) => {
            const heightPercent = Math.max(5, (day.revenue / maxRevenue) * 100);
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
              >
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg">
                  {day.date}: {formatPrice(day.revenue)} ({day.sales} sales)
                </div>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-400 rounded-t-md transition-all duration-200"
                />
                <span className="text-[9px] text-slate-400 mt-1 truncate max-w-[30px] hidden sm:inline-block">
                  {day.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 font-bold text-xs text-slate-500 uppercase tracking-wider">
          Daily Revenue Breakdown Log
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Sales Count</th>
                <th className="p-4 font-semibold">Gross Revenue</th>
                <th className="p-4 font-semibold">Tax Collected</th>
                <th className="p-4 font-semibold text-right">Net Store Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {salesReport.slice(-14).reverse().map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {r.date}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {r.sales} orders
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {formatPrice(r.revenue)}
                  </td>
                  <td className="p-4 text-slate-500">
                    {formatPrice(r.tax)}
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(Math.max(0, r.revenue - r.tax))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
