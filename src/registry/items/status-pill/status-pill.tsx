"use client";

import { Button as ButtonPrimitive } from "@ui-sdk/react/button";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
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

export type StatusPillState = "idle" | "syncing" | "done" | "failed";
export type StatusPillSize = "sm" | "md" | "lg" | "xl";
export type StatusPillTheme = "light" | "dark";
export type StatusPillDemoMode = "alternate" | "succeed" | "fail";

export interface StatusPillProps {
  idleLabel?: string;
  /** Template for multiple remaining files; `{n}` is replaced with the count. */
  busyLabel?: string;
  /** Template when 1 file remains; `{n}` is replaced with `1`. */
  busyOneLabel?: string;
  doneLabel?: string;
  failLabel?: string;
  retryLabel?: string;
  /** Controlled status (leave undefined for built-in interactive demo playback). */
  status?: StatusPillState;
  /** Controlled remaining count when `status="syncing"`. */
  remaining?: number;
  /** Controlled total file count when `status="syncing"`. */
  total?: number;
  /** Optional explicit progress (0..1) or CSS transition duration in ms while `status="syncing"`. */
  progress?: number;
  progressDurationMs?: number;
  /** Number of files simulated in interactive mode (default 4). */
  demoFiles?: number;
  /** Controls whether interactive demo runs alternate failure, always succeed, or always fail. */
  demoMode?: StatusPillDemoMode;
  resetAfterMs?: number;
  size?: StatusPillSize;
  theme?: StatusPillTheme;
  bounce?: number;
  speed?: number;
  showTray?: boolean;
  fullWidth?: boolean;
  showIdleIcon?: boolean;
  showDoneSheen?: boolean;
  /** Incrementing counter that starts a fresh sync run (used by previews/Studio Play). */
  replaySignal?: number;
  /** Pauses & smoothly resets to idle when false in grid previews. */
  active?: boolean;
  onStatusChange?: (
    status: StatusPillState,
    detail?: { left?: number; total?: number },
  ) => void;
  onTrigger?: () => void;
  onRetry?: (remaining: number) => void;
  className?: string;
  style?: CSSProperties;
}

interface SizePreset {
  height: number;
  pad: number;
  gap: number;
  fontSize: number;
  iconSize: number;
}

const SIZE_PRESETS: Record<StatusPillSize, SizePreset> = {
  sm: { height: 36, pad: 4, gap: 5, fontSize: 13, iconSize: 15 },
  md: { height: 44, pad: 5, gap: 6, fontSize: 15, iconSize: 18 },
  lg: { height: 50, pad: 5, gap: 7, fontSize: 16.5, iconSize: 20 },
  xl: { height: 54, pad: 6, gap: 7, fontSize: 17.5, iconSize: 22 },
};

const RING_RADIUS = 8.5;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type SpringKind = "pop" | "morph" | "snap" | "settle";

const SPRING_PARAMS: Record<SpringKind, readonly [number, number]> = {
  pop: [0.5, 0.5],
  morph: [0.4, 0.36],
  snap: [0.38, 0.25],
  settle: [0.32, 0.2],
};

function perceptualSpring(
  kind: SpringKind,
  speed: number,
  bounceScale: number,
) {
  const [basePeriod, baseBounce] = SPRING_PARAMS[kind];
  const period = basePeriod / Math.max(0.25, speed);
  const clampedBounce = Math.min(0.85, Math.max(0, baseBounce * bounceScale));
  const stiffness = ((2 * Math.PI) / period) ** 2;
  const damping = (4 * Math.PI * (1 - clampedBounce)) / period;
  return { type: "spring" as const, stiffness, damping, mass: 1 };
}

function CloudCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7.3 18.6a4.2 4.2 0 0 1-.6-8.4 5.6 5.6 0 0 1 10.8 1.2 3.6 3.6 0 0 1-.3 7.2H7.3z" />
      <path d="M9.7 14.2l1.6 1.6 3.1-3.2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5.5 12.6l4.2 4.2 8.8-9.3" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8v4.8M12 16.2h.01" />
    </svg>
  );
}

function RetryIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M19 12a7 7 0 1 1-2.05-4.95" />
      <path d="M19.2 4.6v3.6h-3.6" />
    </svg>
  );
}

