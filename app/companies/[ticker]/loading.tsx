export default function LoadingCompanyProfile() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading company profile"
      className="min-h-screen bg-slate-950 px-6 py-10 text-white"
    >
      <div className="mx-auto max-w-6xl animate-pulse space-y-8">
        <div className="h-8 w-32 rounded bg-slate-800" />
        <div className="flex gap-5">
          <div className="h-20 w-20 rounded-2xl bg-slate-800" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-4 w-36 rounded bg-slate-800" />
            <div className="h-9 w-64 max-w-full rounded bg-slate-800" />
            <div className="h-4 w-full max-w-2xl rounded bg-slate-800" />
          </div>
        </div>
        <div className="h-20 rounded-xl bg-slate-900" />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="h-28 rounded-xl border border-slate-800 bg-slate-900"
            />
          ))}
        </div>
        <div className="h-72 rounded-xl border border-slate-800 bg-slate-900" />
      </div>
    </main>
  );
}
