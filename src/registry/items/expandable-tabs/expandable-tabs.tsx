"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type ExpandableTabsTheme = "dark" | "light";
export type ExpandableTabsChangeReason = "tab" | "outside" | "escape";

export type ExpandableTabsItem = {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
};

export type ExpandableTabsClassNames = {
  root?: string;
  panel?: string;
  bar?: string;
  tab?: string;
  activeTab?: string;
  icon?: string;
  label?: string;
  pill?: string;
};

export interface ExpandableTabsProps {
  items: ExpandableTabsItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (
    id: string | null,
    reason?: ExpandableTabsChangeReason,
  ) => void;
  closeOnOutsideClick?: boolean;
  theme?: ExpandableTabsTheme;
  className?: string;
  classNames?: ExpandableTabsClassNames;
}

type Size = {
  width: number;
  height: number;
};

const THEME_TOKEN_STYLES: Record<ExpandableTabsTheme, CSSProperties> = {
  light: {
    colorScheme: "light",
    ["--background" as string]: "#fdfdfd",
    ["--card" as string]: "#ffffff",
    ["--foreground" as string]: "#0d0d0d",
    ["--muted" as string]: "rgba(0, 0, 0, 0.04)",
    ["--muted-foreground" as string]: "#6c6c6c",
    ["--border" as string]: "rgba(0, 0, 0, 0.08)",
    ["--ring" as string]: "#767676",
  },
  dark: {
    colorScheme: "dark",
    ["--background" as string]: "#121212",
    ["--card" as string]: "#1b1b1b",
    ["--foreground" as string]: "#ffffff",
    ["--muted" as string]: "rgba(255, 255, 255, 0.06)",
    ["--muted-foreground" as string]: "rgba(202, 202, 202, 0.7)",
    ["--border" as string]: "rgba(255, 255, 255, 0.07)",
    ["--ring" as string]: "#8f8f8f",
  },
};

const SHELL_SPRING = {
  type: "spring",
  duration: 0.58,
  bounce: 0.06,
} as const;

const TAB_CHANGE_SPRING = {
  type: "spring",
  duration: 0.46,
  bounce: 0.04,
} as const;

const LABEL_OPEN = {
  type: "spring",
  duration: 0.38,
  bounce: 0.03,
} as const;

const LABEL_CLOSE = {
  duration: 0.16,
  ease: EASE_OUT,
} as const;

const CONTENT_SPRING = {
  type: "spring",
  duration: 0.46,
  bounce: 0.08,
} as const;

const BAR_H = 52;
const TAB_W = 32;
const BAR_X = 16;
const BAR_GAP = 4;
const ROOT_BORDER = 2;
const ICON_W = 16;
const ACTIVE_LEFT_PAD = 10;
const ACTIVE_RIGHT_PAD = 16;
const LABEL_GAP = 7;
const PANEL_DOCK_GAP = 4;

const CONTENT_VARIANTS: Variants = {
  enter: {
    y: -8,
    scale: 0.98,
    opacity: 0,
    filter: "blur(4px)",
  },
  center: {
    y: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: {
    y: -6,
    scale: 0.98,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.08,
      ease: EASE_OUT,
    },
  },
};

const REDUCED_CONTENT_VARIANTS: Variants = {
  enter: { opacity: 0, filter: "blur(0px)" },
  center: { opacity: 1, filter: "blur(0px)" },
  exit: {
    opacity: 0,
    filter: "blur(0px)",
    transition: { duration: 0.08, ease: EASE_OUT },
  },
};

function sameSize(a: Size | null | undefined, b: Size | null | undefined) {
  return a?.width === b?.width && a?.height === b?.height;
}

function sameWidths(a: Record<string, number>, b: Record<string, number>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

function useContentSize() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<Size | null>(null);

  // Measure unscaled DOM offset dimensions so ancestor CSS transforms never skew open bounds
  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const next = { width: el.offsetWidth, height: el.offsetHeight };
    setSize((current) => (sameSize(current, next) ? current : next));
  }, []);

  useIsomorphicLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  return [ref, size] as const;
}

function useLabelWidths(items: ExpandableTabsItem[]) {
  const refs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [widths, setWidths] = useState<Record<string, number>>({});

  const setLabelMeasureRef = useCallback(
    (id: string) => (node: HTMLSpanElement | null) => {
      refs.current[id] = node;
    },
    [],
  );

  const measure = useCallback(() => {
    const next: Record<string, number> = {};
    for (const item of items) {
      const node = refs.current[item.id];
      if (node) next[item.id] = Math.ceil(node.offsetWidth);
    }
    setWidths((current) => (sameWidths(current, next) ? current : next));
  }, [items]);

  useIsomorphicLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    let active = true;
    document.fonts?.ready.then(() => {
      if (active) measure();
    });
    if (typeof ResizeObserver === "undefined") {
      return () => {
        active = false;
      };
    }
    const observer = new ResizeObserver(measure);
    for (const item of items) {
      const node = refs.current[item.id];
      if (node) observer.observe(node);
    }
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [items, measure]);

  return { setLabelMeasureRef, widths };
}

/**
 * Bottom-docked expandable navigation pill that opens upward with measured
 * dynamic content sizing and spring-expanding tab labels.
 */
