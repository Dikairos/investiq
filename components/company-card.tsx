import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Company } from "@/data/companies";

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.ticker}`}
      className="group flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          aria-hidden="true"
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${company.accent}`}
        >
          {company.initials}
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
          {company.ticker}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
          {company.industry}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">{company.name}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {company.description}
        </p>
      </div>

      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-emerald-400 transition group-hover:text-emerald-300">
        View company profile
        <ArrowUpRight aria-hidden="true" size={16} />
      </span>
    </Link>
  );
}
