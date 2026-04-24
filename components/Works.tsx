"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Section, GridItem } from "./Section";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Category = "web" | "design";

interface Project {
  id: string;
  title: string;
  category: Category;
  image: string;
  year: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Nexus E-commerce",
    category: "web",
    image: "/hero_portrait_1.png", // Using existing portraits as placeholders
    year: "2024",
    tags: ["Next.js", "Shopify", "GSAP"],
  },
  {
    id: "2",
    title: "Aura Dashboard",
    category: "web",
    image: "/hero_portrait_2.png",
    year: "2023",
    tags: ["React", "D3.js", "Tailwind"],
  },
  {
    id: "3",
    title: "Brutal Identity",
    category: "design",
    image: "/hero_portrait_3.png",
    year: "2024",
    tags: ["Branding", "Typography"],
  },
  {
    id: "4",
    title: "Zen Mobile App",
    category: "design",
    image: "/hero_portrait_4.png",
    year: "2023",
    tags: ["UX/UI", "Product Design"],
  },
  {
    id: "5",
    title: "Vortex Labs",
    category: "web",
    image: "/hero_portrait_1.png",
    year: "2024",
    tags: ["Three.js", "GLSL"],
  },
  {
    id: "6",
    title: "Nova UI Kit",
    category: "design",
    image: "/hero_portrait_2.png",
    year: "2023",
    tags: ["Figma", "Systems"],
  },
  {
    id: "7",
    title: "Quantum Engine",
    category: "web",
    image: "/hero_portrait_3.png",
    year: "2024",
    tags: ["WebGL", "Performance"],
  },
  {
    id: "8",
    title: "Echo Sound System",
    category: "web",
    image: "/hero_portrait_4.png",
    year: "2024",
    tags: ["Audio API", "React"],
  },
  {
    id: "9",
    title: "Synthesis Branding",
    category: "design",
    image: "/hero_portrait_1.png",
    year: "2023",
    tags: ["Identity", "Layout"],
  },
  {
    id: "10",
    title: "Orbit Smart Watch",
    category: "design",
    image: "/hero_portrait_2.png",
    year: "2024",
    tags: ["Product", "UI/UX"],
  },
];

export function Works() {
  const [activeCategory, setActiveCategory] = useState<Category>("web");
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = PROJECTS.filter(
    (p) => p.category === activeCategory,
  );

  useGSAP(
    () => {
      // Reveal grid items on scroll
      gsap.from(".project-card", {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope: containerRef, dependencies: [activeCategory] },
  );

  return (
    <Section ref={containerRef} id="works" className="py-24 lg:py-40">
      <GridItem span="col-span-full">
        <div className="works-header flex flex-col md:flex-row md:items-end justify-between gap-12 mb-4 md:mb-6 text-left">
          <div className="flex flex-col items-start">
            <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-foreground/40 mb-4">
              Selected Works*
            </h2>

            {/* SHARP TAB SWITCHER (GLASSMORPHISM) */}
            <div className="relative flex w-full md:w-[480px] h-12 lg:h-14 p-1 bg-foreground/[0.03] dark:bg-white/[0.05] backdrop-blur-2xl border border-border rounded-none overflow-hidden origin-left">
              {/* SLIDING BACKGROUND (NEUTRAL) */}
              <div
                className="absolute top-1 bottom-1 left-1 rounded-none bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{
                  width: "calc(50% - 4px)",
                  transform: `translateX(${activeCategory === "web" ? "0" : "100%"})`,
                }}
              />

              {(["web", "design"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative z-10 flex-1 flex items-center justify-center rounded-none text-sm lg:text-base font-bold tracking-tight transition-colors duration-300 ${
                    activeCategory === cat
                      ? "text-background"
                      : "text-foreground/40 hover:text-foreground/60"
                  }`}
                >
                  {cat === "web" ? "Web Development" : "Visual Design"}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-foreground/40 uppercase tracking-widest">
              Showing 4 of {filteredProjects.length} Projects
            </p>
          </div>
        </div>
      </GridItem>

      {filteredProjects.slice(0, 4).map((project) => (
        <GridItem
          key={project.id}
          span="col-span-full md:col-span-4 lg:col-span-6"
          className="project-card group cursor-pointer mb-8"
        >
          <div className="relative aspect-[4/5] lg:aspect-[16/10] overflow-hidden bg-card border border-border/50 mb-1">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex items-center justify-between px-1 gap-4">
            <div className="flex items-baseline gap-4 min-w-0">
              <div className="h-8 lg:h-12 overflow-hidden">
                <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                  <h3 className="font-special text-2xl lg:text-4xl uppercase text-foreground truncate h-8 lg:h-12 flex items-center">
                    {project.title}
                  </h3>
                  <h3 className="font-special text-2xl lg:text-4xl uppercase text-primary truncate h-8 lg:h-12 flex items-center">
                    {project.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* YEAR TO ARROW SLIDE */}
            <div className="h-8 lg:h-10 overflow-hidden flex-shrink-0">
              <div className="flex flex-col items-end transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                {/* STATE 1: YEAR */}
                <div className="h-8 lg:h-10 flex items-center">
                  <span className="font-mono text-xs lg:text-sm font-bold tracking-tighter text-foreground/30 group-hover:text-primary transition-colors">
                    [{project.year}]
                  </span>
                </div>
                {/* STATE 2: ARROW */}
                <div className="h-8 lg:h-10 flex items-center text-primary">
                  <svg 
                    className="w-6 h-6 lg:w-7 lg:h-7" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h10v10M7 17L17 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </GridItem>
      ))}

      {/* VIEW ALL PROJECTS - PREMIUM ACTION BLOCK */}
      <GridItem span="col-span-full" className="mt-4 lg:mt-8">
        <button className="group relative w-full h-16 lg:h-24 flex items-center justify-between px-6 lg:px-12 overflow-hidden border border-border/50 cursor-pointer">
          {/* BACKGROUND FILL ANIMATION */}
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />

          {/* LEFT: SLIDING TEXT */}
          <div className="relative z-10 flex flex-col justify-center min-w-0">
            <div className="h-8 lg:h-12 overflow-hidden">
              <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                <h2 className="font-special text-xl lg:text-4xl uppercase text-foreground h-8 lg:h-12 flex items-center">
                  All Works*
                </h2>
                <h2 className="font-special text-xl lg:text-4xl uppercase text-background h-8 lg:h-12 flex items-center">
                  See Archive
                </h2>
              </div>
            </div>
          </div>

          {/* RIGHT: REVEAL ELEMENTS */}
          <div className="relative z-10 flex items-center gap-6 lg:gap-8">
            <span className="hidden md:block text-[10px] lg:text-xs font-bold uppercase tracking-[0.1em] text-foreground group-hover:text-background transition-colors duration-500 delay-100">
              Total {PROJECTS.length} Items
            </span>

            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border border-border/30 group-hover:border-background/50 flex items-center justify-center transition-all duration-500">
              <svg 
                className="w-7 h-7 lg:w-7 lg:h-7 text-foreground group-hover:text-background transition-all duration-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h10v10M7 17L17 7" />
              </svg>
            </div>
          </div>
        </button>
      </GridItem>
    </Section>
  );
}
