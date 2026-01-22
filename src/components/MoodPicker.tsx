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
  { label: "우울해요", value: "우울해" },
  { label: "스릴 찾고 싶어요", value: "스릴이 필요해" },
  { label: "설레는 기분", value: "설레는 로맨스" },
  { label: "집중하고 싶어요", value: "몰입감 있는 영화" },
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
      setError("기분을 입력해 주세요.");
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
        setError("AI 추천을 불러오는 데 실패했어요. 잠시 후 다시 시도해 주세요.");
      }
    });
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-6 text-neutral-50 shadow-2xl">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">Mood Picker</p>
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <Sparkles className="h-5 w-5 text-accent" />
          <span>오늘 기분이 어때?</span>
        </div>
        <p className="text-sm text-neutral-400">기분을 입력하면 AI가 분위기에 맞는 큐레이션과 영화를 추천해요.</p>
      </header>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <label className="block text-xs uppercase tracking-[0.3em] text-neutral-500">Mood</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={inputMood}
            onChange={(event) => setInputMood(event.target.value)}
            placeholder="예: 우울해, 설레는 영화 보고 싶어"
            className="flex-1 rounded-2xl border border-white/15 bg-neutral-900/60 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-2xl bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-accent/30 transition hover:bg-accent/90"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "추천 받기"}
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-3">
        {presetMoods.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => handlePreset(preset.value)}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-neutral-200 transition hover:border-accent/60 hover:text-white"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">AI Highlight</p>
        <p className="text-lg font-semibold text-neutral-100">
          {recommendation?.profile?.title ?? "감성 맞춤 추천 대기 중"}
        </p>
        <p className="text-sm text-neutral-400">
          {recommendation?.narrative ??
            "기본 추천을 먼저 보여드릴게요. 기분을 입력하면 맞춤형 문장과 영화를 큐레이션해 드려요."}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isPending && activeMovies.length === 0 ? (
          <div className="col-span-full flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            결과를 불러오는 중...
          </div>
        ) : activeMovies.length > 0 ? (
          activeMovies.map((movie) => <MovieCard key={`mood-${movie.id}`} movie={movie} />)
        ) : (
          <p className="text-neutral-500">추천을 불러오면 영화가 여기에 나타나요.</p>
        )}
      </div>
    </section>
  );
}
