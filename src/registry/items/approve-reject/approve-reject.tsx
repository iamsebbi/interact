"use client";

import { AnimateIcon } from "@animate-ui/react/icons";
import { Button as ButtonPrimitive } from "@ui-sdk/react/button";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import * as React from "react";
import { Check } from "@/components/animate-ui/icons/check";
import { X } from "@/components/animate-ui/icons/x";
import { cn } from "@/lib/utils";

export type ApproveRejectStatus = "idle" | "approved" | "rejected";
export type ApproveRejectSize = "sm" | "md" | "lg" | "xl";
export type ApproveRejectTheme = "dark" | "light";

export interface ApproveRejectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  approveLabel?: string;
  approvedLabel?: string;
  rejectLabel?: string;
  rejectedLabel?: string;
  undoLabel?: string;
  showTray?: boolean;
  size?: ApproveRejectSize;
  theme?: ApproveRejectTheme;
  status?: ApproveRejectStatus;
  defaultStatus?: ApproveRejectStatus;
  autoReset?: boolean;
  resetDelayMs?: number;
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
  replaySignal?: number;
  onStatusChange?: (status: ApproveRejectStatus) => void;
  onApprove?: () => void;
  onReject?: () => void;
  onUndo?: (previousStatus: Exclude<ApproveRejectStatus, "idle">) => void;
}

interface SizePreset {
  pillHeightClass: string;
  btnPx: number;
  gapPx: number;
  trayPadPx: number;
  gooBlur: number;
  pxPx: number;
  contentGapPx: number;
  textClass: string;
  iconSize: number;
}

const SIZE_PRESETS: Record<ApproveRejectSize, SizePreset> = {
  sm: {
    pillHeightClass: "h-9",
    btnPx: 36,
    gapPx: 9,
    trayPadPx: 4,
    gooBlur: 5,
    pxPx: 14,
    contentGapPx: 6,
    textClass: "text-xs",
    iconSize: 16,
  },
  md: {
    pillHeightClass: "h-11",
    btnPx: 44,
    gapPx: 10,
    trayPadPx: 5,
    gooBlur: 6.2,
    pxPx: 18,
    contentGapPx: 7,
    textClass: "text-sm",
    iconSize: 18,
  },
  lg: {
    pillHeightClass: "h-12",
    btnPx: 48,
    gapPx: 11,
    trayPadPx: 5,
    gooBlur: 6,
    pxPx: 22,
    contentGapPx: 8,
    textClass: "text-base",
    iconSize: 20,
  },
  xl: {
    pillHeightClass: "h-[54px]",
    btnPx: 54,
    gapPx: 12,
    trayPadPx: 6,
    gooBlur: 6.2,
    pxPx: 24,
    contentGapPx: 9,
    textClass: "text-[17px]",
    iconSize: 22,
  },
};

const THEME_STYLES: Record<
  ApproveRejectTheme | "default",
  {
    tray: string;
    neutralPill: string;
    neutralInk: string;
    approveIcon: string;
    rejectIcon: string;
    approvedPill: string;
    rejectedPill: string;
  }
