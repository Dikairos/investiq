import ReportAnalyzer from "@/components/report-analyzer";

export const metadata = {
  title: "Financial Report Analysis | InvestIQ",
  description:
    "Upload a text-searchable PDF and explore its financial figures and observations.",
};

export default function ReportsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <header>
        <p className="page-kicker">Research tool / Document intelligence</p>
        <h1 className="page-title">Financial report analysis</h1>
        <p className="page-description">
          Review a text-searchable PDF through extracted figures, source
          references, and plain-language observations.
        </p>
      </header>
      <aside className="demo-note px-4 py-3 text-xs leading-5">
        Reports are processed for this request only. If analysis is unavailable,
        the preview is clearly labeled and is not based on the uploaded file.
      </aside>
      <ReportAnalyzer />
    </main>
  );
}
