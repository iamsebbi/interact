"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Navbar } from "./Navbar";
import { useTheme } from "./ThemeProvider";
import type { IndexProject } from "@/lib/index-projects";

interface ProjectDetailClientProps {
  project: IndexProject;
  nextProject: Pick<IndexProject, "slug" | "title">;
}

export function ProjectDetailClient({
  project,
  nextProject,
}: ProjectDetailClientProps) {
  const { language } = useTheme();
  const isRO = language === "RO";
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".project-reveal", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.1,
      });
    },
    { scope: containerRef },
  );

  const summaryText = project.summary
    ? isRO
      ? project.summary.ro
      : project.summary.en
    : isRO
      ? `Proiect digital realizat pentru ${project.title}, axat pe identitate vizuală, performanță și experiență interactivă.`
      : `Bespoke digital experience crafted for ${project.title}, focused on visual identity, performance, and interactive precision.`;

  const aboutText = project.about
    ? isRO
      ? project.about.ro
      : project.about.en
    : project.category;

  const specRows = [
    {
      label: isRO ? "DESPRE:" : "ABOUT:",
      value: aboutText,
    },
    {
      label: isRO ? "CE AM FĂCUT:" : "WHAT WE DID:",
      value: project.services,
    },
    {
      label: isRO ? "INDUSTRIE:" : "INDUSTRY:",
      value: project.category,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background text-foreground flex flex-col"
    >
      <Navbar />

      <main className="grow pt-[calc(7rem+env(safe-area-inset-top))] sm:pt-[calc(9rem+env(safe-area-inset-top))] pb-20 md:pb-28">
        <div className="w-full max-w-480 mx-auto px-4 md:px-12">
          {/* PROJECT HERO (2 COLUMNS: INFO + TABLE | HERO IMAGE) */}
          <header className="project-reveal grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-14 md:mb-24">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <span className="font-lekton text-xs uppercase tracking-editorial font-normal text-foreground/60 block">
                  {isRO ? "PROIECT SELECTAT" : "SELECTED WORK"}&nbsp;—&nbsp;{project.year}
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal uppercase tracking-tight text-foreground leading-tight mt-1">
                  {project.title}
                </h1>
                <p className="font-lekton text-sm text-foreground/75 leading-relaxed max-w-xl mt-3">
                  {summaryText}
                </p>
              </div>

              {/* 3-ROW SPECIFICATION TABLE */}
              <div>
                {specRows.map((row) => (
                  <div
                    key={row.label}
                    className="border-b border-foreground/30 py-3 font-lekton text-xs sm:text-sm uppercase tracking-editorial"
                  >
                    <span className="font-bold text-foreground mr-2">
                      {row.label}
                    </span>
                    <span className="font-heading font-normal tracking-normal text-foreground/80">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* HERO COVER MEDIA */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-card border border-border">
              {project.heroVideo ? (
                <video
                  src={project.heroVideo}
                  poster={project.heroImage || project.image}
                  autoPlay
                  muted
                  playsInline
                  onEnded={(e) => e.currentTarget.pause()}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <Image
                  src={project.heroImage || project.image}
                  alt={project.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              )}
            </div>
          </header>

          {/* VERTICAL REELS (9:16): Horizontal snap scroll on < lg, 12-col grid (3 x 4 cols) on lg+ */}
          {project.verticalVideos && project.verticalVideos.length > 0 && (
            <section className="project-reveal mb-14 md:mb-24 -mx-4 md:-mx-12 lg:mx-0">
              <div className="no-scrollbar flex lg:grid lg:grid-cols-12 gap-5 md:gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none px-4 md:px-12 lg:px-0 scroll-px-4 md:scroll-px-12">
                {project.verticalVideos.map((item, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 w-[76%] sm:w-[60%] md:w-[44%] lg:w-auto lg:col-span-4 snap-start relative aspect-[9/16] overflow-hidden bg-card border border-border"
                  >
                    <video
                      src={item.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-label={item.alt}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CHALLENGE & SOLUTION */}
          {(project.challenge || project.solution) && (
            <section className="project-reveal grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-28">
              {project.challenge && (
                <div className="col-span-4 md:col-span-4 lg:col-span-6 flex flex-col gap-3">
                  <span className="font-lekton text-xs uppercase tracking-editorial text-foreground/50">
                    {isRO ? "PROVOCAREA" : "THE CHALLENGE"}
                  </span>
                  <div className="w-full border-t border-border/60 mb-2" />
                  <p className="font-heading text-base sm:text-lg leading-relaxed text-foreground/85">
                    {isRO ? project.challenge.ro : project.challenge.en}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="col-span-4 md:col-span-4 lg:col-span-6 flex flex-col gap-3">
                  <span className="font-lekton text-xs uppercase tracking-editorial text-foreground/50">
                    {isRO ? "ARHITECTURA & SOLUȚIA" : "THE SOLUTION"}
                  </span>
                  <div className="w-full border-t border-border/60 mb-2" />
                  <p className="font-heading text-base sm:text-lg leading-relaxed text-foreground/85">
                    {isRO ? project.solution.ro : project.solution.en}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* SHOWCASE MEDIA (2-COL + FULL-WIDTH OUTRO) */}
          {((project.showcaseMedia && project.showcaseMedia.length > 0) ||
            project.outroVideo) && (
            <section className="project-reveal grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-28">
              {project.showcaseMedia?.map((media, idx) => (
                <div
                  key={idx}
                  className="relative w-full aspect-[16/10] overflow-hidden bg-card border border-border"
                >
                  {media.type === "video" ? (
                    <video
                      src={media.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <Image
                      src={media.src}
                      alt={media.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  )}
                </div>
              ))}

              {project.outroVideo && (
                <div className="md:col-span-2 relative w-full aspect-[2560/1098] overflow-hidden bg-card border border-border">
                  <video
                    src={project.outroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
            </section>
          )}

          {/* PROJECT GALLERY */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="project-reveal mb-20 md:mb-28">
              <div className="mb-8">
                <span className="font-lekton text-xs uppercase tracking-editorial text-foreground/50 block">
                  {isRO ? "GALERIE VIZUALĂ" : "VISUAL SHOWCASE"}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-normal uppercase tracking-tight text-foreground mt-1">
                  {isRO ? "INTERFAȚĂ & DETALII" : "INTERFACE & DETAILS"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {project.gallery.map((item, idx) => (
                  <figure key={idx} className="flex flex-col gap-2.5">
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-card border border-border">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-top"
                      />
                    </div>
                    {item.caption && (
                      <figcaption className="font-lekton text-xs text-foreground/60">
                        {isRO ? item.caption.ro : item.caption.en}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* NEXT PROJECT FOOTER NAVIGATION */}
          <section className="project-reveal border-t border-border/60 pt-10 md:pt-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-lekton text-xs uppercase tracking-editorial text-foreground/50 block mb-1">
                {isRO ? "PROIECTUL URMĂTOR" : "NEXT PROJECT"}
              </span>
              <Link
                href={`/works/${nextProject.slug}`}
                className="group inline-flex items-center gap-3 font-heading text-2xl sm:text-4xl font-medium uppercase tracking-tight text-foreground hover:text-primary transition-colors"
              >
                <span>{nextProject.title}</span>
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>

            <Link
              href="/#project-index"
              className="font-lekton text-xs uppercase tracking-editorial text-foreground/60 hover:text-foreground transition-colors"
            >
              {isRO ? "[ TOATE PROIECTELE ]" : "[ ALL PROJECTS ]"}
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
