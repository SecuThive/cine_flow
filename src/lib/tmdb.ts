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
