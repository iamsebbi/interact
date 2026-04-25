"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Section } from "./Section";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_IMAGES = [
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
];

export function Hero() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    // Rapid sequence interval (strobe effect)
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % FRAME_IMAGES.length);
    }, 400); 
    
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    gsap.from(".hero-reveal", {
      yPercent: 100,
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out",
      delay: 0.2
    });
  });

  return (
    <Section
      grid={false}
      className="min-h-screen pt-20 md:pt-32 pb-20 flex items-center justify-center overflow-hidden relative"
    >
      
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

        {/* ROW 1: THE ART */}
        <div className="w-full overflow-hidden">
          <h1 className="hero-reveal font-special text-[15vw] lg:text-[10rem] uppercase leading-[0.8] tracking-tighter text-foreground">
            THE ART
          </h1>
        </div>

        {/* ROW 2: *( [IMG] ) portfolio */}
        <div className="w-full overflow-hidden">
          <div className="hero-reveal flex items-center justify-center gap-4 my-4 lg:my-8">
            <span className="font-special text-[12vw] lg:text-[5rem] text-foreground">
              *
            </span>
            <div className="flex items-center">
              <span className="font-special text-[18vw] lg:text-[6rem] leading-none text-foreground">
                (
              </span>
              <div className="relative w-[25vw] h-[25vw] lg:w-32 lg:h-32 mx-2 overflow-hidden bg-card border border-border shrink-0">
                {FRAME_IMAGES.map((src, i) => (
                  <div 
                    key={src}
                    className={`absolute inset-0 transition-none ${i === currentIdx ? "opacity-100" : "opacity-0"}`}
                  >
                    <Image
                      src={src}
                      alt={`Portrait ${i + 1}`}
                      fill
                      className="object-cover"
                      priority={i === 0}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
              <span className="font-special text-[18vw] lg:text-[6rem] leading-none text-foreground">
                )
              </span>
            </div>

            <span className="font-sans text-xl lg:text-3xl font-semibold text-foreground self-end mb-2 lg:mb-4">
              Portfolio
            </span>
          </div>
        </div>

        {/* ROW 3: OF MAKING */}
        <div className="w-full overflow-hidden">
          <h2 className="hero-reveal font-special text-[15vw] lg:text-[10rem] uppercase leading-[0.8] tracking-tighter text-foreground">
            OF MAKING
          </h2>
        </div>

        {/* ROW 4: IT WORK */}
        <div className="w-full overflow-hidden">
          <h2 className="hero-reveal font-special text-[15vw] lg:text-[10rem] uppercase leading-[0.8] tracking-tighter text-foreground">
            IT WORK
          </h2>
        </div>

      </div>
    </Section>
  );
}