> = {
  dark: {
    tray: "bg-[#19191d] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    neutralPill: "bg-[#26262b] hover:bg-[#2f2f36]",
    neutralInk: "text-white",
    approveIcon: "text-[#30d158]",
    rejectIcon: "text-[#ff5c61]",
    approvedPill: "bg-[#15803d] text-white",
    rejectedPill: "bg-[#dc2626] text-white",
  },
  light: {
    tray: "bg-[#ebebee] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",
    neutralPill: "bg-white hover:bg-[#f7f7f8]",
    neutralInk: "text-[#111111]",
    approveIcon: "text-[#16a34a]",
    rejectIcon: "text-[#dc2626]",
    approvedPill: "bg-[#15803d] text-white",
    rejectedPill: "bg-[#dc2626] text-white",
  },
  default: {
    tray: "bg-[#e6e6ea] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:bg-[#19191d] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    neutralPill:
      "bg-[#f2f2f2] hover:bg-[#e7e7ea] dark:bg-[#26262b] dark:hover:bg-[#2f2f36]",
    neutralInk: "text-[#111111] dark:text-white",
    approveIcon: "text-[#16a34a] dark:text-[#30d158]",
    rejectIcon: "text-[#dc2626] dark:text-[#ff5c61]",
    approvedPill: "bg-[#15803d] text-white",
    rejectedPill: "bg-[#dc2626] text-white",
  },
};

const MORPH_DURATION_MS = 420;
const COLOR_DURATION_MS = 320;
const MORPH_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const ZERO_TRANSITION: Transition = { duration: 0 };
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Scoped SVG gooey filter kept separate from foreground labels so icons and text stay crisp. */
function useGooFilter(blur = 6, cut = 26) {
  const rawId = React.useId().replace(/:/g, "");
  const id = `approve-reject-goo-${rawId}`;
  const filterDef = React.useMemo(
    () => (
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-[0.001]"
      >
        <defs>
          <filter
            id={id}
            x="-20%"
            y="-45%"
            width="140%"
            height="190%"
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
    ),
    [id, blur, cut],
  );
  return { url: `url(#${id})`, filterDef };
}

const FOCUS_CLASS =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const DISABLED_CLASS =
  "disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";

interface SwapMotionProps {
  initial: false | { opacity: number; scale: number; filter: string };
  animate: {
    opacity: number;
    scale: number;
    filter: string;
    transition: Transition;
  };
  exit?: {
    opacity: number;
    scale: number;
    filter: string;
    transition: Transition;
  };
}

function createSwapMotion(reduceMotion: boolean): SwapMotionProps {
  if (reduceMotion) {
    return {
      initial: false,
      animate: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: ZERO_TRANSITION,
      },
      exit: undefined,
    };
  }
  const enter: Transition = {
    opacity: { duration: 0.26, ease: EASE_OUT },
    filter: { duration: 0.3, ease: EASE_OUT },
    scale: { duration: 0.28, ease: EASE_OUT },
  };
  const exit: Transition = {
    opacity: { duration: 0.18, ease: "easeIn" },
    filter: { duration: 0.2, ease: "easeIn" },
    scale: { duration: 0.18, ease: "easeIn" },
  };
  return {
    initial: { opacity: 0, scale: 0.92, filter: "blur(5px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: enter },
    exit: { opacity: 0, scale: 0.92, filter: "blur(5px)", transition: exit },
  };
}

interface UndoProgressCircleProps {
  size: number;
  durationMs: number;
  animateProgress: boolean;
  reduceMotion: boolean;
}

const PROGRESS_RADIUS = 9;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;

function UndoProgressCircle({
  size,
  durationMs,
  animateProgress,
  reduceMotion,
}: UndoProgressCircleProps) {
  const shouldAnimate = animateProgress && !reduceMotion;
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    if (!shouldAnimate) {
      setStarted(false);
      return;
    }
    const raf = window.requestAnimationFrame(() => {
      setStarted(true);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [shouldAnimate]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
      data-part="undo-progress"
    >
      <circle
        cx="12"
        cy="12"
        r={PROGRESS_RADIUS}
        stroke="currentColor"
        strokeOpacity={0.22}
        strokeWidth="2.5"
      />
      <circle
        cx="12"
        cy="12"
        r={PROGRESS_RADIUS}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        transform="rotate(-90 12 12)"
        strokeDasharray={PROGRESS_CIRCUMFERENCE}
        strokeDashoffset={shouldAnimate && started ? PROGRESS_CIRCUMFERENCE : 0}
        style={
          shouldAnimate
            ? {
                transition: `stroke-dashoffset ${durationMs}ms linear`,
              }
            : undefined
        }
      />
    </svg>
  );
}

interface DecisionSlotProps {
  part: "reject-pill" | "approve-pill";
  mode: "idle" | "active" | "undo";
  absorbed: boolean;
  interactive: boolean;
  disabled: boolean;
  focusableWhenDisabled: boolean;
  measured: boolean;
  targetWidth?: number;
  animateLayout: boolean;
  ariaLabel: string;
  dim: SizePreset;
  neutralInkClass: string;
  idleIconClass: string;
  idleLabel: string;
  activeLabel: string;
  undoLabel: string;
  undoDurationMs: number;
  undoAnimateProgress: boolean;
  reduceMotion: boolean;
  idleStroke: number;
  activeStroke: number;
  Icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  swapProps: SwapMotionProps;
  onPress: () => void;
}

function DecisionSlot({
  part,
  mode,
  absorbed,
  interactive,
  disabled,
  focusableWhenDisabled,
  measured,
  targetWidth,
  animateLayout,
  ariaLabel,
  dim,
  neutralInkClass,
  idleIconClass,
  idleLabel,
  activeLabel,
  undoLabel,
  undoDurationMs,
  undoAnimateProgress,
  reduceMotion,
  idleStroke,
  activeStroke,
  Icon,
  swapProps,
  onPress,
}: DecisionSlotProps) {
  return (
    <AnimateIcon animateOnHover={interactive && !disabled && !absorbed} asChild>
      <ButtonPrimitive
        type="button"
        data-part={part}
        disabled={disabled}
        focusableWhenDisabled={focusableWhenDisabled}
        tabIndex={absorbed ? -1 : undefined}
        aria-hidden={absorbed || undefined}
        aria-label={ariaLabel}
        aria-pressed={mode === "active"}
        onClick={onPress}
        style={{
          borderRadius: 9999,
          width: measured ? targetWidth : undefined,
          transition: animateLayout
            ? `width ${MORPH_DURATION_MS}ms ${MORPH_EASE}, transform 150ms ease`
            : "transform 150ms ease",
        }}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-0 bg-transparent p-0 font-medium",
          !measured && mode !== "undo" && "px-5",
          FOCUS_CLASS,
          DISABLED_CLASS,
          dim.pillHeightClass,
          dim.textClass,
          absorbed && "pointer-events-none",
          interactive && !absorbed
            ? "cursor-pointer active:scale-[0.96]"
            : "cursor-default active:scale-100",
        )}
      >
        <span className="pointer-events-none relative block size-full overflow-hidden rounded-[inherit]">
          <AnimatePresence initial={false}>
            {mode === "idle" && (
              <motion.span
                key={`${part}-idle`}
                {...swapProps}
                style={{ gap: dim.contentGapPx }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center whitespace-nowrap",
                  neutralInkClass,
                )}
              >
                <Icon
                  size={dim.iconSize}
                  strokeWidth={idleStroke}
                  className={cn("shrink-0", idleIconClass)}
                  aria-hidden="true"
                />
                <span>{idleLabel}</span>
              </motion.span>
            )}

            {mode === "active" && (
              <motion.span
                key={`${part}-active`}
                {...swapProps}
                style={{ gap: dim.contentGapPx }}
                className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-white"
              >
                <Icon
                  size={dim.iconSize}
                  strokeWidth={activeStroke}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span>{activeLabel}</span>
              </motion.span>
            )}

            {mode === "undo" && !absorbed && (
              <motion.span
                key={`${part}-undo`}
                {...swapProps}
                style={{ gap: dim.contentGapPx }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center whitespace-nowrap",
                  neutralInkClass,
                )}
              >
                <UndoProgressCircle
                  size={dim.iconSize}
                  durationMs={undoDurationMs}
                  animateProgress={undoAnimateProgress}
                  reduceMotion={reduceMotion}
                />
                <span>{undoLabel}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </ButtonPrimitive>
    </AnimateIcon>
  );
}

