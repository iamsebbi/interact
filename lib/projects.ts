export type Category = "web" | "design";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: Category;
  image: string;
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
    id: "1",
    slug: "nexus-ecommerce",
    title: "Nexus E-commerce",
    category: "web",
    image: "/hero_portrait_1.png",
    year: "2024",
    tags: ["Next.js", "Shopify", "GSAP"],
    description:
      "A high-performance e-commerce experience for a luxury tech brand. Built with a focus on seamless transitions and conversion optimization. The architecture prioritizes speed and scalability, utilizing a headless Shopify approach.",
    client: "Nexus Digital",
    role: "Lead Developer",
    gallery: ["/1.jpg", "/2.jpg", "/3.jpg"],
    liveUrl: "https://nexus-ecommerce.demo",
    githubUrl: "https://github.com/iamsebbi/nexus-ecommerce",
    stack: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "Shopify Hydrogen",
    ],
    features: [
      "Headless Commerce",
      "Custom Page Builder",
      "Performance Optimization",
      "Dynamic Animations",
    ],
  },
  {
    id: "2",
    slug: "aura-dashboard",
    title: "Aura Dashboard",
    category: "web",
    image: "/hero_portrait_2.png",
    year: "2023",
    tags: ["React", "D3.js", "Tailwind"],
    description:
      "Data visualization platform for real-time monitoring. Designed to simplify complex datasets into actionable insights. Implemented custom D3.js components for highly interactive data representation.",
    client: "Aura Systems",
    role: "Frontend Architect",
    gallery: ["/2.jpg", "/3.jpg", "/4.jpg"],
    liveUrl: "https://aura-dashboard.demo",
    stack: ["React", "D3.js", "Recoil", "Framer Motion"],
    features: [
      "Real-time Data Streaming",
      "Interactive Charts",
      "Customizable Widgets",
    ],
  },
  {
    id: "3",
    slug: "brutal-identity",
    title: "Brutal Identity",
    category: "design",
    image: "/hero_portrait_3.png",
    year: "2024",
    tags: ["Branding", "Typography"],
    description:
      "Brand identity for an underground architecture studio. Inspired by minimalist concrete structures and Swiss typography.",
    client: "Concrete Forms",
    role: "Visual Designer",
    gallery: ["/3.jpg", "/4.jpg", "/1.jpg"],
  },
  {
    id: "4",
    slug: "zen-mobile-app",
    title: "Zen Mobile App",
    category: "design",
    image: "/hero_portrait_4.png",
    year: "2023",
    tags: ["UX/UI", "Product Design"],
    description:
      "A mindfulness application focused on reducing digital noise and promoting focus through clean, intentional UI.",
    client: "Zenith Labs",
    role: "Product Designer",
    gallery: ["/4.jpg", "/1.jpg", "/2.jpg"],
  },
];
