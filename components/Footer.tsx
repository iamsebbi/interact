"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { GridItem } from "./Section";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const { language } = useTheme();
  const isRO = language === "RO";

  return (
    <footer
      className="relative w-full min-h-[480px] md:min-h-[520px] lg:h-[480px] overflow-hidden flex items-center justify-center text-[#F5F2EB] select-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* BACKGROUND IMAGE */}
      <Image
        src="/footer-img.avif"
        alt="Footer background"
        fill
        sizes="100vw"
        className="object-cover object-center pointer-events-none select-none brightness-[0.7] contrast-[1.1]"
        priority={false}
      />

      {/* TONAL DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/65 pointer-events-none" />

      {/* TACTILE FILM GRAIN / NOISE OVERLAY */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* INNER CONTENT WRAPPER - SNAPPED DIRECTLY TO GLOBAL 4 / 8 / 12 GRID */}
      <div className="relative z-10 w-full max-w-480 mx-auto px-4 md:px-12 py-16 md:py-20 lg:py-0 h-full grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: HERO QUOTE & SOCIAL ICONS (COLS 1-4) */}
        <GridItem
          span="col-span-full md:col-span-8 lg:col-span-4"
          className="flex flex-col items-center text-center mx-auto w-full"
        >
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-3xl font-medium uppercase tracking-tight text-[#F5F2EB] leading-tight max-w-md">
            {isRO ? "ARTA DE A FACE TOTUL SĂ FUNCȚIONEZE." : "THE ART OF MAKING IT WORK."}
          </h2>

          {/* SOCIAL ICONS */}
          <SocialLinks
            className="flex items-center justify-center gap-6 mt-6 text-[#F5F2EB]/80"
            linkClassName="hover:text-white hover:scale-110 transition-all"
          />
        </GridItem>

        {/* CENTER COLUMN: SITEMAP (COLS 5-8) */}
        <GridItem
          span="col-span-full md:col-span-4 lg:col-span-4"
          className="flex flex-col items-center text-center mx-auto w-full"
        >
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-3xl font-medium uppercase tracking-tight text-[#F5F2EB] leading-tight mb-6">
            SITEMAP
          </h2>

          <div className="flex flex-col items-center w-full max-w-xs">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full text-center">
              {/* Left Sub-column */}
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/"
                  className="font-lekton text-sm sm:text-base uppercase tracking-normal text-[#F5F2EB]/75 hover:text-white transition-colors"
                >
                  {isRO ? "ACASĂ" : "HOME"}
                </Link>
                <Link
                  href="/history"
                  className="font-lekton text-sm sm:text-base uppercase tracking-normal text-[#F5F2EB]/75 hover:text-white transition-colors"
                >
                  {isRO ? "ISTORIC" : "THE STUDIO"}
                </Link>
                <Link
                  href="/#project-index"
                  className="font-lekton text-sm sm:text-base uppercase tracking-normal text-[#F5F2EB]/75 hover:text-white transition-colors"
                >
                  {isRO ? "STUDII DE CAZ" : "CASE STUDIES"}
                </Link>
              </div>

              {/* Right Sub-column */}
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/#works"
                  className="font-lekton text-sm sm:text-base uppercase tracking-normal text-[#F5F2EB]/75 hover:text-white transition-colors"
                >
                  {isRO ? "PORTOFOLIU" : "PORTFOLIO"}
                </Link>
                <Link
                  href="/#services"
                  className="font-lekton text-sm sm:text-base uppercase tracking-normal text-[#F5F2EB]/75 hover:text-white transition-colors"
                >
                  {isRO ? "ABILITĂȚI" : "SERVICES"}
                </Link>
                <a
                  href="/CV_Prisecaru_Sebastian.pdf"
                  download="CV_Prisecaru_Sebastian.pdf"
                  className="font-lekton text-sm sm:text-base uppercase tracking-normal text-[#F5F2EB]/75 hover:text-white transition-colors"
                >
                  {isRO ? "CV" : "RESUME"}
                </a>
              </div>
            </div>

            {/* Centered CONTACT below the two columns */}
            <Link
              href="/#contact-cta"
              className="font-lekton text-sm sm:text-base uppercase tracking-normal text-[#F5F2EB]/75 hover:text-white transition-colors mt-2"
            >
              CONTACT
            </Link>
          </div>
        </GridItem>

        {/* RIGHT COLUMN: GET IN TOUCH (COLS 9-12) */}
        <GridItem
          span="col-span-full md:col-span-4 lg:col-span-4"
          className="flex flex-col items-center text-center mx-auto w-full"
        >
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-3xl font-medium uppercase tracking-tight text-[#F5F2EB] leading-tight mb-6">
            {isRO ? "CONTACT" : "GET IN TOUCH"}
          </h2>

          <div className="flex flex-col items-center space-y-3">
            <a
              href="mailto:hello.iamsebbi@gmail.com"
              className="font-heading text-sm sm:text-base lg:text-lg uppercase tracking-tight text-[#F5F2EB]/90 hover:text-white transition-colors"
            >
              HELLO.IAMSEBBI@GMAIL.COM
            </a>

            <a
              href="mailto:hello.iamsebbi@gmail.com?subject=Project%20Inquiry"
              className="inline-flex items-center gap-1.5 font-lekton text-sm sm:text-base lg:text-lg uppercase tracking-normal text-[#F5F2EB]/85 hover:text-white transition-all group"
            >
              <span>{isRO ? "ÎNCEPE UN PROIECT" : "START A PROJECT"}</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </GridItem>

      </div>
    </footer>
  );
}
