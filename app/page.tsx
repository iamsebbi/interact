"use client";

import { useState, useCallback } from "react";
import { Hero } from "@/components/Hero";
import { ProjectMarquee } from "@/components/ProjectMarquee";
import { ProjectIndex } from "@/components/ProjectIndex";
import { DESIGN_MARQUEE_ITEMS } from "@/lib/marquee-data";
import { BrutalistDivider } from "@/components/BrutalistDivider";
import { Services } from "@/components/Services";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { useIsClient } from "@/lib/use-is-client";

export default function Home() {
  const isClient = useIsClient();
  const [loaderDone, setLoaderDone] = useState(false);

  const showLoader =
    isClient && !loaderDone && !sessionStorage.getItem("hasVisited");

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem("hasVisited", "true");
    setLoaderDone(true);
  }, []);

  return (
    <>
      {showLoader && <Loader onComplete={handleLoaderComplete} />}
      <div className="relative min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <ProjectIndex />
          <BrutalistDivider />
          <Services />
          <ProjectMarquee
            id="design"
            badge="Design"
            title="Visual Design & Branding Architecture • 2024–2026"
            items={DESIGN_MARQUEE_ITEMS}
            baseSpeed={42}
          />
        </main>
      </div>
    </>
  );
}
