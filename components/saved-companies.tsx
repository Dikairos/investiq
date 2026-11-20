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
      className="surface-card p-4 sm:p-5"
    >
      <div className="flex items-center gap-2">
        <Bookmark aria-hidden="true" size={16} className="text-[#6541C1]" />
        <h2
          id="saved-companies-heading"
          className="text-sm font-semibold text-[#302C39]"
        >
          Saved companies
        </h2>
        <span className="text-[10px] text-[#96919F]">This browser only</span>
      </div>

      {savedCompanies.length > 0 ? (
        <ul className="mt-3 divide-y divide-[#F0EDF4] border-t border-[#F0EDF4]">
          {savedCompanies.map((company) => (
            <li
              key={company.ticker}
              className="flex items-center gap-3 py-2.5"
            >
              <Link
                href={`/companies/${company.ticker}`}
                className="min-w-0 flex-1 truncate text-xs font-medium text-[#514D59] transition hover:text-[#6541C1]"
              >
                {company.name}                 <span className="text-[#96919F]">({company.ticker})</span>
              </Link>
              <button
                type="button"
                onClick={() => removeSaved(company.ticker)}
                aria-label={`Remove ${company.name} from saved companies`}
                className="flex h-7 w-7 items-center justify-center text-[#96919F] transition hover:bg-[#F7F6FA] hover:text-[#45258B] focus-visible:outline-2 focus-visible:outline-[#6541C1]"
              >
                <X aria-hidden="true" size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs leading-5 text-[#96919F]">
          Save a company profile to keep a shortcut here.
        </p>
      )}

      {storageError && (
        <p role="status" className="mt-3 text-xs text-[#996B29]">
          {storageError}
        </p>
      )}
    </section>
  );
}
