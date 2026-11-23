"use client";

import { Field, FieldLabel } from "@ui-sdk/react/field";
import {
  Switch as SwitchPrimitive,
  SwitchThumb as SwitchThumbPrimitive,
} from "@ui-sdk/react/switch";
import { motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  type HTMLAttributes,
  type Ref,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";

interface SwitchDimensions {
  track: string;
  leftCenter: number;
  rightCenter: number;
  offSize: number;
  offPressSize: number;
  onSize: number;
  pressSize: number;
  haloSize: number;
}

const DIMENSIONS_BY_SIZE: Record<"sm" | "md" | "lg", SwitchDimensions> = {
  sm: {
    track: "w-[40px] h-[24px]",
    leftCenter: 12,
    rightCenter: 28,
    offSize: 12,
    offPressSize: 15,
    onSize: 18,
    pressSize: 21,
    haloSize: 30,
  },
  md: {
    track: "w-[52px] h-[32px]",
    leftCenter: 16,
    rightCenter: 36,
    offSize: 16,
    offPressSize: 20,
    onSize: 24,
    pressSize: 28,
    haloSize: 40,
  },
  lg: {
    track: "w-[60px] h-[36px]",
    leftCenter: 18,
    rightCenter: 42,
    offSize: 18,
    offPressSize: 22,
    onSize: 28,
    pressSize: 32,
    haloSize: 44,
  },
};

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

function subscribeDesktopQuery(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

export interface SwitchProps
  extends Omit<ComponentProps<typeof SwitchPrimitive>, "children"> {
  size?: "sm" | "md" | "lg";
  label?: string;
  rowClassName?: string;
}

export function Switch({
  size,
  className,
  rowClassName,
  label,
  disabled = false,
  readOnly = false,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  ...props
}: SwitchProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const isDesktop = useSyncExternalStore(
    subscribeDesktopQuery,
    getDesktopSnapshot,
    () => true,
  );
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const resolvedSize = size ?? (isDesktop ? "sm" : "md");
  const dims = DIMENSIONS_BY_SIZE[resolvedSize];

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 560, damping: 32, mass: 0.9 };

  const control = (
    <SwitchPrimitive
      disabled={disabled}
      readOnly={readOnly}
      onPointerEnter={(event) => {
        if (!disabled) setIsHovered(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setIsHovered(false);
        setIsPressed(false);
        onPointerLeave?.(event);
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (
          disabled ||
          readOnly ||
          (event.pointerType === "mouse" && event.button !== 0)
        ) {
          return;
        }
        setIsPressed(true);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        setIsPressed(false);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        setIsPressed(false);
      }}
      onFocus={(event) => {
        if (!disabled && event.currentTarget.matches(":focus-visible")) {
          setIsFocused(true);
        }
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocused(false);
        setIsPressed(false);
        onBlur?.(event);
      }}
      onKeyDown={(event) => {
        if (
          !disabled &&
          !readOnly &&
          (event.key === " " || event.key === "Enter")
        ) {
          setIsPressed(true);
        }
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") {
          setIsPressed(false);
        }
        onKeyUp?.(event);
      }}
      className={(state) =>
        cn(
          "group relative inline-flex shrink-0 touch-none items-center rounded-full transition-colors duration-200 outline-none select-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          state.disabled
            ? "cursor-not-allowed"
            : state.readOnly
              ? "cursor-default"
              : "cursor-pointer",
          dims.track,
          state.disabled
            ? state.checked
              ? "bg-foreground/20"
              : "bg-muted/25 ring-2 ring-inset ring-border/40"
            : state.checked
              ? "bg-foreground"
              : "bg-muted/50 ring-2 ring-inset ring-muted-foreground/45 hover:ring-muted-foreground/75",
          typeof className === "function" ? className(state) : className,
        )
      }
      {...props}
    >
      <SwitchThumbPrimitive
        render={(thumbProps, state) => {
          const {
            ref: thumbRef,
            className: thumbBaseClassName,
            style: _thumbStyle,
            onDrag: _onDrag,
            onDragStart: _onDragStart,
            onDragEnd: _onDragEnd,
            onAnimationStart: _onAnimationStart,
            ...restThumbProps
          } = thumbProps as HTMLAttributes<HTMLSpanElement> & {
            ref?: Ref<HTMLSpanElement>;
          };

          const activeCenterX = state.checked
            ? dims.rightCenter
            : dims.leftCenter;
          const isInteractive = !state.disabled && !state.readOnly;
          const thumbSize =
            isPressed && isInteractive
              ? state.checked
                ? dims.pressSize
                : dims.offPressSize
              : state.checked
                ? dims.onSize
                : dims.offSize;
          const showHalo =
            !state.disabled &&
            (isFocused || isHovered || (isPressed && isInteractive));

          return (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{
                  x: activeCenterX - dims.haloSize / 2,
                  scale:
                    isPressed && isInteractive ? 1.05 : showHalo ? 1 : 0.72,
                  opacity: isPressed && isInteractive ? 1 : showHalo ? 0.85 : 0,
                }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.16, ease: [0.22, 1, 0.36, 1] }
                }
                style={{ width: dims.haloSize, height: dims.haloSize }}
                className={cn(
                  "absolute left-0 rounded-full transition-colors duration-150",
                  state.checked ? "bg-foreground/15" : "bg-foreground/12",
                )}
              />
              <motion.span
                ref={thumbRef}
                {...restThumbProps}
                initial={false}
                animate={{
                  x: activeCenterX - thumbSize / 2,
                  width: thumbSize,
                  height: thumbSize,
                }}
                transition={springTransition}
                className={cn(
                  "rounded-full transition-colors duration-200",
                  state.disabled
                    ? state.checked
                      ? "bg-background/85"
                      : "bg-muted-foreground/40"
                    : state.checked
                      ? "bg-background shadow-sm"
                      : isPressed && isInteractive
                        ? "bg-foreground shadow-xs"
                        : isHovered || isFocused
                          ? "bg-foreground/85 shadow-xs"
                          : "bg-muted-foreground shadow-xs",
                  thumbBaseClassName,
                )}
              />
            </span>
          );
        }}
      />
    </SwitchPrimitive>
  );

  if (!label) return control;

  return (
    <Field
      className={cn(
        "control-row flex h-11 w-full items-center justify-between gap-2 rounded-xl px-3.5 text-xs select-none",
        rowClassName,
      )}
    >
      <FieldLabel className="cursor-pointer truncate font-normal text-muted-foreground">
        {label}
      </FieldLabel>
      {control}
    </Field>
  );
}
