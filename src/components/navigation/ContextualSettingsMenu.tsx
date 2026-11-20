import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MoreVertical,
  Share01,
  Check,
  Sun,
  Moon,
  Mail,
  LifeBuoy,
} from "../icons";
import { cn } from "../../utils/cn";

export function useAppTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app-theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("app-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return { isDark, setIsDark, toggleTheme };
}

export interface ContextualSettingsMenuProps {
  className?: string;
  contactEmail?: string;
  supportUrl?: string;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export function ContextualSettingsMenu({
  className,
  contactEmail = "hello@interact.dev",
  supportUrl = "https://github.com/iamsebbi/interact/issues",
  isDark: controlledDark,
  onToggleTheme,
}: ContextualSettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- 1. Stare Temă (Dark / Light) ---
  const internalTheme = useAppTheme();
  const isDark = controlledDark ?? internalTheme.isDark;
  const handleToggleTheme = onToggleTheme ?? internalTheme.toggleTheme;

  // --- 2. Share / Copiere Link ---
  const [copiedDone, setCopiedDone] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedDone(true);
      setTimeout(() => setCopiedDone(false), 2000);
    } catch {
      // fallback dacă clipboard API nu e disponibil
    }
  };

  // --- Închidere la click în exterior sau Escape ---
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={cn("relative size-9 flex items-center justify-center shrink-0", className)}
    >
      <AnimatePresence initial={false} mode="wait">
        {!isOpen ? (
          /* Butonul Trigger cu MoreVertical din useAnimations */
          <motion.button
            key="trigger-btn"
            layoutId="contextual-menu-morph-card"
            onClick={() => setIsOpen(true)}
            className="group size-9 rounded-full glass-control text-foreground flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
            aria-label="Open contextual menu"
            aria-expanded={false}
            title="Options"
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
            }}
          >
            <MoreVertical
              size={18}
              className="text-foreground/80 group-hover:text-foreground transition-colors shrink-0"
            />
          </motion.button>
        ) : (
          /* Meniul contextual simplu pe rânduri (Temă, Contact, Share) */
          <motion.div
            key="menu-morphed-card"
            layoutId="contextual-menu-morph-card"
            className="absolute right-0 top-0 w-60 rounded-2xl bg-popover p-1.5 z-50 text-popover-foreground overflow-hidden"
            style={{ transformOrigin: "top right" }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="flex flex-col gap-0.5 select-none text-sm font-medium"
            >
              {/* 1. Rând Temă: când e pe dark scrie "Dark", când e pe light scrie "Light" */}
              <button
                type="button"
                onClick={handleToggleTheme}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-foreground hover:bg-muted/70 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-2.5">
                  {isDark ? (
                    <Moon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  ) : (
                    <Sun className="size-4 text-amber-500 transition-colors shrink-0" />
                  )}
                  <span className="text-sm">{isDark ? "Dark" : "Light"}</span>
                </div>
              </button>

              <div className="h-px bg-border/40 mx-2 my-0.5" />

              {/* 2. Rând Contact */}
              <a
                href={`mailto:${contactEmail}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-foreground hover:bg-muted/70 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  <span className="text-sm">Contact</span>
                </div>
              </a>

              <div className="h-px bg-border/40 mx-2 my-0.5" />

              {/* 3. Rând Support */}
              <a
                href={supportUrl}
                target={supportUrl.startsWith("http") ? "_blank" : undefined}
                rel={supportUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-foreground hover:bg-muted/70 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-2.5">
                  <LifeBuoy className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  <span className="text-sm">Support</span>
                </div>
              </a>

              <div className="h-px bg-border/40 mx-2 my-0.5" />

              {/* 4. Rând Share */}
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-foreground hover:bg-muted/70 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-2.5">
                  <Share01
                    size={16}
                    animateOnHover
                    className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
                  />
                  <span className="text-sm">Share</span>
                </div>
                {copiedDone && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                    <Check size={13} className="shrink-0" />
                    <span>Copied!</span>
                  </span>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
