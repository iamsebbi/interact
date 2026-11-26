"use client";

import { AnimateIcon } from "@animate-ui/react/icons";
import { Button as ButtonPrimitive } from "@ui-sdk/react/button";
import { Field as FieldPrimitive } from "@ui-sdk/react/field";
import { Input as InputPrimitive } from "@ui-sdk/react/input";
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
import { Search } from "@/components/animate-ui/icons/search";
import { X } from "@/components/animate-ui/icons/x";
import { cn } from "@/lib/utils";

export type SearchButtonSize = "sm" | "md" | "lg" | "xl";
export type SearchButtonTheme = "dark" | "light";
export type SearchButtonOpenChangeReason =
  | "trigger"
  | "escape"
  | "outside"
  | "close"
  | "submit"
  | "programmatic";

export type SearchButtonValueChangeDetails = Parameters<
  NonNullable<React.ComponentProps<typeof InputPrimitive>["onValueChange"]>
>[1];

export interface SearchButtonProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, reason: SearchButtonOpenChangeReason) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (
    value: string,
    eventDetails?: SearchButtonValueChangeDetails,
  ) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  name?: string;
  size?: SearchButtonSize;
  theme?: SearchButtonTheme;
  expandedWidth?: number;
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
  closeOnOutsideClick?: boolean;
  clearOnClose?: boolean;
  closeOnSubmit?: boolean;
  magnetic?: boolean;
  magneticRadius?: number;
  magneticStrength?: number;
  replaySignal?: number;
  autoFocusOnOpen?: boolean;
  triggerAriaLabel?: string;
  inputAriaLabel?: string;
}

interface SizePreset {
  btnPx: number;
  textClass: string;
  iconSize: number;
  iconSlotPx: number;
  closeBtnPx: number;
  closeIconSize: number;
  defaultExpandedWidth: number;
}

const SIZE_PRESETS: Record<SearchButtonSize, SizePreset> = {
  sm: {
    btnPx: 36,
    textClass: "text-xs",
    iconSize: 16,
    iconSlotPx: 32,
    closeBtnPx: 26,
    closeIconSize: 14,
    defaultExpandedWidth: 240,
  },
  md: {
    btnPx: 44,
    textClass: "text-sm",
    iconSize: 18,
    iconSlotPx: 39,
    closeBtnPx: 32,
    closeIconSize: 16,
    defaultExpandedWidth: 280,
  },
  lg: {
    btnPx: 48,
    textClass: "text-base",
    iconSize: 20,
    iconSlotPx: 42,
    closeBtnPx: 36,
    closeIconSize: 18,
    defaultExpandedWidth: 300,
  },
  xl: {
    btnPx: 54,
    textClass: "text-[17px]",
    iconSize: 22,
    iconSlotPx: 47,
    closeBtnPx: 40,
    closeIconSize: 20,
    defaultExpandedWidth: 320,
  },
};

const THEME_STYLES: Record<
  SearchButtonTheme | "default",
  {
    surface: string;
    input: string;
    closeBtn: string;
  }
> = {
  dark: {
    surface: "bg-[#222226] text-white",
    input: "text-white placeholder:text-white/50 selection:bg-white/20",
    closeBtn: "text-white/75 hover:text-white hover:bg-white/15",
  },
  light: {
    surface: "bg-white text-[#111111]",
    input:
      "text-[#111111] placeholder:text-[#111111]/50 selection:bg-[#111111]/15",
    closeBtn: "text-[#111111]/70 hover:text-[#111111] hover:bg-black/8",
  },
  default: {
    surface: "bg-primary text-primary-foreground",
    input:
      "text-primary-foreground placeholder:text-primary-foreground/50 selection:bg-primary-foreground/20",
    closeBtn:
      "text-primary-foreground/75 hover:text-primary-foreground hover:bg-primary-foreground/15",
  },
};

const SPRINGS = {
  open: {
    type: "spring",
    visualDuration: 0.34,
    bounce: 0.32,
  } satisfies Transition,
  close: {
    type: "spring",
    visualDuration: 0.28,
    bounce: 0.14,
  } satisfies Transition,
  press: {
    type: "spring",
    visualDuration: 0.26,
    bounce: 0.34,
  } satisfies Transition,
  content: {
    type: "spring",
    visualDuration: 0.32,
    bounce: 0.28,
  } satisfies Transition,
  action: {
    type: "spring",
    visualDuration: 0.34,
    bounce: 0.36,
  } satisfies Transition,
  magnet: { stiffness: 260, damping: 18, mass: 0.6 },
} as const;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const ZERO_TRANSITION: Transition = { duration: 0 };

