import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Company } from "@/data/companies";

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.ticker}`}
      className="group flex h-full min-h-[190px] flex-col border border-[#E9E5EF] bg-white p-4 transition hover:border-[#CFC3E5] hover:bg-[#FDFBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6541C1]"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-[#EEE9F8] text-xs font-bold text-[#45258B]"
        >
          {company.initials}
        </div>
        <span className="border border-[#E9E5EF] px-2 py-1 text-[10px] font-semibold tracking-wide text-[#777281]">
          {company.ticker}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6541C1]">
          {company.industry}
        </p>
        <h2 className="mt-1.5 text-base font-semibold tracking-[-0.02em] text-[#201D29]">
          {company.name}
        </h2>
        <p className="mt-2 text-xs leading-5 text-[#777281]">
          {company.description}
        </p>
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold text-[#6541C1] transition group-hover:text-[#45258B]">
        View profile
        <ArrowUpRight aria-hidden="true" size={16} />
      </span>
    </Link>
  );
}
