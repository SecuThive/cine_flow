export const metadata = {
  title: "Terms of Service | CineScout",
  description: "Read the CineScout usage guidelines and legal terms.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6">
        <section className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Terms</p>
            <h1 className="mt-2 text-3xl font-semibold">Service guidelines & responsibilities</h1>
          </header>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Using CineScout</h2>
            <ul className="list-disc space-y-2 pl-6 text-neutral-300">
              <li>Content is sourced from TMDB and other licensors; redistribution requires permission.</li>
              <li>APIs and automation must respect rate limits and avoid scraping protected endpoints.</li>
              <li>User-submitted feedback becomes part of future updates without royalty obligations.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Liability</h2>
            <p className="text-neutral-300">
              The service is provided &ldquo;as is&rdquo; without warranty. CineScout is not responsible for third-party outages, inaccurate metadata, or issues caused by embedded media providers.
            </p>
          </div>

          <p className="text-sm text-neutral-400">
            Questions about these terms? Reach us at <a className="text-white" href="mailto:thive8564@gmail.com">thive8564@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
