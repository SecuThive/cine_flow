import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { Movie } from "@/types/tmdb";
import { getBackdropUrl } from "@/lib/tmdb";

interface HeroSectionProps {
  movie?: Movie;
}

export function HeroSection({ movie }: HeroSectionProps) {
  const backdropUrl = getBackdropUrl(movie?.backdrop_path ?? null);

  const formattedReleaseDate = (() => {
    if (!movie?.release_date) return "Coming Soon";
    const date = new Date(movie.release_date);
    if (Number.isNaN(date.getTime())) return "Coming Soon";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  })();

  return (
    <section className="relative isolate min-h-[70vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie?.title ?? "Featured movie backdrop"}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end gap-6 p-8 md:p-14">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">Featured spotlight</p>
        <div className="max-w-4xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            {movie?.title ?? "Curated for Cinephiles"}
          </h1>
          <p className="text-base text-neutral-300 md:text-xl">
            {movie?.overview ?? "Dive into hand-picked cinematic worlds, exclusive premieres, and cult classics powered by the TMDB universe."}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
            <span>{formattedReleaseDate}</span>
            <span>Rating {movie ? (movie.vote_average?.toFixed(1) ?? "8.5") : "8.5"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-accent/30 transition hover:bg-accent/90"
          >
            <Play className="h-4 w-4" /> Watch Trailer
          </button>
          <Link
            href="#catalog"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white"
          >
            <Info className="h-4 w-4" /> More Info
          </Link>
        </div>
      </div>
    </section>
  );
}
