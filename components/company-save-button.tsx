"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { companies } from "@/data/companies";
import {
  readStoredTickers,
  savedCompaniesStorageKey,
  writeStoredTickers,
} from "@/lib/demo-storage";

export default function CompanySaveButton({ ticker }: { ticker: string }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        setIsSaved(
          readStoredTickers(
            savedCompaniesStorageKey,
            companies.map((company) => company.ticker),
          ).includes(ticker),
        );
      } catch {
        setStorageError(
          "Browser storage is unavailable; this save will not persist.",
        );
      } finally {
        setIsReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [ticker]);

  function toggleSaved() {
    try {
      const current = readStoredTickers(
        savedCompaniesStorageKey,
        companies.map((company) => company.ticker),
      );
      const next = current.includes(ticker)
        ? current.filter((savedTicker) => savedTicker !== ticker)
        : [...current, ticker];
      writeStoredTickers(savedCompaniesStorageKey, next);
      setIsSaved(next.includes(ticker));
      setStorageError("");
    } catch {
      setStorageError("Browser storage is unavailable; this save was not stored.");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggleSaved}
        disabled={!isReady}
        aria-pressed={isSaved}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-500/60 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-wait disabled:opacity-60"
      >
        <Bookmark
          aria-hidden="true"
          size={17}
          className={isSaved ? "fill-emerald-400 text-emerald-400" : ""}
        />
        {isSaved ? "Saved" : "Save company"}
      </button>
      {storageError && (
        <p role="status" className="mt-2 text-xs text-amber-300">
          {storageError}
        </p>
      )}
    </div>
  );
}
