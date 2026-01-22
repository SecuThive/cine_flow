'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  Play,
  X,
} from "lucide-react";
import { Movie, MovieDetails } from "@/types/tmdb";
import { getBackdropUrl, getPosterUrl } from "@/lib/tmdb";

interface MovieDetailModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

interface MovieDetailResponse {
  movie: MovieDetails;
}

export function MovieDetailModal({ movie, isOpen, onClose }: MovieDetailModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  const activeBackdrop = getBackdropUrl(details?.backdrop_path ?? movie.backdrop_path, "w780");
  const activePoster = getPosterUrl(details?.poster_path ?? movie.poster_path, "w500");

  const releaseLabel = (() => {
    const raw = details?.release_date ?? movie.release_date;
    if (!raw) return "Release TBA";
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  })();

  const runtimeLabel = (() => {
    const runtime = details?.runtime;
    if (!runtime) return "Runtime TBA";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  })();

  const genreNames = (details?.genres ?? []).map((genre) => genre.name);
  const languageLabel = (details?.spoken_languages ?? [])
    .map((lang) => lang.english_name || lang.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
  const locationLabel = (details?.production_countries ?? [])
    .map((country) => country.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  const trailer = details?.videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer");
  const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  const cast = details?.credits?.cast?.slice(0, 4) ?? [];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isActive = true;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetch(`/api/movie/${movie.id}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }
        return response.json();
      })
      .then((payload: MovieDetailResponse) => {
        if (!isActive) return;
        setDetails(payload.movie);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error(err);
        if (!isActive) return;
        setError("Unable to load full details right now.");
        setDetails(null);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [isOpen, movie.id, requestKey]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen, onClose]);

  const handleRetry = () => setRequestKey((prev) => prev + 1);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 sm:py-10">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <article className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 text-neutral-50 shadow-2xl">
        <div className="relative h-48 w-full sm:h-64">
          {activeBackdrop && (
            <Image src={activeBackdrop} alt={movie.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 1024px" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-white transition hover:border-white"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            {activePoster && (
              <div className="relative h-40 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 sm:h-48 sm:w-32">
                <Image src={activePoster} alt={`${movie.title} poster`} fill sizes="128px" className="object-cover" />
              </div>
            )}
            <div className="space-y-2 text-white">
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-300">{releaseLabel}</p>
              <h3 className="text-2xl font-semibold sm:text-3xl">{details?.title ?? movie.title}</h3>
              <p className="text-sm text-neutral-300">
                {details?.tagline || details?.overview || movie.overview || 'Immerse yourself in this cinematic pick.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-4 py-6 sm:px-8">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Fetching studio-grade details...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
              <p>{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-white transition hover:border-white"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-neutral-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
                  <Clock3 className="h-4 w-4 text-accent" /> {runtimeLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
                  <CalendarDays className="h-4 w-4 text-accent" /> {releaseLabel}
                </span>
                {languageLabel && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
                    <Globe className="h-4 w-4 text-accent" /> {languageLabel}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-neutral-300">
                <p>{details?.overview || movie.overview}</p>
                {genreNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {genreNames.map((genre) => (
                      <span key={genre} className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-neutral-200">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {(locationLabel || details?.status) && (
                <div className="grid gap-3 text-sm text-neutral-400 sm:grid-cols-2">
                  {locationLabel && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Production</p>
                        <p className="text-neutral-100">{locationLabel}</p>
                      </div>
                    </div>
                  )}
                  {details?.status && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Status</p>
                      <p className="text-neutral-100">{details.status}</p>
                    </div>
                  )}
                </div>
              )}

              {cast.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Featured cast</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {cast.map((member) => (
                      <div key={`${member.id}-${member.order}`} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-sm font-semibold text-white">{member.name}</p>
                        <p className="text-xs text-neutral-400">as {member.character || "Unknown"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {trailerUrl && (
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-accent/30 transition hover:bg-accent/90"
                  >
                    <Play className="h-4 w-4" /> Watch trailer
                  </a>
                )}
                {details?.homepage && (
                  <a
                    href={details.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white"
                  >
                    <ExternalLink className="h-4 w-4" /> Visit site
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
