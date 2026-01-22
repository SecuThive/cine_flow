"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import clsx from "clsx";
import { Movie } from "@/types/tmdb";
import { getPosterUrl } from "@/lib/tmdb";
import { NetflixIcon, DisneyPlusIcon } from "@/components/icons/StreamingIcons";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path);
  const ratingValue = Number(movie.vote_average?.toFixed(1) ?? 0);
  const ratingPercentage = Math.min(Math.max(ratingValue / 10, 0), 1);

  const releaseYear = (() => {
    if (!movie.release_date) return "TBA";
    const year = new Date(movie.release_date).getFullYear();
    return Number.isNaN(year) ? "TBA" : year;
  })();

  const providers = (() => {
    const genres = movie.genre_ids ?? [];
    const selections: { id: "netflix" | "disney"; label: string }[] = [];

    const isFamily = genres.some((id) => [16, 35, 10751].includes(id));
    const isAdventure = genres.some((id) => [12, 14].includes(id));
    const isAction = genres.some((id) => [28, 53, 80].includes(id));

    if (isFamily || isAdventure) {
      selections.push({ id: "disney", label: "Disney+" });
    }

    if (isAction || selections.length === 0) {
      selections.push({ id: "netflix", label: "Netflix" });
    }

    return selections.slice(0, 2);
  })();

  return (
    <article
      className="group relative aspect-[2/3] w-full min-w-0 snap-start cursor-pointer overflow-hidden rounded-xl bg-neutral-900 shadow-poster transition duration-300 ease-out hover:scale-105 sm:min-w-[180px] sm:max-w-[220px]"
      aria-label={movie.title}
    >
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, 220px"
          className="object-cover"
          priority={false}
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-b from-neutral-800 to-neutral-950">
          <span className="text-sm text-neutral-500">Poster unavailable</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-black/40 transition-opacity duration-300 group-hover:opacity-90" />

      <div className="absolute left-3 top-3 flex items-center gap-2">
        <div
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60"
          aria-label={`Rating ${ratingValue}`}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#e50914 ${ratingPercentage * 360}deg, rgba(255,255,255,0.1) 0deg)`,
            }}
          />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black">
            <div className="flex items-baseline gap-1 text-sm font-semibold">
              <Star className="h-3 w-3 text-amber-400" />
              <span>{ratingValue.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 shadow-lg"
            aria-label={`Available on ${provider.label}`}
          >
            {provider.id === "netflix" ? (
              <NetflixIcon className="h-4 w-4" />
            ) : (
              <DisneyPlusIcon className="h-4 w-6" />
            )}
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
        <p className="text-xs uppercase tracking-widest text-neutral-400">{releaseYear}</p>
        <h3 className="text-lg font-semibold leading-tight line-clamp-2">{movie.title}</h3>
        <p className="mt-1 text-xs text-neutral-400 line-clamp-2">{movie.overview}</p>
        <button
          type="button"
          className="mt-3 w-full rounded-full border border-white/30 px-3 py-1.5 text-sm font-medium uppercase tracking-wide text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-white"
        >
          Quick View
        </button>
      </div>

      <div
        className={clsx(
          "pointer-events-none absolute inset-0 border border-white/10 opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100"
        )}
      />
    </article>
  );
}
