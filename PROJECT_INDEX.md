# Project Index

Related document: see [ARCHITECTURE.md](ARCHITECTURE.md) for flow diagrams and dependency views.

## Overview

- Type: Next.js App Router portfolio site (`iamsebbi`)
- Language: TypeScript + React 19
- Styling: Tailwind CSS v4 + custom CSS tokens in `app/globals.css`
- Animation: GSAP + `@gsap/react` + `requestAnimationFrame` marquee

## Runtime & Scripts

From `package.json`:

- `npm run dev` -> starts Next.js dev server on `0.0.0.0`
- `npm run build` -> production build
- `npm run start` -> run production server
- `npm run lint` -> ESLint

## App Routes

- `/` -> `app/page.tsx`
- `/history` -> `app/history/page.tsx`
- `/works/[slug]` -> `app/works/[slug]/page.tsx`
- `/api/contact` -> `app/api/contact/route.ts` (`POST` contact inquiry via Resend)
- Not Found boundary -> `app/not-found.tsx`

## Root Composition

- `app/layout.tsx`
  - Loads fonts (`Google_Sans_Flex`, `Lekton`)
  - Runs pre-hydration inline script for theme/lang FOUC prevention
  - Wraps app with `ThemeProvider`
  - Mounts `GridHelper`, global `ContactCTA`, `Footer`, and floating `GridToggle`
  - Imports global styles from `app/globals.css`

## Home Page Structure (`/`)

Defined in `app/page.tsx`:

1. `Loader` (first visit per session via `sessionStorage`)
2. `Navbar`
3. `Hero` (includes `ProjectMarquee` `#works`)
4. `ProjectIndex` (`#project-index`, displays top 6 items from `INDEX_PROJECTS`)
5. `BrutalistDivider`
6. `Services` (`#services`)
7. `ProjectMarquee` (`#design`)

## Data & Hooks Layer

- `lib/index-projects.ts` — defines `IndexProject`, `ProjectGalleryItem`, and `INDEX_PROJECTS`
- `lib/marquee-data.ts` — defines `MarqueeItem`, `POSTER_MARQUEE_ITEMS`, `WEB_MARQUEE_ITEMS`, `DESIGN_MARQUEE_ITEMS`
- `lib/use-is-client.ts` — SSR-safe `useSyncExternalStore` hook (`useIsClient`)
- `lib/utils.ts` — exports `cn(...)` class name utility

## Shared Layout, Navigation & Global Sections

- `components/Section.tsx` — core section wrapper (`Section`, `GridItem`) enforcing the 4/8/12 column grid
- `components/Navbar.tsx` — scroll-morphing header + mobile drawer
- `components/ThemeProvider.tsx` — `theme`, `language`, and `showGrid` context persisted in `localStorage`
- `components/ThemeToggle.tsx`, `components/LanguageToggle.tsx`, `components/LanguageSwitcher.tsx`
- `components/GridHelper.tsx` & `components/GridToggle.tsx` — visual layout grid overlay
- `components/ContactCTA.tsx` — 4-step inquiry form wired to `POST /api/contact`
- `components/Footer.tsx` — social links, sitemap, CV download, direct contact

## Quality Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
