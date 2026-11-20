import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function CompanyNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-emerald-400">
          <SearchX aria-hidden="true" size={26} />
        </span>
        <h1 className="mt-6 text-2xl font-bold">Company profile not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          We don&apos;t have a company profile for that ticker yet. Browse the
          available companies to find a profile.
        </p>
        <Link
          href="/companies"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to exploration
        </Link>
      </section>
    </main>
  );
}
