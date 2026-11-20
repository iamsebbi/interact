"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/utils/cn";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Material Design 3 (M3) Animated Switch
 * ──────────────────────────────────────────────────────────
 * Follows the official Google Material 3 specification:
 * - Unchecked: Outlined track, compact 14px thumb (outline color).
 * - Checked: Solid primary filled track, expanded 20px thumb with M3 checkmark.
 * - Pressed: Thumb stretches horizontally (pill expansion) during tap/drag.
 * - Motion: Fluid physical spring physics (stiffness: 600, damping: 35).
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      showIcon = false,
      size = "md",
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledChecked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState<boolean>(
      isControlled ? controlledChecked! : defaultChecked
    );
    const [isPressed, setIsPressed] = React.useState(false);

    const isChecked = isControlled ? controlledChecked! : internalChecked;

    const toggle = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        const next = !isChecked;
        if (!isControlled) {
          setInternalChecked(next);
        }
        onCheckedChange?.(next);
        onClick?.(e);
      },
      [disabled, isChecked, isControlled, onCheckedChange, onClick]
    );

    // M3 Dimensions by size
    // md: 46px x 26px (track), thumb: 15px (off) -> 19px (on)
    // sm: 38px x 22px (track), thumb: 12px (off) -> 16px (on)
    // lg: 52px x 32px (track), thumb: 16px (off) -> 24px (on)
    const dimensions = React.useMemo(() => {
      switch (size) {
        case "sm":
          return {
            track: "w-[38px] h-[22px]",
            thumbOff: 12,
            thumbOn: 16,
            travel: 16,
            iconSize: 10,
          };
        case "lg":
          return {
            track: "w-[52px] h-[32px]",
            thumbOff: 18,
            thumbOn: 24,
            travel: 20,
            iconSize: 14,
          };
        case "md":
        default:
          return {
            track: "w-[46px] h-[26px]",
            thumbOff: 15,
            thumbOn: 19,
            travel: 20,
            iconSize: 12,
          };
      }
    }, [size]);

    const thumbWidth = isPressed
      ? (isChecked ? dimensions.thumbOn + 3 : dimensions.thumbOff + 5)
      : isChecked
      ? dimensions.thumbOn
      : dimensions.thumbOff;

    const thumbHeight = isChecked ? dimensions.thumbOn : dimensions.thumbOff;

    const thumbX = isChecked
      ? dimensions.travel - (isPressed ? 3 : 0)
      : 0;

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        data-slot="switch"
        data-checked={isChecked ? "" : undefined}
        aria-checked={isChecked}
        disabled={disabled}
        onClick={toggle}
        onPointerDown={() => {
          if (!disabled) setIsPressed(true);
        }}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            setIsPressed(true);
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") {
            setIsPressed(false);
          }
        }}
        className={cn(
          "group relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-[2.5px] transition-colors duration-200 outline-none select-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-40",
          dimensions.track,
          isChecked
            ? "bg-foreground border border-transparent shadow-xs"
            : "bg-input/90 hover:bg-input border border-border/90 hover:border-muted-foreground/40 shadow-inner",
          className
        )}
        {...props}
      >
        <motion.span
          data-slot="switch-thumb"
          layout
          initial={false}
          animate={{
            x: thumbX,
            width: thumbWidth,
            height: thumbHeight,
          }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 35,
          }}
          className={cn(
            "pointer-events-none flex items-center justify-center rounded-full transition-colors duration-200",
            isChecked
              ? "bg-background text-foreground shadow-sm"
              : "bg-muted-foreground group-hover:bg-foreground/90 shadow-xs"
          )}
        >
          {showIcon && (
            <motion.svg
              initial={false}
              animate={{
                scale: isChecked ? 1 : 0,
                opacity: isChecked ? 1 : 0,
              }}
              transition={{ duration: 0.15 }}
              style={{
                width: dimensions.iconSize,
                height: dimensions.iconSize,
              }}
              className="stroke-current flex-shrink-0"
              viewBox="0 0 12 12"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2.5 6 4.8 8.5 9.5 3.5" />
            </motion.svg>
          )}
        </motion.span>
      </button>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
