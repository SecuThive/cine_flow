'use client';

import { FormEvent, useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Movie } from "@/types/tmdb";
import { MovieCard } from "./MovieCard";

interface MoodPickerProps {
  initialSpotlight?: Movie[];
}

interface MoodRecommendation {
  mood: string;
  narrative: string;
  movies: Movie[];
  profile: { title: string; tone: string };
}

const presetMoods = [
  { label: "Need a pick-me-up", value: "I feel low and need a feel-good comedy" },
  { label: "Crave adrenaline", value: "I want an intense thriller tonight" },
  { label: "Date-night vibes", value: "In the mood for a romantic story" },
  { label: "Mind needs focus", value: "I want an immersive mystery" },
];

export function MoodPicker({ initialSpotlight = [] }: MoodPickerProps) {
  const [inputMood, setInputMood] = useState("");
  const [recommendation, setRecommendation] = useState<MoodRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeMovies = recommendation?.movies?.length ? recommendation.movies : initialSpotlight;

  const handlePreset = (value: string) => {
    setInputMood(value);
    requestMood(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputMood.trim()) {
      setError("Please tell us how you're feeling.");
      return;
    }
    requestMood(inputMood.trim());
  };

  const requestMood = (mood: string) => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch("/api/mood", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood }),
        });

        if (!response.ok) {
          throw new Error("Mood API failed");
        }

        const data = (await response.json()) as MoodRecommendation;
        setRecommendation(data);
      } catch (err) {
        console.error(err);
        setError("We couldn't fetch an AI recommendation. Please try again shortly.");
      }
    });
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-4 text-neutral-50 shadow-2xl sm:p-6">
      <header className="flex flex-col gap-2 text-center sm:text-left">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-neutral-400 sm:text-xs">Mood Picker</p>
        <div className="flex items-center justify-center gap-2 text-xl font-semibold sm:justify-start sm:text-2xl">
          <Sparkles className="h-5 w-5 text-accent" />
          <span>What&rsquo;s your mood today?</span>
        </div>
        <p className="text-sm text-neutral-400 sm:text-base">
          Describe your vibe and let AI craft a tailored narrative plus matching films.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <label className="block text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500 sm:text-xs">Mood</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={inputMood}
            onChange={(event) => setInputMood(event.target.value)}
            placeholder="e.g. Feeling drained, want something uplifting"
            className="flex-1 rounded-2xl border border-white/15 bg-neutral-900/60 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-accent"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-accent/30 transition hover:bg-accent/90 sm:w-auto"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get recommendations"}
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {presetMoods.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => handlePreset(preset.value)}
            className="rounded-full border border-white/10 px-3 py-2 text-[0.6rem] uppercase tracking-wide text-neutral-200 transition hover:border-accent/60 hover:text-white sm:px-4 sm:text-xs"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">AI Highlight</p>
        <p className="text-lg font-semibold text-neutral-100">
          {recommendation?.profile?.title ?? "Waiting for a mood"}
        </p>
        <p className="text-sm text-neutral-400">
          {recommendation?.narrative ??
            "Preview picks are below. Tell us your mood to unlock AI-curated copy and selections."}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {isPending && activeMovies.length === 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Gathering fresh titles...
          </div>
        )}
        {activeMovies.length > 0 ? (
          <>
            <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2 sm:hidden snap-x snap-mandatory">
              {activeMovies.map((movie) => (
                <div key={`mood-mobile-${movie.id}`} className="w-full min-w-full snap-center">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
            <div className="hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {activeMovies.map((movie) => (
                <MovieCard key={`mood-${movie.id}`} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-neutral-500 sm:text-left">Your recommendations will appear here.</p>
        )}
      </div>
    </section>
  );
}
