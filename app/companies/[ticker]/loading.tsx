export default function LoadingCompanyProfile() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading company profile"
      className="space-y-7"
    >
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-32 bg-[#E9E5EF]" />
        <div className="flex gap-5">
          <div className="h-14 w-14 bg-[#E9E5EF]" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-4 w-36 bg-[#E9E5EF]" />
            <div className="h-8 w-64 max-w-full bg-[#E9E5EF]" />
            <div className="h-4 w-full max-w-2xl bg-[#E9E5EF]" />
          </div>
        </div>
        <div className="h-24 border border-[#E9E5EF] bg-white" />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="h-24 border border-[#E9E5EF] bg-white"
            />
          ))}
        </div>
        <div className="h-72 border border-[#E9E5EF] bg-white" />
      </div>
    </main>
  );
}
