import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  Building2,
  ChartNoAxesCombined,
  CircleAlert,
  Info,
  Landmark,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
} from "lucide-react";
import { notFound } from "next/navigation";
import CompanySaveButton from "@/components/company-save-button";
import RevenueChart from "@/components/revenue-chart";
import { companies, getCompanyByTicker } from "@/data/companies";

export function generateStaticParams() {
  return companies.map((company) => ({ ticker: company.ticker }));
}

function SectionHeading({
  id,
  label,
  title,
  description,
}: {
  id: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <p className="page-kicker">{label}</p>
        <h2
          id={id}
          className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-[#201D29]"
        >
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-xs text-[#96919F]">{description}</p>
      )}
    </div>
  );
}

function MetricCell({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string | null;
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-0 px-4 py-4 sm:px-5">
      <p className="text-[11px] font-medium text-[#777281]">{label}</p>
      <p
        className={`mt-2 break-words text-lg font-semibold tabular-nums tracking-[-0.03em] ${
          emphasis ? "text-[#45258B]" : "text-[#302C39]"
        }`}
      >
        {value ?? <span className="text-sm font-normal text-[#96919F]">Not available</span>}
      </p>
    </div>
  );
}

function InsightList({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: typeof ShieldCheck;
  tone: "purple" | "green" | "neutral";
}) {
  const iconClass =
    tone === "green"
      ? "text-[#23966B]"
      : tone === "purple"
        ? "text-[#6541C1]"
        : "text-[#777281]";

  return (
    <section className="surface-card p-5">
      <h3 className="flex items-center gap-2.5 text-sm font-semibold text-[#302C39]">
        <Icon aria-hidden="true" size={16} className={iconClass} />
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="mt-4 divide-y divide-[#F0EDF4]">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 py-3 text-xs leading-5 text-[#777281] first:pt-0 last:pb-0"
            >
              <span
                aria-hidden="true"
                className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${tone === "green" ? "bg-[#23966B]" : "bg-[#B8A7D5]"}`}
              />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-[#96919F]">No information available.</p>
      )}
    </section>
  );
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const company = getCompanyByTicker(ticker);

  if (!company) notFound();

  const { financials } = company;
  const financialHealth = [
    { label: "Total assets", value: financials.totalAssets, icon: Landmark },
    { label: "Total liabilities", value: financials.liabilities, icon: Building2 },
    { label: "Total debt", value: financials.debt, icon: Banknote },
    {
      label: "Shareholders’ equity",
      value: financials.shareholdersEquity,
      icon: ChartNoAxesCombined,
    },
    {
      label: "Operating cash flow",
      value: financials.operatingCashFlow,
      icon: ChartNoAxesCombined,
    },
  ];

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#777281] transition hover:text-[#6541C1]"
        >
          <ArrowLeft aria-hidden="true" size={14} />
          Back to companies
        </Link>
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#96919F]">
          Company profile
        </span>
      </div>

      <section className="surface-card p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] bg-[#EEE9F8] text-sm font-bold text-[#45258B] sm:h-14 sm:w-14">
              {company.initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#201D29] sm:text-[30px]">
                  {company.name}
                </h1>
                <span className="border border-[#E9E5EF] px-2 py-1 text-[10px] font-semibold tracking-wide text-[#777281]">
                  {company.ticker}
                </span>
              </div>
              <p className="mt-2 text-xs text-[#777281]">
                {company.industry}
                <span className="mx-2 text-[#C6C1CC]">/</span>
                {company.sector}
                <span className="mx-2 text-[#C6C1CC]">/</span>
                {company.headquarters}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#777281]">
                {company.description}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 pl-16 lg:pl-0">
            <CompanySaveButton ticker={company.ticker} />
            <Link
              href={`/assistant?company=${encodeURIComponent(company.ticker)}`}
              className="primary-button"
            >
              <MessageCircle aria-hidden="true" size={15} />
              Ask assistant
            </Link>
          </div>
        </div>
      </section>

      <aside
        role="note"
        className="demo-note flex items-start gap-3 px-4 py-3 text-xs leading-5"
      >
        <Info
          aria-hidden="true"
          size={15}
          className="mt-0.5 shrink-0 text-[#6541C1]"
        />
        <p>
          <strong className="font-semibold text-[#514D59]">
            Illustrative sample data.
          </strong>{" "}
          Financial figures, growth rates, and historical chart values are
          placeholders—not actual results, live market data, or investment
          advice.
        </p>
      </aside>

      <section aria-labelledby="financial-overview-heading">
        <SectionHeading
          id="financial-overview-heading"
          label="At a glance"
          title="Financial overview"
          description="Illustrative values · NGN billions unless stated"
        />
        <div className="surface-card grid divide-y divide-[#F0EDF4] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
          <MetricCell label="Market capitalization" value={financials.marketCap} />
          <MetricCell label="Revenue" value={financials.revenue} />
          <MetricCell label="Net income" value={financials.netIncome} emphasis />
          <MetricCell label="P/E ratio" value={financials.peRatio} />
          <MetricCell label="Total assets" value={financials.totalAssets} />
        </div>
      </section>

      <section aria-labelledby="performance-heading">
        <SectionHeading
          id="performance-heading"
          label="Performance"
          title="Revenue and profitability"
          description="Historical series are illustrative"
        />
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.5fr)]">
          <div className="surface-card p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[#302C39]">
                Revenue and net income
              </h3>
              <div className="flex items-center gap-4 text-[11px] text-[#777281]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#6541C1]" />
                  Revenue
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#23966B]" />
                  Net income
                </span>
              </div>
            </div>
            <RevenueChart data={financials.historicalRevenue} />
          </div>
          <div className="surface-card divide-y divide-[#F0EDF4]">
            <div className="p-5">
              <p className="text-xs text-[#777281]">Revenue growth · sample</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums tracking-[-0.04em] text-[#302C39]">
                {financials.revenueGrowth}
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs text-[#777281]">Profit growth · sample</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums tracking-[-0.04em] text-[#302C39]">
                {financials.profitGrowth}
              </p>
            </div>
            <p className="px-5 py-3 text-[11px] leading-5 text-[#96919F]">
              Reporting period is not specified in the sample catalog.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="business-heading">
        <SectionHeading
          id="business-heading"
          label="Company"
          title="Business overview"
          description="Plain-language description of operations"
        />
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.6fr)]">
          <div className="surface-card p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-[#302C39]">
              What the company does
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#777281]">
              {company.whatItDoes}
            </p>
            <div className="mt-6 border-t border-[#F0EDF4] pt-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#302C39]">
                <Package aria-hidden="true" size={16} className="text-[#6541C1]" />
                Products and services
              </h3>
              <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {company.productsAndServices.map((product) => (
                  <li
                    key={product}
                    className="flex items-center gap-2 text-xs text-[#777281]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#B8A7D5]" />
                    {product}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="surface-card p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-[#302C39]">
              Business model
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#777281]">
              {company.businessModel}
            </p>
            <div className="mt-5 border-t border-[#F0EDF4] pt-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold text-[#514D59]">
                <MapPin aria-hidden="true" size={14} className="text-[#6541C1]" />
                Headquarters
              </h3>
              <p className="mt-2 text-xs text-[#777281]">
                {company.headquarters}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="health-heading">
        <SectionHeading
          id="health-heading"
          label="Balance sheet and cash flow"
          title="Financial health"
          description="Unavailable values are shown explicitly"
        />
        <div className="surface-card divide-y divide-[#F0EDF4] sm:grid sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
          {financialHealth.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-start gap-3 px-4 py-4 sm:border-b sm:border-[#F0EDF4] sm:px-5"
            >
              <Icon
                aria-hidden="true"
                size={15}
                className="mt-0.5 text-[#96919F]"
              />
              <div>
                <p className="text-[11px] text-[#777281]">{label}</p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-[#302C39]">
                  {value ?? (
                    <span className="font-normal text-[#96919F]">
                      Not available
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="highlights-heading">
        <SectionHeading
          id="highlights-heading"
          label="Research notes"
          title="Investment considerations"
          description="For research context only, not recommendations"
        />
        <div className="grid gap-3 lg:grid-cols-3">
          <InsightList
            title="Potential strengths"
            icon={ShieldCheck}
            items={company.strengths}
            tone="green"
          />
          <InsightList
            title="Potential risks"
            icon={CircleAlert}
            items={company.risks}
            tone="neutral"
          />
          <InsightList
            title="Financial observations"
            icon={Info}
            items={company.observations}
            tone="purple"
          />
        </div>
      </section>
    </main>
  );
}
