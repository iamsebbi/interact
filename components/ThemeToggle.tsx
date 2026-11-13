"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme, language } = useTheme();
  const isRO = language === "RO";

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-background border border-foreground/20 hover:border-foreground/40 cursor-pointer group overflow-hidden hover:bg-foreground hover:text-background"
      aria-label={
        isRO
          ? theme === "dark"
            ? "Comută pe modul luminos"
            : "Comută pe modul întunecat"
          : theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
    >
      <div className="relative w-4.5 h-4.5 flex items-center justify-center">
        {/* Sun Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === "dark"
              ? "rotate-90 opacity-0 scale-0"
              : "rotate-0 opacity-100 scale-100"
          }`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Moon Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === "dark"
              ? "rotate-0 opacity-100 scale-100"
              : "-rotate-90 opacity-0 scale-0"
          }`}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>
    </button>
  );
}
