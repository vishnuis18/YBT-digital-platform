"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { formatDate, formatBytes } from "@/lib/utils";
import { IDownload } from "@/types";
import {
  Download,
  FileCode,
  ShieldCheck,
  Clock,
  CheckCircle2,
  PackageOpen,
  ArrowRight,
} from "lucide-react";

export default function UserDownloadsPage() {
  const { user, loading: authLoading } = useAuth();
  const [downloads, setDownloads] = useState<IDownload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch("/api/downloads")
        .then((res) => {
          if (!res.ok) return { downloads: [] };
          return res.json();
        })
        .then((data) => {
          setDownloads(data.downloads || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-16 text-center text-slate-500">Loading your digital assets...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Authentication Required</h2>
        <p className="text-sm text-slate-500 mt-2">Please sign in to access your purchased downloads library.</p>
        <Link href="/login?redirect=/downloads" className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
          My Digital Downloads
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Access and re-download all your purchased source code templates, kits, and software guides.
        </p>
      </div>

      {downloads.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No digital downloads available yet
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Once you purchase a product, your secure download tokens and files will appear here instantly.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/25 hover:bg-primary-600 transition-colors"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {downloads.map((item) => {
            const product = typeof item.productId === "object" ? item.productId : null;
            const title = product?.title || "Digital Asset";
            const fileName = product?.fileName || "Product-Source.zip";
            const fileSize = product?.fileSize || 15000000;
            const thumbnailUrl = product?.thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800";
            const downloadUrl = `/api/downloads/${item.token}`;

            return (
              <div
                key={item._id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                    <Image
                      src={thumbnailUrl}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      File: <span className="font-semibold text-slate-700 dark:text-slate-300">{fileName}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>Size: {formatBytes(fileSize)}</span>
                      <span>•</span>
                      <span>Downloaded: {item.downloadCount} / {item.maxDownloads} times</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    {item.expiresAt ? (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> Valid until: {formatDate(item.expiresAt)}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-500 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Lifetime Access
                      </span>
                    )}
                  </div>

                  <a
                    href={downloadUrl}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-primary/25 transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
