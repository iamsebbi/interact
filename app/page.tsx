"use client";
import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Info } from "@/components/Info";
import { Works } from "@/components/Works";
import { Experience } from "@/components/Experience";
import { BrutalistDivider } from "@/components/BrutalistDivider";
import { Contact } from "@/components/Contact";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Check if user has already seen the loader in this session
    const timer = setTimeout(() => {
      const hasVisited = sessionStorage.getItem("hasVisited");
      if (hasVisited) {
        setIsLoading(false);
      } else {
        setShowLoader(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleLoaderComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem("hasVisited", "true");
  };

  return (
    <>
      {showLoader && isLoading && <Loader onComplete={handleLoaderComplete} />}
      <div className={`relative min-h-screen transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <Navbar />
        <main>
          <Hero />
          <Info />
          <Works />
          <BrutalistDivider />
          <Experience />
          <Contact />
        </main>
      </div>
    </>
  );
}
