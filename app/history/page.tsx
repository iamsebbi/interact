"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/components/ThemeProvider";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const HISTORY_RO = [
  {
    period: "2023 — Prezent",
    role: "Senior Creative Developer",
    company: "Unbren Studio",
    location: "București / Remote",
    description:
      "Coordonez dezvoltarea experiențelor digitale de impact, site-uri de brand interactive și arhitecturi frontend performante. Mă concentrez pe micro-interacțiuni fluide, animații GSAP complexe și fidelitate vizuală impecabilă.",
    tags: ["Next.js", "GSAP", "TypeScript", "Creative Direction", "Performance"],
  },
  {
    period: "2021 — 2023",
    role: "Full Stack Developer",
    company: "Digital Edge",
    location: "Remote",
    description:
      "Dezvoltare end-to-end pentru produse digitale scalabile. Am optimizat timpii de randare, am construit componente reutilizabile și am integrat experiențe interactive pentru branduri internaționale.",
    tags: ["React", "Node.js", "Motion Design", "REST APIs", "Tailwind CSS"],
  },
  {
    period: "2019 — 2021",
    role: "UI/UX Designer & Frontend Dev",
    company: "Freelance",
    location: "România",
    description:
      "Colaborare directă cu startup-uri și studiouri independente pentru definirea limbajului vizual, prototipare rapidă și transpunerea ideilor de design în cod curat și funcțional.",
    tags: ["UI/UX", "Brand Systems", "JavaScript", "HTML/CSS", "Typography"],
  },
];

const HISTORY_EN = [
  {
    period: "2023 — Present",
    role: "Senior Creative Developer",
    company: "Unbren Studio",
    location: "Bucharest / Remote",
    description:
      "Leading the frontend architecture and creative engineering for high-end digital experiences, interactive web applications, and bespoke brand identities. Heavy emphasis on fluid motion, micro-interactions, and visual fidelity.",
    tags: ["Next.js", "GSAP", "TypeScript", "Creative Direction", "Performance"],
  },
  {
    period: "2021 — 2023",
    role: "Full Stack Developer",
    company: "Digital Edge",
    location: "Remote",
    description:
      "Engineered end-to-end features for scalable digital products. Specialized in performance optimization, responsive layouts, and rich client-side animations.",
    tags: ["React", "Node.js", "Motion Design", "REST APIs", "Tailwind CSS"],
  },
  {
    period: "2019 — 2021",
    role: "UI/UX Designer & Frontend Dev",
    company: "Freelance",
    location: "Romania",
    description:
      "Partnered with early-stage startups and independent studios to design identities, build interactive prototypes, and bridge the gap between aesthetic vision and technical reality.",
    tags: ["UI/UX", "Brand Systems", "JavaScript", "HTML/CSS", "Typography"],
  },
];

const CAPABILITIES = [
  {
    category: { en: "Engineering", ro: "Inginerie" },
    items: [
      "Next.js / React 19",
      "TypeScript",
      "GSAP Motion Systems",
      "Responsive & Fluid Layouts",
      "Performance & SEO Architecture",
    ],
  },
  {
    category: { en: "Design & Craft", ro: "Design & Viziune" },
    items: [
      "Creative Direction",
      "Brutalist & Editorial Typography",
      "Interactive Systems & Prototyping",
      "Design Systems & Tokens",
      "Art Direction for Web",
    ],
  },
];

