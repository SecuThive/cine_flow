export const metadata = {
  title: "Ad Disclosure | CineScout",
  description: "Transparency around CineScout's monetization and sponsorships.",
};

export default function AdDisclosurePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6">
        <section className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Ad disclosure</p>
            <h1 className="mt-2 text-3xl font-semibold">How we fund CineScout</h1>
          </header>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Display placements</h2>
            <p className="text-neutral-300">
              CineScout reserves specific slots near the header, between rails, and inside the footer for Google AdSense-compliant creative. Ads will always be labeled and separated from editorial content.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Affiliate links</h2>
            <p className="text-neutral-300">
              From time to time we may link to partner streaming services. If a link could generate commission, it will be marked &ldquo;affiliate&rdquo; so you can make an informed choice.
            </p>
          </div>

          <p className="text-sm text-neutral-400">
            Report a disclosure concern by emailing <a className="text-white" href="mailto:thive8564@gmail.com">thive8564@gmail.com</a>. We will investigate within two business days.
          </p>
        </section>
      </div>
    </main>
  );
}
