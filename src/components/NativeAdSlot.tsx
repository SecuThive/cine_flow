"use client";

import Script from "next/script";

const AD_CONTAINER_ID = "container-3f4c53eebd7768890dfb24869ef10781";
const AD_SCRIPT_SRC = "https://pl28583384.effectivegatecpm.com/3f4c53eebd7768890dfb24869ef10781/invoke.js";

export function NativeAdSlot() {
  return (
    <section className="rounded-3xl border border-neutral-900 bg-neutral-900/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
          <span className="font-semibold">Partner Spotlight</span>
        </div>
        <p className="text-sm text-neutral-400">
          Discover offers and services curated to complement your streaming experience.
        </p>
        <div
          id={AD_CONTAINER_ID}
          className="min-h-[200px] rounded-2xl border border-neutral-800 bg-neutral-950/70"
        />
      </div>
      {/* Load the native ad script only on the client to keep hydration clean. */}
      <Script
        id="effectivegate-native"
        src={AD_SCRIPT_SRC}
        strategy="afterInteractive"
        async
        data-cfasync="false"
      />
    </section>
  );
}
