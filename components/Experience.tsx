"use client";

import React from "react";
import { Section, GridItem } from "./Section";

const EXPERIENCES = [
  {
    year: "2023 — Present",
    role: "Senior Creative Developer",
    company: "Unbren Studio",
    description:
      "Leading the development of high-end digital experiences and interactive brand identities.",
  },
  {
    year: "2021 — 2023",
    role: "Full Stack Developer",
    company: "Digital Edge",
    description:
      "Architecting scalable web applications and specializing in complex GSAP animations.",
  },
  {
    year: "2019 — 2021",
    role: "UI/UX Designer & Dev",
    company: "Freelance",
    description:
      "Collaborating with global startups to bridge the gap between design vision and technical reality.",
  },
];

export function Experience() {
  return (
    <Section id="experience" className="py-8 lg:py-12">
      {/* HEADER */}
      <GridItem span="col-span-full" className="mb-1 lg:mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.1em] text-foreground/40">
            History*
          </span>
        </div>
      </GridItem>

      {/* EXPERIENCE LIST */}
      <GridItem span="col-span-full">
        <div className="flex flex-col border-t border-border/50">
          {EXPERIENCES.map((exp, index) => (
            <div
              key={index}
              className="group relative border-b border-border/50 py-3 lg:py-4 transition-all duration-500 hover:bg-card/30"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 lg:px-4">
                {/* YEAR & COMPANY */}
                <div className="flex flex-col gap-1 md:w-1/4">
                  <span className="text-xs lg:text-sm font-bold uppercase tracking-widest text-foreground mb-1">
                    {exp.year}
                  </span>
                  <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-foreground/30">
                    {exp.company}
                  </span>
                </div>

                {/* ROLE */}
                <div className="flex-1">
                  <h3 className="text-xl lg:text-3xl font-bold uppercase tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">
                    {exp.role}
                  </h3>
                </div>

                {/* DESCRIPTION */}
                <div className="hidden lg:block w-1/3 text-right">
                  <p className="text-xs text-foreground/20 leading-relaxed max-w-xs ml-auto group-hover:text-foreground/40 transition-colors">
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GridItem>
    </Section>
  );
}
