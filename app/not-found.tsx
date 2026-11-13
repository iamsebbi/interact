"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/components/ThemeProvider";

export default function NotFound() {
  const { language } = useTheme();
  const isRO = language === "RO";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="grow pt-[calc(8rem+env(safe-area-inset-top))] sm:pt-[calc(10rem+env(safe-area-inset-top))] pb-20 md:pb-28 flex items-center">
        <div className="w-full max-w-480 mx-auto px-4 md:px-12">
          <div className="border-t border-b border-border/60 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <span className="font-lekton text-xs uppercase tracking-editorial text-primary block">
                [ 404 — {isRO ? "PAGINĂ INEXISTENTĂ" : "PAGE NOT FOUND"} ]
              </span>
              <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-medium uppercase tracking-tighter leading-none">
                {isRO ? "RUTĂ PIERDUTĂ" : "SIGNAL LOST"}
              </h1>
              <p className="font-lekton text-sm sm:text-base text-foreground/75 max-w-xl leading-relaxed pt-2">
                {isRO
                  ? "Pagina sau proiectul pe care îl cauți nu există sau a fost mutat. Poți reveni la pagina principală sau explora lucrările selectate."
                  : "The page or project you are looking for does not exist or has been moved. Return home or browse selected works."}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-4">
              <Link
                href="/"
                className="font-heading text-xs sm:text-sm uppercase tracking-widest bg-foreground text-background hover:bg-primary hover:text-foreground px-6 py-3 transition-colors inline-flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isRO ? "Acasă" : "Back Home"}</span>
              </Link>
              <Link
                href="/#project-index"
                className="font-heading text-xs sm:text-sm uppercase tracking-widest border border-border hover:border-foreground px-6 py-3 transition-colors inline-flex items-center gap-2"
              >
                <span>{isRO ? "Proiecte" : "View Works"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
