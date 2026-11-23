"use client";

import { AnimateIcon } from "@animate-ui/react/icons";
import { Button as ButtonPrimitive } from "@ui-sdk/react/button";
import {
  AnimatePresence,
  MotionConfig,
  type MotionValue,
  motion,
  type Transition,
  useReducedMotion,
  useSpring,
} from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "@/registry/icons/check";
import { Undo2 } from "@/registry/icons/undo-2";
import { X } from "@/registry/icons/x";

export type ApproveRejectStatus = "idle" | "approved" | "rejected";
export type ApproveRejectSize = "sm" | "md" | "lg" | "xl";
export type ApproveRejectTheme = "dark" | "light";

export interface ApproveRejectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  approveLabel?: string;
  approvedLabel?: string;
  rejectLabel?: string;
  rejectedLabel?: string;
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
  pxPx: number;
  contentGapPx: number;
  textClass: string;
  iconSize: number;
}

const SIZE_PRESETS: Record<ApproveRejectSize, SizePreset> = {
  sm: {
    pillHeightClass: "h-9",
    btnPx: 36,
    gapPx: 8,
    pxPx: 14,
    contentGapPx: 6,
    textClass: "text-xs",
    iconSize: 17,
  },
  md: {
    pillHeightClass: "h-11",
    btnPx: 44,
    gapPx: 10,
    pxPx: 18,
    contentGapPx: 7,
    textClass: "text-sm",
    iconSize: 19,
  },
  lg: {
    pillHeightClass: "h-12",
    btnPx: 48,
    gapPx: 10,
    pxPx: 20,
    contentGapPx: 8,
    textClass: "text-base",
    iconSize: 21,
  },
  xl: {
    pillHeightClass: "h-[54px]",
    btnPx: 54,
    gapPx: 12,
    pxPx: 24,
    contentGapPx: 9,
    textClass: "text-[17px]",
    iconSize: 23,
  },
};

const THEME_STYLES: Record<
  ApproveRejectTheme | "default",
  {
    neutralPill: string;
    neutralInk: string;
    approveIcon: string;
    rejectIcon: string;
    approvedPill: string;
    rejectedPill: string;
  }
> = {
  dark: {
    neutralPill: "bg-[#26262b] hover:bg-[#2f2f36]",
    neutralInk: "text-white",
    approveIcon: "text-[#30d158]",
    rejectIcon: "text-[#ff5c61]",
    approvedPill: "bg-[#15803d] text-white",
    rejectedPill: "bg-[#dc2626] text-white",
  },
  light: {
    neutralPill: "bg-white hover:bg-[#f7f7f8]",
    neutralInk: "text-[#111111]",
    approveIcon: "text-[#16a34a]",
    rejectIcon: "text-[#dc2626]",
    approvedPill: "bg-[#15803d] text-white",
    rejectedPill: "bg-[#dc2626] text-white",
  },
  default: {
    neutralPill:
      "bg-[#f2f2f2] hover:bg-[#e7e7ea] dark:bg-[#26262b] dark:hover:bg-[#2f2f36]",
    neutralInk: "text-[#111111] dark:text-white",
    approveIcon: "text-[#16a34a] dark:text-[#30d158]",
    rejectIcon: "text-[#dc2626] dark:text-[#ff5c61]",
    approvedPill: "bg-[#15803d] text-white",
    rejectedPill: "bg-[#dc2626] text-white",
  },
};

const WIDTH_SPRING = { stiffness: 420, damping: 28, mass: 0.8 } as const;
const ZERO_TRANSITION: Transition = { duration: 0 };
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

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
    opacity: { duration: 0.24, delay: 0.04, ease: "easeOut" },
    filter: { duration: 0.38, delay: 0.04, ease: EASE_OUT },
    scale: { type: "spring", visualDuration: 0.32, bounce: 0.18 },
  };
  const exit: Transition = {
    opacity: { duration: 0.16, ease: "easeIn" },
    filter: { duration: 0.24, ease: "easeIn" },
    scale: { duration: 0.16, ease: "easeIn" },
  };
  return {
    initial: { opacity: 0, scale: 0.9, filter: "blur(6px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: enter },
    exit: { opacity: 0, scale: 0.9, filter: "blur(6px)", transition: exit },
  };
}

