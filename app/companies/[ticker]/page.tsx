import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  Building2,
  ChartNoAxesCombined,
  CircleAlert,
  Info,
  Landmark,
  type LucideIcon,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { notFound } from "next/navigation";
import RevenueChart from "@/components/revenue-chart";
import CompanySaveButton from "@/components/company-save-button";
import { companies, getCompanyByTicker } from "@/data/companies";

export function generateStaticParams() {
  return companies.map((company) => ({ ticker: company.ticker }));
}

function SectionHeading({
  icon: Icon,
  id,
  title,
  description,
}: {
  icon: LucideIcon;
  id: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="mt-0.5 rounded-lg border border-slate-800 bg-slate-900 p-2 text-emerald-400">
        <Icon aria-hidden="true" size={18} />
      </span>
      <div>
        <h2 id={id} className="text-xl font-semibold text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Banknote;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon aria-hidden="true" className="shrink-0 text-slate-500" size={17} />
      </div>
      <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">{value}</p>
    </div>
  );
}

function HighlightList({
  title,
  icon: Icon,
  items,
  tone,
}: {
  title: string;
  icon: typeof ShieldCheck;
  items: string[];
  tone: "emerald" | "amber" | "slate";
}) {
  const iconColor = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    slate: "text-slate-400",
  }[tone];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
      <h3 className="flex items-center gap-2 font-semibold text-white">
        <Icon aria-hidden="true" className={iconColor} size={18} />
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-6 text-slate-400"
            >
              <span
                aria-hidden="true"
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current ${iconColor}`}
              />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No information available yet.
        </p>
      )}
    </div>
  );
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const company = getCompanyByTicker(ticker);

  if (!company) {
    notFound();
  }

  const { financials } = company;

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
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-emerald-400"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          <span className="hidden sm:inline">Back to exploration</span>
          <span className="sm:hidden">Companies</span>
        </Link>
      </header>

      <div className="mx-auto max-w-6xl space-y-12 px-6 pb-20 pt-6 sm:pt-10">
        <section className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            <div
              aria-hidden="true"
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold sm:h-20 sm:w-20 ${company.accent}`}
            >
              {company.initials}
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Company profile
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">{company.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                <span className="rounded-md border border-slate-700 px-2 py-1 font-medium text-slate-200">
                  {company.ticker}
                </span>
                <span>{company.industry}</span>
                <span aria-hidden="true" className="text-slate-600">
                  /
                </span>
                <span>{company.sector}</span>
              </div>
              <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                {company.description}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <CompanySaveButton ticker={company.ticker} />
            <Link
              href={`/assistant?company=${encodeURIComponent(company.ticker)}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              <MessageCircle aria-hidden="true" size={17} />
              Ask InvestIQ
            </Link>
          </div>
        </section>

        <aside
          role="note"
          className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-sm leading-6 text-amber-100/80"
        >
          <Info
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-amber-400"
            size={18}
          />
          <p>
            <span className="font-semibold text-amber-300">
              Illustrative mock data.
            </span>{" "}
            Financial figures, growth rates and chart values on this page are
            placeholders for demonstration only. They are not actual company
            results, investment advice or live market data.
          </p>
        </aside>

        <section aria-labelledby="financial-overview-heading">
          <SectionHeading
            icon={Landmark}
            id="financial-overview-heading"
            title="Financial overview"
            description="Illustrative sample values · NGN billions unless stated otherwise"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            <MetricCard
              label="Market capitalization"
              value={financials.marketCap}
              icon={Building2}
            />
            <MetricCard
              label="Revenue"
              value={financials.revenue}
              icon={Banknote}
            />
            <MetricCard
              label="Net income"
              value={financials.netIncome}
              icon={TrendingUp}
            />
            <MetricCard
              label="P/E ratio"
              value={financials.peRatio}
              icon={ChartNoAxesCombined}
            />
            <MetricCard
              label="Total assets"
              value={financials.totalAssets}
              icon={Landmark}
            />
          </div>
        </section>

        <section aria-labelledby="financial-performance-heading">
          <SectionHeading
            icon={ChartNoAxesCombined}
            id="financial-performance-heading"
            title="Financial performance"
            description="Historical revenue and net income · illustrative values in NGN billions"
          />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(15rem,0.7fr)]">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap gap-5 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Revenue
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  Net income
                </span>
              </div>
              <RevenueChart data={financials.historicalRevenue} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <MetricCard
                label="Revenue growth"
                value={financials.revenueGrowth}
                icon={TrendingUp}
              />
              <MetricCard
                label="Profit growth"
                value={financials.profitGrowth}
                icon={TrendingUp}
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="business-overview-heading">
          <SectionHeading
            icon={Building2}
            id="business-overview-heading"
            title="Business overview"
            description="A plain-language look at the company's operations"
          />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6 lg:col-span-2">
              <h3 className="font-semibold text-white">What the company does</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {company.whatItDoes}
              </p>
              <h3 className="mt-6 flex items-center gap-2 font-semibold text-white">
                <Package
                  aria-hidden="true"
                  className="text-emerald-400"
                  size={18}
                />
                Products and services
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {company.productsAndServices.map((product) => (
                  <li
                    key={product}
                    className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300"
                  >
                    {product}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <div>
                <h3 className="font-semibold text-white">Business model</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {company.businessModel}
                </p>
              </div>
              <div className="border-t border-slate-800 pt-4">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <MapPin
                    aria-hidden="true"
                    className="text-emerald-400"
                    size={17}
                  />
                  Headquarters
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {company.headquarters}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="financial-health-heading">
          <SectionHeading
            icon={ShieldCheck}
            id="financial-health-heading"
            title="Financial health"
            description="Illustrative balance sheet and cash flow indicators"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <MetricCard
              label="Assets"
              value={financials.totalAssets}
              icon={Landmark}
            />
            <MetricCard
              label="Liabilities"
              value={financials.liabilities}
              icon={Building2}
            />
            <MetricCard
              label="Debt"
              value={financials.debt}
              icon={Banknote}
            />
            <MetricCard
              label="Cash flow"
              value={financials.cashFlow}
              icon={TrendingUp}
            />
          </div>
        </section>

        <section aria-labelledby="investment-highlights-heading">
          <SectionHeading
            icon={CircleAlert}
            id="investment-highlights-heading"
            title="Investment highlights"
            description="General research prompts, not recommendations"
          />
          <div className="grid gap-4 lg:grid-cols-3">
            <HighlightList
              title="Potential strengths"
              icon={ShieldCheck}
              items={company.strengths}
              tone="emerald"
            />
            <HighlightList
              title="Potential risks"
              icon={CircleAlert}
              items={company.risks}
              tone="amber"
            />
            <HighlightList
              title="Financial observations"
              icon={Info}
              items={company.observations}
              tone="slate"
            />
          </div>
        </section>

        <div className="border-t border-slate-800 pt-6">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to company exploration
          </Link>
        </div>
      </div>
    </main>
  );
}
