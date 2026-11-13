# Architecture

## Purpose

This document describes rendering flow, component composition, data flow, and performance-sensitive paths for the `iamsebbi` portfolio application.

## 1) High-Level System View

```mermaid
flowchart LR
  Browser[Browser] --> Next[Next.js App Router]
  Next --> Layout[app/layout.tsx]
  Layout --> ThemeProvider[ThemeProvider Context]
  ThemeProvider --> Pages[Route Pages]

  Pages --> Home[/]
  Pages --> History[/history]
  Pages --> Project[/works/[slug]]
  Pages --> NotFound[app/not-found.tsx]

  Home --> Components[UI Sections + Navbar]
  Project --> ProjectsData[lib/index-projects.ts]
  Layout --> ContactAPI[POST /api/contact]
```

## 2) Route To Component Composition

```mermaid
flowchart TD
  Root[app/layout.tsx] --> Provider[ThemeProvider]
  Provider --> GridHelper[GridHelper]
  Provider --> RoutedChildren[children]
  Provider --> ContactCTA[ContactCTA]
  Provider --> Footer[Footer]
  Provider --> GridToggle[GridToggle]

  RoutedChildren --> HomePage[app/page.tsx]
  RoutedChildren --> HistoryPage[app/history/page.tsx]
  RoutedChildren --> SlugPage[app/works/[slug]/page.tsx]

  HomePage --> Loader[Loader]
  HomePage --> Navbar[Navbar]
  HomePage --> Hero[Hero]
  HomePage --> ProjectIndex[ProjectIndex]
  HomePage --> Divider[BrutalistDivider]
  HomePage --> Services[Services]
  HomePage --> DesignMarquee[ProjectMarquee]

  Hero --> WebMarquee[ProjectMarquee]
  SlugPage --> ProjectDetail[ProjectDetailClient]
```

## 3) Data & Form Flow

```mermaid
flowchart LR
  Projects[lib/index-projects.ts: INDEX_PROJECTS] --> IndexSection[components/ProjectIndex.tsx - top 6]
  Projects --> SlugResolver[app/works/[slug]/page.tsx]
  MarqueeData[lib/marquee-data.ts] --> HeroMarquee[Hero Web Marquee]
  MarqueeData --> DesignMarquee[Home Design Marquee]

  SlugResolver --> Match{slug exists?}
  Match -->|yes| DetailClient[components/ProjectDetailClient.tsx]
  Match -->|no| NotFound[app/not-found.tsx]

  ContactCTA[components/ContactCTA.tsx] -->|POST JSON| ContactRoute[app/api/contact/route.ts]
  ContactRoute --> Resend[Resend Email API]
```

## 4) Theme, Language & Grid State Flow

```mermaid
flowchart TD
  PreHydration[Inline head script] --> HtmlClass[html.dark + colorScheme + lang]
  LocalStorage[(localStorage)] --> ProviderInit[ThemeProvider lazy state + useIsClient]
  ProviderInit --> ThemeState[theme: dark|light]
  ProviderInit --> LangState[language: EN|RO]
  ProviderInit --> GridState[showGrid: boolean]

  ThemeToggle[ThemeToggle] --> ThemeState
  LanguageToggle[LanguageToggle / LanguageSwitcher] --> LangState
  GridToggle[GridToggle] --> GridState

  ThemeState --> HtmlClass
  LangState --> HtmlClass
  GridState --> GridHelper[GridHelper visibility]
```

## 5) Rendering And Motion Hotspots

```mermaid
flowchart TD
  Entry[Initial load] --> LoaderAnim[Loader overlay timeline]
  Entry --> HeroAnim[Hero reveal + continuous rAF marquee]
  Scroll[User scroll] --> NavbarMorph[Navbar GSAP CSS-var morph]
  Divider[BrutalistDivider] --> Strobe[400ms frame switch - reduced-motion aware]
  PageOpen[Open /history or /works/[slug]] --> RevealTimeline[GSAP reveal timeline]
```

## 6) Practical Notes

- Interactive sections and animations run as Client Components; `/works/[slug]` resolves static params and metadata on the Server before handing off to `ProjectDetailClient`.
- Portfolio content is static in `lib/index-projects.ts` and `lib/marquee-data.ts`, with large case-study media hosted on Cloudflare R2 (`next.config.ts` `remotePatterns`).
- Language (`EN` / `RO`) is context-controlled via `ThemeProvider` without separate locale routes.
- Contact submissions go through `POST /api/contact` (`app/api/contact/route.ts`) backed by Resend (`RESEND_API_KEY`).
