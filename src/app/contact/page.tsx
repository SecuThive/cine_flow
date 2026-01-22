export const metadata = {
  title: "Contact | CineScout",
  description: "Reach the CineScout team for partnerships, support, or press.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6">
        <section className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Contact</p>
            <h1 className="mt-2 text-3xl font-semibold">We read every note</h1>
            <p className="text-sm text-neutral-400">Tell us what you want next, report an issue, or pitch a collaboration.</p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-white/10 bg-neutral-900/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Email</p>
              <a href="mailto:thive8564@gmail.com" className="text-2xl font-semibold text-white">thive8564@gmail.com</a>
              <p className="text-sm text-neutral-400">Fastest way to reach the team. We usually reply within 1 business day.</p>
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-neutral-900/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Support hours</p>
              <p className="text-2xl font-semibold">10:00–18:00 KST</p>
              <p className="text-sm text-neutral-400">We monitor inboxes daily for uptime or billing issues.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">What to include</h2>
            <ul className="list-disc space-y-2 pl-6 text-neutral-300">
              <li>Links or screenshots that describe the bug, film request, or idea.</li>
              <li>Your preferred reply window so we can match your timezone.</li>
              <li>Optional: social handles to credit if we feature your curation.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
