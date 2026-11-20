import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CompanyComparison from "@/components/company-comparison";
import { companies } from "@/data/companies";

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
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

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:pt-10">
        <div className="mb-9 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Company research
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Compare companies
          </h1>
          <p className="mt-4 leading-7 text-slate-400">
            Select companies to review their available financial and business
            information side by side. Missing metrics stay clearly marked.
          </p>
        </div>
        <CompanyComparison companies={companies} />
      </section>
    </main>
  );
}
