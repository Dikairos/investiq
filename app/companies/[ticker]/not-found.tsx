import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function CompanyNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <section className="surface-card w-full max-w-md px-7 py-10 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center bg-[#EEE9F8] text-[#6541C1]">
          <SearchX aria-hidden="true" size={26} />
        </span>
        <h1 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#201D29]">
          Company profile not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#777281]">
          We don&apos;t have a company profile for that ticker yet. Browse the
          available companies to find a profile.
        </p>
        <Link
          href="/companies"
          className="primary-button mt-6"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to exploration
        </Link>
      </section>
    </main>
  );
}
