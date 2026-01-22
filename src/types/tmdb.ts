export type TmdbImageSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids?: number[];
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TmdbProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TmdbVideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MovieCreditsCastMember {
  id: number;
  name: string;
  character: string;
  order: number;
  profile_path: string | null;
}

export interface MovieCredits {
  cast: MovieCreditsCastMember[];
}

export interface MovieDetails extends Movie {
  runtime: number | null;
  tagline: string;
  genres: TmdbGenre[];
  status: string;
  homepage: string | null;
  spoken_languages: TmdbSpokenLanguage[];
  production_countries: TmdbProductionCountry[];
  credits?: MovieCredits;
  videos?: { results: TmdbVideoResult[] };
}

export interface TmdbListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
