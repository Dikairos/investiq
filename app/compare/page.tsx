import CompanyComparison from "@/components/company-comparison";
import { companies } from "@/data/companies";

export default function ComparePage() {
  return (
    <main className="space-y-6">
      <header>
        <p className="page-kicker">Company research / Side by side</p>
        <h1 className="page-title">Compare companies</h1>
        <p className="page-description">
          Review available financial and business information together. Missing
          metrics remain marked as unavailable; no ranking is implied.
        </p>
      </header>
      <CompanyComparison companies={companies} />
    </main>
  );
}
