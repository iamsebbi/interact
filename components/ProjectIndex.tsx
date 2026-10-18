"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { INDEX_PROJECTS, IndexProject } from "@/lib/index-projects";
import { Section } from "./Section";

interface ProjectIndexCardProps {
  project: IndexProject;
}

function ProjectIndexCard({ project }: ProjectIndexCardProps) {
  return (
    <article className="w-full flex flex-col">
      <Link
        href={`/works/${project.slug}`}
        className="block group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground select-text"
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
            className="object-cover object-center select-none pointer-events-none"
            loading="lazy"
          />
        </div>

        {/* 2. Gap: ~14px */}
        <div className="mt-[14px]">
          {/* 3. Title: PROJECT NAME • YEAR in Lekton BOLD */}
          <h3 className="font-lekton font-bold uppercase tracking-editorial text-sm lg:text-xs text-[#2b2825] dark:text-[#e6e2dc] leading-tight">
            {project.title}
            <span className="mx-0.5 lg:mx-1 font-bold">•</span>
            {project.year}
          </h3>
        </div>

        {/* 4. Gap: ~12px */}
        {/* 5. First 1px full-width solid dark line */}
        <div className="mt-[12px] border-t border-[#2b2825] dark:border-white/20" />

        {/* 6. Category line: Lekton regular, monochrome */}
        <div className="py-[10px]">
          <p className="font-lekton font-normal uppercase tracking-editorial text-sm lg:text-xs leading-tight text-[#2b2825] dark:text-[#e6e2dc] transition-colors">
            {project.category}
          </p>
        </div>

        {/* 7. Second 1px full-width dark line */}
        <div className="border-t border-[#2b2825] dark:border-white/20" />

        {/* 8. Services line: allowed to wrap, monochrome */}
        <div className="pt-[10px]">
          <p className="font-lekton font-normal uppercase tracking-editorial text-sm lg:text-xs leading-relaxed text-[#2b2825] dark:text-[#e6e2dc] transition-colors">
            {project.services}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function ProjectIndex() {
  // Keep exactly 6 projects (2 rows of 3 on desktop, 3 rows of 2 on mobile)
  const projects = INDEX_PROJECTS.slice(0, 6);

  // Mobile (4 cols) & Tablet (8 cols) 2-column distribution:
  // Col 1: 0, 2, 4 (República Reserve, QXT Energy, Domino Travel)
  // Col 2: 1, 3, 5 (En Haus, Fuga, Anastomosis)
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
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-8 items-start mb-[95px] lg:mb-[200px]">
          {/* Left Block: 8 columns on desktop */}
          <div className="col-span-4 md:col-span-5 lg:col-span-8 flex flex-col text-left">
            <span className="font-lekton text-sm lg:text-xs uppercase tracking-editorial font-normal text-[#6b645b] dark:text-[#9c9489]">
              TOLD DIFFERENT, EVERY TIME.
            </span>
            <h2 className="font-heading text-[22px] lg:text-xl font-normal tracking-tight text-[#2b2825] dark:text-[#e6e2dc] leading-tight mt-1">
              WE’RE VISUAL STORYTELLERS
            </h2>
          </div>

          {/* Right Block: starts at column 9, spans 4 columns, flush right against column 12 margin */}
          <div className="col-span-4 md:col-span-3 lg:col-span-4 lg:col-start-9 flex lg:justify-end text-left lg:text-justify">
            <div className="w-full lg:w-[170px]">
              <p className="font-lekton text-sm lg:text-xs uppercase tracking-editorial font-normal text-[#2b2825] dark:text-[#e6e2dc] leading-[1.35] lg:leading-[1.3] text-justify hyphens-auto">
                EVERY BRAND HAS ITS OWN STORY, AUDIENCE, PERSONALITY, AND
                AMBITION. OUR JOB IS TO FIND WHAT MAKES IT DISTINCT AND BUILD
                FROM THERE.
              </p>
            </div>
          </div>
        </div>

        {/* MOBILE & TABLET MASONRY GRID (< 1024px): 
            Mobile (4 cols): each column spans 2 cols (gap-5)
            Tablet (8 cols): each column spans 4 cols (gap-6) */}
        <div className="grid grid-cols-4 md:grid-cols-8 lg:hidden gap-5 md:gap-6 items-start">
          {/* Column 1: Spans cols 1-2 on mobile, cols 1-4 on tablet */}
          <div className="col-span-2 md:col-span-4 flex flex-col space-y-[65px]">
            {mobileCol1.map((project) => (
              <ProjectIndexCard
                key={`mob-c1-${project.id}`}
                project={project}
              />
            ))}
          </div>

          {/* Column 2: Spans cols 3-4 on mobile, cols 5-8 on tablet */}
          <div className="col-span-2 md:col-span-4 flex flex-col space-y-[65px]">
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
            Row gap: 350px */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-[350px] items-start">
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
