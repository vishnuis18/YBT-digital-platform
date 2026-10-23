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
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-purple-600/15 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-4 backdrop-blur-md shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span>Knowledge & Help Center</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Frequently Asked <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">Questions</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto mt-2.5 leading-relaxed">
          Everything you need to know about our digital templates, licenses, payment gateways, and download tokens.
        </p>
      </div>

      <div className="relative z-10 space-y-4">
        {faqs.map((faq, idx) => (
          <details
            key={faq._id}
            className="group p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#120c2b]/95 via-[#0e0824]/95 to-[#0a061c]/95 border border-purple-500/20 hover:border-purple-500/50 open:border-purple-500/60 open:bg-[#150e32]/95 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-purple-950/40 transition-all duration-300 overflow-hidden"
          >
            <summary className="font-heading font-semibold text-sm sm:text-base text-slate-100 group-hover:text-white cursor-pointer list-none flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-300 text-xs font-bold flex items-center justify-center flex-shrink-0 border border-purple-500/20 group-open:bg-primary group-open:text-white transition-colors">
                  {idx < 9 ? `0${idx + 1}` : idx + 1}
                </span>
                <span>{faq.question}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500/10 group-open:bg-primary text-purple-300 group-open:text-white border border-purple-500/25 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-open:rotate-90 shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </div>
            </summary>
            <div className="mt-4 pt-4 border-t border-purple-500/15 pl-10 pr-2">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      {/* Still need help banner */}
      <div className="relative z-10 mt-14 p-8 sm:p-10 rounded-[32px] bg-gradient-to-b from-[#130d2e] to-[#0a061c] border border-purple-500/25 text-center space-y-3.5 shadow-2xl shadow-purple-950/40">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
          Still have questions?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          Can't find the answer you're looking for? Our friendly engineering and customer support team is here to assist.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-[#6432a3] to-purple-600 hover:from-[#753cb8] hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all hover:scale-105 mt-2"
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Contact Support</span>
        </Link>
      </div>
    </div>
  );
}