interface DecisionSlotProps {
  part: "reject-pill" | "approve-pill";
  mode: "idle" | "active" | "undo";
  interactive: boolean;
  disabled: boolean;
  focusableWhenDisabled: boolean;
  measured: boolean;
  widthSpring: MotionValue<number>;
  ariaLabel: string;
  dim: SizePreset;
  pillClass: string;
  idleIconClass: string;
  idleLabel: string;
  activeLabel: string;
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
  interactive,
  disabled,
  focusableWhenDisabled,
  measured,
  widthSpring,
  ariaLabel,
  dim,
  pillClass,
  idleIconClass,
  idleLabel,
  activeLabel,
  idleStroke,
  activeStroke,
  Icon,
  swapProps,
  onPress,
}: DecisionSlotProps) {
  return (
    <AnimateIcon animateOnHover={interactive && !disabled} asChild>
      <ButtonPrimitive
        type="button"
        disabled={disabled}
        focusableWhenDisabled={focusableWhenDisabled}
        aria-label={ariaLabel}
        aria-pressed={mode === "active"}
        onClick={onPress}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-0 p-0 font-medium shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_5px_rgba(0,0,0,0.04),0_12px_26px_-4px_rgba(0,0,0,0.08)] transition-[color,background-color,border-color,scale] duration-150",
          pillClass,
          !measured && mode !== "undo" && "px-5",
          FOCUS_CLASS,
          DISABLED_CLASS,
          dim.pillHeightClass,
          dim.textClass,
          interactive
            ? "cursor-pointer active:scale-[0.96]"
            : "cursor-default active:scale-100",
        )}
        render={
          <motion.button
            data-part={part}
            style={
              measured
                ? { borderRadius: 9999, width: widthSpring }
                : { borderRadius: 9999 }
            }
          />
        }
      >
        <span className="pointer-events-none relative block size-full overflow-hidden rounded-[inherit]">
          <AnimatePresence initial={false}>
            {mode === "idle" && (
              <motion.span
                key={`${part}-idle`}
                {...swapProps}
                style={{ gap: dim.contentGapPx }}
                className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
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
                className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
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

            {mode === "undo" && (
              <motion.span
                key={`${part}-undo`}
                {...swapProps}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Undo2
                  animation="draw"
                  size={dim.iconSize}
                  strokeWidth={2.55}
                  className="shrink-0"
                  aria-hidden="true"
                />
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
  const styles = theme ? THEME_STYLES[theme] : THEME_STYLES.default;

  const [internalStatus, setInternalStatus] =
    React.useState<ApproveRejectStatus>(defaultStatus);
  const isControlled = controlledStatus !== undefined;
  const status = isControlled ? controlledStatus : internalStatus;

  const sizerRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
  const [widths, setWidths] = React.useState<{
    idlePill: number;
    total: number;
  } | null>(null);

  const leftWidthSpring = useSpring(0, WIDTH_SPRING);
  const rightWidthSpring = useSpring(0, WIDTH_SPRING);
  const layoutKey = `${size}:${approveLabel}:${approvedLabel}:${rejectLabel}:${rejectedLabel}`;
  const settledLayoutKeyRef = React.useRef<string | null>(null);

  const measure = React.useCallback(() => {
    const measured = [0, 1, 2, 3].map((i) => sizerRefs.current[i]?.offsetWidth);
    if (measured.some((w) => !w)) return;
    const [r1, r2, a1, a2] = measured as [number, number, number, number];

    const pad = dim.pxPx * 2;
    const minIdle = Math.max(Math.ceil(r1 + pad), Math.ceil(a1 + pad));
    const minConfirmed = Math.max(Math.ceil(r2 + pad), Math.ceil(a2 + pad));
    const idlePill = Math.max(
      minIdle,
      Math.ceil((dim.btnPx + minConfirmed) / 2),
    );
    const total = idlePill * 2 + dim.gapPx;

    setWidths((prev) =>
      prev && prev.idlePill === idlePill && prev.total === total
        ? prev
        : { idlePill, total },
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
    ? widths.total - dim.gapPx - dim.btnPx
    : undefined;
  const leftTarget = widths
    ? status === "approved"
      ? dim.btnPx
      : status === "rejected"
        ? expandedWidth
        : widths.idlePill
    : undefined;
  const rightTarget = widths
    ? status === "rejected"
      ? dim.btnPx
      : status === "approved"
        ? expandedWidth
        : widths.idlePill
    : undefined;

  // Drive widths via imperative MotionValues so rapid clicks never strand declarative animate targets
  React.useLayoutEffect(() => {
    if (leftTarget === undefined || rightTarget === undefined) return;
    const layoutChanged = settledLayoutKeyRef.current !== layoutKey;
    if (layoutChanged || reduceMotion) {
      leftWidthSpring.jump(leftTarget);
      rightWidthSpring.jump(rightTarget);
      settledLayoutKeyRef.current = layoutKey;
    } else {
      leftWidthSpring.set(leftTarget);
      rightWidthSpring.set(rightTarget);
    }
  }, [
    leftTarget,
    rightTarget,
    layoutKey,
    reduceMotion,
    leftWidthSpring,
    rightWidthSpring,
  ]);

  const commitStatus = React.useCallback(
    (next: ApproveRejectStatus) => {
      if (!isControlled) setInternalStatus(next);
      onStatusChange?.(next);
    },
    [isControlled, onStatusChange],
  );

  const safeResetDelayMs = Math.max(400, resetDelayMs);
  React.useEffect(() => {
    if (!autoReset || status === "idle" || disabled) return;
    const timer = window.setTimeout(
      () => commitStatus("idle"),
      safeResetDelayMs,
    );
    return () => window.clearTimeout(timer);
  }, [autoReset, safeResetDelayMs, status, disabled, commitStatus]);

  const handleSlotPress = (side: "left" | "right") => {
    if (disabled) return;
    const targetStatus = side === "left" ? "rejected" : "approved";
    const undoFrom = side === "left" ? "approved" : "rejected";
    if (status === "idle") {
      commitStatus(targetStatus);
      if (targetStatus === "approved") onApprove?.();
      else onReject?.();
    } else if (status === undoFrom) {
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
    "pointer-events-none invisible fixed left-0 top-0 inline-flex items-center whitespace-nowrap font-medium",
    dim.textClass,
  );
  const measureLabels = [
    rejectLabel,
    rejectedLabel,
    approveLabel,
    approvedLabel,
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={forwardedRef}
        data-slot="approve-reject"
        data-status={status}
        data-theme={theme}
        style={{
          gap: dim.gapPx,
          width: widths ? widths.total : undefined,
        }}
        className={cn(
          "relative inline-flex items-center justify-center select-none",
          className,
        )}
        {...props}
      >
        {/* Offscreen sizers lock total container width so the gap slides without page shift */}
        {measureLabels.map((text, idx) => (
          <span
            key={
              (["reject", "rejected", "approve", "approved"] as const)[idx] ??
              text
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

        <DecisionSlot
          part="reject-pill"
          mode={leftMode}
          interactive={status === "idle" || status === "approved"}
          disabled={disabled}
          focusableWhenDisabled={focusableWhenDisabled}
          measured={Boolean(widths)}
          widthSpring={leftWidthSpring}
          ariaLabel={
            leftMode === "undo"
              ? "Undo approval"
              : leftMode === "active"
                ? rejectedLabel
                : rejectLabel
          }
          dim={dim}
          pillClass={
            leftMode === "active"
              ? styles.rejectedPill
              : cn(styles.neutralPill, styles.neutralInk)
          }
          idleIconClass={styles.rejectIcon}
          idleLabel={rejectLabel}
          activeLabel={rejectedLabel}
          idleStroke={2.65}
          activeStroke={2.75}
          Icon={X}
          swapProps={swapProps}
          onPress={() => handleSlotPress("left")}
        />

        <DecisionSlot
          part="approve-pill"
          mode={rightMode}
          interactive={status === "idle" || status === "rejected"}
          disabled={disabled}
          focusableWhenDisabled={focusableWhenDisabled}
          measured={Boolean(widths)}
          widthSpring={rightWidthSpring}
          ariaLabel={
            rightMode === "undo"
              ? "Undo rejection"
              : rightMode === "active"
                ? approvedLabel
                : approveLabel
          }
          dim={dim}
          pillClass={
            rightMode === "active"
              ? styles.approvedPill
              : cn(styles.neutralPill, styles.neutralInk)
          }
          idleIconClass={styles.approveIcon}
          idleLabel={approveLabel}
          activeLabel={approvedLabel}
          idleStroke={2.75}
          activeStroke={2.85}
          Icon={Check}
          swapProps={swapProps}
          onPress={() => handleSlotPress("right")}
        />
      </div>
    </MotionConfig>
  );
});

export default ApproveReject;
