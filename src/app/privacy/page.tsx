export const metadata = {
  title: "Privacy Policy | CineScout",
  description: "Understand how CineScout handles data and cookies.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6">
        <section className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Privacy</p>
            <h1 className="mt-2 text-3xl font-semibold">Your data, handled with care</h1>
            <p className="text-sm text-neutral-400">CineScout collects only the information required to power recommendations and keep the platform secure.</p>
          </header>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Information we process</h2>
            <ul className="list-disc space-y-2 pl-6 text-neutral-300">
              <li>Anonymous analytics (page views, clicks) used to improve curation.</li>
              <li>Server logs that help us monitor uptime and prevent abuse.</li>
              <li>Optional email metadata if you contact us at <a className="text-white" href="mailto:thive8564@gmail.com">thive8564@gmail.com</a>.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Cookies & advertising</h2>
            <p className="text-neutral-300">
              We rely on first-party cookies to remember interface preferences. Some pages may host Google AdSense units; those services may set additional cookies compliant with personalized-ad regulations.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-neutral-900/60 p-6 text-sm text-neutral-300">
            <p className="font-semibold text-white">Need more details?</p>
            <p>
              Email <a className="text-white" href="mailto:thive8564@gmail.com">thive8564@gmail.com</a> with “Privacy Inquiry” in the subject. We respond within 72 hours.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
