# CineScout

Premium, cinematic movie discovery experience built with Next.js 14 App Router and Tailwind CSS.

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + custom cinematic tokens
- TMDB API integration
- Lucide React iconography

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and add your TMDB key (plus optional AI settings):
   ```bash
   cp .env.example .env.local
   ```
   ```env
   TMDB_API_KEY=your_tmdb_key
   # Optional: connect any AI text endpoint that returns a narrative string
   AI_RECOMMENDER_ENDPOINT=https://your-ai-endpoint.example.com/recommend
   AI_API_KEY=your_ai_api_key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Optional quality checks:
   ```bash
   npm run lint
   npm run type-check
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure
```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    HeroSection.tsx
    MovieCard.tsx
  lib/tmdb.ts
  types/tmdb.ts
```

## Experience Highlights
- Full-bleed hero with gradient overlays and action CTAs
- AI-assisted **Mood Picker** that calls `/api/mood` and surfaces copy + TMDB matches
- **Runtime Filter** widget targeting "Under 2 Hours" movie sessions
- **Search Panel** hitting `/api/search` for TMDB-backed keyword discovery
- Streaming credibility boost with Netflix / Disney+ badges baked into every MovieCard
- Sticky **SiteHeader** with metrics, hamburger search drawer, and AdSense-safe layout cues
- Compliance-ready **Footer** with policy links, contact info, and reserved ad surfaces
- Horizontal rails with touch-friendly scrolling (`scrollbar-hide` utility)
- Responsive 2:3 poster cards with hover-driven quick view

## Deployment
Use `npm run build` followed by `npm run start` to verify the production bundle locally. Deploy the `.next` output via Vercel or any Node-capable host. Be sure to configure the `TMDB_API_KEY` environment variable in production as well.
