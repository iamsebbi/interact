"use client";

import {
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPicker as ColorPickerPrimitive,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
} from "@ui-sdk/react/color-picker";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover";
import { cn } from "@/lib/utils";

const DEFAULT_SWATCHES = [
  "#3478f6",
  "#9270e8",
  "#e66aa4",
  "#e55656",
  "#ed9141",
  "#e5b63c",
  "#65a65a",
  "#169d83",
] as const;

export interface ColorPickerProps {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  swatches?: readonly string[];
  className?: string;
}

export function ColorPicker({
  label,
  value,
  defaultValue = "#3478f6",
  onValueChange,
  swatches = DEFAULT_SWATCHES,
  className,
}: ColorPickerProps) {
  const displayColor = value ?? defaultValue;

  return (
    <div
      className={cn(
        "control-row flex h-9 items-center justify-between gap-2 rounded-sm pr-1.5 pl-3 text-[13px]",
        className,
      )}
    >
      <span className="truncate font-medium text-foreground-strong">
        {label}
      </span>
      <Popover>
        <PopoverTrigger
          aria-label={`Choose ${label}`}
          className="inline-flex h-6 cursor-pointer items-center gap-2 rounded-pill bg-control-active pr-2.5 pl-1 shadow-control outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span
            aria-hidden="true"
            className="size-4 rounded-pill ring-1 ring-border"
            style={{ backgroundColor: displayColor }}
          />
          <span className="font-mono text-[11px] uppercase text-foreground-strong">
            {displayColor}
          </span>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="surface-popover z-50 w-64 border-0 p-3 text-popover-foreground outline-none origin-(--transform-origin) transition-[opacity,transform] duration-200 ease-smooth data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:scale-[0.97] data-ending-style:opacity-0 motion-reduce:transition-none"
        >
          <PopoverTitle className="mb-2 text-xs font-medium text-muted-foreground">
            {label}
          </PopoverTitle>
          <ColorPickerPrimitive
            aria-label={label}
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            onValueChange={(next) => onValueChange?.(next)}
            className="flex flex-col gap-3"
          >
            <ColorPickerArea className="relative h-32 w-full cursor-crosshair rounded-sm bg-[image:var(--color-area-background)]">
              <ColorPickerAreaThumb className="size-4 -translate-x-1/2 -translate-y-1/2 rounded-pill border-2 border-white bg-[var(--color-picker-color)] shadow-primary outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </ColorPickerArea>
            <ColorPickerSlider
              channel="hue"
              className="relative h-3 w-full cursor-ew-resize rounded-pill bg-[image:var(--color-slider-background)]"
            >
              <ColorPickerSliderThumb className="top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-pill border-2 border-white bg-[var(--color-picker-color)] shadow-primary outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </ColorPickerSlider>
            <ColorPickerInput
              aria-label={`${label} hex`}
              className="h-8 w-full rounded-sm border border-input bg-input-bg px-2.5 font-mono text-xs text-foreground outline-none transition-colors focus:border-input-focus"
            />
            <ColorPickerSwatches
              aria-label={`${label} presets`}
              className="grid grid-cols-8 gap-1.5"
            >
              {swatches.map((hex) => (
                <ColorPickerSwatchItem
                  key={hex}
                  value={hex}
                  aria-label={hex}
                  className="size-6 cursor-pointer rounded-pill ring-1 ring-border transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </ColorPickerSwatches>
          </ColorPickerPrimitive>
        </PopoverContent>
      </Popover>
    </div>
  );
}
