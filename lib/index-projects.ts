const R2_BASE_URL = "https://pub-a885791830ca4c6fa67750d66769c960.r2.dev";

export interface ProjectGalleryItem {
  src: string;
  alt: string;
  caption?: { en: string; ro: string };
}

export interface IndexProject {
  id: string;
  slug: string;
  title: string;
  year: string;
  category: string;
  services: string;
  accent: string;
  image: string;
  aspectClass: string;
  alt: string;
  href?: string;
  heroImage?: string;
  heroVideo?: string;
  video?: string;
  showcaseMedia?: { type: "video" | "image"; src: string; alt: string }[];
  outroVideo?: string;
  client?: string;
  about?: { en: string; ro: string };
  summary?: { en: string; ro: string };
  challenge?: { en: string; ro: string };
  solution?: { en: string; ro: string };
  stack?: string[];
  gallery?: ProjectGalleryItem[];
}

export const INDEX_PROJECTS: IndexProject[] = [
  {
    id: "unbren-events",
    slug: "unbren-events",
    title: "UNBREN EVENTS",
    year: "2026",
    category: "Creative Agency, Events",
    services: "Brand Identity, Web Design & Development",
    accent: "#9be12c",
    image: `${R2_BASE_URL}/unbren-events/unbren-events-hero.jpg`,
    aspectClass: "aspect-[16/11.5]",
    alt: "UNBREN EVENTS — Creative Photo & Video Agency Cover",
    href: "https://unbren.events.ro",
    video: `${R2_BASE_URL}/unbren-events/unbren-events-strip.mp4`,
    client: "UNBREN",
    about: {
      en: "Creative Photo & Video Agency for Events",
      ro: "Agenție Creativă de Foto & Video pentru Evenimente",
    },
    summary: {
      en: "A high-impact digital flagship for UNBREN Events, a creative photo & video agency capturing authentic emotions and bespoke visual stories.",
      ro: "O platformă digitală de impact pentru UNBREN Events, o agenție creativă de foto & video dedicată capturării emoțiilor autentice și poveștilor vizuale.",
    },
    challenge: {
      en: "Event photography and videography websites often feel cluttered and dated. The goal was to build an editorial, cinema-grade digital experience that feels alive, puts raw imagery front and center, and allows effortless content management.",
      ro: "Site-urile de foto-video pentru evenimente suferă adesea de aglomerare vizuală. Obiectivul a fost crearea unei experiențe editoriale cu aspect cinematografic, care pune imaginea brută în prim-plan și oferă un sistem flexibil de administrare a conținutului.",
    },
    solution: {
      en: "Architected with Next.js 16 and Sanity CMS for real-time portfolio curation. Paired Lenis smooth scrolling with bespoke Motion physics, expressive Xanh Mono & Inter typography, and high-contrast editorial layouts.",
      ro: "Arhitectură construită pe Next.js 16 și Sanity CMS pentru gestionarea dinamică a portofoliului. Am integrat scroll fluid cu Lenis, micro-interacțiuni prin Motion, tipografie expresivă (Xanh Mono & Inter) și layout-uri editoriale cu contrast ridicat.",
    },
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Sanity CMS",
      "Motion",
      "Lenis",
    ],
    showcaseMedia: [
      {
        type: "video",
        src: `${R2_BASE_URL}/unbren-events/unbren-events-showcase.mp4`,
        alt: "UNBREN Events Interactive Showcase",
      },
      {
        type: "image",
        src: `${R2_BASE_URL}/unbren-events/unbren-events-macbook-mockup.jpg`,
        alt: "UNBREN Events MacBook Mockup",
      },
    ],
    outroVideo: `${R2_BASE_URL}/unbren-events/unbren-events-outro.webm`,
  },
  {
    id: "unbren-studio",
    slug: "unbren-studio",
    title: "UNBREN STUDIO",
    year: "2026",
    category: "Digital Studio, Branding & Web",
    services: "Brand Identity, Web Design & Development, SEO",
    accent: "#6b6a2a",
    image: "/posters/eadb09513a540600b9541293099658bf.jpg",
    aspectClass: "aspect-[3/4]",
    alt: "UNBREN STUDIO — Digital Studio Cover",
    href: "https://unbren.studio",
    client: "UNBREN",
    about: {
      en: "Next-Generation Digital Studio for Branding, Web & Growth",
      ro: "Studio Digital de Nouă Generație pentru Branding, Web & Growth",
    },
    summary: {
      en: "A high-performance flagship website for UNBREN. STUDIO, engineered to showcase brand architecture, custom Next.js development, and measurable digital growth.",
      ro: "Platforma digitală UNBREN. STUDIO, construită pentru a prezenta servicii de branding, dezvoltare web de înaltă performanță și strategii de creștere digitală.",
    },
    challenge: {
      en: "Creative agencies often struggle to balance expressive visual storytelling with crisp technical clarity and conversion. The challenge was to present complex digital services—branding, web engineering, and SEO—in a cohesive, fast, and memorable interface.",
      ro: "Agențiile creative au adesea dificultăți în a echilibra estetica vizuală cu claritatea tehnică și conversia. Provocarea a fost structurarea serviciilor de branding, dezvoltare web și SEO într-o interfață rapidă, coerentă și memorabilă.",
    },
    solution: {
      en: "Built on Next.js 16 and React 19 with Tailwind CSS v4, custom theme switching, Lenis smooth scrolling, Motion choreography, and validated inquiry flows via React Hook Form and Zod.",
      ro: "Construit pe Next.js 16 și React 19 cu Tailwind CSS v4, sistem propriu de teme, scroll fluid cu Lenis, animații Motion și formulare validate cu React Hook Form și Zod.",
    },
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Motion",
      "Lenis",
      "React Hook Form",
      "Zod",
    ],
  },
  {
    id: "kurogane",
    slug: "kurogane",
    title: "KUROGANE",
    year: "2026",
    category: "Mobile App, Entertainment & Media",
    services: "Brand Identity, Mobile App Design & Development",
    accent: "#f26a4b",
    image: "/projects/kurogane.png",
    aspectClass: "aspect-square",
    alt: "KUROGANE — Editorial Mobile App for Anime, Donghua & Manga",
    heroVideo: "/projects/videoheader3.mp4",
    video: "/projects/stripevideo.mp4",
    client: "KUROGANE",
    about: {
      en: "Editorial Mobile App for Anime, Donghua & Manga",
      ro: "Aplicație Mobilă Editorială pentru Anime, Donghua și Manga",
    },
    summary: {
      en: "A bespoke mobile experience designed for fans of anime, donghua, and manga—bringing together personal watchlists, release calendars, and seasonal discovery in one calm, editorial interface.",
      ro: "O experiență mobilă dedicată pasionaților de anime, donghua și manga, ce reunește listele personale, calendarele de lansări și descoperirea de conținut într-o interfață clară și editorială.",
    },
    challenge: {
      en: "Existing anime and manga tracking apps often feel dated, crowded with clutter, and slow to browse. The goal was to replace visual noise with a refined, magazine-inspired mobile product that makes discovering new titles and tracking episodes effortless.",
      ro: "Aplicațiile existente pentru urmărirea seriilor anime și manga sunt adesea încărcate vizual, lente și greu de parcurs. Obiectivul a fost înlocuirea zgomotului vizual cu un produs mobil rafinat, cu estetică editorială, care face descoperirea și organizarea listelor naturale și rapide.",
    },
    solution: {
      en: "Crafted a custom brand identity and mobile interface paired with instant search, reliable cloud performance, and live catalog updates. Users get real-time release schedules, unified watchlists, and curated news wrapped in a fluid iOS and Android experience.",
      ro: "Am construit o identitate vizuală proprie și o interfață mobilă completă, susținute de căutare instantanee și actualizare continuă a cataloagelor în cloud. Utilizatorii primesc programe în timp real pentru episoade noi, liste unificate și știri relevante într-o experiență fluidă pe iOS și Android.",
    },
    stack: [
      "Flutter 3",
      "Dart",
      "Riverpod 2",
      "Cloudflare Workers",
      "Hono v4",
      "Cloudflare D1",
      "Cloudflare KV",
      "TypeScript 5",
      "Firebase Auth",
    ],
    showcaseMedia: [
      {
        type: "video",
        src: "/projects/kuroganeHero.mp4",
        alt: "Kurogane Motion Showcase",
      },
      {
        type: "image",
        src: "/projects/kurogane-icon-on-screen.jpg",
        alt: "Kurogane iOS Home Screen Icon Preview",
      },
    ],
    outroVideo: "/projects/center-stage-2560x1098.webm",
  },
  {
    id: "qxt-energy",
    slug: "qxt-energy",
    title: "QXT ENERGY",
    year: "2026",
    category: "Technology",
    services: "Brand Identity, Web Design & Development",
    accent: "#2f6fb0",
    image: "/posters/ac337eca3b87098bf717cd2aa7f3028d.jpg",
    aspectClass: "aspect-square",
    alt: "QXT Energy — Hoft fence conceptual art poster",
  },
  {
    id: "fuga",
    slug: "fuga",
    title: "FUGA",
    year: "2026",
    category: "Interior Design & Architecture",
    services: "Brand Identity, Web Design & Development",
    accent: "#3d4a52",
    image: "/posters/76bee34c78e73d692eba7127c4bb8f84.jpg",
    aspectClass: "aspect-[16/11.5]",
    alt: "Fuga — Red Star portrait collage poster",
  },
  {
    id: "domino-travel",
    slug: "domino-travel",
    title: "DOMINO TRAVEL",
    year: "2026",
    category: "Hospitality & Tourism",
    services: "Illustration, Web Design & Development",
    accent: "#2f6b5a",
    image: "/posters/012712120c3940c52d6f6350a99b399b.jpg",
    aspectClass: "aspect-[4/5]",
    alt: "Domino Travel — Pictures in Bruges poster",
  },
  {
    id: "anastomosis",
    slug: "anastomosis",
    title: "ANASTOMOSIS",
    year: "2026",
    category: "Personal Brand",
    services: "Brand Identity, Illustration, Web Design & Development",
    accent: "#7a4a5a",
    image: "/posters/213e12ec5cd9d79a3ed26616b105d33b.jpg",
    aspectClass: "aspect-[3/4.7]",
    alt: "Anastomosis — Umberto Eco typographic poster",
  },
  {
    id: "microcosm",
    slug: "microcosm",
    title: "MICROCOSM",
    year: "2025",
    category: "Food & Beverage",
    services: "Brand Identity, Illustration, Packaging",
    accent: "#2f6fb0",
    image: "/posters/ba3cbf92f53a06e7b7826ea86bdb19ff.jpg",
    aspectClass: "aspect-square",
    alt: "Microcosm — I need to Create poster",
  },
  {
    id: "soba-golf",
    slug: "soba-golf",
    title: "SOBA GOLF",
    year: "2024",
    category: "Communities, Wellness",
    services:
      "Brand Identity, Consulting, Illustration, Ongoing Support, Web Design & Development",
    accent: "#2f6b3a",
    image: "/posters/fa9933d267aa6e1a146dfde8d6203a2a.jpg",
    aspectClass: "aspect-[3/4.1]",
    alt: "Soba Golf — Hike & Climb poster",
  },
];
