"use client";

import {
  SegmentedControlItem as SegmentedControlItemPrimitive,
  SegmentedControl as SegmentedControlPrimitive,
  type SegmentedControlValueChangeReason,
} from "@ui-sdk/react/segmented-control";
import {
  type AnimationPlaybackControls,
  animate,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type SegmentedControlSize = "sm" | "md" | "lg" | "xl";
export type SegmentedControlTheme = "light" | "dark";

export interface SegmentedControlItemObject {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SegmentedControlOption = string | SegmentedControlItemObject;

export interface SegmentedControlChangeDetails {
  reason: SegmentedControlValueChangeReason;
  source?: string;
  cancel: () => void;
  canceled: boolean;
}

export interface SegmentedControlProps {
  items: readonly SegmentedControlOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (
    value: string | null,
    details: SegmentedControlChangeDetails,
  ) => void;
  size?: SegmentedControlSize;
  theme?: SegmentedControlTheme;
  /** Scales the trailing-edge delay (0 = rigid slide, 1 = 55ms elastic stretch, 2 = 110ms). */
  stretch?: number;
  /** Scales spring bounce / overshoot (0 = critically damped, 1 = default elastic, 1.6 = playful). */
  bounce?: number;
  /** Scales overall spring speed (0.5 = slow motion, 1 = default, 2 = snappy). */
  speed?: number;
  showTray?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  loop?: boolean;
  name?: string;
  form?: string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

interface SizePreset {
  height: number;
  inset: number;
  itemPx: number;
  fontSize: number;
  tracking: string;
}

const SIZE_PRESETS: Record<SegmentedControlSize, SizePreset> = {
  sm: {
    height: 36,
    inset: 4,
    itemPx: 13,
    fontSize: 13,
    tracking: "-0.006em",
  },
  md: {
    height: 44,
    inset: 5,
    itemPx: 16,
    fontSize: 14,
    tracking: "-0.008em",
  },
  lg: {
    height: 50,
    inset: 5,
    itemPx: 18,
    fontSize: 15,
    tracking: "-0.01em",
  },
  xl: {
    height: 56,
    inset: 6,
    itemPx: 21,
    fontSize: 16,
    tracking: "-0.012em",
  },
};

const BASE_TRAIL_DELAY_MS = 55;

function perceptualSpring(
  basePeriod: number,
  baseBounce: number,
  speed: number,
  bounceScale: number,
) {
  const period = basePeriod / Math.max(0.25, speed);
  const clampedBounce = Math.min(0.85, Math.max(0, baseBounce * bounceScale));
  const stiffness = ((2 * Math.PI) / period) ** 2;
  const damping = (4 * Math.PI * (1 - clampedBounce)) / period;
  return { type: "spring" as const, stiffness, damping, mass: 1 };
}

function normalizeItems(
  items: readonly SegmentedControlOption[],
): SegmentedControlItemObject[] {
  const seen = new Set<string>();
  const normalized: SegmentedControlItemObject[] = [];
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
  return normalized;
}

export function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  size = "xl",
  theme = "light",
  stretch = 1,
  bounce = 1,
  speed = 1,
  showTray = true,
  disabled = false,
  readOnly = false,
  required = false,
  loop = true,
  name,
  form,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SegmentedControlProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const preset = SIZE_PRESETS[size];
  const clampedStretch = Math.max(
    0,
    Math.min(2, Number.isFinite(stretch) ? stretch : 1),
  );
  const clampedBounce = Math.max(
    0,
    Math.min(1.6, Number.isFinite(bounce) ? bounce : 1),
  );
  const clampedSpeed = Math.max(
    0.5,
    Math.min(2, Number.isFinite(speed) ? speed : 1),
  );
  const isDark = theme === "dark";

  const normalizedItems = useMemo(() => normalizeItems(items), [items]);
  const itemsKey = useMemo(
    () => normalizedItems.map((i) => `${i.value}:${i.label}`).join("|"),
    [normalizedItems],
  );
  const firstEnabledValue = useMemo(
    () => normalizedItems.find((item) => !item.disabled)?.value ?? null,
    [normalizedItems],
  );

  const isControlled = value !== undefined;
  const initialUncontrolled =
    defaultValue !== undefined ? defaultValue : firstEnabledValue;
  const [internalValue, setInternalValue] = useState<string | null>(
    initialUncontrolled,
  );
  const activeValue = isControlled ? (value ?? null) : internalValue;
  const activeValueRef = useRef<string | null>(activeValue);
  activeValueRef.current = activeValue;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const prevBoxRef = useRef<{ left: number; right: number } | null>(null);
  const prevActiveValueRef = useRef<string | null>(activeValue);
  const lastGeometrySigRef = useRef<string>("");
  const leftAnimRef = useRef<AnimationPlaybackControls | null>(null);
  const rightAnimRef = useRef<AnimationPlaybackControls | null>(null);
  const trailTimerRef = useRef<number | null>(null);

  const leftEdge = useMotionValue(0);
  const rightEdge = useMotionValue(0);
  const indicatorWidth = useTransform([leftEdge, rightEdge], ([l, r]) =>
    Math.max(0, (r as number) - (l as number)),
  );
  const [indicatorReady, setIndicatorReady] = useState(false);

  const hoverSpring = useMemo(
    () => perceptualSpring(0.4, 0.36, clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const pressSpring = useMemo(
    () => perceptualSpring(0.26, 0.4, clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const popSpring = useMemo(
    () => perceptualSpring(0.5, 0.5, clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [pressedValue, setPressedValue] = useState<string | null>(null);

  const stopMotion = useCallback(() => {
    if (trailTimerRef.current !== null) {
      window.clearTimeout(trailTimerRef.current);
      trailTimerRef.current = null;
    }
    leftAnimRef.current?.stop();
    leftAnimRef.current = null;
    rightAnimRef.current?.stop();
    rightAnimRef.current = null;
  }, []);

  const getItemElements = useCallback((): HTMLButtonElement[] => {
    const root = rootRef.current;
    if (!root) return [];
    return Array.from(
      root.querySelectorAll<HTMLButtonElement>(
        '[data-slot="segmented-control-item"]',
      ),
    );
  }, []);

  const readBoxFor = useCallback(
    (targetValue: string | null): { left: number; right: number } | null => {
      if (!targetValue) return null;
      const el = getItemElements().find(
        (node) => node.dataset.segmentValue === targetValue,
      );
      if (!el) return null;
      // offsetLeft/offsetWidth stay in unscaled CSS pixels when an ancestor applies transform: scale().
      return {
        left: el.offsetLeft,
        right: el.offsetLeft + el.offsetWidth,
      };
    },
    [getItemElements],
  );

  const computeGeometrySig = useCallback(() => {
    const parts: string[] = [];
    for (const el of getItemElements()) {
      parts.push(
        `${el.dataset.segmentValue ?? ""}:${el.offsetLeft}:${el.offsetWidth}`,
      );
    }
    return parts.join("|");
  }, [getItemElements]);

  const jumpIndicator = useCallback(
    (box: { left: number; right: number }) => {
      stopMotion();
      leftEdge.jump(box.left);
      rightEdge.jump(box.right);
      prevBoxRef.current = box;
      setIndicatorReady(true);
    },
    [leftEdge, rightEdge, stopMotion],
  );

  const animateIndicator = useCallback(
    (
      from: { left: number; right: number },
      to: { left: number; right: number },
    ) => {
      stopMotion();

      if (reduceMotion || (from.left === to.left && from.right === to.right)) {
        leftEdge.jump(to.left);
        rightEdge.jump(to.right);
        prevBoxRef.current = to;
        setIndicatorReady(true);
        return;
      }

      const movingRight = to.left > from.left;
      const leadSpring = perceptualSpring(
        0.38,
        0.25,
        clampedSpeed,
        clampedBounce,
      );
      const trailSpring = perceptualSpring(
        0.4,
        0.36,
        clampedSpeed,
        clampedBounce,
      );
      const delayMs = Math.round(
        (BASE_TRAIL_DELAY_MS * clampedStretch) / clampedSpeed,
      );

      prevBoxRef.current = to;
      setIndicatorReady(true);

      if (movingRight) {
        rightAnimRef.current = animate(rightEdge, to.right, leadSpring);
        if (delayMs <= 0) {
          leftAnimRef.current = animate(leftEdge, to.left, trailSpring);
        } else {
          trailTimerRef.current = window.setTimeout(() => {
            trailTimerRef.current = null;
            leftAnimRef.current = animate(leftEdge, to.left, trailSpring);
          }, delayMs);
        }
      } else {
        leftAnimRef.current = animate(leftEdge, to.left, leadSpring);
        if (delayMs <= 0) {
          rightAnimRef.current = animate(rightEdge, to.right, trailSpring);
        } else {
          trailTimerRef.current = window.setTimeout(() => {
            trailTimerRef.current = null;
            rightAnimRef.current = animate(rightEdge, to.right, trailSpring);
          }, delayMs);
        }
      }
    },
    [
      clampedBounce,
      clampedSpeed,
      clampedStretch,
      leftEdge,
      reduceMotion,
      rightEdge,
      stopMotion,
    ],
  );

  useIsomorphicLayoutEffect(() => {
    const nextBox = readBoxFor(activeValue);
    const prevValue = prevActiveValueRef.current;
    prevActiveValueRef.current = activeValue;
    lastGeometrySigRef.current = computeGeometrySig();

    if (!nextBox) {
      stopMotion();
      prevBoxRef.current = null;
      setIndicatorReady(false);
      return;
    }

    const prevBox = prevBoxRef.current;
    if (!prevBox || prevValue === activeValue) {
      jumpIndicator(nextBox);
      return;
    }

    animateIndicator(prevBox, nextBox);
  }, [
    activeValue,
    animateIndicator,
    computeGeometrySig,
    itemsKey,
    jumpIndicator,
    preset.height,
    preset.inset,
    preset.itemPx,
    readBoxFor,
    stopMotion,
  ]);

  // Only resnap the indicator on genuine layout/font geometry changes — never on selection changes.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !itemsKey || typeof ResizeObserver === "undefined") return;

    const syncIfGeometryChanged = () => {
      const nextSig = computeGeometrySig();
      if (!nextSig || nextSig === lastGeometrySigRef.current) return;
      lastGeometrySigRef.current = nextSig;
      const box = readBoxFor(activeValueRef.current);
      if (box) jumpIndicator(box);
    };

    const observer = new ResizeObserver(syncIfGeometryChanged);
    observer.observe(root);
    for (const el of getItemElements()) {
      observer.observe(el);
    }

    let fontsAlive = true;
    document.fonts?.ready.then(() => {
      if (fontsAlive) syncIfGeometryChanged();
    });

    return () => {
      fontsAlive = false;
      observer.disconnect();
    };
  }, [
    computeGeometrySig,
    getItemElements,
    itemsKey,
    jumpIndicator,
    readBoxFor,
  ]);

  useEffect(() => stopMotion, [stopMotion]);

  const handleValueChange = useCallback(
    (
      next: string | null,
      details: {
        reason: SegmentedControlValueChangeReason;
        source?: string;
        cancel: () => void;
        canceled: boolean;
      },
    ) => {
      onValueChange?.(next, details);
      if (!details.canceled && !isControlled) {
        setInternalValue(next);
      }
    },
    [isControlled, onValueChange],
  );

  const accessibleLabel =
    ariaLabel ?? (ariaLabelledBy ? undefined : "Segmented control");

  return (
    <MotionConfig reducedMotion="user">
      <SegmentedControlPrimitive
        ref={rootRef}
        value={isControlled ? activeValue : undefined}
        defaultValue={isControlled ? undefined : initialUncontrolled}
        onValueChange={handleValueChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        loop={loop}
        name={name}
        form={form}
        aria-label={accessibleLabel}
        aria-labelledby={ariaLabelledBy}
        data-slot="segmented-control"
        data-theme={theme}
        data-size={size}
        className={cn(
          "relative inline-flex max-w-full select-none items-center gap-[2px] rounded-full transition-[background-color,box-shadow] duration-200",
          showTray
            ? isDark
              ? "bg-[#26262b] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_1px_1px_rgba(0,0,0,0.3),0_6px_16px_-6px_rgba(0,0,0,0.45),0_22px_44px_-24px_rgba(0,0,0,0.6)]"
              : "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04),0_6px_16px_-6px_rgba(0,0,0,0.1),0_22px_44px_-24px_rgba(0,0,0,0.16)]"
            : "bg-transparent shadow-none",
          disabled && "pointer-events-none opacity-55",
          className,
        )}
        style={{
          height: preset.height,
          padding: preset.inset,
          ...style,
        }}
      >
        <motion.span
          aria-hidden="true"
          data-slot="segmented-control-indicator"
          animate={
            !reduceMotion
              ? {
                  scale:
                    pressedValue !== null && pressedValue === activeValue
                      ? 1.035
                      : 1,
                }
              : undefined
          }
          transition={
            pressedValue !== null && pressedValue === activeValue
              ? pressSpring
              : popSpring
          }
          style={{
            x: leftEdge,
            width: indicatorWidth,
            top: preset.inset,
            bottom: preset.inset,
          }}
          className={cn(
            "pointer-events-none absolute left-0 z-0 rounded-full will-change-[transform,width] transition-[opacity,background-color] duration-150",
            indicatorReady ? "opacity-100" : "opacity-0",
            isDark ? "bg-[#34343b]" : "bg-[#f2f2f2]",
          )}
        />

        {normalizedItems.map((item) => {
          const isChecked = activeValue === item.value;
          const isInteractive = !disabled && !item.disabled && !reduceMotion;
          const isPressed = isInteractive && pressedValue === item.value;
          const isHovered = isInteractive && hoveredValue === item.value;
          const itemScale = isPressed ? 1.09 : isHovered ? 1.04 : 1;
          const itemTransition = isPressed
            ? pressSpring
            : isHovered
              ? hoverSpring
              : popSpring;

          return (
            <SegmentedControlItemPrimitive
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              data-slot="segmented-control-item"
              data-segment-value={item.value}
              onPointerEnter={(event) => {
                if (isInteractive && event.pointerType === "mouse") {
                  setHoveredValue(item.value);
                }
              }}
              onPointerLeave={() => {
                setHoveredValue((prev) => (prev === item.value ? null : prev));
                setPressedValue((prev) => (prev === item.value ? null : prev));
              }}
              onPointerDown={() => {
                if (isInteractive) setPressedValue(item.value);
              }}
              onPointerUp={() => {
                setPressedValue((prev) => (prev === item.value ? null : prev));
              }}
              onPointerCancel={() => {
                setPressedValue((prev) => (prev === item.value ? null : prev));
              }}
              className={cn(
                "relative z-10 inline-flex h-full shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full outline-none",
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                isDark
                  ? "focus-visible:ring-[#60a5fa]/60 focus-visible:ring-offset-[#26262b]"
                  : "focus-visible:ring-[#0062d6]/55 focus-visible:ring-offset-white",
                "data-disabled:pointer-events-none data-disabled:opacity-40",
                isChecked
                  ? isDark
                    ? "text-[#ffffff]"
                    : "text-[#111111]"
                  : isDark
                    ? "text-[#a1a1aa] hover:text-[#ffffff]"
                    : "text-[#71717a] hover:text-[#111111]",
              )}
              style={{
                paddingLeft: preset.itemPx,
                paddingRight: preset.itemPx,
                fontSize: preset.fontSize,
                letterSpacing: preset.tracking,
              }}
            >
              <motion.span
                className="inline-grid place-items-center"
                animate={{ scale: itemScale }}
                transition={itemTransition}
              >
                <span
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1 font-semibold"
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "col-start-1 row-start-1 transition-[color,font-weight] duration-200",
                    isChecked ? "font-semibold" : "font-[450]",
                  )}
                >
                  {item.label}
                </span>
              </motion.span>
            </SegmentedControlItemPrimitive>
          );
        })}
      </SegmentedControlPrimitive>
    </MotionConfig>
  );
}
