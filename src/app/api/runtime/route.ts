import { NextResponse } from "next/server";
import { getMoviesByRuntime } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const maxMinutes = Number(searchParams.get("maxMinutes") ?? "120");
    const limit = Number(searchParams.get("limit") ?? "12");

    const movies = await getMoviesByRuntime(Number.isNaN(maxMinutes) ? 120 : maxMinutes, limit);

    return NextResponse.json({ maxMinutes, movies });
  } catch (error) {
    console.error("Runtime filter error", error);
    return NextResponse.json({ error: "Failed to filter by runtime" }, { status: 500 });
  }
}
