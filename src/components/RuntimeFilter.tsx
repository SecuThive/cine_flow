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
        setError("런타임 조건을 적용하지 못했어요. 기본 목록을 보여드릴게요.");
        setMovies(shortRuntimeSeed);
      }
    });
  };

  return (
    <section className="flex h-full flex-col rounded-3xl border border-white/10 bg-neutral-950/70 p-6 text-neutral-50">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">Runtime Filter</p>
          <div className="mt-1 flex items-center gap-2 text-xl font-semibold">
            <TimerReset className="h-5 w-5 text-accent" />
            <span>2시간 이내 영화</span>
          </div>
          <p className="text-sm text-neutral-400">자기 전 가볍게 볼 짧은 러닝타임 작품만 모았어요.</p>
        </div>
        <div className="shrink-0 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-wide text-neutral-300">
          {maxMinutes}분 이하
        </div>
      </header>

      <div className="mt-6 flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-1 text-sm font-semibold uppercase tracking-wide">
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

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            러닝타임 필터 적용 중...
          </div>
        )}
        {movies.length === 0 ? (
          <p className="text-neutral-500">조건에 맞는 영화가 없습니다.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {movies.slice(0, 6).map((movie) => (
              <MovieCard key={`runtime-${movie.id}`} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
