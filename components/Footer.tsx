"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { GridItem } from "./Section";

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
          <div className="flex items-center justify-center gap-6 mt-6 text-[#F5F2EB]/80">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/iamsebbi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white hover:scale-110 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/iamsebbi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-white hover:scale-110 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/sebastian-prisecaru/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white hover:scale-110 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com/iamsebb00"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="hover:text-white hover:scale-110 transition-all"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
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
