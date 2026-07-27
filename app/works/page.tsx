"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, Category } from "@/lib/projects";
import { Section, GridItem } from "@/components/Section";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/components/ThemeProvider";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AllWorks() {
  const { language } = useTheme();
  const isRO = language === "RO";
  const [filter, setFilter] = useState<Category | "all">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects = PROJECTS.filter(
    (p) => filter === "all" || p.category === filter,
  );

  useGSAP(
    () => {
      // Header reveal - ONCE ON MOUNT
      gsap.from(".works-header", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "expo.out",
      });
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      // List reveal - RE-RUNS ON FILTER
      gsap.from(".work-item", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
      });
    },
    { scope: containerRef, dependencies: [filter] },
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <Section className="mb-20 lg:mb-32">
          <GridItem span="col-span-full lg:col-span-9">
            <header className="works-header space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-primary">
                  {isRO ? "Arhivă" : "Archive"}
                </span>
                <span className="h-px w-12 bg-primary/30" />
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  [{filteredProjects.length.toString().padStart(2, "0")}]{" "}
                  {isRO ? "Lucrări" : "Projects"}
                </span>
              </div>
              <h1 className="font-special text-6xl lg:text-9xl uppercase tracking-tighter leading-none">
                {isRO ? "Toate lucrările" : "All Works"}
              </h1>
            </header>
          </GridItem>

          <GridItem span="col-span-full lg:col-span-3 lg:flex lg:items-end lg:justify-end">
            <div className="flex flex-wrap gap-2 lg:mb-4">
              {(["all", "web", "design"] as const).map((cat) => {
                const categoryLabel = cat === "all" && isRO ? "toate" : cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-none border font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
                      filter === cat
                        ? "bg-foreground text-background border-foreground"
                        : "border-border/40 hover:border-foreground/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {categoryLabel}
                  </button>
                );
              })}
            </div>
          </GridItem>
        </Section>

        <Section
          grid={false}
          padding={false}
          className="border-t border-border/40"
        >
          <div className="flex flex-col">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.id}
                href={`/works/${project.slug}`}
                className="work-item group relative block border-b border-border/40 py-6 lg:py-8 hover:bg-muted/30 transition-colors"
              >
                {/* INNER GRID MATCHING GLOBAL CONSTRAINTS */}
                <div className="mx-auto max-w-480 px-4 md:px-12 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-8 items-center">
                  {/* INDEX: COL 1 */}
                  <div className="hidden lg:block lg:col-span-1">
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* TITLE: COL 3 - 8 */}
                  <div className="col-span-3 md:col-span-5 lg:col-span-6 lg:col-start-3">
                    <div className="h-8 lg:h-10 overflow-hidden">
                      <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                        <h2 className="font-mono text-xl lg:text-3xl font-semibold uppercase tracking-tight h-8 lg:h-10 flex items-center">
                          {project.title}
                        </h2>
                        <h2 className="font-mono text-xl lg:text-3xl font-semibold uppercase tracking-tight text-primary h-8 lg:h-10 flex items-center transition-transform duration-500">
                          {project.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* CATEGORY & YEAR: COL 10 - 12 */}
                  <div className="col-span-1 md:col-span-3 lg:col-span-3 lg:col-start-10 flex flex-col items-end lg:flex-row lg:items-center gap-2 lg:gap-8 lg:justify-end text-right">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border border-border/40 px-2 py-0.5 w-fit">
                      {project.category}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                      ©{project.year}
                    </span>
                  </div>

                  {/* IMAGE PREVIEW ON HOVER (DESKTOP) */}
                  <div className="hidden lg:block absolute right-[15%] top-1/2 -translate-y-1/2 w-48 aspect-4/3 overflow-hidden opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none z-20 shadow-2xl">
                    <Image
                      src={project.coverImage || project.image}
                      alt={project.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
