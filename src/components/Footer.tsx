import Link from "next/link";
import type { Route } from "next";

type InternalHref = Route | { pathname: Route; hash?: string };

type FooterLink = {
  label: string;
  href: InternalHref;
};

const footerNav: { title: string; links: FooterLink[] }[] = [
  {
    title: "Discover",
    links: [
      { label: "Search", href: { pathname: "/" as Route, hash: "search" } },
      { label: "Mood Lab", href: { pathname: "/" as Route, hash: "mood" } },
      { label: "Library", href: { pathname: "/" as Route, hash: "catalog" } },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" as Route },
      { label: "Press", href: "/" as Route },
      { label: "Creators", href: "/" as Route },
    ],
  },
  {
    title: "Policy",
    links: [
      { label: "Privacy", href: "/" as Route },
      { label: "Terms", href: "/" as Route },
      { label: "Ad Disclosure", href: "/" as Route },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-neutral-950 text-neutral-300">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">CineScout</p>
              <p className="text-2xl font-semibold text-white">Premium movie discovery for every mood.</p>
            </div>
            <p className="text-sm text-neutral-400">
              We comply with Google AdSense policies by keeping layouts clean, providing transparent navigation, and clearly labeling ad-supported zones. Reserved ad surfaces will never obstruct core content.
            </p>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-neutral-400">
              <p className="font-semibold text-neutral-100">Ad-ready placement</p>
              <p>
                Integrate display units here or between sections without modifying the surrounding UX. Follow AdSense viewability and density guidelines.
              </p>
            </div>
          </div>

          {footerNav.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">{group.title}</p>
              <ul className="space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={typeof link.href === "string" ? link.href : link.href}
                      className="text-neutral-300 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} CineScout. All rights reserved.</p>
          <p>
            Contact: <a href="mailto:support@cinescout.app" className="text-white">support@cinescout.app</a> · Last update {new Date().toLocaleDateString("en-US")}
          </p>
        </div>
      </div>
    </footer>
  );
}
