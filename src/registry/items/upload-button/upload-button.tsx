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

export type UploadButtonStatus =
  | "idle"
  | "uploading"
  | "error"
  | "completing"
  | "completed"
  | "copied";
export type UploadItemStatus = "pending" | "uploading" | "completed" | "error";

export interface UploadItemInput {
  id: string;
  name: string;
  sizeMB: number;
  thumbnail?: string | React.ReactNode;
  /** Optional simulated failure threshold (0-100) on the first pass when `simulateFailure` is true */
  failAtPercent?: number;
}

interface InternalUploadItem extends UploadItemInput {
  progress: number;
  status: UploadItemStatus;
  hasFailedOnce: boolean;
  speedMultiplier: number;
}

export interface UploadButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: UploadItemInput[];
  /** Override idle button text (defaults to `"Upload {count} {noun}"`) */
  label?: string;
  /** Noun used in generated copy like `"Upload 5 photos"` (pluralized automatically) */
  itemNoun?: string;
  copyLinkLabel?: string;
  copiedLabel?: string;
  shareUrl?: string;
  unit?: string;
  /** Base simulated upload duration in ms (default: 3200) */
  durationMs?: number;
  /** Pause on `"5 uploaded"` summary state before morphing to `"Copy link"` in ms (default: 1050) */
  summaryDurationMs?: number;
  /** Pause on `"Copied"` state before resetting to idle in ms (default: 1400) */
  copiedDurationMs?: number;
  /** Simulate one realistic partial failure so the Retry flow can be tested (default: true) */
  simulateFailure?: boolean;
  /** Keep trigger anchored at its Y coordinate (`true`, default) or drop dynamically from center when open (`false`) */
  anchored?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "dark" | "light";
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
  /** Pause simulation timers and frame loop cleanly without resetting state */
  paused?: boolean;
  /** Automatically retry an errored item after this delay in ms */
  autoRetryDelayMs?: number;
  /** Automatically copy link after summary reaches completed state in ms */
  autoCopyDelayMs?: number;
  /** Reset back to idle after showing copied label (default: true) */
  resetAfterCopied?: boolean;
  /** Incrementing this counter restarts the upload cycle */
  replaySignal?: number;
  onStatusChange?: (status: UploadButtonStatus) => void;
  onStart?: () => void;
  onItemError?: (item: UploadItemInput) => void;
  onItemRetry?: (item: UploadItemInput) => void;
  onAllUploaded?: () => void;
  onCopyLink?: () => void;
  onReset?: () => void;
}

interface SizePreset {
  pillHeightClass: string;
  pxPx: number;
  textClass: string;
  iconSize: number;
  iconGapPx: number;
  stackWidthPx: number;
  rowHeightClass: string;
  rowHeightPx: number;
  rowGapClass: string;
  rowGapPx: number;
  stackGapPx: number;
  emergeStepPx: number;
  thumbSizeClass: string;
  rowTitleClass: string;
  rowSubClass: string;
}

const SIZE_PRESETS: Record<"sm" | "md" | "lg" | "xl", SizePreset> = {
  sm: {
    pillHeightClass: "h-9",
    pxPx: 14,
    textClass: "text-xs",
    iconSize: 14,
    iconGapPx: 6,
    stackWidthPx: 248,
    rowHeightClass: "h-11",
    rowHeightPx: 44,
    rowGapClass: "gap-1.5",
    rowGapPx: 6,
    stackGapPx: 8,
    emergeStepPx: 42,
    thumbSizeClass: "size-[30px]",
    rowTitleClass: "text-xs",
    rowSubClass: "text-[10px]",
  },
  md: {
    pillHeightClass: "h-11",
    pxPx: 18,
    textClass: "text-sm",
    iconSize: 16,
    iconGapPx: 7,
    stackWidthPx: 278,
    rowHeightClass: "h-12",
    rowHeightPx: 48,
    rowGapClass: "gap-2",
    rowGapPx: 8,
    stackGapPx: 10,
    emergeStepPx: 46,
    thumbSizeClass: "size-[34px]",
    rowTitleClass: "text-[13px]",
    rowSubClass: "text-[11px]",
  },
  lg: {
    pillHeightClass: "h-12",
    pxPx: 22,
    textClass: "text-base",
    iconSize: 18,
    iconGapPx: 8,
    stackWidthPx: 308,
    rowHeightClass: "h-[52px]",
    rowHeightPx: 52,
    rowGapClass: "gap-2",
    rowGapPx: 8,
    stackGapPx: 12,
    emergeStepPx: 50,
    thumbSizeClass: "size-[38px]",
    rowTitleClass: "text-sm",
    rowSubClass: "text-xs",
  },
  xl: {
    pillHeightClass: "h-[54px]",
    pxPx: 24,
    textClass: "text-[17px]",
    iconSize: 19,
    iconGapPx: 8,
    stackWidthPx: 332,
    rowHeightClass: "h-[56px]",
    rowHeightPx: 56,
    rowGapClass: "gap-2.5",
    rowGapPx: 10,
    stackGapPx: 12,
    emergeStepPx: 54,
    thumbSizeClass: "size-[42px]",
    rowTitleClass: "text-sm",
    rowSubClass: "text-xs",
  },
};

