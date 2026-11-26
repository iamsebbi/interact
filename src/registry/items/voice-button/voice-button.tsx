"use client";

import { AnimateIcon } from "@animate-ui/react/icons";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { Button as ButtonPrimitive } from "@ui-sdk/react/button";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import * as React from "react";
import {
  type MicrophoneState,
  useMicrophone,
  VoiceBeam,
  type VoiceBeamColorVariant,
  type VoiceBeamLook,
} from "voice-glow";
import { Mic } from "@/components/animate-ui/icons/mic";
import { Square } from "@/components/animate-ui/icons/square";
import { cn } from "@/lib/utils";

export type VoiceButtonStatus = "idle" | "listening";
export type VoiceButtonMode = "voice" | "live";
export type VoiceButtonSize = "sm" | "md" | "lg" | "xl";
export type VoiceButtonTheme = "dark" | "light";
export type VoiceButtonColorVariant = VoiceBeamColorVariant;
export type VoiceButtonLook = VoiceBeamLook;

export interface VoiceButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  listeningLabel?: string;
  mode?: VoiceButtonMode;
  size?: VoiceButtonSize;
  theme?: VoiceButtonTheme;
  colorVariant?: VoiceButtonColorVariant;
  look?: VoiceButtonLook;
  strength?: number;
  sensitivity?: number;
  showTimer?: boolean;
  status?: VoiceButtonStatus;
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
  stopAriaLabel?: string;
  paused?: boolean;
  replaySignal?: number;
  onStatusChange?: (status: VoiceButtonStatus) => void;
  onStart?: () => void;
  onStop?: (durationMs: number) => void;
  onMicrophoneStateChange?: (
    state: MicrophoneState,
    error: Error | null,
  ) => void;
  onLevel?: (level: number) => void;
}

interface SizePreset {
  pillHeightClass: string;
  circleSizeClass: string;
  btnPx: number;
  gapPx: number;
  pxPx: number;
  contentGapPx: number;
  minIdleWidth: number;
  minListeningWidth: number;
  textClass: string;
  iconSize: number;
  stopIconSize: number;
  recDotPx: number;
}

const SIZE_PRESETS: Record<VoiceButtonSize, SizePreset> = {
  sm: {
    pillHeightClass: "h-9",
    circleSizeClass: "size-9",
    btnPx: 36,
    gapPx: 9,
    pxPx: 14,
    contentGapPx: 6,
    minIdleWidth: 96,
    minListeningWidth: 106,
    textClass: "text-xs",
    iconSize: 16,
    stopIconSize: 16,
    recDotPx: 8,
  },
  md: {
    pillHeightClass: "h-11",
    circleSizeClass: "size-11",
    btnPx: 44,
    gapPx: 10,
    pxPx: 18,
    contentGapPx: 7,
    minIdleWidth: 114,
    minListeningWidth: 128,
    textClass: "text-sm",
    iconSize: 18,
    stopIconSize: 18,
    recDotPx: 9,
  },
  lg: {
    pillHeightClass: "h-12",
    circleSizeClass: "size-12",
    btnPx: 48,
    gapPx: 11,
    pxPx: 22,
    contentGapPx: 8,
    minIdleWidth: 128,
    minListeningWidth: 142,
    textClass: "text-base",
    iconSize: 20,
    stopIconSize: 20,
    recDotPx: 10,
  },
  xl: {
    pillHeightClass: "h-[54px]",
    circleSizeClass: "size-[54px]",
    btnPx: 54,
    gapPx: 12,
    pxPx: 24,
    contentGapPx: 9,
    minIdleWidth: 140,
    minListeningWidth: 156,
    textClass: "text-[17px]",
    iconSize: 22,
    stopIconSize: 22,
    recDotPx: 10,
  },
};

const THEME_STYLES: Record<
  VoiceButtonTheme | "default",
  { pill: string; ink: string; stopInk: string; liveDot: string }
