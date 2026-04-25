"use client";

import { useState } from "react";

export function LanguageSwitcher() {
  const [lang, setLang] = useState<"RO" | "EN">("EN");

  return (
    <div className="relative flex w-32 h-10 p-1 glass rounded-full overflow-hidden">
      {/* Sliding Background */}
      <div
        className="absolute top-1 bottom-1 left-1 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] rounded-full"
        style={{
          width: "calc(50% - 4px)",
          transform: `translateX(${lang === "EN" ? "100%" : "0"})`,
        }}
      />

      <button
        onClick={() => setLang("RO")}
        className={`relative z-10 flex-1 text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
          lang === "RO" ? "text-background" : "text-foreground/40 hover:text-foreground"
        }`}
      >
        RO
      </button>
      <button
        onClick={() => setLang("EN")}
        className={`relative z-10 flex-1 text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
          lang === "EN" ? "text-background" : "text-foreground/40 hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