export const DEFAULT_UPLOAD_ITEMS: UploadItemInput[] = [
  {
    id: "solstice",
    name: "Solstice.jpg",
    sizeMB: 3.2,
    thumbnail: "/images/gradients/solstice.jpg",
  },
  {
    id: "petal",
    name: "Petal.jpg",
    sizeMB: 1.8,
    thumbnail: "/images/gradients/petal.jpg",
    failAtPercent: 32,
  },
];

const SPRING_OPEN: Transition = {
  type: "spring",
  visualDuration: 0.28,
  bounce: 0.25,
};
const SPRING_CLOSE: Transition = {
  type: "spring",
  visualDuration: 0.28,
  bounce: 0,
};
const SPRING_PRESS: Transition = {
  type: "spring",
  visualDuration: 0.26,
  bounce: 0.3,
};
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const SPEED_MULTIPLIERS = [1.06, 1.18, 0.92, 1.12, 1.0];

const FOCUS_CLASS =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const DISABLED_CLASS =
  "disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";

const clampProgress = (v: number) => Math.max(0, Math.min(100, v));

function createInitialItems(
  items: UploadItemInput[],
  initialStatus: UploadItemStatus = "pending",
): InternalUploadItem[] {
  return items.map((item, idx) => ({
    ...item,
    progress: 0,
    status: initialStatus,
    hasFailedOnce: false,
    speedMultiplier: SPEED_MULTIPLIERS[idx % SPEED_MULTIPLIERS.length],
  }));
}

function createMotionTimings(reduceMotion: boolean) {
  const zero: Transition = { duration: 0 };
  const spring = (s: Transition): Transition => (reduceMotion ? zero : s);
  const tween = (duration: number, delay = 0): Transition =>
    reduceMotion
      ? zero
      : { duration, ...(delay ? { delay } : {}), ease: EASE_OUT };

  return {
    openTransition: spring(SPRING_OPEN),
    closeTransition: spring(SPRING_CLOSE),
    pressTransition: spring(SPRING_PRESS),
    enterSwapTransition: tween(0.24, 0.06),
    exitSwapTransition: tween(0.16),
    fillFadeTransition: tween(0.24),
  };
}

function buildSwapProps(
  reduceMotion: boolean,
  enterTransition: Transition,
  exitTransition: Transition,
  enterScale = 0.94,
) {
  if (reduceMotion) {
    return {
      initial: false as const,
      animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
      exit: undefined,
    };
  }
  return {
    initial: { opacity: 0, scale: enterScale, filter: "blur(6px)" },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: enterTransition,
    },
    exit: {
      opacity: 0,
      filter: "blur(6px)",
      scale: enterScale,
      transition: exitTransition,
    },
  };
}

function LinkChainIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ItemThumbnail({
  item,
  sizeClass,
  isDark,
}: {
  item: UploadItemInput;
  sizeClass: string;
  isDark: boolean;
}) {
  if (typeof item.thumbnail === "string") {
    return (
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full ring-1",
          isDark ? "ring-white/15" : "ring-black/10",
          sizeClass,
        )}
      >
        <img
          src={item.thumbnail}
          alt=""
          className="h-full w-full scale-[1.28] object-cover"
        />
      </span>
    );
  }
  if (item.thumbnail) return <>{item.thumbnail}</>;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1",
        isDark ? "bg-white/15 ring-white/15" : "bg-[#171717]/15 ring-black/10",
        sizeClass,
      )}
    >
      <span
        className={cn(
          "text-[10px] font-semibold uppercase",
          isDark ? "text-white/85" : "text-[#111111]/80",
        )}
      >
        {item.name.slice(0, 1)}
      </span>
    </span>
  );
}

