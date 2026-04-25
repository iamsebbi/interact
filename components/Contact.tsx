"use client";

import React from "react";
import { Section, GridItem } from "./Section";

export function Contact() {
  const currentYear = new Date().getFullYear();

  return (
    <Section
      id="contact"
      padding={false}
      className="pt-16 pb-4 lg:pt-24 lg:pb-6 px-4 md:px-12 bg-foreground text-background relative overflow-hidden"
    >
      {/* NOISE OVERLAY */}
      <div className="noise-overlay" />

      {/* HEADER MARQUEE (Reverse Scroll) */}
      <div className="col-span-full w-screen relative left-1/2 -ml-[50vw] overflow-hidden pt-4 lg:pt-6 bg-transparent z-10">
        <div className="flex whitespace-nowrap w-fit animate-marquee-reverse">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex items-center">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="flex items-center">
                  <span className="font-special text-7xl lg:text-9xl uppercase leading-none text-background/20">
                    Let&apos;s build something great
                  </span>
                  <span className="mx-12 lg:mx-16 text-primary/30 text-7xl lg:text-9xl font-bold">
                    *
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* EMAIL MARQUEE (Standard Scroll) */}
      <div className="col-span-full mb-8 lg:mb-12 z-10">
        {/* MOBILE HINT */}
        <GridItem span="col-span-full" className="lg:hidden mb-4">
          <span className="text-[12px] font-bold uppercase tracking-widest text-background/30 block">
            ( Tap to email )
          </span>
        </GridItem>

        <div
          className="w-screen relative left-1/2 -ml-[50vw] overflow-hidden pb-4 lg:pb-6 bg-transparent lg:cursor-none"
          onMouseMove={(e) => {
            if (window.innerWidth < 1024) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cursor = document.getElementById("custom-cursor");
            if (cursor) {
              cursor.style.transform = `translate(${x}px, ${y}px)`;
            }
          }}
          onMouseEnter={() => {
            if (window.innerWidth < 1024) return;
            const cursor = document.getElementById("custom-cursor");
            if (cursor) cursor.style.opacity = "1";
          }}
          onMouseLeave={() => {
            const cursor = document.getElementById("custom-cursor");
            if (cursor) cursor.style.opacity = "0";
          }}
        >
          {/* CUSTOM PILL CURSOR (DESKTOP ONLY) */}
          <div
            id="custom-cursor"
            className="pointer-events-none absolute left-0 top-0 z-50 opacity-0 transition-opacity duration-300 ease-out hidden lg:block"
            style={{ willChange: "transform" }}
          >
            <div className="rounded-full bg-primary px-4 py-1.5 text-foreground translate-x-4 -translate-y-6">
              <span className="font-special text-[10px] lg:text-xs uppercase tracking-wider whitespace-nowrap">
                Email me
              </span>
            </div>
          </div>

          <a
            href="mailto:hello@iamsebbi.com"
            className="flex whitespace-nowrap w-fit animate-marquee hover:text-primary transition-colors"
          >
            {/* Two identical blocks for a perfect loop */}
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex items-center">
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="flex items-center">
                    <span className="font-special text-7xl lg:text-9xl uppercase leading-none">
                      hello@iamsebbi.com
                    </span>
                    <span className="mx-12 lg:mx-16 text-primary text-7xl lg:text-9xl font-bold">
                      *
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </a>
        </div>
      </div>

      {/* FOOTER INFO */}
      <GridItem span="col-span-full" className="pt-4 lg:pt-6 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          {/* LINKS GRID */}
          <div className="grid grid-cols-2 gap-12 lg:gap-24">
            {/* SOCIAL LIST */}
            <div className="flex flex-col gap-6">
              <h3 className="text-[12px] lg:text-xs font-bold uppercase tracking-widest text-background/40">
                Social*
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { name: "GitHub", url: "https://github.com/iamsebbi" },
                  { name: "LinkedIn", url: "#" },
                  { name: "Twitter / X", url: "#" },
                  { name: "Instagram", url: "#" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="group relative h-11 lg:h-9 overflow-hidden active:scale-95 transition-transform"
                  >
                    <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                      <span className="text-lg lg:text-2xl font-special uppercase text-background h-11 lg:h-9 flex items-center">
                        {social.name}
                      </span>
                      <span className="text-lg lg:text-2xl font-special uppercase text-primary h-11 lg:h-9 flex items-center">
                        {social.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* NAVIGATION LIST */}
            <div className="flex flex-col gap-6">
              <h3 className="text-[12px] lg:text-xs font-bold uppercase tracking-widest text-background/40">
                Navigation*
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { name: "Works", url: "#works" },
                  { name: "Experience", url: "#experience" },
                  { name: "Resume", url: "/CV_Prisecaru_Sebastian.pdf", download: true },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    download={item.download ? "CV_Prisecaru_Sebastian.pdf" : undefined}
                    className="group relative h-7 lg:h-9 overflow-hidden"
                  >
                    <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                      <span className="text-lg lg:text-2xl font-special uppercase text-background h-7 lg:h-9 flex items-center">
                        {item.name}
                      </span>
                      <span className="text-lg lg:text-2xl font-special uppercase text-primary h-7 lg:h-9 flex items-center">
                        {item.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* SECONDARY INFO */}
          <div className="flex flex-col items-start md:items-end gap-4 text-[10px] lg:text-xs font-mono uppercase tracking-[0.2em] text-background/40">
            <span>Based in Romania, Europe</span>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-emerald-500/20 bg-emerald-500/5 text-emerald-500/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for freelance / {currentYear}</span>
            </div>
          </div>
        </div>
      </GridItem>

      {/* FINAL FOOTER BAR */}
      <GridItem
        span="col-span-full"
        className="mt-8 lg:mt-10 pt-4 border-t border-background/5 z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] lg:text-xs font-mono uppercase tracking-widest text-background/20">
          <span>©{currentYear} ALL RIGHTS RESERVED</span>
          <span>DESIGNED & BUILT BY SEBASTIAN</span>
        </div>
      </GridItem>
    </Section>
  );
}
