"use client";
import Link from "next/link";
import { Section, GridItem } from "@/components/Section";

export default function NotFound() {
  return (
    <Section 
      padding={false} 
      container={false} 
      grid={false}
      className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden"
    >
      <div className="z-10 flex flex-col items-center text-center w-full px-4">
        <GridItem span="col-span-full">
          <h1 className="font-special text-[25vw] lg:text-[20rem] leading-none text-foreground select-none opacity-[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            404
          </h1>

          <div className="relative px-4 w-full">
            <h2 className="font-special text-4xl lg:text-7xl uppercase tracking-tighter text-foreground mb-4 leading-[0.9] max-w-[200px] lg:max-w-none mx-auto">
              Lost in Space*
            </h2>
            <p className="font-mono text-[10px] lg:text-sm uppercase tracking-[0.1em] text-foreground/40 mb-12 max-w-[280px] lg:max-w-none mx-auto leading-relaxed">
              The requested resource does not exist or has been relocated.
            </p>

            <Link
              href="/"
              className="group flex flex-col items-center gap-4 transition-all duration-500"
            >
              <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full border-[3px] border-foreground flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-500">
                <svg
                  className="w-5 h-5 lg:w-8 lg:h-8 text-foreground group-hover:text-background transition-colors transform rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
                Back to Safety
              </span>
            </Link>
          </div>
        </GridItem>
      </div>

      {/* DECORATIVE CORNER ACCENTS */}
      <div className="absolute top-10 left-10 font-mono text-[10px] text-foreground/20 uppercase tracking-widest hidden md:block">
        Error_Code: 0x404
      </div>
      <div className="absolute bottom-10 right-10 font-mono text-[10px] text-foreground/20 uppercase tracking-widest hidden md:block">
        Location: Unknown_Sector
      </div>
    </Section>
  );
}
