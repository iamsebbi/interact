"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const LANGUAGES = [
  { code: "RO" as const, label: "Română" },
  { code: "EN" as const, label: "English" },
];

export function LanguageToggle() {
  const { language, setLanguage } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative flex items-center justify-center w-12 h-12 transition-all duration-300 rounded-full border border-foreground/20 hover:border-foreground/40 cursor-pointer group ${
          isOpen
            ? "bg-foreground text-background"
            : "bg-background text-foreground hover:bg-foreground hover:text-background"
        }`}
        aria-label={language === "RO" ? "Selectează limba" : "Select language"}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Globe / Language Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      </button>

      {/* Small Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={language === "RO" ? "Opțiuni limbă" : "Language options"}
          className="absolute top-full mt-2.5 right-0 min-w-36 p-1.5 bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-xl z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {LANGUAGES.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background"
                    : "text-foreground/80 hover:text-foreground hover:bg-foreground/10"
                }`}
              >
                <span className="tracking-wide">{item.label}</span>
                {isSelected ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-mono opacity-50 uppercase">
                    {item.code}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