/** Tracks unscaled DOM text width (`offsetWidth`/`scrollWidth`) so ancestor CSS `scale()` never double-scales the pill. */
function useMeasuredPillWidth(
  measureText: string,
  sizeKey: string,
  statusKey: string,
  dim: SizePreset,
  extraContentWidthPx: number,
  overrideWidthPx: number | null,
) {
  const measureRef = React.useRef<HTMLSpanElement | null>(null);
  const [contentWidth, setContentWidth] = React.useState<number | null>(null);
  const [isWidthReady, setIsWidthReady] = React.useState(false);

  React.useLayoutEffect(() => {
    void measureText;
    void sizeKey;
    void statusKey;
    void extraContentWidthPx;
    const el = measureRef.current;
    if (!el) return;
    const nextWidth = Math.max(el.offsetWidth, el.scrollWidth);
    if (nextWidth > 0)
      setContentWidth((prev) => (prev === nextWidth ? prev : nextWidth));
  }, [measureText, sizeKey, statusKey, extraContentWidthPx]);

  React.useEffect(() => {
    const raf = window.requestAnimationFrame(() => setIsWidthReady(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const targetPillWidth =
    overrideWidthPx !== null
      ? overrideWidthPx
      : contentWidth !== null
        ? contentWidth + extraContentWidthPx + dim.pxPx * 2 + 1
        : ("auto" as const);

  return { measureRef, targetPillWidth, isWidthReady };
}

interface UploadItemRowProps {
  item: InternalUploadItem;
  index: number;
  totalCount: number;
  unit: string;
  dim: SizePreset;
  isDark: boolean;
  disabled: boolean;
  focusableWhenDisabled: boolean;
  reduceMotion: boolean;
  timings: ReturnType<typeof createMotionTimings>;
  onRetry: (id: string) => void;
  fillRefs: React.MutableRefObject<Record<string, HTMLSpanElement | null>>;
  mbRefs: React.MutableRefObject<Record<string, HTMLSpanElement | null>>;
}

function UploadItemRow({
  item,
  index,
  totalCount,
  unit,
  dim,
  isDark,
  disabled,
  focusableWhenDisabled,
  reduceMotion,
  timings,
  onRetry,
  fillRefs,
  mbRefs,
}: UploadItemRowProps) {
  const isError = item.status === "error";
  const isDone = item.status === "completed";
  const currentMBText = ((item.progress / 100) * item.sizeMB).toFixed(1);
  const hiddenY = Math.round((totalCount - index) * dim.emergeStepPx);
  const enterDelay = (totalCount - 1 - index) * 0.024;
  const swap = buildSwapProps(
    reduceMotion,
    timings.enterSwapTransition,
    timings.exitSwapTransition,
    0.95,
  );

  return (
    <motion.div
      data-slot="upload-item"
      data-item-status={item.status}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: hiddenY, scale: 0.92, filter: "blur(6px)" }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: reduceMotion
          ? { duration: 0 }
          : {
              ...timings.openTransition,
              delay: enterDelay,
              opacity: { duration: 0.18, delay: enterDelay, ease: EASE_OUT },
            },
      }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: hiddenY,
              scale: 0.92,
              filter: "blur(6px)",
              transition: { ...timings.closeTransition, delay: index * 0.018 },
            }
      }
      className={cn(
        "group/row relative flex w-full items-center justify-between overflow-hidden rounded-full border px-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_-3px_rgba(0,0,0,0.06)] transition-[border-color,transform] duration-200",
        isDark
          ? "border-white/10 bg-[#26262b] text-white"
          : "border-black/[0.07] bg-white text-[#111111]",
        dim.rowHeightClass,
        isError &&
          !disabled &&
          (isDark
            ? "hover:border-white/25 active:scale-[0.985]"
            : "hover:border-black/20 active:scale-[0.985]"),
      )}
    >
      {isError && (
        <ButtonPrimitive
          type="button"
          disabled={disabled}
          focusableWhenDisabled={focusableWhenDisabled}
          onClick={() => onRetry(item.id)}
          aria-label={`Retry uploading ${item.name}`}
          title="Retry"
          className={cn(
            "absolute inset-0 z-20 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            DISABLED_CLASS,
          )}
        />
      )}

      <span
        ref={(el) => {
          fillRefs.current[item.id] = el;
        }}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 origin-left transition-opacity duration-200",
          isDark ? "bg-white/[0.14]" : "bg-[#171717]/[0.12]",
          isError ? "opacity-0" : "opacity-100",
        )}
        style={{ transform: `scaleX(${item.progress / 100})` }}
      />

      <div className="pointer-events-none relative z-10 flex min-w-0 items-center gap-2.5 pr-2">
        <ItemThumbnail
          item={item}
          sizeClass={dim.thumbSizeClass}
          isDark={isDark}
        />
        <div className="flex min-w-0 flex-col leading-tight">
          <span
            className={cn(
              "truncate font-medium tracking-tight",
              isDark ? "text-white" : "text-[#111111]",
              dim.rowTitleClass,
            )}
          >
            {item.name}
          </span>
          <div className={cn("relative h-4 overflow-hidden", dim.rowSubClass)}>
            <AnimatePresence mode="popLayout" initial={false}>
              {isError ? (
                <motion.span
                  key="err"
                  {...swap}
                  className={cn(
                    "inline-block font-medium",
                    isDark ? "text-[#ff6b70]" : "text-[#dc2626]",
                  )}
                >
                  Couldn&apos;t upload
                </motion.span>
              ) : isDone ? (
                <motion.span
                  key="done"
                  {...swap}
                  className={cn(
                    "inline-block tabular-nums",
                    isDark ? "text-white/60" : "text-[#6c6c6c]",
                  )}
                >
                  {item.sizeMB.toFixed(1)} {unit}
                </motion.span>
              ) : (
                <motion.span
                  key="prog"
                  {...swap}
                  className={cn(
                    "inline-flex items-baseline whitespace-pre tabular-nums",
                    isDark ? "text-white/60" : "text-[#6c6c6c]",
                  )}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  <span
                    ref={(el) => {
                      mbRefs.current[item.id] = el;
                    }}
                    className="tabular-nums"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {currentMBText}
                  </span>
                  <span>
                    {" "}
                    of {item.sizeMB.toFixed(1)} {unit}
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isError && (
          <motion.span
            key="retry-action"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, x: 8, scale: 0.92, filter: "blur(6px)" }
            }
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: timings.enterSwapTransition,
            }}
            exit={
              reduceMotion
                ? undefined
                : {
                    opacity: 0,
                    x: 6,
                    scale: 0.92,
                    filter: "blur(6px)",
                    transition: timings.exitSwapTransition,
                  }
            }
            className={cn(
              "pointer-events-none relative z-10 shrink-0 pr-2.5 text-xs font-semibold transition-opacity group-hover/row:opacity-80",
              isDark ? "text-[#ff6b70]" : "text-[#dc2626]",
            )}
          >
            Retry
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Encapsulates the simulated multi-item upload state machine, in-place rAF loop, and lifecycle timers. */
function useUploadSimulation(
  inputItems: UploadItemInput[],
  durationMs: number,
  summaryDurationMs: number,
  copiedDurationMs: number,
  simulateFailure: boolean,
  disabled: boolean,
  paused: boolean,
  autoRetryDelayMs: number | undefined,
  resetAfterCopied: boolean,
  replaySignal: number | undefined,
  callbacks: Pick<
    UploadButtonProps,
    | "onStatusChange"
    | "onStart"
    | "onItemError"
    | "onItemRetry"
    | "onAllUploaded"
    | "onReset"
  >,
) {
  const [status, setStatus] = React.useState<UploadButtonStatus>("idle");
  const [uploadItems, setUploadItems] = React.useState<InternalUploadItem[]>(
    () => createInitialItems(inputItems),
  );
  const [srProgress, setSrProgress] = React.useState(0);

  const itemsRef = React.useRef<InternalUploadItem[]>(uploadItems);
  itemsRef.current = uploadItems;
  const statusRef = React.useRef<UploadButtonStatus>(status);
  statusRef.current = status;
  const callbacksRef = React.useRef(callbacks);
  callbacksRef.current = callbacks;
  const prevReplayRef = React.useRef<number | undefined>(replaySignal);
  const fillRefs = React.useRef<Record<string, HTMLSpanElement | null>>({});
  const mbRefs = React.useRef<Record<string, HTMLSpanElement | null>>({});
  const srProgressRef = React.useRef(0);

  const updateStatus = React.useCallback((next: UploadButtonStatus) => {
    statusRef.current = next;
    setStatus(next);
    callbacksRef.current.onStatusChange?.(next);
  }, []);

  React.useEffect(() => {
    if (statusRef.current === "idle")
      setUploadItems(createInitialItems(inputItems));
  }, [inputItems]);

  const beginUpload = React.useCallback(() => {
    const fresh = createInitialItems(inputItems, "uploading");
    itemsRef.current = fresh;
    srProgressRef.current = 0;
    setSrProgress(0);
    setUploadItems(fresh);
    updateStatus("uploading");
    callbacksRef.current.onStart?.();
  }, [inputItems, updateStatus]);

  React.useEffect(() => {
    if (replaySignal === undefined || prevReplayRef.current === replaySignal)
      return;
    prevReplayRef.current = replaySignal;
    beginUpload();
  }, [replaySignal, beginUpload]);

  const hasUploadingItems = uploadItems.some(
    (item) => item.status === "uploading",
  );

  React.useEffect(() => {
    if (!hasUploadingItems || paused) return;
    const safeDuration = Math.max(500, durationMs);
    let rafId = 0;
    let lastTick: number | null = null;

    const step = (now: number) => {
      const dt = lastTick === null ? 0 : Math.min(80, now - lastTick);
      lastTick = now;

      const items = itemsRef.current;
      const failIdx = simulateFailure
        ? items.findIndex((it) => it.failAtPercent !== undefined)
        : -1;
      const targetFailIdx =
        simulateFailure && failIdx === -1 && items.length > 1
          ? Math.min(3, items.length - 1)
          : failIdx;

      let erroredItem: UploadItemInput | null = null;
      let statusChanged = false;
      let stillUploading = false;
      let totalProgress = 0;

      // Mutate progress in place and push visual updates straight to DOM refs (zero array allocations per frame)
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.status !== "uploading") {
          totalProgress += item.progress;
          continue;
        }

        const curve =
          item.progress < 25 ? 1.12 : item.progress > 82 ? 0.8 : 1.02;
        const nextProgress = clampProgress(
          item.progress +
            (dt / safeDuration) * 100 * curve * item.speedMultiplier,
        );
        const threshold = item.failAtPercent ?? 32;

        if (
          simulateFailure &&
          i === targetFailIdx &&
          !item.hasFailedOnce &&
          nextProgress >= threshold
        ) {
          item.progress = threshold;
          item.status = "error";
          item.hasFailedOnce = true;
          erroredItem = item;
          statusChanged = true;
        } else if (nextProgress >= 100) {
          item.progress = 100;
          item.status = "completed";
          statusChanged = true;
        } else {
          item.progress = nextProgress;
          stillUploading = true;

          const fillEl = fillRefs.current[item.id];
          if (fillEl) fillEl.style.transform = `scaleX(${nextProgress / 100})`;
          const mbEl = mbRefs.current[item.id];
          if (mbEl) {
            const text = ((nextProgress / 100) * item.sizeMB).toFixed(1);
            if (mbEl.textContent !== text) mbEl.textContent = text;
          }
        }
        totalProgress += item.progress;
      }

      const nextOverall =
        items.length > 0 ? Math.round(totalProgress / items.length) : 0;
      if (Math.abs(nextOverall - srProgressRef.current) >= 5 || statusChanged) {
        srProgressRef.current = nextOverall;
        setSrProgress(nextOverall);
      }

      if (statusChanged) {
        setUploadItems([...items]);
        if (erroredItem) callbacksRef.current.onItemError?.(erroredItem);

        if (items.every((it) => it.status === "completed")) {
          updateStatus("completing");
          callbacksRef.current.onAllUploaded?.();
          return;
        }
        const anyError = items.some((it) => it.status === "error");
        if (anyError && statusRef.current !== "error") updateStatus("error");
        else if (!anyError && statusRef.current !== "uploading")
          updateStatus("uploading");
      }

      if (stillUploading) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [hasUploadingItems, paused, durationMs, simulateFailure, updateStatus]);

  React.useEffect(() => {
    if (paused) return;
    if (status === "completing") {
      const t = window.setTimeout(
        () => updateStatus("completed"),
        Math.max(350, summaryDurationMs),
      );
      return () => window.clearTimeout(t);
    }
    if (status === "copied" && resetAfterCopied) {
      const t = window.setTimeout(
        () => {
          const resetItems = createInitialItems(inputItems);
          itemsRef.current = resetItems;
          setUploadItems(resetItems);
          updateStatus("idle");
          callbacksRef.current.onReset?.();
        },
        Math.max(400, copiedDurationMs),
      );
      return () => window.clearTimeout(t);
    }
  }, [
    paused,
    status,
    summaryDurationMs,
    copiedDurationMs,
    resetAfterCopied,
    inputItems,
    updateStatus,
  ]);

  const handleRetry = React.useCallback(
    (itemId: string) => {
      if (disabled) return;
      const target = itemsRef.current.find((it) => it.id === itemId);
      if (!target || target.status !== "error") return;

      const nextItems = itemsRef.current.map((it) =>
        it.id === itemId
          ? { ...it, status: "uploading" as const, progress: 0 }
          : it,
      );
      itemsRef.current = nextItems;
      setUploadItems(nextItems);
      updateStatus(
        nextItems.some((it) => it.status === "error") ? "error" : "uploading",
      );
      callbacksRef.current.onItemRetry?.(target);
    },
    [disabled, updateStatus],
  );

  React.useEffect(() => {
    if (paused || status !== "error" || autoRetryDelayMs === undefined) return;
    const errored = itemsRef.current.find((it) => it.status === "error");
    if (!errored) return;
    const t = window.setTimeout(
      () => handleRetry(errored.id),
      autoRetryDelayMs,
    );
    return () => window.clearTimeout(t);
  }, [paused, status, autoRetryDelayMs, handleRetry]);

  return {
    status,
    uploadItems,
    srProgress,
    updateStatus,
    beginUpload,
    handleRetry,
    fillRefs,
    mbRefs,
  };
}

