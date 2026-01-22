import { HeroSection } from "@/components/HeroSection";
import { MovieCard } from "@/components/MovieCard";
import { getMovies } from "@/lib/tmdb";
import { Movie } from "@/types/tmdb";

const rails: { title: string; category: "popular" | "top_rated" | "upcoming" }[] = [
  { title: "Trending Now", category: "popular" },
  { title: "Top Rated", category: "top_rated" },
  { title: "Coming Soon", category: "upcoming" },
];

async function fetchRailData() {
  const results = await Promise.all(rails.map((rail) => getMovies(rail.category)));
  return rails.map((rail, index) => ({ ...rail, movies: results[index] ?? [] }));
}

export default async function HomePage() {
  const data = await fetchRailData();
  const heroMovie = data[0]?.movies[0] ?? data[1]?.movies[0] ?? data[2]?.movies[0];
  const browseGrid = data.flatMap((rail) => rail.movies).slice(0, 12);

  return (
    <main className="space-y-12 px-4 pb-16 pt-6 md:px-10 lg:px-16">
      <HeroSection movie={heroMovie} />

      {data.map((rail) => (
        <section key={rail.title} className="space-y-4">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-neutral-400">
            <h2 className="text-base font-semibold tracking-tight text-neutral-50">
              {rail.title}
            </h2>
            <span>Explore all</span>
          </div>
          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {rail.movies.length === 0 && (
              <p className="text-neutral-500">Connect your TMDB API key to populate this rail.</p>
            )}
            {rail.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      ))}

      <section id="catalog" className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">Browse Library</p>
          <h2 className="text-2xl font-semibold">Spotlight Collections</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {browseGrid.length === 0 && (
            <p className="text-neutral-500">Add a TMDB API key to see curated picks.</p>
          )}
          {browseGrid.map((movie) => (
            <MovieCard key={`grid-${movie.id}`} movie={movie} />
          ))}
        </div>
      </section>
    </main>
  );
}
