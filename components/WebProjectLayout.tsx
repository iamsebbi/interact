"use client";

import Image from "next/image";
import Link from "next/link";
import { Section, GridItem } from "@/components/Section";
import { Project } from "@/lib/projects";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface WebProjectLayoutProps {
  project: Project;
}

export function WebProjectLayout({ project }: WebProjectLayoutProps) {
  const { language } = useTheme();
  const isRO = language === "RO";
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".web-hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          ".browser-mockup",
          {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
          },
          "-=0.6",
        )
        .from(
          ".tech-card",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.8",
        );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="bg-background">
      {/* HERO SECTION - TECH STYLE */}
      <Section className="pt-32 lg:pt-48 pb-12">
        <GridItem span="col-span-full lg:col-span-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary border border-primary/20 px-2 py-0.5">
                {isRO ? "Dezvoltare web" : "Web Development"}
              </span>
              <span className="font-mono text-[10px] text-foreground/40">
                {project.year}
              </span>
            </div>
            <h1 className="web-hero-title font-special text-[12vw] md:text-8xl lg:text-[7rem] leading-[0.85] uppercase tracking-tighter break-words">
              {project.title}
            </h1>
          </div>
        </GridItem>

        <GridItem span="col-span-full lg:col-span-4 lg:flex lg:flex-col lg:justify-end lg:items-end mt-8 lg:mt-0">
          <div className="flex flex-wrap gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 md:px-8 md:py-4 bg-foreground text-background font-mono text-[10px] uppercase tracking-widest hover:bg-primary transition-colors flex-1 md:flex-none text-center"
              >
                {isRO ? "Vizionează site-ul live" : "Visit Live Site"}
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 md:px-8 md:py-4 border border-foreground font-mono text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors flex-1 md:flex-none text-center"
              >
                {isRO ? "Vezi codul sursă" : "View Code"}
              </a>
            )}
          </div>
        </GridItem>
      </Section>

      {/* BROWSER MOCKUP SECTION */}
      <Section className="py-0">
        <GridItem span="col-span-full">
          <div className="browser-mockup relative w-full border border-border/40 rounded-xl overflow-hidden bg-card shadow-2xl">
            {/* Browser Header */}
            <div className="flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-border/40 bg-muted/20">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-border/40" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-border/40" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-border/40" />
              </div>
              <div className="flex-1 max-w-xl mx-auto h-6 md:h-7 bg-background border border-border/20 rounded-md flex items-center px-4">
                <span className="font-mono text-[9px] md:text-[10px] text-foreground/30 truncate">
                  {project.liveUrl || `https://${project.slug}.com`}
                </span>
              </div>
            </div>
            {/* Browser Content */}
            <div className="relative aspect-video lg:aspect-[21/9] overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </GridItem>
      </Section>

      {/* TECH SPECS & DESCRIPTION */}
      <Section className="py-24 lg:py-32">
        <GridItem span="col-span-full lg:col-span-4">
          <div className="flex flex-col gap-12 lg:sticky lg:top-32">
            <div className="tech-card border-l-2 border-primary pl-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-4">
                Stack principal
              </span>
              <div className="flex flex-wrap gap-2">
                {project.stack?.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs uppercase bg-muted px-3 py-1 border border-border/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="tech-card border-l border-border pl-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-4">
                Rol și client
              </span>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase font-bold">
                  {isRO ? "Rol" : "Role"}: {project.role}
                </span>
                <span className="font-mono text-xs uppercase font-bold">
                  Client: {project.client}
                </span>
              </div>
            </div>
          </div>
        </GridItem>

        <GridItem span="col-span-full lg:col-span-7 lg:col-start-6 mt-12 lg:mt-0">
          <div className="flex flex-col gap-16">
            <div className="tech-card">
              <h3 className="font-special text-2xl uppercase mb-6">
                {isRO ? "Prezentare generală" : "Overview"}
              </h3>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground/80">
                {project.description}
              </p>
            </div>

            <div className="tech-card grid grid-cols-2 gap-8 lg:gap-12">
              <div className="col-span-full md:col-span-1">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-6">
                  {isRO ? "Funcționalități cheie" : "Key Features"}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {project.features?.map((feature, i) => (
                    <div
                      key={i}
                      className="group/feature flex items-center gap-4 p-3 border border-border/40 bg-card/30 hover:bg-primary/5 hover:border-primary/30 transition-all"
                    >
                      <span className="font-mono text-[10px] text-primary/40 group-hover/feature:text-primary transition-colors">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="text-sm font-bold uppercase tracking-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-full md:col-span-1">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-6">
                  {isRO ? "Focus dezvoltare" : "Development Focus"}
                </h4>
                <div className="p-4 border border-border/40 bg-muted/20 relative">
                  <div className="absolute top-0 right-0 p-1">
                    <span className="font-mono text-[8px] text-foreground/20 uppercase">
                      {isRO ? "Logica principală" : "Core Logic"}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-mono uppercase">
                    {isRO
                      ? "Arhitectură gândită pentru viteză și mentenanță. Folosește animații GSAP declanșate la scroll și un management de stare simplu, pentru o experiență fluidă."
                      : "Architecture built for speed and maintainability. Implementing advanced GSAP scroll-triggered animations and state management for a seamless user journey."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GridItem>
      </Section>

      {/* FULL GALLERY */}
      <Section className="py-12 lg:py-24 bg-muted/30">
        <GridItem span="col-span-full">
          <div className="grid grid-cols-2 gap-8 lg:gap-12">
            {project.gallery.map((img, i) => (
              <div
                key={i}
                className={`relative aspect-video overflow-hidden border border-border/40 ${i === 0 ? "col-span-full" : "col-span-full md:col-span-1"}`}
              >
                <Image
                  src={img}
                  alt={`Gallery ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </GridItem>
      </Section>

      {/* RETURN FOOTER */}
      <Section className="py-24 lg:py-40">
        <GridItem span="col-span-full">
          <Link
            href="/works"
            className="group flex flex-col items-center text-center gap-8"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/40 group-hover:text-primary transition-colors">
              {isRO ? "Înapoi la arhivă" : "Continue Exploration / Archive"}
            </span>
            <div className="w-20 h-20 lg:w-32 lg:h-32 rounded-full border-[3px] border-foreground flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-700">
              <svg
                className="w-8 h-8 lg:w-12 lg:h-12 text-foreground group-hover:text-background transition-colors transform rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </Link>
        </GridItem>
      </Section>
    </div>
  );
}
