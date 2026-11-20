export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold text-emerald-400">InvestIQ</h1>
        <span className="text-sm text-slate-400">
          Understand Before You Invest.
        </span>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Investment intelligence, simplified
        </p>

        <h2 className="text-4xl font-bold leading-tight md:text-6xl">
          Make sense of the market.
          <span className="block text-emerald-400">
            Invest with understanding.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Understand companies, explore financial reports, and compare
          investment opportunities with the help of AI-powered financial
          intelligence.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="rounded-lg bg-emerald-500 px-7 py-3 font-semibold text-slate-950">
            Explore companies
          </button>

          <button className="rounded-lg border border-slate-700 px-7 py-3 font-semibold">
            Ask InvestIQ
          </button>
        </div> 
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-6 pb-24 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-3 text-xl font-semibold">Company Intelligence</h3>
          <p className="text-slate-400">
            Explore company performance, revenue, profit and debt.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-3 text-xl font-semibold">AI Financial Assistant</h3>
          <p className="text-slate-400">
            Ask questions and understand complex financial concepts.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-3 text-xl font-semibold">Company Comparison</h3>
          <p className="text-slate-400">
            Compare companies using meaningful financial indicators.
          </p>
        </div>
      </section>
    </main>
  );
}
