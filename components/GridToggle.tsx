"use client";

import { useTheme } from "./ThemeProvider";

export function GridToggle() {
  const { showGrid, toggleGrid } = useTheme();

  return (
    <button
      onClick={toggleGrid}
      className={`relative flex items-center justify-center gap-3 px-4 py-2 transition-all duration-500 rounded-full glass cursor-pointer group overflow-hidden border-transparent ${
        showGrid ? "bg-primary text-primary-foreground" : "hover:bg-foreground hover:text-background"
      }`}
      aria-label="Toggle grid system"
    >
      <div className="relative w-5 h-5 shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
        </svg>
      </div>
      
      <span className="text-xs font-bold uppercase tracking-widest transition-opacity duration-300">
        {showGrid ? "Grid On" : "Grid Off"}
      </span>
    </button>
  );
}
