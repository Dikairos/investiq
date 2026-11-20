"use client";

import {
  AlertCircle,
  FileText,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import type {
  ReportAnalysis,
  ReportField,
  ReportInsight,
} from "@/lib/report-analysis";
import { companies } from "@/data/companies";

const maxFileSize = 12 * 1024 * 1024;
const metricRows: Array<{
  key: keyof ReportAnalysis["keyFinancialMetrics"];
  label: string;
}> = [
  { key: "revenue", label: "Revenue" },
  { key: "netIncome", label: "Net income" },
  { key: "operatingExpenses", label: "Operating expenses" },
  { key: "totalAssets", label: "Total assets" },
  { key: "totalLiabilities", label: "Total liabilities" },
  { key: "shareholdersEquity", label: "Shareholders' equity" },
  { key: "cashFlow", label: "Cash flow" },
  { key: "debt", label: "Debt / borrowings" },
];

interface ReportDocumentSummary {
  filename: string;
  pageCount: number | null;
  processedChunks: number | null;
  extractedCharacters: number | null;
}

interface ReportApiResponse {
  mode: "demo" | "live";
  document: ReportDocumentSummary;
  analysis: ReportAnalysis;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isReportField(value: unknown): value is ReportField {
  return (
    isRecord(value) &&
    isNullableString(value.value) &&
    isNullableString(value.source) &&
    isNullableString(value.interpretation)
  );
}

function isReportInsightList(value: unknown): value is ReportInsight[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.text === "string" &&
        isNullableString(item.source),
    )
  );
}

function isReportAnalysis(value: unknown): value is ReportAnalysis {
  if (!isRecord(value) || !isRecord(value.keyFinancialMetrics)) return false;

  const metrics = value.keyFinancialMetrics;
  return (
    isReportField(value.companyName) &&
    isReportField(value.reportingPeriod) &&
    isReportField(value.reportingCurrency) &&
    isReportInsightList(value.executiveSummary) &&
    metricRows.every(({ key }) => isReportField(metrics[key])) &&
    isReportInsightList(value.revenueAndProfitability) &&
    isReportInsightList(value.financialPosition) &&
    isReportInsightList(value.cashFlowAnalysis) &&
    isReportInsightList(value.potentialRisks) &&
    isReportInsightList(value.importantObservations)
  );
}

function parseResponse(value: unknown): ReportApiResponse | null {
  if (
    !isRecord(value) ||
    !isRecord(value.document) ||
    !isRecord(value.analysis)
  ) {
    return null;
  }

  const { document, analysis } = value;
  if (
    typeof document.filename !== "string" ||
    typeof document.pageCount !== "number" ||
    typeof document.processedChunks !== "number" ||
    typeof document.extractedCharacters !== "number" ||
    !isReportAnalysis(analysis)
  ) {
    return null;
  }

  return {
    mode: "live",
    document: {
      filename: document.filename,
      pageCount: document.pageCount,
      processedChunks: document.processedChunks,
      extractedCharacters: document.extractedCharacters,
    },
    analysis,
  };
}

function createDemoReportAnalysis(file: File): ReportApiResponse {
  const sample = companies[0];
  const source = "Illustrative InvestIQ demo catalog, not the uploaded PDF";
  const field = (
    value: string | null,
    interpretation: string | null = null,
  ): ReportField => ({ value, source: value ? source : null, interpretation });
  const insight = (text: string): ReportInsight => ({ text, source });
  const financials = sample.financials;

  return {
    mode: "demo",
    document: {
      filename: file.name,
      pageCount: null,
      processedChunks: null,
      extractedCharacters: null,
    },
    analysis: {
      companyName: field(`${sample.name} (sample data)`),
      reportingPeriod: field(null),
      reportingCurrency: field(financials.currency),
      executiveSummary: [
        insight(
          "This simulated preview uses local sample company data to demonstrate the report-analysis layout. The uploaded PDF was not extracted or used to produce these findings.",
        ),
      ],
      keyFinancialMetrics: {
        revenue: field(financials.revenue, "Illustrative catalog value only."),
        netIncome: field(financials.netIncome, "Illustrative catalog value only."),
        operatingExpenses: field(null, "Not included in the demo catalog."),
        totalAssets: field(financials.totalAssets, "Illustrative catalog value only."),
        totalLiabilities: field(financials.liabilities, "Illustrative catalog value only."),
        shareholdersEquity: field(null, "Not included in the demo catalog."),
        cashFlow: field(
          financials.cashFlow,
          "The demo catalog does not specify the cash-flow activity type.",
        ),
        debt: field(financials.debt, "Illustrative catalog value only."),
      },
      revenueAndProfitability: [
        insight(
          `The sample catalog lists revenue growth of ${financials.revenueGrowth} and profit growth of ${financials.profitGrowth}. The reporting period is unspecified; these values are not extracted from the uploaded file.`,
        ),
      ],
      financialPosition: [
        insight(
          `Illustrative catalog values list total assets of ${financials.totalAssets} and liabilities of ${financials.liabilities}. Shareholders' equity is not available in this sample dataset.`,
        ),
      ],
      cashFlowAnalysis: [
        insight(
          `The sample catalog lists cash flow of ${financials.cashFlow}, but does not identify whether it is operating, investing, or financing cash flow.`,
        ),
      ],
      potentialRisks: sample.risks.map(insight),
      importantObservations: sample.observations.map(insight),
    },
  };
}

