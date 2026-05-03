"use client";

import { useRef } from "react";
import Image from "next/image";
import { Section, GridItem } from "./Section";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTheme } from "./ThemeProvider";

export function Info() {
  const { language } = useTheme();
  const isRO = language === "RO";
  const containerRef = useRef<HTMLElement>(null);
  const marqueeNameItems = Array.from(
    { length: 12 },
    (_, index) => `name-${index}`,
  );

  useGSAP(
    () => {
      const items = gsap.utils.toArray(".reveal-item");

      // Reveal items on scroll
      gsap.from(items, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      // Top Marquee (Name) - Moves Right
      const nameMarquee = document.querySelector(".name-marquee-content");
      if (nameMarquee) {
        gsap.set(nameMarquee, { xPercent: -50 });
        gsap.to(nameMarquee, {
          xPercent: 0,
          repeat: -1,
          duration: 30,
          ease: "none",
        });
      }

      // Bottom Marquee (Skills) - Moves Left
      const skillsMarquee = document.querySelector(".skills-marquee-content");
      if (skillsMarquee) {
        gsap.set(skillsMarquee, { xPercent: 0 });
        gsap.to(skillsMarquee, {
          xPercent: -50,
          repeat: -1,
          duration: 30,
          ease: "none",
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <>
      <Section
        ref={containerRef}
        id="about"
        container={false}
        padding={false}
        grid={false}
        className="relative bg-white overflow-hidden min-h-screen lg:min-h-[80vh] flex flex-col scroll-mt-20"
      >
        {/* GLOBAL BACKGROUND PORTRAIT */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Desktop Image */}
          <Image
            src="/portretweb.png"
            alt="Sebastian Portrait"
            fill
            className="hidden lg:block object-cover object-center lg:object-right grayscale"
            priority
            unoptimized={true}
            quality={100}
            sizes="(max-width: 1024px) 0vw, 100vw"
          />
          {/* Mobile Image */}
          <Image
            src="/portretweb1.png"
            alt="Sebastian Portrait Mobile"
            fill
            className="block lg:hidden object-cover object-center grayscale scale-[1.6] translate-y-[10%]"
            priority
            unoptimized={true}
            quality={100}
            sizes="100vw"
          />
        </div>

        {/* TOP MARQUEE (Name) */}
        <div className="absolute top-0 left-0 w-full pt-6 lg:pt-10 mix-blend-difference overflow-hidden">
          <div className="relative flex whitespace-nowrap">
            <div className="name-marquee-content flex items-center gap-12 text-4xl lg:text-7xl font-special uppercase tracking-tighter text-white">
              {marqueeNameItems.map((itemId) => (
                <div key={itemId} className="flex items-center gap-12">
                  <span>Sebastian</span>
                  <span className="text-primary text-xl lg:text-3xl">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TOP CONTENT WRAPPER */}
        <div className="relative z-10 w-full mx-auto max-w-480 px-4 md:px-12 py-16 lg:py-20 grow mix-blend-difference flex items-center">
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-8 w-full mt-24 lg:mt-80">
            <GridItem span="col-span-full" className="reveal-item relative">
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                {/* LEFT: DESCRIPTION & PILLS */}
                <div className="flex-1">
                  <p className="text-xl lg:text-2xl text-white max-w-2xl leading-tight mb-6">
                    {isRO
                      ? "Sunt un developer și designer creativ, pasionat de zona dintre artă și tehnologie performantă. Creez experiențe digitale care par vii."
                      : "A creative developer and designer obsessed with the intersection of art and high-performance technology. I build digital spaces that feel alive."}
                  </p>

                    <div className="flex flex-wrap gap-3 mt-8">
                    {/* PILLS */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500/70 filter-[invert(1)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] lg:text-xs font-mono uppercase tracking-wider">
                        {isRO
                          ? "Disponibil pentru proiecte noi"
                          : "Available for projects"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white">
                      <span className="text-[10px] lg:text-xs font-mono uppercase tracking-wider">
                        {isRO ? "Stabilit în România" : "Based in Romania"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white">
                      <span className="text-[10px] lg:text-xs font-mono uppercase tracking-wider">
                        {isRO ? "Creator digital" : "Creative Technologist"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block lg:pt-2">
                  <div className="flex flex-col gap-6">
                    <a
                      href="/CV_Prisecaru_Sebastian.pdf"
                      download="CV_Prisecaru_Sebastian.pdf"
                      className="group flex flex-row items-center gap-5 transition-all duration-500"
                    >
                      <div className="w-12 h-12 lg:w-12 lg:h-12 rounded-full border-[2px] border-white flex items-center justify-center group-hover:bg-white group-hover:border-white group-active:bg-white group-active:scale-90 transition-all duration-500 shrink-0">
                        <svg
                          className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-black group-active:text-black transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                          Curriculum Vitae
                        </span>
                        <span className="font-special text-xl lg:text-2xl uppercase text-white">
                          {isRO ? "Descarcă CV-ul*" : "Download CV*"}
                        </span>
                      </div>
                    </a>

                    <a
                      href="mailto:hello.iamsebbi@gmail.com"
                      className="group flex flex-row items-center gap-5 transition-all duration-500"
                    >
                      <div className="w-12 h-12 lg:w-12 lg:h-12 rounded-full border-[2px] border-white flex items-center justify-center group-hover:bg-white group-hover:border-white group-active:bg-white group-active:scale-90 transition-all duration-500 shrink-0">
                        <svg
                          className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-black group-active:text-black transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                          {isRO ? "Hai să vorbim" : "Say hello"}
                        </span>
                        <span className="font-special text-xl lg:text-2xl uppercase text-white">
                          {isRO ? "Scrie-mi*" : "Mail me*"}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </GridItem>
          </div>
        </div>

        {/* BOTTOM MARQUEE (Skills) */}
        <div className="absolute bottom-0 left-0 w-full pb-6 lg:pb-10 mix-blend-difference">
          <div className="relative flex whitespace-nowrap overflow-hidden">
            <div className="skills-marquee-content flex items-center gap-12 text-4xl lg:text-7xl font-special uppercase tracking-tighter text-white">
              {[
                "React",
                "Next.js",
                "GSAP",
                "Tailwind CSS",
                "TypeScript",
                "UI/UX Design",
                "Three.js",
                "Node.js",
                "Framer Motion",
              ].map((skill, i) => (
                <div key={`${skill}-${i}`} className="flex items-center gap-12">
                  <span>{skill}</span>
                  <span className="text-primary text-xl lg:text-3xl">•</span>
                </div>
              ))}
              {/* Duplicate for infinite loop */}
              {[
                "React",
                "Next.js",
                "GSAP",
                "Tailwind CSS",
                "TypeScript",
                "UI/UX Design",
                "Three.js",
                "Node.js",
                "Framer Motion",
              ].map((skill, i) => (
                <div
                  key={`dup-${skill}-${i}`}
                  className="flex items-center gap-12"
                >
                  <span>{skill}</span>
                  <span className="text-primary text-xl lg:text-3xl">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* MOBILE DOWNLOAD CV - OUTSIDE SECTION */}
      <div className="lg:hidden w-full py-8 px-4 bg-background border-b border-border/50 flex flex-col gap-8">
        <a
          href="/CV_Prisecaru_Sebastian.pdf"
          download="CV_Prisecaru_Sebastian.pdf"
          className="group flex flex-row items-center justify-start gap-5 transition-all duration-500"
        >
          <div className="w-12 h-12 rounded-full border-[2px] border-foreground flex items-center justify-center group-active:bg-foreground group-active:scale-90 transition-all duration-500 shrink-0">
            <svg
              className="w-5 h-5 text-foreground group-active:text-background transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
              Curriculum Vitae
            </span>
            <span className="font-special text-xl uppercase text-foreground">
              {isRO ? "Descarcă CV-ul*" : "Download CV*"}
            </span>
          </div>
        </a>

        <a
          href="mailto:hello.iamsebbi@gmail.com"
          className="group flex flex-row items-center justify-start gap-5 transition-all duration-500"
        >
          <div className="w-12 h-12 rounded-full border-[2px] border-foreground flex items-center justify-center group-active:bg-foreground group-active:scale-90 transition-all duration-500 shrink-0">
            <svg
              className="w-5 h-5 text-foreground group-active:text-background transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
              {isRO ? "Hai să vorbim" : "Say hello"}
            </span>
            <span className="font-special text-xl uppercase text-foreground">
              {isRO ? "Scrie-mi*" : "Mail me*"}
            </span>
          </div>
        </a>
      </div>
    </>
  );
}
