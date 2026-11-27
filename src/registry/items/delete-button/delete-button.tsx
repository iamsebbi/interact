"use client";

import { AnimateIcon } from "@animate-ui/react/icons";
import { Button as ButtonPrimitive } from "@ui-sdk/react/button";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import * as React from "react";
import { Check } from "@/components/animate-ui/icons/check";
import { Trash2 } from "@/components/animate-ui/icons/trash-2";
import { cn } from "@/lib/utils";

export type DeleteButtonStatus = "idle" | "confirming" | "deleted";
export type DeleteButtonSize = "sm" | "md" | "lg" | "xl";
export type DeleteButtonTheme = "dark" | "light";

export interface DeleteButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  confirmLabel?: string;
  cancelLabel?: string;
  deletedLabel?: string;
  showDeletedState?: boolean;
  deletedDurationMs?: number;
  size?: DeleteButtonSize;
  theme?: DeleteButtonTheme;
  showTray?: boolean;
  status?: DeleteButtonStatus;
  defaultStatus?: DeleteButtonStatus;
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
  replaySignal?: number;
  onStatusChange?: (status: DeleteButtonStatus) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDeleted?: () => void;
}

interface SizePreset {
  pillHeightClass: string;
  btnPx: number;
  trayPad: number;
  gapPx: number;
  gooBlur: number;
  pxPx: number;
  contentGapPx: number;
  textClass: string;
  iconSize: number;
}

const SIZE_PRESETS: Record<DeleteButtonSize, SizePreset> = {
  sm: {
    pillHeightClass: "h-9",
    btnPx: 36,
    trayPad: 4,
    gapPx: 9,
    gooBlur: 5,
    pxPx: 14,
    contentGapPx: 6,
    textClass: "text-xs",
    iconSize: 16,
  },
  md: {
    pillHeightClass: "h-11",
    btnPx: 44,
    trayPad: 5,
    gapPx: 10,
    gooBlur: 6.2,
    pxPx: 18,
    contentGapPx: 7,
    textClass: "text-sm",
    iconSize: 18,
  },
  lg: {
    pillHeightClass: "h-12",
    btnPx: 48,
    trayPad: 5,
    gapPx: 11,
    gooBlur: 6,
    pxPx: 22,
    contentGapPx: 8,
    textClass: "text-base",
    iconSize: 20,
  },
  xl: {
    pillHeightClass: "h-[54px]",
    btnPx: 54,
    trayPad: 6,
    gapPx: 12,
    gooBlur: 6.2,
    pxPx: 24,
    contentGapPx: 9,
    textClass: "text-[17px]",
    iconSize: 22,
  },
};

const THEME_STYLES: Record<
  DeleteButtonTheme | "default",
  {
    neutralPill: string;
    trayNeutralPill: string;
    neutralInk: string;
    redInk: string;
  }
> = {
  dark: {
    neutralPill: "bg-[#26262b]",
    trayNeutralPill: "bg-[#323238]",
    neutralInk: "text-white",
    redInk: "text-[#ff5c61]",
  },
  light: {
    neutralPill: "bg-white",
    trayNeutralPill: "bg-[#f2f2f2]",
    neutralInk: "text-[#111111]",
    redInk: "text-[#d62020]",
  },
  default: {
    neutralPill: "bg-[#f2f2f2] dark:bg-[#26262b]",
    trayNeutralPill: "bg-[#f2f2f2] dark:bg-[#323238]",
    neutralInk: "text-[#111111] dark:text-white",
    redInk: "text-[#d62020] dark:text-[#ff5c61]",
  },
};

const WIDTH_SPRING = { stiffness: 330, damping: 24, mass: 0.85 } as const;
const CANCEL_WIDTH_SPRING = { stiffness: 300, damping: 23, mass: 0.9 } as const;
const CANCEL_GAP_SPRING = { stiffness: 230, damping: 22, mass: 0.95 } as const;
const ZERO_TRANSITION: Transition = { duration: 0 };
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const FOCUS_CLASS =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const DISABLED_CLASS =
  "disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";

