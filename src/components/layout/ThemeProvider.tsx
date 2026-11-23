"use client";

import { AnimateUIProvider } from "@animate-ui/react/provider";
import { OverlayHost } from "@ui-sdk/react/overlays";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export type AppTheme = "light" | "dark";

interface ThemeContextValue {
  theme: AppTheme;
  resolvedTheme: AppTheme;
  setTheme: (next: AppTheme) => void;
}

const STORAGE_KEY = "theme";
const DEFAULT_THEME: AppTheme = "dark";
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  resolvedTheme: DEFAULT_THEME,
  setTheme: () => {},
});

function readStoredTheme(): AppTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function applyThemeToRoot(next: AppTheme, disableTransitions: boolean) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  let cleanupStyle: (() => void) | null = null;

  if (disableTransitions) {
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(
        "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}",
      ),
    );
    document.head.appendChild(style);
    cleanupStyle = () => {
      void window.getComputedStyle(document.body);
      window.setTimeout(() => {
        style.remove();
      }, 1);
    };
  }

  root.setAttribute("data-theme", next);
  root.style.colorScheme = next;
  cleanupStyle?.();
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<AppTheme>(DEFAULT_THEME);

  useIsomorphicLayoutEffect(() => {
    const initial = readStoredTheme();
    setThemeState(initial);
    applyThemeToRoot(initial, false);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next: AppTheme =
        e.newValue === "light" || e.newValue === "dark"
          ? e.newValue
          : DEFAULT_THEME;
      setThemeState(next);
      applyThemeToRoot(next, true);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(next);
    applyThemeToRoot(next, true);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage quota errors in restricted contexts
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme,
    }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <AnimateUIProvider tempo={0.9} checkAnimation="pop">
        {children}
        <OverlayHost />
      </AnimateUIProvider>
    </ThemeContext.Provider>
  );
}