export default function HistoryPage() {
  const { language } = useTheme();
  const isRO = language === "RO";
  const containerRef = useRef<HTMLDivElement>(null);
  const items = isRO ? HISTORY_RO : HISTORY_EN;

  useGSAP(
    () => {
      gsap.from(".history-reveal", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.1,
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="grow pt-28 sm:pt-36 pb-20 md:pb-28">
        <div className="w-full max-w-480 mx-auto px-4 md:px-12">
          {/* TOP TAG & BACK LINK */}
          <div className="history-reveal flex items-center justify-between border-b border-border/40 pb-4 mb-10 md:mb-16">
            <div className="flex items-center gap-3">
              <span className="font-lekton text-xs uppercase tracking-wider text-primary">
                [ {isRO ? "Arhivă Carieră" : "Career Trajectory"} ]
              </span>
              <span className="hidden sm:inline-block font-lekton text-xs uppercase tracking-widest text-foreground/40">
                • 2019 — {isRO ? "Prezent" : "Present"}
              </span>
            </div>

            <Link
              href="/"
              className="font-lekton text-xs uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <span>←</span>
              <span>{isRO ? "Acasă" : "Back to Home"}</span>
            </Link>
          </div>

          {/* PAGE HEADER */}
          <header className="history-reveal mb-14 md:mb-20">
            <h1 className="font-special text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-none mb-6 text-foreground">
              {isRO ? "Istoric" : "History"}
            </h1>
            <p className="font-lekton text-sm sm:text-base md:text-lg max-w-2xl text-foreground/75 leading-relaxed">
              {isRO
                ? "Traseul meu profesional, rolurile și colaborările prin care explorez intersecția dintre artă vizuală, tipografie brutalistă și inginerie digitală de înaltă performanță."
                : "My professional trajectory, roles, and creative engineering practices bridging the space between visual design, editorial typography, and high-performance digital systems."}
            </p>
          </header>

          {/* TIMELINE / EXPERIENCE LIST */}
          <section className="mb-20 md:mb-28">
            <div className="border-t border-border/60">
              {items.map((item, index) => (
                <article
                  key={index}
                  className="history-reveal py-8 md:py-12 border-b border-border/40 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group hover:bg-card/40 transition-colors px-2 md:px-4 -mx-2 md:-mx-4"
                >
                  {/* COLUMN 1: PERIOD & LOCATION */}
                  <div className="md:col-span-3 flex flex-col gap-1">
                    <span className="font-lekton text-sm md:text-base font-bold text-foreground">
                      {item.period}
                    </span>
                    <span className="font-lekton text-xs uppercase tracking-wider text-foreground/50">
                      {item.location}
                    </span>
                  </div>

                  {/* COLUMN 2: ROLE & COMPANY */}
                  <div className="md:col-span-4 flex flex-col gap-1">
                    <h2 className="font-heading text-xl md:text-2xl font-light uppercase tracking-tight text-foreground">
                      {item.role}
                    </h2>
                    <span className="font-lekton text-xs uppercase tracking-wider text-primary font-medium">
                      @{item.company}
                    </span>
                  </div>

                  {/* COLUMN 3: DESCRIPTION & TAGS */}
                  <div className="md:col-span-5 flex flex-col gap-4">
                    <p className="font-lekton text-xs sm:text-sm text-foreground/75 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-lekton text-[10px] md:text-[11px] uppercase tracking-wider px-2 py-0.5 border border-border/60 text-foreground/60 bg-background/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* CAPABILITIES / SKILLS SUMMARY */}
          <section className="history-reveal mb-20 md:mb-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 pt-8 border-t border-border/60">
            {CAPABILITIES.map((group, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <span className="font-lekton text-xs uppercase tracking-wider text-foreground/50">
                  // {isRO ? group.category.ro : group.category.en}
                </span>
                <ul className="space-y-2">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="font-lekton text-sm md:text-base text-foreground/85 flex items-center gap-3"
                    >
                      <span className="text-primary text-xs">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* BOTTOM FOOTER / CTA */}
          <footer className="history-reveal pt-12 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <span className="font-lekton text-xs uppercase tracking-widest text-foreground/40">
              © {new Date().getFullYear()} iamsebbi. {isRO ? "Toate drepturile rezervate." : "All rights reserved."}
            </span>

            <div className="flex items-center gap-6">
              <Link
                href="/#contact"
                className="font-lekton text-xs uppercase tracking-wider text-foreground hover:text-primary transition-colors border-b border-foreground/30 hover:border-primary pb-0.5"
              >
                {isRO ? "Contactează-mă →" : "Get in touch →"}
              </Link>
              <Link
                href="/"
                className="font-lekton text-xs uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors"
              >
                {isRO ? "Înapoi acasă" : "Back home"}
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
