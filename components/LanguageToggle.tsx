"use client";

import { useState } from "react";

export function LanguageToggle() {
  const [lang, setLang] = useState<"RO" | "EN">("EN");

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "RO" : "EN"));
  };

  return (
    <button
      onClick={toggleLang}
      className="relative flex items-center justify-center w-10 h-10 transition-all duration-500 rounded-full glass cursor-pointer group overflow-hidden hover:bg-foreground hover:text-background border-transparent"
      aria-label="Toggle language"
    >
      <span className="text-xs font-bold uppercase tracking-widest transition-opacity duration-300">
        {lang}
      </span>
    </button>
  );
}
