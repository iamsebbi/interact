"use client";

import { useTheme } from "./ThemeProvider";

export function LanguageToggle() {
  const { language, toggleLanguage } = useTheme();

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center justify-center w-12 h-12 transition-all duration-500 rounded-full bg-background border-[2px] border-foreground cursor-pointer group overflow-hidden hover:bg-foreground hover:text-background hover:border-background"
      aria-label="Toggle language"
    >
      <span className="text-xs font-bold uppercase tracking-widest transition-opacity duration-300">
        {language}
      </span>
    </button>
  );
}