function bindPressHandlers(
  canPress: boolean,
  setPressed: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const reset = () => setPressed(false);
  return {
    onPointerDown: () => {
      if (canPress) setPressed(true);
    },
    onPointerUp: reset,
    onPointerLeave: reset,
    onPointerCancel: reset,
  };
}

/** Scoped SVG gooey filter kept separate from foreground labels so icons and text stay crisp. */
function useGooFilter(blur = 6, cut = 26) {
  const rawId = React.useId().replace(/:/g, "");
  const id = `delete-goo-${rawId}`;
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

function createSwapMotion(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      initial: false as const,
      animate: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: ZERO_TRANSITION,
      },
      exit: undefined,
      style: undefined,
    };
  }
  const enter: Transition = {
    opacity: { duration: 0.26, delay: 0.05, ease: "easeOut" },
    filter: { duration: 0.4, delay: 0.05, ease: [0.32, 0, 0.2, 1] },
    scale: { type: "spring", visualDuration: 0.32, bounce: 0.18 },
  };
  const exit: Transition = {
    filter: { duration: 0.22, ease: "easeOut" },
    opacity: { duration: 0.24, delay: 0.04, ease: [0.4, 0, 1, 1] },
    scale: { duration: 0.24, ease: EASE_OUT },
  };
  return {
    initial: { opacity: 0, scale: 0.9, filter: "blur(6px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: enter },
    exit: { opacity: 0, scale: 0.9, filter: "blur(6px)", transition: exit },
    style: undefined,
  };
}

/**
 * Circular delete trigger built on `@ui-sdk/react/button` that morphs via an
 * SVG gooey bridge into contextual Confirm and Cancel pill actions.
 */
