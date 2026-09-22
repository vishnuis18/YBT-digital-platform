"use client";

import React, { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { ISupportTicket } from "@/types";
import {
  LifeBuoy,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTicket, setActiveTicket] = useState<ISupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/support");
      const data = await res.json();
      setTickets(data.tickets || []);
      if (activeTicket) {
        const updated = (data.tickets || []).find((t: any) => t._id === activeTicket._id);
        if (updated) setActiveTicket(updated);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyMessage.trim()) return;

    setReplying(true);
    try {
      const res = await fetch(`/api/support/${activeTicket._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setReplyMessage("");
        await fetchTickets();
      }
    } catch {
      alert("Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      await fetch(`/api/admin/support/${ticketId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchTickets();
    } catch {
      alert("Failed to update status");
    }
  };

  const filteredTickets = tickets.filter(
    (t) => statusFilter === "all" || t.status === statusFilter
  );

  if (loading) {
    return <div className="p-16 text-center text-slate-500">Loading support inbox...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Customer Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Respond to customer queries, assist with product downloads, and manage resolution statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open Only</option>
            <option value="in_progress">In Progress Only</option>
            <option value="resolved">Resolved Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tickets list (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 font-bold text-xs text-slate-500 uppercase tracking-wider">
              Inbox ({filteredTickets.length})
            </div>

            {filteredTickets.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No tickets matching active filter.
              </div>
            ) : (
              filteredTickets.map((t) => (
                <button
                  key={t._id}
                  onClick={() => setActiveTicket(t)}
                  className={`w-full text-left p-4 sm:p-5 transition-all flex flex-col justify-between ${
                    activeTicket?._id === t._id
                      ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold text-primary uppercase">
                      {t.ticketNumber} • {t.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.status === "resolved"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : t.status === "in_progress"
                          ? "bg-primary/20 text-primary dark:bg-primary/30 dark:text-purple-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {t.subject}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3">
                    <span>From: {(t.user as any)?.name || "Customer"}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {t.messages.length}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Conversation Thread & Status Controls (7 cols) */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
              {/* Header with Status Selector */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
                <div>
                  <span className="text-[11px] font-extrabold text-primary uppercase">
                    {activeTicket.ticketNumber} • {activeTicket.category} • Priority: {activeTicket.priority}
                  </span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {activeTicket.subject}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Customer: {(activeTicket.user as any)?.name} ({(activeTicket.user as any)?.email})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activeTicket.status}
                    onChange={(e) => handleUpdateStatus(activeTicket._id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {activeTicket.messages.map((msg, i) => {
                  const isAdmin = msg.senderRole === "admin";
                  return (
                    <div
                      key={i}
                      className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {msg.senderName} {isAdmin && "(Staff Response)"}
                        </span>
                        <span>•</span>
                        <span>{formatDate(msg.createdAt)}</span>
                      </div>
                      <div
                        className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          isAdmin
                            ? "bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-slate-50/50 dark:bg-slate-800/30">
                <input
                  type="text"
                  placeholder="Type an official admin response..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={replying || !replyMessage.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/25 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center h-full min-h-[400px]">
              <LifeBuoy className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-700" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">
                Select a ticket from the left to read and respond to customer questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
