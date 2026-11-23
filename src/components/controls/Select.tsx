"use client";

import {
  type ListData,
  SelectContent as SelectContentPrimitive,
  SelectGroupLabel as SelectGroupLabelPrimitive,
  SelectGroup as SelectGroupPrimitive,
  SelectItemIndicator as SelectItemIndicatorPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectLabel as SelectLabelPrimitive,
  Select as SelectPrimitive,
  SelectSeparator as SelectSeparatorPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue as SelectValuePrimitive,
} from "@ui-sdk/react/select";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  type ComponentProps,
  Fragment,
  type ReactNode,
  useId,
  useState,
} from "react";
import { Check, ChevronDown } from "@/components/icons";
import { cn } from "@/lib/utils";

const LIST_CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const LIST_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const Select = SelectPrimitive;
export const SelectValue = SelectValuePrimitive;
export const SelectGroup = SelectGroupPrimitive;

export function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectLabelPrimitive>) {
  return (
    <SelectLabelPrimitive
      className={cn("text-[13px] text-muted-foreground", className)}
      {...props}
    />
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof SelectTriggerPrimitive>, "children"> & {
  children?: ReactNode;
}) {
  return (
    <SelectTriggerPrimitive
      className={cn(
        "control-row inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3.5 text-xs font-medium text-foreground outline-none transition-[background-color,color,scale] duration-150 ease-smooth active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-disabled:cursor-not-allowed data-disabled:opacity-45",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <ChevronDown
        size={14}
        className="shrink-0 text-muted-foreground transition-transform duration-200 ease-smooth in-data-open:rotate-180"
        aria-hidden="true"
      />
    </SelectTriggerPrimitive>
  );
}

export function SelectContent({
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof SelectContentPrimitive>) {
  return (
    <SelectContentPrimitive
      sideOffset={sideOffset}
      className={cn(
        "surface-popover z-50 min-w-(--anchor-width) max-h-(--available-height) overflow-y-auto rounded-[20px] border-0 p-1.5 text-popover-foreground outline-none origin-(--transform-origin) transition-[opacity,transform,border-radius] duration-200 ease-smooth data-starting-style:scale-[0.97] data-starting-style:rounded-[14px] data-starting-style:opacity-0 data-ending-style:scale-[0.97] data-ending-style:rounded-[14px] data-ending-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof SelectItemPrimitive>, "children"> & {
  children?: ReactNode;
}) {
  return (
    <SelectItemPrimitive
      className={cn(
        "flex min-h-10 cursor-pointer items-center justify-between gap-2 rounded-[14px] px-3 text-sm text-muted-foreground outline-none select-none transition-[color,background-color,scale] duration-150 active:scale-[0.98] data-highlighted:bg-secondary data-highlighted:font-medium data-highlighted:text-foreground data-selected:font-medium data-selected:text-foreground data-disabled:pointer-events-none data-disabled:opacity-45",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2 truncate">
        {children}
      </span>
      <SelectItemIndicatorPrimitive className="inline-flex shrink-0 items-center text-foreground">
        <Check size={14} aria-hidden="true" />
      </SelectItemIndicatorPrimitive>
    </SelectItemPrimitive>
  );
}

export function SelectGroupLabel({
  className,
  ...props
}: ComponentProps<typeof SelectGroupLabelPrimitive>) {
  return (
    <SelectGroupLabelPrimitive
      className={cn(
        "px-2.5 py-1.5 text-[11px] font-medium text-subtle-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectSeparatorPrimitive>) {
  return (
    <SelectSeparatorPrimitive
      className={cn("mx-3.5 my-2.5 h-px bg-border", className)}
      {...props}
    />
  );
}

export interface SelectFieldOption {
  value: string;
  label: string;
  swatch?: string;
  icon?: ReactNode;
  disabled?: boolean;
  separatorAfter?: boolean;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectFieldOption[];
  disabled?: boolean;
  showDividerAfterFirst?: boolean;
  showIconInTrigger?: boolean;
  renderIcon?: (
    option: SelectFieldOption,
    state: { isHovered: boolean; isSelected: boolean; inTrigger?: boolean },
  ) => ReactNode;
  className?: string;
}

export function SelectField({
  label,
  value,
  onValueChange,
  options,
  disabled = false,
  showDividerAfterFirst = false,
  showIconInTrigger = false,
  renderIcon,
  className,
}: SelectFieldProps) {
  const uid = useId();
  const reduceMotion = Boolean(useReducedMotion());
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);

  const items: ListData = [];
  options.forEach((option, index) => {
    items.push({
      value: option.value,
      label: option.label,
      disabled: option.disabled,
    });
    const shouldInsertDivider =
      option.separatorAfter ||
      (showDividerAfterFirst && index === 0 && options.length > 1);
    if (shouldInsertDivider && index < options.length - 1) {
      items.push({ type: "separator" });
    }
  });
  const activeOption = options.find((option) => option.value === value);
  const highlightTarget = highlightedValue ?? value;

  return (
    <SelectPrimitive
      items={items}
      value={value}
      disabled={disabled}
      onOpenChange={(open) => {
        if (!open) setHighlightedValue(null);
      }}
      onHighlight={(nextValue) => {
        setHighlightedValue(typeof nextValue === "string" ? nextValue : null);
      }}
      onValueChange={(next) => {
        if (typeof next === "string") onValueChange(next);
      }}
    >
      <SelectLabelPrimitive className="sr-only">{label}</SelectLabelPrimitive>
      <SelectTriggerPrimitive
        className={cn(
          "control-row group/select inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3.5 text-xs outline-none transition-[background-color,color,scale] duration-150 ease-smooth active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-disabled:cursor-not-allowed data-disabled:opacity-45",
          className,
        )}
      >
        <span className="shrink-0 font-normal text-muted-foreground">
          {label}
        </span>
        <span className="ml-2 flex min-w-0 items-center gap-1.5">
          {activeOption && renderIcon
            ? renderIcon(activeOption, {
                isHovered: false,
                isSelected: true,
                inTrigger: true,
              })
            : showIconInTrigger && activeOption?.icon}
          {activeOption?.swatch && (
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-full ring-1 ring-border"
              style={{ backgroundColor: activeOption.swatch }}
            />
          )}
          <SelectValuePrimitive className="truncate font-medium text-foreground" />
          <ChevronDown
            size={14}
            aria-hidden="true"
            className="shrink-0 text-muted-foreground transition-transform duration-200 ease-smooth in-data-open:rotate-180"
          />
        </span>
      </SelectTriggerPrimitive>
      <SelectContent className="no-scrollbar max-h-[min(320px,55dvh)]">
        <motion.div
          className="relative py-0.5"
          variants={reduceMotion ? undefined : LIST_CONTAINER_VARIANTS}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHovered = highlightedValue === option.value;
            const isActivePill = highlightTarget === option.value;
            const shouldInsertDivider =
              option.separatorAfter ||
              (showDividerAfterFirst && index === 0 && options.length > 1);

            return (
              <Fragment key={option.value}>
                <SelectItemPrimitive
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    "relative flex h-10 w-full cursor-pointer items-center rounded-[14px] px-3 text-sm outline-none select-none transition-[color,scale] duration-150 active:scale-[0.98] data-disabled:pointer-events-none data-disabled:opacity-45",
                    isSelected || isHovered
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {isActivePill && (
                    <motion.span
                      layoutId={`fluid-select-highlight-${uid}`}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0.5 inset-y-0 rounded-[14px] bg-secondary"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", bounce: 0.15, duration: 0.45 }
                      }
                    />
                  )}
                  <motion.span
                    variants={reduceMotion ? undefined : LIST_ITEM_VARIANTS}
                    className="relative z-10 flex min-w-0 items-center gap-2 truncate"
                  >
                    {renderIcon
                      ? renderIcon(option, {
                          isHovered,
                          isSelected,
                          inTrigger: false,
                        })
                      : option.icon}
                    {option.swatch && (
                      <span
                        aria-hidden="true"
                        className="size-3.5 shrink-0 rounded-full ring-1 ring-border"
                        style={{ backgroundColor: option.swatch }}
                      />
                    )}
                    <span className="truncate">{option.label}</span>
                  </motion.span>
                </SelectItemPrimitive>
                {shouldInsertDivider && index < options.length - 1 && (
                  <SelectSeparator />
                )}
              </Fragment>
            );
          })}
        </motion.div>
      </SelectContent>
    </SelectPrimitive>
  );
}
