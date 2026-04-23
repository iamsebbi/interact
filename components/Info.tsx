"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Section, GridItem } from "./Section";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FRAME_IMAGES = [
  "/hero_portrait_1.png",
  "/hero_portrait_2.png",
  "/hero_portrait_3.png",
  "/hero_portrait_4.png",
];

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
        className="relative theme-inverted"
      >
        {/* TRANSITION ELEMENT (PORTRAIT FRAME) */}
        <div className="absolute top-12 lg:top-24 left-1/2 -translate-x-1/2 z-20">
          <div className="reveal-item flex items-center justify-center">
            <div className="relative flex items-center">
              {/* LEFT DECORATORS */}
              <div className="absolute right-full flex items-center gap-2 lg:gap-6 pr-2 lg:pr-6">
                <span className="font-special text-[12vw] lg:text-[5rem] text-foreground">
                  *
                </span>
                <span className="font-special text-[18vw] lg:text-[10rem] leading-none text-foreground">
                  (
                </span>
              </div>

              {/* CENTERED IMAGE */}
              <div className="relative w-[35vw] h-[35vw] lg:w-56 lg:h-56 overflow-hidden bg-card border border-border shrink-0">
                <Image
                  src="/hero_portrait_1.png"
                  alt="Sebastian Portrait"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* RIGHT DECORATOR */}
              <div className="absolute left-full pl-2 lg:pl-6">
                <span className="font-special text-[18vw] lg:text-[10rem] leading-none text-foreground">
                  )
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NAME */}
        <GridItem span="col-span-full" className="reveal-item pt-40 lg:pt-64 mb-2 lg:mb-12">
          {/* MOBILE: Edge-to-edge letters */}
          <div className="flex lg:hidden justify-between w-full">
            {"SEBASTIAN".split("").map((char, i) => (
              <span key={i} className="font-special text-[14vw] uppercase leading-none tracking-tighter text-foreground">
                {char}
              </span>
            ))}
          </div>
          {/* DESKTOP: Standard heading */}
          <h2 className="hidden lg:block font-special lg:text-[10rem] uppercase leading-none tracking-tighter text-foreground text-left">
            Sebastian
          </h2>
        </GridItem>

        <GridItem span="col-span-full" className="reveal-item">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            {/* LEFT: DESCRIPTION & PILLS */}
            <div className="flex-1">
              <p className="text-xl lg:text-3xl text-foreground/80 max-w-3xl leading-tight mb-12">
                A creative developer and designer obsessed with the intersection
                of art and high-performance technology. I build digital spaces
                that feel alive.
              </p>

              <div className="flex flex-wrap gap-3 mt-12">
                {/* PILL: STATUS */}
                <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-primary/40 bg-primary/5 rounded-none transition-all hover:bg-primary/10 hover:border-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <p className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.05em] text-primary leading-none">
                    Available for new projects
                  </p>
                </div>

                {/* PILL: LOCATION */}
                <div className="inline-flex items-center px-5 py-2.5 border border-border/50 rounded-none transition-all hover:border-foreground/30">
                  <p className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.05em] text-foreground/60 leading-none">
                    Based in Romania
                  </p>
                </div>

                {/* PILL: TYPE */}
                <div className="inline-flex items-center px-5 py-2.5 border border-border/50 rounded-none transition-all hover:border-foreground/30">
                  <p className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.05em] text-foreground/60 leading-none">
                    Creative Direction
                  </p>
                </div>
              </div>

              {/* CV DOWNLOAD BUTTON (VARIANT 3) */}
              <div className="reveal-item mt-12 lg:mt-16">
                <a
                  href="/cv.pdf"
                  download
                  className="inline-flex items-center gap-6 group cursor-pointer"
                >
                  <div className="relative flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-foreground/20 group-hover:border-primary transition-colors duration-500">
                    <div className="absolute inset-0 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
                    <svg
                      className="relative z-10 w-6 h-6 lg:w-8 lg:h-8 text-foreground group-hover:text-background transition-colors duration-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.1em] text-foreground/40 group-hover:text-primary transition-colors duration-300">
                      Curriculum Vitae
                    </span>
                    <span className="text-2xl lg:text-4xl font-special uppercase leading-none text-foreground mt-1">
                      Download CV*
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* RIGHT: CONNECT */}
            <div className="shrink-0 pt-2 lg:pt-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-foreground/40 mb-6">
                Connect*
              </h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="mailto:hello@sebbi.com"
                    className="text-lg lg:text-xl font-medium hover:text-primary transition-colors block"
                  >
                    hello@sebbi.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/iamsebbi"
                    target="_blank"
                    className="text-lg lg:text-xl font-medium hover:text-primary transition-colors block"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-lg lg:text-xl font-medium hover:text-primary transition-colors block"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-lg lg:text-xl font-medium hover:text-primary transition-colors block"
                  >
                    Twitter / X
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </GridItem>
      </Section>

      {/* BOTTOM: SKILLS MARQUEE (FULL WIDTH & REDUCED HEIGHT) */}
      <Section
        container={false}
        padding={false}
        grid={false}
        className="theme-inverted overflow-hidden"
      >
        <div className="relative flex flex-col py-6 lg:py-8">
          <div className="mx-auto max-w-[1920px] w-full px-4 md:px-12">
            <h3 className="reveal-item text-[12px] lg:text-xs font-bold uppercase tracking-[0.1em] text-foreground/40 mb-6 lg:mb-10">
              Expertise*
            </h3>
          </div>
          <div className="relative flex whitespace-nowrap">
            <div className="marquee-content flex items-center gap-12 text-2xl lg:text-4xl font-special uppercase tracking-tighter text-foreground/80">
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
                  <span className="text-primary text-xl lg:text-2xl">•</span>
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
                  <span className="text-primary text-xl lg:text-2xl">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
