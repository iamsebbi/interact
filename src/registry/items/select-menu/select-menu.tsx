"use client";

import { Listbox, ListboxItem } from "@ui-sdk/react/listbox";
import {
  type AnimationPlaybackControls,
  animate,
  MotionConfig,
  type MotionValue,
  motion,
  motionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type SelectMenuSize = "sm" | "md" | "lg" | "xl";
export type SelectMenuTheme = "light" | "dark";

export interface SelectMenuItemObject {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectMenuOption = string | SelectMenuItemObject;

export interface SelectMenuProps {
  items: readonly SelectMenuOption[];
  label?: string;
  value?: string;
  defaultValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onValueChange?: (value: string, index: number) => void;
  onOpenChange?: (open: boolean) => void;
  size?: SelectMenuSize;
  theme?: SelectMenuTheme;
  /** Scales spring bounce / overshoot (0 to 1.6). */
  bounce?: number;
  /** Scales overall spring speed and choreography timing (0.5 to 2). */
  speed?: number;
  /** Scales transition blur intensity on rows, prefix, and icons (0 to 2). */
  blur?: number;
  showTray?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

interface SizePreset {
  rowHeight: number;
  pad: number;
  fontSize: number;
  iconSize: number;
}

const SIZE_PRESETS: Record<SelectMenuSize, SizePreset> = {
  sm: { rowHeight: 36, pad: 4, fontSize: 13, iconSize: 15 },
  md: { rowHeight: 44, pad: 5, fontSize: 15, iconSize: 18 },
  lg: { rowHeight: 50, pad: 5, fontSize: 16.5, iconSize: 20.5 },
  xl: { rowHeight: 54, pad: 6, fontSize: 18, iconSize: 22 },
};

type SpringName = "pop" | "morph" | "snap" | "settle" | "press";

const SPRING_PRESETS: Record<SpringName, readonly [number, number]> = {
  pop: [0.5, 0.5],
  morph: [0.4, 0.36],
  snap: [0.38, 0.25],
  settle: [0.32, 0.2],
  press: [0.26, 0.4],
};

function perceptualSpring(
  name: SpringName,
  speed: number,
  bounceScale: number,
) {
  const [basePeriod, baseBounce] = SPRING_PRESETS[name];
  const period = basePeriod / Math.max(0.25, speed);
  const clampedBounce = Math.min(0.85, Math.max(0, baseBounce * bounceScale));
  const stiffness = ((2 * Math.PI) / period) ** 2;
  const damping = (4 * Math.PI * (1 - clampedBounce)) / period;
  return { type: "spring" as const, stiffness, damping, mass: 1 };
}

function normalizeItems(
  items: readonly SelectMenuOption[],
): SelectMenuItemObject[] {
  const seen = new Set<string>();
  const normalized: SelectMenuItemObject[] = [];
  for (const item of items) {
    const raw =
      typeof item === "string"
        ? { value: item, label: item, disabled: false }
        : {
            value: item.value,
            label: item.label,
            disabled: Boolean(item.disabled),
          };
    const key = raw.value.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    normalized.push({ ...raw, value: key });
  }
  return normalized.length > 0
    ? normalized
    : [{ value: "Newest", label: "Newest", disabled: false }];
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

interface RowMotion {
  p: MotionValue<number>;
  x: MotionValue<number>;
}

interface SelectRowProps {
  id: string;
  value: string;
  label: string;
  index: number;
  disabled: boolean;
  isSelected: boolean;
  isOpen: boolean;
  rowHeight: number;
  pad: number;
  edgePad: number;
  textRightReserve: number;
  blurScale: number;
  reduceMotion: boolean;
  isDark: boolean;
  contentY: MotionValue<number>;
  trayW: MotionValue<number>;
  rowMotion: RowMotion;
  onHover: (index: number) => void;
  onPick: (index: number) => void;
}

function SelectRow({
  id,
  value,
  label,
  index,
  disabled,
  isSelected,
  isOpen,
  rowHeight,
  pad,
  edgePad,
  textRightReserve,
  blurScale,
  reduceMotion,
  isDark,
  contentY,
  trayW,
  rowMotion,
  onHover,
  onPick,
}: SelectRowProps) {
  const y = useTransform(contentY, (c) => c + pad + index * rowHeight);
  const rowWidth = useTransform(trayW, (w) => Math.max(0, w - 2 * pad));
  const opacity = useTransform(rowMotion.p, (p) => clamp(p, 0, 1));
  const scale = useTransform(rowMotion.p, (p) => 0.96 + 0.04 * clamp(p, 0, 1));
  const filter = useTransform(rowMotion.p, (p) => {
    if (reduceMotion || blurScale <= 0) return "none";
    const clamped = clamp(p, 0, 1);
    return clamped < 0.995
      ? `blur(${((1 - clamped) * 6 * blurScale).toFixed(2)}px)`
      : "none";
  });
  const closedVisibility = useTransform(rowMotion.p, (p) =>
    p < 0.004 ? "hidden" : "visible",
  );
  const textMaxWidth = useTransform([trayW, rowMotion.x], ([w, x]) =>
    Math.max(
      0,
      (w as number) - 2 * pad - edgePad - textRightReserve - (x as number) + 2,
    ),
  );

  return (
    <ListboxItem
      id={id}
      value={value}
      disabled={disabled}
      data-slot="select-menu-option"
      onPointerEnter={() => {
        if (isOpen && !disabled) onHover(index);
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (isOpen && !disabled) onPick(index);
      }}
      render={
        <motion.div
          style={{
            y,
            width: rowWidth,
            height: rowHeight,
            left: pad,
            paddingLeft: edgePad,
            opacity,
            scale,
            filter,
            visibility: isOpen ? "visible" : closedVisibility,
          }}
        />
      }
      className={cn(
        "absolute top-0 z-10 flex items-center overflow-hidden whitespace-nowrap font-medium select-none",
        isOpen && !disabled ? "cursor-pointer" : "pointer-events-none",
        disabled && "opacity-40",
        isSelected && "font-medium",
        isDark ? "text-[#f2f1ec]" : "text-[#1a1915]",
      )}
    >
      <motion.span
        style={{
          x: rowMotion.x,
          maxWidth: textMaxWidth,
        }}
        className="block min-w-0 overflow-x-clip whitespace-nowrap"
      >
        {label}
      </motion.span>
    </ListboxItem>
  );
}

export function SelectMenu({
  items,
  label = "Sort",
  value,
  defaultValue,
  open: openProp,
  defaultOpen = false,
  onValueChange,
  onOpenChange,
  size = "md",
  theme = "light",
  bounce = 1,
  speed = 1,
  blur = 1,
  showTray = true,
  disabled = false,
  name,
  className,
  style,
  "aria-label": ariaLabel,
}: SelectMenuProps) {
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const reduceMotion = Boolean(useReducedMotion());
  const preset = SIZE_PRESETS[size];
  const H = preset.rowHeight;
  const pad = preset.pad;
  const u = H / 44;
  const iconSize = preset.iconSize;
  const glyphPad = (H - iconSize) / 2;
  const inlineGap = H * 0.18;
  const edgePad = glyphPad + inlineGap;
  const textRightReserve = 12 * u + iconSize + glyphPad;
  const itemRadius = Math.max(6, H / 2);
  const trayRadius = Math.min(itemRadius + pad, H / 2 + pad);

  const clampedBounce = clamp(Number.isFinite(bounce) ? bounce : 1, 0, 1.6);
  const clampedSpeed = clamp(Number.isFinite(speed) ? speed : 1, 0.5, 2);
  const clampedBlur = clamp(Number.isFinite(blur) ? blur : 1, 0, 2);
  const isDark = theme === "dark";

  const normalizedItems = useMemo(() => normalizeItems(items), [items]);
  const itemsKey = useMemo(
    () => normalizedItems.map((i) => `${i.value}:${i.label}`).join("|"),
    [normalizedItems],
  );

  const resolveIndex = useCallback(
    (val: string | undefined) => {
      if (!val) return 0;
      const idx = normalizedItems.findIndex((item) => item.value === val);
      return Math.max(idx, 0);
    },
    [normalizedItems],
  );

  const isValueControlled = value !== undefined;
  const isOpenControlled = openProp !== undefined;

  const [internalIndex, setInternalIndex] = useState(() =>
    resolveIndex(defaultValue),
  );
  const selectedIndex = isValueControlled
    ? resolveIndex(value)
    : clamp(internalIndex, 0, normalizedItems.length - 1);

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;

  const [hoveredIndex, setHoveredIndex] = useState(selectedIndex);
  const [lifted, setLifted] = useState(isOpen);
  const [prefixHidden, setPrefixHidden] = useState(isOpen);
  const [iconMode, setIconMode] = useState<"chevrons" | "check">(
    isOpen ? "check" : "chevrons",
  );
  const [closedHovered, setClosedHovered] = useState(false);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const trayRef = useRef<HTMLDivElement | null>(null);
  const measurePrefixRef = useRef<HTMLSpanElement | null>(null);
  const measureItemsRef = useRef<HTMLDivElement | null>(null);

  const timersRef = useRef<number[]>([]);
  const animsRef = useRef<Map<object, AnimationPlaybackControls>>(new Map());
  const metricsRef = useRef<{
    preW: number;
    optWs: number[];
    sig: string;
  }>({
    preW: label ? label.length * preset.fontSize * 0.58 + H * 0.2 : 0,
    optWs: normalizedItems.map(
      (item) => item.label.length * preset.fontSize * 0.56 + 4,
    ),
    sig: "",
  });

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const selRef = useRef(selectedIndex);
  const prevSelRef = useRef(selectedIndex);
  const prevOpenRef = useRef(isOpen);
  const hoveredRef = useRef(hoveredIndex);
  hoveredRef.current = hoveredIndex;
  const initializedRef = useRef(false);
  const closedBoxWidthRef = useRef<number | null>(null);
  const initialEstimatedClosedW =
    edgePad +
    metricsRef.current.preW +
    (metricsRef.current.optWs[selectedIndex] ?? 64) +
    12 * u +
    iconSize +
    glyphPad +
    2 * pad;
  const [boxWidth, setBoxWidth] = useState<number>(initialEstimatedClosedW);

  const rowMotionMapRef = useRef<Map<string, RowMotion>>(new Map());
  const rowMotions = normalizedItems.map((item, idx) => {
    let entry = rowMotionMapRef.current.get(item.value);
    if (!entry) {
      entry = {
        p: motionValue(idx === selectedIndex ? 1 : 0),
        x: motionValue(idx === selectedIndex ? metricsRef.current.preW : 0),
      };
      rowMotionMapRef.current.set(item.value, entry);
    }
    return entry;
  });

  const rowMotionsRef = useRef(rowMotions);
  rowMotionsRef.current = rowMotions;

  const trayW = useMotionValue(initialEstimatedClosedW);
  const trayH = useMotionValue(H + 2 * pad);
  const trayTop = useMotionValue(0);
  const contentY = useMotionValue(-selectedIndex * H);
  const hlY = useMotionValue(selectedIndex * H);
  const iconY = useMotionValue(selectedIndex * H);
  const prefixRowY = useMotionValue(selectedIndex * H);
  const trayScale = useMotionValue(1);

  const hlTranslateY = useTransform(
    [contentY, hlY],
    ([c, h]) => (c as number) + pad + (h as number),
  );
  const hlWidth = useTransform(trayW, (w) => Math.max(0, w - 2 * pad));
  const prefixTranslateY = useTransform(
    [contentY, prefixRowY],
    ([c, py]) => (c as number) + pad + (py as number),
  );
  const iconTranslateX = useTransform(
    trayW,
    (w) => w - pad - glyphPad - iconSize,
  );
  const iconTranslateY = useTransform(
    [contentY, iconY],
    ([c, iy]) => (c as number) + pad + (iy as number) + (H - iconSize) / 2,
  );
  const transformOrigin = useTransform(
    trayTop,
    (top) => `50% ${(pad + H / 2 - top).toFixed(1)}px`,
  );

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  const schedule = useCallback(
    (ms: number, fn: () => void) => {
      if (reduceMotion || ms <= 0) {
        fn();
        return;
      }
      const id = window.setTimeout(
        fn,
        Math.round(ms / Math.max(0.25, clampedSpeed)),
      );
      timersRef.current.push(id);
    },
    [clampedSpeed, reduceMotion],
  );

  const springTo = useCallback(
    (mv: MotionValue<number>, target: number, springName: SpringName) => {
      const existing = animsRef.current.get(mv);
      existing?.stop();
      if (reduceMotion) {
        mv.jump(target);
        animsRef.current.delete(mv);
        return;
      }
      const ctrl = animate(
        mv,
        target,
        perceptualSpring(springName, clampedSpeed, clampedBounce),
      );
      animsRef.current.set(mv, ctrl);
    },
    [clampedBounce, clampedSpeed, reduceMotion],
  );

  const jumpTo = useCallback((mv: MotionValue<number>, target: number) => {
    animsRef.current.get(mv)?.stop();
    animsRef.current.delete(mv);
    mv.jump(target);
  }, []);

  const stopAllAnimations = useCallback(() => {
    clearTimers();
    for (const ctrl of animsRef.current.values()) {
      ctrl.stop();
    }
    animsRef.current.clear();
  }, [clearTimers]);

  const measureGeometry = useCallback(() => {
    const preEl = measurePrefixRef.current;
    const listEl = measureItemsRef.current;
    if (!listEl) return false;

    const preW = label && preEl ? preEl.offsetWidth + H * 0.2 : 0;
    const spans = Array.from(listEl.children) as HTMLElement[];
    const optWs = normalizedItems.map((item, idx) => {
      const measured = spans[idx]?.offsetWidth ?? 0;
      return measured > 0
        ? measured
        : item.label.length * preset.fontSize * 0.56 + 4;
    });
    const sig = `${Math.round(preW * 10)}|${optWs.map((w) => Math.round(w * 10)).join(",")}|${H}|${pad}`;
    const changed = sig !== metricsRef.current.sig;
    metricsRef.current = { preW, optWs, sig };
    return changed;
  }, [H, label, normalizedItems, pad, preset.fontSize]);

  const pillWidthFor = useCallback(
    (idx: number) => {
      const { preW, optWs } = metricsRef.current;
      const valW = optWs[idx] ?? 0;
      return edgePad + preW + valW + 12 * u + iconSize + glyphPad;
    },
    [edgePad, glyphPad, iconSize, u],
  );

  const openWidth = useCallback(() => {
    const { optWs } = metricsRef.current;
    const maxW = Math.max(0, ...optWs);
    return Math.max(
      pillWidthFor(selRef.current),
      edgePad + maxW + 16 * u + iconSize + glyphPad,
    );
  }, [edgePad, glyphPad, iconSize, pillWidthFor, u]);

  const computeOpenTop = useCallback(
    (sel: number) => {
      const box = boxRef.current;
      if (!box || typeof window === "undefined") return -sel * H;
      const rect = box.getBoundingClientRect();
      const scale =
        box.offsetWidth > 0 && rect.width > 0
          ? rect.width / box.offsetWidth
          : 1;
      const roomAbove = Math.max(0, rect.top / scale - 8);
      const roomBelow = Math.max(
        0,
        (window.innerHeight - rect.bottom) / scale - 8,
      );
      let top = -Math.min(sel * H, roomAbove);
      const overflowBottom = top + normalizedItems.length * H - H - roomBelow;
      if (overflowBottom > 0) {
        top -= Math.min(overflowBottom, roomAbove + top);
      }
      return top;
    },
    [H, normalizedItems.length],
  );

  const runOpenChoreography = useCallback(
    (sel: number) => {
      clearTimers();
      const closedW = pillWidthFor(sel) + 2 * pad;
      closedBoxWidthRef.current = closedW;
      setBoxWidth(closedW);
      setLifted(true);
      setHoveredIndex(sel);
      setPrefixHidden(true);
      setIconMode("check");

      const top = computeOpenTop(sel);
      springTo(trayScale, 1, "settle");
      springTo(trayW, openWidth() + 2 * pad, "snap");

      const rows = rowMotionsRef.current;
      if (rows[sel]) {
        springTo(rows[sel].x, 0, "morph");
        springTo(rows[sel].p, 1, "pop");
      }

      schedule(50, () => {
        springTo(trayTop, top, "morph");
        springTo(contentY, 0, "morph");
        springTo(trayH, normalizedItems.length * H + 2 * pad, "morph");
      });

      rows.forEach((row, idx) => {
        if (idx === sel) return;
        schedule(100 + Math.abs(idx - sel) * 30, () => {
          springTo(row.p, 1, "pop");
        });
      });
    },
    [
      H,
      clearTimers,
      computeOpenTop,
      contentY,
      normalizedItems.length,
      openWidth,
      pad,
      pillWidthFor,
      schedule,
      springTo,
      trayH,
      trayScale,
      trayTop,
      trayW,
    ],
  );

  const runCloseChoreography = useCallback(
    (targetIdx: number) => {
      clearTimers();
      setHoveredIndex(targetIdx);
      const rows = rowMotionsRef.current;
      const nextClosedW = pillWidthFor(targetIdx) + 2 * pad;

      rows.forEach((row, idx) => {
        if (idx === targetIdx) {
          springTo(row.p, 1, "pop");
        } else {
          springTo(row.p, 0, "snap");
        }
      });

      jumpTo(prefixRowY, targetIdx * H);

      schedule(70, () => {
        springTo(trayTop, 0, "settle");
        springTo(contentY, -targetIdx * H, "settle");
        springTo(trayH, H + 2 * pad, "settle");
        springTo(hlY, targetIdx * H, "settle");
        springTo(iconY, targetIdx * H, "settle");
      });

      schedule(140, () => {
        springTo(trayW, nextClosedW, "settle");
        setIconMode("chevrons");
        if (rows[targetIdx]) {
          springTo(rows[targetIdx].x, metricsRef.current.preW, "morph");
        }
        setBoxWidth(nextClosedW);
      });

      schedule(250, () => {
        setPrefixHidden(false);
      });

      schedule(560, () => {
        if (!isOpenRef.current) setLifted(false);
      });
    },
    [
      H,
      clearTimers,
      contentY,
      hlY,
      iconY,
      jumpTo,
      pad,
      pillWidthFor,
      prefixRowY,
      schedule,
      springTo,
      trayH,
      trayTop,
      trayW,
    ],
  );

  const runClosedSelectChoreography = useCallback(
    (prevIdx: number, nextIdx: number) => {
      clearTimers();
      const rows = rowMotionsRef.current;
      const nextClosedW = pillWidthFor(nextIdx) + 2 * pad;

      if (rows[prevIdx]) {
        springTo(rows[prevIdx].p, 0, "snap");
        springTo(rows[prevIdx].x, 0, "snap");
      }
      if (rows[nextIdx]) {
        jumpTo(rows[nextIdx].x, metricsRef.current.preW);
        jumpTo(rows[nextIdx].p, 0);
        springTo(rows[nextIdx].p, 1, "pop");
      }

      springTo(contentY, -nextIdx * H, "snap");
      jumpTo(hlY, nextIdx * H);
      jumpTo(iconY, nextIdx * H);
      jumpTo(prefixRowY, nextIdx * H);
      springTo(trayW, nextClosedW, "morph");
      setBoxWidth(nextClosedW);
      setHoveredIndex(nextIdx);
    },
    [
      H,
      clearTimers,
      contentY,
      hlY,
      iconY,
      jumpTo,
      pad,
      pillWidthFor,
      prefixRowY,
      springTo,
      trayW,
    ],
  );

  const snapClosedGeometry = useCallback(
    (sel: number) => {
      const closedW = pillWidthFor(sel) + 2 * pad;
      const rows = rowMotionsRef.current;
      jumpTo(trayW, closedW);
      jumpTo(trayH, H + 2 * pad);
      jumpTo(trayTop, 0);
      jumpTo(contentY, -sel * H);
      jumpTo(hlY, sel * H);
      jumpTo(iconY, sel * H);
      jumpTo(prefixRowY, sel * H);
      rows.forEach((row, idx) => {
        jumpTo(row.p, idx === sel ? 1 : 0);
        jumpTo(row.x, idx === sel ? metricsRef.current.preW : 0);
      });
      setBoxWidth(closedW);
    },
    [
      H,
      contentY,
      hlY,
      iconY,
      jumpTo,
      pad,
      pillWidthFor,
      prefixRowY,
      trayH,
      trayTop,
      trayW,
    ],
  );

  const setOpenState = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  const hoverRow = useCallback(
    (idx: number) => {
      if (idx === hoveredRef.current) return;
      setHoveredIndex(idx);
      springTo(hlY, idx * H, "snap");
    },
    [H, hlY, springTo],
  );

  const commitClose = useCallback(
    (targetIdx: number) => {
      if (!isOpenRef.current) return;
      const prevIdx = selRef.current;
      selRef.current = targetIdx;
      prevSelRef.current = targetIdx;
      prevOpenRef.current = false;

      if (!isValueControlled) setInternalIndex(targetIdx);
      setOpenState(false);
      runCloseChoreography(targetIdx);

      if (targetIdx !== prevIdx) {
        const chosen = normalizedItems[targetIdx];
        if (chosen) onValueChange?.(chosen.value, targetIdx);
      }
    },
    [
      isValueControlled,
      normalizedItems,
      onValueChange,
      runCloseChoreography,
      setOpenState,
    ],
  );

  const pickRow = useCallback(
    (idx: number) => {
      if (!isOpenRef.current) return;
      if (idx === selRef.current) {
        commitClose(idx);
        return;
      }
      hoverRow(idx);
      springTo(iconY, idx * H, "snap");
      schedule(140, () => {
        commitClose(idx);
      });
    },
    [H, commitClose, hoverRow, iconY, schedule, springTo],
  );

  const openMenu = useCallback(() => {
    if (disabled || isOpenRef.current) return;
    prevOpenRef.current = true;
    setOpenState(true);
    runOpenChoreography(selRef.current);
  }, [disabled, runOpenChoreography, setOpenState]);

  // Sync initial layout and react to external controlled `open` / `value` / `size` / `items` changes.
  useIsomorphicLayoutEffect(() => {
    measureGeometry();

    if (!initializedRef.current) {
      initializedRef.current = true;
      selRef.current = selectedIndex;
      prevSelRef.current = selectedIndex;
      prevOpenRef.current = isOpen;
      snapClosedGeometry(selectedIndex);
      if (isOpen) {
        runOpenChoreography(selectedIndex);
      }
      return;
    }

    const openChanged = prevOpenRef.current !== isOpen;
    const selChanged = prevSelRef.current !== selectedIndex;
    const prevSel = prevSelRef.current;

    selRef.current = selectedIndex;
    prevSelRef.current = selectedIndex;
    prevOpenRef.current = isOpen;

    if (openChanged) {
      if (isOpen) {
        runOpenChoreography(selectedIndex);
      } else {
        runCloseChoreography(selectedIndex);
      }
      return;
    }

    if (selChanged) {
      if (isOpen) {
        hoverRow(selectedIndex);
        springTo(iconY, selectedIndex * H, "snap");
      } else {
        runClosedSelectChoreography(prevSel, selectedIndex);
      }
    }
  }, [
    H,
    hoverRow,
    iconY,
    isOpen,
    measureGeometry,
    runCloseChoreography,
    runClosedSelectChoreography,
    runOpenChoreography,
    selectedIndex,
    snapClosedGeometry,
    springTo,
  ]);

  // Re-snap geometry when size, items, or label change — never on selection/open state.
  useIsomorphicLayoutEffect(() => {
    if (!initializedRef.current) return;
    const changed = measureGeometry();
    if (!changed) return;
    if (isOpenRef.current) {
      jumpTo(trayW, openWidth() + 2 * pad);
      jumpTo(trayH, normalizedItems.length * H + 2 * pad);
      jumpTo(trayTop, computeOpenTop(selRef.current));
    } else {
      snapClosedGeometry(selRef.current);
    }
  }, [
    H,
    computeOpenTop,
    itemsKey,
    jumpTo,
    label,
    measureGeometry,
    normalizedItems.length,
    openWidth,
    pad,
    snapClosedGeometry,
    trayH,
    trayTop,
    trayW,
  ]);

  // Sync after webfonts finish loading if glyph widths changed.
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      const changed = measureGeometry();
      if (!changed) return;
      if (isOpenRef.current) {
        springTo(trayW, openWidth() + 2 * pad, "morph");
      } else {
        snapClosedGeometry(selRef.current);
      }
    });
    return () => {
      alive = false;
    };
  }, [measureGeometry, openWidth, pad, snapClosedGeometry, springTo, trayW]);

  // Dismiss on outside pointerdown.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!isOpenRef.current) return;
      const root = boxRef.current;
      if (root && !event.composedPath().includes(root)) {
        commitClose(selRef.current);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [commitClose]);

  useEffect(() => stopAllAnimations, [stopAllAnimations]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const count = normalizedItems.length;

    if (!isOpenRef.current) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const dir = event.key === "ArrowDown" ? 1 : -1;
      for (let step = 1; step <= count; step++) {
        const candidate = (hoveredRef.current + dir * step + count) % count;
        if (!normalizedItems[candidate]?.disabled) {
          hoverRow(candidate);
          break;
        }
      }
    } else if (event.key === "Home") {
      event.preventDefault();
      const first = normalizedItems.findIndex((i) => !i.disabled);
      if (first >= 0) hoverRow(first);
    } else if (event.key === "End") {
      event.preventDefault();
      for (let idx = count - 1; idx >= 0; idx--) {
        if (!normalizedItems[idx]?.disabled) {
          hoverRow(idx);
          break;
        }
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!normalizedItems[hoveredRef.current]?.disabled) {
        pickRow(hoveredRef.current);
      }
    } else if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") event.preventDefault();
      commitClose(selRef.current);
    }
  };

  const currentItem = normalizedItems[selectedIndex];
  const computedAriaLabel =
    ariaLabel ??
    (label
      ? `${label}: ${currentItem?.label ?? ""}`
      : (currentItem?.label ?? "Select"));

  const closedHoverScale = () => {
    const w = Math.max(1, trayW.get());
    return 1 + Math.min(0.06 * w, 3) / w;
  };
  const closedPressScale = () => {
    const w = Math.max(1, trayW.get());
    return 1 + Math.min(0.14 * w, 7) / w;
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={boxRef}
        data-slot="select-menu"
        data-theme={theme}
        data-size={size}
        data-open={isOpen ? "true" : "false"}
        className={cn(
          "relative inline-block select-none align-middle tabular-nums",
          disabled && "pointer-events-none opacity-55",
          className,
        )}
        style={{
          width: boxWidth,
          height: H + 2 * pad,
          fontSize: preset.fontSize,
          lineHeight: 1.2,
          zIndex: lifted ? 60 : undefined,
          ...style,
        }}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            value={currentItem?.value ?? ""}
            disabled={disabled}
          />
        )}

        {/* Hidden DOM sizers inherit exact font metrics without ancestor scale distortion. */}
        <div
          aria-hidden="true"
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-nowrap"
          style={{ fontSize: preset.fontSize }}
        >
          <span ref={measurePrefixRef} className="inline-block font-[450]">
            {label}
          </span>
          <div ref={measureItemsRef} className="inline-flex">
            {normalizedItems.map((item) => (
              <span key={item.value} className="inline-block font-medium">
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          ref={trayRef}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen ? `${baseId}-opt-${hoveredIndex}` : undefined
          }
          aria-label={computedAriaLabel}
          aria-disabled={disabled || undefined}
          data-slot="select-menu-tray"
          onKeyDown={handleKeyDown}
          onClick={(event) => {
            if (disabled) return;
            if (isOpenRef.current) {
              if (event.target === trayRef.current) {
                commitClose(selRef.current);
              }
            } else {
              openMenu();
            }
          }}
          onPointerEnter={(event) => {
            if (disabled || isOpenRef.current) return;
            if (event.pointerType === "mouse") {
              setClosedHovered(true);
              springTo(trayScale, closedHoverScale(), "morph");
            }
          }}
          onPointerLeave={() => {
            setClosedHovered(false);
            if (!isOpenRef.current) {
              springTo(trayScale, 1, "pop");
            }
          }}
          onPointerDown={() => {
            if (disabled || isOpenRef.current) return;
            springTo(trayScale, closedPressScale(), "press");
          }}
          onPointerUp={() => {
            if (!isOpenRef.current) {
              springTo(
                trayScale,
                closedHovered ? closedHoverScale() : 1,
                "pop",
              );
            }
          }}
          onPointerCancel={() => {
            if (!isOpenRef.current) {
              springTo(trayScale, 1, "pop");
            }
          }}
          style={{
            width: trayW,
            height: trayH,
            y: trayTop,
            scale: trayScale,
            borderRadius: trayRadius,
            transformOrigin,
          }}
          className={cn(
            "absolute top-0 left-0 cursor-pointer overflow-hidden outline-none will-change-[transform,width,height]",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            isDark
              ? "focus-visible:ring-[#6e88ff]/60 focus-visible:ring-offset-[#252420]"
              : "focus-visible:ring-[#3355ff]/55 focus-visible:ring-offset-white",
            showTray
              ? isDark
                ? "bg-[#252420] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_1px_1px_rgba(0,0,0,0.3),0_6px_16px_-6px_rgba(0,0,0,0.45),0_22px_44px_-24px_rgba(0,0,0,0.6)]"
                : "bg-white shadow-[0_0_0_1px_rgba(26,25,21,0.06),0_1px_1px_rgba(26,25,21,0.04),0_6px_16px_-6px_rgba(26,25,21,0.1),0_22px_44px_-24px_rgba(26,25,21,0.16)]"
              : "bg-transparent shadow-none",
          )}
        >
          {/* Sliding row highlight pill */}
          <motion.div
            aria-hidden="true"
            data-slot="select-menu-highlight"
            style={{
              left: pad,
              width: hlWidth,
              height: H,
              y: hlTranslateY,
              borderRadius: itemRadius,
            }}
            className={cn(
              "pointer-events-none absolute top-0 z-0 transition-colors duration-200",
              isDark
                ? closedHovered && !isOpen
                  ? "bg-[#3c3b35]"
                  : "bg-[#36352f]"
                : closedHovered && !isOpen
                  ? "bg-[#e8e6e0]"
                  : "bg-[#efeee9]",
            )}
          />

          {/* Muted prefix label ("Sort") */}
          {label && (
            <motion.span
              aria-hidden="true"
              data-slot="select-menu-prefix"
              style={{
                x: pad + edgePad,
                y: prefixTranslateY,
                height: H,
                filter:
                  prefixHidden && !reduceMotion && clampedBlur > 0
                    ? `blur(${(5 * clampedBlur).toFixed(1)}px)`
                    : "none",
              }}
              className={cn(
                "pointer-events-none absolute top-0 left-0 z-10 flex items-center whitespace-nowrap font-[450] transition-[opacity,filter]",
                prefixHidden
                  ? "opacity-0 duration-100"
                  : "opacity-100 duration-200",
                isDark ? "text-[#a09d93]" : "text-[#8d8a81]",
              )}
            >
              {label}
            </motion.span>
          )}

          {/* Options stack backed by @ui-sdk/react/listbox */}
          <Listbox
            id={listboxId}
            aria-label={label || "Options"}
            value={normalizedItems[selectedIndex]?.value}
            onValueChange={(nextVal) => {
              const nextIdx = normalizedItems.findIndex(
                (item) => item.value === nextVal,
              );
              const chosen = normalizedItems[nextIdx];
              if (nextIdx < 0 || !chosen || chosen.disabled) return;
              if (isOpenRef.current) {
                pickRow(nextIdx);
                return;
              }
              if (nextIdx === selRef.current) return;
              selRef.current = nextIdx;
              prevSelRef.current = nextIdx;
              if (!isValueControlled) setInternalIndex(nextIdx);
              snapClosedGeometry(nextIdx);
              onValueChange?.(chosen.value, nextIdx);
            }}
            virtualFocus
          >
            {normalizedItems.map((item, idx) => (
              <SelectRow
                key={item.value}
                id={`${baseId}-opt-${idx}`}
                value={item.value}
                label={item.label}
                index={idx}
                disabled={Boolean(item.disabled)}
                isSelected={idx === selectedIndex}
                isOpen={isOpen}
                rowHeight={H}
                pad={pad}
                edgePad={edgePad}
                textRightReserve={textRightReserve}
                blurScale={clampedBlur}
                reduceMotion={reduceMotion}
                isDark={isDark}
                contentY={contentY}
                trayW={trayW}
                rowMotion={rowMotions[idx]}
                onHover={hoverRow}
                onPick={pickRow}
              />
            ))}
          </Listbox>

          {/* Right icon morphing smoothly between Chevrons (closed) and Checkmark (open) */}
          <motion.span
            aria-hidden="true"
            data-slot="select-menu-icon"
            style={{
              x: iconTranslateX,
              y: iconTranslateY,
              width: iconSize,
              height: iconSize,
            }}
            className={cn(
              "pointer-events-none absolute top-0 left-0 z-20 inline-block transition-colors duration-200",
              iconMode === "check"
                ? isDark
                  ? "text-[#f2f1ec]"
                  : "text-[#1a1915]"
                : isDark
                  ? "text-[#a09d93]"
                  : "text-[#8d8a81]",
            )}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{
                opacity: iconMode === "chevrons" ? 1 : 0,
                scale: iconMode === "chevrons" ? 1 : 0.4,
                rotate: iconMode === "chevrons" ? 0 : 25,
                filter:
                  iconMode === "chevrons" || reduceMotion || clampedBlur <= 0
                    ? "blur(0px)"
                    : `blur(${(4 * clampedBlur).toFixed(1)}px)`,
              }}
              transition={perceptualSpring("pop", clampedSpeed, clampedBounce)}
              className="absolute inset-0 h-full w-full"
            >
              <path d="M8.2 9.6L12 5.8l3.8 3.8M8.2 14.4L12 18.2l3.8-3.8" />
            </motion.svg>

            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{
                opacity: iconMode === "check" ? 1 : 0,
                scale: iconMode === "check" ? 1 : 0.4,
                rotate: iconMode === "check" ? 0 : -40,
                filter:
                  iconMode === "check" || reduceMotion || clampedBlur <= 0
                    ? "blur(0px)"
                    : `blur(${(4 * clampedBlur).toFixed(1)}px)`,
              }}
              transition={perceptualSpring("pop", clampedSpeed, clampedBounce)}
              className="absolute inset-0 h-full w-full"
            >
              <path d="M5.5 12.6l4.2 4.2 8.8-9.3" />
            </motion.svg>
          </motion.span>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
