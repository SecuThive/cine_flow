'use client';

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, Compass, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";
import { Movie } from "@/types/tmdb";
import { getPosterUrl } from "@/lib/tmdb";

interface SiteHeaderProps {
  spotlight: Movie[];
}

const navLinks = [
  { label: "Search", hash: "search" },
  { label: "Library", hash: "catalog" },
  { label: "Mood Lab", hash: "mood" },
];

const publishingStats = [
  { label: "Projects Published", value: "5", detail: "Showcased today" },
  { label: "Live Launches", value: "2", detail: "Streaming now" },
  { label: "In Pipeline", value: "3", detail: "Curated pitches" },
];

export function SiteHeader({ spotlight }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>(spotlight);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setResults(spotlight);
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (!response.ok) {
          throw new Error("Search API failed");
        }
        const data = (await response.json()) as { movies?: Movie[] };
        setResults(data.movies ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch titles right now.");
      }
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setQuery("");
    setResults(spotlight);
    setError(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-b from-neutral-950 via-neutral-950/95 to-neutral-900/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-semibold tracking-tight text-white">
            Cine Flow
          </Link>
          <span className="hidden text-xs uppercase tracking-[0.4em] text-neutral-500 md:inline-flex">
            Premium Discovery
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm uppercase tracking-wide text-neutral-400 md:flex">
          {navLinks.map((item) => (
            <Link key={item.hash} href={{ pathname: "/", hash: item.hash }} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={{ pathname: "/", hash: "search" }}
            className="hidden rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-100 transition hover:border-white md:inline-flex"
          >
            <Search className="mr-2 h-3.5 w-3.5" /> Quick Search
          </Link>
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-white/20 bg-black/40 p-2 text-white transition hover:border-white md:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-sm">
          <div className="ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto border-l border-white/10 bg-neutral-950 p-6 text-neutral-50 sm:w-11/12">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Navigation</p>
                <h3 className="text-xl font-semibold">Dive into Cine Flow</h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/15 p-2 hover:border-white"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {navLinks.map((item) => (
                <Link
                  key={item.hash}
                  href={{ pathname: "/", hash: item.hash }}
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-100"
                >
                  {item.label}
                  <Compass className="h-4 w-4 text-accent" />
                </Link>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Search instantly</p>
              <div className="flex items-center rounded-2xl border border-white/15 bg-neutral-900/70 px-3">
                <Search className="h-4 w-4 text-neutral-500" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    handleSearch(event.target.value);
                  }}
                  placeholder="Find titles, cast, moods..."
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-neutral-50 outline-none"
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            <div className="mt-6 flex-1 overflow-y-auto">
              {isPending ? (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Search className="h-4 w-4 animate-spin" /> Fetching titles...
                </div>
              ) : results.length === 0 ? (
                <p className="text-sm text-neutral-500">No matches yet. Try another mood or actor.</p>
              ) : (
                <ul className="space-y-3">
                  {results.slice(0, 6).map((movie) => {
                    const poster = getPosterUrl(movie.poster_path, "w185");
                    return (
                      <li key={`nav-search-${movie.id}`} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        {poster ? (
                          <Image src={poster} alt={movie.title} width={48} height={64} className="rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-neutral-800 text-xs text-neutral-500">
                            N/A
                          </div>
                        )}
                        <div className="flex flex-col text-sm">
                          <span className="font-semibold text-neutral-50">{movie.title}</span>
                          <span className="text-xs text-neutral-400">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
