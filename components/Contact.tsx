"use client";

import React from "react";
import { Section, GridItem } from "./Section";

export function Contact() {
  const currentYear = new Date().getFullYear();

  return (
    <Section
      id="contact"
      className="py-16 lg:py-24 bg-foreground text-background"
    >
      {/* HEADER */}
      <GridItem span="col-span-full">
        <div className="flex flex-col mb-8 lg:mb-16">
          <span className="text-[12px] lg:text-xs font-bold uppercase tracking-[0.1em] text-background/40 mb-4">
            Get in touch*
          </span>
          <h2 className="font-special text-5xl lg:text-6xl uppercase leading-[1]">
            Let&apos;s build <br />
            something <span className="text-primary">great</span>
          </h2>
        </div>
      </GridItem>

      {/* CONTACT ACTION BLOCK */}
      <GridItem span="col-span-full" className="mb-16 lg:mb-32">
        <a
          href="mailto:hello@iamsebbi.com"
          className="group relative flex w-full h-16 lg:h-24 items-center justify-between px-6 lg:px-12 border border-background/20 overflow-hidden transition-colors duration-500 hover:border-primary"
        >
          {/* HOVER FILL ANIMATION */}
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col justify-center">
            <div className="h-8 lg:h-12 overflow-hidden">
              <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                <h2 className="font-special text-xl lg:text-4xl uppercase text-background h-8 lg:h-12 flex items-center">
                  Send an email
                </h2>
                <h2 className="font-special text-xl lg:text-4xl uppercase text-foreground h-8 lg:h-12 flex items-center">
                  Send an email
                </h2>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-background/20 group-hover:text-foreground transition-all duration-500 transform group-hover:translate-x-2 group-hover:-translate-y-2">
            <svg
              className="w-8 h-8 lg:w-12 lg:h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 7h10v10M7 17L17 7"
              />
            </svg>
          </div>
        </a>
      </GridItem>

      {/* FOOTER INFO */}
      <GridItem span="col-span-full" className="pt-12 ">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          {/* LINKS GRID */}
          <div className="grid grid-cols-2 gap-12 lg:gap-24">
            {/* SOCIAL LIST */}
            <div className="flex flex-col gap-6">
              <h3 className="text-[12px] lg:text-xs font-bold uppercase tracking-[0.1em] text-background/40">
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
                    className="group relative h-7 lg:h-9 overflow-hidden"
                  >
                    <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                      <span className="text-lg lg:text-2xl font-special uppercase text-background h-7 lg:h-9 flex items-center">
                        {social.name}
                      </span>
                      <span className="text-lg lg:text-2xl font-special uppercase text-primary h-7 lg:h-9 flex items-center">
                        {social.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* NAVIGATION LIST */}
            <div className="flex flex-col gap-6">
              <h3 className="text-[12px] lg:text-xs font-bold uppercase tracking-[0.1em] text-background/40">
                Navigation*
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { name: "Works", url: "#works" },
                  { name: "Experience", url: "#experience" },
                  { name: "Resume", url: "#" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
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

      {/* COPYRIGHT OVERLAY */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none select-none">
        <span className="font-special text-[15vw] leading-none whitespace-nowrap">
          @iamsebbi
        </span>
      </div>

      {/* FINAL FOOTER BAR */}
      <GridItem
        span="col-span-full"
        className="mt-24 pt-8 border-t border-background/5"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] lg:text-xs font-mono uppercase tracking-[0.1em] text-background/20">
          <span>© {currentYear} ALL RIGHTS RESERVED</span>
          <span>DESIGNED & BUILD BY @IAMSEBBI</span>
        </div>
      </GridItem>
    </Section>
  );
}
