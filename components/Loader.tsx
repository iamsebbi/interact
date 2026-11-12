"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const logoText = "iamsebbi";

  // 1. Organic Progress Logic
  useEffect(() => {
    let currentProgress = 0;
    let frameId: number;

    const updateProgress = () => {
      const increment = Math.random() * (currentProgress > 80 ? 1.5 : 4) + 1;
      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(Math.floor(currentProgress));

      if (currentProgress < 100) {
        const delay = Math.random() * 20 + (currentProgress > 90 ? 40 : 0);
        setTimeout(() => {
          frameId = requestAnimationFrame(updateProgress);
        }, delay);
      }
    };

    frameId = requestAnimationFrame(updateProgress);

    // Initial Reveal with GSAP (Replaces CSS animation to prevent jumps)
    gsap.fromTo(logoRef.current, 
      { opacity: 0, y: 40, filter: "blur(20px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power4.out", delay: 0.2 }
    );
    
    gsap.fromTo(progressRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.6 }
    );

    return () => cancelAnimationFrame(frameId);
  }, []);

  // 2. Unitary Exit Animation
  useEffect(() => {
    if (progress === 100) {
      const tl = gsap.timeline({
        onComplete: onComplete,
        delay: 0.2
      });

      tl.to(logoRef.current, {
        opacity: 0,
        y: -100,
        filter: "blur(30px)",
        scale: 1.05,
        duration: 0.8,
        ease: "power4.in"
      })
      .to(progressRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.4
      }, "-=0.6")
      .to(".loader-bg", {
        yPercent: -100,
        duration: 1,
        ease: "expo.inOut",
      }, "-=0.4");
    }
  }, [progress, onComplete]);

  return (
    <div 
      ref={containerRef}
      className="loader-bg fixed inset-0 z-9999 flex items-center justify-center bg-background overflow-hidden"
    >
      <div className="relative flex flex-col items-center z-20">
        {/* Unitary Logo Wrapper */}
        <div ref={logoRef} className="flex flex-col items-center will-change-transform">
          <div className="flex mb-4 pb-4 px-4">
            <span className="font-heading font-bold text-[14vw] lg:text-[7.5rem] text-foreground select-none tracking-tighter inline-block">
              {logoText}
            </span>
          </div>

          {/* PROGRESS BAR */}
          <div ref={progressRef} className="loader-progress-container flex flex-col items-center w-[280px] will-change-transform">
            <div className="w-full h-[1px] bg-foreground/5 relative overflow-hidden mb-3">
              <div
                className="absolute inset-y-0 left-0 bg-foreground/40 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="w-full flex justify-end">
               <span className="font-mono text-[10px] text-foreground/40 font-bold tabular-nums">
                 {progress}%
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