> = {
  dark: {
    pill: "bg-[#222226]",
    ink: "text-white",
    stopInk: "text-white",
    liveDot: "bg-rose-400",
  },
  light: {
    pill: "bg-white",
    ink: "text-[#111111]",
    stopInk: "text-[#111111]",
    liveDot: "bg-rose-500",
  },
  default: {
    pill: "bg-primary",
    ink: "text-primary-foreground",
    stopInk: "text-primary-foreground",
    liveDot: "bg-rose-400",
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
  };
}

/** Scoped SVG gooey filter kept separate from text and VoiceBeam so glow and glyphs stay crisp. */
function useGooFilter(blur = 6, cut = 26) {
  const id = `voice-goo-${React.useId().replace(/:/g, "")}`;
  const filterDef = (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-[0.001]"
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
  isListening: boolean,
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

  const minWidth = isListening ? dim.minListeningWidth : dim.minIdleWidth;
  const targetPillWidth =
    contentWidth !== null
      ? Math.max(minWidth, contentWidth + dim.pxPx * 2 + 1)
      : ("auto" as const);

  return {
    measureRef,
    targetPillWidth,
    canAnimateWidth: canAnimateWidthRef.current,
  };
}

function sampleSimulatedSpeech(elapsedSec: number) {
  const phraseGate =
    0.52 +
    0.48 * Math.sin(elapsedSec * 1.45 + Math.sin(elapsedSec * 0.55) * 1.2);
  const syllable =
    0.42 +
    0.32 * Math.sin(elapsedSec * 6.8) +
    0.18 * Math.sin(elapsedSec * 11.3 + 1.1) +
    0.12 * Math.cos(elapsedSec * 17.5);
  const accent = Math.max(0, Math.sin(elapsedSec * 2.7)) * 0.22;
  return Math.max(0.06, Math.min(0.95, phraseGate * syllable + accent));
}

export const VoiceButton = React.forwardRef<HTMLDivElement, VoiceButtonProps>(
  (
    {
      label = "Voice",
      listeningLabel = "Listening",
      mode = "voice",
      size = "xl",
      theme = "light",
      colorVariant = "colorful",
      look = "glow",
      strength = 1,
      sensitivity = 3.1,
      showTimer = true,
      status: controlledStatus,
      disabled = false,
      focusableWhenDisabled = false,
      stopAriaLabel = "Stop voice input",
      paused = false,
      replaySignal,
      onStatusChange,
      onStart,
      onStop,
      onMicrophoneStateChange,
      onLevel,
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

    const isStatusControlled = controlledStatus !== undefined;
    const [internalStatus, setInternalStatus] =
      React.useState<VoiceButtonStatus>("idle");
    const status =
      controlledStatus !== undefined ? controlledStatus : internalStatus;
    const isListening = status === "listening";

    const [elapsedSec, setElapsedSec] = React.useState(0);
    const [isPillPressed, setIsPillPressed] = React.useState(false);
    const [isStopPressed, setIsStopPressed] = React.useState(false);
    const [stopButtonEl, setStopButtonEl] =
      React.useState<HTMLButtonElement | null>(null);

    const mainButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const stopButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const startedAtRef = React.useRef<number | null>(null);
    const simStartPerfRef = React.useRef<number | null>(null);
    const isStartingLiveRef = React.useRef(false);
    const prevModeRef = React.useRef(mode);
    const prevReplayRef = React.useRef<number | undefined>(replaySignal);

    const {
      stream: micStream,
      state: micState,
      error: micError,
      start: micStart,
      stop: micStop,
    } = useMicrophone();

    const latestRef = React.useRef({
      isListening,
      mode,
      micStop,
      onStart,
      onStop,
      onStatusChange,
    });
    latestRef.current = {
      isListening,
      mode,
      micStop,
      onStart,
      onStop,
      onStatusChange,
    };

    React.useEffect(() => {
      onMicrophoneStateChange?.(micState, micError);
    }, [micState, micError, onMicrophoneStateChange]);

    const updateStatus = React.useCallback(
      (next: VoiceButtonStatus) => {
        if (!isStatusControlled) setInternalStatus(next);
        latestRef.current.onStatusChange?.(next);
      },
      [isStatusControlled],
    );

    const finishListening = React.useCallback(
      (stopMic: boolean, restoreFocus = false) => {
        const durationMs = startedAtRef.current
          ? Date.now() - startedAtRef.current
          : 0;
        if (stopMic) latestRef.current.micStop();
        updateStatus("idle");
        latestRef.current.onStop?.(durationMs);
        if (restoreFocus) {
          window.requestAnimationFrame(() =>
            mainButtonRef.current?.focus({ preventScroll: true }),
          );
        }
      },
      [updateStatus],
    );

    const setStopRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        stopButtonRef.current = node;
        if (look === "dither") setStopButtonEl(node);
      },
      [look],
    );

    React.useEffect(() => {
      if (look !== "dither") setStopButtonEl(null);
    }, [look]);

    // Track elapsed seconds without drift and anchor simulated speech clock.
    React.useEffect(() => {
      if (!isListening) {
        startedAtRef.current = null;
        simStartPerfRef.current = null;
        return;
      }
      if (paused) return;
      if (startedAtRef.current === null) {
        startedAtRef.current = Date.now();
        simStartPerfRef.current = performance.now();
        setElapsedSec(0);
      }
      const startTime = startedAtRef.current;
      const id = window.setInterval(() => {
        setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
      }, 250);
      return () => window.clearInterval(id);
    }, [isListening, paused]);

    // Collapse back to idle if the browser revokes or ends the live mic track externally.
    React.useEffect(() => {
      if (mode !== "live" || !isListening || isStartingLiveRef.current) return;
      if (micState !== "live" && micState !== "requesting") {
        finishListening(false);
      }
    }, [mode, isListening, micState, finishListening]);

    // Cleanly stop active capture when switching between Demo Voice and Demo Live.
    React.useEffect(() => {
      if (prevModeRef.current === mode) return;
      prevModeRef.current = mode;
      latestRef.current.micStop();
      if (latestRef.current.isListening) {
        finishListening(false);
      }
    }, [mode, finishListening]);

    // Sampled directly inside VoiceBeam's own rAF loop to avoid a redundant animation loop.
    const getSimLevel = React.useCallback(() => {
      if (
        !latestRef.current.isListening ||
        latestRef.current.mode !== "voice" ||
        simStartPerfRef.current === null
      ) {
        return 0;
      }
      return sampleSimulatedSpeech(
        (performance.now() - simStartPerfRef.current) / 1000,
      );
    }, []);

    const startListening = React.useCallback(async () => {
      if (disabled || latestRef.current.isListening) return;
      if (latestRef.current.mode === "live") {
        isStartingLiveRef.current = true;
        try {
          const stream = await micStart();
          if (!stream) return;
          updateStatus("listening");
          latestRef.current.onStart?.();
        } finally {
          isStartingLiveRef.current = false;
        }
        return;
      }
      updateStatus("listening");
      latestRef.current.onStart?.();
    }, [disabled, micStart, updateStatus]);

    const stopListening = React.useCallback(() => {
      if (disabled || !latestRef.current.isListening) return;
      const returnFocus = document.activeElement === stopButtonRef.current;
      finishListening(latestRef.current.mode === "live", returnFocus);
    }, [disabled, finishListening]);

    React.useEffect(() => {
      if (replaySignal === undefined || prevReplayRef.current === replaySignal)
        return;
      prevReplayRef.current = replaySignal;
      if (disabled) return;
      if (latestRef.current.isListening) {
        stopListening();
      } else {
        void startListening();
      }
    }, [replaySignal, disabled, startListening, stopListening]);

    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    const timerTemplate = mins >= 10 ? `${mins}:00` : "0:00";
    const pillCanTap = !disabled && !isListening;

    const measureKey = `${status}:${size}:${label}:${listeningLabel}:${showTimer}:${mins >= 10 ? "2d" : "1d"}`;
    const { measureRef, targetPillWidth, canAnimateWidth } =
      useMeasuredPillWidth(measureKey, dim, isListening);

    const pillWidthTransition = canAnimateWidth
      ? timings.layoutTransition
      : ZERO_TRANSITION;
    const pillWidthAnimate =
      targetPillWidth !== "auto" ? { width: targetPillWidth } : undefined;

    const stopSlotMotion = {
      initial: reduceMotion ? false : { width: 0, marginLeft: 0 },
      animate: {
        width: dim.btnPx,
        marginLeft: dim.gapPx,
        transition: timings.sideEnterTransition,
      },
      exit: reduceMotion
        ? { width: 0, marginLeft: 0 }
        : { width: 0, marginLeft: 0, transition: timings.sideExitTransition },
    };

    const swapMotion = reduceMotion
      ? {
          initial: false as const,
          animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
          exit: undefined,
        }
      : {
          initial: { opacity: 0, scale: 0.9, filter: "blur(6px)" },
          animate: {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            transition: timings.swapEnterTransition,
          },
          exit: {
            opacity: 0,
            filter: "blur(6px)",
            scale: 0.9,
            transition: timings.swapExitTransition,
          },
        };

    const mainAriaLabel = isListening
      ? `${listeningLabel} ${mins}:${String(secs).padStart(2, "0")}`
      : label;

    return (
      <MotionConfig reducedMotion="user">
        <div
          ref={forwardedRef}
          data-slot="voice-button"
          data-status={status}
          data-mode={mode}
          data-theme={theme}
          className={cn(
            "relative inline-flex items-center justify-center select-none",
            className,
          )}
          {...props}
        >
          {goo.filterDef}

          {/* Hidden unscaled sizer mirrors exact icon/dot + gap + label/timer metrics for smooth spring widths */}
          <span
            ref={measureRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none invisible absolute left-0 top-0 inline-flex items-center whitespace-nowrap font-medium tabular-nums",
              dim.textClass,
            )}
            style={{
              gap: dim.contentGapPx,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span
              style={{
                width: isListening ? dim.recDotPx : dim.iconSize,
                height: isListening ? dim.recDotPx : dim.iconSize,
              }}
              className="shrink-0 rounded-full"
            />
            <span>
              {isListening
                ? showTimer
                  ? timerTemplate
                  : listeningLabel
                : label}
            </span>
          </span>

          {/* Gooey backdrop layer: solid shapes only (pill + Stop circle) fused through SVG blur + alpha matrix */}
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
                {isListening && (
                  <motion.div
                    key="goo-stop-slot"
                    {...stopSlotMotion}
                    className="flex shrink-0 items-center justify-end overflow-visible"
                  >
                    <motion.span
                      initial={reduceMotion ? false : { scale: 0.78 }}
                      animate={{
                        scale:
                          isStopPressed && !disabled && !reduceMotion
                            ? 0.95
                            : 1,
                        transition: timings.sideEnterTransition,
                      }}
                      exit={
                        reduceMotion
                          ? undefined
                          : {
                              scale: 0.78,
                              transition: timings.sideExitTransition,
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

          {/* Interactive crisp foreground layer: ui-sdk Button primitives, VoiceBeam glow, timer & Stop circle */}
          <div className="relative z-10 inline-flex items-center justify-center">
            <AnimateIcon animateOnHover={!isListening} asChild>
              <ButtonPrimitive
                ref={mainButtonRef}
                type="button"
                disabled={disabled}
                focusableWhenDisabled={focusableWhenDisabled}
                aria-label={mainAriaLabel}
                pendingAnnouncement={
                  mode === "live" ? "Requesting microphone" : ""
                }
                onClick={() => {
                  setIsPillPressed(false);
                  if (!isListening) return startListening();
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
                    data-part="voice-pill"
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
                <VoiceBeam
                  type="pill"
                  look={look}
                  borderRadius={9999}
                  active={isListening}
                  paused={paused}
                  theme={theme === "light" ? "light" : "dark"}
                  colorVariant={colorVariant}
                  strength={strength}
                  sensitivity={sensitivity}
                  stream={mode === "live" ? micStream : undefined}
                  level={mode === "voice" ? getSimLevel : undefined}
                  pixelExitTarget={look === "dither" ? stopButtonEl : undefined}
                  onLevel={onLevel}
                  className="pointer-events-none rounded-full"
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="block size-full rounded-full"
                  />
                </VoiceBeam>

                <span className="pointer-events-none relative z-10 block size-full overflow-hidden rounded-[inherit]">
                  <AnimatePresence initial={false}>
                    {!isListening ? (
                      <motion.span
                        key="idle"
                        {...swapMotion}
                        style={{ gap: dim.contentGapPx }}
                        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                      >
                        <Mic
                          size={dim.iconSize}
                          strokeWidth={2.25}
                          className="shrink-0"
                          aria-hidden="true"
                        />
                        <span>{label}</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="listening"
                        {...swapMotion}
                        style={{ gap: dim.contentGapPx }}
                        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                      >
                        <motion.span
                          aria-hidden="true"
                          animate={
                            reduceMotion
                              ? undefined
                              : { scale: [1, 0.84, 1], opacity: [1, 0.62, 1] }
                          }
                          transition={
                            reduceMotion
                              ? undefined
                              : {
                                  repeat: Infinity,
                                  duration: 1.4,
                                  ease: "easeInOut",
                                }
                          }
                          style={{ width: dim.recDotPx, height: dim.recDotPx }}
                          className={cn(
                            "shrink-0 rounded-full",
                            styles.liveDot,
                          )}
                        />
                        {showTimer ? (
                          <NumberFlowGroup>
                            <span
                              className="inline-flex items-baseline tabular-nums"
                              style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                              <NumberFlow
                                value={mins}
                                respectMotionPreference={!reduceMotion}
                              />
                              <span>:</span>
                              <NumberFlow
                                value={secs}
                                format={{ minimumIntegerDigits: 2 }}
                                respectMotionPreference={!reduceMotion}
                              />
                            </span>
                          </NumberFlowGroup>
                        ) : (
                          <span>{listeningLabel}</span>
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </ButtonPrimitive>
            </AnimateIcon>

            <AnimatePresence initial={false}>
              {isListening && (
                <motion.div
                  key="voice-stop-slot"
                  {...stopSlotMotion}
                  className="relative z-0 flex shrink-0 items-center justify-end overflow-visible"
                >
                  <AnimateIcon animateOnHover asChild>
                    <ButtonPrimitive
                      ref={setStopRefs}
                      type="button"
                      onClick={() => {
                        setIsStopPressed(false);
                        stopListening();
                      }}
                      disabled={disabled}
                      focusableWhenDisabled={focusableWhenDisabled}
                      aria-label={stopAriaLabel}
                      title="Stop"
                      tabIndex={isListening ? undefined : -1}
                      className={cn(
                        "flex shrink-0 items-center justify-center rounded-full bg-transparent transition-colors cursor-pointer active:scale-100",
                        styles.stopInk,
                        !isListening && "pointer-events-none",
                        FOCUS_CLASS,
                        DISABLED_CLASS,
                        dim.circleSizeClass,
                      )}
                      render={
                        <motion.button
                          data-part="voice-stop"
                          whileTap={
                            !disabled && !reduceMotion
                              ? { scale: 0.95 }
                              : undefined
                          }
                          onTapStart={() => !disabled && setIsStopPressed(true)}
                          onTap={() => setIsStopPressed(false)}
                          onTapCancel={() => setIsStopPressed(false)}
                        />
                      }
                    >
                      <motion.span
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, scale: 0.65, filter: "blur(6px)" }
                        }
                        animate={{
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: timings.sideIconEnterTransition,
                        }}
                        exit={
                          reduceMotion
                            ? undefined
                            : {
                                opacity: 0,
                                scale: 0.65,
                                filter: "blur(6px)",
                                transition: timings.sideIconExitTransition,
                              }
                        }
                        className="inline-flex items-center justify-center"
                      >
                        <Square
                          size={dim.stopIconSize}
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

VoiceButton.displayName = "VoiceButton";

export default VoiceButton;
