import Link from "next/link";
import ReportAnalyzer from "@/components/report-analyzer";

export const metadata = {
  title: "Financial Report Analysis | InvestIQ",
  description:
    "Upload a text-searchable PDF and explore its financial figures and observations.",
};

export default function ReportsPage() {
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
        <nav aria-label="Main navigation" className="flex items-center gap-4">
          <Link
            href="/companies"
            className="text-sm font-semibold text-slate-300 transition hover:text-emerald-400"
          >
            Explore companies
          </Link>
          <Link
            href="/compare"
            className="hidden text-sm font-semibold text-slate-300 transition hover:text-emerald-400 sm:inline"
          >
            Compare
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Financial document analysis
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Understand the story behind the numbers.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Upload a company report to extract key figures, explore financial
            changes, and review source-referenced observations in plain
            language.
          </p>
        </div>

        <ReportAnalyzer />
      </section>
    </main>
  );
}
