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
    <Section id="experience" className="py-16 lg:py-24">

      {/* HEADER */}
      <GridItem span="col-span-full" className="mb-1 lg:mb-2">
        <div className="flex flex-col">
          <span className="text-[12px] lg:text-xs font-bold uppercase tracking-widest text-foreground/40">
            History*
          </span>
        </div>
      </GridItem>

      {/* EXPERIENCE LIST */}
      <GridItem span="col-span-full">
        <div className="flex flex-col">
          {EXPERIENCES.map((exp, index) => (
            <div
              key={index}
              className="group relative flex flex-col pt-4 pb-8 lg:pt-6 lg:pb-10 min-h-20 lg:min-h-27.5 border-b border-border/50 last:border-0"
            >
              {/* METADATA: YEAR & COMPANY */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 font-mono text-[10px] lg:text-xs uppercase tracking-tight">
                  <span className="text-foreground/80">{exp.year.split(" — ")[0]}</span>
                  <span className="text-foreground/30">—</span>
                  <span className="text-foreground/80">{exp.year.split(" — ")[1] || ""}</span>
                </div>
                <span className="text-foreground/20 text-[10px]">•</span>
                <span className="font-mono text-[10px] lg:text-xs uppercase tracking-tight text-foreground/40 group-hover:text-foreground/60 transition-colors">
                  {exp.company}
                </span>
              </div>

              {/* ROLE */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <h3 className="text-2xl lg:text-4xl font-bold uppercase tracking-tighter text-foreground/90 group-hover:text-foreground transition-all">
                  {exp.role}
                </h3>
                
                {/* DESCRIPTION (Desktop only) */}
                <p className="hidden lg:block max-w-md text-xs lg:text-sm text-foreground/40 leading-relaxed font-medium group-hover:text-foreground/60 transition-colors">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GridItem>
    </Section>
  );
}
