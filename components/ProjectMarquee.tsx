"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MarqueeItem } from "@/lib/marquee-data";

interface ProjectMarqueeProps {
  id?: string;
  badge?: string;
  title?: string;
  items: MarqueeItem[];
  baseSpeed?: number; // px per second
  className?: string;
  showHeader?: boolean;
}

export function ProjectMarquee({
  id,
  badge,
  title,
  items,
  baseSpeed = 50,
  className = "",
  showHeader = false,
}: ProjectMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  const isHoveredRef = useRef(false);
  const posRef = useRef(0);
  const multiplierRef = useRef(1.0);
  const lastTimeRef = useRef<number | null>(null);
  const singleWidthRef = useRef(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const effectiveBaseSpeed = prefersReducedMotion ? 12 : baseSpeed;

    const measureWidth = () => {
      if (firstSetRef.current) {
        // High-precision subpixel measurement including the 15px gap
        const rect = firstSetRef.current.getBoundingClientRect();
        singleWidthRef.current = rect.width + 15;
      }
    };

    measureWidth();

    // Use ResizeObserver to track layout changes dynamically
    const ro = new ResizeObserver(() => {
      measureWidth();
    });
    if (firstSetRef.current) {
      ro.observe(firstSetRef.current);
    }
    window.addEventListener("resize", measureWidth);

    let animationFrameId: number;

    const animate = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Lerp speed multiplier:
      // On hover, decelerate to ~22% of base speed (~11 px/s) instead of near-zero,
      // keeping a pleasant, visible drift.
      const targetMultiplier = isHoveredRef.current ? 0.22 : 1.0;
      multiplierRef.current += (targetMultiplier - multiplierRef.current) * 0.08;

      if (singleWidthRef.current > 0 && trackRef.current) {
        const speed = effectiveBaseSpeed * multiplierRef.current;
        posRef.current -= speed * delta;

        // Infinite mathematical wrap without any visual jump
        if (posRef.current <= -singleWidthRef.current) {
          posRef.current += singleWidthRef.current;
        }

        trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureWidth);
      cancelAnimationFrame(animationFrameId);
    };
  }, [baseSpeed]);

  const renderCardList = (setIndex: number) => (
    <div
      ref={setIndex === 0 ? firstSetRef : undefined}
      className="flex gap-[15px] shrink-0 items-center"
      aria-hidden={setIndex > 0}
    >
      {items.map((item, itemIndex) => {
        const isInactive =
          hoveredCardId !== null && hoveredCardId !== item.id;
        const isFocused = hoveredCardId === item.id;

        const desktopWidth = item.width ?? 220;
        const mobileWidth =
          item.mobileWidth ??
          (item.width ? Math.round(item.width * 0.72) : 160);

        return (
          <article
            key={`${item.id}-set${setIndex}-${itemIndex}`}
            className={`shrink-0 flex flex-col cursor-default transition-all duration-500 ease-out ${
              isInactive
                ? "opacity-25 filter grayscale-[40%] scale-[0.98]"
                : isFocused
                  ? "opacity-100 scale-[1.02] filter-none z-20"
                  : "opacity-100 filter-none"
            }`}
            style={{
              width: `clamp(${mobileWidth}px, 20vw, ${desktopWidth}px)`,
            }}
            onMouseEnter={() => {
              isHoveredRef.current = true;
              setHoveredCardId(item.id);
            }}
            onMouseLeave={() => {
              setHoveredCardId(null);
            }}
          >
            <div
              className="block group"
            >
              {/* Image container: sharp square corners, no border radius, no borders, no shadows */}
              <div
                className="relative w-full overflow-hidden bg-muted/20"
                style={{
                  height: `clamp(${item.mobileHeight}px, 22vw, ${item.height}px)`,
                }}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 240px, 360px"
                  className="object-cover object-center select-none pointer-events-none"
                  loading="lazy"
                />
              </div>

              {/* Label: left-aligned, constant 8-10px gap, Lekton monospace */}
              <div className="mt-2.5 text-left">
                <span className="font-lekton block text-xs uppercase tracking-wider font-normal select-text text-[#4a443d] dark:text-[#a89f91] transition-colors">
                  {item.title} <span className="mx-1">•</span> {item.year}
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <section
      id={id}
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className || "py-12 md:py-16"}`}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        setHoveredCardId(null);
      }}
    >
      {/* Editorial Header using standardized tokens */}
      {showHeader && (badge || title) && (
        <div className="w-full max-w-480 mx-auto px-4 md:px-12 mb-6 md:mb-8">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              {badge && (
                <span className="font-lekton text-xs uppercase tracking-editorial font-normal text-foreground/60 block">
                  {badge}
                </span>
              )}
              {title && (
                <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-normal uppercase tracking-tight text-foreground leading-tight">
                  {title}
                </h2>
              )}
            </div>

            <span className="font-lekton text-xs uppercase tracking-editorial text-foreground/50">
              [ {items.length} works ]
            </span>
          </div>
        </div>
      )}

      {/* Marquee Track: full width, cropped at edges, single horizontal row */}
      {/* Render 4 duplicates so even on 2560px or 4K monitors the track is never starved */}
      <div className="w-full overflow-hidden select-none">
        <div
          ref={trackRef}
          className="flex gap-[15px] w-max will-change-transform py-6 items-center"
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          {renderCardList(0)}
          {renderCardList(1)}
          {renderCardList(2)}
          {renderCardList(3)}
        </div>
      </div>
    </section>
  );
}
