"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import NumberFlow from "@number-flow/react";
import { AnimateIcon } from "@animate-ui/react/icons";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Transition } from "motion/react";
import { Check } from "@/components/animate-ui/icons/check";
import { Pause } from "@/components/animate-ui/icons/pause";
import { Play } from "@/components/animate-ui/icons/play";
import { X } from "@/components/animate-ui/icons/x";
import { cn } from "@/lib/utils";

export type DownloadButtonStatus = "idle" | "downloading" | "paused" | "completing" | "completed";

export interface DownloadButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
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
  /** Keep elements focusable when disabled (Base UI Button) */
  focusableWhenDisabled?: boolean;
  resetOnOpen?: boolean;
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
  sm: { pillHeightClass: "h-9", circleSizeClass: "size-9", btnPx: 36, gapPx: 6, pxPx: 14, textClass: "text-xs", iconSize: 16, checkSize: 18 },
  md: { pillHeightClass: "h-11", circleSizeClass: "size-11", btnPx: 44, gapPx: 8, pxPx: 18, textClass: "text-sm", iconSize: 19, checkSize: 21 },
  lg: { pillHeightClass: "h-12", circleSizeClass: "size-12", btnPx: 48, gapPx: 10, pxPx: 22, textClass: "text-base", iconSize: 21, checkSize: 23 },
  xl: { pillHeightClass: "h-[54px]", circleSizeClass: "size-[54px]", btnPx: 54, gapPx: 10, pxPx: 24, textClass: "text-[17px]", iconSize: 22, checkSize: 25 },
};

const SPRING_LAYOUT = { type: "spring" as const, stiffness: 280, damping: 25, mass: 1 };
const SPRING_SIDE_BUTTON = { type: "spring" as const, stiffness: 185, damping: 20, mass: 1 };
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const FOCUS_CLASS =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const DISABLED_CLASS =
  "disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const CIRCLE_BTN_CLASS = cn(
  "flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors cursor-pointer active:scale-95",
  FOCUS_CLASS,
  DISABLED_CLASS
);

const clampProgress = (v: number) => Math.max(0, Math.min(100, v));
const formatSizeText = (sizeMB: number, unit: string) => `${Math.round(sizeMB)} ${unit}`;

function createMotionTimings(reduceMotion: boolean, btnPx: number) {
  const zero: Transition = { duration: 0 };
  const spring = (s: typeof SPRING_LAYOUT): Transition => (reduceMotion ? zero : s);
  const tween = (duration: number, delay = 0, ease: Transition["ease"] = EASE_OUT): Transition =>
    reduceMotion ? zero : { duration, ...(delay ? { delay } : {}), ease };

  return {
    slideOffset: Math.round(btnPx * 0.85),
    layoutTransition: spring(SPRING_LAYOUT),
    sideEnterTransition: reduceMotion
      ? zero
      : { ...SPRING_SIDE_BUTTON, opacity: tween(0.16), filter: tween(0.46, 0, [0.3, 0, 0.2, 1]) },
    sideExitTransition: reduceMotion
      ? zero
      : { ...SPRING_SIDE_BUTTON, opacity: tween(0.36, 0, [0.3, 0, 0.2, 1]), filter: tween(0.24, 0, EASE_OUT) },
    swapTransition: tween(0.26),
    enterSwapTransition: tween(0.26, 0.08),
    exitSwapTransition: tween(0.18),
    iconSwapTransition: tween(0.3),
    fillFadeTransition: tween(0.24),
  };
}

interface SideCircleProps {
  visible: boolean;
  side: "left" | "right";
  dim: SizePreset;
  slideOffset: number;
  reduceMotion: boolean;
  enterTransition: Transition;
  exitTransition: Transition;
  disabled: boolean;
  focusableWhenDisabled: boolean;
  ariaLabel: string;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}