export const DeleteButton = React.forwardRef<HTMLDivElement, DeleteButtonProps>(
  function DeleteButton(
    {
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      deletedLabel = "Deleted",
      showDeletedState = true,
      deletedDurationMs = 1400,
      size = "xl",
      theme = "light",
      showTray = true,
      status: controlledStatus,
      defaultStatus = "idle",
      disabled = false,
      focusableWhenDisabled = false,
      replaySignal = 0,
      onStatusChange,
      onConfirm,
      onCancel,
      onDeleted,
      className,
      ...props
    },
    forwardedRef,
  ) {
    const reduceMotion = Boolean(useReducedMotion());
    const dim = SIZE_PRESETS[size];
    const styles = theme ? THEME_STYLES[theme] : THEME_STYLES.default;
    const goo = useGooFilter(dim.gooBlur, 26);

    const [internalStatus, setInternalStatus] =
      React.useState<DeleteButtonStatus>(defaultStatus);
    const isControlled = controlledStatus !== undefined;
    const status = isControlled ? controlledStatus : internalStatus;

    const [isPrimaryPressed, setIsPrimaryPressed] = React.useState(false);
    const [isCancelPressed, setIsCancelPressed] = React.useState(false);

    const sizerRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
    const [widths, setWidths] = React.useState<{
      confirm: number;
      cancel: number;
      deleted: number;
    } | null>(null);

    const primaryWidthSpring = useSpring(dim.btnPx, WIDTH_SPRING);
    const cancelWidthSpring = useSpring(0, CANCEL_WIDTH_SPRING);
    const cancelGapSpring = useSpring(0, CANCEL_GAP_SPRING);
    const cancelBlobWidth = useMotionValue(dim.btnPx);
    const maxCancelWidth = widths ? widths.cancel : dim.btnPx;
    const layoutKey = `${size}:${confirmLabel}:${cancelLabel}:${deletedLabel}`;
    const settledLayoutKeyRef = React.useRef<string | null>(null);

    React.useLayoutEffect(() => {
      const syncBlobWidth = (w: number) => {
        cancelBlobWidth.set(Math.min(maxCancelWidth, Math.max(dim.btnPx, w)));
      };
      syncBlobWidth(cancelWidthSpring.get());
      return cancelWidthSpring.on("change", syncBlobWidth);
    }, [cancelWidthSpring, cancelBlobWidth, dim.btnPx, maxCancelWidth]);

    // Measure unscaled DOM widths so ancestor CSS scale() never skews springs
    const measure = React.useCallback(() => {
      const measured = [0, 1, 2].map((i) => {
        const el = sizerRefs.current[i];
        return el ? Math.ceil(Math.max(el.offsetWidth, el.scrollWidth)) : 0;
      });
      if (measured.some((w) => !w)) return;
      const [cW, xW, dW] = measured;
      const pad = dim.pxPx * 2;
      const confirmingPill = Math.max(dim.btnPx, cW + pad, xW + pad);
      const next = {
        confirm: confirmingPill,
        cancel: confirmingPill,
        deleted: Math.max(dim.btnPx, dW + pad),
      };
      setWidths((prev) =>
        prev &&
        prev.confirm === next.confirm &&
        prev.cancel === next.cancel &&
        prev.deleted === next.deleted
          ? prev
          : next,
      );
    }, [dim.btnPx, dim.pxPx]);

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

    const isConfirming = status === "confirming";
    const isDeleted = status === "deleted";

    const primaryTarget = widths
      ? isConfirming
        ? widths.confirm
        : isDeleted
          ? widths.deleted
          : dim.btnPx
      : dim.btnPx;
    const cancelTarget = widths && isConfirming ? widths.cancel : 0;
    const cancelGapTarget = isConfirming ? dim.gapPx : 0;

    React.useLayoutEffect(() => {
      if (!widths) return;
      const layoutChanged = settledLayoutKeyRef.current !== layoutKey;
      if (layoutChanged || reduceMotion) {
        primaryWidthSpring.jump(primaryTarget);
        cancelWidthSpring.jump(cancelTarget);
        cancelGapSpring.jump(cancelGapTarget);
        settledLayoutKeyRef.current = layoutKey;
      } else {
        primaryWidthSpring.set(primaryTarget);
        cancelWidthSpring.set(cancelTarget);
        cancelGapSpring.set(cancelGapTarget);
      }
    }, [
      widths,
      primaryTarget,
      cancelTarget,
      cancelGapTarget,
      layoutKey,
      reduceMotion,
      primaryWidthSpring,
      cancelWidthSpring,
      cancelGapSpring,
    ]);

    const commitStatus = React.useCallback(
      (next: DeleteButtonStatus) => {
        if (!isControlled) setInternalStatus(next);
        onStatusChange?.(next);
      },
      [isControlled, onStatusChange],
    );

    const safeDeletedMs = Math.max(500, deletedDurationMs);
    React.useEffect(() => {
      if (!isDeleted || disabled) return;
      const timer = window.setTimeout(() => {
        commitStatus("idle");
        onDeleted?.();
      }, safeDeletedMs);
      return () => window.clearTimeout(timer);
    }, [isDeleted, safeDeletedMs, disabled, commitStatus, onDeleted]);

    const triggerPrimaryStep = React.useCallback(() => {
      if (status === "idle") {
        commitStatus("confirming");
      } else if (status === "confirming") {
        onConfirm?.();
        commitStatus(showDeletedState ? "deleted" : "idle");
      }
    }, [status, showDeletedState, commitStatus, onConfirm]);

    const handlePrimaryPress = () => {
      if (disabled) return;
      setIsPrimaryPressed(false);
      triggerPrimaryStep();
    };

    const handleCancelPress = () => {
      if (disabled || !isConfirming) return;
      setIsCancelPressed(false);
      commitStatus("idle");
      onCancel?.();
    };

    const lastReplayRef = React.useRef(replaySignal);
    React.useEffect(() => {
      if (replaySignal === lastReplayRef.current) return;
      lastReplayRef.current = replaySignal;
      if (isDeleted) {
        commitStatus("idle");
      } else {
        triggerPrimaryStep();
      }
    }, [replaySignal, isDeleted, commitStatus, triggerPrimaryStep]);

    const swapProps = React.useMemo(
      () => createSwapMotion(reduceMotion),
      [reduceMotion],
    );

    const primaryCanTap = !disabled && !isDeleted;
    const cancelCanTap = isConfirming && !disabled;
    const primaryPressHandlers = bindPressHandlers(
      primaryCanTap,
      setIsPrimaryPressed,
    );
    const cancelPressHandlers = bindPressHandlers(
      cancelCanTap,
      setIsCancelPressed,
    );
    const isDark = theme === "dark";
    const pillSurfaceClass = cn(
      "shrink-0 transition-colors",
      showTray ? styles.trayNeutralPill : styles.neutralPill,
      dim.pillHeightClass,
    );
    const foregroundButtonBase = cn(
      "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-0 bg-transparent p-0 font-semibold transition-colors active:scale-100",
      FOCUS_CLASS,
      DISABLED_CLASS,
      dim.pillHeightClass,
      dim.textClass,
    );

    const measureRowClass = cn(
      "pointer-events-none invisible absolute top-0 left-0 inline-flex items-center whitespace-nowrap font-semibold",
      dim.textClass,
    );
    const measureSpecs = React.useMemo(
      () => [
        { id: "confirm", text: confirmLabel, hasIcon: false },
        { id: "cancel", text: cancelLabel, hasIcon: false },
        { id: "deleted", text: deletedLabel, hasIcon: true },
      ],
      [confirmLabel, cancelLabel, deletedLabel],
    );

    return (
      <MotionConfig reducedMotion="user">
        <div
          ref={forwardedRef}
          data-slot="delete-button"
          data-status={status}
          data-theme={theme}
          data-tray={showTray ? "true" : "false"}
          style={{
            padding: showTray ? dim.trayPad : 0,
            borderRadius: 9999,
          }}
          className={cn(
            "relative inline-flex items-center justify-center rounded-full font-sans select-none transition-[background-color,box-shadow] duration-200",
            showTray &&
              (isDark
                ? "bg-[#26262b] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_1px_1px_rgba(0,0,0,0.3),0_6px_16px_-6px_rgba(0,0,0,0.45),0_22px_44px_-24px_rgba(0,0,0,0.6)]"
                : "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04),0_6px_16px_-6px_rgba(0,0,0,0.1),0_22px_44px_-24px_rgba(0,0,0,0.16)]"),
            className,
          )}
          {...props}
        >
          <div className="relative inline-flex items-center justify-center">
            {goo.filterDef}

            {/* Offscreen sizers measure intrinsic label widths for smooth pill springs */}
            {measureSpecs.map(({ id, text, hasIcon }, idx) => (
              <span
                key={id}
                ref={(el) => {
                  sizerRefs.current[idx] = el;
                }}
                aria-hidden="true"
                className={measureRowClass}
                style={{ gap: hasIcon ? dim.contentGapPx : undefined }}
              >
                {hasIcon && (
                  <span
                    style={{ width: dim.iconSize, height: dim.iconSize }}
                    className="shrink-0"
                  />
                )}
                <span>{text}</span>
              </span>
            ))}

            {/* Gooey backdrop layer: solid shapes only so liquid bridge never blurs text */}
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 z-0",
                !showTray &&
                  "[filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.09))_drop-shadow(0_10px_20px_rgba(0,0,0,0.07))]",
              )}
            >
              <div
                style={{ filter: reduceMotion ? undefined : goo.url }}
                className={cn(
                  "flex size-full items-center justify-center",
                  disabled && "opacity-50",
                )}
              >
                <motion.span
                  animate={{
                    scale:
                      isPrimaryPressed && primaryCanTap && !reduceMotion
                        ? 0.96
                        : 1,
                  }}
                  transition={
                    reduceMotion
                      ? ZERO_TRANSITION
                      : { duration: 0.14, ease: EASE_OUT }
                  }
                  style={{
                    borderRadius: 9999,
                    width: widths ? primaryWidthSpring : dim.btnPx,
                  }}
                  className={cn("inline-block", pillSurfaceClass)}
                />

                <motion.div
                  style={{
                    width: cancelWidthSpring,
                    marginLeft: cancelGapSpring,
                  }}
                  className="flex shrink-0 items-center justify-end overflow-visible"
                >
                  <motion.span
                    initial={false}
                    animate={{
                      scale: !isConfirming
                        ? 0.76
                        : isCancelPressed && !disabled && !reduceMotion
                          ? 0.96
                          : 1,
                    }}
                    transition={
                      reduceMotion
                        ? ZERO_TRANSITION
                        : {
                            type: "spring",
                            stiffness: 320,
                            damping: 22,
                            mass: 0.85,
                          }
                    }
                    style={{
                      borderRadius: 9999,
                      width: widths ? cancelBlobWidth : dim.btnPx,
                    }}
                    className={cn("block", pillSurfaceClass)}
                  />
                </motion.div>
              </div>
            </div>

            {/* Interactive crisp foreground layer */}
            <div className="relative z-10 inline-flex items-center justify-center">
              <AnimateIcon animateOnHover={primaryCanTap} asChild>
                <ButtonPrimitive
                  type="button"
                  disabled={disabled}
                  focusableWhenDisabled={focusableWhenDisabled}
                  aria-label={
                    status === "idle"
                      ? "Delete"
                      : isConfirming
                        ? confirmLabel
                        : deletedLabel
                  }
                  onClick={handlePrimaryPress}
                  {...primaryPressHandlers}
                  className={cn(
                    "z-10",
                    foregroundButtonBase,
                    styles.redInk,
                    primaryCanTap ? "cursor-pointer" : "cursor-default",
                  )}
                  render={
                    <motion.button
                      data-part="delete-primary-pill"
                      whileTap={
                        primaryCanTap && !reduceMotion
                          ? { scale: 0.96 }
                          : undefined
                      }
                      style={{
                        borderRadius: 9999,
                        width: widths ? primaryWidthSpring : dim.btnPx,
                      }}
                    />
                  }
                >
                  <span className="pointer-events-none relative block size-full overflow-hidden rounded-[inherit]">
                    <AnimatePresence initial={false}>
                      {status === "idle" && (
                        <motion.span
                          key="delete-idle"
                          {...swapProps}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Trash2
                            size={dim.iconSize}
                            strokeWidth={2.35}
                            className="shrink-0"
                            aria-hidden="true"
                          />
                        </motion.span>
                      )}

                      {isConfirming && (
                        <motion.span
                          key="delete-confirm"
                          {...swapProps}
                          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                        >
                          <span>{confirmLabel}</span>
                        </motion.span>
                      )}

                      {isDeleted && (
                        <motion.span
                          key="delete-done"
                          {...swapProps}
                          style={{ gap: dim.contentGapPx }}
                          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                        >
                          <Check
                            size={dim.iconSize}
                            strokeWidth={2.7}
                            className="shrink-0"
                            aria-hidden="true"
                          />
                          <span>{deletedLabel}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </ButtonPrimitive>
              </AnimateIcon>

              <motion.div
                aria-hidden={!isConfirming}
                style={{
                  width: cancelWidthSpring,
                  marginLeft: cancelGapSpring,
                }}
                className={cn(
                  "relative z-10 flex shrink-0 items-center justify-end overflow-hidden rounded-full",
                  !isConfirming && "pointer-events-none",
                )}
              >
                <ButtonPrimitive
                  type="button"
                  disabled={disabled}
                  focusableWhenDisabled={focusableWhenDisabled}
                  tabIndex={isConfirming ? 0 : -1}
                  aria-label={cancelLabel}
                  onClick={handleCancelPress}
                  {...cancelPressHandlers}
                  className={cn(
                    "w-full",
                    foregroundButtonBase,
                    styles.neutralInk,
                    cancelCanTap ? "cursor-pointer" : "pointer-events-none",
                  )}
                  render={
                    <motion.button
                      data-part="delete-cancel-pill"
                      whileTap={
                        cancelCanTap && !reduceMotion
                          ? { scale: 0.96 }
                          : undefined
                      }
                      style={{ borderRadius: 9999 }}
                    />
                  }
                >
                  <span className="pointer-events-none relative block size-full overflow-hidden rounded-[inherit]">
                    <AnimatePresence initial={false}>
                      {isConfirming && (
                        <motion.span
                          key="delete-cancel"
                          {...swapProps}
                          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                        >
                          <span>{cancelLabel}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </ButtonPrimitive>
              </motion.div>
            </div>
          </div>
        </div>
      </MotionConfig>
    );
  },
);

export default DeleteButton;
