import React, { useState } from "react";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Direction } from "../../types/gradient";
import { cn } from "../../utils/cn";
import { WakeSlider } from "../ui/wake-slider";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerChannels,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerHexInput,
  ColorPickerHue,
  ColorPickerPreset,
  ColorPickerPresets,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "../ui/color-picker";
import { SPRING_SWAP } from "../ui/color-picker-utils/ease";

// useAnimations arrows
import {
  ArrowUp01,
  ArrowDown01,
  ArrowLeft01,
  ArrowRight01,
} from "../icons";

const FORMATS = ["hex", "rgb", "hsl"] as const;
type Format = (typeof FORMATS)[number];

const PRESETS = [
  { value: "#3478f6", label: "Blue" },
  { value: "#9270e8", label: "Purple" },
  { value: "#e66aa4", label: "Pink" },
  { value: "#e55656", label: "Red" },
  { value: "#ed9141", label: "Orange" },
  { value: "#e5b63c", label: "Amber" },
  { value: "#65a65a", label: "Green" },
  { value: "#169d83", label: "Teal" },
];

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  ticks?: number[];
  showTickLabels?: boolean;
  empty?: boolean;
  defaultValue?: number;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  ticks,
  showTickLabels = false,
  empty = false,
  defaultValue,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempVal, setTempVal] = useState(String(value));

  return (
    <div className="w-full py-1">
      <div className="mb-1 flex items-center justify-between">
        <span
          onDoubleClick={() => {
            if (!empty && defaultValue !== undefined) {
              onChange(defaultValue);
            }
          }}
          className={cn(
            "text-[11px] font-medium text-muted-foreground select-none truncate",
            defaultValue !== undefined && !empty && "cursor-pointer hover:text-foreground transition-colors"
          )}
          title={
            defaultValue !== undefined
              ? `${label} (Double-click to reset to ${defaultValue}${unit})`
              : label
          }
        >
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2.5 w-full">
        <div className="flex-1 min-w-0">
          <WakeSlider
            min={min}
            max={max}
            step={step}
            value={empty ? min : value}
            onChange={(val) => {
              if (!empty) {
                onChange(val);
              }
            }}
            bars={28}
            wake={60}
            showReading={false}
            fullWidth={true}
            aria-label={label}
            disabled={empty}
          />
        </div>

        <div className="flex items-center text-xs font-mono font-medium text-foreground flex-shrink-0 min-h-[18px]">
          {empty ? (
            <span className="text-muted-foreground font-mono leading-none">—</span>
          ) : isEditing ? (
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={tempVal}
              autoFocus
              onBlur={() => {
                setIsEditing(false);
                const n = parseFloat(tempVal);
                if (Number.isFinite(n)) {
                  onChange(Math.min(max, Math.max(min, n)));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              onChange={(e) => setTempVal(e.target.value)}
              className="w-14 px-1.5 py-0.5 rounded-md bg-input border border-border text-right text-xs text-foreground font-mono focus:outline-none focus:border-ring"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setTempVal(String(Number(value.toFixed(2))));
                setIsEditing(true);
              }}
              onDoubleClick={(e) => {
                if (defaultValue !== undefined) {
                  e.stopPropagation();
                  onChange(defaultValue);
                }
              }}
              className="cursor-pointer hover:text-muted-foreground transition-colors flex items-center min-w-[34px] justify-end"
              title="Click to edit · Double-click to reset"
            >
              <NumberFlow
                value={value}
                format={{
                  minimumFractionDigits: Number.isInteger(step) ? 0 : 1,
                  maximumFractionDigits: Number.isInteger(step)
                    ? 0
                    : step < 0.1
                    ? 2
                    : 1,
                }}
              />
              {unit && <span className="ml-0.5 text-muted-foreground font-normal">{unit}</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ColorPickerControlProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  alpha?: boolean;
  empty?: boolean;
}

export const ColorPickerControl: React.FC<ColorPickerControlProps> = ({
  label,
  value,
  onChange,
  alpha = false,
  empty = false,
}) => {
  const [format, setFormat] = useState<Format>("hex");
  const reduce = useReducedMotion();
  const next = FORMATS[(FORMATS.indexOf(format) + 1) % FORMATS.length];

  return (
    <div className="flex items-center justify-between py-1 gap-2 relative">
      <span
        className="text-[11px] font-medium text-muted-foreground select-none truncate min-w-0"
        title={label}
      >
        {label}
      </span>
      <div className="relative flex-shrink-0">
        {empty ? (
          <div className="inline-flex h-9 w-fit items-center gap-2 rounded-full border border-border bg-input/60 pr-3.5 pl-1.5 text-sm text-muted-foreground">
            <span aria-hidden="true" className="relative size-6 shrink-0">
              <span className="absolute inset-0 rounded-full border border-dashed border-border bg-secondary" />
            </span>
            <span className="w-[7ch] text-left font-mono tabular-nums">—</span>
          </div>
        ) : (
          <ColorPicker
            value={value}
            onValueChange={onChange}
            alpha={alpha}
            aria-label={label}
          >
          <ColorPickerTrigger />
          <ColorPickerContent align="end" aria-label={label}>
            <ColorPickerArea />
            <div className="flex items-center gap-3">
              <ColorPickerEyeDropper />
              <div className="flex flex-1 flex-col gap-3">
                <ColorPickerHue />
                {alpha && <ColorPickerAlpha />}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <button
                type="button"
                onClick={() => setFormat(next)}
                aria-label={`Format ${format.toUpperCase()}, switch to ${next.toUpperCase()}`}
                className="relative inline-flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-border bg-secondary text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={format}
                    initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                    transition={SPRING_SWAP}
                  >
                    {format.toUpperCase()}
                  </motion.span>
                </AnimatePresence>
              </button>
              {format === "hex" ? (
                <ColorPickerHexInput />
              ) : (
                <ColorPickerChannels format={format} />
              )}
              {format === "hex" && <ColorPickerSwatch />}
            </div>
            <ColorPickerPresets
              aria-label="Presets"
              className="justify-between px-0.5 pt-1"
            >
              {PRESETS.map((preset) => (
                <ColorPickerPreset
                  key={preset.value}
                  value={preset.value}
                  label={preset.label}
                />
              ))}
            </ColorPickerPresets>
          </ColorPickerContent>
        </ColorPicker>
        )}
      </div>
    </div>
  );
};

interface DirectionPickerProps {
  value: Direction;
  onChange: (dir: Direction) => void;
}

interface DirectionButtonConfig {
  id: Direction | "center";
  label: string;
  icon: React.ReactNode;
}

export const DirectionPicker: React.FC<DirectionPickerProps> = ({ value, onChange }) => {
  const directions: DirectionButtonConfig[] = [
    {
      id: "top-left",
      label: "Top-Left",
      icon: (
        <span className="inline-flex -rotate-45 transition-transform" aria-hidden="true">
          <ArrowUp01 size={16} />
        </span>
      ),
    },
    {
      id: "top",
      label: "Top",
      icon: <ArrowUp01 size={16} aria-hidden="true" />,
    },
    {
      id: "top-right",
      label: "Top-Right",
      icon: (
        <span className="inline-flex rotate-45 transition-transform" aria-hidden="true">
          <ArrowUp01 size={16} />
        </span>
      ),
    },
    {
      id: "left",
      label: "Left",
      icon: <ArrowLeft01 size={16} aria-hidden="true" />,
    },
    {
      id: "center",
      label: "Center",
      icon: <span className="size-2 rounded-full bg-current opacity-70 block" aria-hidden="true" />,
    },
    {
      id: "right",
      label: "Right",
      icon: <ArrowRight01 size={16} aria-hidden="true" />,
    },
    {
      id: "bottom-left",
      label: "Bottom-Left",
      icon: (
        <span className="inline-flex rotate-45 transition-transform" aria-hidden="true">
          <ArrowDown01 size={16} />
        </span>
      ),
    },
    {
      id: "bottom",
      label: "Bottom",
      icon: <ArrowDown01 size={16} aria-hidden="true" />,
    },
    {
      id: "bottom-right",
      label: "Bottom-Right",
      icon: (
        <span className="inline-flex -rotate-45 transition-transform" aria-hidden="true">
          <ArrowDown01 size={16} />
        </span>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs font-medium tracking-tight text-foreground select-none">
        Direction
      </span>
      <div className="grid grid-cols-3 gap-1.5">
        {directions.map((item, idx) => {
          const isCenter = item.id === "center";
          const isActive = !isCenter && value === item.id;

          return (
            <button
              key={`${item.id}-${idx}`}
              type="button"
              disabled={isCenter}
              aria-label={item.label}
              onClick={() => {
                if (item.id !== "center") {
                  onChange(item.id);
                }
              }}
              className={cn(
                "size-8 rounded-full flex items-center justify-center transition-all focus-visible:outline-2 focus-visible:outline-ring cursor-pointer",
                isCenter && "cursor-default text-muted-foreground bg-transparent",
                isActive
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : !isCenter &&
                      "bg-secondary text-muted-foreground border border-border hover:border-ring hover:text-foreground"
              )}
              title={item.label}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
};
