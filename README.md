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
2. Copy the environment template and add your TMDB key:
   ```bash
   cp .env.example .env.local
   ```
   ```env
   TMDB_API_KEY=your_tmdb_key
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

## Styling Notes
- Full-bleed hero with gradient overlays and action CTAs
- Horizontal rails with touch-friendly scrolling (`scrollbar-hide` utility)
- Responsive 2:3 poster cards with hover-driven quick view

## Deployment
Use `npm run build` followed by `npm run start` to verify the production bundle locally. Deploy the `.next` output via Vercel or any Node-capable host. Be sure to configure the `TMDB_API_KEY` environment variable in production as well.
