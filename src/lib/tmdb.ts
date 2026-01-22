import { Movie, MovieDetails, TmdbImageSize, TmdbListResponse } from "@/types/tmdb";

const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const DEFAULT_POSTER_SIZE: TmdbImageSize = "w500";
const DEFAULT_BACKDROP_SIZE: TmdbImageSize = "original";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchFromTmdb<T>(endpoint: string, searchParams?: Record<string, string | number>): Promise<T> {
  if (!TMDB_API_KEY) {
    console.warn("TMDB_API_KEY is not set. Returning empty data set.");
    return Promise.resolve({} as T);
  }

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.set("language", "en-US");
  url.searchParams.set("api_key", TMDB_API_KEY);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url, { next: { revalidate: 60 } });

  if (!response.ok) {
    console.error(`TMDB request failed: ${response.statusText}`);
    throw new Error("Failed to fetch data from TMDB");
  }

  return response.json();
}

export async function getMovies(category: "popular" | "top_rated" | "upcoming", page = 1): Promise<Movie[]> {
  try {
    const data = await fetchFromTmdb<TmdbListResponse<Movie>>(`/movie/${category}`, { page });
    return data.results ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function discoverMovies(params?: Record<string, string | number>, limit = 20): Promise<Movie[]> {
  try {
    const data = await fetchFromTmdb<TmdbListResponse<Movie>>("/discover/movie", params);
    return (data.results ?? []).slice(0, limit);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMoviesByRuntime(maxMinutes: number, limit = 12): Promise<Movie[]> {
  return discoverMovies(
    {
      sort_by: "popularity.desc",
      "with_runtime.lte": maxMinutes,
      include_adult: "false",
    },
    limit
  );
}

export async function getMovieDetails(id: number): Promise<MovieDetails | null> {
  try {
    const data = await fetchFromTmdb<MovieDetails>(`/movie/${id}`, {
      append_to_response: "credits,videos",
    });
    return data ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type MoodKey = "comfort" | "adrenaline" | "romance" | "curious" | "uplift";

interface MoodProfile {
  key: MoodKey;
  title: string;
  tone: string;
  genres: string;
  sortBy: string;
  runtimeLte?: number;
  voteAverageGte?: number;
}

const moodProfiles: Record<MoodKey, MoodProfile> = {
  comfort: {
    key: "comfort",
    title: "Feel-Good Comedy",
    tone: "Gentle humor and cuddle-core optimism",
    genres: "35,10751",
    sortBy: "vote_average.desc",
    voteAverageGte: 6,
  },
  adrenaline: {
    key: "adrenaline",
    title: "Pulse-Raising Thrillers",
    tone: "High-adrenaline chases and suspense",
    genres: "28,53",
    sortBy: "popularity.desc",
  },
  romance: {
    key: "romance",
    title: "Heartflutter Romance",
    tone: "Emotion-packed love stories",
    genres: "10749,18",
    sortBy: "vote_average.desc",
  },
  curious: {
    key: "curious",
    title: "Immersive Mysteries",
    tone: "Mind-twisting cinema",
    genres: "9648,18",
    sortBy: "popularity.desc",
  },
  uplift: {
    key: "uplift",
    title: "Uplifting Journeys",
    tone: "Warm, human-centered storytelling",
    genres: "18,16",
    sortBy: "vote_average.desc",
  },
};

const moodKeywordMap: Record<MoodKey, string[]> = {
  comfort: ["sad", "blue", "low", "comfort", "우울", "침체", "down"],
  adrenaline: ["thrill", "bored", "adrenaline", "action", "지루", "스릴", "액션", "짜릿"],
  romance: ["love", "romance", "date", "설레", "데이트"],
  curious: ["mystery", "focus", "curious", "집중", "호기심", "몰입", "생각"],
  uplift: ["inspire", "growth", "healing", "hope", "영감", "성장", "motivated"],
};

function resolveMoodKey(rawMood: string): MoodProfile {
  const normalized = rawMood.toLowerCase();
  const matchedKey = (Object.keys(moodKeywordMap) as MoodKey[]).find((key) =>
    moodKeywordMap[key].some((keyword) => normalized.includes(keyword))
  );

  if (matchedKey) {
    return moodProfiles[matchedKey];
  }

  if (normalized.includes("웃")) {
    return moodProfiles.comfort;
  }

  if (normalized.includes("긴장")) {
    return moodProfiles.adrenaline;
  }

  return moodProfiles.uplift;
}

export async function getMoodCuratedMovies(mood: string, limit = 8) {
  const profile = resolveMoodKey(mood ?? "");
  const movies = await discoverMovies(
    {
      sort_by: profile.sortBy,
      "with_genres": profile.genres,
      include_adult: "false",
      "vote_average.gte": profile.voteAverageGte ?? 5,
      ...(profile.runtimeLte ? { "with_runtime.lte": profile.runtimeLte } : {}),
    },
    limit
  );

  return { profile, movies };
}

export async function searchMovies(query: string, limit = 12): Promise<Movie[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const data = await fetchFromTmdb<TmdbListResponse<Movie>>("/search/movie", {
      query,
      include_adult: "false",
    });
    return (data.results ?? []).slice(0, limit);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function getPosterUrl(path: string | null, size: TmdbImageSize = DEFAULT_POSTER_SIZE): string | null {
  if (!path) {
    return null;
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: TmdbImageSize = DEFAULT_BACKDROP_SIZE): string | null {
  if (!path) {
    return null;
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export type { MoodProfile };
