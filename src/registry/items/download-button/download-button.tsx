"use client";

import { AnimateIcon } from "@animate-ui/react/icons";
import { Button as ButtonPrimitive } from "@ui-sdk/react/button";
import {
  ProgressIndicator as ProgressIndicatorPrimitive,
  Progress as ProgressPrimitive,
  ProgressTrack as ProgressTrackPrimitive,
} from "@ui-sdk/react/progress";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "@/registry/icons/check";
import { Pause } from "@/registry/icons/pause";
import { Play } from "@/registry/icons/play";
import { X } from "@/registry/icons/x";

export type DownloadButtonStatus =
  | "idle"
  | "downloading"
  | "paused"
  | "completing"
  | "completed";

export interface DownloadButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  openLabel?: string;
  sizeMB?: number;
  unit?: string;
  /** Simulated download duration in ms when `progress` is uncontrolled (default: 3200) */
  durationMs?: number;
  /** Checkmark pause before expanding to `Open` in ms (default: 900) */
  checkDurationMs?: number;
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "dark" | "light";
  status?: DownloadButtonStatus;
  /** Controlled progress percentage (0 - 100) */
  progress?: number;
  progressFormat?: "size" | "percent";
  disabled?: boolean;
  /** Keep elements focusable when disabled (ui-sdk Button) */
  focusableWhenDisabled?: boolean;
  resetOnOpen?: boolean;
  /** Pause simulation timers and frame loop cleanly without resetting state */
  paused?: boolean;
  /** Incrementing this counter restarts the download cycle */
  replaySignal?: number;
  onStatusChange?: (status: DownloadButtonStatus) => void;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onOpen?: () => void;
}

interface SizePreset {
  pillHeightClass: string;
  circleSizeClass: string;
  btnPx: number;
  gapPx: number;
  pxPx: number;
  textClass: string;
  iconSize: number;
  checkSize: number;
}

const SIZE_PRESETS: Record<"sm" | "md" | "lg" | "xl", SizePreset> = {
  sm: {
    pillHeightClass: "h-9",
    circleSizeClass: "size-9",
    btnPx: 36,
    gapPx: 9,
    pxPx: 14,
    textClass: "text-xs",
    iconSize: 16,
    checkSize: 18,
  },
  md: {
    pillHeightClass: "h-11",
    circleSizeClass: "size-11",
    btnPx: 44,
    gapPx: 10,
    pxPx: 18,
    textClass: "text-sm",
    iconSize: 19,
    checkSize: 21,
  },
  lg: {
    pillHeightClass: "h-12",
    circleSizeClass: "size-12",
    btnPx: 48,
    gapPx: 11,
    pxPx: 22,
    textClass: "text-base",
    iconSize: 21,
    checkSize: 23,
  },
  xl: {
    pillHeightClass: "h-[54px]",
    circleSizeClass: "size-[54px]",
    btnPx: 54,
    gapPx: 12,
    pxPx: 24,
    textClass: "text-[17px]",
    iconSize: 22,
    checkSize: 25,
  },
};

const SPRINGS = {
  layout: {
    type: "spring",
    visualDuration: 0.34,
    bounce: 0.2,
  } satisfies Transition,
  sideEnter: {
    type: "spring",
    visualDuration: 0.36,
    bounce: 0.24,
  } satisfies Transition,
  sideExit: {
    type: "spring",
    visualDuration: 0.28,
    bounce: 0,
  } satisfies Transition,
  swapScale: {
    type: "spring",
    visualDuration: 0.32,
    bounce: 0.18,
  } satisfies Transition,
} as const;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const ZERO_TRANSITION: Transition = { duration: 0 };

const FOCUS_CLASS =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const DISABLED_CLASS =
  "disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";

const clampProgress = (v: number) => Math.max(0, Math.min(100, v));
const formatSizeText = (sizeMB: number, unit: string) =>
  `${Math.round(sizeMB)} ${unit}`;

