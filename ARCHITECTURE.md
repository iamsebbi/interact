# Architecture

## Purpose

This document describes rendering flow, component composition, data flow, and performance-sensitive paths for the portfolio application.

## 1) High-Level System View

```mermaid
flowchart LR
  Browser[Browser] --> Next[Next.js App Router]
  Next --> Layout[app/layout.tsx]
  Layout --> ThemeProvider[ThemeProvider Context]
  ThemeProvider --> Pages[Route Pages]

  Pages --> Home[/]
  Pages --> Works[/works]
  Pages --> Project[/works/[slug]]

  Home --> Components[UI Sections + Navbar]
  Works --> ProjectsData[lib/projects.ts]
  Project --> ProjectsData
```

## 2) Route To Component Composition

```mermaid
flowchart TD
  Root[app/layout.tsx] --> Provider[ThemeProvider]
  Provider --> GridHelper[GridHelper]
  Provider --> GridToggle[GridToggle]
  Provider --> RoutedChildren[children]

  RoutedChildren --> HomePage[app/page.tsx]
  RoutedChildren --> WorksPage[app/works/page.tsx]
  RoutedChildren --> SlugPage[app/works/[slug]/page.tsx]

  HomePage --> Loader[Loader]
  HomePage --> Navbar[Navbar]
  HomePage --> Hero[Hero]
  HomePage --> Info[Info]
  HomePage --> Works[Works]
  HomePage --> Divider[BrutalistDivider]
  HomePage --> Experience[Experience]
  HomePage --> Contact[Contact]

  SlugPage --> Decision{project.category}
  Decision -->|web| WebLayout[WebProjectLayout]
  Decision -->|design| DesignLayout[DesignProjectLayout]
```

## 3) Data Flow

```mermaid
flowchart LR
  Projects[lib/projects.ts: PROJECTS] --> WorksList[app/works/page.tsx]
  Projects --> HomeWorks[components/Works.tsx]
  Projects --> SlugResolver[app/works/[slug]/page.tsx]

  SlugResolver --> Match{slug exists?}
  Match -->|yes| DetailLayout[WebProjectLayout or DesignProjectLayout]
  Match -->|no| NotFound[notFound() boundary]
```

## 4) Theme + Grid State Flow

```mermaid
flowchart TD
  LocalStorage[(localStorage)] --> ProviderInit[ThemeProvider useEffect init]
  ProviderInit --> ThemeState[theme: dark|light]
  ProviderInit --> GridState[showGrid: boolean]

  ThemeToggle[ThemeToggle] --> ThemeState
  GridToggle[GridToggle] --> GridState

  ThemeState --> HtmlClass[document.documentElement classList]
  ThemeState --> ColorScheme[document.documentElement.style.colorScheme]
  GridState --> GridHelper[GridHelper visibility]
```

## 5) Rendering And Motion Hotspots

```mermaid
flowchart TD
  Entry[Initial load] --> LoaderAnim[Loader timeline]
  Entry --> HeroAnim[Hero reveal + frame switch]
  Scroll[User scroll] --> NavbarMorph[Navbar morph animation]
  Scroll --> InfoReveal[Info section scroll trigger]
  Scroll --> WorksReveal[Works cards reveal]
  Filter[Category filter change] --> WorksReveal
  ProjectOpen[Open /works/[slug]] --> DetailTimeline[Project detail GSAP timeline]
```

## 6) Practical Notes

- Most pages are client-heavy due to animation logic and browser APIs.
- Content is static and centralized in lib/projects.ts.
- Language controls are UI-level toggles, without route-level i18n integration.
- The grid debugging layer is global and context-controlled.

## 7) Suggested Future Refactors

1. Move project content to a CMS or typed JSON source to decouple content from code.
2. Introduce route-level i18n instead of component-local language state.
3. Add lazy/reduced-motion animation paths for low-power devices.
4. Split animation orchestration into reusable hooks to reduce selector coupling.

## 8) Performance Budget

### Core Web Vitals Targets

- LCP: <= 2.5s (target), <= 3.0s (max tolerated)
- CLS: <= 0.1 (target), <= 0.15 (max tolerated)
- INP: <= 200ms (target), <= 300ms (max tolerated)
- TTFB: <= 800ms (target), <= 1200ms (max tolerated)

### Route-Level Budgets

- `/`
  - JS loaded on first view: <= 240KB gz (target), <= 300KB gz (max)
  - Hero image bytes: <= 250KB (target), <= 400KB (max)
  - Initial animation CPU burst: <= 1200ms main-thread total in first 5s
- `/works`
  - JS loaded on first view: <= 260KB gz (target), <= 330KB gz (max)
  - Above-the-fold image bytes: <= 300KB total
  - Filter interaction latency: <= 120ms response on category switch
- `/works/[slug]`
  - JS loaded on first view: <= 280KB gz (target), <= 350KB gz (max)
  - First media frame paint after navigation: <= 1.2s (warm cache)
  - Detail timeline start delay: <= 150ms after route commit

### Component Checkpoints

- `Loader`
  - Exit transition must not delay first meaningful interaction by more than 300ms.
- `Navbar`
  - Scroll morph should sustain 55-60 FPS on mid-tier laptop/mobile.
- `Hero` and `BrutalistDivider`
  - Frame-switch/strobe logic should avoid layout thrash; opacity-only transitions preferred.
- `Works`
  - Re-filter animation should run without long tasks > 50ms on category switch.
- `Info`
  - Marquee loops should remain compositor-friendly (transform-based animations only).

### Measurement Workflow

1. Lighthouse (mobile + desktop) on `/`, `/works`, and one `/works/[slug]` page.
2. Chrome Performance panel for scroll and filter interactions.
3. Web Vitals extension or RUM library for INP and CLS validation in real sessions.
4. Track bundle deltas for each PR (focus on route-level JS and image payloads).

### Fallback Policies When Budget Is Exceeded

1. Reduce concurrent GSAP timelines and stagger counts.
2. Defer non-critical animations with `requestIdleCallback` or post-interaction triggers.
3. Lower image quality/sizes for above-the-fold media and enforce responsive `sizes`.
4. Add reduced-motion path using `prefers-reduced-motion` to limit heavy effects.
