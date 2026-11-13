"use client";

import { useTheme } from "./ThemeProvider";
import { ProjectMarquee } from "./ProjectMarquee";
import { WEB_MARQUEE_ITEMS } from "@/lib/marquee-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (globalThis.window !== undefined) {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const { language } = useTheme();
  const isRO = language === "RO";

  useGSAP(() => {
    gsap.from(".hero-reveal", {
      y: 25,
      opacity: 0,
      duration: 1.1,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.15,
    });
  });

  return (
    <section className="min-h-screen min-h-[100dvh] flex flex-col justify-between pt-[calc(5rem+env(safe-area-inset-top))] sm:pt-[calc(6rem+env(safe-area-inset-top))] md:pt-[calc(7rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-6 overflow-hidden relative">
      {/* UPPER AREA: THE ART OF — [ABOUT ME LEKTON] — MAKING IT WORK. */}
      <div className="my-auto py-4 md:py-6 lg:py-8 w-full max-w-480 mx-auto px-4 md:px-12 flex flex-col items-center justify-center text-center">
        <div className="hero-reveal flex flex-col md:flex-row items-center justify-center gap-5 sm:gap-6 md:gap-10 lg:gap-12 xl:gap-16 select-none">
          {/* LEFT PART: THE ART OF */}
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[52px] font-light uppercase tracking-tight text-foreground whitespace-nowrap leading-none">
            THE ART OF
          </h1>

          {/* MIDDLE ELEMENT: ABOUT ME TEXT BLOCK (LEKTON, JUSTIFIED) */}
          <div className="max-w-[280px] sm:max-w-[310px] md:max-w-[340px] lg:max-w-[380px] xl:max-w-[400px] px-1 md:px-0 my-2 md:my-0">
            <p className="font-body text-[13.5px] sm:text-[14.5px] md:text-[15.5px] lg:text-[16.5px] xl:text-[17.5px] leading-[1.4] text-justify hyphens-auto text-foreground/85 select-text tracking-tight">
              {isRO
                ? "Sebastian\u00A0Prisecaru\u00A0— developer & designer creativ explorând intersecția dintre artă și inginerie digitală. Construiesc experiențe digitale și sisteme interactive care par vii."
                : "Sebastian\u00A0Prisecaru\u00A0— creative developer & designer exploring the intersection of art and digital engineering. Crafting bespoke experiences and interactive systems that feel alive."}
            </p>
          </div>

          {/* RIGHT PART: MAKING IT WORK. */}
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[52px] font-light uppercase tracking-tight text-foreground whitespace-nowrap leading-none">
            MAKING IT WORK.
          </h2>
        </div>
      </div>

      {/* LOWER AREA: FIRST MARQUEE (WEB) INCLUDED DIRECTLY IN HERO VIEWPORT */}
      <div className="w-full shrink-0">
        <ProjectMarquee
          id="works"
          items={WEB_MARQUEE_ITEMS}
          baseSpeed={48}
          className="py-0"
        />
      </div>
    </section>
  );
}