const FOCUS_RING_CLASS =
  "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";
const CONTAINER_FOCUS_CLASS =
  "has-[>button:focus-visible]:ring-2 has-[>button:focus-visible]:ring-ring has-[>button:focus-visible]:ring-offset-2 has-[>button:focus-visible]:ring-offset-background";
const DISABLED_CLASS =
  "disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";

function buildTimings(reduceMotion: boolean) {
  const spring = (t: Transition): Transition =>
    reduceMotion ? ZERO_TRANSITION : t;
  const tween = (duration: number, delay = 0): Transition =>
    reduceMotion
      ? ZERO_TRANSITION
      : { duration, ...(delay ? { delay } : {}), ease: EASE_OUT };

  return {
    open: spring(SPRINGS.open),
    close: spring(SPRINGS.close),
    press: spring(SPRINGS.press),
    contentEnter: reduceMotion
      ? ZERO_TRANSITION
      : {
          ...SPRINGS.content,
          opacity: tween(0.22, 0.04),
          filter: tween(0.26, 0.04),
        },
    contentExit: reduceMotion
      ? ZERO_TRANSITION
      : { ...SPRINGS.close, opacity: tween(0.14), filter: tween(0.14) },
    actionEnter: reduceMotion
      ? ZERO_TRANSITION
      : {
          ...SPRINGS.action,
          delay: 0.04,
          opacity: tween(0.2, 0.04),
          filter: tween(0.24, 0.04),
        },
    actionExit: tween(0.12),
  };
}

/** Tracks fine-pointer proximity around the static wrapper so magnetic offsets never oscillate. */
function useMagneticOffset(
  rootRef: React.RefObject<HTMLDivElement | null>,
  btnPx: number,
  enabled: boolean,
  radius: number,
  strength: number,
) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRINGS.magnet);
  const y = useSpring(rawY, SPRINGS.magnet);

  React.useEffect(() => {
    const reset = () => {
      rawX.set(0);
      rawY.set(0);
    };

    if (!enabled || radius <= 0 || strength <= 0) {
      reset();
      return;
    }

    const reach = btnPx / 2 + radius;
    const maxPull = Math.min(strength, reach * 0.32);

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Normalize by ancestor CSS scale (e.g. Studio zoom) so pull stays 1:1 in local pixels.
      const scale = rect.width > 0 ? Math.max(0.1, rect.width / btnPx) : 1;
      const dx = (e.clientX - (rect.left + rect.width / 2)) / scale;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / scale;
      const dist = Math.hypot(dx, dy);

      if (dist <= 0.5 || dist >= reach) {
        reset();
        return;
      }

      const pull = maxPull * Math.sin((dist / reach) * Math.PI);
      rawX.set((dx / dist) * pull);
      rawY.set((dy / dist) * pull);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("mouseleave", reset);
    };
  }, [btnPx, enabled, radius, rawX, rawY, rootRef, strength]);

  return { x, y };
}

function focusLater(ref: React.RefObject<HTMLElement | null>) {
  requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }));
}

