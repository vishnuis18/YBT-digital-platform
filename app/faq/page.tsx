import React from "react";
import Link from "next/link";
import { FAQService } from "@/services/faq.service";
import { ChevronRight, HelpCircle, LifeBuoy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  let faqs: any[] = [];
  try {
    faqs = await FAQService.getPublicFAQs();
  } catch (e) {
    console.warn("FAQ fetch notice:", e);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-primary text-xs font-bold mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge & Help Center</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2">
          Everything you need to know about our digital templates, licenses, payment gateways, and download tokens.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq._id}
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-colors open:border-primary/40 shadow-sm"
          >
            <summary className="font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
              <span>{faq.question}</span>
              <span className="ml-4 transition-transform group-open:rotate-90 text-primary flex-shrink-0">
                <ChevronRight className="w-5 h-5" />
              </span>
            </summary>
            <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-3 border-t border-slate-100 dark:border-slate-800">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      {/* Still need help banner */}
      <div className="mt-12 p-8 rounded-3xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Still have questions?
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Can't find the answer you're looking for? Our friendly engineering and customer support team is here to assist.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/25 hover:bg-primary-600 transition-colors mt-2"
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Contact Support</span>
        </Link>
      </div>
    </div>
  );
}