function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function addSource(source: string | null) {
  return source ? `Source: ${source}` : "No page or section citation available";
}

function InsightSection({
  title,
  items,
  mode,
}: {
  title: string;
  items: ReportInsight[];
  mode: "demo" | "live";
}) {
  return (
    <section className="surface-card p-5">
      <h3 className="text-sm font-semibold text-[#302C39]">{title}</h3>
      <p className="mt-1 text-[10px] text-[#96919F]">
        {mode === "demo"
          ? "Simulated sample content, not based on the uploaded PDF."
          : "AI-generated analysis; source references are included when available."}
      </p>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="border border-[#F0EDF4] bg-[#FDFCFD] p-4"
            >
              <p className="text-sm leading-6 text-[#514D59]">{item.text}</p>
              <p className="mt-2 text-[10px] text-[#96919F]">
                {addSource(item.source)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-[#96919F]">
          No supported findings were identified in this section.
        </p>
      )}
    </section>
  );
}

function ReportFieldCard({
  label,
  field,
}: {
  label: string;
  field: ReportField;
}) {
  return (
    <div className="border border-[#F0EDF4] bg-[#FDFCFD] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#96919F]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-[#302C39]">
        {field.value ?? "Unavailable in extracted text"}
      </p>
      <p className="mt-2 text-[10px] leading-4 text-[#96919F]">
        {addSource(field.source)}
      </p>
    </div>
  );
}

