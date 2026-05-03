"use client";

import Image from "next/image";
import Link from "next/link";
import { Section, GridItem } from "@/components/Section";
import { Project } from "@/lib/projects";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface DesignProjectLayoutProps {
  project: Project;
}

export function DesignProjectLayout({
  project,
}: Readonly<DesignProjectLayoutProps>) {
  const { language } = useTheme();
  const isRO = language === "RO";
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
        .from(
          ".tech-spec",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .from(
          ".project-image",
          {
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "expo.out",
          },
          "-=0.4",
        );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <Section className="pt-32 lg:pt-48 pb-20 overflow-hidden">
        <GridItem span="col-span-full">
          <div className="relative">
            <span className="absolute -left-4 lg:-left-12 top-0 hidden lg:block origin-left rotate-90 font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/20">
              {isRO
                ? `Studiu de caz nr. ${project.id}`
                : `Case Study No. ${project.id}`}
            </span>

            <div className="overflow-hidden">
              <h1 className="hero-title font-special text-[13vw] lg:text-[11vw] xl:text-[12rem] leading-[0.8] uppercase text-foreground tracking-tighter mb-12 wrap-break-word">
                {project.title.split(" ").map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className={`block ${index % 2 !== 0 ? "lg:pl-[10vw]" : ""}`}
                  >
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
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-3">
                01 / {isRO ? "Obiectiv" : "Objective"}
              </span>
              <p className="text-sm lg:text-base font-medium leading-relaxed">
                {isRO
                  ? "Construirea unui limbaj vizual care comunică dincolo de cuvinte, prin forme minimaliste."
                  : "Creating a visual language that speaks beyond words through minimalist forms."}
              </p>
            </div>

            <div className="tech-spec">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-3">
                02 / {isRO ? "Detalii tehnice" : "Technical Details"}
              </span>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase font-bold">
                  Client: {project.client}
                </span>
                <span className="font-mono text-xs uppercase font-bold">
                  {isRO ? "Rol" : "Role"}: {project.role}
                </span>
                <span className="font-mono text-xs uppercase font-bold">
                  {isRO ? "An" : "Year"}: {project.year}
                </span>
              </div>
            </div>
          </div>
        </GridItem>

        <GridItem span="col-span-full md:col-span-4 lg:col-start-6 mt-12 md:mt-0">
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

      <Section className="py-24 lg:py-40">
        <GridItem span="col-span-full lg:col-span-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="relative aspect-video w-full md:w-2/3 overflow-hidden bg-card border border-border/40 project-image">
                <Image
                  src={project.image}
                  alt="Landscape"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="relative aspect-3/4 w-full md:w-1/3 overflow-hidden bg-card border border-border/40 project-image">
                <Image
                  src={project.image}
                  alt="Portrait"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
            </div>
            <div className="flex justify-between items-start px-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/20">
                Shot_Reference_01_02
              </span>
              <div className="max-w-xs text-right">
                <p className="font-mono text-[10px] uppercase leading-relaxed text-foreground/60">
                  {isRO
                    ? "Schiță vizuală inițială, concentrată pe elementele de identitate și pe distribuția spațiului."
                    : "Initial visual exploration focusing on the core identity elements and spatial distribution."}
                </p>
              </div>
            </div>
          </div>
        </GridItem>

        <GridItem span="col-span-full lg:col-span-4 lg:pl-12 mt-12 lg:mt-0">
          <div className="flex flex-col gap-12 sticky top-32">
            <div className="tech-spec border-l border-foreground/10 pl-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-3">
                03 / {isRO ? "Narațiune" : "The Narrative"}
              </span>
              <p className="text-sm lg:text-base font-medium leading-relaxed text-foreground/80">
                {project.description}
              </p>
            </div>

            <div className="tech-spec border-l border-foreground/10 pl-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-3">
                04 / {isRO ? "Specificații" : "Specifications"}
              </span>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase font-bold">
                  {isRO ? "Mediu" : "Medium"}:{" "}
                  {isRO ? "Randare digitală" : "Digital Rendering"}
                </span>
                <span className="font-mono text-xs uppercase font-bold">
                  Color: DCI-P3 / SRGB
                </span>
                <span className="font-mono text-xs uppercase font-bold">
                  Focus: {isRO ? "Formă și spațiu" : "Form & Space"}
                </span>
              </div>
            </div>
          </div>
        </GridItem>
      </Section>

      <Section className="py-12 lg:py-24">
        <GridItem span="col-span-full">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-21/9 w-full overflow-hidden bg-card border border-border/40 project-image">
              <Image
                src={project.image}
                alt="Full Width"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="flex justify-between items-start px-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/20">
                Phase_Shot_Full_Width_03
              </span>
              <div className="max-w-xs text-right">
                <p className="font-mono text-[10px] uppercase leading-relaxed text-foreground/60">
                  {isRO
                    ? "Privire de ansamblu care evidențiază scara și profunzimea atmosferică a designului."
                    : "Comprehensive visual overview highlighting the scale and atmospheric depth of the design."}
                </p>
              </div>
            </div>
          </div>
        </GridItem>
      </Section>

      <Section className="py-24 lg:py-40">
        <GridItem span="col-span-full lg:col-span-4 lg:pr-12 order-2 lg:order-1 mt-12 lg:mt-0">
          <div className="flex flex-col gap-12 sticky top-32">
            <div className="tech-spec border-l border-foreground/10 pl-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-3">
                05 / {isRO ? "Focus pe detalii" : "Detail Focus"}
              </span>
              <p className="text-sm lg:text-base font-medium leading-relaxed text-foreground/80">
                {isRO
                  ? "Fiecare element este așezat cu grijă, pentru a crea tensiune echilibrată și spațiu intenționat."
                  : "Every element is meticulously placed to create a sense of balanced tension and intentional emptiness."}
              </p>
            </div>

            <div className="tech-spec border-l border-foreground/10 pl-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 block mb-2 underline underline-offset-4">
                {isRO ? "Notă tehnică" : "Technical Note"}
              </span>
              <p className="font-mono text-[10px] uppercase text-foreground/30 leading-relaxed">
                {isRO
                  ? "Compoziție construită pe un grid rigid de 12 coloane, cu gutter-uri variabile pentru o sincopă vizuală."
                  : "Composition built on a 12-column rigid grid system with variable gutter distribution for visual syncopation."}
              </p>
            </div>
          </div>
        </GridItem>

        <GridItem span="col-span-full lg:col-span-8 order-1 lg:order-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row-reverse gap-6 items-end">
              <div className="relative aspect-video w-full md:w-2/3 overflow-hidden bg-card border border-border/40 project-image">
                <Image
                  src={project.image}
                  alt="Landscape Inverted"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="relative aspect-3/4 w-full md:w-1/3 overflow-hidden bg-card border border-border/40 project-image">
                <Image
                  src={project.image}
                  alt="Portrait Inverted"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
            </div>
            <div className="flex justify-between items-start px-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/20">
                Shot_Reference_04_05
              </span>
              <div className="max-w-xs text-right">
                <p className="font-mono text-[10px] uppercase leading-relaxed text-foreground/60">
                  {isRO
                    ? "Explorare a formei, funcției și esteticii brutaliste în comunicarea vizuală."
                    : "Exploration of form, function and brutalist aesthetics in visual communication."}
                </p>
              </div>
            </div>
          </div>
        </GridItem>
      </Section>

      <Section className="border-t border-foreground/10 py-24 lg:py-40">
        <GridItem span="col-span-full">
          <Link
            href="/works"
            className="group flex flex-col items-center text-center gap-8"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/40 group-hover:text-primary transition-colors">
              {isRO ? "Înapoi la arhivă" : "Continue Exploration / Archive"}
            </span>
            <div className="w-20 h-20 lg:w-32 lg:h-32 rounded-full border-[2px] border-foreground flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-700">
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
