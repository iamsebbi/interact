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
import { RefreshCw } from "@/registry/icons/refresh-cw";
import { X } from "@/registry/icons/x";

export type UpdateButtonStatus =
  | "idle"
  | "updating"
  | "completing"
  | "completed";
export type UpdateButtonSize = "sm" | "md" | "lg" | "xl";
export type UpdateButtonTheme = "dark" | "light";

export interface UpdateButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  updatingLabel?: string;
  completedLabel?: string;
  showPercentage?: boolean;
  durationMs?: number;
  checkDurationMs?: number;
  completedDurationMs?: number;
  autoReset?: boolean;
  size?: UpdateButtonSize;
  theme?: UpdateButtonTheme;
  status?: UpdateButtonStatus;
  progress?: number;
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
  cancelAriaLabel?: string;
  paused?: boolean;
  replaySignal?: number;
  onStatusChange?: (status: UpdateButtonStatus) => void;
  onStart?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onReset?: () => void;
}

interface SizePreset {
  pillHeightClass: string;
  circleSizeClass: string;
  btnPx: number;
  gapPx: number;
  pxPx: number;
  contentGapPx: number;
  textClass: string;
  iconSize: number;
  checkSize: number;
}

const SIZE_PRESETS: Record<UpdateButtonSize, SizePreset> = {
  sm: {
    pillHeightClass: "h-9",
    circleSizeClass: "size-9",
    btnPx: 36,
    gapPx: 9,
    pxPx: 14,
    contentGapPx: 6,
    textClass: "text-xs",
    iconSize: 14,
    checkSize: 18,
  },
  md: {
    pillHeightClass: "h-11",
    circleSizeClass: "size-11",
    btnPx: 44,
    gapPx: 10,
    pxPx: 18,
    contentGapPx: 7,
    textClass: "text-sm",
    iconSize: 16,
    checkSize: 21,
  },
  lg: {
    pillHeightClass: "h-12",
    circleSizeClass: "size-12",
    btnPx: 48,
    gapPx: 11,
    pxPx: 22,
    contentGapPx: 8,
    textClass: "text-base",
    iconSize: 18,
    checkSize: 23,
  },
  xl: {
    pillHeightClass: "h-[54px]",
    circleSizeClass: "size-[54px]",
    btnPx: 54,
    gapPx: 12,
    pxPx: 24,
    contentGapPx: 9,
    textClass: "text-[17px]",
    iconSize: 19,
    checkSize: 25,
  },
};

const THEME_STYLES: Record<
  UpdateButtonTheme | "default",
  { pill: string; ink: string; fill: string; cancelInk: string }
> = {
  dark: {
    pill: "bg-[#26262b]",
    ink: "text-[#60a5fa]",
    fill: "bg-[#60a5fa]/24",
    cancelInk: "text-white",
  },
  light: {
    pill: "bg-white",
    ink: "text-[#0062d6]",
    fill: "bg-[#0062d6]/12",
    cancelInk: "text-[#111111]",
  },
  default: {
    pill: "bg-primary",
    ink: "text-[#60a5fa] dark:text-[#0062d6]",
    fill: "bg-[#60a5fa]/24 dark:bg-[#0062d6]/15",
    cancelInk: "text-primary-foreground",
  },
};

const SPRINGS = {
  layout: {
    type: "spring",
    visualDuration: 0.34,
    bounce: 0.2,
  } satisfies Transition,
  cancelEnter: {
    type: "spring",
    visualDuration: 0.36,
    bounce: 0.24,
  } satisfies Transition,
  cancelExit: {
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
    cancelEnterTransition: spring(SPRINGS.cancelEnter),
    cancelExitTransition: spring(SPRINGS.cancelExit),
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
    cancelIconEnterTransition: reduceMotion
      ? ZERO_TRANSITION
      : {
          ...SPRINGS.swapScale,
          delay: 0.04,
          opacity: tween(0.2, 0.04),
          filter: tween(0.28, 0.04, [0.32, 0, 0.2, 1]),
        },
    cancelIconExitTransition: tween(0.16),
    fillFadeTransition: tween(0.24),
  };
}

