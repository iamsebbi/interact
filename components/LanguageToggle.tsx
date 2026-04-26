"use client";

import { useTheme } from "./ThemeProvider";

export function LanguageToggle() {
  const { language, toggleLanguage } = useTheme();

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center justify-center w-10 h-10 transition-all duration-500 rounded-full glass cursor-pointer group overflow-hidden hover:bg-foreground hover:text-background border-transparent"
      aria-label="Toggle language"
    >
      <span className="text-xs font-bold uppercase tracking-widest transition-opacity duration-300">
        {language}
      </span>
    </button>
  );
}
