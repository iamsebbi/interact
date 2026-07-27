export type Category = "web" | "design";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: Category;
  image: string;
  coverImage?: string;
  year: string;
  tags: string[];
  description: string;
  client: string;
  role: string;
  gallery: string[];
  liveUrl?: string;
  githubUrl?: string;
  stack?: string[];
  features?: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "unbren-events",
    slug: "unbren-events",
    title: "Unbren Events",
    category: "web",
    coverImage: "/unbren_events_cover.png",
    image: "/unbren_events_home.png",
    year: "2025",
    tags: ["Next.js", "Sanity CMS", "Motion", "Tailwind CSS"],
    description:
      "A modern, high-performance event management and ticketing platform for Unbren Events. Integrated with Sanity CMS for dynamic content management, custom smooth scrolling with Lenis, and fluid animations powered by Motion.",
    client: "Unbren",
    role: "Fullstack / Frontend Lead",
    gallery: [
      "/unbren_events_services.png",
      "/unbren_events_faq.png",
      "/unbren_event_contact.png",
    ],
    liveUrl: "https://unbren-events.vercel.app",
    stack: [
      "Next.js 16",
      "React 19",
      "Sanity CMS",
      "Motion",
      "Lenis",
      "Tailwind CSS v4",
      "TypeScript",
    ],
    features: [
      "Headless CMS Integration",
      "Smooth Scroll Experience",
      "Interactive Event Showcase",
      "Responsive & Performance-First Architecture",
    ],
  },
  {
    id: "unbren-studio",
    slug: "unbren-studio",
    title: "Unbren Studio",
    category: "web",
    coverImage: "/unbren_studio_cover.png",
    image: "/unbren_studio_homepage.png",
    year: "2025",
    tags: ["Next.js 16", "Sanity CMS", "Motion 12", "Lenis"],
    description:
      "Unbren Studio is a full-service creative agency web platform engineered for high visual impact and conversion. Built on Next.js 16 and React 19, the site integrates a headless Sanity CMS architecture for real-time project publishing, paired with Lenis smooth-scroll physics and Motion 12 micro-interactions. Highlights include interactive Bento Grid showcases, transparent pricing packages, and dynamic consultation workflows.",
    client: "Unbren Studio",
    role: "Fullstack Architect & Creative Developer",
    gallery: [
      "/unbren_studio_about.png",
      "/unbren_studio_prices.png",
      "/unbron_studio_CTO.png",
    ],
    liveUrl: "https://unbren-studio.vercel.app",
    stack: [
      "Next.js 16",
      "React 19",
      "Sanity CMS",
      "Motion 12",
      "Lenis Smooth Scroll",
      "Tailwind CSS v4",
      "Zod & React Hook Form",
      "TypeScript",
    ],
    features: [
      "Sanity Headless CMS Content Pipeline",
      "Interactive Bento Grid Feature Showcase",
      "Custom Pricing & Services Calculator",
      "Lenis Smooth Scroll & Kinetic Motion",
      "Dynamic CTA & Consultation Workflow",
      "Persistent Light / Dark Theme System",
    ],
  },
  {
    id: "learning-hub",
    slug: "learning-hub",
    title: "Learning Hub",
    category: "web",
    coverImage: "/learninghub_cover.png",
    image: "/learninghub_homepage.png",
    year: "2025",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    description:
      "An interactive educational platform designed for seamless online learning. Features course catalogs, interactive bento grid showcases, structured pricing tiers, and modern responsive UI components tailored for optimal student engagement.",
    client: "Learning Hub",
    role: "Fullstack / Frontend Lead",
    gallery: [
      "/learninghub_courses.png",
      "/learninghub_bentogrid.png",
      "/learninghub_prices.png",
    ],
    liveUrl: "https://learninghub-chi.vercel.app",
    stack: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
    features: [
      "Interactive Course Showcase",
      "Bento Grid Feature Section",
      "Structured Tier Pricing",
      "Responsive & Accessible UI Architecture",
    ],
  },
];