/** Scoped SVG gooey filter (blur + alpha cutoff) kept separate from text/progress so glyphs stay crisp. */
function useGooFilter(blur = 6, cut = 26) {
  const rawId = React.useId().replace(/:/g, "");
  const id = `update-goo-${rawId}`;
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

interface UseUpdateSimulationArgs {
  controlledStatus: UpdateButtonStatus | undefined;
  controlledProgress: number | undefined;
  durationMs: number;
  checkDurationMs: number;
  completedDurationMs: number;
  autoReset: boolean;
  disabled: boolean;
  paused: boolean;
  replaySignal: number | undefined;
  onStatusChange?: (status: UpdateButtonStatus) => void;
  onStart?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onReset?: () => void;
}

function useUpdateSimulation({
  controlledStatus,
  controlledProgress,
  durationMs,
  checkDurationMs,
  completedDurationMs,
  autoReset,
  disabled,
  paused,
  replaySignal,
  onStatusChange,
  onStart,
  onCancel,
  onComplete,
  onReset,
}: UseUpdateSimulationArgs) {
  const isStatusControlled = controlledStatus !== undefined;
  const isProgressControlled = controlledProgress !== undefined;
  const [internalStatus, setInternalStatus] =
    React.useState<UpdateButtonStatus>("idle");
  const [displayPercent, setDisplayPercent] = React.useState(0);
  const status = isStatusControlled ? controlledStatus : internalStatus;

  const mainButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const cancelButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const fillRef = React.useRef<HTMLSpanElement | null>(null);
  const progressRef = React.useRef(0);
  const prevReplayRef = React.useRef<number | undefined>(replaySignal);

  const updateStatus = React.useCallback(
    (next: UpdateButtonStatus) => {
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
    if (isProgressControlled || status !== "updating" || paused) return;
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
        updateStatus("completing");
        onComplete?.();
        return;
      }
      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
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

  React.useEffect(() => {
    if (status !== "completed" || !autoReset || paused) return;
    const t = window.setTimeout(
      () => {
        syncProgressVisual(0);
        updateStatus("idle");
        onReset?.();
      },
      Math.max(400, completedDurationMs),
    );
    return () => window.clearTimeout(t);
  }, [
    status,
    paused,
    autoReset,
    completedDurationMs,
    syncProgressVisual,
    updateStatus,
    onReset,
  ]);

  // Delay progress reset on cancel so the fill fades out cleanly before snapping to 0.
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
    if (disabled) return;
    syncProgressVisual(0);
    updateStatus("updating");
    onStart?.();
  }, [disabled, replaySignal, syncProgressVisual, updateStatus, onStart]);

  const startOrReset = () => {
    if (disabled) return;
    if (status === "idle") {
      syncProgressVisual(0);
      updateStatus("updating");
      onStart?.();
    } else if (status === "completed") {
      syncProgressVisual(0);
      updateStatus("idle");
      onReset?.();
    }
  };

  const cancel = () => {
    if (disabled || status !== "updating") return;
    const returnFocus = document.activeElement === cancelButtonRef.current;
    updateStatus("idle");
    onCancel?.();
    if (returnFocus) {
      window.requestAnimationFrame(() =>
        mainButtonRef.current?.focus({ preventScroll: true }),
      );
    }
  };

  return {
    status,
    displayPercent,
    isProgressControlled,
    mainButtonRef,
    cancelButtonRef,
    fillRef,
    progressRef,
    startOrReset,
    cancel,
  };
}

