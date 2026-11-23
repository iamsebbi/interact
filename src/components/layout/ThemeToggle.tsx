"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/controls";
import { Moon, Sun } from "@/components/icons";
import { useTheme } from "@/components/layout/ThemeProvider";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isDark = mounted ? resolvedTheme !== "light" : true;

  return (
    <Button
      variant="chip"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </Button>
  );
}
