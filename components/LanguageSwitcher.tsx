"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const SEGMENT_CONTAINER_CLASS =
  "grid grid-cols-2 w-40 h-9 border border-border divide-x divide-border bg-background/60 shrink-0";

function getSegmentButtonClass(isActive: boolean): string {
  return `flex items-center justify-center gap-1.5 font-heading text-[11px] font-medium uppercase tracking-editorial transition-colors duration-150 cursor-pointer ${
    isActive
      ? "bg-foreground text-background"
      : "text-foreground/65 hover:text-foreground hover:bg-foreground/[0.04]"
  }`;
}

/**
 * Editorial sharp-edged segmented language switcher for the mobile menu.
 */
export function LanguageSwitcher() {
  const { language, setLanguage } = useTheme();

  return (
    <div
      role="group"
      aria-label={language === "RO" ? "Selectează limba" : "Select language"}
      className={SEGMENT_CONTAINER_CLASS}
    >
      {(["RO", "EN"] as const).map((code) => {
        const isActive = language === code;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={isActive}
            onClick={() => setLanguage(code)}
            className={getSegmentButtonClass(isActive)}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Editorial sharp-edged segmented theme switcher matching LanguageSwitcher dimensions.
 */
export function ThemeSwitcher() {
  const { theme, toggleTheme, language } = useTheme();
  const isRO = language === "RO";

  const selectTheme = (target: "dark" | "light") => {
    if (theme !== target) {
      toggleTheme();
    }
  };

  return (
    <div
      role="group"
      aria-label={isRO ? "Selectează tema" : "Select theme"}
      className={SEGMENT_CONTAINER_CLASS}
    >
      <button
        type="button"
        aria-pressed={theme === "dark"}
        onClick={() => selectTheme("dark")}
        className={getSegmentButtonClass(theme === "dark")}
      >
        <Moon className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>DARK</span>
      </button>
      <button
        type="button"
        aria-pressed={theme === "light"}
        onClick={() => selectTheme("light")}
        className={getSegmentButtonClass(theme === "light")}
      >
        <Sun className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>LIGHT</span>
      </button>
    </div>
  );
}

interface PreferenceRowsProps {
  /** Whether to draw top and bottom outer borders (used in the mobile menu). */
  outerBorders?: boolean;
  /** Row vertical padding class. */
  rowClassName?: string;
}

/**
 * Shared two-row editorial Language & Theme controls used in both mobile menu and desktop dropdown.
 */
export function PreferenceRows({
  outerBorders = true,
  rowClassName = "py-3.5 min-h-[65px]",
}: PreferenceRowsProps) {
  const { language } = useTheme();
  const isRO = language === "RO";

  return (
    <div className={`flex flex-col ${outerBorders ? "border-t border-border" : ""}`}>
      <div
        className={`flex items-center justify-between gap-4 border-b border-border ${rowClassName}`}
      >
        <span className="font-lekton text-xs uppercase tracking-editorial text-foreground/60">
          {isRO ? "LIMBĂ" : "LANGUAGE"}
        </span>
        <LanguageSwitcher />
      </div>

      <div
        className={`flex items-center justify-between gap-4 ${
          outerBorders ? "border-b border-border" : ""
        } ${rowClassName}`}
      >
        <span className="font-lekton text-xs uppercase tracking-editorial text-foreground/60">
          {isRO ? "TEMĂ" : "THEME"}
        </span>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