export default function ReportAnalyzer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing">(
    "idle",
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReportApiResponse | null>(null);

  const isBusy = status !== "idle";

  async function chooseFile(nextFile: File | undefined) {
    if (!nextFile) return;

    if (!nextFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Choose a PDF file.");
      return;
    }
    if (nextFile.type && nextFile.type !== "application/pdf") {
      setError("The selected file is not a PDF.");
      return;
    }
    if (nextFile.size === 0) {
      setError("The selected PDF is empty.");
      return;
    }
    if (nextFile.size > maxFileSize) {
      setError("The PDF must be 12 MB or smaller.");
      return;
    }

    try {
      const header = new TextDecoder().decode(
        await nextFile.slice(0, 1024).arrayBuffer(),
      );
      if (!header.includes("%PDF-")) {
        setError("The selected file does not have a valid PDF signature.");
        return;
      }
    } catch {
      setError("The selected PDF could not be read.");
      return;
    }

    setError("");
    setResult(null);
    setFile(nextFile);
    setUploadProgress(0);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    void chooseFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void chooseFile(event.dataTransfer.files[0]);
  }

  function clearReport() {
    if (isBusy) return;
    setFile(null);
    setResult(null);
    setError("");
    setUploadProgress(0);
  }

  function analyzeReport() {
    if (!file || isBusy) return;
    const selectedFile = file;

    setError("");
    setResult(null);
    setStatus("uploading");
    setUploadProgress(0);

    const body = new FormData();
    body.append("file", file);

    const request = new XMLHttpRequest();
    request.open("POST", "/api/reports/analyze");
    request.timeout = 65_000;
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    });
    request.upload.addEventListener("load", () => {
      setUploadProgress(100);
      setStatus("analyzing");
    });
    request.addEventListener("load", () => {
      setStatus("idle");
      let payload: unknown;
      try {
        payload = JSON.parse(request.responseText);
      } catch {
        if (request.status === 404 || request.status >= 500) {
          setResult(createDemoReportAnalysis(selectedFile));
        } else {
          setError("The server returned an unreadable response. Please try again.");
        }
        return;
      }

      const response = parseResponse(payload);
      if (request.status < 200 || request.status >= 300) {
        if (request.status === 404 || request.status >= 500) {
          setResult(createDemoReportAnalysis(selectedFile));
          return;
        }
        setError(
          isRecord(payload) && typeof payload.error === "string"
            ? payload.error
            : "The report could not be analyzed. Please try again.",
        );
        return;
      }

      if (!response) {
        setError("The server returned an incomplete analysis. Please try again.");
        return;
      }
      setResult(response);
    });
    request.addEventListener("error", () => {
      setStatus("idle");
      setResult(createDemoReportAnalysis(selectedFile));
    });
    request.addEventListener("timeout", () => {
      setStatus("idle");
      setResult(createDemoReportAnalysis(selectedFile));
    });
    request.send(body);
  }

  return (
    <div className="mt-10">
      <section className="surface-card p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#EEE9F8] p-2.5 text-[#6541C1]">
            <Upload aria-hidden="true" className="h-[18px] w-[18px]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#302C39]">
              Upload a financial report
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#777281]">
              Add a text-searchable PDF. Extracted text is sent to OpenAI for
              analysis; the app processes it for this request only and does not
              save the document.
            </p>
          </div>
        </div>

        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            const target = event.relatedTarget;
            if (
              !(target instanceof Node) ||
              !event.currentTarget.contains(target)
            ) {
              setDragging(false);
            }
          }}
          onDrop={onDrop}
          className={`mt-5 border border-dashed p-6 text-center transition sm:p-8 ${
            dragging
              ? "border-[#6541C1] bg-[#F7F4FC]"
              : "border-[#DCD6E5] bg-[#FBFAFF]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={onFileChange}
            className="sr-only"
            tabIndex={-1}
            aria-label="Select a PDF financial report"
          />

          {file ? (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:text-left">
              <FileText
                aria-hidden="true"
                className="h-8 w-8 shrink-0 text-[#6541C1]"
              />
              <div className="min-w-0 flex-1">
                <p className="break-all text-sm font-semibold text-[#302C39]">
                  {file.name}
                </p>
                <p className="mt-1 text-xs text-[#96919F]">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={clearReport}
                disabled={isBusy}
                className="secondary-button min-h-9 px-3 text-xs disabled:cursor-not-allowed"
              >
                <X aria-hidden="true" className="h-4 w-4" />
                Remove
              </button>
            </div>
          ) : (
            <>
              <Upload
                aria-hidden="true"
                className="mx-auto h-7 w-7 text-[#96919F]"
              />
              <p className="mt-3 text-sm font-medium text-[#514D59]">
                Drag and drop a report here
              </p>
              <p className="mt-1 text-xs text-[#96919F]">
                PDF only, up to 12 MB
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="secondary-button mt-4 min-h-9 text-xs"
              >
                Choose PDF
              </button>
            </>
          )}
        </div>

        {isBusy && (
          <div className="mt-5" aria-live="polite">
            <div className="mb-2 flex items-center justify-between gap-4 text-xs text-[#777281]">
              <span>
                {status === "uploading"
                  ? `Uploading report${uploadProgress ? ` — ${uploadProgress}%` : ""}`
                  : "Extracting and analyzing report pages…"}
              </span>
              {status === "uploading" && (
                <span className="tabular-nums">{uploadProgress}%</span>
              )}
            </div>
            <div className="h-1.5 overflow-hidden bg-[#EEEAF2]">
              <div
                className={`h-full bg-[#6541C1] transition-all ${
                  status === "analyzing" ? "w-full animate-pulse" : ""
                }`}
                style={
                  status === "uploading"
                    ? { width: `${uploadProgress}%` }
                    : undefined
                }
              />
            </div>
            {status === "analyzing" && (
              <p className="mt-2 text-xs text-[#96919F]">
                Larger reports may take a little longer.
              </p>
            )}
          </div>
        )}

        {file && !isBusy && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={analyzeReport}
              className="primary-button"
            >
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Analyze report
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-2 text-xs font-medium text-[#777281] transition hover:text-[#6541C1]"
            >
              Replace PDF
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 border border-[#EBCFCF] bg-[#FFF9F8] p-4 text-sm text-[#A44747]"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            <p>{error}</p>
          </div>
        )}
      </section>

      {result && (
        <div className="mt-10 space-y-6">
          <section className="surface-card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-[#EAF5F0] p-2.5 text-[#23966B]">
                  <ShieldCheck aria-hidden="true" className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#23966B]">
                    {result.mode === "demo" ? "Demo preview" : "Analysis complete"}
                  </p>
                  <h2 className="mt-1 break-words text-lg font-semibold text-[#302C39]">
                    {result.analysis.companyName.value ??
                      result.document.filename}
                  </h2>
                  <p className="mt-1 text-xs text-[#777281]">
                    {result.analysis.reportingPeriod.value ??
                      "Reporting period unavailable"}
                    {result.analysis.reportingCurrency.value
                      ? ` · ${result.analysis.reportingCurrency.value}`
                      : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearReport}
                className="secondary-button min-h-9 self-start px-3 text-xs"
              >
                Remove report
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <ReportFieldCard
                label="Company"
                field={result.analysis.companyName}
              />
              <ReportFieldCard
                label="Reporting period"
                field={result.analysis.reportingPeriod}
              />
              <ReportFieldCard
                label="Reporting currency"
                field={result.analysis.reportingCurrency}
              />
            </div>
            <p className="mt-4 break-words text-[10px] text-[#96919F]">
              {result.document.filename} ·{" "}
              {result.mode === "demo"
                ? "pages and text were not processed"
                : `${result.document.pageCount} pages · ${result.document.processedChunks} text sections processed`}
            </p>
          </section>

          {result.mode === "demo" && (
            <aside
              role="note"
              className="border border-[#E8D9B9] bg-[#FFFBF2] p-4 text-xs leading-5 text-[#755F36]"
            >
              <p className="font-semibold text-[#755F36]">
                Simulated analysis — not based on your uploaded PDF.
              </p>
              <p className="mt-1">
                Backend processing is unavailable. This preview uses
                illustrative MTN Nigeria catalog data only; the selected file
                has not been analyzed.
              </p>
            </aside>
          )}

          <InsightSection
            title="A. Executive summary"
            items={result.analysis.executiveSummary}
            mode={result.mode}
          />

          <section className="surface-card p-5">
            <h3 className="text-sm font-semibold text-[#302C39]">
              B. Key financial metrics
            </h3>
            <p className="mt-1 text-xs leading-5 text-[#777281]">
              Values are transcribed from the report where available. Missing
              figures are left unavailable rather than estimated.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E9E5EF] bg-[#FBFAFF] text-[10px] uppercase tracking-wide text-[#777281]">
                    <th className="px-3 py-3 font-medium">Metric</th>
                    <th className="px-3 py-3 font-medium">Report value</th>
                    <th className="px-3 py-3 font-medium">Source</th>
                    <th className="px-3 py-3 font-medium">
                      {result.mode === "demo" ? "Demo note" : "AI interpretation"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metricRows.map(({ key, label }) => {
                    const field = result.analysis.keyFinancialMetrics[key];
                    return (
                      <tr
                        key={key}
                        className="border-b border-[#F0EDF4] align-top last:border-0"
                      >
                        <th className="px-3 py-4 font-medium text-[#302C39]">
                          {label}
                        </th>
                        <td className="px-3 py-4 text-[#514D59]">
                          {field.value ?? (
                            <span className="text-[#96919F]">
                              Unavailable
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-[10px] leading-5 text-[#96919F]">
                          {addSource(field.source)}
                        </td>
                        <td className="px-3 py-4 text-[#777281]">
                          {field.interpretation ?? "No interpretation provided"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <InsightSection
              title="C. Revenue and profitability"
              items={result.analysis.revenueAndProfitability}
              mode={result.mode}
            />
            <InsightSection
              title="D. Financial position"
              items={result.analysis.financialPosition}
              mode={result.mode}
            />
            <InsightSection
              title="E. Cash flow analysis"
              items={result.analysis.cashFlowAnalysis}
              mode={result.mode}
            />
            <InsightSection
              title="F. Potential risks"
              items={result.analysis.potentialRisks}
              mode={result.mode}
            />
          </div>

          <InsightSection
            title="G. Important observations"
            items={result.analysis.importantObservations}
            mode={result.mode}
          />
          <p className="flex items-start gap-2 px-1 text-xs leading-5 text-[#777281]">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {result.mode === "demo"
              ? "Sample figures are illustrative and unrelated to the uploaded document. This demonstration is educational, not investment advice."
              : "This AI-generated report summary may contain errors. Verify figures against the original document; this is not personalized investment advice."}
          </p>
        </div>
      )}

      {isBusy && (
        <p className="sr-only" aria-live="polite">
          <LoaderCircle aria-hidden="true" className="h-4 w-4" />
          {status === "uploading"
            ? "Uploading report"
            : "Analyzing the financial report"}
        </p>
      )}
    </div>
  );
}
