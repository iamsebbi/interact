"use client";

import { useTheme } from "./ThemeProvider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useTheme();

  return (
    <div className="relative flex w-32 h-10 p-1 glass rounded-full overflow-hidden">
      {/* Sliding Background */}
      <div
        className="absolute top-1 bottom-1 left-1 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] rounded-full"
        style={{
          width: "calc(50% - 4px)",
          transform: `translateX(${language === "EN" ? "100%" : "0"})`,
        }}
      />

      <button
        onClick={() => setLanguage("RO")}
        className={`relative z-10 flex-1 text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
          language === "RO"
            ? "text-background"
            : "text-foreground/40 hover:text-foreground"
        }`}
      >
        RO
      </button>
      <button
        onClick={() => setLanguage("EN")}
        className={`relative z-10 flex-1 text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
          language === "EN"
            ? "text-background"
            : "text-foreground/40 hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
