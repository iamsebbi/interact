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
}

export const INDEX_PROJECTS: IndexProject[] = [
  {
    id: "republica-reserve",
    slug: "republica-reserve",
    title: "REPÚBLICA RESERVE",
    year: "2026",
    category: "HOSPITALITY & TOURISM",
    services: "BRAND IDENTITY, WEB DESIGN & DEVELOPMENT",
    accent: "#7a5a8a",
    image: "/posters/02418dc1a9d0521ae22e42380bdf016d.jpg",
    aspectClass: "aspect-[16/11.5]",
    alt: "República Reserve — Fish smoking cigarette visual art poster",
  },
  {
    id: "en-haus",
    slug: "en-haus",
    title: "EN HAUS",
    year: "2026",
    category: "CONSULTING",
    services: "BRAND IDENTITY, WEB DESIGN & DEVELOPMENT",
    accent: "#6b6a2a",
    image: "/posters/eadb09513a540600b9541293099658bf.jpg",
    aspectClass: "aspect-[3/4]",
    alt: "En Haus — Today's Mess green brutalist graphic design poster",
  },
  {
    id: "qxt-energy",
    slug: "qxt-energy",
    title: "QXT ENERGY",
    year: "2026",
    category: "TECHNOLOGY",
    services: "BRAND IDENTITY, WEB DESIGN & DEVELOPMENT",
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
    category: "INTERIOR DESIGN & ARCHITECTURE",
    services: "BRAND IDENTITY, WEB DESIGN & DEVELOPMENT",
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
    category: "HOSPITALITY & TOURISM",
    services: "ILLUSTRATION, WEB DESIGN & DEVELOPMENT",
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
    category: "PERSONAL BRAND",
    services: "BRAND IDENTITY, ILLUSTRATION, WEB DESIGN & DEVELOPMENT",
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
    category: "FOOD & BEVERAGE",
    services: "BRAND IDENTITY, ILLUSTRATION, PACKAGING",
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
    category: "COMMUNITIES, WELLNESS",
    services:
      "BRAND IDENTITY, CONSULTING, ILLUSTRATION, ONGOING SUPPORT, WEB DESIGN & DEVELOPMENT",
    accent: "#2f6b3a",
    image: "/posters/fa9933d267aa6e1a146dfde8d6203a2a.jpg",
    aspectClass: "aspect-[3/4.1]",
    alt: "Soba Golf — Hike & Climb poster",
  },
];
