import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cancel01,
  Share01,
  Check,
  Sun,
  Moon,
  Mail,
  LifeBuoy,
  AsteriskSymbol,
} from "../icons";
import { Button } from "../ui/button";
import { ContextualSettingsMenu, useAppTheme } from "./ContextualSettingsMenu";
import { cn } from "../../utils/cn";

export type AppPage = "showcase" | "studio" | "how-to-use" | "pricing";

export interface NavbarProps {
  currentPage?: AppPage;
  onNavigate?: (page: AppPage) => void;
  showStudio?: boolean;
  githubUrl?: string;
  defaultStars?: number | string;
  className?: string;
}

export function Navbar({
  currentPage = "showcase",
  onNavigate,
  showStudio = true,
  githubUrl = "https://github.com/iamsebbi/interact",
  defaultStars = 148,
  className,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stars, setStars] = useState<string | number>(defaultStars);
  const [copiedDone, setCopiedDone] = useState(false);
  const { isDark, toggleTheme } = useAppTheme();
  const contactEmail = "hello@interact.dev";
  const supportUrl = `${githubUrl}/issues`;

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedDone(true);
      setTimeout(() => setCopiedDone(false), 2000);
    } catch {
      // fallback dacă clipboard API nu e disponibil
    }
  };

  // Încearcă preluarea dinamică a numărului de stele de pe GitHub API dacă repository-ul este public
  useEffect(() => {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return;

    const [, owner, repo] = match;
    fetch(`https://api.github.com/repos/${owner}/${repo}`)
      .then((res) => {
        if (!res.ok) throw new Error("Repo not found");
        return res.json();
      })
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          const count = data.stargazers_count;
          setStars(count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count);
        }
      })
      .catch(() => {
        // Fallback la numărul implicit dacă API-ul este limitat sau repo-ul este privat/inexistent
      });
  }, [githubUrl]);

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.("showcase");
    setMobileMenuOpen(false);
  };

  const handleStudioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.("studio");
    setMobileMenuOpen(false);
  };

  const handleHowToUseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.("how-to-use");
    setMobileMenuOpen(false);
  };

  const handlePriceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.("pricing");
    setMobileMenuOpen(false);
  };

  const handleGetProClick = () => {
    onNavigate?.("pricing");
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full h-16 bg-background select-none transition-colors",
        className
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand + Navigation Links */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Brand Wordmark (Unified Symbol + Text) */}
          <a
            href="#showcase"
            onClick={handleProductsClick}
            className="flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md py-1 px-1 -ml-1 transition-opacity hover:opacity-85 text-foreground"
            title="interact.dev"
          >
            <AsteriskSymbol
              size={18}
              className="shrink-0 fill-current text-foreground"
            />
            <span className="text-base sm:text-lg font-medium tracking-tight whitespace-nowrap">
              <span className="text-foreground">interact</span>
              <span className="text-muted-foreground">.dev</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {/* Products */}
            <button
              type="button"
              onClick={handleProductsClick}
              className={cn(
                "px-3 py-1.5 rounded-full transition-all text-sm",
                currentPage === "showcase"
                  ? "text-foreground font-semibold glass-chosen"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              Products
            </button>

            {/* How to use */}
            <button
              type="button"
              onClick={handleHowToUseClick}
              className={cn(
                "px-3 py-1.5 rounded-full transition-all text-sm",
                currentPage === "how-to-use"
                  ? "text-foreground font-semibold glass-chosen"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              How to use
            </button>

            {/* Price */}
            <button
              type="button"
              onClick={handlePriceClick}
              className={cn(
                "px-3 py-1.5 rounded-full transition-all text-sm",
                currentPage === "pricing"
                  ? "text-foreground font-semibold glass-chosen"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              Price
            </button>

            {/* Studio */}
            {showStudio && (
              <button
                type="button"
                onClick={handleStudioClick}
                className={cn(
                  "relative px-3 py-1.5 rounded-full transition-all text-sm flex items-center gap-1.5",
                  currentPage === "studio"
                    ? "text-foreground font-semibold glass-chosen"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <span>Studio</span>
                <span className="text-[10px] font-semibold font-mono px-1.5 py-0.2 rounded-full bg-primary/15 text-primary border border-primary/20">
                  PRO
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Right: Desktop actions + Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Desktop only: GitHub + Get Pro + Contextual Settings */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Git Button (doar iconul de git si numarul) */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 h-9 px-3 rounded-full glass-control text-sm font-medium text-foreground transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="GitHub"
            >
              {/* GitHub mark SVG */}
              <svg
                className="size-4 fill-current shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span className="font-sans text-xs font-semibold tracking-tight">{stars}</span>
            </a>

            {/* CTA: Get Pro (Solid color, no gradient) */}
            <Button
              variant="primary"
              size="md"
              onClick={handleGetProClick}
              className="font-semibold px-4"
            >
              <span>Get Pro</span>
            </Button>

            {/* Buton contextual cu 3 dots care se morpheaza intr-un meniu contextual de setari */}
            <ContextualSettingsMenu
              supportUrl={supportUrl}
              contactEmail={contactEmail}
              isDark={isDark}
              onToggleTheme={toggleTheme}
            />
          </div>

          {/* Mobile Menu Toggle Button (Hamburger) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden size-9 rounded-full flex items-center justify-center glass-control text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <Cancel01 size={18} />
            ) : (
              <svg
                className="size-4 fill-none stroke-current stroke-2"
                viewBox="0 0 24 24"
              >
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 py-4 overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleProductsClick}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  currentPage === "showcase"
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                Products
              </button>

              <button
                type="button"
                onClick={handleHowToUseClick}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  currentPage === "how-to-use"
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                How to use
              </button>

              <button
                type="button"
                onClick={handlePriceClick}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  currentPage === "pricing"
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                Price
              </button>

              {showStudio && (
                <button
                  type="button"
                  onClick={handleStudioClick}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between",
                    currentPage === "studio"
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <span>Studio</span>
                  <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                    PRO
                  </span>
                </button>
              )}

              <div className="pt-2 border-t border-border/60 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {isDark ? (
                      <Moon className="size-4 text-muted-foreground shrink-0" />
                    ) : (
                      <Sun className="size-4 text-amber-500 shrink-0" />
                    )}
                    <span>{isDark ? "Dark" : "Light"}</span>
                  </div>
                </button>

                <a
                  href={`mailto:${contactEmail}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <span>Contact</span>
                </a>

                <a
                  href={supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <LifeBuoy className="size-4 text-muted-foreground shrink-0" />
                  <span>Support</span>
                </a>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Share01 size={16} className="text-muted-foreground shrink-0" />
                    <span>Share</span>
                  </div>
                  {copiedDone && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                      <Check size={13} className="shrink-0" />
                      <span>Copied!</span>
                    </span>
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-border flex items-center gap-2">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-3 rounded-full glass-control text-sm font-medium text-foreground"
                >
                  <svg
                    className="size-4 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span className="font-sans text-xs font-semibold tracking-tight">{stars}</span>
                </a>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleGetProClick}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Get Pro
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
