"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { IndexProject } from "@/lib/index-projects";
import { Section } from "./Section";
import { useTheme } from "./ThemeProvider";

export type ProjectCardSummary = Pick<
  IndexProject,
  | "id"
  | "slug"
  | "title"
  | "year"
  | "category"
  | "services"
  | "image"
  | "aspectClass"
  | "alt"
>;

interface ProjectIndexCardProps {
  project: ProjectCardSummary;
}

function ProjectIndexCard({ project }: ProjectIndexCardProps) {
  return (
    <article className="w-full flex flex-col">
      <Link
        href={`/works/${project.slug}`}
        className="block group select-text cursor-pointer"
      >
        {/* 1. Image container: sharp square corners, no border radius, no borders, no shadows */}
        <div
          className={`relative w-full overflow-hidden bg-muted/20 ${project.aspectClass}`}
        >
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover object-center select-none pointer-events-none transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>

        {/* 2. Gap: ~8px */}
        <div className="mt-2">
          {/* 3. Title: PROJECT NAME • YEAR in Lekton BOLD */}
          <h3 className="font-lekton font-bold uppercase tracking-editorial text-xs sm:text-sm text-[#2b2825] dark:text-[#e6e2dc] leading-tight">
            {project.title}
            <span className="whitespace-nowrap inline-flex items-center">
              <span className="mx-0.5 lg:mx-1 font-bold">•</span>
              {project.year}
            </span>
          </h3>
        </div>

        {/* 4. Desktop & Tablet Only Metadata (Hidden on Mobile) */}
        <div className="hidden md:block">
          {/* First 1px full-width solid dark line */}
          <div className="mt-1.5 border-t border-[#2b2825] dark:border-white/20" />

          {/* 5. Category line: Google Sans Flex */}
          <div className="py-1">
            <p className="font-heading font-normal tracking-tight text-sm leading-tight text-[#2b2825]/60 dark:text-[#e6e2dc]/60 group-hover:text-[#2b2825] dark:group-hover:text-[#e6e2dc] transition-colors duration-300">
              {project.category}
            </p>
          </div>

          {/* 6. Second 1px full-width dark line */}
          <div className="border-t border-[#2b2825] dark:border-white/20" />

          {/* 7. Services line: Google Sans Flex */}
          <div className="pt-1">
            <p className="font-heading font-normal tracking-tight text-sm leading-tight text-[#2b2825]/60 dark:text-[#e6e2dc]/60 group-hover:text-[#2b2825] dark:group-hover:text-[#e6e2dc] transition-colors duration-300">
              {project.services}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProjectIndex({
  projects,
}: {
  projects: ProjectCardSummary[];
}) {
  const { language } = useTheme();
  const isRO = language === "RO";

  // Mobile (4 cols) & Tablet (8 cols) 2-column distribution:
  // Col 1: 0, 2, 4 (UNBREN Events, QXT Energy, Domino Travel)
  // Col 2: 1, 3, 5 (UNBREN Studio, Fuga, Anastomosis)
  const mobileCol1 = projects.filter((_, idx) => idx % 2 === 0);
  const mobileCol2 = projects.filter((_, idx) => idx % 2 === 1);

  return (
    <Section
      id="project-index"
      padding={false}
      grid={false}
      className="py-16 md:py-24 lg:py-32 bg-transparent"
    >
      <div className="w-full mx-auto max-w-480 px-4 md:px-12">
        {/* HEADER: Snapped directly to the project's 4/8/12 column grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-8 items-start mb-12 md:mb-16 lg:mb-20">
          <div className="col-span-full lg:col-span-8 flex flex-col text-left">
            <span className="font-lekton text-xs uppercase tracking-editorial font-normal text-foreground/60 block">
              {isRO ? "SPUS DIFERIT, DE FIECARE DATĂ." : "TOLD DIFFERENT, EVERY TIME."}
            </span>
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-normal uppercase tracking-tight text-foreground leading-tight mt-1">
              {isRO ? "CONSTRUIM POVEȘTI VIZUALE" : "WE’RE VISUAL STORYTELLERS"}
            </h2>
            <p className="font-lekton text-sm uppercase tracking-editorial font-normal text-foreground/70 leading-relaxed max-w-xl mt-3">
              {isRO
                ? "FIECARE BRAND ARE PROPRIA POVESTE, AUDIENȚĂ, PERSONALITATE ȘI AMBIȚIE. ROLUL MEU ESTE SĂ GĂSESC CE ÎL FACE DISTINCT ȘI SĂ CONSTRUIESC DE ACOLO."
                : "EVERY BRAND HAS ITS OWN STORY, AUDIENCE, PERSONALITY, AND AMBITION. OUR JOB IS TO FIND WHAT MAKES IT DISTINCT AND BUILD FROM THERE."}
            </p>
          </div>
        </div>

        {/* MOBILE & TABLET MASONRY GRID (< 1024px): 
            Mobile (4 cols): each column spans 2 cols (gap-5)
            Tablet (8 cols): each column spans 4 cols (gap-6) */}
        <div className="grid grid-cols-4 md:grid-cols-8 lg:hidden gap-5 md:gap-6 items-start">
          {/* Column 1: Spans cols 1-2 on mobile, cols 1-4 on tablet */}
          <div className="col-span-2 md:col-span-4 flex flex-col space-y-6 sm:space-y-8">
            {mobileCol1.map((project) => (
              <ProjectIndexCard
                key={`mob-c1-${project.id}`}
                project={project}
              />
            ))}
          </div>

          {/* Column 2: Spans cols 3-4 on mobile, cols 5-8 on tablet */}
          <div className="col-span-2 md:col-span-4 flex flex-col space-y-6 sm:space-y-8">
            {mobileCol2.map((project) => (
              <ProjectIndexCard
                key={`mob-c2-${project.id}`}
                project={project}
              />
            ))}
          </div>
        </div>

        {/* DESKTOP GRID (>= 1024px):
            12 columns, native gap-8 (32px), each card spans exactly 4 columns.
            Row 1: Cols 1-4, 5-8, 9-12 (strictly top-aligned with items-start)
            Row 2: Cols 1-4, 5-8, 9-12 (strictly top-aligned with items-start)
            Row gap: compact 80px (96px on xl) */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20 xl:gap-y-24 items-start">
          {projects.map((project) => (
            <div key={`desk-${project.id}`} className="col-span-4">
              <ProjectIndexCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
