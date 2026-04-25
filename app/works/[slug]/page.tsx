"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Section, GridItem } from "@/components/Section";
import { PROJECTS } from "@/lib/projects";
import { Navbar } from "@/components/Navbar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);
  const containerRef = useRef(null);

  if (!project) {
    notFound();
  }

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    })
    .from(".tech-spec", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    }, "-=0.6")
    .from(".project-image", {
      y: 60,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "expo.out",
    }, "-=0.4");
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-background min-h-screen">
      <Navbar />


      {/* HERO SECTION - EDITORIAL STYLE FOR DESIGN */}
      <Section className="pt-32 lg:pt-48 pb-20 overflow-hidden">
        <GridItem span="col-span-full">
          <div className="relative">
            <span className="absolute -left-4 lg:-left-12 top-0 font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/20 rotate-90 origin-left hidden lg:block">
              Case_Study_No_{project.id}
            </span>
            <div className="overflow-hidden">
              <h1 className="hero-title font-special text-[13vw] lg:text-[11vw] xl:text-[12rem] leading-[0.8] uppercase text-foreground tracking-tighter mb-12 wrap-break-word">
                {project.title.split(' ').map((word, i) => (
                  <span key={i} className={`block ${i % 2 !== 0 ? 'lg:pl-[10vw]' : ''}`}>
                    {word}
                  </span>
                ))}
              </h1>
            </div>
          </div>
        </GridItem>

        <GridItem span="col-span-full md:col-span-4 lg:col-span-3 mt-12">
          <div className="flex flex-col gap-12 border-l border-foreground/10 pl-6 lg:pl-8">
            <div className="tech-spec">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-3">01 / Objective</span>
              <p className="text-sm lg:text-base font-medium leading-relaxed">
                Creating a visual language that speaks beyond words through minimalist forms.
              </p>
            </div>
            <div className="tech-spec">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-3">02 / Technicals</span>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase font-bold">Client: {project.client}</span>
                <span className="font-mono text-xs uppercase font-bold">Role: {project.role}</span>
                <span className="font-mono text-xs uppercase font-bold">Year: {project.year}</span>
              </div>
            </div>
          </div>
        </GridItem>

        <GridItem span="col-span-full md:col-span-4 lg:col-span-7 lg:col-start-6 mt-12 md:mt-0">
          <div className="relative aspect-4/5 lg:aspect-16/10 overflow-hidden bg-card border border-border/40 project-image">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover scale-105"
              priority
            />
          </div>
        </GridItem>
      </Section>

      {/* SECTION 1: IMAGES LEFT, TEXT RIGHT */}
      <Section className="py-24 lg:py-40">
        {/* LEFT SIDE: IMAGES */}
        <GridItem span="col-span-full lg:col-span-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="relative aspect-video w-full md:w-2/3 overflow-hidden bg-card border border-border/40 project-image">
                <Image src={project.image} alt="Landscape" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div className="relative aspect-3/4 w-full md:w-1/3 overflow-hidden bg-card border border-border/40 project-image">
                <Image src={project.image} alt="Portrait" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
            </div>
            <div className="flex justify-between items-start px-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/20">
                Shot_Reference_01_02
              </span>
              <div className="max-w-xs text-right">
                <p className="font-mono text-[10px] uppercase leading-relaxed text-foreground/60">
                  Initial visual exploration focusing on the core identity elements and spatial distribution.
                </p>
              </div>
            </div>
          </div>
        </GridItem>

        {/* RIGHT SIDE: META TEXT */}
        <GridItem span="col-span-full lg:col-span-4 lg:pl-12 mt-12 lg:mt-0">
          <div className="flex flex-col gap-12 sticky top-32">
            <div className="tech-spec border-l border-foreground/10 pl-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-3">03 / The Narrative</span>
              <p className="text-sm lg:text-base font-medium leading-relaxed text-foreground/80">
                {project.description}
              </p>
            </div>
            <div className="tech-spec border-l border-foreground/10 pl-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-3">04 / Specifications</span>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase font-bold">Medium: Digital Rendering</span>
                <span className="font-mono text-xs uppercase font-bold">Color: DCI-P3 / SRGB</span>
                <span className="font-mono text-xs uppercase font-bold">Focus: Form & Space</span>
              </div>
            </div>
          </div>
        </GridItem>
      </Section>

      {/* SECTION 2: FULL WIDTH IMPACT */}
      <Section className="py-12 lg:py-24">
        <GridItem span="col-span-full">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-21/9 w-full overflow-hidden bg-card border border-border/40 project-image">
              <Image src={project.image} alt="Full Width" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
            </div>
            <div className="flex justify-between items-start px-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/20">
                Phase_Shot_Full_Width_03
              </span>
              <div className="max-w-xs text-right">
                <p className="font-mono text-[10px] uppercase leading-relaxed text-foreground/60">
                  Comprehensive visual overview highlighting the scale and atmospheric depth of the design.
                </p>
              </div>
            </div>
          </div>
        </GridItem>
      </Section>

      {/* SECTION 3: TEXT LEFT, IMAGES RIGHT (INVERTED) */}
      <Section className="py-24 lg:py-40">
        {/* LEFT SIDE: META TEXT */}
        <GridItem span="col-span-full lg:col-span-4 lg:pr-12 order-2 lg:order-1 mt-12 lg:mt-0">
          <div className="flex flex-col gap-12 sticky top-32">
            <div className="tech-spec border-l border-foreground/10 pl-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-3">05 / Detail Focus</span>
              <p className="text-sm lg:text-base font-medium leading-relaxed text-foreground/80">
                Every element is meticulously placed to create a sense of balanced tension and intentional emptiness.
              </p>
            </div>
            <div className="tech-spec border-l border-foreground/10 pl-6">
               <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-2 underline underline-offset-4">Technical_Note</span>
               <p className="font-mono text-[10px] uppercase text-foreground/30 leading-relaxed">
                 Composition built on a 12-column rigid grid system with variable gutter distribution for visual syncopation.
               </p>
            </div>
          </div>
        </GridItem>

        {/* RIGHT SIDE: IMAGES */}
        <GridItem span="col-span-full lg:col-span-8 order-1 lg:order-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row-reverse gap-6 items-end">
              <div className="relative aspect-video w-full md:w-2/3 overflow-hidden bg-card border border-border/40 project-image">
                <Image src={project.image} alt="Landscape Inverted" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div className="relative aspect-3/4 w-full md:w-1/3 overflow-hidden bg-card border border-border/40 project-image">
                <Image src={project.image} alt="Portrait Inverted" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
            </div>
            <div className="flex justify-between items-start px-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/20">
                Shot_Reference_04_05
              </span>
              <div className="max-w-xs text-right">
                <p className="font-mono text-[10px] uppercase leading-relaxed text-foreground/60">
                  Exploration of form, function and brutalist aesthetics in visual communication.
                </p>
              </div>
            </div>
          </div>
        </GridItem>
      </Section>

      {/* NEXT PROJECT FOOTER */}
      <Section className="border-t border-foreground/10 py-24 lg:py-40">
        <GridItem span="col-span-full">
          <Link href="/#works" className="group flex flex-col items-center text-center gap-8">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/40 group-hover:text-primary transition-colors">
              End of Project / Return to Archive
            </span>
            <div className="w-20 h-20 lg:w-32 lg:h-32 rounded-full border-[3px] border-foreground flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-700">
               <svg 
                  className="w-8 h-8 lg:w-12 lg:h-12 text-foreground group-hover:text-background transition-colors transform rotate-180" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </div>
          </Link>
        </GridItem>
      </Section>
    </div>
  );
}
