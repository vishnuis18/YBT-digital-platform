"use client";

import React, { useEffect, useState } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import { IOrder } from "@/types";
import {
  ShoppingBag,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingRefundId, setProcessingRefundId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders?status=${statusFilter}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleRefund = async (orderId: string) => {
    const reason = prompt("Please enter the reason for this refund:", "Customer request / Satisfied policy");
    if (!reason) return;

    setProcessingRefundId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process refund");
      alert("Refund processed successfully!");
      await fetchOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingRefundId(null);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-500">Loading order records...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Orders & Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor customer purchases, verify transaction IDs, issue invoices, and manage refunds.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid Only</option>
            <option value="pending">Pending Only</option>
            <option value="refunded">Refunded Only</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-4 font-semibold">Order / Invoice</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Gateway & Txn</th>
                <th className="p-4 font-semibold">Total Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {order.orderNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {order.invoiceNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {order.customerEmail}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {order.items.length} product(s)
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                      {order.items[0]?.title}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {order.paymentGateway}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-1 truncate max-w-[120px]">
                      {order.transactionId || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 font-black text-slate-900 dark:text-white text-sm">
                    {formatPrice(order.totalAmount)}
                    {order.taxAmount > 0 && (
                      <span className="text-[10px] font-normal text-slate-400 block">
                        incl. {formatPrice(order.taxAmount)} tax
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : order.paymentStatus === "refunded"
                          ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <a
                      href={`/api/invoices/${order._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition-colors"
                      title="View Invoice"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </a>

                    {order.paymentStatus === "paid" && (
                      <button
                        onClick={() => handleRefund(order._id)}
                        disabled={processingRefundId === order._id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 transition-colors"
                        title="Issue Refund"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Refund</span>
                      </button>
                    )}
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