/**
 * Contextual two-button decision pair built on `@ui-sdk/react/button`.
 * Pressing Approve or Reject expands that pill into its colored confirmation
 * state while the opposite pill morphs into a circular Undo trigger.
 */
export const ApproveReject = React.forwardRef<
  HTMLDivElement,
  ApproveRejectProps
>(function ApproveReject(
  {
    approveLabel = "Approve",
    approvedLabel = "Approved",
    rejectLabel = "Reject",
    rejectedLabel = "Rejected",
    undoLabel = "Undo",
    showTray = true,
    size = "xl",
    theme = "light",
    status: controlledStatus,
    defaultStatus = "idle",
    autoReset = true,
    resetDelayMs = 2400,
    disabled = false,
    focusableWhenDisabled = false,
    replaySignal = 0,
    onStatusChange,
    onApprove,
    onReject,
    onUndo,
    className,
    ...props
  },
  forwardedRef,
) {
  const reduceMotion = Boolean(useReducedMotion());
  const dim = SIZE_PRESETS[size];
  const goo = useGooFilter(dim.gooBlur, 26);
  const styles = theme ? THEME_STYLES[theme] : THEME_STYLES.default;

  const [internalStatus, setInternalStatus] =
    React.useState<ApproveRejectStatus>(defaultStatus);
  const isControlled = controlledStatus !== undefined;
  const status = isControlled ? controlledStatus : internalStatus;
  const [undoExpired, setUndoExpired] = React.useState(false);

  const sizerRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
  const [widths, setWidths] = React.useState<{
    idlePill: number;
    undoPill: number;
    total: number;
  } | null>(null);

  const layoutKey = `${size}:${approveLabel}:${approvedLabel}:${rejectLabel}:${rejectedLabel}:${undoLabel}`;
  const [animateLayout, setAnimateLayout] = React.useState(false);
  const settledLayoutKeyRef = React.useRef<string | null>(null);

  const measure = React.useCallback(() => {
    const measured = [0, 1, 2, 3, 4].map(
      (i) => sizerRefs.current[i]?.offsetWidth,
    );
    if (measured.some((w) => !w)) return;
    const [r1, r2, a1, a2, u] = measured as [
      number,
      number,
      number,
      number,
      number,
    ];

    const pad = dim.pxPx * 2;
    const minIdle = Math.max(Math.ceil(r1 + pad), Math.ceil(a1 + pad));
    const minConfirmed = Math.max(Math.ceil(r2 + pad), Math.ceil(a2 + pad));
    const undoPill = Math.max(dim.btnPx, Math.ceil(u + pad));
    const idlePill = Math.max(
      minIdle,
      Math.ceil((undoPill + minConfirmed) / 2),
    );
    const total = idlePill * 2 + dim.gapPx;

    setWidths((prev) =>
      prev &&
      prev.idlePill === idlePill &&
      prev.undoPill === undoPill &&
      prev.total === total
        ? prev
        : { idlePill, undoPill, total },
    );
  }, [dim.btnPx, dim.gapPx, dim.pxPx]);

  React.useLayoutEffect(() => {
    void layoutKey;
    measure();
  }, [measure, layoutKey]);

  React.useEffect(() => {
    let active = true;
    document.fonts?.ready.then(() => {
      if (active) measure();
    });
    return () => {
      active = false;
    };
  }, [measure]);

  const expandedWidth = widths
    ? widths.total - dim.gapPx - widths.undoPill
    : undefined;
  const leftTarget = widths
    ? status === "approved"
      ? undoExpired
        ? 0
        : widths.undoPill
      : status === "rejected"
        ? expandedWidth
        : widths.idlePill
    : undefined;
  const rightTarget = widths
    ? status === "rejected"
      ? undoExpired
        ? 0
        : widths.undoPill
      : status === "approved"
        ? expandedWidth
        : widths.idlePill
    : undefined;
  const gapTarget = status !== "idle" && undoExpired ? 0 : dim.gapPx;

  // Enable CSS layout transitions only after initial measurement & layoutKey settle
  React.useLayoutEffect(() => {
    if (leftTarget === undefined || rightTarget === undefined) return;
    if (settledLayoutKeyRef.current !== layoutKey || reduceMotion) {
      settledLayoutKeyRef.current = layoutKey;
      setAnimateLayout(false);
      if (!reduceMotion) {
        const raf = window.requestAnimationFrame(() => setAnimateLayout(true));
        return () => window.cancelAnimationFrame(raf);
      }
      return;
    }
    setAnimateLayout(true);
  }, [leftTarget, rightTarget, layoutKey, reduceMotion]);

  const commitStatus = React.useCallback(
    (next: ApproveRejectStatus) => {
      if (next === "idle") setUndoExpired(false);
      if (!isControlled) setInternalStatus(next);
      onStatusChange?.(next);
    },
    [isControlled, onStatusChange],
  );

  React.useEffect(() => {
    if (status === "idle") setUndoExpired(false);
  }, [status]);

  const safeResetDelayMs = Math.max(400, resetDelayMs);
  const settledHoldMs = Math.max(800, Math.round(safeResetDelayMs * 0.7));
  React.useEffect(() => {
    if (!autoReset || status === "idle" || disabled) return;
    if (!undoExpired) {
      const expireTimer = window.setTimeout(
        () => setUndoExpired(true),
        safeResetDelayMs,
      );
      return () => window.clearTimeout(expireTimer);
    }
    const resetTimer = window.setTimeout(
      () => commitStatus("idle"),
      settledHoldMs,
    );
    return () => window.clearTimeout(resetTimer);
  }, [
    autoReset,
    safeResetDelayMs,
    settledHoldMs,
    status,
    undoExpired,
    disabled,
    commitStatus,
  ]);

  const handleSlotPress = (side: "left" | "right") => {
    if (disabled) return;
    const targetStatus = side === "left" ? "rejected" : "approved";
    const undoFrom = side === "left" ? "approved" : "rejected";
    if (status === "idle") {
      setUndoExpired(false);
      commitStatus(targetStatus);
      if (targetStatus === "approved") onApprove?.();
      else onReject?.();
    } else if (status === undoFrom && !undoExpired) {
      commitStatus("idle");
      onUndo?.(undoFrom);
    }
  };

  const lastReplayRef = React.useRef(replaySignal);
  const replayStepRef = React.useRef(0);
  React.useEffect(() => {
    if (replaySignal === lastReplayRef.current) return;
    lastReplayRef.current = replaySignal;
    if (status !== "idle") {
      const prev = status;
      commitStatus("idle");
      onUndo?.(prev);
      return;
    }
    const next = replayStepRef.current % 2 === 0 ? "approved" : "rejected";
    replayStepRef.current += 1;
    commitStatus(next);
    if (next === "approved") onApprove?.();
    else onReject?.();
  }, [replaySignal, status, commitStatus, onApprove, onReject, onUndo]);

  const swapProps = React.useMemo(
    () => createSwapMotion(reduceMotion),
    [reduceMotion],
  );

  const leftMode =
    status === "rejected" ? "active" : status === "approved" ? "undo" : "idle";
  const rightMode =
    status === "approved" ? "active" : status === "rejected" ? "undo" : "idle";

  const measureRowClass = cn(
    "pointer-events-none invisible absolute top-0 left-0 inline-flex items-center whitespace-nowrap font-medium",
    dim.textClass,
  );
  const measureLabels = [
    rejectLabel,
    rejectedLabel,
    approveLabel,
    approvedLabel,
    undoLabel,
  ];

  const leftAbsorbed = leftMode === "undo" && undoExpired;
  const rightAbsorbed = rightMode === "undo" && undoExpired;
  const blobTransition = animateLayout
    ? `width ${MORPH_DURATION_MS}ms ${MORPH_EASE}, transform ${MORPH_DURATION_MS}ms ${MORPH_EASE}, background-color ${COLOR_DURATION_MS}ms ${MORPH_EASE}`
    : undefined;
  const gapTransition = animateLayout
    ? `width ${MORPH_DURATION_MS}ms ${MORPH_EASE}`
    : undefined;

  const innerWidthTarget = widths
    ? status !== "idle" && undoExpired
      ? expandedWidth
      : widths.total
    : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={forwardedRef}
        data-slot="approve-reject"
        data-status={status}
        data-undo-expired={undoExpired ? "true" : "false"}
        data-tray={showTray ? "true" : "false"}
        data-theme={theme}
        style={{
          padding: showTray ? dim.trayPadPx : undefined,
        }}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full select-none",
          showTray && styles.tray,
          className,
        )}
        {...props}
      >
        {goo.filterDef}

        {/* Offscreen sizers lock total container width so the gap slides without page shift */}
        {measureLabels.map((text, idx) => (
          <span
            key={
              (["reject", "rejected", "approve", "approved", "undo"] as const)[
                idx
              ] ?? text
            }
            ref={(el) => {
              sizerRefs.current[idx] = el;
            }}
            aria-hidden="true"
            className={measureRowClass}
            style={{ gap: dim.contentGapPx }}
          >
            <span
              style={{ width: dim.iconSize, height: dim.iconSize }}
              className="shrink-0"
            />
            <span>{text}</span>
          </span>
        ))}

        <div
          style={{
            width: innerWidthTarget,
            transition: gapTransition,
          }}
          className="relative inline-flex items-center justify-center"
        >
          {/* Gooey backdrop layer: solid shapes only so liquid bridge never blurs text */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 [filter:drop-shadow(0_0_1px_rgba(0,0,0,0.08))_drop-shadow(0_2px_5px_rgba(0,0,0,0.04))_drop-shadow(0_12px_26px_-4px_rgba(0,0,0,0.08))]"
          >
            <div
              style={{ filter: reduceMotion ? undefined : goo.url }}
              className={cn(
                "flex size-full items-center justify-center",
                disabled && "opacity-50",
              )}
            >
              <span
                style={{
                  borderRadius: 9999,
                  width: widths ? leftTarget : undefined,
                  transform: leftAbsorbed ? "scale(0.72)" : "scale(1)",
                  transition: blobTransition,
                }}
                className={cn(
                  "inline-block shrink-0",
                  dim.pillHeightClass,
                  leftMode === "active"
                    ? styles.rejectedPill
                    : styles.neutralPill,
                )}
              />
              <span
                style={{ width: gapTarget, transition: gapTransition }}
                className="inline-block shrink-0"
              />
              <span
                style={{
                  borderRadius: 9999,
                  width: widths ? rightTarget : undefined,
                  transform: rightAbsorbed ? "scale(0.72)" : "scale(1)",
                  transition: blobTransition,
                }}
                className={cn(
                  "inline-block shrink-0",
                  dim.pillHeightClass,
                  rightMode === "active"
                    ? styles.approvedPill
                    : styles.neutralPill,
                )}
              />
            </div>
          </div>

          {/* Interactive crisp foreground layer */}
          <div className="relative z-10 flex size-full items-center justify-center">
            <DecisionSlot
              part="reject-pill"
              mode={leftMode}
              absorbed={leftAbsorbed}
              interactive={
                status === "idle" || (status === "approved" && !undoExpired)
              }
              disabled={disabled}
              focusableWhenDisabled={focusableWhenDisabled}
              measured={Boolean(widths)}
              targetWidth={leftTarget}
              animateLayout={animateLayout}
              ariaLabel={
                leftMode === "undo"
                  ? "Undo approval"
                  : leftMode === "active"
                    ? rejectedLabel
                    : rejectLabel
              }
              dim={dim}
              neutralInkClass={styles.neutralInk}
              idleIconClass={styles.rejectIcon}
              idleLabel={rejectLabel}
              activeLabel={rejectedLabel}
              undoLabel={undoLabel}
              undoDurationMs={safeResetDelayMs}
              undoAnimateProgress={autoReset && !disabled}
              reduceMotion={reduceMotion}
              idleStroke={2.65}
              activeStroke={2.75}
              Icon={X}
              swapProps={swapProps}
              onPress={() => handleSlotPress("left")}
            />

            <span
              aria-hidden="true"
              style={{ width: gapTarget, transition: gapTransition }}
              className="inline-block shrink-0"
            />

            <DecisionSlot
              part="approve-pill"
              mode={rightMode}
              absorbed={rightAbsorbed}
              interactive={
                status === "idle" || (status === "rejected" && !undoExpired)
              }
              disabled={disabled}
              focusableWhenDisabled={focusableWhenDisabled}
              measured={Boolean(widths)}
              targetWidth={rightTarget}
              animateLayout={animateLayout}
              ariaLabel={
                rightMode === "undo"
                  ? "Undo rejection"
                  : rightMode === "active"
                    ? approvedLabel
                    : approveLabel
              }
              dim={dim}
              neutralInkClass={styles.neutralInk}
              idleIconClass={styles.approveIcon}
              idleLabel={approveLabel}
              activeLabel={approvedLabel}
              undoLabel={undoLabel}
              undoDurationMs={safeResetDelayMs}
              undoAnimateProgress={autoReset && !disabled}
              reduceMotion={reduceMotion}
              idleStroke={2.75}
              activeStroke={2.85}
              Icon={Check}
              swapProps={swapProps}
              onPress={() => handleSlotPress("right")}
            />
          </div>
        </div>
      </div>
    </MotionConfig>
  );
});

export default ApproveReject;
