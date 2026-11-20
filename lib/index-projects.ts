const R2_BASE_URL = "https://pub-a885791830ca4c6fa67750d66769c960.r2.dev";

export interface ProjectGalleryItem {
  src: string;
  alt: string;
  caption?: { en: string; ro: string };
}

export interface ProjectVideoItem {
  src: string;
  alt: string;
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
  heroImages?: string[];
  heroVideo?: string;
  verticalVideos?: ProjectVideoItem[];
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
    id: "kurogane",
    slug: "kurogane",
    title: "KUROGANE",
    year: "2026",
    category: "Mobile App, Entertainment & Media",
    services: "Brand Identity, Mobile App Design & Development",
    accent: "#f26a4b",
    image: "/projects/kurogane-logo-banner.jpg",
    aspectClass: "aspect-square",
    alt: "KUROGANE — Editorial Mobile App for Anime, Donghua & Manga",
    heroImage: "/projects/kurogane-logo-header.jpg",
    client: "KUROGANE",
    verticalVideos: [
      {
        src: "/projects/kurogane-reel-1.mp4",
        alt: "Kurogane Mobile Interface Preview 1",
      },
      {
        src: "/projects/kurogane-reel-2.mp4",
        alt: "Kurogane Mobile Interface Preview 2",
      },
      {
        src: "/projects/kurogane-reel-3.mp4",
        alt: "Kurogane Mobile Interface Preview 3",
      },
    ],
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
    id: "tempo",
    slug: "tempo",
    title: "TEMPO",
    year: "2026",
    category: "Mobile Web App, Education & Productivity",
    services: "Brand Identity, UI/UX & Web App Development",
    accent: "#0d0d0d",
    image: "/projects/tempo-cover.jpg",
    aspectClass: "aspect-[4/5]",
    alt: "TEMPO — Minimalist Academic Timeline & Smart Schedule",
    client: "TEMPO",
    about: {
      en: "Minimalist Academic Timeline & Smart Schedule",
      ro: "Orar Universitar Minimalist & Timeline Academic Inteligent",
    },
    summary: {
      en: "A calm, minimalist schedule companion built for students—turning cluttered university timetables into an effortless daily timeline with automatic week-parity tracking and offline access.",
      ro: "O aplicație de orar minimalistă creată pentru studenți, care transformă tabelele universitare încărcate într-un timeline zilnic clar—cu calcul automat al săptămânilor pare și impare și acces chiar și fără internet.",
    },
    challenge: {
      en: "University schedules are usually buried in dense PDFs and static spreadsheets that are frustrating to read on a phone and impossible to keep track of across alternating weeks. The goal was to design an experience that feels as effortless as a native app—giving students instant clarity on where they need to be today, without clutter or accounts.",
      ro: "Orarele universitare sunt de obicei blocate în PDF-uri greu de citit pe telefon și tabele complicate, unde trebuie să verifici mereu dacă e săptămână pară sau impară. Obiectivul a fost crearea unei experiențe fluide, ca o aplicație nativă, care îți arată instant ce cursuri ai azi, fără conturi sau aglomerare vizuală.",
    },
    solution: {
      en: "Designed a custom brand identity and focused daily timeline with automatic even/odd week detection, quick schedule customization, and one-tap calendar exports. Works seamlessly right in the mobile browser or installed on the home screen—staying fast, private, and available offline.",
      ro: "Am creat o identitate vizuală proprie și o interfață aerisită cu view zilnic și săptămânal, detectare automată a săptămânii active, editare rapidă a orelor și export direct în calendar. Funcționează impecabil atât în browser, cât și instalată pe ecranul principal, rămânând rapidă, privată și disponibilă offline.",
    },
    stack: [
      "React 19",
      "TypeScript",
      "Vite 8",
      "Tailwind CSS v4",
      "Motion",
      "Solid Glass",
      "PWA",
      "Vercel",
    ],
  },
  {
    id: "iamsebbi-dev",
    slug: "iamsebbi-dev",
    title: "IAMSEBBI.DEV",
    year: "2026",
    category: "Design Tools, React Components",
    services: "Brand Identity, Product Design, React Component Library",
    accent: "#6366f1",
    image: "/posters/02418dc1a9d0521ae22e42380bdf016d.jpg",
    aspectClass: "aspect-[16/11.5]",
    alt: "IAMSEBBI.DEV — Interactive React Gradient & Motion Component Studio",
    client: "IAMSEBBI",
    about: {
      en: "Interactive React Gradient & Motion Component Studio",
      ro: "Studio Interactiv de Componente React & Gradienți Animați",
    },
    summary: {
      en: "A visual React component library and live customization studio for designers and developers—preview, fine-tune, and export animated gradient surfaces, glowing borders, and ready-to-use UI components.",
      ro: "O librărie vizuală de componente React și un studio interactiv de personalizare—creată pentru a previzualiza, ajusta în timp real și exporta suprafețe cu gradienți animați și elemente vizuale gata de integrat în orice site.",
    },
    challenge: {
      en: "Creating rich, atmospheric gradients and smooth motion effects usually means hours of trial-and-error tweaking values or starting from static templates. The goal was to turn complex visual craft into a hands-on playground where anyone can explore presets, adjust colors and movement live, and copy clean, production-ready components in seconds.",
      ro: "Realizarea gradienților atmosferici și a animațiilor fluide presupune de obicei mult timp pierdut cu ajustări manuale sau șabloane rigide. Obiectivul a fost să transformăm acest proces într-un spațiu vizual intuitiv, unde poți testa stiluri, schimba culori și mișcări live și obține componente gata de folosit în câteva secunde.",
    },
    solution: {
      en: "Built an interactive showcase and studio workflow with curated presets, live palette generation, visual layer customization, and instant export to React, Tailwind, CSS, or high-resolution images—giving teams a consistent look without sacrificing speed.",
      ro: "Am construit un showcase interactiv și un studio complet cu preseturi curatoriate, generator live de palete de culori, control vizual pe straturi și export instant în cod sau imagine la rezoluție înaltă—oferind echipelor un rezultat coerent fără efort suplimentar.",
    },
    stack: [
      "React 19",
      "TypeScript",
      "Vite 6",
      "Tailwind CSS",
      "Motion",
      "WebGL2 / WebGPU",
      "Radix UI",
      "shadcn/ui",
    ],
  },
  {
    id: "unbren-events",
    slug: "unbren-events",
    title: "UNBREN EVENTS",
    year: "2025",
    category: "Creative Agency, Events",
    services: "Brand Identity, Web Design & Development",
    accent: "#9be12c",
    image: `${R2_BASE_URL}/unbren-events/unbren-events-hero.jpg`,
    aspectClass: "aspect-[16/11.5]",
    alt: "UNBREN EVENTS — Creative Photo & Video Agency Cover",
    href: "https://unbren.events.ro",
    client: "UNBREN",
    verticalVideos: [
      {
        src: "/projects/unbren-events-reel-1.mp4",
        alt: "UNBREN Events Vertical Preview 1",
      },
      {
        src: "/projects/unbren-events-reel-2.mp4",
        alt: "UNBREN Events Vertical Preview 2",
      },
      {
        src: "/projects/unbren-events-reel-3.mp4",
        alt: "UNBREN Events Vertical Preview 3",
      },
    ],
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
    year: "2025",
    category: "Digital Studio, Branding & Web",
    services: "Brand Identity, Web Design & Development, SEO",
    accent: "#6b6a2a",
    image: "/projects/unbren-studio-cover.jpg",
    aspectClass: "aspect-[3/4]",
    alt: "UNBREN STUDIO — Digital Studio Cover",
    href: "https://unbren.studio",
    heroImages: [
      "/projects/unbren-studio-header-1.jpg",
      "/projects/unbren-studio-header-2.jpg",
      "/projects/unbren-studio-header-3.jpg",
      "/projects/unbren-studio-header-4.jpg",
      "/projects/unbren-studio-header-5.jpg",
      "/projects/unbren-studio-header-6.jpg",
      "/projects/unbren-studio-header-7.jpg",
      "/projects/unbren-studio-header-8.jpg",
      "/projects/unbren-studio-header-9.jpg",
    ],
    verticalVideos: [
      {
        src: "/projects/unbren-studio-reel-1.webm",
        alt: "UNBREN Studio Vertical Preview 1",
      },
      {
        src: "/projects/unbren-studio-reel-2.webm",
        alt: "UNBREN Studio Vertical Preview 2",
      },
      {
        src: "/projects/unbren-studio-reel-3.webm",
        alt: "UNBREN Studio Vertical Preview 3",
      },
    ],
    client: "UNBREN",
    about: {
      en: "Digital Studio for Brand Identity, Web & Growth",
      ro: "Studio Digital pentru Identitate de Brand, Web & Creștere",
    },
    summary: {
      en: "A flagship digital presence for UNBREN. STUDIO, designed to turn first impressions into client trust—showcasing brand strategy, bespoke websites, and measurable growth.",
      ro: "Platforma digitală UNBREN. STUDIO, gândită să transforme prima impresie în încredere—prezentând clar strategia de brand, site-urile personalizate și rezultatele măsurabile.",
    },
    challenge: {
      en: "Businesses looking for a creative partner often run into agencies that feel either overly abstract or purely utilitarian. The challenge was to present branding, web design, and SEO in a clear, credible way that helps prospective clients immediately understand the value and take the next step.",
      ro: "Companiile care caută un partener creativ se lovesc adesea de agenții fie prea abstracte, fie lipsite de personalitate. Provocarea a fost să prezentăm serviciile de branding, web design și SEO într-un mod clar și convingător, care ajută clienții să înțeleagă rapid valoarea și să inițieze o colaborare.",
    },
    solution: {
      en: "Crafted a bold visual identity paired with an intuitive, fast-loading experience from the first scroll to the final inquiry. Visitors explore services effortlessly, switch between light and dark atmospheres, and reach the team through a streamlined, distraction-free contact flow.",
      ro: "Am creat o identitate vizuală memorabilă, susținută de o experiență rapidă și intuitivă de la primul scroll până la trimiterea unei cereri. Vizitatorii parcurg ușor serviciile, pot schimba atmosfera vizuală între light și dark și iau legătura cu echipa printr-un proces simplu și clar.",
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
    outroVideo: "/projects/unbren-studio-outro.webm",
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
