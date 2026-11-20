"use client";

import Link from "next/link";
import { Bookmark, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Company } from "@/data/companies";
import {
  readStoredTickers,
  savedCompaniesStorageKey,
  writeStoredTickers,
} from "@/lib/demo-storage";

export default function SavedCompanies({
  companies,
}: {
  companies: Company[];
}) {
  const [savedTickers, setSavedTickers] = useState<string[]>([]);
  const [storageError, setStorageError] = useState("");
  const tickers = useMemo(
    () => companies.map((company) => company.ticker),
    [companies],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        setSavedTickers(readStoredTickers(savedCompaniesStorageKey, tickers));
      } catch {
        setStorageError(
          "Browser storage is unavailable. Saved companies may not persist.",
        );
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [tickers]);

  function removeSaved(ticker: string) {
    const next = savedTickers.filter((savedTicker) => savedTicker !== ticker);
    try {
      writeStoredTickers(savedCompaniesStorageKey, next);
      setSavedTickers(next);
      setStorageError("");
    } catch {
      setStorageError("Browser storage is unavailable; the save was not removed.");
    }
  }

  const savedCompanies = savedTickers
    .map((ticker) => companies.find((company) => company.ticker === ticker))
    .filter((company): company is Company => company !== undefined);

  return (
    <section
      aria-labelledby="saved-companies-heading"
      className="mt-8 rounded-xl border border-slate-800 bg-slate-900/70 p-5"
    >
      <div className="flex items-center gap-2">
        <Bookmark aria-hidden="true" size={17} className="text-emerald-400" />
        <h2 id="saved-companies-heading" className="font-semibold text-white">
          Saved companies
        </h2>
        <span className="text-xs text-slate-500">this browser only</span>
      </div>

      {savedCompanies.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {savedCompanies.map((company) => (
            <li
              key={company.ticker}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            >
              <Link
                href={`/companies/${company.ticker}`}
                className="text-sm font-medium text-slate-200 transition hover:text-emerald-300"
              >
                {company.name} <span className="text-slate-500">({company.ticker})</span>
              </Link>
              <button
                type="button"
                onClick={() => removeSaved(company.ticker)}
                aria-label={`Remove ${company.name} from saved companies`}
                className="rounded p-1 text-slate-500 transition hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400"
              >
                <X aria-hidden="true" size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">
          Save a company from its profile to keep a shortcut here.
        </p>
      )}

      {storageError && (
        <p role="status" className="mt-3 text-xs text-amber-300">
          {storageError}
        </p>
      )}
    </section>
  );
}
