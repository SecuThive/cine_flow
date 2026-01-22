import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";

    if (!query.trim()) {
      return NextResponse.json({ movies: [] });
    }

    const movies = await searchMovies(query, 16);
    return NextResponse.json({ movies });
  } catch (error) {
    console.error("Search API error", error);
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
  }
}
