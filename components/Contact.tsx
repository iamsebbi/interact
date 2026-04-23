"use client";

import React from "react";
import { Section, GridItem } from "./Section";

export function Contact() {
  const currentYear = new Date().getFullYear();

  return (
    <Section id="contact" className="py-16 lg:py-24 bg-foreground text-background">
      {/* HEADER */}
      <GridItem span="col-span-full">
        <div className="flex flex-col mb-8 lg:mb-16">
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.4em] text-background/40 mb-4">
            Get in touch*
          </span>
          <h2 className="font-special text-3xl lg:text-6xl uppercase leading-[1]">
            Let's build <br /> 
            something <span className="text-primary">great</span>
          </h2>
        </div>
      </GridItem>

      {/* HUGE EMAIL */}
      <GridItem span="col-span-full" className="mb-16 lg:mb-24">
        <a 
          href="mailto:hello@iamsebbi.com"
          className="group relative inline-block w-full"
        >
          <div className="h-[8vw] lg:h-[5rem] overflow-hidden">
            <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
              <span className="font-special text-[8vw] lg:text-[5rem] uppercase leading-none tracking-tighter h-[8vw] lg:h-[5rem] flex items-center">
                hello@iamsebbi.com
              </span>
              <span className="font-special text-[8vw] lg:text-[5rem] uppercase leading-none tracking-tighter text-primary h-[8vw] lg:h-[5rem] flex items-center">
                hello@iamsebbi.com
              </span>
            </div>
          </div>
        </a>
      </GridItem>

      {/* FOOTER INFO */}
      <GridItem span="col-span-full" className="pt-12 border-t border-background/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          {/* SOCIALS */}
          <div className="flex flex-wrap gap-8 lg:gap-16">
            {[
              { name: "LinkedIn", url: "#" },
              { name: "GitHub", url: "#" },
              { name: "Twitter", url: "#" },
              { name: "Instagram", url: "#" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="text-xs lg:text-sm font-bold uppercase tracking-widest text-background/60 hover:text-primary transition-colors duration-300"
              >
                {social.name}
              </a>
            ))}
          </div>

          {/* SECONDARY INFO */}
          <div className="flex flex-col items-start md:items-end gap-2 text-[10px] lg:text-xs font-medium uppercase tracking-widest text-background/40">
            <span>Based in Romania, Europe</span>
            <span>Available for freelance / {currentYear}</span>
          </div>
        </div>
      </GridItem>

      {/* COPYRIGHT OVERLAY */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none select-none">
        <span className="font-special text-[15vw] leading-none uppercase whitespace-nowrap">
          IAMSEBBI
        </span>
      </div>
    </Section>
  );
}
