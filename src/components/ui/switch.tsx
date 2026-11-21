"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

export interface SwitchProps
  extends Omit<SwitchPrimitive.Root.Props, "size"> {
  size?: "sm" | "md" | "lg";
}

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
  // Concentric circular geometry matching Material Design 3 Measurements spec
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
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}

/**
 * Material Design 3 Animated Switch powered by `@base-ui/react/switch`
 * - Full Base UI primitive semantics: hidden `<input>`, `<form>` / `<label>` / `Field` support, `readOnly`, `required`, cancelable `onCheckedChange`, and `data-*` state attributes
 * - 5 interaction states: Enabled, Hovered, Focused, Pressed, Disabled
 * - Concentric circular handle (off < offPress / on < press) centered on track semicircles
 * - State-layer hover/focus/press halo around the handle
 * - Supports tap, click, drag-to-toggle, and keyboard toggle
 * - Defaults to `sm` (40×24) on desktop (>= 768px) and `md` (52×32) on mobile when `size` is omitted
 */
export const Switch = React.forwardRef<HTMLElement, SwitchProps>(
  (
    {
      size,
      className,
      disabled = false,
      readOnly = false,
      inputRef: externalInputRef,
      onClick,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = Boolean(useReducedMotion());
    const isDesktop = React.useSyncExternalStore(
      subscribeDesktopQuery,
      getDesktopSnapshot,
      () => false
    );
    const [isPressed, setIsPressed] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const internalInputRef = React.useRef<HTMLInputElement>(null);
    const pointerDownRef = React.useRef(false);
    const startXRef = React.useRef(0);
    const draggedRef = React.useRef(false);

    const mergedInputRef = React.useMemo(
      () => mergeRefs(internalInputRef, externalInputRef),
      [externalInputRef]
    );

    const resolvedSize = size ?? (isDesktop ? "sm" : "md");
    const dims = DIMENSIONS_BY_SIZE[resolvedSize];

    const springTransition = shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 560, damping: 32, mass: 0.9 };

    return (
      <SwitchPrimitive.Root
        ref={ref}
        data-slot="switch"
        disabled={disabled}
        readOnly={readOnly}
        inputRef={mergedInputRef}
        onClick={(e) => {
          if (draggedRef.current) {
            draggedRef.current = false;
            e.preventDefault();
            e.preventBaseUIHandler();
            return;
          }
          onClick?.(e);
        }}
        onPointerEnter={(e) => {
          const isDisabled =
            disabled ||
            Boolean(internalInputRef.current?.disabled) ||
            e.currentTarget.hasAttribute("data-disabled");
          if (!isDisabled) setIsHovered(true);
          onPointerEnter?.(e);
        }}
        onPointerLeave={(e) => {
          setIsHovered(false);
          if (!pointerDownRef.current) setIsPressed(false);
          onPointerLeave?.(e);
        }}
        onPointerDown={(e) => {
          onPointerDown?.(e);
          const isDisabled =
            disabled ||
            Boolean(internalInputRef.current?.disabled) ||
            e.currentTarget.hasAttribute("data-disabled");
          const isReadOnly =
            readOnly || e.currentTarget.hasAttribute("data-readonly");
          if (
            isDisabled ||
            isReadOnly ||
            (e.pointerType === "mouse" && e.button !== 0)
          ) {
            return;
          }
          pointerDownRef.current = true;
          startXRef.current = e.clientX;
          draggedRef.current = false;
          setIsPressed(true);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
        }}
        onPointerMove={(e) => {
          onPointerMove?.(e);
          const input = internalInputRef.current;
          const isReadOnly =
            readOnly || e.currentTarget.hasAttribute("data-readonly");
          if (
            !pointerDownRef.current ||
            !input ||
            input.disabled ||
            isReadOnly
          ) {
            return;
          }
          const dx = e.clientX - startXRef.current;
          if (!input.checked && dx > 6) {
            draggedRef.current = true;
            startXRef.current = e.clientX;
            input.click();
          } else if (input.checked && dx < -6) {
            draggedRef.current = true;
            startXRef.current = e.clientX;
            input.click();
          }
        }}
        onPointerUp={(e) => {
          onPointerUp?.(e);
          pointerDownRef.current = false;
          setIsPressed(false);
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {}
          if (draggedRef.current) {
            window.setTimeout(() => {
              draggedRef.current = false;
            }, 0);
          }
        }}
        onPointerCancel={(e) => {
          onPointerCancel?.(e);
          pointerDownRef.current = false;
          setIsPressed(false);
          draggedRef.current = false;
        }}
        onFocus={(e) => {
          const isDisabled =
            disabled ||
            Boolean(internalInputRef.current?.disabled) ||
            e.currentTarget.hasAttribute("data-disabled");
          if (!isDisabled && e.currentTarget.matches(":focus-visible")) {
            setIsFocused(true);
          }
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          setIsPressed(false);
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          const isDisabled =
            disabled ||
            Boolean(internalInputRef.current?.disabled) ||
            e.currentTarget.hasAttribute("data-disabled");
          const isReadOnly =
            readOnly || e.currentTarget.hasAttribute("data-readonly");
          if (
            !isDisabled &&
            !isReadOnly &&
            (e.key === " " || e.key === "Enter")
          ) {
            setIsPressed(true);
          }
          onKeyDown?.(e);
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") {
            setIsPressed(false);
          }
          onKeyUp?.(e);
        }}
        className={(state) =>
          cn(
            "group relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 outline-none select-none touch-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
            typeof className === "function" ? className(state) : className
          )
        }
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
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
            } = thumbProps as React.HTMLAttributes<HTMLSpanElement> & {
              ref?: React.Ref<HTMLSpanElement>;
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
              (isFocused ||
                isHovered ||
                (isPressed && isInteractive));

            return (
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{
                    x: activeCenterX - dims.haloSize / 2,
                    scale:
                      isPressed && isInteractive
                        ? 1.05
                        : showHalo
                        ? 1
                        : 0.72,
                    opacity:
                      isPressed && isInteractive ? 1 : showHalo ? 0.85 : 0,
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.16, ease: [0.22, 1, 0.36, 1] }
                  }
                  style={{ width: dims.haloSize, height: dims.haloSize }}
                  className={cn(
                    "absolute left-0 rounded-full transition-colors duration-150",
                    state.checked ? "bg-foreground/15" : "bg-foreground/12"
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
                    thumbBaseClassName
                  )}
                />
              </span>
            );
          }}
        />
      </SwitchPrimitive.Root>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
