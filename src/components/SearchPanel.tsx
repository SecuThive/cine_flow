'use client';

import { FormEvent, useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { Movie } from "@/types/tmdb";
import { MovieCard } from "./MovieCard";

interface SearchPanelProps {
  initialShowcase: Movie[];
}

export function SearchPanel({ initialShowcase }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>(initialShowcase);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setError("Type a movie title, actor, or keyword.");
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (!response.ok) {
          throw new Error("Search API failed");
        }
        const data = (await response.json()) as { movies?: Movie[] };
        setResults(data.movies ?? []);
        setHasSearched(true);
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please retry in a moment.");
      }
    });
  };

  const headline = hasSearched
    ? results.length > 0
      ? `Results for "${query}"`
      : `No matches for "${query}"`
    : "Featured search picks";

  return (
    <section id="search" className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-4 sm:p-6">
      <header className="flex flex-col gap-1 text-neutral-50">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-neutral-500 sm:text-xs">Search the catalog</p>
        <h2 className="text-xl font-semibold sm:text-2xl">Find anything in seconds</h2>
        <p className="text-sm text-neutral-400 sm:text-base">Powered by TMDB. Use natural language queries to surface hidden gems.</p>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for Dune, Margot Robbie, heist comedy..."
            className="w-full rounded-2xl border border-white/15 bg-neutral-900/70 px-12 py-3 text-base text-neutral-100 outline-none transition focus:border-accent sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-2xl bg-accent px-6 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-accent/20 transition hover:bg-accent/90 sm:w-auto sm:text-sm"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">{headline}</p>
        {isPending ? (
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Crunching TMDB results...
          </div>
        ) : results.length === 0 ? (
          <p className="text-sm text-neutral-500">Try another keyword or explore trending rails below.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 justify-items-center sm:grid-cols-2 sm:justify-items-stretch lg:grid-cols-4 xl:grid-cols-5">
            {results.map((movie) => (
              <div key={`search-${movie.id}`} className="w-full max-w-[220px] sm:max-w-none">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
