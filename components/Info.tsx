"use client";

import { useRef } from "react";
import Image from "next/image";
import { Section, GridItem } from "./Section";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Info() {
  const containerRef = useRef<HTMLElement>(null);

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

      // Infinite Marquee
      const marquee = document.querySelector(".marquee-content");
      if (marquee) {
        gsap.to(marquee, {
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
        className="relative bg-white overflow-hidden min-h-[80vh] flex flex-col"
      >
        {/* GLOBAL BACKGROUND PORTRAIT */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
          {/* Desktop Image */}
          <Image
            src="/portretweb.png"
            alt="Sebastian Portrait"
            fill
            className="hidden lg:block object-cover object-center lg:object-right grayscale"
            priority
          />
          {/* Mobile Image */}
          <Image
            src="/portretweb1.png"
            alt="Sebastian Portrait Mobile"
            fill
            className="block lg:hidden object-cover object-center grayscale scale-[1.6] translate-y-[10%]"
            priority
          />
        </div>

        {/* TOP CONTENT WRAPPER */}
        <div className="relative z-10 w-full mx-auto max-w-[1920px] px-4 md:px-12 py-10 lg:py-16 flex-grow mix-blend-difference">
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-8">
            
            {/* NAME */}
            <GridItem span="col-span-full" className="reveal-item relative pt-8 lg:pt-12 mb-2 lg:mb-4">
              <svg viewBox="0 0 1000 120" className="w-full h-auto overflow-visible select-none">
                <text
                  x="0"
                  y="95"
                  textLength="1000"
                  lengthAdjust="spacingAndGlyphs"
                  className="font-special uppercase fill-white text-[120px] tracking-[-0.05em]"
                >
                  Sebastian
                </text>
              </svg>
            </GridItem>

            <GridItem span="col-span-full" className="reveal-item relative">
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                {/* LEFT: DESCRIPTION & PILLS */}
                <div className="flex-1">
                  <p className="text-xl lg:text-2xl text-white max-w-2xl leading-tight mb-6">
                    A creative developer and designer obsessed with the intersection
                    of art and high-performance technology. I build digital spaces
                    that feel alive.
                  </p>

                  <div className="flex flex-wrap gap-3 mt-8">
                    {/* PILLS */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-emerald-500/20 bg-emerald-500/5 text-emerald-500/70 [filter:invert(1)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] lg:text-xs font-mono uppercase tracking-wider">Available for projects</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-white/20 bg-white/5 text-white">
                      <span className="text-[10px] lg:text-xs font-mono uppercase tracking-wider">Based in Romania</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-white/20 bg-white/5 text-white">
                      <span className="text-[10px] lg:text-xs font-mono uppercase tracking-wider">Creative Technologist</span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block lg:pt-2">
                  <a 
                    href="#" 
                    className="group flex flex-row items-center gap-5 transition-all duration-500"
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-[3px] border-white flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500 shrink-0">
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Curriculum Vitae</span>
                      <span className="font-special text-xl lg:text-2xl uppercase text-white">Download CV*</span>
                    </div>
                  </a>
                </div>
              </div>
            </GridItem>
          </div>
        </div>

        {/* BOTTOM MARQUEE (Pinned to absolute bottom) */}
        <div className="absolute bottom-0 left-0 w-full pb-6 lg:pb-10 mix-blend-difference">
          <div className="relative flex whitespace-nowrap overflow-hidden">
            <div className="marquee-content flex items-center gap-12 text-4xl lg:text-7xl font-special uppercase tracking-tighter text-white">
              {[
                "React", "Next.js", "GSAP", "Tailwind CSS", "TypeScript", 
                "UI/UX Design", "Three.js", "Node.js", "Framer Motion"
              ].map((skill, i) => (
                <div key={`${skill}-${i}`} className="flex items-center gap-12">
                  <span>{skill}</span>
                  <span className="text-primary text-xl lg:text-3xl">•</span>
                </div>
              ))}
              {/* Duplicate for infinite loop */}
              {[
                "React", "Next.js", "GSAP", "Tailwind CSS", "TypeScript", 
                "UI/UX Design", "Three.js", "Node.js", "Framer Motion"
              ].map((skill, i) => (
                <div key={`dup-${skill}-${i}`} className="flex items-center gap-12">
                  <span>{skill}</span>
                  <span className="text-primary text-xl lg:text-3xl">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* MOBILE DOWNLOAD CV - OUTSIDE SECTION */}
      <div className="lg:hidden w-full py-6 px-4 bg-background border-b border-border/50">
        <a 
          href="#" 
          className="group flex flex-row items-center justify-start gap-5 transition-all duration-500"
        >
          <div className="w-10 h-10 rounded-full border-[3px] border-foreground flex items-center justify-center transition-all duration-500 shrink-0">
            <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Curriculum Vitae</span>
            <span className="font-special text-xl uppercase text-foreground">Download CV*</span>
          </div>
        </a>
      </div>
    </>
  );
}
