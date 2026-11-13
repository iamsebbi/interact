"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTheme } from "./ThemeProvider";
import { useIsClient } from "@/lib/use-is-client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Navbar() {
  const {
    theme,
    language,
    isMenuOpen: isOpen,
    setIsMenuOpen: setIsOpen,
  } = useTheme();
  const isRO = language === "RO";
  const navLinks = [
    { num: "01", name: isRO ? "Lucrări" : "Work", href: "/#works" },
    { num: "02", name: isRO ? "Istoric" : "History", href: "/history" },
    { num: "03", name: "Contact", href: "/#contact-cta" },
  ];
  const [scrolled, setScrolled] = useState(false);
  const mounted = useIsClient();

  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrolledRef = useRef(false);
  const isOpenRef = useRef(false);
  const prevIsOpenRef = useRef(false);
  const hasMountedMorphRef = useRef(false);

  // Reset global menu state if Navbar unmounts across route changes
  useEffect(() => {
    return () => setIsOpen(false);
  }, [setIsOpen]);

  // 1. Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 20;
      scrolledRef.current = next;
      setScrolled(next);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 2. Stable Morphing Logic using CSS Variables + Resize Support
  useGSAP(
    () => {
      if (!mounted || !innerRef.current || !navRef.current) return;

      const isInitialMount = !hasMountedMorphRef.current;
      hasMountedMorphRef.current = true;
      const isMenuToggle = prevIsOpenRef.current !== isOpen;
      isOpenRef.current = isOpen;
      prevIsOpenRef.current = isOpen;

      const setPillSurfaceActive = (active: boolean) => {
        const inner = innerRef.current;
        if (!inner) return;
        if (active) {
          inner.style.backdropFilter = "blur(var(--nav-blur)) saturate(180%)";
          inner.style.setProperty(
            "-webkit-backdrop-filter",
            "blur(var(--nav-blur)) saturate(180%)",
          );
          inner.style.boxShadow =
            "inset 0 0 0 1px rgba(var(--foreground-rgb), var(--nav-border-opacity)), 0 10px 15px -2px rgba(0,0,0,calc(0.1 * var(--nav-shadow-opacity))), 0 4px 6px -2px rgba(0,0,0,calc(0.05 * var(--nav-shadow-opacity)))";
        } else {
          inner.style.backdropFilter = "none";
          inner.style.setProperty("-webkit-backdrop-filter", "none");
          inner.style.boxShadow = "none";
        }
      };

      const applyMorph = (immediate = false) => {
        const inner = innerRef.current;
        const nav = navRef.current;
        if (!inner || !nav) return;

        const containerWidth = nav.clientWidth || window.innerWidth;
        const isDesktop = window.innerWidth >= 768;
        const pillWidthPx = isDesktop
          ? Math.min(1400, containerWidth - 48)
          : containerWidth - 32;
        const duration = immediate
          ? 0
          : isMenuToggle
            ? 0.45
            : isDesktop
              ? 1.0
              : 0.7;
        const ease =
          isMenuToggle && isOpenRef.current ? "power3.out" : "power3.inOut";
        const showPill = scrolledRef.current && !isOpenRef.current;

        if (showPill) {
          setPillSurfaceActive(true);
          if (!immediate) {
            gsap.set(inner, { "--nav-width": `${inner.offsetWidth}px` });
          }
          gsap.to(inner, {
            "--nav-width": `${pillWidthPx}px`,
            "--nav-y": isDesktop ? "20px" : "12px",
            "--nav-radius": "99px",
            "--nav-padding-x": isDesktop ? "48px" : "20px",
            "--nav-bg-opacity": isDesktop ? "0.8" : "0.75",
            "--nav-blur": "24px",
            "--nav-border-opacity": "0.15",
            "--nav-shadow-opacity": "1",
            duration,
            ease,
            overwrite: "auto",
          });
        } else {
          if (immediate) {
            setPillSurfaceActive(false);
            gsap.set(inner, {
              "--nav-width": "100%",
              "--nav-y": "0px",
              "--nav-radius": "0px",
              "--nav-padding-x": isDesktop ? "48px" : "24px",
              "--nav-bg-opacity": "0",
              "--nav-blur": "0px",
              "--nav-border-opacity": "0",
              "--nav-shadow-opacity": "0",
            });
          } else {
            gsap.to(inner, {
              "--nav-width": `${containerWidth}px`,
              "--nav-y": "0px",
              "--nav-radius": "0px",
              "--nav-padding-x": isDesktop ? "48px" : "24px",
              "--nav-bg-opacity": "0",
              "--nav-blur": "0px",
              "--nav-border-opacity": "0",
              "--nav-shadow-opacity": "0",
              duration,
              ease,
              overwrite: "auto",
              onComplete: () => {
                if (
                  !(scrolledRef.current && !isOpenRef.current) &&
                  innerRef.current
                ) {
                  setPillSurfaceActive(false);
                  gsap.set(innerRef.current, { "--nav-width": "100%" });
                }
              },
            });
          }
        }
      };

      applyMorph(isInitialMount);

      const handleResize = () => applyMorph(true);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    },
    { dependencies: [scrolled, isOpen, mounted], scope: containerRef },
  );

  // 3. Fullscreen Editorial Menu Reveal
  const tlMenu = useRef<gsap.core.Timeline | null>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  useEffect(() => {
    if (!mounted || !overlayRef.current) return;

    const toggleMenuAnimation = contextSafe(() => {
      if (isOpen) {
        const items = gsap.utils.toArray(".menu-reveal");

        tlMenu.current?.kill();
        const tl = gsap.timeline();
        tlMenu.current = tl;

        tl.set(overlayRef.current, { pointerEvents: "auto" });
        tl.fromTo(
          overlayRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
        );
        tl.fromTo(
          items,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.2",
        );
      } else if (tlMenu.current) {
        tlMenu.current.reverse().then(() => {
          if (overlayRef.current) {
            gsap.set(overlayRef.current, {
              autoAlpha: 0,
              pointerEvents: "none",
            });
          }
        });
      }
    });

    toggleMenuAnimation();
  }, [isOpen, mounted, contextSafe]);

  // 4. Scroll Lock, Escape Key & Resize Auto-Close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }, 300);
      return () => clearTimeout(timer);
    }

    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen, setIsOpen]);

  const handleScroll = (e: React.MouseEvent, href: string) => {
    if (isOpen) setIsOpen(false);

    const isAnchor = href.includes("#");
    const isHomePage = window.location.pathname === "/";

    if (isAnchor && isHomePage) {
      e.preventDefault();
      const targetId = href.split("#")[1];
      const elem = document.getElementById(targetId);
      if (elem) {
        const top = elem.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div ref={containerRef}>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-120 flex justify-center pointer-events-none"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <div
          ref={innerRef}
          className="nav-morph-bar pointer-events-auto flex items-center justify-between py-2.5 relative z-120 transition-none"
          style={
            {
              // Only theme colors live in React inline style so re-renders never reset GSAP vars
              "--nav-bg-rgb": theme === "dark" ? "0, 0, 0" : "255, 255, 255",
              "--foreground-rgb": theme === "dark" ? "255, 255, 255" : "13, 13, 13",

              // Layout Mapping
              width: "var(--nav-width)",
              maxWidth: "100%",
              transform: "translateY(var(--nav-y))",
              borderRadius: "var(--nav-radius)",
              paddingLeft: "var(--nav-padding-x)",
              paddingRight: "var(--nav-padding-x)",

              // Visuals Mapping (blur and hairline borders are toggled only during pill state)
              backgroundColor: `rgba(var(--nav-bg-rgb, 255, 255, 255), var(--nav-bg-opacity))`,
              borderWidth: "0px",

              willChange: "transform, width, padding, border-radius",
            } as React.CSSProperties
          }
        >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => {
            if (isOpen) setIsOpen(false);
          }}
          className="shrink-0 font-heading font-normal text-lg md:text-2xl tracking-tighter text-foreground flex items-center gap-1 md:gap-1.5"
        >
          <svg
            viewBox="0 0 150 150"
            className="w-4.5 h-4.5 md:w-6 md:h-6 text-foreground shrink-0"
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
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center text-foreground rounded-full focus:outline-none active:scale-90 transition-all duration-500"
            style={{ WebkitTapHighlightColor: "transparent" }}
            aria-label={isRO ? (isOpen ? "Închide meniul" : "Deschide meniul") : (isOpen ? "Close menu" : "Open menu")}
            aria-expanded={isOpen}
            aria-controls="menu-overlay"
          >
            <div className="w-7 h-2.5 relative flex flex-col justify-between">
              <span
                className={`h-0.5 bg-current transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full ${isOpen ? "translate-y-1 rotate-45 w-full" : "w-full"}`}
              />
              <span
                className={`h-0.5 bg-current transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full self-end ${isOpen ? "-translate-y-1 -rotate-45 w-full" : "w-2/3"}`}
              />
            </div>
          </button>
        </div>
        </div>
      </nav>

      {/* Fullscreen Editorial Menu Overlay (Mobile) */}
      <div
        ref={overlayRef}
        id="menu-overlay"
        aria-hidden={!isOpen}
        className="fixed inset-0 z-110 w-full bg-card text-foreground flex flex-col justify-between overflow-y-auto invisible pointer-events-none overscroll-contain md:hidden"
        style={{
          paddingTop: "calc(5.25rem + env(safe-area-inset-top))",
          paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
          paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
          paddingRight: "max(1.25rem, env(safe-area-inset-right))",
        }}
      >
        {/* TOP SECTION: META TAG + EDITORIAL LINKS */}
        <div className="relative z-10 w-full flex flex-col">
          <div className="menu-reveal flex items-center justify-between pb-3 text-[11px] font-lekton uppercase tracking-editorial text-foreground/60">
            <span>[ {isRO ? "NAVIGARE" : "NAVIGATION"} ]</span>
            <span>BUCHAREST • 44.44° N</span>
          </div>

          <div className="border-t border-border flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="menu-reveal group py-5 sm:py-6 border-b border-border flex items-center justify-between gap-4 active:bg-foreground/[0.04] transition-colors"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-lekton text-xs text-foreground/55 tabular-nums group-active:text-primary transition-colors">
                    {link.num}
                  </span>
                  <span className="font-heading text-4xl sm:text-5xl font-light uppercase tracking-tight leading-none text-foreground group-active:text-primary transition-colors">
                    {link.name}
                  </span>
                </div>

                <ArrowUpRight className="w-5 h-5 text-foreground/50 group-active:text-primary group-active:translate-x-0.5 group-active:-translate-y-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: PREFERENCES + DIRECT CONTACT & SOCIALS */}
        <div className="relative z-10 w-full flex flex-col gap-5 pt-8">
          {/* Language & Theme */}
          <div className="menu-reveal grid grid-cols-2 gap-4 py-4 border-y border-border">
            <div className="flex flex-col gap-2 items-start">
              <span className="font-lekton text-[11px] uppercase tracking-editorial text-foreground/60">
                {isRO ? "LIMBĂ" : "LANGUAGE"}
              </span>
              {mounted && <LanguageSwitcher />}
            </div>

            <div className="flex flex-col gap-2 items-end">
              <span className="font-lekton text-[11px] uppercase tracking-editorial text-foreground/60">
                {isRO ? "TEMĂ" : "THEME"}
              </span>
              {mounted && <ThemeToggle />}
            </div>
          </div>

          {/* Direct Contact + Socials */}
          <div className="menu-reveal flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <a
                href="mailto:hello.iamsebbi@gmail.com"
                className="font-heading text-sm uppercase tracking-tight text-foreground/90 hover:text-primary transition-colors"
              >
                HELLO.IAMSEBBI@GMAIL.COM
              </a>
              <a
                href="https://wa.me/40769695933"
                target="_blank"
                rel="noopener noreferrer"
                className="font-lekton text-xs uppercase tracking-editorial text-foreground/65 hover:text-primary transition-colors"
              >
                WHATSAPP • +40 769 695 933
              </a>
            </div>

            <div className="flex items-center gap-5 pt-1 font-lekton text-xs uppercase tracking-editorial text-foreground/65">
              <a
                href="https://www.instagram.com/iamsebbi/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                IG
              </a>
              <a
                href="https://github.com/iamsebbi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GH
              </a>
              <a
                href="https://www.linkedin.com/in/sebastian-prisecaru/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                LI
              </a>
              <a
                href="https://x.com/iamsebb00"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                X
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
