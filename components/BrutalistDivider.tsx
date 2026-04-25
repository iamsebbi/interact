"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Section, GridItem } from "./Section";

const FRAME_IMAGES = [
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
];

export function BrutalistDivider() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Strobe effect logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % FRAME_IMAGES.length);
    }, 400); 
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    // Parallax removed
  }, { scope: containerRef });

  return (
    <Section className="py-24 lg:py-48 overflow-hidden">
      <GridItem span="col-span-full">
        <div ref={containerRef} className="flex flex-col items-center justify-center relative">
          
          {/* MOBILE TECHNICAL OVERLAYS - TOP */}
          <div className="flex xl:hidden w-full justify-between items-end mb-3 px-0 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
            <div className="flex flex-col">
              <span className="text-primary font-bold">Location</span>
              <span>44.439628° N</span>
              <span>26.096306° E</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-primary font-bold">System</span>
              <span>v2.0.4_boot</span>
            </div>
          </div>

          <div className="relative w-full lg:w-max flex items-center justify-center">
            {/* LARGE DECORATORS */}
            <div className="absolute right-full hidden lg:flex items-center gap-8 pr-10">
              <span className="font-special text-6xl lg:text-[8rem] text-foreground">
                *
              </span>
              <span className="font-special text-8xl lg:text-[15rem] leading-none text-foreground">
                (
              </span>
            </div>

            {/* PORTRAIT CONTAINER */}
            <div className="portrait-container relative w-full aspect-square lg:w-96 lg:h-96 overflow-hidden bg-card border border-border shrink-0 z-10">
              {FRAME_IMAGES.map((src, i) => (
                <div 
                  key={src}
                  className={`absolute inset-0 transition-none ${i === currentIdx ? "opacity-100" : "opacity-0"}`}
                >
                  <Image
                    src={src}
                    alt={`Portrait ${i + 1}`}
                    fill
                    className="object-cover grayscale"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              ))}
            </div>

            {/* RIGHT DECORATOR */}
            <div className="absolute left-full hidden lg:pl-10 lg:flex">
              <span className="font-special text-8xl lg:text-[15rem] leading-none text-foreground">
                )
              </span>
            </div>
          </div>

          {/* MOBILE TECHNICAL OVERLAYS - BOTTOM */}
          <div className="flex xl:hidden w-full justify-between items-start mt-3 px-0 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
            <div className="flex flex-col">
              <span className="text-primary font-bold">Status</span>
              <span>Active_Connection</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-primary font-bold">Scale</span>
              <span>1:1.000_REF</span>
            </div>
          </div>

          {/* DESKTOP TECHNICAL OVERLAYS - LEFT */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
            <div className="flex flex-col">
              <span className="text-primary font-bold">Location</span>
              <span>44.439628° N</span>
              <span>26.096306° E</span>
            </div>
            <div className="w-12 h-px bg-border" />
            <div className="flex flex-col">
              <span className="text-primary font-bold">System</span>
              <span>v2.0.4_boot</span>
            </div>
          </div>

          {/* DESKTOP TECHNICAL OVERLAYS - RIGHT */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-end gap-4 font-mono text-[10px] uppercase tracking-widest text-foreground/40 text-right">
            <div className="flex flex-col">
              <span className="text-primary font-bold">Status</span>
              <span>Active_Connection</span>
              <span>Signal: Strong</span>
            </div>
            <div className="w-12 h-px bg-border" />
            <div className="flex flex-col">
              <span className="text-primary font-bold">Scale</span>
              <span>1:1.000_REF</span>
            </div>
          </div>
        </div>
      </GridItem>
    </Section>
  );
}
