# Project Index

Related document: see [ARCHITECTURE.md](ARCHITECTURE.md) for flow diagrams and dependency views.

## Overview

- Type: Next.js App Router portfolio site
- Language: TypeScript + React 19
- Styling: Tailwind CSS v4 + custom CSS tokens in `app/globals.css`
- Animation: GSAP + `@gsap/react`

## Runtime & Scripts

From `package.json`:

- `npm run dev` -> starts Next.js dev server on `0.0.0.0`
- `npm run build` -> production build
- `npm run start` -> run production server
- `npm run lint` -> ESLint

## App Routes

- `/` -> `app/page.tsx`
- `/works` -> `app/works/page.tsx`
- `/works/[slug]` -> `app/works/[slug]/page.tsx`
- Not Found boundary -> `app/not-found.tsx`

## Root Composition

- `app/layout.tsx`
  - Loads fonts (Geist, Geist Mono, Google Sans, Special Gothic)
  - Wraps app with `ThemeProvider`
  - Mounts `GridHelper` + `GridToggle`
  - Imports global styles from `app/globals.css`

## Home Page Structure (`/`)

Defined in `app/page.tsx`:

1. `Loader`
2. `Navbar`
3. `Hero`
4. `Info`
5. `Works`
6. `BrutalistDivider`
7. `Experience`
8. `Contact`

## Works Pages

- `app/works/page.tsx`
  - Reads `PROJECTS` from `lib/projects.ts`
  - Category filtering (`all | web | design`)
  - Animated list reveal with GSAP
- `app/works/[slug]/page.tsx`
  - Resolves project by slug from `PROJECTS`
  - `web` category -> `WebProjectLayout`
  - `design` category -> `DesignProjectLayout`

## Data Layer

- `lib/projects.ts`
  - Defines `Category` and `Project` types
  - Exports static `PROJECTS` dataset used by Works pages/components
- `lib/utils.ts`
  - Exports `cn(...)` class name utility

## Shared Layout/System Components

- `components/Section.tsx`
  - Core section wrapper + responsive grid contract
  - Exports `Section` and `GridItem`
- `components/GridHelper.tsx`
  - Visual grid overlay (for layout debugging)
- `components/GridToggle.tsx`
  - Toggle for grid overlay visibility

## Navigation & UI State

- `components/Navbar.tsx`
  - Main nav, scroll morph behavior via GSAP
  - Includes theme + language controls
- `components/ThemeProvider.tsx`
  - Stores `theme` and `showGrid` state
  - Persists values in `localStorage`
- `components/ThemeToggle.tsx`
- `components/LanguageToggle.tsx`
- `components/LanguageSwitcher.tsx`

## Content Sections

- `components/Hero.tsx`
- `components/Info.tsx`
- `components/Works.tsx`
- `components/BrutalistDivider.tsx`
- `components/Experience.tsx`
- `components/Contact.tsx`

## Project Detail Layouts

- `components/WebProjectLayout.tsx`
- `components/DesignProjectLayout.tsx`

## Styling & Theming

- `app/globals.css`
  - Design tokens (colors, typography, radii, tracking)
  - Light/dark theme variables
  - Utility classes (`glass`, `noise-overlay`, marquee animations)

## Config Files

- `next.config.ts` -> includes `allowedDevOrigins`
- `eslint.config.mjs`
- `postcss.config.mjs`
- `tsconfig.json`

## Current Architecture Notes

- Data source is currently in-code static data (`PROJECTS`).
- Language toggles are UI-local state only (no i18n routing/content source yet).
- App is heavily animation-driven; many sections run GSAP effects in client components.

## Component Relationship Map

### Root Tree

- `app/layout.tsx`
  - `ThemeProvider`
    - `GridHelper`
    - `GridToggle`
    - `children` (all routed pages)

### Home Tree (`app/page.tsx`)

- `Home`
  - `Loader`
  - `Navbar`
    - `ThemeToggle`
    - `LanguageToggle`
    - `LanguageSwitcher`
  - `Hero` -> uses `Section`
  - `Info` -> uses `Section`, `GridItem`
  - `Works` -> uses `Section`, `GridItem`, reads `PROJECTS`
  - `BrutalistDivider` -> uses `Section`, `GridItem`
  - `Experience` -> uses `Section`, `GridItem`
  - `Contact` -> uses `Section`, `GridItem`

### Works Tree

- `app/works/page.tsx`
  - `Navbar`
  - `Section`
  - `GridItem`
  - Project cards generated from `PROJECTS`
- `app/works/[slug]/page.tsx`
  - `Navbar`
  - Conditional layout:
    - `WebProjectLayout` (for `project.category === "web"`)
    - `DesignProjectLayout` (for `project.category === "design"`)

## Developer Onboarding (Fast Start)

### 1) Prerequisites

- Node.js 20+ recommended
- npm (or yarn/pnpm/bun)

### 2) Install & Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### 3) First Files To Read

1. `app/layout.tsx` (global wrappers, fonts, metadata)
2. `app/page.tsx` (homepage composition)
3. `lib/projects.ts` (portfolio content model + source data)
4. `components/Section.tsx` (layout grid contract)
5. `app/globals.css` (tokens, theme vars, utilities)

### 4) Typical Change Paths

- Add/edit project content: update `lib/projects.ts`
- Change homepage section ordering/content: `app/page.tsx` + section components
- Modify project detail pages: `components/WebProjectLayout.tsx` or `components/DesignProjectLayout.tsx`
- Adjust global styling/theme: `app/globals.css` + `components/ThemeProvider.tsx`

### 5) Quality Checks Before PR

```bash
npm run lint
npm run build
```

## Performance Dependency Map

### Critical Runtime Dependencies

- `next` + `react` + `react-dom`
  - Core rendering, routing, hydration.
- `gsap` + `@gsap/react`
  - Animation timelines, scroll triggers, and section reveals.

### Components With Highest Animation Cost

- `components/Navbar.tsx`
  - Scroll-based morphing + responsive state transitions.
- `components/Loader.tsx`
  - Full-screen mount animation sequence on entry.
- `components/Works.tsx`
  - Filter-dependent reveals and stagger animations.
- `components/Info.tsx`
  - Scroll reveal + continuous marquee motion.
- `components/WebProjectLayout.tsx` / `components/DesignProjectLayout.tsx`
  - Multi-step timeline animations on project detail view.

### Likely Performance Hotspots

- Frequent state-driven rerenders combined with GSAP selectors.
- Large full-bleed images (`next/image`) with animation layers.
- Multiple continuously running animations (marquee, strobe effects).

### Suggested Monitoring Points

- CLS/LCP around `Loader` exit and hero render.
- Scroll performance in sections using `ScrollTrigger`.
- Image payload size in `public/` and gallery-heavy pages.
