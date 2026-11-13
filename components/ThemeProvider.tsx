"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useIsClient } from "@/lib/use-is-client";

type Theme = "dark" | "light";
type Language = "EN" | "RO";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  showGrid: boolean;
  toggleGrid: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  if (globalThis.window === undefined) {
    return "dark";
  }

  const savedTheme = localStorage.getItem("theme") as Theme | null;
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return globalThis.window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialGrid(): boolean {
  if (globalThis.window === undefined) {
    return false;
  }
  return localStorage.getItem("showGrid") === "true";
}

function getInitialLanguage(): Language {
  if (globalThis.window === undefined) {
    return "EN";
  }
  const savedLanguage = localStorage.getItem("language") as Language | null;
  return savedLanguage === "RO" ? "RO" : "EN";
}

export function ThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [showGrid, setShowGrid] = useState<boolean>(getInitialGrid);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hydrated = useIsClient();

  const effectiveTheme: Theme = hydrated ? theme : "dark";
  const effectiveLanguage: Language = hydrated ? language : "EN";
  const effectiveShowGrid = hydrated ? showGrid : false;

  useEffect(() => {
    const color = isMenuOpen
      ? effectiveTheme === "dark"
        ? "#1a1a1a"
        : "#f9f9f9"
      : effectiveTheme === "dark"
        ? "#0d0d0d"
        : "#ffffff";
    if (effectiveTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
    document.documentElement.style.backgroundColor = isMenuOpen ? color : "";
    document.documentElement.lang = effectiveLanguage === "RO" ? "ro" : "en";

    const themeMetas = document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    themeMetas.forEach((meta) => {
      meta.content = color;
    });
  }, [effectiveTheme, effectiveLanguage, isMenuOpen]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, [theme]);

  const toggleGrid = useCallback(() => {
    const nextGrid = !showGrid;
    setShowGrid(nextGrid);
    localStorage.setItem("showGrid", String(nextGrid));
  }, [showGrid]);

  const updateLanguage = useCallback((nextLanguage: Language) => {
    setLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    const nextLanguage = language === "EN" ? "RO" : "EN";
    updateLanguage(nextLanguage);
  }, [language, updateLanguage]);

  const contextValue = useMemo(
    () => ({
      theme: effectiveTheme,
      toggleTheme,
      showGrid: effectiveShowGrid,
      toggleGrid,
      language: effectiveLanguage,
      setLanguage: updateLanguage,
      toggleLanguage,
      isMenuOpen,
      setIsMenuOpen,
    }),
    [
      effectiveTheme,
      toggleTheme,
      effectiveShowGrid,
      toggleGrid,
      effectiveLanguage,
      updateLanguage,
      toggleLanguage,
      isMenuOpen,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
