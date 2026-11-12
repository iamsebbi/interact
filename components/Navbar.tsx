"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTheme } from "./ThemeProvider";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Navbar() {
  const { theme, language } = useTheme();
  const isRO = language === "RO";
  const navLinks = [
    { name: isRO ? "Lucrari" : "Work", href: "/#works" },
    { name: isRO ? "Istoric" : "History", href: "/history" },
    { name: "Contact", href: "/#contact" },
  ];
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
  useGSAP(
    () => {
      if (!mounted) return;

      const isDesktop = window.innerWidth >= 768;
      // Ultra-wide optimization: use 1400px for a perfectly balanced Pill
      const pillWidth = isDesktop ? "1400px" : `${window.innerWidth - 32}px`;
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
          "--nav-border-opacity": "0.15",
          "--nav-shadow-opacity": "1",
          duration,
          ease: "power3.inOut",
          overwrite: "auto",
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
          overwrite: "auto",
        });
      }
    },
    { dependencies: [scrolled, mounted], scope: containerRef },
  );

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
        tl.fromTo(
          menuRef.current,
          {
            width: pillRect.width,
            height: pillRect.height,
            borderRadius: "99px",
            marginTop: relativeY,
            opacity: 1,
          },
          {
            width: "min(100%, 1400px)",
            height: "auto",
            borderRadius: "24px",
            marginTop: "5rem",
            duration: 0.6,
            ease: "expo.inOut",
          },
        );

        tl.fromTo(
          links,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3",
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

  const handleScroll = (e: React.MouseEvent, href: string) => {
    if (isOpen) setIsOpen(false);

    const isAnchor = href.includes("#");
    const isHomePage = window.location.pathname === "/";

    if (isAnchor && isHomePage) {
      e.preventDefault();
      const targetId = href.split("#")[1];
      const elem = document.getElementById(targetId);
      if (elem) {
        const top = elem.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    }
  };

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
        className="flex items-center justify-between py-3 relative z-120 transition-none"
        style={
          {
            // Default CSS Variable Initial Values (Prevents FOUC & Enables Smooth Return)
            "--nav-width": "100vw",
            "--nav-y": "0px",
            "--nav-radius": "0px",
            "--nav-padding-x": mounted
              ? window.innerWidth < 768
                ? "24px"
                : "48px"
              : "24px",
            "--nav-bg-opacity": "0",
            "--nav-blur": "0px",
            "--nav-border-opacity": "0",
            "--nav-shadow-opacity": "0",

            // Theme-aware RGB variables
            "--nav-bg-rgb": theme === "dark" ? "0, 0, 0" : "255, 255, 255",
            "--foreground-rgb": theme === "dark" ? "255, 255, 255" : "13, 13, 13",

            // Layout Mapping
            width: "var(--nav-width)",
            maxWidth: "100vw",
            transform: "translateY(var(--nav-y))",
            borderRadius: "var(--nav-radius)",
            paddingLeft: "var(--nav-padding-x)",
            paddingRight: "var(--nav-padding-x)",

            // Visuals Mapping
            backgroundColor: `rgba(var(--nav-bg-rgb, 255, 255, 255), var(--nav-bg-opacity))`,
            backdropFilter: "blur(var(--nav-blur)) saturate(180%)",
            WebkitBackdropFilter: "blur(var(--nav-blur)) saturate(180%)",
            borderWidth: "0px",
            boxShadow: `inset 0 0 0 1px rgba(var(--foreground-rgb), var(--nav-border-opacity)), 0 10px 15px -2px rgba(0,0,0,calc(0.1 * var(--nav-shadow-opacity))), 0 4px 6px -2px rgba(0,0,0,calc(0.05 * var(--nav-shadow-opacity)))`,

            willChange: "transform, width, padding, border-radius",
          } as React.CSSProperties
        }
      >
        {/* Logo - Force stretch prevention */}
        <Link
          href="/"
          className="shrink-0 font-heading font-normal text-2xl tracking-tighter text-foreground flex items-center gap-1.5"
        >
          <svg
            viewBox="0 0 150 150"
            className="w-6 h-6 text-foreground shrink-0"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g transform="translate(75, 75)">
              <rect x="-13" y="-57" width="26" height="57" transform="rotate(0)" />
              <rect x="-13" y="-57" width="26" height="57" transform="rotate(72)" />
              <rect x="-13" y="-57" width="26" height="57" transform="rotate(144)" />
              <rect x="-13" y="-57" width="26" height="57" transform="rotate(216)" />
              <rect x="-13" y="-57" width="26" height="57" transform="rotate(288)" />
              <circle r="13" />
            </g>
          </svg>
          <div className="flex">
            <span>iam</span>
            <span>sebbi</span>
          </div>
        </Link>

        {/* Desktop - Links with spacing protection */}
        <div className="hidden md:flex shrink-0 items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="group relative h-8 text-sm font-bold tracking-tight overflow-hidden"
            >
              <div className="relative flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                <span className="h-8 flex items-center text-foreground/60 transition-colors group-hover:text-foreground">
                  {link.name}
                </span>
                <span className="h-8 flex items-center text-foreground">
                  {link.name}
                </span>
              </div>
            </Link>
          ))}
          <div className="pl-4 border-l border-border/50 flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden shrink-0 items-center gap-2 relative z-110">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center text-foreground rounded-full focus:outline-none active:scale-90 transition-all duration-500"
            style={{ WebkitTapHighlightColor: "transparent" }}
            aria-label={isRO ? "Deschide meniul" : "Toggle menu"}
          >
            <div className="w-7 h-2.5 relative flex flex-col justify-between">
              <span
                className={`h-0.5 bg-current transition-all duration-500 ease-expo rounded-full ${isOpen ? "translate-y-1 rotate-45 w-full" : "w-full"}`}
              />
              <span
                className={`h-0.5 bg-current transition-all duration-500 ease-expo rounded-full self-end ${isOpen ? "-translate-y-1 -rotate-45 w-full" : "w-2/3"}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Menu Overlay */}
      <div
        id="menu-overlay"
        className="fixed inset-0 z-100 px-4 flex flex-col items-center invisible pointer-events-none overscroll-contain"
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-md backdrop-saturate-[180%]"
          onClick={() => setIsOpen(false)}
        />
        <div
          ref={menuRef}
          className="relative mt-20 bg-background rounded-[32px] p-8 flex flex-col gap-4 shadow-2xl border border-foreground/15 w-full max-w-350"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="menu-link group relative h-14 text-2xl font-bold tracking-tighter overflow-hidden opacity-0"
            >
              <div className="relative flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-active:-translate-y-1/2 lg:group-hover:-translate-y-1/2">
                <span className="h-14 flex items-center text-foreground">
                  {link.name}
                </span>
                <span className="h-14 flex items-center text-foreground">
                  {link.name}
                </span>
              </div>
            </Link>
          ))}
          <div className="menu-link pt-4 mt-2 border-t border-border/50 flex flex-col gap-4 px-4 opacity-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-60 uppercase tracking-widest">
                {isRO ? "Limbă" : "Language"}
              </span>
              {mounted && <LanguageSwitcher />}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-60 uppercase tracking-widest">
                {isRO ? "Tema" : "Theme"}
              </span>
              {mounted && <ThemeToggle />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