function createMotionTimings(reduceMotion: boolean) {
  const spring = (s: Transition): Transition =>
    reduceMotion ? ZERO_TRANSITION : s;
  const tween = (
    duration: number,
    delay = 0,
    ease: Transition["ease"] = EASE_OUT,
  ): Transition =>
    reduceMotion
      ? ZERO_TRANSITION
      : { duration, ...(delay ? { delay } : {}), ease };

  return {
    layoutTransition: spring(SPRINGS.layout),
    sideEnterTransition: spring(SPRINGS.sideEnter),
    sideExitTransition: spring(SPRINGS.sideExit),
    swapEnterTransition: reduceMotion
      ? ZERO_TRANSITION
      : {
          opacity: tween(0.26, 0.05, "easeOut"),
          filter: tween(0.4, 0.05, [0.32, 0, 0.2, 1]),
          scale: SPRINGS.swapScale,
        },
    swapExitTransition: reduceMotion
      ? ZERO_TRANSITION
      : {
          filter: tween(0.22, 0, "easeOut"),
          opacity: tween(0.24, 0.04, [0.4, 0, 1, 1]),
          scale: tween(0.24, 0, EASE_OUT),
        },
    sideIconEnterTransition: reduceMotion
      ? ZERO_TRANSITION
      : {
          ...SPRINGS.swapScale,
          delay: 0.04,
          opacity: tween(0.2, 0.04),
          filter: tween(0.28, 0.04, [0.32, 0, 0.2, 1]),
        },
    sideIconExitTransition: tween(0.16),
    iconSwapTransition: tween(0.28),
    fillFadeTransition: tween(0.24),
  };
}

