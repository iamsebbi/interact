"use client";
import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Info } from "@/components/Info";
import { Works } from "@/components/Works";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Loader } from "@/components/Loader";

import { Navbar } from "@/components/Navbar";
import { GridHelper } from "@/components/GridHelper";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      <div className={`relative min-h-screen transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <Navbar />
        <GridHelper />
        <main>
          <Hero />
          <Info />
          <Works />
          <Experience />
          <Contact />
        </main>
      </div>
    </>
  );
}

