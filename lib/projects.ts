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
    description: "A high-performance e-commerce experience for a luxury tech brand. Built with a focus on seamless transitions and conversion optimization.",
    client: "Nexus Digital",
    role: "Lead Developer",
    gallery: ["/1.jpg", "/2.jpg", "/3.jpg"],
  },
  {
    id: "2",
    slug: "aura-dashboard",
    title: "Aura Dashboard",
    category: "web",
    image: "/hero_portrait_2.png",
    year: "2023",
    tags: ["React", "D3.js", "Tailwind"],
    description: "Data visualization platform for real-time monitoring. Designed to simplify complex datasets into actionable insights.",
    client: "Aura Systems",
    role: "Frontend Architect",
    gallery: ["/2.jpg", "/3.jpg", "/4.jpg"],
  },
  {
    id: "3",
    slug: "brutal-identity",
    title: "Brutal Identity",
    category: "design",
    image: "/hero_portrait_3.png",
    year: "2024",
    tags: ["Branding", "Typography"],
    description: "Brand identity for an underground architecture studio. Inspired by minimalist concrete structures and Swiss typography.",
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
    description: "A mindfulness application focused on reducing digital noise and promoting focus through clean, intentional UI.",
    client: "Zenith Labs",
    role: "UI/UX Designer",
    gallery: ["/4.jpg", "/1.jpg", "/2.jpg"],
  },
  // Add more as needed...
];