/** Scoped SVG gooey filter (blur + alpha cutoff) kept separate from text/progress so glyphs stay crisp. */
function useGooFilter(blur = 6, cut = 26) {
  const rawId = React.useId().replace(/:/g, "");
  const id = `download-goo-${rawId}`;
  const filterDef = (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute top-0 left-0 h-px w-px opacity-[0.001]"
    >
      <defs>
        <filter
          id={id}
          x="-40%"
          y="-80%"
          width="180%"
          height="260%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={blur}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            type="matrix"
            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${cut} ${-(cut / 2)}`}
          />
        </filter>
      </defs>
    </svg>
  );
  return { url: `url(#${id})`, filterDef };
}

/** Measures unscaled DOM width (`offsetWidth`/`scrollWidth`) so ancestor CSS `scale()` never skews pill springs. */
function useMeasuredPillWidth(
  measureKey: string,
  dim: SizePreset,
  isCompleting: boolean,
) {
  const measureRef = React.useRef<HTMLSpanElement | null>(null);
  const [contentWidth, setContentWidth] = React.useState<number | null>(null);
  const initialKeyRef = React.useRef<string | null>(null);
  const canAnimateWidthRef = React.useRef(false);

  React.useLayoutEffect(() => {
    if (initialKeyRef.current === null) {
      initialKeyRef.current = measureKey;
    } else if (initialKeyRef.current !== measureKey) {
      canAnimateWidthRef.current = true;
    }

    const el = measureRef.current;
    if (!el) return;

    const update = () => {
      const nextWidth = Math.ceil(Math.max(el.offsetWidth, el.scrollWidth));
      if (nextWidth > 0) {
        setContentWidth((prev) => (prev === nextWidth ? prev : nextWidth));
      }
    };

    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measureKey]);

  const targetPillWidth = isCompleting
    ? dim.btnPx
    : contentWidth !== null
      ? contentWidth + dim.pxPx * 2 + 1
      : ("auto" as const);

  return {
    measureRef,
    targetPillWidth,
    canAnimateWidth: canAnimateWidthRef.current,
  };
}

interface GooBackdropSideSlotProps {
  visible: boolean;
  side: "left" | "right";
  dim: SizePreset;
  pressed: boolean;
  disabled: boolean;
  reduceMotion: boolean;
  timings: ReturnType<typeof createMotionTimings>;
  pillBgClass: string;
}

function GooBackdropSideSlot({
  visible,
  side,
  dim,
  pressed,
  disabled,
  reduceMotion,
  timings,
  pillBgClass,
}: GooBackdropSideSlotProps) {
  const closed =
    side === "left"
      ? { width: 0, marginRight: 0 }
      : { width: 0, marginLeft: 0 };
  const open =
    side === "left"
      ? { width: dim.btnPx, marginRight: dim.gapPx }
      : { width: dim.btnPx, marginLeft: dim.gapPx };

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key={`goo-${side}-slot`}
          initial={reduceMotion ? false : closed}
          animate={{ ...open, transition: timings.sideEnterTransition }}
          exit={
            reduceMotion
              ? closed
              : { ...closed, transition: timings.sideExitTransition }
          }
          className={cn(
            "flex shrink-0 items-center overflow-visible",
            side === "left" ? "justify-start" : "justify-end",
          )}
        >
          <motion.span
            initial={reduceMotion ? false : { scale: 0.78 }}
            animate={{
              scale: pressed && !disabled && !reduceMotion ? 0.95 : 1,
              transition: timings.sideEnterTransition,
            }}
            exit={
              reduceMotion
                ? undefined
                : { scale: 0.78, transition: timings.sideExitTransition }
            }
            className={cn(
              "block shrink-0 rounded-full transition-colors",
              pillBgClass,
              dim.circleSizeClass,
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ForegroundSideButtonProps {
  visible: boolean;
  side: "left" | "right";
  dim: SizePreset;
  disabled: boolean;
  focusableWhenDisabled: boolean;
  reduceMotion: boolean;
  timings: ReturnType<typeof createMotionTimings>;
  ariaLabel: string;
  title: string;
  inkClass: string;
  buttonRef?: React.Ref<HTMLButtonElement>;
  onPressedChange: (pressed: boolean) => void;
  onClick: () => void;
  children: React.ReactNode;
}

function ForegroundSideButton({
  visible,
  side,
  dim,
  disabled,
  focusableWhenDisabled,
  reduceMotion,
  timings,
  ariaLabel,
  title,
  inkClass,
  buttonRef,
  onPressedChange,
  onClick,
  children,
}: ForegroundSideButtonProps) {
  const closed =
    side === "left"
      ? { width: 0, marginRight: 0 }
      : { width: 0, marginLeft: 0 };
  const open =
    side === "left"
      ? { width: dim.btnPx, marginRight: dim.gapPx }
      : { width: dim.btnPx, marginLeft: dim.gapPx };
  const enterRotate = side === "left" ? -45 : 0;
  const exitRotate = side === "left" ? 45 : 0;

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key={`fg-${side}-slot`}
          initial={reduceMotion ? false : closed}
          animate={{ ...open, transition: timings.sideEnterTransition }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { ...closed, transition: timings.sideExitTransition }
          }
          className={cn(
            "relative z-0 flex shrink-0 items-center overflow-visible",
            side === "left" ? "justify-start" : "justify-end",
          )}
        >
          <AnimateIcon animateOnHover asChild>
            <ButtonPrimitive
              ref={buttonRef}
              type="button"
              onClick={() => {
                onPressedChange(false);
                onClick();
              }}
              disabled={disabled}
              focusableWhenDisabled={focusableWhenDisabled}
              aria-label={ariaLabel}
              title={title}
              tabIndex={visible ? undefined : -1}
              className={cn(
                "flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent transition-colors active:scale-100",
                inkClass,
                !visible && "pointer-events-none",
                FOCUS_CLASS,
                DISABLED_CLASS,
                dim.circleSizeClass,
              )}
              render={
                <motion.button
                  whileTap={
                    !disabled && !reduceMotion ? { scale: 0.95 } : undefined
                  }
                  onTapStart={() => !disabled && onPressedChange(true)}
                  onTap={() => onPressedChange(false)}
                  onTapCancel={() => onPressedChange(false)}
                />
              }
            >
              <motion.span
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        scale: 0.65,
                        rotate: enterRotate,
                        filter: "blur(6px)",
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  filter: "blur(0px)",
                  transition: timings.sideIconEnterTransition,
                }}
                exit={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        scale: 0.65,
                        rotate: exitRotate,
                        filter: "blur(6px)",
                        transition: timings.sideIconExitTransition,
                      }
                }
                className="inline-flex items-center justify-center"
              >
                {children}
              </motion.span>
            </ButtonPrimitive>
          </AnimateIcon>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Interactive Download Button built on ui-sdk (`Button` and `Progress`), Motion springs, and an SVG gooey backdrop.
 */
export const DownloadButton = React.forwardRef<
  HTMLDivElement,
  DownloadButtonProps
>(
  (
    {
      label = "Download",
      openLabel = "Open",
      sizeMB = 32,
      unit = "MB",
      durationMs = 3200,
      checkDurationMs = 900,
      size = "xl",
      theme = "light",
      status: controlledStatus,
      progress: controlledProgress,
      progressFormat = "size",
      disabled = false,
      focusableWhenDisabled = false,
      resetOnOpen = true,
      paused = false,
      replaySignal,
      onStatusChange,
      onStart,
      onPause,
      onResume,
      onCancel,
      onComplete,
      onOpen,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = Boolean(useReducedMotion());
    const dim = SIZE_PRESETS[size];
    const timings = React.useMemo(
      () => createMotionTimings(reduceMotion),
      [reduceMotion],
    );
    const goo = useGooFilter(6, 26);

    const pillBgClass =
      theme === "dark"
        ? "bg-[#26262b]"
        : theme === "light"
          ? "bg-white"
          : "bg-primary";
    const inkClass =
      theme === "dark"
        ? "text-white"
        : theme === "light"
          ? "text-[#111111]"
          : "text-primary-foreground";
    const fillBgClass =
      theme === "dark"
        ? "bg-white/20"
        : theme === "light"
          ? "bg-[#111111]/[0.08]"
          : "bg-primary-foreground/20";

    const isStatusControlled = controlledStatus !== undefined;
    const isProgressControlled = controlledProgress !== undefined;
    const [internalStatus, setInternalStatus] =
      React.useState<DownloadButtonStatus>("idle");
    const [displayPercent, setDisplayPercent] = React.useState(0);
    const [isLeftPressed, setIsLeftPressed] = React.useState(false);
    const [isPillPressed, setIsPillPressed] = React.useState(false);
    const [isRightPressed, setIsRightPressed] = React.useState(false);
    const status = isStatusControlled ? controlledStatus : internalStatus;

    const mainButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const cancelButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const pauseButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const fillRef = React.useRef<HTMLSpanElement | null>(null);
    const progressRef = React.useRef(0);
    const prevReplayRef = React.useRef<number | undefined>(replaySignal);

    const updateStatus = React.useCallback(
      (next: DownloadButtonStatus) => {
        if (!isStatusControlled) setInternalStatus(next);
        onStatusChange?.(next);
      },
      [isStatusControlled, onStatusChange],
    );

    const syncProgressVisual = React.useCallback((nextPct: number) => {
      const clamped = clampProgress(nextPct);
      progressRef.current = clamped;
      if (fillRef.current)
        fillRef.current.style.transform = `scaleX(${clamped / 100})`;
      const rounded = Math.round(clamped);
      setDisplayPercent((prev) => (prev === rounded ? prev : rounded));
    }, []);

    React.useEffect(() => {
      if (isProgressControlled) syncProgressVisual(controlledProgress);
    }, [controlledProgress, isProgressControlled, syncProgressVisual]);

    React.useEffect(() => {
      if (isProgressControlled || status !== "downloading" || paused) return;
      const safeDuration = Math.max(400, durationMs);
      let rafId = 0;
      let lastTick: number | null = null;

      const step = (now: number) => {
        const dt = lastTick === null ? 0 : Math.min(80, now - lastTick);
        lastTick = now;
        const pct = progressRef.current;
        const curve = pct < 20 ? 1.15 : pct > 85 ? 0.78 : 1.02;
        const nextPct = Math.min(100, pct + (dt / safeDuration) * 100 * curve);
        syncProgressVisual(nextPct);
        if (nextPct >= 100) {
          if (
            document.activeElement === pauseButtonRef.current ||
            document.activeElement === cancelButtonRef.current
          ) {
            window.requestAnimationFrame(() =>
              mainButtonRef.current?.focus({ preventScroll: true }),
            );
          }
          updateStatus("completing");
          onComplete?.();
          return;
        }
        rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    }, [
      status,
      paused,
      durationMs,
      isProgressControlled,
      syncProgressVisual,
      updateStatus,
      onComplete,
    ]);

    React.useEffect(() => {
      if (status !== "completing" || paused) return;
      const t = window.setTimeout(
        () => updateStatus("completed"),
        Math.max(250, checkDurationMs),
      );
      return () => window.clearTimeout(t);
    }, [status, paused, checkDurationMs, updateStatus]);

    // Delay progress reset so a cancelled download fades out before resetting to 0
    React.useEffect(() => {
      if (isProgressControlled || status !== "idle" || paused) return;
      if (progressRef.current === 0 && displayPercent === 0) return;
      const t = window.setTimeout(() => syncProgressVisual(0), 260);
      return () => window.clearTimeout(t);
    }, [
      status,
      paused,
      isProgressControlled,
      displayPercent,
      syncProgressVisual,
    ]);

    React.useEffect(() => {
      if (replaySignal === undefined || prevReplayRef.current === replaySignal)
        return;
      prevReplayRef.current = replaySignal;
      syncProgressVisual(0);
      updateStatus("downloading");
      onStart?.();
    }, [replaySignal, syncProgressVisual, updateStatus, onStart]);

    const handleMainClick = () => {
      if (disabled) return;
      setIsPillPressed(false);
      if (status === "idle") {
        syncProgressVisual(0);
        updateStatus("downloading");
        onStart?.();
      } else if (status === "completed") {
        onOpen?.();
        if (resetOnOpen) {
          syncProgressVisual(0);
          updateStatus("idle");
        }
      }
    };

    const handlePauseToggle = () => {
      if (disabled) return;
      if (status === "downloading") {
        updateStatus("paused");
        onPause?.();
      } else if (status === "paused") {
        const returnFocus = document.activeElement === cancelButtonRef.current;
        updateStatus("downloading");
        onResume?.();
        if (returnFocus) {
          window.requestAnimationFrame(() =>
            pauseButtonRef.current?.focus({ preventScroll: true }),
          );
        }
      }
    };

    const handleCancel = () => {
      if (disabled) return;
      const returnFocus =
        document.activeElement === cancelButtonRef.current ||
        document.activeElement === pauseButtonRef.current;
      updateStatus("idle");
      onCancel?.();
      if (returnFocus) {
        window.requestAnimationFrame(() =>
          mainButtonRef.current?.focus({ preventScroll: true }),
        );
      }
    };

    const isActiveProgress = status === "downloading" || status === "paused";
    const isCompleting = status === "completing";
    const pillCanTap =
      !disabled && (status === "idle" || status === "completed");
    const pillKey = isActiveProgress
      ? "active"
      : isCompleting
        ? "completing"
        : status === "completed"
          ? "completed"
          : "idle";
    const numericReadout =
      progressFormat === "size"
        ? Math.round((displayPercent / 100) * sizeMB)
        : displayPercent;
    const maxReadoutDigits =
      progressFormat === "size"
        ? Math.max(1, String(Math.round(sizeMB)).length)
        : 3;

    const measureText =
      pillKey === "idle"
        ? `${label} ${formatSizeText(sizeMB, unit)}`
        : pillKey === "completed"
          ? openLabel
          : `${status === "paused" ? "Paused " : progressFormat === "percent" ? "Downloading " : ""}${"0".repeat(maxReadoutDigits)}${
              progressFormat === "size"
                ? ` of ${formatSizeText(sizeMB, unit)}`
                : "%"
            }`;

    const measureKey = `${measureText}:${size}:${pillKey}`;
    const { measureRef, targetPillWidth, canAnimateWidth } =
      useMeasuredPillWidth(measureKey, dim, isCompleting);
    const pillWidthTransition = canAnimateWidth
      ? timings.layoutTransition
      : ZERO_TRANSITION;
    const pillWidthAnimate =
      targetPillWidth !== "auto" ? { width: targetPillWidth } : undefined;

    const swapProps = (enterScale = 0.9, exitScale = enterScale) =>
      reduceMotion
        ? {
            initial: false as const,
            animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
            exit: undefined,
          }
        : {
            initial: { opacity: 0, scale: enterScale, filter: "blur(6px)" },
            animate: {
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
              transition: timings.swapEnterTransition,
            },
            exit: {
              opacity: 0,
              filter: "blur(6px)",
              scale: exitScale,
              transition: timings.swapExitTransition,
            },
          };

    const mainAriaLabel =
      status === "idle"
        ? `${label} ${formatSizeText(sizeMB, unit)}`
        : status === "downloading"
          ? `Downloading ${displayPercent}%`
          : status === "paused"
            ? `Paused at ${displayPercent}%`
            : status === "completing"
              ? "Download complete"
              : openLabel;

    return (
      <MotionConfig reducedMotion="user">
        <div
          ref={ref}
          data-slot="download-button"
          data-status={status}
          data-theme={theme}
          className={cn(
            "relative inline-flex items-center justify-center select-none",
            className,
          )}
          {...props}
        >
          {goo.filterDef}

          {(isActiveProgress || isCompleting) && (
            <ProgressPrimitive
              className="sr-only"
              value={isCompleting ? 100 : displayPercent}
              min={0}
              max={100}
              aria-label="Download progress"
              getValueLabel={(value) =>
                status === "paused"
                  ? `Paused at ${value ?? 0}%`
                  : isCompleting
                    ? "Download complete"
                    : progressFormat === "size"
                      ? `${numericReadout} of ${formatSizeText(sizeMB, unit)}`
                      : `${value ?? 0}%`
              }
            >
              <ProgressTrackPrimitive>
                <ProgressIndicatorPrimitive />
              </ProgressTrackPrimitive>
            </ProgressPrimitive>
          )}

          <span
            ref={measureRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none invisible absolute top-0 left-0 font-medium whitespace-pre tabular-nums",
              dim.textClass,
            )}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {measureText}
          </span>

          {/* Gooey backdrop layer: solid shapes only (left Cancel + pill + right Pause/Play) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 [filter:drop-shadow(0_0_1px_rgba(0,0,0,0.12))_drop-shadow(0_2px_5px_rgba(0,0,0,0.04))_drop-shadow(0_12px_24px_rgba(0,0,0,0.07))]"
          >
            <div
              style={{ filter: reduceMotion ? undefined : goo.url }}
              className={cn(
                "flex size-full items-center justify-center",
                disabled && "opacity-50",
              )}
            >
              <GooBackdropSideSlot
                visible={status === "paused"}
                side="left"
                dim={dim}
                pressed={isLeftPressed}
                disabled={disabled}
                reduceMotion={reduceMotion}
                timings={timings}
                pillBgClass={pillBgClass}
              />

              <motion.span
                initial={false}
                animate={{
                  ...pillWidthAnimate,
                  scale:
                    isPillPressed && pillCanTap && !reduceMotion ? 0.97 : 1,
                }}
                transition={pillWidthTransition}
                style={{ borderRadius: 9999 }}
                className={cn(
                  "inline-block shrink-0 transition-colors",
                  pillBgClass,
                  targetPillWidth === "auto" && "px-5",
                  dim.pillHeightClass,
                )}
              />

              <GooBackdropSideSlot
                visible={isActiveProgress}
                side="right"
                dim={dim}
                pressed={isRightPressed}
                disabled={disabled}
                reduceMotion={reduceMotion}
                timings={timings}
                pillBgClass={pillBgClass}
              />
            </div>
          </div>

          {/* Interactive crisp foreground layer */}
          <div className="relative z-10 inline-flex items-center justify-center">
            <ForegroundSideButton
              visible={status === "paused"}
              side="left"
              dim={dim}
              disabled={disabled}
              focusableWhenDisabled={focusableWhenDisabled}
              reduceMotion={reduceMotion}
              timings={timings}
              ariaLabel="Cancel download"
              title="Cancel"
              inkClass={inkClass}
              buttonRef={cancelButtonRef}
              onPressedChange={setIsLeftPressed}
              onClick={handleCancel}
            >
              <X
                size={dim.iconSize}
                strokeWidth={2.75}
                className="shrink-0"
                aria-hidden="true"
              />
            </ForegroundSideButton>

            <AnimateIcon animateOnHover asChild>
              <ButtonPrimitive
                ref={mainButtonRef}
                type="button"
                onClick={handleMainClick}
                disabled={disabled}
                focusableWhenDisabled={focusableWhenDisabled}
                aria-label={mainAriaLabel}
                className={cn(
                  "relative z-10 inline-flex shrink-0 items-center justify-center overflow-hidden bg-transparent font-medium transition-colors active:scale-100",
                  inkClass,
                  targetPillWidth === "auto" && "px-5",
                  FOCUS_CLASS,
                  DISABLED_CLASS,
                  dim.pillHeightClass,
                  dim.textClass,
                  pillCanTap ? "cursor-pointer" : "cursor-default",
                )}
                render={
                  <motion.button
                    data-slot="download-pill"
                    initial={false}
                    animate={pillWidthAnimate}
                    whileTap={
                      pillCanTap && !reduceMotion ? { scale: 0.97 } : undefined
                    }
                    onTapStart={() => pillCanTap && setIsPillPressed(true)}
                    onTap={() => setIsPillPressed(false)}
                    onTapCancel={() => setIsPillPressed(false)}
                    transition={pillWidthTransition}
                    style={{ borderRadius: 9999 }}
                  />
                }
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0px, black 28px)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0px, black 28px)",
                  }}
                >
                  <AnimatePresence initial={false}>
                    {(isActiveProgress || isCompleting) && (
                      <motion.span
                        key="progress-fill"
                        ref={fillRef}
                        initial={false}
                        animate={{
                          opacity: isCompleting
                            ? 0
                            : status === "paused"
                              ? 0.55
                              : 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={timings.fillFadeTransition}
                        className={cn(
                          "pointer-events-none absolute inset-0 origin-left",
                          fillBgClass,
                        )}
                        style={{
                          transform: `scaleX(${
                            isCompleting
                              ? 1
                              : (
                                  isProgressControlled
                                    ? clampProgress(controlledProgress)
                                    : progressRef.current
                                ) / 100
                          })`,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </span>

                <span className="pointer-events-none relative z-10 block size-full overflow-hidden rounded-[inherit]">
                  <AnimatePresence initial={false}>
                    {pillKey === "idle" && (
                      <motion.span
                        key="idle"
                        {...swapProps()}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="whitespace-pre">
                          <span>{label}</span>{" "}
                          <span className="opacity-65">
                            {formatSizeText(sizeMB, unit)}
                          </span>
                        </span>
                      </motion.span>
                    )}

                    {pillKey === "active" && (
                      <motion.span
                        key={
                          status === "paused"
                            ? "active-paused"
                            : "active-downloading"
                        }
                        {...swapProps()}
                        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                      >
                        <span className="inline-flex items-baseline whitespace-pre">
                          {(status === "paused" ||
                            progressFormat === "percent") && (
                            <span>
                              {status === "paused" ? "Paused " : "Downloading "}
                            </span>
                          )}
                          <span className="inline-grid items-baseline justify-items-end tabular-nums">
                            <span
                              aria-hidden="true"
                              className="invisible col-start-1 row-start-1 tabular-nums select-none"
                            >
                              {"0".repeat(maxReadoutDigits)}
                            </span>
                            <span
                              className="col-start-1 row-start-1 tabular-nums"
                              style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                              {numericReadout}
                            </span>
                          </span>
                          {progressFormat === "size" ? (
                            <span className="opacity-75">
                              {" "}
                              of {formatSizeText(sizeMB, unit)}
                            </span>
                          ) : (
                            <span className="opacity-75">%</span>
                          )}
                        </span>
                      </motion.span>
                    )}

                    {pillKey === "completing" && (
                      <motion.span
                        key="completing"
                        {...swapProps(0.88, 0.78)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check
                          size={dim.checkSize}
                          strokeWidth={2.75}
                          animate={!reduceMotion}
                          className="shrink-0"
                          aria-hidden="true"
                        />
                      </motion.span>
                    )}

                    {pillKey === "completed" && (
                      <motion.span
                        key="completed"
                        {...swapProps()}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span>{openLabel}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </ButtonPrimitive>
            </AnimateIcon>

            <ForegroundSideButton
              visible={isActiveProgress}
              side="right"
              dim={dim}
              disabled={disabled}
              focusableWhenDisabled={focusableWhenDisabled}
              reduceMotion={reduceMotion}
              timings={timings}
              ariaLabel={
                status === "paused" ? "Resume download" : "Pause download"
              }
              title={status === "paused" ? "Resume" : "Pause"}
              inkClass={inkClass}
              buttonRef={pauseButtonRef}
              onPressedChange={setIsRightPressed}
              onClick={handlePauseToggle}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={status === "paused" ? "play" : "pause"}
                  {...(reduceMotion
                    ? {
                        initial: false as const,
                        animate: { opacity: 1, scale: 1 },
                        exit: undefined,
                      }
                    : {
                        initial: {
                          opacity: 0,
                          scale: 0.55,
                          filter: "blur(6px)",
                        },
                        animate: {
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: timings.iconSwapTransition,
                        },
                        exit: {
                          opacity: 0,
                          scale: 0.55,
                          filter: "blur(6px)",
                          transition: timings.iconSwapTransition,
                        },
                      })}
                  className="inline-flex items-center justify-center"
                >
                  {status === "paused" ? (
                    <Play
                      size={dim.iconSize}
                      fill="currentColor"
                      strokeWidth={2.4}
                      className="shrink-0 translate-x-[0.5px]"
                      aria-hidden="true"
                    />
                  ) : (
                    <Pause
                      size={dim.iconSize}
                      fill="currentColor"
                      strokeWidth={2.4}
                      className="shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </motion.span>
              </AnimatePresence>
            </ForegroundSideButton>
          </div>
        </div>
      </MotionConfig>
    );
  },
);

DownloadButton.displayName = "DownloadButton";

export default DownloadButton;