export const UpdateButton = React.forwardRef<HTMLDivElement, UpdateButtonProps>(
  (
    {
      label = "Update",
      updatingLabel = "Updating",
      completedLabel = "Updated",
      showPercentage = false,
      durationMs = 2800,
      checkDurationMs = 850,
      completedDurationMs = 1600,
      autoReset = true,
      size = "xl",
      theme = "light",
      status: controlledStatus,
      progress: controlledProgress,
      disabled = false,
      focusableWhenDisabled = false,
      cancelAriaLabel = "Cancel update",
      paused = false,
      replaySignal,
      onStatusChange,
      onStart,
      onCancel,
      onComplete,
      onReset,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const reduceMotion = Boolean(useReducedMotion());
    const dim = SIZE_PRESETS[size];
    const styles = THEME_STYLES[theme ?? "default"];
    const timings = React.useMemo(
      () => createMotionTimings(reduceMotion),
      [reduceMotion],
    );
    const goo = useGooFilter(6, 26);

    const [isPillPressed, setIsPillPressed] = React.useState(false);
    const [isCancelPressed, setIsCancelPressed] = React.useState(false);

    const sim = useUpdateSimulation({
      controlledStatus,
      controlledProgress,
      durationMs,
      checkDurationMs,
      completedDurationMs,
      autoReset,
      disabled,
      paused,
      replaySignal,
      onStatusChange,
      onStart,
      onCancel,
      onComplete,
      onReset,
    });

    const { status, displayPercent, isProgressControlled } = sim;
    const isUpdating = status === "updating";
    const isCompleting = status === "completing";
    const isCompleted = status === "completed";
    const pillCanTap = !disabled && (status === "idle" || isCompleted);

    const measureKey = `${status}:${size}:${label}:${updatingLabel}:${completedLabel}:${showPercentage}`;
    const { measureRef, targetPillWidth, canAnimateWidth } =
      useMeasuredPillWidth(measureKey, dim, isCompleting);

    const pillWidthTransition = canAnimateWidth
      ? timings.layoutTransition
      : ZERO_TRANSITION;
    const pillWidthAnimate =
      targetPillWidth !== "auto" ? { width: targetPillWidth } : undefined;

    const cancelSlotMotion = {
      initial: reduceMotion ? false : { width: 0, marginLeft: 0 },
      animate: {
        width: dim.btnPx,
        marginLeft: dim.gapPx,
        transition: timings.cancelEnterTransition,
      },
      exit: reduceMotion
        ? { width: 0, marginLeft: 0 }
        : {
            width: 0,
            marginLeft: 0,
            transition: timings.cancelExitTransition,
          },
    };

    const swapMotion = (enterScale = 0.9, exitScale = enterScale) =>
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
        ? label
        : isUpdating
          ? `${updatingLabel} ${displayPercent}%`
          : completedLabel;

    return (
      <MotionConfig reducedMotion="user">
        <div
          ref={forwardedRef}
          data-slot="update-button"
          data-status={status}
          data-theme={theme}
          className={cn(
            "relative inline-flex items-center justify-center select-none",
            className,
          )}
          {...props}
        >
          {goo.filterDef}

          {(isUpdating || isCompleting) && (
            <ProgressPrimitive
              className="sr-only"
              value={isCompleting ? 100 : displayPercent}
              min={0}
              max={100}
              aria-label="Update progress"
              getValueLabel={(value) =>
                isCompleting
                  ? completedLabel
                  : `${updatingLabel} ${value ?? 0}%`
              }
            >
              <ProgressTrackPrimitive>
                <ProgressIndicatorPrimitive />
              </ProgressTrackPrimitive>
            </ProgressPrimitive>
          )}

          {/* Hidden unscaled sizer mirrors exact icon + gap + text metrics for smooth spring widths */}
          <span
            ref={measureRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none invisible absolute top-0 left-0 inline-flex items-center font-medium whitespace-nowrap tabular-nums",
              dim.textClass,
            )}
            style={{
              gap: dim.contentGapPx,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span
              style={{ width: dim.iconSize, height: dim.iconSize }}
              className="shrink-0"
            />
            {status === "idle" && <span>{label}</span>}
            {isUpdating && (
              <span className="inline-flex items-baseline whitespace-nowrap">
                <span>{updatingLabel}</span>
                {showPercentage && (
                  <span className="ml-1 tabular-nums">100%</span>
                )}
              </span>
            )}
            {(isCompleting || isCompleted) && <span>{completedLabel}</span>}
          </span>

          {/* Gooey backdrop layer: solid shapes only (pill + X circle) fused through SVG blur + alpha matrix */}
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
              <motion.span
                initial={false}
                animate={{
                  ...pillWidthAnimate,
                  scale:
                    isPillPressed && pillCanTap && !reduceMotion ? 0.96 : 1,
                }}
                transition={pillWidthTransition}
                style={{ borderRadius: 9999 }}
                className={cn(
                  "inline-block shrink-0 transition-colors",
                  styles.pill,
                  targetPillWidth === "auto" && "px-5",
                  dim.pillHeightClass,
                )}
              />

              <AnimatePresence initial={false}>
                {isUpdating && (
                  <motion.div
                    key="goo-cancel-slot"
                    {...cancelSlotMotion}
                    className="flex shrink-0 items-center justify-end overflow-visible"
                  >
                    <motion.span
                      initial={reduceMotion ? false : { scale: 0.78 }}
                      animate={{
                        scale:
                          isCancelPressed && !disabled && !reduceMotion
                            ? 0.95
                            : 1,
                        transition: timings.cancelEnterTransition,
                      }}
                      exit={
                        reduceMotion
                          ? undefined
                          : {
                              scale: 0.78,
                              transition: timings.cancelExitTransition,
                            }
                      }
                      className={cn(
                        "block shrink-0 rounded-full transition-colors",
                        styles.pill,
                        dim.circleSizeClass,
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive crisp foreground layer: ui-sdk Button primitives, progress fill, text & icons */}
          <div className="relative z-10 inline-flex items-center justify-center">
            <AnimateIcon animateOnHover={status === "idle"} asChild>
              <ButtonPrimitive
                ref={sim.mainButtonRef}
                type="button"
                disabled={disabled}
                focusableWhenDisabled={focusableWhenDisabled}
                aria-label={mainAriaLabel}
                onClick={() => {
                  setIsPillPressed(false);
                  sim.startOrReset();
                }}
                className={cn(
                  "relative z-10 inline-flex shrink-0 items-center justify-center overflow-hidden bg-transparent font-medium transition-colors active:scale-100",
                  targetPillWidth === "auto" && "px-5",
                  styles.ink,
                  FOCUS_CLASS,
                  DISABLED_CLASS,
                  dim.pillHeightClass,
                  dim.textClass,
                  pillCanTap ? "cursor-pointer" : "cursor-default",
                )}
                render={
                  <motion.button
                    data-part="update-pill"
                    initial={false}
                    animate={pillWidthAnimate}
                    whileTap={
                      pillCanTap && !reduceMotion ? { scale: 0.96 } : undefined
                    }
                    onTapStart={() => pillCanTap && setIsPillPressed(true)}
                    onTap={() => setIsPillPressed(false)}
                    onTapCancel={() => setIsPillPressed(false)}
                    transition={pillWidthTransition}
                    style={{ borderRadius: 9999 }}
                  />
                }
              >
                <AnimatePresence initial={false}>
                  {(isUpdating || isCompleting) && (
                    <motion.span
                      key="update-progress-fill"
                      ref={sim.fillRef}
                      aria-hidden="true"
                      initial={false}
                      animate={{ opacity: isCompleting ? 0 : 1 }}
                      exit={{ opacity: 0 }}
                      transition={timings.fillFadeTransition}
                      className={cn(
                        "pointer-events-none absolute inset-0 origin-left",
                        styles.fill,
                      )}
                      style={{
                        transform: `scaleX(${
                          isCompleting
                            ? 1
                            : (
                                isProgressControlled
                                  ? clampProgress(controlledProgress ?? 0)
                                  : sim.progressRef.current
                              ) / 100
                        })`,
                      }}
                    />
                  )}
                </AnimatePresence>

                <span className="pointer-events-none relative z-10 block size-full overflow-hidden rounded-[inherit]">
                  <AnimatePresence initial={false}>
                    {status === "idle" && (
                      <motion.span
                        key="idle"
                        {...swapMotion()}
                        style={{ gap: dim.contentGapPx }}
                        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                      >
                        <RefreshCw
                          size={dim.iconSize}
                          strokeWidth={2.35}
                          className="shrink-0"
                          aria-hidden="true"
                        />
                        <span>{label}</span>
                      </motion.span>
                    )}

                    {isUpdating && (
                      <motion.span
                        key="updating"
                        {...swapMotion()}
                        style={{ gap: dim.contentGapPx }}
                        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                      >
                        <motion.span
                          aria-hidden="true"
                          animate={reduceMotion ? undefined : { rotate: 360 }}
                          transition={
                            reduceMotion
                              ? undefined
                              : {
                                  repeat: Infinity,
                                  duration: 1.05,
                                  ease: "linear",
                                }
                          }
                          className="inline-flex shrink-0 items-center justify-center"
                        >
                          <RefreshCw
                            size={dim.iconSize}
                            strokeWidth={2.35}
                            className="shrink-0"
                          />
                        </motion.span>
                        <span className="inline-flex items-baseline whitespace-nowrap">
                          <span>{updatingLabel}</span>
                          {showPercentage && (
                            <span className="ml-1 inline-grid items-baseline justify-items-end tabular-nums opacity-85">
                              <span
                                aria-hidden="true"
                                className="invisible col-start-1 row-start-1 tabular-nums select-none"
                              >
                                100%
                              </span>
                              <span
                                className="col-start-1 row-start-1 tabular-nums"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                              >
                                {displayPercent}%
                              </span>
                            </span>
                          )}
                        </span>
                      </motion.span>
                    )}

                    {isCompleting && (
                      <motion.span
                        key="completing"
                        {...swapMotion(0.88, 0.78)}
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

                    {isCompleted && (
                      <motion.span
                        key="completed"
                        {...swapMotion()}
                        style={{ gap: dim.contentGapPx }}
                        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                      >
                        <Check
                          size={dim.iconSize}
                          strokeWidth={2.75}
                          className="shrink-0"
                          aria-hidden="true"
                        />
                        <span>{completedLabel}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </ButtonPrimitive>
            </AnimateIcon>

            <AnimatePresence initial={false}>
              {isUpdating && (
                <motion.div
                  key="update-cancel-slot"
                  {...cancelSlotMotion}
                  className="relative z-0 flex shrink-0 items-center justify-end overflow-visible"
                >
                  <AnimateIcon animateOnHover asChild>
                    <ButtonPrimitive
                      ref={sim.cancelButtonRef}
                      type="button"
                      onClick={() => {
                        setIsCancelPressed(false);
                        sim.cancel();
                      }}
                      disabled={disabled}
                      focusableWhenDisabled={focusableWhenDisabled}
                      aria-label={cancelAriaLabel}
                      title="Cancel"
                      tabIndex={isUpdating ? undefined : -1}
                      className={cn(
                        "flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent transition-colors active:scale-100",
                        styles.cancelInk,
                        !isUpdating && "pointer-events-none",
                        FOCUS_CLASS,
                        DISABLED_CLASS,
                        dim.circleSizeClass,
                      )}
                      render={
                        <motion.button
                          data-part="update-cancel"
                          whileTap={
                            !disabled && !reduceMotion
                              ? { scale: 0.95 }
                              : undefined
                          }
                          onTapStart={() =>
                            !disabled && setIsCancelPressed(true)
                          }
                          onTap={() => setIsCancelPressed(false)}
                          onTapCancel={() => setIsCancelPressed(false)}
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
                                rotate: -45,
                                filter: "blur(6px)",
                              }
                        }
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: 0,
                          filter: "blur(0px)",
                          transition: timings.cancelIconEnterTransition,
                        }}
                        exit={
                          reduceMotion
                            ? undefined
                            : {
                                opacity: 0,
                                scale: 0.65,
                                rotate: 45,
                                filter: "blur(6px)",
                                transition: timings.cancelIconExitTransition,
                              }
                        }
                        className="inline-flex items-center justify-center"
                      >
                        <X
                          size={dim.iconSize}
                          strokeWidth={2.75}
                          className="shrink-0"
                          aria-hidden="true"
                        />
                      </motion.span>
                    </ButtonPrimitive>
                  </AnimateIcon>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </MotionConfig>
    );
  },
);

UpdateButton.displayName = "UpdateButton";

export default UpdateButton;
