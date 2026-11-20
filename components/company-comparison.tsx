"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Info,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  HistoricalNetIncomeLines,
  HistoricalRevenueBars,
} from "@/components/comparison-charts";
import type { Company } from "@/data/companies";
import { createDemoComparisonResponse } from "@/lib/demo-responses";
import {
  comparisonTickersStorageKey,
  readStoredTickers,
  writeStoredTickers,
} from "@/lib/demo-storage";

interface ComparisonMetric {
  label: string;
  getValue: (company: Company) => string | null;
}

interface ComparisonGroup {
  title: string;
  metrics: ComparisonMetric[];
}

const comparisonGroups: ComparisonGroup[] = [
  {
    title: "Company overview",
    metrics: [
      { label: "Company name", getValue: (company) => company.name },
      { label: "Industry", getValue: (company) => company.industry },
      { label: "Sector", getValue: (company) => company.sector },
      { label: "Headquarters", getValue: (company) => company.headquarters },
      {
        label: "Market capitalization",
        getValue: (company) => company.financials.marketCap,
      },
      {
        label: "P/E ratio",
        getValue: (company) => company.financials.peRatio,
      },
      {
        label: "Reporting period",
        getValue: (company) => company.financials.reportingPeriod,
      },
    ],
  },
  {
    title: "Financial performance",
    metrics: [
      { label: "Revenue", getValue: (company) => company.financials.revenue },
      {
        label: "Net income",
        getValue: (company) => company.financials.netIncome,
      },
      {
        label: "Revenue growth",
        getValue: (company) => company.financials.revenueGrowth,
      },
      {
        label: "Profit growth",
        getValue: (company) => company.financials.profitGrowth,
      },
      {
        label: "Gross profit",
        getValue: (company) => company.financials.grossProfit,
      },
    ],
  },
  {
    title: "Profitability",
    metrics: [
      {
        label: "Gross profit margin",
        getValue: (company) => company.financials.grossProfitMargin,
      },
      {
        label: "Operating profit margin",
        getValue: (company) => company.financials.operatingProfitMargin,
      },
      {
        label: "Net profit margin",
        getValue: (company) => company.financials.netProfitMargin,
      },
      {
        label: "Return on assets",
        getValue: (company) => company.financials.returnOnAssets,
      },
      {
        label: "Return on equity",
        getValue: (company) => company.financials.returnOnEquity,
      },
    ],
  },
  {
    title: "Financial health",
    metrics: [
      {
        label: "Total assets",
        getValue: (company) => company.financials.totalAssets,
      },
      {
        label: "Total liabilities",
        getValue: (company) => company.financials.liabilities,
      },
      { label: "Total debt", getValue: (company) => company.financials.debt },
      {
        label: "Shareholders' equity",
        getValue: (company) => company.financials.shareholdersEquity,
      },
      {
        label: "Operating cash flow",
        getValue: (company) => company.financials.operatingCashFlow,
      },
    ],
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export default function CompanyComparison({
  companies,
}: {
  companies: Company[];
}) {
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState("");
  const [insightMode, setInsightMode] = useState<"demo" | "live" | null>(null);
  const [insightError, setInsightError] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        setSelectedTickers(
          readStoredTickers(
            comparisonTickersStorageKey,
            companies.map((company) => company.ticker),
            4,
          ),
        );
      } catch {
        setStorageError(
          "Browser storage is unavailable; selections will not persist.",
        );
      } finally {
        setStorageReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [companies]);

  function saveSelection(nextTickers: string[]) {
    setSelectedTickers(nextTickers);
    if (!storageReady) return;

    try {
      writeStoredTickers(comparisonTickersStorageKey, nextTickers);
      setStorageError("");
    } catch {
      setStorageError(
        "Browser storage is unavailable; selections will not persist.",
      );
    }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const selectedCompanies = selectedTickers
    .map((ticker) => companies.find((company) => company.ticker === ticker))
    .filter((company): company is Company => company !== undefined);
  const filteredCompanies = companies.filter((company) =>
    [company.name, company.ticker, company.industry, company.sector]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );

  function addCompany(ticker: string) {
    if (
      selectedTickers.includes(ticker) ||
      selectedTickers.length >= 4 ||
      !companies.some((company) => company.ticker === ticker)
    ) {
      return;
    }

    saveSelection([...selectedTickers, ticker]);
    setInsights("");
    setInsightMode(null);
    setInsightError("");
  }

  function removeCompany(ticker: string) {
    saveSelection(
      selectedTickers.filter(
        (selectedTicker) => selectedTicker !== ticker,
      ),
    );
    setInsights("");
    setInsightMode(null);
    setInsightError("");
  }

  async function generateInsights() {
    if (selectedCompanies.length < 2 || isGenerating) return;

    setIsGenerating(true);
    setInsights("");
    setInsightMode(null);
    setInsightError("");

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickers: selectedCompanies.map((company) => company.ticker),
        }),
      });

      let result: unknown;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        if (response.status === 404 || response.status >= 500) {
          setInsights(createDemoComparisonResponse(selectedCompanies));
          setInsightMode("demo");
          return;
        }
        const message =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "AI insights could not be generated. Please try again.";
        throw new Error(message);
      }

      if (
        !isRecord(result) ||
        typeof result.insights !== "string" ||
        !result.insights.trim()
      ) {
        setInsights(createDemoComparisonResponse(selectedCompanies));
        setInsightMode("demo");
        return;
      }

      setInsights(result.insights);
      setInsightMode("live");
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setInsights(createDemoComparisonResponse(selectedCompanies));
        setInsightMode("demo");
      } else {
        setInsightError(
          requestError instanceof Error
            ? requestError.message
            : "AI insights could not be generated. Please try again.",
        );
      }
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="company-selection-heading"
        className="surface-card p-4 sm:p-5"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="company-selection-heading"
              className="text-lg font-semibold"
            >
              Select companies
            </h2>
            <p className="mt-1 text-xs text-[#777281]">
              Choose 2–4 companies. Remove one to replace it with another.
            </p>
          </div>
          <p className="text-xs tabular-nums text-[#777281]" aria-live="polite">
            {selectedCompanies.length} selected · maximum 4
          </p>
        </div>
        {storageError && (
          <p role="status" className="mt-2 text-xs text-[#996B29]">
            {storageError}
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {selectedCompanies.map((company) => (
            <div
              key={company.ticker}
              className="flex min-w-0 items-center gap-3 border border-[#D8CDEB] bg-[#FBF9FE] p-3"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#EEE9F8] text-[10px] font-bold text-[#45258B]"
              >
                {company.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#302C39]">
                  {company.name}
                </p>
                <p className="text-[10px] text-[#96919F]">{company.ticker}</p>
              </div>
              <button
                type="button"
                disabled={!storageReady}
                aria-label={`Remove ${company.name}`}
                onClick={() => removeCompany(company.ticker)}
                className="flex h-8 w-8 shrink-0 items-center justify-center text-[#96919F] transition hover:bg-[#F0EDF4] hover:text-[#45258B] focus-visible:outline-2 focus-visible:outline-[#6541C1] disabled:cursor-wait disabled:opacity-50"
              >
                <X aria-hidden="true" size={16} />
              </button>
            </div>
          ))}
          {selectedCompanies.length === 0 && (
            <p className="border border-dashed border-[#DCD6E5] px-4 py-3 text-xs text-[#777281] sm:col-span-2 lg:col-span-4">
              No companies selected yet. Search below and add at least two to
              start comparing.
            </p>
          )}
        </div>

        <label
          htmlFor="compare-search"
          className="mb-2 mt-6 block text-xs font-semibold text-[#514D59]"
        >
          Search available companies
        </label>
        <div className="flex items-center gap-3 border border-[#E9E5EF] bg-white px-3.5 transition focus-within:border-[#6541C1] focus-within:shadow-[0_0_0_3px_rgba(101,65,193,0.08)]">
          <Search
            aria-hidden="true"
            className="shrink-0 text-[#96919F]"
            size={18}
          />
          <input
            id="compare-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, ticker, industry, or sector"
            className="h-11 w-full bg-transparent text-sm text-[#302C39] outline-none placeholder:text-[#96919F]"
          />
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => {
              const isSelected = selectedTickers.includes(company.ticker);
              const isAtLimit = selectedTickers.length >= 4;

              return (
                <div
                  key={company.ticker}
                  className="flex items-center gap-3 border border-[#E9E5EF] bg-white p-3"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#EEE9F8] text-[10px] font-bold text-[#45258B]"
                  >
                    {company.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#302C39]">
                      {company.name}
                    </p>
                    <p className="text-[10px] text-[#96919F]">
                      {company.ticker} · {company.industry}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!storageReady || isSelected || isAtLimit}
                    aria-label={
                      isSelected
                        ? `${company.name} already selected`
                        : `Add ${company.name}`
                    }
                    onClick={() => addCompany(company.ticker)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#E9E5EF] text-[#6541C1] transition hover:border-[#CFC3E5] hover:bg-[#F7F4FC] focus-visible:outline-2 focus-visible:outline-[#6541C1] disabled:cursor-not-allowed disabled:text-[#B9B3C1] disabled:hover:border-[#E9E5EF] disabled:hover:bg-transparent"
                  >
                    {isSelected ? (
                      <Check aria-hidden="true" size={17} />
                    ) : (
                      <Plus aria-hidden="true" size={17} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 border border-[#E9E5EF] bg-white p-5 text-center text-sm text-[#777281]">
            No companies match that search.
          </p>
        )}
      </section>

      {selectedCompanies.length >= 2 ? (
        <>
          <aside
            role="note"
            className="demo-note flex items-start gap-3 px-4 py-3 text-xs leading-5"
          >
            <Info
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[#6541C1]"
              size={15}
            />
            <p>
              The current financial figures are illustrative mock values, not
              verified results. Their reporting periods are unspecified. Only
              the historical chart values have year labels, and those are also
              mock data. Missing metrics are shown as unavailable; no ranking
              is implied.
            </p>
          </aside>

          <section aria-labelledby="comparison-table-heading">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  id="comparison-table-heading"
                  className="text-base font-semibold tracking-[-0.02em] text-[#302C39]"
                >
                  Side-by-side comparison
                </h2>
                <p className="mt-1 text-xs text-[#777281]">
                  Amounts use the catalog&apos;s NGN billions unit; periods are
                  not specified for profile metrics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void generateInsights()}
                disabled={isGenerating}
                className="primary-button shrink-0"
              >
                <Sparkles
                  aria-hidden="true"
                  className={isGenerating ? "animate-pulse" : ""}
                  size={17}
                />
                {isGenerating ? "Generating insights..." : "Generate AI Insights"}
              </button>
            </div>

            {insightError && (
              <p
                role="alert"
                className="mb-4 flex items-start gap-2 border border-[#EBCFCF] bg-[#FFF9F8] p-4 text-sm text-[#A44747]"
              >
                <AlertCircle
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                  size={17}
                />
                {insightError}
              </p>
            )}

            {insights && (
              <div
                aria-live="polite"
                className="mb-5 border border-[#D8CDEB] bg-white p-5"
              >
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#45258B]">
                  <Sparkles aria-hidden="true" size={15} />
                  {insightMode === "demo"
                    ? "Simulated demo insights"
                    : "AI-generated comparison"}
                </h3>
                <p className="mt-3 whitespace-pre-wrap border-t border-[#F0EDF4] pt-3 text-sm leading-6 text-[#514D59]">
                  {insights}
                </p>
                <p className="mt-3 text-[10px] leading-5 text-[#96919F]">
                  {insightMode === "demo"
                    ? "Generated locally from illustrative catalog data, not by a live AI model."
                    : "Generated from the illustrative catalog data above."}{" "}
                  This is educational information, not investment advice.
                </p>
              </div>
            )}

            <div className="surface-card overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left text-xs">
                <thead className="bg-[#FBFAFF]">
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 z-10 min-w-48 border-b border-[#E9E5EF] bg-[#FBFAFF] px-4 py-3 font-semibold text-[#777281]"
                    >
                      Metric
                    </th>
                    {selectedCompanies.map((company) => (
                      <th
                        key={company.ticker}
                        scope="col"
                        className="min-w-44 border-b border-[#E9E5EF] px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#EEE9F8] text-[10px] font-bold text-[#45258B]"
                          >
                            {company.initials}
                          </span>
                          <span>
                            <span className="block font-semibold text-[#302C39]">
                              {company.name}
                            </span>
                            <span className="mt-0.5 block text-[10px] text-[#96919F]">
                              {company.ticker}
                            </span>
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                {comparisonGroups.map((group) => (
                  <tbody key={group.title}>
                    <tr>
                      <th
                        scope="rowgroup"
                        colSpan={selectedCompanies.length + 1}
                        className="border-b border-[#E9E5EF] bg-[#F7F6FA] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6541C1]"
                      >
                        {group.title}
                      </th>
                    </tr>
                    {group.metrics.map((metric) => (
                      <tr
                        key={metric.label}
                        className="border-b border-[#F0EDF4] last:border-0"
                      >
                        <th
                          scope="row"
                          className="sticky left-0 bg-white px-4 py-3 font-medium text-[#514D59]"
                        >
                          {metric.label}
                        </th>
                        {selectedCompanies.map((company) => {
                          const value = metric.getValue(company);
                          return (
                            <td
                              key={company.ticker}
                              className={`px-4 py-3.5 ${
                                value ? "text-[#302C39]" : "text-[#96919F]"
                              }`}
                            >
                              {value || "Not available"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </section>

          <section aria-labelledby="visual-comparison-heading">
            <div className="mb-5">
              <h2
                id="visual-comparison-heading"
                className="text-base font-semibold tracking-[-0.02em] text-[#302C39]"
              >
                Visual comparison
              </h2>
              <p className="mt-1 text-xs text-[#777281]">
                Charts use only shared historical years and the dataset&apos;s
                stated NGN billions unit.
              </p>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="surface-card p-4 sm:p-5">
                <h3 className="mb-1 text-sm font-semibold text-[#302C39]">
                  Historical revenue
                </h3>
                <p className="mb-4 text-[10px] text-[#96919F]">
                  Grouped by year · illustrative NGN billions
                </p>
                <HistoricalRevenueBars companies={selectedCompanies} />
              </div>
              <div className="surface-card p-4 sm:p-5">
                <h3 className="mb-1 text-sm font-semibold text-[#302C39]">
                  Historical net income
                </h3>
                <p className="mb-4 text-[10px] text-[#96919F]">
                  Shared years only · illustrative NGN billions
                </p>
                <HistoricalNetIncomeLines companies={selectedCompanies} />
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="surface-card border-dashed px-6 py-12 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center border border-[#E9E5EF] bg-[#FBFAFF] text-[#6541C1]">
            <Info aria-hidden="true" size={19} />
          </span>
          <h2 className="mt-4 text-base font-semibold text-[#302C39]">
            {selectedCompanies.length === 0
              ? "Your comparison is empty"
              : "Add one more company"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#777281]">
            Select at least two companies to see the comparison table, charts,
            and AI insights. You can compare up to four.
          </p>
        </div>
      )}
    </div>
  );
}