export function ExpandableTabs({
  items,
  value,
  defaultValue = null,
  onValueChange,
  closeOnOutsideClick = true,
  theme = "light",
  className,
  classNames,
}: ExpandableTabsProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [sizerRef, size] = useContentSize();
  const { setLabelMeasureRef, widths: labelWidths } = useLabelWidths(items);

  const controlled = value !== undefined;
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const activeId = controlled ? value : internal;
  const active = items.find((item) => item.id === activeId) ?? null;
  const visualActiveId = active?.id ?? null;

  const setActive = useCallback(
    (next: string | null, reason: ExpandableTabsChangeReason = "tab") => {
      if (!controlled) setInternal(next);
      onValueChange?.(next, reason);
    },
    [controlled, onValueChange],
  );

  useEffect(() => {
    if (!visualActiveId) return;

    const onPointer = (e: PointerEvent) => {
      if (!closeOnOutsideClick) return;
      if (!rootRef.current?.contains(e.target as Node)) {
        setActive(null, "outside");
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null, "escape");
      }
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [closeOnOutsideClick, setActive, visualActiveId]);

  const closedSize: Size = {
    width:
      items.length * TAB_W +
      Math.max(0, items.length - 1) * BAR_GAP +
      BAR_X +
      ROOT_BORDER,
    height: BAR_H + ROOT_BORDER,
  };

  const openSize: Size = size
    ? {
        width: Math.max(size.width + ROOT_BORDER, closedSize.width),
        height: Math.max(size.height + ROOT_BORDER, closedSize.height),
      }
    : closedSize;

  const targetSize = active ? openSize : closedSize;

  const getActiveTabWidth = useCallback(
    (item: ExpandableTabsItem) =>
      Math.max(
        TAB_W,
        ACTIVE_LEFT_PAD +
          ICON_W +
          LABEL_GAP +
          (labelWidths[item.id] ?? 0) +
          ACTIVE_RIGHT_PAD,
      ),
    [labelWidths],
  );

  return (
    <>
      <motion.div
        ref={rootRef}
        data-slot="expandable-tabs"
        data-theme={theme}
        initial={false}
        animate={{ width: targetSize.width, height: targetSize.height }}
        transition={reduce ? { duration: 0 } : SHELL_SPRING}
        style={{
          ...THEME_TOKEN_STYLES[theme],
          transformOrigin: "bottom center",
        }}
        className={cn(
          theme,
          "relative overflow-hidden rounded-[26px] border border-border bg-card text-foreground",
          className,
          classNames?.root,
        )}
      >
        <div
          ref={sizerRef}
          aria-hidden="true"
          className={cn(
            "pointer-events-none invisible absolute top-0 left-0 grid w-max px-2 pt-2",
            classNames?.panel,
          )}
          style={{ paddingBottom: BAR_H + PANEL_DOCK_GAP }}
        >
          {items.map((item) => (
            <div key={item.id} className="col-start-1 row-start-1 w-max">
              {item.content}
            </div>
          ))}
        </div>

        <div
          className={cn(
            "absolute top-0 right-0 left-0 z-10 overflow-hidden px-2 pt-2",
            classNames?.panel,
          )}
          style={{ bottom: BAR_H + PANEL_DOCK_GAP }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {active ? (
              <motion.div
                key={active.id}
                variants={reduce ? REDUCED_CONTENT_VARIANTS : CONTENT_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={
                  reduce ? { duration: 0.15, ease: EASE_OUT } : CONTENT_SPRING
                }
                className="w-max"
                style={{
                  transformOrigin: "top center",
                  willChange: "transform, opacity, filter",
                }}
              >
                {active.content}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div
          role="tablist"
          aria-label="Navigation tabs"
          aria-orientation="horizontal"
          className={cn(
            "absolute bottom-0 left-0 z-20 flex w-full items-center justify-between gap-1 p-2",
            classNames?.bar,
          )}
          style={{ height: BAR_H }}
        >
          {items.map((item) => {
            const isActive = item.id === visualActiveId;
            const activeTabWidth = getActiveTabWidth(item);
            const labelWidth = labelWidths[item.id] ?? 0;

            return (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={item.label}
                onClick={() => setActive(isActive ? null : item.id, "tab")}
                layout={reduce ? false : "position"}
                animate={{
                  width: active && isActive ? activeTabWidth : TAB_W,
                }}
                transition={reduce ? { duration: 0 } : TAB_CHANGE_SPRING}
                className={cn(
                  "relative isolate flex h-9 min-w-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[18px] px-2 text-sm font-medium outline-none active:scale-100",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active && isActive && "min-w-0 justify-start pr-4 pl-2.5",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  classNames?.tab,
                  isActive && classNames?.activeTab,
                )}
              >
                {isActive ? (
                  <span
                    className={cn(
                      "absolute inset-0 -z-10 rounded-[18px] bg-foreground/10",
                      classNames?.pill,
                    )}
                  />
                ) : null}

                <span
                  className={cn(
                    "grid shrink-0 place-items-center",
                    classNames?.icon,
                  )}
                >
                  {item.icon}
                </span>

                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{
                    width: isActive ? labelWidth : 0,
                    opacity: isActive ? 1 : 0,
                    marginLeft: isActive ? LABEL_GAP : 0,
                    filter: reduce || isActive ? "blur(0px)" : "blur(3px)",
                  }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : isActive
                        ? LABEL_OPEN
                        : LABEL_CLOSE
                  }
                  className={cn(
                    "inline-block overflow-hidden whitespace-nowrap",
                    classNames?.label,
                  )}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 -z-10 flex opacity-0"
      >
        {items.map((item) => (
          <span
            key={item.id}
            ref={setLabelMeasureRef(item.id)}
            className={cn(
              "text-sm leading-none font-medium whitespace-nowrap",
              classNames?.label,
            )}
          >
            {item.label}
          </span>
        ))}
      </div>
    </>
  );
}

export default ExpandableTabs;
