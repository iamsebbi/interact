"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { PreferenceRows } from "./LanguageSwitcher";
import { useTheme } from "./ThemeProvider";

/**
 * Desktop navbar dropdown triggered by a vertical three-dots icon for Language & Theme.
 */
export function DesktopPreferencesMenu() {
  const { language } = useTheme();
  const isRO = language === "RO";
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isRO ? "Preferințe limbă și temă" : "Language and theme preferences"}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
          isOpen
            ? "bg-foreground text-background"
            : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
        }`}
      >
        <MoreVertical className="w-4 h-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={isRO ? "Preferințe" : "Preferences"}
          className="absolute top-full right-0 mt-3 w-72 bg-card border border-border px-4 py-1 shadow-2xl z-50"
        >
          <PreferenceRows outerBorders={false} rowClassName="py-3" />
        </div>
      )}
    </div>
  );
}
