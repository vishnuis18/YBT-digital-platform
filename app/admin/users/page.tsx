"use client";

import React, { useEffect, useState } from "react";
import { formatDate, formatPrice } from "@/lib/utils";
import { IUser, IOrder } from "@/types";
import {
  Users,
  Shield,
  Ban,
  CheckCircle2,
  Search,
  ShoppingBag,
  X,
  FileText,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Purchase history modal
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [userOrders, setUserOrders] = useState<IOrder[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleBlock = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-block`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");
      await fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openPurchaseHistory = async (u: IUser) => {
    setSelectedUser(u);
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=paid`);
      const data = await res.json();
      const userSpecific = (data.orders || []).filter(
        (o: any) => (typeof o.user === "object" ? o.user._id : o.user) === u._id
      );
      setUserOrders(userSpecific);
    } catch {
      setUserOrders([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-500">Loading user database...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Customer Accounts & Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Super Admin user control: inspect customer purchase history, manage access, and block/unblock accounts.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Registered</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {u.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-600 dark:text-slate-300 uppercase text-[10px]">
                    {u.role}
                  </td>
                  <td className="p-4 text-slate-500">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        u.isBlocked
                          ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {u.isBlocked ? "BLOCKED" : "ACTIVE"}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openPurchaseHistory(u)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Purchase History
                    </button>
                    <button
                      onClick={() => handleToggleBlock(u._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        u.isBlocked
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100"
                      }`}
                    >
                      {u.isBlocked ? "Unblock User" : "Block User"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase History Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase">Purchase History</span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {selectedUser.name} ({selectedUser.email})
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {historyLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading purchases...</div>
            ) : userOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                This customer has not completed any paid purchases yet.
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {order.orderNumber}
                      </span>
                      <span className="text-slate-400">
                        {formatDate(order.createdAt)} • {order.items.length} item(s)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 dark:text-white block">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <a
                        href={`/api/invoices/${order._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-[11px]"
                      >
                        View Invoice
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