export const SearchButton = React.forwardRef<HTMLDivElement, SearchButtonProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      onSearch,
      onClear,
      placeholder = "Search...",
      name,
      size = "xl",
      theme = "light",
      expandedWidth,
      disabled = false,
      focusableWhenDisabled = false,
      closeOnOutsideClick = true,
      clearOnClose = false,
      closeOnSubmit = false,
      magnetic = true,
      magneticRadius = 24,
      magneticStrength = 4,
      replaySignal,
      autoFocusOnOpen = true,
      triggerAriaLabel = "Open search",
      inputAriaLabel = "Search",
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const reduceMotion = Boolean(useReducedMotion());
    const dim = SIZE_PRESETS[size];
    const styles = THEME_STYLES[theme ?? "default"];
    const timings = React.useMemo(
      () => buildTimings(reduceMotion),
      [reduceMotion],
    );

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(defaultValue);
    const isOpen = controlledOpen ?? uncontrolledOpen;
    const currentValue = controlledValue ?? uncontrolledValue;
    const hasValue = currentValue.length > 0;

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const prevOpenRef = React.useRef(isOpen);
    const replayBootRef = React.useRef(replaySignal);

    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const setValue = React.useCallback(
      (next: string, details?: SearchButtonValueChangeDetails) => {
        if (controlledValue === undefined) setUncontrolledValue(next);
        onValueChange?.(next, details);
      },
      [controlledValue, onValueChange],
    );

    const setOpen = React.useCallback(
      (nextOpen: boolean, reason: SearchButtonOpenChangeReason) => {
        if (disabled && nextOpen) return;
        if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
        onOpenChange?.(nextOpen, reason);
        if (!nextOpen && clearOnClose && currentValue.length > 0) setValue("");
      },
      [
        clearOnClose,
        controlledOpen,
        currentValue.length,
        disabled,
        onOpenChange,
        setValue,
      ],
    );

    const collapseToTrigger = React.useCallback(
      (reason: SearchButtonOpenChangeReason) => {
        setOpen(false, reason);
        focusLater(triggerRef);
      },
      [setOpen],
    );

    React.useEffect(() => {
      if (autoFocusOnOpen && isOpen && !prevOpenRef.current)
        focusLater(inputRef);
      prevOpenRef.current = isOpen;
    }, [autoFocusOnOpen, isOpen]);

    React.useEffect(() => {
      if (replaySignal === undefined || replayBootRef.current === replaySignal)
        return;
      replayBootRef.current = replaySignal;
      if (!disabled) setOpen(!isOpen, "programmatic");
    }, [disabled, isOpen, replaySignal, setOpen]);

    React.useEffect(() => {
      if (!isOpen || !closeOnOutsideClick) return;
      const onPointerDown = (e: PointerEvent) => {
        const root = rootRef.current;
        if (!root) return;
        const inside =
          e.composedPath?.().includes(root) ?? root.contains(e.target as Node);
        if (!inside) setOpen(false, "outside");
      };
      document.addEventListener("pointerdown", onPointerDown);
      return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [closeOnOutsideClick, isOpen, setOpen]);

    const magnet = useMagneticOffset(
      rootRef,
      dim.btnPx,
      magnetic && !isOpen && !disabled && !reduceMotion,
      magneticRadius,
      magneticStrength,
    );

    const submitQuery = () => {
      onSearch?.(currentValue);
      if (closeOnSubmit) collapseToTrigger("submit");
    };

    const handleTriggerClick = () => {
      if (disabled) return;
      if (!isOpen) return setOpen(true, "trigger");
      if (currentValue.trim().length > 0) {
        submitQuery();
        if (closeOnSubmit) return;
      }
      focusLater(inputRef);
    };

    const handleActionClick = () => {
      if (disabled) return;
      if (hasValue) {
        setValue("");
        onClear?.();
        focusLater(inputRef);
      } else {
        collapseToTrigger("close");
      }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        collapseToTrigger("escape");
      } else if (e.key === "Enter") {
        submitQuery();
      }
    };

    // Derive concentric insets mathematically from circle diameter and glyph sizes.
    const iconInsetPx = (dim.btnPx - dim.iconSize) / 2;
    const closeMarginPx = (dim.btnPx - dim.closeBtnPx) / 2;
    const targetExpandedWidth = Math.max(
      Math.round(dim.btnPx * 2.5),
      expandedWidth ?? dim.defaultExpandedWidth,
    );
    const morphTransition = isOpen ? timings.open : timings.close;

    return (
      <MotionConfig reducedMotion="user">
        <div
          ref={setRootRef}
          data-slot="search-button"
          data-state={isOpen ? "open" : "closed"}
          data-open={isOpen ? "" : undefined}
          data-theme={theme}
          className={cn(
            "relative inline-flex items-center justify-center select-none",
            className,
          )}
          {...props}
        >
          <FieldPrimitive
            name={name}
            disabled={disabled}
            render={
              <motion.div
                initial={false}
                animate={{
                  width: isOpen ? targetExpandedWidth : dim.btnPx,
                }}
                whileTap={
                  !disabled && !isOpen && !reduceMotion
                    ? { scale: 0.94, transition: timings.press }
                    : undefined
                }
                transition={morphTransition}
                style={{
                  height: dim.btnPx,
                  borderRadius: 9999,
                  x: reduceMotion ? 0 : magnet.x,
                  y: reduceMotion ? 0 : magnet.y,
                }}
                className={cn(
                  "relative inline-flex items-center overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_5px_rgba(0,0,0,0.04),0_12px_26px_-4px_rgba(0,0,0,0.08)] transition-colors",
                  styles.surface,
                  CONTAINER_FOCUS_CLASS,
                  disabled && "cursor-not-allowed opacity-50",
                )}
              />
            }
          >
            <AnimateIcon animateOnHover asChild>
              <ButtonPrimitive
                ref={triggerRef}
                type="button"
                disabled={disabled}
                focusableWhenDisabled={focusableWhenDisabled}
                aria-expanded={isOpen}
                aria-label={
                  !isOpen
                    ? triggerAriaLabel
                    : hasValue
                      ? "Submit search"
                      : "Focus search input"
                }
                onClick={handleTriggerClick}
                className={cn(
                  "relative z-10 flex h-full shrink-0 cursor-pointer items-center justify-start rounded-full outline-none active:scale-100",
                  DISABLED_CLASS,
                )}
                render={
                  <motion.button
                    initial={false}
                    animate={{
                      width: isOpen ? dim.iconSlotPx : dim.btnPx,
                      paddingLeft: iconInsetPx,
                    }}
                    transition={morphTransition}
                  />
                }
              >
                <motion.span
                  initial={false}
                  animate={{ scale: isOpen ? 0.92 : 1 }}
                  transition={morphTransition}
                  className="inline-flex shrink-0 items-center justify-center"
                >
                  <Search
                    size={dim.iconSize}
                    strokeWidth={2.5}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                </motion.span>
              </ButtonPrimitive>
            </AnimateIcon>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="search-expanded-fields"
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          x: -10,
                          scale: 0.94,
                          filter: "blur(6px)",
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: timings.contentEnter,
                  }}
                  exit={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 0,
                          x: -8,
                          scale: 0.94,
                          filter: "blur(6px)",
                          transition: timings.contentExit,
                        }
                  }
                  className="flex h-full min-w-0 flex-1 origin-left items-center overflow-hidden"
                >
                  <InputPrimitive
                    ref={inputRef}
                    type="search"
                    enterKeyHint="search"
                    value={currentValue}
                    onValueChange={(next, details) => setValue(next, details)}
                    onKeyDown={handleInputKeyDown}
                    placeholder={placeholder}
                    aria-label={inputAriaLabel}
                    disabled={disabled}
                    className={cn(
                      "h-full w-full min-w-0 flex-1 bg-transparent pr-1.5 font-medium outline-none",
                      "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
                      styles.input,
                      dim.textClass,
                    )}
                  />

                  <AnimateIcon animateOnHover asChild>
                    <ButtonPrimitive
                      type="button"
                      disabled={disabled}
                      focusableWhenDisabled={focusableWhenDisabled}
                      aria-label={hasValue ? "Clear search" : "Close search"}
                      title={hasValue ? "Clear" : "Close"}
                      onClick={handleActionClick}
                      style={{
                        width: dim.closeBtnPx,
                        height: dim.closeBtnPx,
                        marginRight: closeMarginPx,
                      }}
                      className={cn(
                        "flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors active:scale-100",
                        styles.closeBtn,
                        FOCUS_RING_CLASS,
                        DISABLED_CLASS,
                      )}
                      render={
                        <motion.button
                          initial={
                            reduceMotion
                              ? false
                              : {
                                  opacity: 0,
                                  scale: 0.55,
                                  rotate: -45,
                                  filter: "blur(6px)",
                                }
                          }
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                            filter: "blur(0px)",
                            transition: timings.actionEnter,
                          }}
                          exit={
                            reduceMotion
                              ? undefined
                              : {
                                  opacity: 0,
                                  scale: 0.55,
                                  rotate: 45,
                                  filter: "blur(6px)",
                                  transition: timings.actionExit,
                                }
                          }
                          whileTap={
                            !disabled && !reduceMotion
                              ? { scale: 0.86, transition: timings.press }
                              : undefined
                          }
                        />
                      }
                    >
                      <X
                        size={dim.closeIconSize}
                        strokeWidth={2.75}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                    </ButtonPrimitive>
                  </AnimateIcon>
                </motion.div>
              )}
            </AnimatePresence>
          </FieldPrimitive>
        </div>
      </MotionConfig>
    );
  },
);

SearchButton.displayName = "SearchButton";

export default SearchButton;
