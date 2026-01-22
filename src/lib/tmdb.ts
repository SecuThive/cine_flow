import { Movie, TmdbImageSize, TmdbListResponse } from "@/types/tmdb";

const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const DEFAULT_POSTER_SIZE: TmdbImageSize = "w500";
const DEFAULT_BACKDROP_SIZE: TmdbImageSize = "original";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchFromTmdb<T>(endpoint: string, searchParams?: Record<string, string | number>): Promise<T> {
  if (!TMDB_API_KEY) {
    console.warn("TMDB_API_KEY is not set. Returning empty data set.");
    return Promise.resolve({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    } as T);
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
    title: "기분 좋아지는 코미디",
    tone: "부드러운 유머와 휴머니즘",
    genres: "35,10751",
    sortBy: "vote_average.desc",
    voteAverageGte: 6,
  },
  adrenaline: {
    key: "adrenaline",
    title: "심장 박동을 올리는 스릴",
    tone: "아드레날린 가득한 체이싱",
    genres: "28,53",
    sortBy: "popularity.desc",
  },
  romance: {
    key: "romance",
    title: "설레는 로맨스",
    tone: "감성 충만한 러브 스토리",
    genres: "10749,18",
    sortBy: "vote_average.desc",
  },
  curious: {
    key: "curious",
    title: "몰입감 있는 미스터리",
    tone: "생각을 자극하는 시네마",
    genres: "9648,18",
    sortBy: "popularity.desc",
  },
  uplift: {
    key: "uplift",
    title: "영감을 주는 여정",
    tone: "따뜻한 성장담과 휴먼 드라마",
    genres: "18,16",
    sortBy: "vote_average.desc",
  },
};

const moodKeywordMap: Record<MoodKey, string[]> = {
  comfort: ["sad", "blue", "우울", "침체", "down"],
  adrenaline: ["thrill", "지루", "스릴", "액션", "짜릿"],
  romance: ["love", "설레", "romance", "데이트"],
  curious: ["mystery", "집중", "호기심", "몰입", "생각"],
  uplift: ["영감", "inspire", "성장", "motivated", "healing"],
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
