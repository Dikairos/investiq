import Link from "next/link";

export default function Home() {
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
        <nav className="flex items-center gap-3 sm:gap-8">
          <span className="hidden text-sm text-slate-400 lg:inline">
            Understand Before You Invest.
          </span>
          <Link
            href="/companies"
            className="text-xs font-semibold text-slate-200 transition hover:text-emerald-400 sm:text-sm"
          >
            Explore companies
          </Link>
          <Link
            href="/reports"
            className="text-xs font-semibold text-slate-200 transition hover:text-emerald-400 sm:text-sm"
          >
            Analyze reports
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Investment intelligence, simplified
        </p>

        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          Make sense of the market.
          <span className="block text-emerald-400">
            Invest with understanding.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Explore company profiles, compare illustrative metrics, and try the
          assistant and report tools with clear demo labels.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/companies"
            className="rounded-lg bg-emerald-500 px-7 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Explore companies
          </Link>

          <Link
            href="/assistant"
            className="rounded-lg border border-slate-700 px-7 py-3 font-semibold transition hover:border-emerald-500/60 hover:text-emerald-300"
          >
            Ask InvestIQ
          </Link>
        </div> 
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/companies"
          className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500/60 focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          <h3 className="mb-3 text-xl font-semibold">Company Intelligence</h3>
          <p className="text-slate-400">
            Explore company profiles and clearly labeled sample financial data.
          </p>
        </Link>

        <Link
          href="/assistant"
          className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500/60 focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          <h3 className="mb-3 text-xl font-semibold">AI Financial Assistant</h3>
          <p className="text-slate-400">
            Ask sample questions and see when responses use local demo data.
          </p>
        </Link>

        <Link
          href="/compare"
          className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500/60 focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          <h3 className="mb-3 text-xl font-semibold">Company Comparison</h3>
          <p className="text-slate-400">
            Compare companies using meaningful financial indicators.
          </p>
          <p className="mt-4 text-sm font-semibold text-emerald-400">
            Compare companies →
          </p>
        </Link>

        <Link
          href="/reports"
          className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500/60 focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          <h3 className="mb-3 text-xl font-semibold">Report Analysis</h3>
          <p className="text-slate-400">
            Select a PDF and explore a clearly labeled sample analysis.
          </p>
        </Link>
      </section>
    </main>
  );
}