export function StatusPill({
  idleLabel = "Up to date",
  busyLabel = "Syncing {n} files",
  busyOneLabel = "Syncing {n} file",
  doneLabel = "Synced",
  failLabel = "Sync failed",
  retryLabel = "Retry",
  status: controlledStatus,
  remaining: controlledRemaining,
  total: controlledTotal,
  progress: controlledProgress,
  progressDurationMs,
  demoFiles = 4,
  demoMode = "alternate",
  resetAfterMs = 1800,
  size = "md",
  theme = "light",
  bounce = 1,
  speed = 1,
  showTray = true,
  fullWidth = false,
  showIdleIcon = true,
  showDoneSheen = true,
  replaySignal,
  active,
  onStatusChange,
  onTrigger,
  onRetry,
  className,
  style,
}: StatusPillProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const isDark = theme === "dark";
  const preset = SIZE_PRESETS[size];
  const clampedBounce = Math.max(
    0,
    Math.min(1.6, Number.isFinite(bounce) ? bounce : 1),
  );
  const clampedSpeed = Math.max(
    0.5,
    Math.min(2, Number.isFinite(speed) ? speed : 1),
  );
  const safeFiles = Math.max(1, Math.min(12, Math.round(demoFiles)));

  const isControlled = controlledStatus !== undefined;
  const [internalStatus, setInternalStatus] = useState<StatusPillState>("idle");
  const [internalTotal, setInternalTotal] = useState(safeFiles);
  const [internalLeft, setInternalLeft] = useState(safeFiles);
  const [showRetry, setShowRetry] = useState(false);
  const [showSheen, setShowSheen] = useState(false);
  const [timedProgressStarted, setTimedProgressStarted] = useState(false);

  const status = isControlled ? controlledStatus : internalStatus;
  const totalCount = Math.max(
    1,
    controlledTotal !== undefined ? controlledTotal : internalTotal,
  );
  const leftCount = Math.max(
    0,
    controlledRemaining !== undefined ? controlledRemaining : internalLeft,
  );

  const timersRef = useRef<number[]>([]);
  const runsRef = useRef(0);
  const mainSizerRef = useRef<HTMLSpanElement | null>(null);
  const retrySizerRef = useRef<HTMLSpanElement | null>(null);
  const [mainWidth, setMainWidth] = useState(134);
  const [retryWidth, setRetryWidth] = useState(92);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  const schedule = useCallback(
    (ms: number, fn: () => void) => {
      const id = window.setTimeout(
        fn,
        Math.round(ms / Math.max(0.25, clampedSpeed)),
      );
      timersRef.current.push(id);
    },
    [clampedSpeed],
  );

  const currentLabel = useMemo(() => {
    if (status === "syncing") {
      const tpl = leftCount === 1 ? busyOneLabel : busyLabel;
      return tpl.replace("{n}", String(leftCount));
    }
    if (status === "done") return doneLabel;
    if (status === "failed") return failLabel;
    return idleLabel;
  }, [
    busyLabel,
    busyOneLabel,
    doneLabel,
    failLabel,
    idleLabel,
    leftCount,
    status,
  ]);

  // Measure pill widths via offsetWidth (immune to ancestor transform: scale()).
  useIsomorphicLayoutEffect(() => {
    if (mainSizerRef.current && mainSizerRef.current.offsetWidth > 0) {
      setMainWidth(mainSizerRef.current.offsetWidth);
    }
    if (retrySizerRef.current && retrySizerRef.current.offsetWidth > 0) {
      setRetryWidth(retrySizerRef.current.offsetWidth);
    }
  }, [
    currentLabel,
    preset.fontSize,
    preset.height,
    preset.iconSize,
    retryLabel,
  ]);

  useEffect(() => {
    if (status === "failed") {
      const id = window.setTimeout(
        () => setShowRetry(true),
        reduceMotion ? 0 : Math.round(120 / clampedSpeed),
      );
      return () => window.clearTimeout(id);
    }
    setShowRetry(false);
  }, [clampedSpeed, reduceMotion, status]);

  useEffect(() => {
    if (status === "done" && showDoneSheen && !reduceMotion) {
      const t1 = window.setTimeout(
        () => setShowSheen(true),
        Math.round(320 / clampedSpeed),
      );
      const t2 = window.setTimeout(
        () => setShowSheen(false),
        Math.round(1220 / clampedSpeed),
      );
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
    setShowSheen(false);
  }, [clampedSpeed, reduceMotion, showDoneSheen, status]);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (
      status !== "syncing" ||
      progressDurationMs === undefined ||
      reduceMotion
    ) {
      setTimedProgressStarted(false);
      return;
    }
    setTimedProgressStarted(false);
    const raf = window.requestAnimationFrame(() => {
      setTimedProgressStarted(true);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [status, progressDurationMs, reduceMotion]);

  const startDemoRun = useCallback(
    (resumeFrom?: number) => {
      if (isControlled) return;
      clearTimers();

      const runIdx = runsRef.current++;
      const total = resumeFrom !== undefined ? internalTotal : safeFiles;
      const startLeft = resumeFrom !== undefined ? resumeFrom : safeFiles;
      const shouldFail =
        resumeFrom === undefined &&
        (demoMode === "fail" || (demoMode === "alternate" && runIdx % 2 === 1));
      const failAt = Math.max(1, Math.floor(total / 2));

      setInternalTotal(total);
      setInternalLeft(startLeft);
      setInternalStatus("syncing");
      onStatusChange?.("syncing", { left: startLeft, total });

      const stepDown = (current: number) => {
        schedule(520, () => {
          if (shouldFail && current === failAt) {
            setInternalStatus("failed");
            onStatusChange?.("failed", { left: current, total });
            return;
          }
          if (current - 1 > 0) {
            const nextLeft = current - 1;
            setInternalLeft(nextLeft);
            onStatusChange?.("syncing", { left: nextLeft, total });
            stepDown(nextLeft);
          } else {
            setInternalLeft(0);
            setInternalStatus("done");
            onStatusChange?.("done", { left: 0, total });
            if (resetAfterMs > 0) {
              schedule(resetAfterMs, () => {
                setInternalStatus("idle");
                onStatusChange?.("idle");
              });
            }
          }
        });
      };

      stepDown(startLeft);
    },
    [
      clearTimers,
      demoMode,
      internalTotal,
      isControlled,
      onStatusChange,
      resetAfterMs,
      safeFiles,
      schedule,
    ],
  );

  // External replaySignal / preview active support (smooth return to idle when active=false).
  const prevReplayRef = useRef(replaySignal ?? 0);
  useEffect(() => {
    if (isControlled) return;
    if (active === false) {
      clearTimers();
      setInternalStatus("idle");
      return;
    }
    const nextSignal = replaySignal ?? 0;
    if (nextSignal > 0 && nextSignal !== prevReplayRef.current) {
      prevReplayRef.current = nextSignal;
      startDemoRun();
    }
  }, [active, clearTimers, isControlled, replaySignal, startDemoRun]);

  const progress =
    status === "done"
      ? 1
      : status === "syncing"
        ? progressDurationMs !== undefined
          ? timedProgressStarted || reduceMotion
            ? 1
            : 0.06
          : controlledProgress !== undefined
            ? Math.max(0.06, Math.min(1, controlledProgress))
            : Math.max(0.08, Math.min(1, (totalCount - leftCount) / totalCount))
        : 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  const morphSpring = useMemo(
    () => perceptualSpring("morph", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const popSpring = useMemo(
    () => perceptualSpring("pop", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const snapSpring = useMemo(
    () => perceptualSpring("snap", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );

  const trayWidth =
    mainWidth + (showRetry ? preset.gap + retryWidth : 0) + 2 * preset.pad;
  const trayHeight = preset.height + 2 * preset.pad;

  const isClickableIdle =
    status === "idle" && (!isControlled || Boolean(onTrigger));

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-slot="status-pill"
        data-status={status}
        data-theme={theme}
        className={cn(
          "relative select-none tabular-nums",
          fullWidth ? "block w-full" : "inline-block",
          className,
        )}
        style={style}
      >
        {/* Offscreen sizers for exact pill widths */}
        <div
          aria-hidden="true"
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-nowrap"
          style={{ fontSize: preset.fontSize }}
        >
          <span
            ref={mainSizerRef}
            className="inline-flex items-center gap-2 rounded-full font-semibold"
            style={{
              height: preset.height,
              paddingLeft: Math.round((preset.height - preset.iconSize) / 2),
              paddingRight: Math.round(
                (preset.height - preset.iconSize) / 2 + preset.height * 0.18,
              ),
            }}
          >
            <span
              style={{ width: preset.iconSize, height: preset.iconSize }}
              className="inline-block shrink-0"
            />
            <span>{currentLabel}</span>
          </span>

          <span
            ref={retrySizerRef}
            className="inline-flex items-center gap-2 rounded-full font-semibold"
            style={{
              height: preset.height,
              paddingLeft: Math.round((preset.height - preset.iconSize) / 2),
              paddingRight: Math.round(
                (preset.height - preset.iconSize) / 2 + preset.height * 0.18,
              ),
            }}
          >
            <span
              style={{ width: preset.iconSize, height: preset.iconSize }}
              className="inline-block shrink-0"
            />
            <span>{retryLabel}</span>
          </span>
        </div>

        <motion.div
          animate={fullWidth ? undefined : { width: trayWidth }}
          transition={reduceMotion ? { duration: 0 } : morphSpring}
          style={{
            width: fullWidth ? "100%" : undefined,
            height: trayHeight,
            padding: fullWidth && !showTray ? 0 : preset.pad,
            borderRadius: fullWidth ? 9999 : trayHeight / 2,
          }}
          className={cn(
            "relative flex items-center overflow-hidden transition-[background-color,box-shadow] duration-200",
            showTray
              ? isDark
                ? "bg-[#26262b] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_1px_1px_rgba(0,0,0,0.3),0_6px_16px_-6px_rgba(0,0,0,0.45),0_22px_44px_-24px_rgba(0,0,0,0.6)]"
                : "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04),0_6px_16px_-6px_rgba(0,0,0,0.1),0_22px_44px_-24px_rgba(0,0,0,0.16)]"
              : "bg-transparent shadow-none",
          )}
        >
          {/* Live status announcement for assistive tech */}
          <output aria-live="polite" className="sr-only">
            {currentLabel}
          </output>

          {/* Main status capsule */}
          <ButtonPrimitive
            aria-label={currentLabel}
            disabled={!isClickableIdle}
            onClick={() => {
              if (!isClickableIdle) return;
              if (isControlled) onTrigger?.();
              else startDemoRun();
            }}
            render={
              <motion.button
                type="button"
                animate={fullWidth ? undefined : { width: mainWidth }}
                transition={reduceMotion ? { duration: 0 } : morphSpring}
                whileHover={
                  isClickableIdle && !reduceMotion ? { scale: 1.02 } : undefined
                }
                whileTap={
                  isClickableIdle && !reduceMotion ? { scale: 0.97 } : undefined
                }
                style={{
                  borderRadius: 9999,
                  width: fullWidth && !showRetry ? "100%" : undefined,
                  height: preset.height,
                  fontSize: preset.fontSize,
                  paddingLeft: Math.round(
                    (preset.height - preset.iconSize) / 2,
                  ),
                  paddingRight: Math.round(
                    (preset.height - preset.iconSize) / 2 +
                      preset.height * 0.18,
                  ),
                }}
              />
            }
            className={cn(
              "relative flex shrink-0 items-center overflow-hidden rounded-full font-semibold whitespace-nowrap outline-none transition-colors duration-200",
              status === "idle" && !showIdleIcon ? "gap-0" : "gap-2",
              fullWidth && "flex-1 justify-center",
              "focus-visible:ring-2 focus-visible:ring-offset-2",
              isDark
                ? "focus-visible:ring-[#60a5fa]/60 focus-visible:ring-offset-[#26262b]"
                : "focus-visible:ring-[#0062d6]/55 focus-visible:ring-offset-white",
              status === "done"
                ? isDark
                  ? "cursor-default bg-[#16a34a] text-white"
                  : "cursor-default bg-[#15803d] text-white"
                : status === "failed"
                  ? isDark
                    ? "cursor-default bg-[#451a1f] text-[#ff5c61]"
                    : "cursor-default bg-[#fef2f2] text-[#dc2626]"
                  : isClickableIdle
                    ? isDark
                      ? "cursor-pointer bg-[#323238] text-[#ffffff] hover:bg-[#3c3c44]"
                      : "cursor-pointer bg-[#f2f2f2] text-[#111111] hover:bg-[#e7e7ea]"
                    : isDark
                      ? "cursor-default bg-[#323238] text-[#ffffff]"
                      : "cursor-default bg-[#f2f2f2] text-[#111111]",
            )}
          >
            {showSheen && (
              <motion.span
                aria-hidden="true"
                initial={{ x: "-115%" }}
                animate={{ x: "115%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.7, 0.25, 1] }}
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 32%, rgba(255,255,255,0.52) 50%, transparent 68%)",
                }}
              />
            )}

            {/* Status icon / progress ring slot */}
            {(status !== "idle" || showIdleIcon) && (
              <span
                style={{ width: preset.iconSize, height: preset.iconSize }}
                className="relative inline-flex shrink-0 items-center justify-center"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {status === "syncing" ? (
                    <motion.svg
                      key="ring"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      initial={
                        reduceMotion
                          ? false
                          : { opacity: 0, scale: 0.6, filter: "blur(3px)" }
                      }
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={
                        reduceMotion
                          ? undefined
                          : { opacity: 0, scale: 0.6, filter: "blur(3px)" }
                      }
                      transition={popSpring}
                      className="h-[116%] w-[116%] -rotate-90"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth={2.6}
                        stroke={
                          isDark
                            ? "rgba(110, 136, 255, 0.24)"
                            : "rgba(51, 85, 255, 0.22)"
                        }
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth={2.6}
                        strokeLinecap="round"
                        stroke={isDark ? "#60a5fa" : "#0062d6"}
                        strokeDasharray={RING_CIRCUMFERENCE.toFixed(2)}
                        strokeDashoffset={dashOffset.toFixed(2)}
                        style={{
                          transition: reduceMotion
                            ? "none"
                            : progressDurationMs !== undefined
                              ? `stroke-dashoffset ${progressDurationMs}ms linear`
                              : "stroke-dashoffset 380ms cubic-bezier(0.3, 0.7, 0.3, 1)",
                        }}
                      />
                    </motion.svg>
                  ) : (
                    <motion.span
                      key={status}
                      initial={
                        reduceMotion
                          ? false
                          : {
                              opacity: 0,
                              scale: 0.45,
                              rotate: -35,
                              filter: "blur(4px)",
                            }
                      }
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        filter: "blur(0px)",
                      }}
                      exit={
                        reduceMotion
                          ? undefined
                          : { opacity: 0, scale: 0.45, filter: "blur(4px)" }
                      }
                      transition={popSpring}
                      className={cn(
                        "absolute inset-0 flex items-center justify-center",
                        status === "idle" &&
                          (isDark ? "text-[#a1a1aa]" : "text-[#71717a]"),
                      )}
                    >
                      {status === "done" ? (
                        <CheckIcon className="h-full w-full" />
                      ) : status === "failed" ? (
                        <AlertIcon className="h-full w-full" />
                      ) : (
                        <CloudCheckIcon className="h-full w-full" />
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            )}

            {/* Morphing status label */}
            <span className="relative inline-flex items-center overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={currentLabel}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: status === "syncing" ? 8 : 3,
                          filter: "blur(4px)",
                        }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 0,
                          y: status === "syncing" ? -8 : -3,
                          filter: "blur(4px)",
                        }
                  }
                  transition={snapSpring}
                  className="inline-block whitespace-nowrap"
                >
                  {currentLabel}
                </motion.span>
              </AnimatePresence>
            </span>
          </ButtonPrimitive>

          {/* Split-out Retry pill on failure */}
          <AnimatePresence initial={false}>
            {showRetry && (
              <ButtonPrimitive
                key="retry-btn"
                aria-label={retryLabel}
                onClick={() => {
                  onRetry?.(leftCount);
                  if (!isControlled) startDemoRun(leftCount);
                }}
                render={
                  <motion.button
                    type="button"
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            scale: 0.72,
                            x: -10,
                            filter: "blur(6px)",
                          }
                    }
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      filter: "blur(0px)",
                    }}
                    exit={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: 0,
                            scale: 0.72,
                            x: -10,
                            filter: "blur(6px)",
                          }
                    }
                    whileHover={!reduceMotion ? { scale: 1.03 } : undefined}
                    whileTap={!reduceMotion ? { scale: 0.96 } : undefined}
                    transition={popSpring}
                    style={{
                      marginLeft: preset.gap,
                      width: retryWidth,
                      height: preset.height,
                      fontSize: preset.fontSize,
                      paddingLeft: Math.round(
                        (preset.height - preset.iconSize) / 2,
                      ),
                      paddingRight: Math.round(
                        (preset.height - preset.iconSize) / 2 +
                          preset.height * 0.18,
                      ),
                    }}
                  />
                }
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-2 rounded-full font-semibold whitespace-nowrap outline-none transition-colors",
                  isDark
                    ? "bg-[#ffffff] text-[#111111] hover:bg-[#e7e7ea]"
                    : "bg-[#111111] text-white hover:bg-[#26262b]",
                )}
              >
                <span
                  style={{ width: preset.iconSize, height: preset.iconSize }}
                  className="inline-flex shrink-0 items-center justify-center"
                >
                  <RetryIcon className="h-full w-full" />
                </span>
                <span>{retryLabel}</span>
              </ButtonPrimitive>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
