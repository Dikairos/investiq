"use client";

import Link from "next/link";
import { useState } from "react";
import CompanyCard from "@/components/company-card";
import SavedCompanies from "@/components/saved-companies";
import { companies } from "@/data/companies";

export default function CompaniesPage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCompanies = companies.filter((company) =>
    [company.name, company.ticker, company.industry, company.description]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <main className="space-y-7">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="page-kicker">Company research / Nigeria</p>
          <h1 className="page-title">Explore companies</h1>
          <p className="page-description">
            Learn about the businesses behind the tickers, then explore their
            available sample financial information.
          </p>
        </div>
        <Link href="/compare" className="secondary-button self-start lg:self-auto">
          Compare companies
        </Link>
      </section>

      <SavedCompanies companies={companies} />

      <section className="surface-card p-4 sm:p-5">
        <label
          htmlFor="company-search"
          className="mb-2 block text-xs font-semibold text-[#514D59]"
        >
          Search the company directory
        </label>
        <div className="relative max-w-2xl">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#96919F]"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="m16 16 4 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
          <input
            id="company-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by company, ticker, or industry"
            className="field-control pl-10"
          />
        </div>
        <div className="mb-4 mt-6 flex items-center justify-between border-b border-[#F0EDF4] pb-3">
          <h3 className="text-sm font-semibold text-[#302C39]">
            Companies to explore
          </h3>
          <p className="text-xs tabular-nums text-[#777281]" aria-live="polite">
            {filteredCompanies.length}{" "}
            {filteredCompanies.length === 1 ? "company" : "companies"}
          </p>
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.ticker} company={company} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[#DCD6E5] px-6 py-12 text-center">
            <h3 className="text-sm font-semibold text-[#302C39]">
              No companies found
            </h3>
            <p className="mt-2 text-sm text-[#777281]">
              Try a different name, ticker, or industry.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