/**
 * Interactive Upload Button built on ui-sdk (`Button` and `Progress`) and Motion springs.
 */
export const UploadButton = React.forwardRef<HTMLDivElement, UploadButtonProps>(
  (
    {
      items: inputItems = DEFAULT_UPLOAD_ITEMS,
      label,
      itemNoun = "photo",
      copyLinkLabel = "Copy link",
      copiedLabel = "Copied",
      shareUrl,
      unit = "MB",
      durationMs = 3200,
      summaryDurationMs = 1050,
      copiedDurationMs = 1400,
      simulateFailure = true,
      anchored = true,
      size = "xl",
      theme = "light",
      disabled = false,
      focusableWhenDisabled = false,
      paused = false,
      autoRetryDelayMs,
      autoCopyDelayMs,
      resetAfterCopied = true,
      replaySignal,
      onStatusChange,
      onStart,
      onItemError,
      onItemRetry,
      onAllUploaded,
      onCopyLink,
      onReset,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = Boolean(useReducedMotion());
    const dim = SIZE_PRESETS[size];
    const timings = createMotionTimings(reduceMotion);

    const pillColorClass =
      theme === "dark"
        ? "bg-[#26262b] text-white"
        : theme === "light"
          ? "bg-white text-[#111111]"
          : "bg-primary text-primary-foreground";
    const sheenClass =
      theme === "dark"
        ? "bg-white/15"
        : theme === "light"
          ? "bg-[#111111]/[0.06]"
          : "bg-primary-foreground/15";

    const {
      status,
      uploadItems,
      srProgress,
      updateStatus,
      beginUpload,
      handleRetry,
      fillRefs,
      mbRefs,
    } = useUploadSimulation(
      inputItems,
      durationMs,
      summaryDurationMs,
      copiedDurationMs,
      simulateFailure,
      disabled,
      paused,
      autoRetryDelayMs,
      resetAfterCopied,
      replaySignal,
      {
        onStatusChange,
        onStart,
        onItemError,
        onItemRetry,
        onAllUploaded,
        onReset,
      },
    );

    const handleMainClick = async () => {
      if (disabled) return;
      if (status === "idle") {
        beginUpload();
      } else if (status === "completed") {
        if (
          shareUrl &&
          typeof navigator !== "undefined" &&
          navigator.clipboard
        ) {
          try {
            await navigator.clipboard.writeText(shareUrl);
          } catch {}
        }
        onCopyLink?.();
        updateStatus("copied");
      }
    };

    React.useEffect(() => {
      if (paused || status !== "completed" || autoCopyDelayMs === undefined)
        return;
      const t = window.setTimeout(() => {
        onCopyLink?.();
        updateStatus("copied");
      }, autoCopyDelayMs);
      return () => window.clearTimeout(t);
    }, [paused, status, autoCopyDelayMs, onCopyLink, updateStatus]);

    const totalCount = uploadItems.length;
    const completedCount = uploadItems.filter(
      (it) => it.status === "completed",
    ).length;
    const nounPlural = totalCount === 1 ? itemNoun : `${itemNoun}s`;
    const idleText = label ?? `Upload ${totalCount} ${nounPlural}`;
    const uploadingText = `Uploading ${totalCount} ${nounPlural}`;
    const summaryText = `${totalCount} uploaded`;
    const countDigits = Math.max(1, String(totalCount).length);

    const isStackVisible = status === "uploading" || status === "error";
    const isCompletedGlow =
      status === "completing" || status === "completed" || status === "copied";
    const isInteractiveMain = status === "idle" || status === "completed";
    const isOpeningPhase = isStackVisible || status === "completing";
    const stackHeightPx =
      totalCount * dim.rowHeightPx +
      Math.max(0, totalCount - 1) * dim.rowGapPx +
      dim.stackGapPx;
    const dropOffsetPx = Math.round(stackHeightPx * 0.44);

    const statusCopy: Record<
      UploadButtonStatus,
      { measure: string; aria: string; scale: number }
    > = {
      idle: { measure: idleText, aria: idleText, scale: 0.94 },
      uploading: {
        measure: uploadingText,
        aria: `${uploadingText}, ${srProgress}%`,
        scale: 0.94,
      },
      error: {
        measure: `${"0".repeat(countDigits)} of ${totalCount} uploaded`,
        aria: `${completedCount} of ${totalCount} uploaded`,
        scale: 0.94,
      },
      completing: { measure: summaryText, aria: summaryText, scale: 0.95 },
      completed: { measure: copyLinkLabel, aria: copyLinkLabel, scale: 0.92 },
      copied: { measure: copiedLabel, aria: copiedLabel, scale: 0.92 },
    };

    const activeCopy = statusCopy[status];
    const extraIconWidthPx =
      status === "completed" || status === "copied"
        ? dim.iconSize + dim.iconGapPx
        : 0;

    const { measureRef, targetPillWidth, isWidthReady } = useMeasuredPillWidth(
      activeCopy.measure,
      size,
      status,
      dim,
      extraIconWidthPx,
      isOpeningPhase ? dim.stackWidthPx : null,
    );

    const pillSwap = buildSwapProps(
      reduceMotion,
      timings.enterSwapTransition,
      timings.exitSwapTransition,
      activeCopy.scale,
    );

    return (
      <MotionConfig reducedMotion="user">
        <div
          ref={ref}
          data-slot="upload-button"
          data-status={status}
          data-theme={theme}
          className={cn(
            "relative inline-flex items-center justify-center select-none",
            className,
          )}
          {...props}
        >
          {isStackVisible && (
            <ProgressPrimitive
              className="sr-only"
              value={srProgress}
              min={0}
              max={100}
              aria-label="Upload progress"
              getValueLabel={(value) =>
                `${completedCount} of ${totalCount} uploaded (${value ?? 0}%)`
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
            {activeCopy.measure}
          </span>

          <motion.div
            initial={false}
            animate={{ y: !anchored && status !== "idle" ? dropOffsetPx : 0 }}
            transition={
              status !== "idle"
                ? timings.openTransition
                : timings.closeTransition
            }
            className="relative inline-flex items-center justify-center"
          >
            <div
              data-slot="upload-stack"
              className={cn(
                "absolute bottom-full left-1/2 z-0 -translate-x-1/2 overflow-visible",
                !isStackVisible && "pointer-events-none",
              )}
              style={{ width: dim.stackWidthPx, paddingBottom: dim.stackGapPx }}
            >
              <div className={cn("flex flex-col", dim.rowGapClass)}>
                <AnimatePresence initial={false}>
                  {isStackVisible &&
                    uploadItems.map((item, index) => (
                      <UploadItemRow
                        key={item.id}
                        item={item}
                        index={index}
                        totalCount={totalCount}
                        unit={unit}
                        dim={dim}
                        isDark={theme === "dark"}
                        disabled={disabled}
                        focusableWhenDisabled={focusableWhenDisabled}
                        reduceMotion={reduceMotion}
                        timings={timings}
                        onRetry={handleRetry}
                        fillRefs={fillRefs}
                        mbRefs={mbRefs}
                      />
                    ))}
                </AnimatePresence>
              </div>
            </div>

            <AnimateIcon animateOnHover asChild>
              <ButtonPrimitive
                type="button"
                onClick={handleMainClick}
                disabled={disabled}
                focusableWhenDisabled={focusableWhenDisabled}
                aria-label={activeCopy.aria}
                className={cn(
                  "relative z-10 inline-flex shrink-0 items-center justify-center overflow-hidden font-medium shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_5px_rgba(0,0,0,0.04),0_12px_26px_-4px_rgba(0,0,0,0.08)] transition-colors active:scale-100",
                  pillColorClass,
                  FOCUS_CLASS,
                  DISABLED_CLASS,
                  dim.pillHeightClass,
                  dim.textClass,
                  isInteractiveMain ? "cursor-pointer" : "cursor-default",
                )}
                render={
                  <motion.button
                    data-slot="upload-pill"
                    initial={false}
                    animate={{
                      width: targetPillWidth,
                      paddingInline: dim.pxPx,
                    }}
                    whileTap={
                      !disabled && isInteractiveMain && !reduceMotion
                        ? { scale: 0.96, transition: timings.pressTransition }
                        : undefined
                    }
                    transition={
                      isWidthReady
                        ? isOpeningPhase
                          ? timings.openTransition
                          : timings.closeTransition
                        : { duration: 0 }
                    }
                    style={{ borderRadius: 9999 }}
                  />
                }
              >
                <AnimatePresence initial={false}>
                  {isCompletedGlow && (
                    <motion.span
                      key="completed-sheen"
                      aria-hidden="true"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={timings.fillFadeTransition}
                      className={cn(
                        "pointer-events-none absolute inset-0",
                        sheenClass,
                      )}
                    />
                  )}
                </AnimatePresence>

                <span className="relative z-10 grid w-full min-w-0 place-items-center whitespace-nowrap">
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={status}
                      {...pillSwap}
                      className="col-start-1 row-start-1 inline-flex items-center justify-center whitespace-nowrap tabular-nums"
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        ...(extraIconWidthPx > 0
                          ? { gap: dim.iconGapPx }
                          : undefined),
                      }}
                    >
                      {status === "error" ? (
                        <>
                          <span className="inline-grid items-baseline justify-items-end tabular-nums">
                            <span
                              aria-hidden="true"
                              className="invisible col-start-1 row-start-1 tabular-nums select-none"
                            >
                              {"0".repeat(countDigits)}
                            </span>
                            <span className="col-start-1 row-start-1 tabular-nums">
                              {completedCount}
                            </span>
                          </span>
                          <span className="whitespace-pre">
                            {" "}
                            of {totalCount} uploaded
                          </span>
                        </>
                      ) : status === "completed" ? (
                        <>
                          <LinkChainIcon size={dim.iconSize} />
                          <span>{copyLinkLabel}</span>
                        </>
                      ) : status === "copied" ? (
                        <>
                          <Check
                            size={dim.iconSize}
                            strokeWidth={2.6}
                            animate={!reduceMotion}
                            className="shrink-0"
                            aria-hidden="true"
                          />
                          <span>{copiedLabel}</span>
                        </>
                      ) : (
                        activeCopy.measure
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </ButtonPrimitive>
            </AnimateIcon>
          </motion.div>
        </div>
      </MotionConfig>
    );
  },
);

UploadButton.displayName = "UploadButton";

export default UploadButton;
