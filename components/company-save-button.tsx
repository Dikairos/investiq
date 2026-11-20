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
        className="secondary-button min-h-10 px-3 text-xs disabled:cursor-wait"
      >
        <Bookmark
          aria-hidden="true"
          size={17}
          className={isSaved ? "fill-[#6541C1] text-[#6541C1]" : "text-[#777281]"}
        />
        {isSaved ? "Saved" : "Save company"}
      </button>
      {storageError && (
        <p role="status" className="mt-2 max-w-48 text-[10px] leading-4 text-[#996B29]">
          {storageError}
        </p>
      )}
    </div>
  );
}
