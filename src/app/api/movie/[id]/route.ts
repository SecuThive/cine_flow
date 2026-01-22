import { NextResponse } from "next/server";
import { getMovieDetails } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: { id: string } }) {
  try {
    const movieId = Number(context.params.id);

    if (!Number.isFinite(movieId) || movieId <= 0) {
      return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
    }

    const movie = await getMovieDetails(movieId);

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ movie });
  } catch (error) {
    console.error("Movie details API error", error);
    return NextResponse.json({ error: "Failed to load movie details" }, { status: 500 });
  }
}
