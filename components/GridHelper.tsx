"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

export function GridHelper() {
  const { showGrid } = useTheme();

  if (!showGrid) return null;

  return (
    <div className="fixed inset-0 pointer-events-none px-4 md:px-12 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-8 max-w-[1920px] mx-auto z-[9999]">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`desktop-${i}`}
          className="hidden lg:flex col-span-1 h-full border-x border-red-500/20 bg-red-500/5 items-start justify-center pt-5"
        >
          <span className="text-red-500/80 font-mono font-bold text-xs bg-background/50 px-1.5 py-0.5 rounded shadow-sm">
            {i + 1}
          </span>
        </div>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`tablet-${i}`}
          className="hidden md:flex lg:hidden col-span-1 h-full border-x border-purple-500/20 bg-purple-500/5 items-start justify-center pt-5"
        >
          <span className="text-purple-500/80 font-mono font-bold text-xs bg-background/50 px-1.5 py-0.5 rounded shadow-sm">
            {i + 1}
          </span>
        </div>
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`mobile-${i}`}
          className="flex md:hidden col-span-1 h-full border-x border-blue-500/20 bg-blue-500/5 items-start justify-center pt-5"
        >
          <span className="text-blue-500/80 font-mono font-bold text-xs bg-background/50 px-1.5 py-0.5 rounded shadow-sm">
            {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
}