function SideCircleSlot({
  visible,
  side,
  dim,
  slideOffset,
  reduceMotion,
  enterTransition,
  exitTransition,
  disabled,
  focusableWhenDisabled,
  ariaLabel,
  title,
  onClick,
  children,
}: SideCircleProps) {
  const marginZero = side === "left" ? { marginRight: 0 } : { marginLeft: 0 };
  const marginOpen = side === "left" ? { marginRight: dim.gapPx } : { marginLeft: dim.gapPx };
  const hidden = {
    width: 0,
    ...marginZero,
    opacity: 0,
    scale: 0.8,
    x: side === "left" ? slideOffset : -slideOffset,
    filter: reduceMotion ? "blur(0px)" : "blur(6px)",
  };

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key={`${side}-circle-slot`}
          initial={hidden}
          animate={{
            width: dim.btnPx,
            ...marginOpen,
            opacity: 1,
            scale: 1,
            x: 0,
            filter: "blur(0px)",
            transition: enterTransition,
          }}
          exit={{ ...hidden, transition: exitTransition }}
          className="relative z-0 flex shrink-0 items-center justify-center"
        >
          <AnimateIcon animateOnHover asChild>
            <ButtonPrimitive
              type="button"
              onClick={onClick}
              disabled={disabled}
              focusableWhenDisabled={focusableWhenDisabled}
              aria-label={ariaLabel}
              title={title}
              className={cn(CIRCLE_BTN_CLASS, dim.circleSizeClass)}
            >
              {children}
            </ButtonPrimitive>
          </AnimateIcon>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Tracks intrinsic text width in DOM so `motion.button` springs smoothly between pixel widths without jumps. */
function useMeasuredPillWidth(
  measureText: string,
  sizeKey: string,
  pillKey: string,
  dim: SizePreset,
  isCompleting: boolean
) {
  const measureRef = React.useRef<HTMLSpanElement | null>(null);
  const [contentWidth, setContentWidth] = React.useState<number | null>(null);
  const [isWidthReady, setIsWidthReady] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const nextWidth = Math.ceil(el.getBoundingClientRect().width);
    if (nextWidth > 0) setContentWidth((prev) => (prev === nextWidth ? prev : nextWidth));
  }, [measureText, sizeKey, pillKey]);

  React.useEffect(() => {
    const raf = window.requestAnimationFrame(() => setIsWidthReady(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const targetPillWidth = isCompleting
    ? dim.btnPx
    : contentWidth !== null
    ? contentWidth + dim.pxPx * 2
    : ("auto" as const);

  return { measureRef, targetPillWidth, isWidthReady };
}

/**
 * Interactive Download Button built on Base UI (`Button` and `Progress`) and Motion springs.
 */
export const DownloadButton = React.forwardRef<HTMLDivElement, DownloadButtonProps>(
  (
    {
      label = "Download",
      openLabel = "Open",
      sizeMB = 32,
      unit = "MB",
      durationMs = 3200,
      checkDurationMs = 900,
      size = "xl",
      theme,
      status: controlledStatus,
      progress: controlledProgress,
      progressFormat = "size",
      disabled = false,
      focusableWhenDisabled = false,
      resetOnOpen = true,
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
    ref
  ) => {
    const reduceMotion = Boolean(useReducedMotion());
    const dim = SIZE_PRESETS[size];
    const timings = createMotionTimings(reduceMotion, dim.btnPx);

    const isStatusControlled = controlledStatus !== undefined;
    const isProgressControlled = controlledProgress !== undefined;
    const [internalStatus, setInternalStatus] = React.useState<DownloadButtonStatus>("idle");
    const [displayPercent, setDisplayPercent] = React.useState(0);
    const status = isStatusControlled ? controlledStatus! : internalStatus;

    const fillRef = React.useRef<HTMLSpanElement | null>(null);
    const progressRef = React.useRef(0);
    const prevReplayRef = React.useRef<number | undefined>(replaySignal);

    const updateStatus = React.useCallback(
      (next: DownloadButtonStatus) => {
        if (!isStatusControlled) setInternalStatus(next);
        onStatusChange?.(next);
      },
      [isStatusControlled, onStatusChange]
    );

    const syncProgressVisual = React.useCallback((nextPct: number) => {
      const clamped = clampProgress(nextPct);
      progressRef.current = clamped;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${clamped / 100})`;
      const rounded = Math.round(clamped);
      setDisplayPercent((prev) => (prev === rounded ? prev : rounded));
    }, []);

    React.useEffect(() => {
      if (isProgressControlled) syncProgressVisual(controlledProgress!);
    }, [controlledProgress, isProgressControlled, syncProgressVisual]);

    React.useEffect(() => {
      if (isProgressControlled || status !== "downloading") return;
      const safeDuration = Math.max(400, durationMs);
      let rafId = 0;
      let lastTick: number | null = null;

      const step = (now: number) => {
        const dt = lastTick === null ? 0 : now - lastTick;
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
        rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    }, [status, durationMs, isProgressControlled, syncProgressVisual, updateStatus, onComplete]);

    React.useEffect(() => {
      if (status !== "completing") return;
      const t = window.setTimeout(() => updateStatus("completed"), Math.max(250, checkDurationMs));
      return () => window.clearTimeout(t);
    }, [status, checkDurationMs, updateStatus]);

    // Delay progress reset so a cancelled download fades out before resetting to 0
    React.useEffect(() => {
      if (isProgressControlled || status !== "idle") return;
      if (progressRef.current === 0 && displayPercent === 0) return;
      const t = window.setTimeout(() => syncProgressVisual(0), 260);
      return () => window.clearTimeout(t);
    }, [status, isProgressControlled, displayPercent, syncProgressVisual]);

    React.useEffect(() => {
      if (replaySignal === undefined || prevReplayRef.current === replaySignal) return;
      prevReplayRef.current = replaySignal;
      syncProgressVisual(0);
      updateStatus("downloading");
      onStart?.();
    }, [replaySignal, syncProgressVisual, updateStatus, onStart]);

    const handleMainClick = () => {
      if (disabled) return;
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
        updateStatus("downloading");
        onResume?.();
      }
    };

    const handleCancel = () => {
      if (disabled) return;
      updateStatus("idle");
      onCancel?.();
    };

    const isActiveProgress = status === "downloading" || status === "paused";
    const isCompleting = status === "completing";
    const pillKey = isActiveProgress ? "active" : isCompleting ? "completing" : status === "completed" ? "completed" : "idle";
    const numericReadout = progressFormat === "size" ? Math.round((displayPercent / 100) * sizeMB) : displayPercent;
    const maxReadoutDigits = progressFormat === "size" ? Math.max(1, String(Math.round(sizeMB)).length) : 3;

    const measureText =
      pillKey === "idle"
        ? `${label} ${formatSizeText(sizeMB, unit)}`
        : pillKey === "completed"
        ? openLabel
        : `${status === "paused" ? "Paused " : progressFormat === "percent" ? "Downloading " : ""}${"0".repeat(maxReadoutDigits)}${
            progressFormat === "size" ? ` of ${formatSizeText(sizeMB, unit)}` : "%"
          }`;

    const { measureRef, targetPillWidth, isWidthReady } = useMeasuredPillWidth(measureText, size, pillKey, dim, isCompleting);

    const swapProps = (
      enterScale = 0.94,
      exitScale = enterScale,
      blurEnter = true,
      enterTransition = timings.enterSwapTransition,
      exitTransition = timings.exitSwapTransition
    ) =>
      reduceMotion
        ? { initial: false as const, animate: { opacity: 1, filter: "blur(0px)", scale: 1 }, exit: undefined }
        : {
            initial: { opacity: 0, scale: enterScale, ...(blurEnter ? { filter: "blur(6px)" } : {}) },
            animate: { opacity: 1, filter: "blur(0px)", scale: 1, transition: enterTransition },
            exit: { opacity: 0, filter: "blur(6px)", scale: exitScale, transition: exitTransition },
          };

    const numberTiming = {
      duration: reduceMotion ? 0 : 240,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    };

    const sharedSideProps = {
      dim,
      slideOffset: timings.slideOffset,
      reduceMotion,
      enterTransition: timings.sideEnterTransition,
      exitTransition: timings.sideExitTransition,
      disabled,
      focusableWhenDisabled,
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
          className={cn(theme, "relative inline-flex items-center justify-center select-none", className)}
          {...props}
        >
          {(isActiveProgress || isCompleting) && (
            <ProgressPrimitive.Root
              className="sr-only"
              value={isCompleting ? 100 : displayPercent}
              min={0}
              max={100}
              aria-label="Download progress"
              getAriaValueText={(_f, value) =>
                status === "paused"
                  ? `Paused at ${value ?? 0}%`
                  : isCompleting
                  ? "Download complete"
                  : progressFormat === "size"
                  ? `${numericReadout} of ${formatSizeText(sizeMB, unit)}`
                  : `${value ?? 0}%`
              }
            >
              <ProgressPrimitive.Track><ProgressPrimitive.Indicator /></ProgressPrimitive.Track>
            </ProgressPrimitive.Root>
          )}

          <span
            ref={measureRef}
            aria-hidden="true"
            className={cn("pointer-events-none invisible absolute left-0 top-0 whitespace-pre font-medium tabular-nums", dim.textClass)}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {measureText}
          </span>

          <SideCircleSlot {...sharedSideProps} visible={status === "paused"} side="left" ariaLabel="Cancel download" title="Cancel" onClick={handleCancel}>
            <X size={dim.iconSize} strokeWidth={2.75} className="shrink-0" aria-hidden="true" />
          </SideCircleSlot>

          <AnimateIcon animateOnHover asChild>
            <ButtonPrimitive
              type="button"
              onClick={handleMainClick}
              disabled={disabled}
              focusableWhenDisabled={focusableWhenDisabled}
              aria-label={mainAriaLabel}
              className={cn(
                "relative z-10 inline-flex shrink-0 items-center justify-center overflow-hidden bg-primary text-primary-foreground font-medium transition-colors",
                FOCUS_CLASS,
                DISABLED_CLASS,
                dim.pillHeightClass,
                dim.textClass,
                status === "idle" || status === "completed" ? "cursor-pointer" : "cursor-default"
              )}
              render={
                <motion.button
                  data-slot="download-pill"
                  initial={false}
                  animate={{ width: targetPillWidth, paddingInline: isCompleting ? 0 : dim.pxPx }}
                  whileTap={!disabled && (status === "idle" || status === "completed") && !reduceMotion ? { scale: 0.97 } : undefined}
                  transition={isWidthReady ? timings.layoutTransition : { duration: 0 }}
                  style={{ borderRadius: 9999 }}
                />
              }
            >
              <AnimatePresence initial={false}>
                {(isActiveProgress || isCompleting) && (
                  <motion.span
                    key="progress-fill"
                    ref={fillRef}
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: isCompleting ? 0 : status === "paused" ? 0.55 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={timings.fillFadeTransition}
                    className="pointer-events-none absolute inset-0 origin-left bg-primary-foreground/20"
                    style={{
                      transform: `scaleX(${
                        isCompleting ? 1 : (isProgressControlled ? clampProgress(controlledProgress!) : progressRef.current) / 100
                      })`,
                    }}
                  />
                )}
              </AnimatePresence>

              <span className="relative z-10 grid w-full min-w-0 place-items-center whitespace-nowrap">
                <AnimatePresence initial={false}>
                  {pillKey === "idle" && (
                    <motion.span key="idle" {...swapProps()} className="col-start-1 row-start-1 inline-block whitespace-nowrap">
                      <span>{label}</span> <span className="opacity-65">{formatSizeText(sizeMB, unit)}</span>
                    </motion.span>
                  )}

                  {pillKey === "active" && (
                    <motion.span key="active" {...swapProps()} className="col-start-1 row-start-1 inline-flex items-center whitespace-nowrap">
                      <AnimatePresence initial={false}>
                        {(status === "paused" || progressFormat === "percent") && (
                          <motion.span
                            key={status === "paused" ? "paused-label" : "downloading-label"}
                            initial={reduceMotion ? false : { width: 0, opacity: 0, filter: "blur(6px)" }}
                            animate={{ width: "auto", opacity: 1, filter: "blur(0px)" }}
                            exit={reduceMotion ? undefined : { width: 0, opacity: 0, filter: "blur(6px)" }}
                            transition={reduceMotion ? { duration: 0 } : { ...timings.layoutTransition, opacity: timings.swapTransition, filter: timings.swapTransition }}
                            className="inline-block overflow-hidden whitespace-pre"
                          >
                            {status === "paused" ? "Paused " : "Downloading "}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span className="inline-grid items-baseline justify-items-end tabular-nums">
                        <span aria-hidden="true" className="invisible col-start-1 row-start-1 select-none tabular-nums">
                          {"0".repeat(maxReadoutDigits)}
                        </span>
                        <NumberFlow
                          value={numericReadout}
                          format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          spinTiming={numberTiming}
                          transformTiming={numberTiming}
                          opacityTiming={{ duration: reduceMotion ? 0 : 160, easing: "ease-out" }}
                          className="col-start-1 row-start-1 tabular-nums"
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        />
                      </span>
                      {progressFormat === "size" ? (
                        <span className="opacity-75 whitespace-pre"> of {formatSizeText(sizeMB, unit)}</span>
                      ) : (
                        <span className="opacity-75">%</span>
                      )}
                    </motion.span>
                  )}

                  {pillKey === "completing" && (
                    <motion.span key="completing" {...swapProps(0.9, 0.72, false)} className="col-start-1 row-start-1 inline-flex items-center justify-center">
                      <Check size={dim.checkSize} strokeWidth={2.75} animate={!reduceMotion} className="shrink-0" aria-hidden="true" />
                    </motion.span>
                  )}

                  {pillKey === "completed" && (
                    <motion.span key="completed" {...swapProps(0.92)} className="col-start-1 row-start-1 inline-flex items-center justify-center">
                      <span>{openLabel}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </ButtonPrimitive>
          </AnimateIcon>

          <SideCircleSlot
            {...sharedSideProps}
            visible={isActiveProgress}
            side="right"
            ariaLabel={status === "paused" ? "Resume download" : "Pause download"}
            title={status === "paused" ? "Resume" : "Pause"}
            onClick={handlePauseToggle}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={status === "paused" ? "play" : "pause"}
                {...swapProps(0.55, 0.55, true, timings.iconSwapTransition, timings.iconSwapTransition)}
                className="inline-flex items-center justify-center"
              >
                {status === "paused" ? (
                  <Play size={dim.iconSize} fill="currentColor" strokeWidth={2.4} className="shrink-0 translate-x-[0.5px]" aria-hidden="true" />
                ) : (
                  <Pause size={dim.iconSize} fill="currentColor" strokeWidth={2.4} className="shrink-0" aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </SideCircleSlot>
        </div>
      </MotionConfig>
    );
  }
);

DownloadButton.displayName = "DownloadButton";

export default DownloadButton;
