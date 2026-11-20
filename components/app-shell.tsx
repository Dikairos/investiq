"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  ChartNoAxesCombined,
  FileSearch,
  GitCompareArrows,
  LayoutDashboard,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navigation: Array<{
  href: string;
  label: string;
  icon: LucideIcon;
}> = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/companies", label: "Companies", icon: Search },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/reports", label: "Report analysis", icon: FileSearch },
  { href: "/assistant", label: "AI assistant", icon: Bot },
];

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/companies/")) return "Company profile";
  return (
    navigation.find((item) => item.href === pathname)?.label ??
    "Investment research"
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="InvestIQ home">
      <span className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#6541C1] text-white">
        <ChartNoAxesCombined aria-hidden="true" size={19} strokeWidth={2.2} />
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-[#201D29]">
        Invest<span className="text-[#6541C1]">IQ</span>
      </span>
    </Link>
  );
}

function NavigationLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {navigation.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/"
            ? pathname === href
            : pathname === href ||
              (href === "/companies" && pathname.startsWith("/companies/"));

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`group flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-[13px] font-medium transition ${
              active
                ? "bg-[#EEE9F8] text-[#45258B]"
                : "text-[#777281] hover:bg-[#F7F6FA] hover:text-[#201D29]"
            }`}
          >
            <Icon
              aria-hidden="true"
              size={17}
              strokeWidth={active ? 2 : 1.8}
              className={
                active
                  ? "text-[#6541C1]"
                  : "text-[#96919F] group-hover:text-[#6541C1]"
              }
            />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[var(--border)] bg-white px-5 py-6 lg:flex">
        <Brand />
        <p className="mb-3 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A19BAA]">
          Workspace
        </p>
        <nav aria-label="Primary navigation" className="space-y-1">
          <NavigationLinks pathname={pathname} />
        </nav>

        <div className="mt-auto border-t border-[var(--border)] pt-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#777281]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#23966B]" />
            Demo environment
          </div>
          <p className="mt-2 text-xs leading-5 text-[#96919F]">
            Company and financial figures are illustrative sample data.
          </p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white">
          <div className="mx-auto flex min-h-[68px] max-w-[1480px] items-center justify-between gap-4 px-5 md:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <span className="lg:hidden">
                <Brand />
              </span>
              <div className="hidden min-w-0 lg:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A19BAA]">
                  InvestIQ / Research
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-[#302C39]">
                  {pageTitle}
                </p>
              </div>
              <span className="h-5 w-px bg-[var(--border)] lg:hidden" />
              <p className="truncate text-sm font-medium text-[#514D59] lg:hidden">
                {pageTitle}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden items-center gap-2 border border-[#E9E5EF] px-2.5 py-1.5 text-[11px] font-medium text-[#777281] sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#23966B]" />
                Sample data
              </span>
              <Link
                href="/companies"
                className="inline-flex h-9 items-center gap-2 rounded-[5px] bg-[#6541C1] px-3.5 text-xs font-semibold text-white transition hover:bg-[#45258B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6541C1]"
              >
                Explore companies
              </Link>
            </div>
          </div>
          <nav
            aria-label="Mobile navigation"
            className="flex gap-1 overflow-x-auto border-t border-[#F0EDF4] px-4 py-2 lg:hidden"
          >
            {navigation.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/"
                  ? pathname === href
                  : pathname === href ||
                    (href === "/companies" &&
                      pathname.startsWith("/companies/"));

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-[4px] px-3 py-2 text-xs font-medium ${
                    active
                      ? "bg-[#EEE9F8] text-[#45258B]"
                      : "text-[#777281] hover:bg-[#F7F6FA]"
                  }`}
                >
                  <Icon aria-hidden="true" size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="mx-auto w-full max-w-[1480px] px-5 py-7 md:px-8 md:py-9">
          {children}
        </div>
      </div>
    </div>
  );
}
