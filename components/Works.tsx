"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Section, GridItem } from "./Section";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PROJECTS, type Category } from "@/lib/projects";
import { useTheme } from "./ThemeProvider";

export function Works() {
  const { language } = useTheme();
  const isRO = language === "RO";
  const [activeCategory, setActiveCategory] = useState<Category>("web");
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleCategoryChange = (cat: Category) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
  };

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

  // Tab Sliding Animation with Recoil
  useGSAP(
    () => {
      if (!sliderRef.current) return;
      gsap.to(sliderRef.current, {
        xPercent: activeCategory === "web" ? 0 : 100,
        duration: 0.4,
        ease: "power3.inOut",
        overwrite: "auto",
        force3D: true,
      });
    },
    { scope: containerRef, dependencies: [activeCategory] },
  );

  return (
    <Section ref={containerRef} id="works" className="py-24 lg:py-40">
      <GridItem span="col-span-full">
        <div className="works-header flex flex-col md:flex-row md:items-end justify-between gap-12 mb-4 md:mb-6 text-left">
          <div className="flex flex-col items-start">
            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">
              {isRO ? "Lucrări alese*" : "Selected Works*"}
            </h2>

            {/* ROUNDED TAB SWITCHER (PREMIUM - MATCHES ALL WORKS) */}
            <div className="relative flex w-full md:w-[520px] h-14 lg:h-16 p-1.5 bg-background border-[2px] border-foreground rounded-full origin-left transition-all duration-500">
              {/* SLIDING BACKGROUND (PRIMARY) */}
              <div
                ref={sliderRef}
                className="absolute top-1.5 bottom-1.5 left-1.5 rounded-full"
                style={{
                  width: "calc(50% - 6px)",
                }}
              >
                <div className="slider-bg w-full h-full bg-foreground rounded-full" />
              </div>

              {(["web", "design"] as const).map((cat) => {
                let categoryLabel: string;
                if (cat === "web") {
                  categoryLabel = isRO ? "Dezvoltare web" : "Web Development";
                } else {
                  categoryLabel = isRO ? "Design Vizual" : "Visual Design";
                }
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`relative z-10 flex-1 flex items-center justify-center rounded-full text-sm lg:text-lg font-bold tracking-tight transition-all duration-300 active:scale-95 ${
                      activeCategory === cat
                        ? "text-background"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    {categoryLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-foreground/40 uppercase tracking-widest">
              {isRO
                ? `Afișez ${Math.min(4, filteredProjects.length)} din ${filteredProjects.length} lucrări`
                : `Showing ${Math.min(4, filteredProjects.length)} of ${filteredProjects.length} Projects`}
            </p>
          </div>
        </div>
      </GridItem>

      {filteredProjects.slice(0, 4).map((project) => (
        <GridItem
          key={project.id}
          span="col-span-full md:col-span-4 lg:col-span-6"
          className="project-card group mb-8"
        >
          <Link href={`/works/${project.slug}`} className="block">
            <div className="relative aspect-4/5 lg:aspect-16/10 overflow-hidden bg-card border border-border/50 mb-4 hover-invert">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover grayscale transition-transform duration-[1000ms] ease-out group-hover:grayscale-0 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Category tag inside image */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-background/80 backdrop-blur-sm border border-foreground/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.category}
                </span>
              </div>
            </div>

            <div className="flex items-start justify-between px-1 gap-4">
              <div className="flex flex-col gap-3 min-w-0">
                <div className="relative inline-flex items-center px-6 py-2 rounded-full w-fit overflow-hidden border-[2px] border-foreground group-hover:border-primary transition-colors duration-500">
                  {/* Background Fill (matching All Works button) */}
                  <div className="absolute inset-0 bg-primary translate-y-[102%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />

                  <div className="relative z-10 h-6 lg:h-8 overflow-hidden font-bold">
                    <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                      <h3 className="font-special text-lg lg:text-2xl uppercase text-foreground group-hover:text-background truncate h-6 lg:h-8 flex items-center transition-colors duration-500">
                        {project.title}
                      </h3>
                      <h3 className="font-special text-lg lg:text-2xl uppercase text-background truncate h-6 lg:h-8 flex items-center">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Visual Tags/Stack preview */}
                <div className="flex flex-wrap gap-2 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] uppercase tracking-tighter border border-foreground/10 px-1.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-8 lg:h-10 overflow-hidden shrink-0 mt-1">
                <div className="flex flex-col items-end transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                  <div className="h-8 lg:h-10 flex items-center">
                    <span className="font-mono text-xs lg:text-sm font-bold tracking-tighter text-foreground/30 group-hover:text-primary transition-colors">
                      [{project.year}]
                    </span>
                  </div>
                  <div className="h-8 lg:h-10 flex items-center text-primary">
                    <svg
                      className="w-6 h-6 lg:w-7 lg:h-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 7h10v10M7 17L17 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </GridItem>
      ))}

      {/* VIEW ALL PROJECTS - PREMIUM ACTION BLOCK */}
      <GridItem
        span="col-span-full"
        className="mt-8 lg:mt-16 flex justify-center"
      >
        <Link
          href="/works"
          className="group relative w-full lg:w-fit h-16 lg:h-18 flex items-center justify-between pl-8 pr-2 lg:pl-14 lg:pr-2.5 overflow-hidden border-[2px] border-foreground hover:border-background rounded-full cursor-pointer transition-all duration-500"
        >
          {/* BACKGROUND FILL ANIMATION */}
          <div className="absolute inset-0 bg-primary translate-y-[102%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />

          {/* LEFT: SLIDING TEXT */}
          <div className="relative z-10 flex flex-col justify-center min-w-0 mr-12 lg:mr-20">
            <div className="h-8 overflow-hidden">
              <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                <h2 className="font-special text-xl lg:text-3xl uppercase text-foreground h-8 flex items-center">
                  {isRO ? "Toate lucrările*" : "All Works*"}
                </h2>
                <h2 className="font-special text-xl lg:text-3xl uppercase text-background h-8 flex items-center">
                  {isRO ? "Vezi arhiva" : "See Archive"}
                </h2>
              </div>
            </div>
          </div>

          {/* RIGHT: REVEAL ELEMENTS */}
          <div className="relative z-10 flex items-center">
            <div className="w-12 h-12 rounded-full border-[2px] border-foreground group-hover:border-background flex items-center justify-center transition-all duration-500">
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6 text-foreground group-hover:text-background transition-all duration-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M7 7h10v10M7 17L17 7"
                />
              </svg>
            </div>
          </div>
        </Link>
      </GridItem>
    </Section>
  );
}
