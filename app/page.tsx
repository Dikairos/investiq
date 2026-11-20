import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  FileSearch,
  GitCompareArrows,
  MoveUpRight,
} from "lucide-react";
import { companies } from "@/data/companies";

const researchTools = [
  {
    href: "/compare",
    label: "Company comparison",
    description: "Review available financial indicators side by side.",
    icon: GitCompareArrows,
  },
  {
    href: "/reports",
    label: "Report analysis",
    description: "Explore a structured analysis of a financial PDF.",
    icon: FileSearch,
  },
  {
    href: "/assistant",
    label: "Financial assistant",
    description: "Ask plain-language questions with company context.",
    icon: Bot,
  },
];

export default function Home() {
  return (
    <main className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.65fr)]">
        <div className="surface-card flex min-h-[300px] flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="page-kicker">Investment research, made clear</p>
              <span className="border border-[#E9E5EF] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[#777281]">
                Nigeria edition
              </span>
            </div>
            <h1 className="mt-5 max-w-2xl text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.13] tracking-[-0.055em] text-[#201D29]">
              Understand the business behind the numbers.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#777281] sm:text-[15px]">
              Explore company profiles, compare key indicators, and make
              financial reports easier to read—all in one focused workspace.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/companies" className="primary-button">
              Explore companies <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link href="/compare" className="secondary-button">
              Compare companies
            </Link>
          </div>
        </div>

        <aside className="surface-card flex flex-col justify-between p-6 sm:p-7">
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#EEE9F8] text-[#6541C1]">
              <Building2 aria-hidden="true" size={19} />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.025em] text-[#201D29]">
              Built around company fundamentals
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#777281]">
              Start with a business profile, then explore its financial context
              and the questions worth asking.
            </p>
          </div>
          <Link
            href="/companies"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6541C1] hover:text-[#45258B]"
          >
            Browse the company directory
            <MoveUpRight aria-hidden="true" size={15} />
          </Link>
        </aside>
      </section>

      <aside className="demo-note flex items-start gap-3 px-4 py-3.5 text-xs leading-5">
        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6541C1]" />
        This public demo uses illustrative company and financial data. It is not
        live market information or investment advice.
      </aside>

      <section className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <div className="surface-card overflow-hidden">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E9E5EF] px-5 py-5 sm:px-6">
            <div>
              <p className="page-kicker">Company directory</p>
              <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em]">
                Start your research
              </h2>
            </div>
            <Link
              href="/companies"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6541C1] hover:text-[#45258B]"
            >
              View all <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </div>
          <div className="divide-y divide-[#F0EDF4]">
            {companies.map((company) => (
              <Link
                key={company.ticker}
                href={`/companies/${company.ticker}`}
                className="group flex items-center gap-3 px-5 py-4 transition hover:bg-[#FCFBFE] sm:px-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-[#EEE9F8] text-xs font-bold text-[#45258B]">
                  {company.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#302C39]">
                    {company.name}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-[#96919F]">
                    {company.industry}
                  </span>
                </span>
                <span className="hidden text-xs font-medium text-[#777281] sm:inline">
                  {company.ticker}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  size={16}
                  className="ml-1 shrink-0 text-[#B4AFBB] transition group-hover:translate-x-0.5 group-hover:text-[#6541C1]"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="px-1">
            <p className="page-kicker">Research tools</p>
            <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em]">
              Go deeper
            </h2>
          </div>
          <div className="space-y-2.5">
            {researchTools.map(({ href, label, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="surface-card group flex items-start gap-3.5 p-4 transition hover:border-[#D5CCE8]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] bg-[#F7F4FC] text-[#6541C1]">
                  <Icon aria-hidden="true" size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#302C39]">
                    {label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#777281]">
                    {description}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  size={15}
                  className="mt-1 shrink-0 text-[#B4AFBB] transition group-hover:translate-x-0.5 group-hover:text-[#6541C1]"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
