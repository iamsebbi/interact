"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Percentage counter logic
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Temporarily disabled for design preview

      const tl = gsap.timeline({
        onComplete: onComplete,
      });

      tl.to(".loader-text", {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power4.inOut",
      }).to(
        ".loader-bg",
        {
          yPercent: -100,
          duration: 1.2,
          ease: "expo.inOut",
        },
        "-=0.4",
      );
    }
  }, [progress, onComplete]);

  return (
    <div className="loader-bg fixed inset-0 z-9999 flex items-center justify-center bg-background overflow-hidden">

      <div className="relative flex flex-col items-center">
        <div className="loader-text flex flex-col items-center">
          <span className="font-mono font-semibold text-[8vw] lg:text-[4rem] leading-none text-foreground select-none tracking-tighter">
            {"[ "}
            {progress}%{" ]"}
          </span>
          <div className="mt-12 flex flex-col items-start gap-1 w-[320px]">
            {[
              { t: 0, m: "Initializing core system..." },
              { t: 20, m: "Loading digital assets..." },
              { t: 40, m: "Parsing portfolio content..." },
              { t: 60, m: "Syncing design tokens..." },
              { t: 80, m: "Booting GSAP animations..." },
              { t: 100, m: "System Ready." },
            ].map((log, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-500 ${progress >= log.t ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
              >
                <span
                  className={`w-1 h-1 rounded-full ${progress >= log.t ? "bg-primary" : "bg-foreground/20"}`}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
                  {log.m}{" "}
                  {progress >= log.t && progress < 100 && i < 5 && "[ OK ]"}
                </span>
              </div>
            ))}

            {/* PROGRESS BAR (Minimalist) */}
            <div className="w-full h-px bg-foreground/5 mt-8 relative">
              <div
                className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* DECORATIVE CORNER ACCENTS */}
      <div className="absolute top-10 left-10 font-mono text-[10px] text-foreground/20 uppercase tracking-widest hidden md:block">
        System_Boot_v2.0.4
      </div>
      <div className="absolute bottom-10 right-10 font-mono text-[10px] text-foreground/20 uppercase tracking-widest hidden md:block">
        ©{new Date().getFullYear()} Sebastian
      </div>
    </div>
  );
}
