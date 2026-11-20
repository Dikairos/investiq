import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import FinancialAssistant from "@/components/financial-assistant";
import { companies } from "@/data/companies";

function AssistantLoading() {
  return (
    <div
      aria-label="Loading assistant"
      aria-busy="true"
      className="h-[34rem] animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
    />
  );
}

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-2xl font-bold text-emerald-400"
          aria-label="InvestIQ home"
        >
          InvestIQ
        </Link>
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-emerald-400"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Companies
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-6 sm:pt-10">
        <div className="mb-8 flex items-start gap-4">
          <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
            <Sparkles aria-hidden="true" size={22} />
          </span>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              InvestIQ assistant
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Understand the numbers.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Ask questions in plain language and explore company context one
              step at a time.
            </p>
          </div>
        </div>

        <Suspense fallback={<AssistantLoading />}>
          <FinancialAssistant companies={companies} />
        </Suspense>
      </section>
    </main>
  );
}
