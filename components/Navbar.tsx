"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { GridToggle } from "./GridToggle";
import { useTheme } from "./ThemeProvider";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const navLinks = [
  { name: "Work", href: "/works" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

export function Navbar() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 1. Initial State & Scroll Detection
  useEffect(() => {
    // Avoid synchronous setState in effect to prevent cascading renders
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 2. Stable Morphing Logic using CSS Variables
  useGSAP(() => {
    if (!mounted) return;

    const isDesktop = window.innerWidth >= 768;
    // Ultra-wide optimization: use 1400px for a perfectly balanced Pill
    const pillWidth = isDesktop ? "1400px" : "90vw";
    const duration = isDesktop ? 1.2 : 0.8;

    if (scrolled) {
      // Animate TO Pill State
      gsap.to(innerRef.current, {
        "--nav-width": pillWidth,
        "--nav-y": isDesktop ? "20px" : "12px",
        "--nav-radius": "99px",
        "--nav-padding-x": isDesktop ? "64px" : "20px",
        "--nav-bg-opacity": isDesktop ? "0.8" : "0.7",
        "--nav-blur": "24px",
        "--nav-border-opacity": "1",
        "--nav-shadow-opacity": "1",
        duration,
        ease: "power3.inOut",
        overwrite: "auto"
      });
    } else {
      // Animate TO Top Bar State
      gsap.to(innerRef.current, {
        "--nav-width": "100%",
        "--nav-y": "0px",
        "--nav-radius": "0px",
        "--nav-padding-x": isDesktop ? "48px" : "24px",
        "--nav-bg-opacity": "0",
        "--nav-blur": "0px",
        "--nav-border-opacity": "0",
        "--nav-shadow-opacity": "0",
        duration,
        ease: "power3.inOut",
        overwrite: "auto"
      });
    }
  }, { dependencies: [scrolled, mounted], scope: containerRef });

  // 3. Menu Expansion Logic
  const tlMenu = useRef<gsap.core.Timeline | null>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  useEffect(() => {
    if (!mounted) return;

    const toggleMenuAnimation = contextSafe(() => {
      if (isOpen) {
        // OPEN ANIMATION
        const links = gsap.utils.toArray(".menu-link");
        const pillRect = innerRef.current?.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        
        if (!pillRect || !containerRect) return;

        const relativeY = pillRect.top - containerRect.top;
        
        tlMenu.current?.kill();
        const tl = gsap.timeline();
        tlMenu.current = tl;
        
        tl.set("#menu-overlay", { autoAlpha: 1, pointerEvents: "auto" });
        tl.fromTo(menuRef.current, { 
          width: pillRect.width,
          height: pillRect.height,
          borderRadius: "99px",
          marginTop: relativeY,
          opacity: 1,
        }, {
          width: "min(100%, 1400px)",
          height: "auto",
          borderRadius: "24px",
          marginTop: "6rem",
          duration: 0.6,
          ease: "expo.inOut"
        });

        tl.fromTo(links, 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" },
          "-=0.3"
        );
      } else {
        // CLOSE ANIMATION via seamless reverse
        if (tlMenu.current) {
          tlMenu.current.reverse().then(() => {
            gsap.set("#menu-overlay", { autoAlpha: 0, pointerEvents: "none" });
          });
        }
      }
    });

    toggleMenuAnimation();
  }, [isOpen, mounted, contextSafe]);

  // 4. Scroll Lock & Resize Auto-Close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Better iOS lock
    } else {
      // Delay unlocking slightly to allow the close animation to finish smoothly
      const timer = setTimeout(() => {
        document.body.style.overflow = "unset";
        document.body.style.touchAction = "unset";
      }, 300);
      return () => clearTimeout(timer);
    }

    // Auto-close menu if resized to desktop format
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    };
  }, [isOpen]);

  return (
    <nav 
      ref={containerRef} 
      className="fixed top-0 left-0 right-0 z-100 flex justify-center"
      style={{
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <div 
        ref={innerRef}
        className="flex items-center justify-between py-3 relative z-120 border-border/50 transition-none"
        style={{ 
          // Default CSS Variable Initial Values (Prevents FOUC & Enables Smooth Return)
          "--nav-width": "100%",
          "--nav-y": "0px",
          "--nav-radius": "0px",
          "--nav-padding-x": mounted ? (window.innerWidth < 768 ? "24px" : "48px") : "24px",
          "--nav-bg-opacity": "0",
          "--nav-blur": "0px",
          "--nav-border-opacity": "0",
          "--nav-shadow-opacity": "0",
          
          // Theme-aware RGB variables
          "--nav-bg-rgb": theme === "dark" ? "0, 0, 0" : "255, 255, 255",
          "--border-rgb": theme === "dark" ? "56, 56, 58" : "237, 237, 237",
          
          // Layout Mapping
          width: "var(--nav-width)",
          maxWidth: "100vw",
          transform: "translateY(var(--nav-y))",
          borderRadius: "var(--nav-radius)",
          paddingLeft: "var(--nav-padding-x)",
          paddingRight: "var(--nav-padding-x)",
          
          // Visuals Mapping
          backgroundColor: `rgba(var(--nav-bg-rgb, 255, 255, 255), var(--nav-bg-opacity))`,
          backdropFilter: "blur(var(--nav-blur)) saturate(1.8)",
          WebkitBackdropFilter: "blur(var(--nav-blur)) saturate(1.8)",
          borderWidth: scrolled ? "1px" : "0px",
          borderColor: `rgba(var(--border-rgb, 237, 237, 237), var(--nav-border-opacity))`,
          boxShadow: `0 10px 15px -3px rgba(0,0,0,calc(0.1 * var(--nav-shadow-opacity))), 0 4px 6px -2px rgba(0,0,0,calc(0.05 * var(--nav-shadow-opacity)))`,
          
          willChange: "transform, width, padding, border-radius",
        } as React.CSSProperties}
      >
        {/* Logo - Force stretch prevention */}
        <Link href="/" className="shrink-0 text-2xl tracking-tighter text-foreground" style={{ fontFamily: "var(--font-special)" }}>
          <span>iam</span><span>sebbi</span>
        </Link>

        {/* Desktop - Links with spacing protection */}
        <div className="hidden md:flex shrink-0 items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors relative group">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <div className="pl-4 border-l border-border/50 flex items-center gap-3">
            <GridToggle />
            <ThemeToggle />
          </div>
        </div>


        {/* Mobile Toggle */}
        <div className="flex md:hidden shrink-0 items-center gap-2 relative z-110">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center text-foreground rounded-full focus:outline-none"
            style={{ WebkitTapHighlightColor: "transparent" }}
            aria-label="Toggle menu"
          >
            <div className="w-7 h-2.5 relative flex flex-col justify-between">
              <span className={`h-0.5 bg-current transition-all duration-500 ease-expo rounded-full ${isOpen ? "translate-y-1 rotate-45 w-full" : "w-full"}`} />
              <span className={`h-0.5 bg-current transition-all duration-500 ease-expo rounded-full self-end ${isOpen ? "-translate-y-1 -rotate-45 w-full" : "w-2/3"}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Menu Overlay */}
      <div id="menu-overlay" className="fixed inset-0 z-100 px-4 flex flex-col items-center invisible pointer-events-none">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md backdrop-saturate-[1.8]" onClick={() => setIsOpen(false)} />
        <div ref={menuRef} className="relative mt-24 glass rounded-3xl p-6 flex flex-col gap-4 shadow-2xl border border-border/50 w-full max-w-350">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="menu-link text-xl font-medium px-4 py-4 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all opacity-0">
              {link.name}
            </Link>
          ))}
          <div className="menu-link pt-4 mt-2 border-t border-border/50 flex flex-col gap-4 px-4 opacity-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-60 uppercase tracking-widest">Grid System</span>
              {mounted && <GridToggle />}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-60 uppercase tracking-widest">Theme</span>
              {mounted && <ThemeToggle />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
