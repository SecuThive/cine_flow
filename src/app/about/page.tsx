export const metadata = {
  title: "About | CineScout",
  description: "Learn about CineScout's cinematic discovery mission.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6">
        <section className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">About Cinescout</p>
            <h1 className="mt-2 text-3xl font-semibold">Premium movie discovery built for storytellers</h1>
          </header>
          <p className="text-neutral-300">
            CineScout curates theatrical-quality experiences with real-time TMDB data, mood-driven spotlights, and runtime-perfect playlists. We design every surface to feel cinematic while staying compliant with family-safe and AdSense policies.
          </p>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-neutral-900/60 p-6">
            <h2 className="text-xl font-semibold">What guides us</h2>
            <ul className="list-disc space-y-2 pl-6 text-neutral-300">
              <li>Spotlighting under-the-radar films alongside marquee premieres.</li>
              <li>Balancing immersive visuals with accessible navigation.</li>
              <li>Championing responsible monetization with transparent labeling.</li>
            </ul>
          </div>
          <p className="text-sm text-neutral-400">
            Questions about the roadmap or partnerships? Email us anytime at <a className="text-white" href="mailto:thive8564@gmail.com">thive8564@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
