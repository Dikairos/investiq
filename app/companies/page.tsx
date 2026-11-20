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
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-2xl font-bold text-emerald-400"
          aria-label="InvestIQ home"
        >
          InvestIQ
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-3 sm:gap-5"
        >
          <Link
            href="/reports"
            className="text-xs font-semibold text-slate-300 transition hover:text-emerald-400 sm:text-sm"
          >
            Analyze report
          </Link>
          <Link
            href="/compare"
            className="text-xs font-semibold text-slate-300 transition hover:text-emerald-400 sm:text-sm"
          >
            Compare companies
          </Link>
          <Link
            href="/"
            className="hidden text-sm font-semibold text-slate-300 transition hover:text-emerald-400 sm:inline"
          >
            Home
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:pt-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Nigerian companies
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Explore companies.
            <span className="mt-2 block text-slate-400">
              Start with the business behind the ticker.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Browse a growing directory of Nigerian businesses and learn what
            they do, in plain language.
          </p>
        </div>

        <SavedCompanies companies={companies} />

        <div className="mt-10 max-w-xl">
          <label
            htmlFor="company-search"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Search companies
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 transition focus-within:border-emerald-500">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 shrink-0 text-slate-500"
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
              className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="mb-5 mt-10 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Companies to explore</h2>
          <p className="text-sm text-slate-500" aria-live="polite">
            {filteredCompanies.length}{" "}
            {filteredCompanies.length === 1 ? "company" : "companies"}
          </p>
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.ticker} company={company} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <h3 className="font-semibold text-white">No companies found</h3>
            <p className="mt-2 text-sm text-slate-400">
              Try another company name, ticker, or industry.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
