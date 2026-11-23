"use client";

import NumberFlow from "@number-flow/react";
import {
  SliderControl,
  SliderIndicator,
  Slider as SliderPrimitive,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/react/slider";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  label: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  showTicks?: boolean;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

function stepDecimals(step: number): number {
  if (step <= 0) return 0;
  return (String(step).split(".")[1] ?? "").length;
}

export function Slider({
  label,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  showTicks = true,
  disabled = false,
  onValueChange,
  formatValue,
  className,
}: SliderProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const decimals = stepDecimals(step);
  const span = max - min;
  const stepCount = step > 0 && span > 0 ? Math.floor(span / step) : 0;

  const ticks =
    showTicks && stepCount > 0 && stepCount <= 50
      ? Array.from({ length: stepCount + 1 }, (_, index) => {
          const tickValue = Number((min + index * step).toFixed(decimals));
          return {
            value: tickValue,
            percent: span > 0 ? ((tickValue - min) / span) * 100 : 0,
          };
        })
      : [];

  const handleDoubleClick = () => {
    if (disabled || defaultValue === undefined) return;
    onValueChange?.(defaultValue);
  };

  return (
    <SliderPrimitive
      value={value}
      defaultValue={value === undefined ? (defaultValue ?? min) : undefined}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onValueChange={(next) => {
        const numeric = Array.isArray(next) ? next[0] : next;
        if (typeof numeric === "number") onValueChange?.(numeric);
      }}
      aria-label={label}
      title={
        defaultValue !== undefined ? `${label} · Double-click to reset` : label
      }
      onDoubleClick={handleDoubleClick}
      className={cn("group/slider relative w-full select-none", className)}
    >
      {(state) => {
        const current = Array.isArray(state.value)
          ? (state.value[0] ?? min)
          : state.value;
        const formattedNumber =
          decimals > 0
            ? Number(current.toFixed(decimals))
            : Math.round(current);

        return (
          <SliderControl className="control-row relative flex h-11 w-full cursor-ew-resize items-center overflow-hidden rounded-xl data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
            <SliderTrack className="relative h-full w-full overflow-hidden rounded-xl">
              <SliderIndicator className="absolute inset-y-0 left-0 min-w-[18px] rounded-xl bg-foreground/8 transition-[background-color] duration-150 group-not-data-dragging/slider:transition-[width,background-color] group-not-data-dragging/slider:duration-150 group-not-data-dragging/slider:ease-smooth after:absolute after:top-1/2 after:right-2 after:h-4 after:w-[2px] after:-translate-y-1/2 after:rounded-full after:bg-foreground/35 after:transition-[background-color,transform] after:duration-150 after:ease-smooth after:content-[''] group-hover/slider:after:bg-foreground/50 group-data-dragging/slider:after:scale-y-125 group-data-dragging/slider:after:bg-foreground/65 dark:bg-foreground/9" />
              <SliderThumb
                aria-label={label}
                className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 opacity-0"
              />
            </SliderTrack>

            {ticks.length > 0 && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-2.5 bottom-1.5 z-[1] h-1 opacity-0 transition-opacity duration-150 group-hover/slider:opacity-100 group-focus-within/slider:opacity-100 group-data-dragging/slider:opacity-100"
              >
                {ticks.map((tick) => (
                  <span
                    key={tick.value}
                    className="absolute top-1/2 size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25"
                    style={{ left: `${tick.percent}%` }}
                  />
                ))}
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between gap-2 px-3.5 text-xs">
              <span className="truncate font-normal text-muted-foreground">
                {label}
              </span>
              <span className="inline-flex shrink-0 items-baseline font-medium tabular-nums text-foreground">
                {formatValue ? (
                  formatValue(current)
                ) : (
                  <>
                    <NumberFlow
                      value={formattedNumber}
                      format={{
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                      }}
                      respectMotionPreference={!reduceMotion}
                    />
                    {unit && (
                      <span className="ml-0.5 font-normal text-muted-foreground">
                        {unit}
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>
          </SliderControl>
        );
      }}
    </SliderPrimitive>
  );
}
