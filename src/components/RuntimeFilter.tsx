'use client';

import { useState, useTransition } from "react";
import { Loader2, TimerReset } from "lucide-react";
import { Movie } from "@/types/tmdb";
import { MovieCard } from "./MovieCard";

interface RuntimeFilterProps {
  defaultMovies: Movie[];
  shortRuntimeSeed: Movie[];
  maxMinutes?: number;
}

type FilterKey = "all" | "short";

export function RuntimeFilter({ defaultMovies, shortRuntimeSeed, maxMinutes = 120 }: RuntimeFilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("short");
  const [movies, setMovies] = useState<Movie[]>(shortRuntimeSeed);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (nextFilter: FilterKey) => {
    if (nextFilter === activeFilter) return;
    setActiveFilter(nextFilter);

    if (nextFilter === "all") {
      setMovies(defaultMovies);
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`/api/runtime?maxMinutes=${maxMinutes}&limit=12`);
        if (!response.ok) {
          throw new Error("Runtime API failed");
        }
        const data = (await response.json()) as { movies?: Movie[] };
        setMovies(data.movies ?? shortRuntimeSeed);
      } catch (err) {
        console.error(err);
        setError("We couldn't apply the runtime filter. Showing the base list instead.");
        setMovies(shortRuntimeSeed);
      }
    });
  };

  return (
    <section className="flex h-full flex-col rounded-3xl border border-white/10 bg-neutral-950/70 p-4 text-neutral-50 sm:p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-neutral-400 sm:text-xs">Runtime Filter</p>
          <div className="mt-1 flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <TimerReset className="h-5 w-5 text-accent" />
            <span>Movies Under 2 Hours</span>
          </div>
          <p className="text-sm text-neutral-400 sm:text-base">Perfect for late-night sessions when you want something short and punchy.</p>
        </div>
        <div className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-wide text-neutral-300 sm:w-auto">
          &le; {maxMinutes} min
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/30 p-1 text-sm font-semibold uppercase tracking-wide sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={() => handleFilterChange("short")}
          className={`flex-1 rounded-2xl px-4 py-2 transition ${
            activeFilter === "short" ? "bg-accent text-white" : "text-neutral-400 hover:text-white"
          }`}
        >
          Under 2h
        </button>
        <button
          type="button"
          onClick={() => handleFilterChange("all")}
          className={`flex-1 rounded-2xl px-4 py-2 transition ${
            activeFilter === "all" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white"
          }`}
        >
          All runtime
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-amber-400">{error}</p>}

      <div className="mt-6 flex-1 space-y-4">
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Applying runtime filter...
          </div>
        )}
        {movies.length === 0 ? (
          <p className="text-neutral-500">No films match this runtime right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movies.slice(0, 6).map((movie) => (
              <div key={`runtime-${movie.id}`} className="w-full">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
