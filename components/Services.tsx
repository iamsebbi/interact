"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Section, GridItem } from "./Section";

export function Services() {
  const { language } = useTheme();
  const isRO = language === "RO";

  const services = [
    {
      tag: isRO ? "DEZVOLTARE WEB" : "WEB DEVELOPMENT",
      description: isRO
        ? "Dezvoltare completă de platforme și aplicații web moderne, axate pe viteză maximă de încărcare, stabilitate și experiențe digitale fluide pe orice ecran."
        : "End-to-end development of modern web applications and platforms, focused on blazing load speeds, rock-solid stability, and seamless digital experiences across all screens.",
    },
    {
      tag: isRO ? "DESIGN UI/UX" : "UI/UX & PRODUCT",
      description: isRO
        ? "Concepție și design de interfețe centrate pe utilizator, construite pentru a îmbina estetica contemporană cu ușurința în navigare și claritatea fiecărei acțiuni."
        : "Human-centered interface design crafted to balance contemporary aesthetics with effortless navigation and intuitive clarity across every action.",
    },
    {
      tag: isRO ? "ARHITECTURĂ DE BRAND" : "BRAND ARCHITECTURE",
      description: isRO
        ? "Definirea identității vizuale și a direcției artistice, creând un limbaj grafic distinct și memorabil care reflectă autentic personalitatea și ambiția fiecărui proiect."
        : "Defining visual identities and digital art direction, crafting distinct and memorable design languages that authentically express the character of each brand.",
    },
    {
      tag: isRO ? "INGINERIE CREATIVĂ" : "CREATIVE ENGINEERING",
      description: isRO
        ? "Integrare de micro-interacțiuni animate, coregrafie vizuală și consultanță tehnică dedicată, asigurând o atenție riguroasă pentru fiecare detaliu înainte de lansare."
        : "Bespoke motion choreography, subtle interactive physics, and dedicated technical advisory, ensuring rigorous attention to detail prior to launch.",
    },
  ];

  return (
    <Section
      id="services"
      padding={false}
      grid={false}
      className="py-16 md:py-24 lg:py-32 bg-transparent"
    >
      <div className="w-full mx-auto max-w-480 px-4 md:px-12">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-10 md:gap-8 lg:gap-8 items-start">
          
          {/* COLOANA 1 (STÂNGA): TAG + TITLU ANTET + TEXT DESCRIERE + START A PROJECT */}
          <GridItem
            span="col-span-full md:col-span-4 lg:col-span-4"
            className="flex flex-col items-start text-left lg:sticky lg:top-28"
          >
            <div>
              <span className="font-lekton text-xs uppercase tracking-editorial font-normal text-foreground/60 block">
                {isRO ? "ABILITĂȚI & SERVICII" : "CAPABILITIES & SERVICES"}
              </span>
              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-normal uppercase tracking-tight text-foreground leading-tight mt-1">
                {isRO
                  ? "SISTEME DIGITALE DE IMPACT. ARTĂ & INGINERIE."
                  : "DIGITAL SYSTEMS THAT SCALE. CRAFT & ENGINEERING."}
              </h2>
            </div>

            <div className="space-y-3 pt-4 font-lekton text-sm leading-relaxed text-foreground/80 max-w-md">
              <p>
                {isRO
                  ? "Construiesc experiențe digitale la intersecția dintre design de înaltă fidelitate și inginerie creativă. De la concept și identitate vizuală până la platforme web complexe, rapide și scalabile."
                  : "Crafting bespoke digital experiences at the intersection of high-fidelity design and creative engineering. From concept and visual identity to fast, performant, and scalable web platforms."}
              </p>
              <p>
                {isRO
                  ? "Fiecare proiect este abordat ca o piesă unică de arhitectură digitală, adaptată obiectivelor și caracterului specific al brandului."
                  : "Every project is crafted as a distinct piece of digital architecture, tailored directly to the character and ambitious goals of each brand."}
              </p>
            </div>

            {/* BUTON START A PROJECT CU FONT LEKTON ȘI ARROW UP RIGHT */}
            <div className="pt-6 sm:pt-8">
              <Link
                href="/#contact-cta"
                className="inline-flex items-center gap-1.5 font-lekton text-sm sm:text-base uppercase tracking-normal text-foreground hover:text-primary transition-all group"
              >
                <span>{isRO ? "ÎNCEPE UN PROIECT" : "START A PROJECT"}</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </GridItem>

          {/* COLOANA 2 (CENTRU): IMAGINE SERVICES.JPG */}
          <GridItem
            span="col-span-full md:col-span-4 lg:col-span-4"
            className="flex items-center justify-center w-full py-4 lg:py-0 self-center"
          >
            <div className="relative w-full aspect-[491/508] max-w-sm sm:max-w-md lg:max-w-none overflow-hidden bg-card border border-border">
              <Image
                src="/services.jpg"
                alt={isRO ? "Servicii & Abilități" : "Services & Capabilities"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700 select-none pointer-events-none"
                priority={false}
              />
            </div>
          </GridItem>

          {/* COLOANA 3 (DREAPTA): 4 RÂNDURI CU TAG LEKTON + BORDER DESPĂRȚITOR IMEDIAT DUPĂ TAG + DESCRIERE */}
          <GridItem
            span="col-span-full md:col-span-8 lg:col-span-4"
            className="flex flex-col w-full text-left space-y-5 sm:space-y-6"
          >
            {services.map((service, index) => (
              <div key={index} className="flex flex-col w-full">
                {/* TAG LEKTON CA TAG ORIGINAL */}
                <span className="font-lekton text-xs uppercase tracking-editorial font-normal text-foreground/60 block">
                  {service.tag}
                </span>

                {/* BORDER DESPĂRȚITOR IMEDIAT DUPĂ TAG */}
                <div className="w-full border-t border-border/80 mt-1 mb-2" />

                {/* TEXT DESCRIERE SERVICIU (FONT GOOGLE SANS) */}
                <p className="font-google-sans text-sm sm:text-base leading-normal text-foreground/80 max-w-xl">
                  {service.description}
                </p>
              </div>
            ))}
          </GridItem>

        </div>
      </div>
    </Section>
  );
}
