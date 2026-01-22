import { NextResponse } from "next/server";
import { getMoodCuratedMovies, MoodProfile } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

const AI_ENDPOINT = process.env.AI_RECOMMENDER_ENDPOINT ?? "";
const AI_API_KEY = process.env.AI_API_KEY ?? "";

interface MoodResponse {
  mood: string;
  profile: MoodProfile;
  narrative: string;
}

async function buildNarrative(mood: string, profile: MoodProfile, titles: string[]): Promise<string> {
  const fallback = `Here are some "${profile.title}" picks like ${titles.slice(0, 3).join(", " )} to match your vibe.`;

  if (!AI_ENDPOINT || !AI_API_KEY) {
    return fallback;
  }

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        mood,
        profile,
        titles,
      }),
      // AI response can be cached for short burst reuse
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      console.error("AI narrative endpoint failed", await response.text());
      return fallback;
    }

    const data = (await response.json()) as Partial<MoodResponse> & { message?: string };
    return data.narrative ?? data.message ?? fallback;
  } catch (error) {
    console.error("AI narrative request error", error);
    return fallback;
  }
}

export async function POST(request: Request) {
  try {
    const { mood } = (await request.json()) as { mood?: string };

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    const { profile, movies } = await getMoodCuratedMovies(mood, 8);
    const narrative = await buildNarrative(mood, profile, movies.map((movie) => movie.title));

    return NextResponse.json({ mood, profile, narrative, movies });
  } catch (error) {
    console.error("Mood API error", error);
    return NextResponse.json({ error: "Failed to curate recommendations" }, { status: 500 });
  }
}
