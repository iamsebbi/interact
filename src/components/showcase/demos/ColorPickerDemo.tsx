import React, { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
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
} from "../../ui/color-picker";
import { SPRING_SWAP } from "../../ui/color-picker-utils/ease";
import { cn } from "../../../utils/cn";
import {
  ComponentDetailLayout,
  ShowcaseSection,
  ShowcaseToggleField,
  type ShowcaseComponentNavItem,
} from "../ComponentDetailLayout";

export type ColorPickerFormat = "hex" | "rgb" | "hsl";
export type ColorPickerMode = "inline" | "popover";
export type ColorPickerTheme = "dark" | "light";

export const COLOR_PICKER_FORMATS: readonly ColorPickerFormat[] = ["hex", "rgb", "hsl"];

export const COLOR_PICKER_PRESETS = [
  { value: "#3478f6", label: "Blue" },
  { value: "#9270e8", label: "Purple" },
  { value: "#e66aa4", label: "Pink" },
  { value: "#e55656", label: "Red" },
  { value: "#ed9141", label: "Orange" },
  { value: "#e5b63c", label: "Amber" },
  { value: "#65a65a", label: "Green" },
  { value: "#169d83", label: "Teal" },
];

export const COLOR_PICKER_PLAY_COLORS = [
  "#9270e8",
  "#e66aa4",
  "#169d83",
  "#ed9141",
  "#3478f6",
];

export interface ColorPickerConfig {
  value: string;
  mode: ColorPickerMode;
  theme: ColorPickerTheme;
  alpha: boolean;
  format: ColorPickerFormat;
  showEyeDropper: boolean;
  showPresets: boolean;
  disabled: boolean;
}

export const DEFAULT_COLOR_PICKER_CONFIG: ColorPickerConfig = {
  value: "#3478f6",
  mode: "popover",
  theme: "dark",
  alpha: true,
  format: "hex",
  showEyeDropper: true,
  showPresets: true,
  disabled: false,
};

export function buildColorPickerJsx(config: ColorPickerConfig): string {
  const imports = [
    "  ColorPicker,",
    "  ColorPickerArea,",
    "  ColorPickerHue,",
    ...(config.alpha ? ["  ColorPickerAlpha,"] : []),
    ...(config.showEyeDropper ? ["  ColorPickerEyeDropper,"] : []),
    ...(config.format === "hex"
      ? ["  ColorPickerHexInput,", "  ColorPickerSwatch,"]
      : ["  ColorPickerChannels,"]),
    ...(config.showPresets ? ["  ColorPickerPresets,", "  ColorPickerPreset,"] : []),
    ...(config.mode === "popover" ? ["  ColorPickerTrigger,", "  ColorPickerContent,"] : []),
  ];

  const inner: string[] = [
    `  <ColorPickerArea />`,
    `  <div className="flex items-center gap-2.5">`,
    ...(config.showEyeDropper ? [`    <ColorPickerEyeDropper />`] : []),
    `    <div className="flex flex-1 flex-col gap-2.5">`,
    `      <ColorPickerHue />`,
    ...(config.alpha ? [`      <ColorPickerAlpha />`] : []),
    `    </div>`,
    `  </div>`,
    `  <div className="flex items-start gap-1.5">`,
    ...(config.format === "hex"
      ? [`    <ColorPickerHexInput />`, `    <ColorPickerSwatch />`]
      : [`    <ColorPickerChannels format="${config.format}" />`]),
    `  </div>`,
    ...(config.showPresets
      ? [
          `  <ColorPickerPresets className="justify-between px-0.5 pt-1">`,
          `    <ColorPickerPreset value="#3478f6" label="Blue" />`,
          `    <ColorPickerPreset value="#9270e8" label="Purple" />`,
          `    <ColorPickerPreset value="#e66aa4" label="Pink" />`,
          `    <ColorPickerPreset value="#169d83" label="Teal" />`,
          `  </ColorPickerPresets>`,
        ]
      : []),
  ];

  const rootProps = [
    `  value="${config.value}"`,
    `  onValueChange={setColor}`,
    ...(config.theme !== "dark" ? [`  theme="${config.theme}"`] : []),
    ...(!config.alpha ? [`  alpha={false}`] : []),
    ...(config.disabled ? [`  disabled`] : []),
  ];

  if (config.mode === "popover") {
    return [
      `import {\n${imports.join("\n")}\n} from "@/components/ui/color-picker";`,
      ``,
      `<ColorPicker`,
      ...rootProps,
      `>`,
      `  <ColorPickerTrigger />`,
      `  <ColorPickerContent align="start">`,
      ...inner.map((line) => `  ${line}`),
      `  </ColorPickerContent>`,
      `</ColorPicker>`,
    ].join("\n");
  }

  return [
    `import {\n${imports.join("\n")}\n} from "@/components/ui/color-picker";`,
    ``,
    `<ColorPicker`,
    ...rootProps,
    `  className="w-[304px] rounded-3xl border border-border bg-popover/95 p-3.5 shadow-2xl"`,
    `>`,
    ...inner,
    `</ColorPicker>`,
  ].join("\n");
}

export interface ColorPickerStagePreviewProps {
  config: ColorPickerConfig;
  interactive?: boolean;
  shiftUp?: boolean;
  animateShift?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
  onFormatChange?: (format: ColorPickerFormat) => void;
}

export const ColorPickerStagePreview: React.FC<ColorPickerStagePreviewProps> = ({
  config,
  interactive = true,
  shiftUp = false,
  animateShift = true,
  open,
  onOpenChange,
  onValueChange,
  onFormatChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isPopoverOpen = config.mode === "popover" ? (open ?? internalOpen) : false;
  const handleOpenChange = (nextOpen: boolean) => {
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  const reduce = useReducedMotion();
  const nextFormat =
    COLOR_PICKER_FORMATS[
      (COLOR_PICKER_FORMATS.indexOf(config.format) + 1) % COLOR_PICKER_FORMATS.length
    ];

  const body = [
    <ColorPickerArea key="area" />,
    <div key="sliders" className="flex items-center gap-3">
      {config.showEyeDropper && <ColorPickerEyeDropper />}
      <div className="flex flex-1 flex-col gap-3">
        <ColorPickerHue />
        {config.alpha && <ColorPickerAlpha />}
      </div>
    </div>,
    <div key="fields" className="flex items-start gap-2">
      <button
        type="button"
        onClick={() => onFormatChange?.(nextFormat)}
        disabled={config.disabled}
        aria-label={`Format ${config.format.toUpperCase()}, switch to ${nextFormat.toUpperCase()}`}
        className="relative inline-flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-border bg-secondary text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed cursor-pointer"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={config.format}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={SPRING_SWAP}
          >
            {config.format.toUpperCase()}
          </motion.span>
        </AnimatePresence>
      </button>
      {config.format === "hex" ? (
        <ColorPickerHexInput />
      ) : (
        <ColorPickerChannels format={config.format} />
      )}
      {config.format === "hex" && <ColorPickerSwatch />}
    </div>,
    ...(config.showPresets
      ? [
          <ColorPickerPresets
            key="presets"
            aria-label="Presets"
            className="justify-between px-0.5 pt-0.5"
          >
            {COLOR_PICKER_PRESETS.map((preset) => (
              <ColorPickerPreset
                key={preset.value}
                value={preset.value}
                label={preset.label}
              />
            ))}
          </ColorPickerPresets>,
        ]
      : []),
  ];

  return (
    <LayoutGroup>
      <div
        className={cn(
          "flex items-center justify-center",
          animateShift && "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          shiftUp && config.mode === "popover" && "-translate-y-24 sm:-translate-y-32",
          !interactive && "pointer-events-none select-none"
        )}
      >
        <ColorPicker
          key={`${config.mode}-${interactive ? "active" : "grid"}`}
          value={config.value}
          onValueChange={onValueChange}
          theme={interactive ? config.theme : undefined}
          open={config.mode === "popover" ? isPopoverOpen : undefined}
          onOpenChange={config.mode === "popover" ? handleOpenChange : undefined}
          alpha={config.alpha}
          disabled={config.disabled}
          aria-label="Color Picker"
          className={cn(
            interactive ? "pointer-events-auto" : "pointer-events-none",
            config.mode === "inline" &&
              "w-[304px] rounded-3xl border border-border bg-popover/95 p-3.5 shadow-2xl"
          )}
        >
          {config.mode === "popover" ? (
            <>
              <ColorPickerTrigger />
              <ColorPickerContent
                align="start"
                aria-label="Color Picker"
                className="left-1/2 -translate-x-1/2"
              >
                {body}
              </ColorPickerContent>
            </>
          ) : (
            body
          )}
        </ColorPicker>
      </div>
    </LayoutGroup>
  );
};

export interface ColorPickerDemoProps {
  componentList?: ShowcaseComponentNavItem[];
  activeComponentId?: string;
  onSelectComponent?: (id: string) => void;
  onClose?: () => void;
  onOpenInStudio?: () => void;
  config: ColorPickerConfig;
  onConfigChange: (next: ColorPickerConfig) => void;
  stageSlotRef?: React.RefObject<HTMLDivElement | null>;
  isClosing?: boolean;
  skipEntranceMotion?: boolean;
  onPlay?: () => void;
}

export const ColorPickerDemo: React.FC<ColorPickerDemoProps> = ({
  componentList,
  activeComponentId,
  onSelectComponent,
  onClose,
  onOpenInStudio,
  config,
  onConfigChange,
  stageSlotRef,
  isClosing,
  skipEntranceMotion,
  onPlay,
}) => {
  const patchConfig = (patch: Partial<ColorPickerConfig>) =>
    onConfigChange({ ...config, ...patch });

  const jsxSnippet = useMemo(() => buildColorPickerJsx(config), [config]);

  return (
    <ComponentDetailLayout
      title="Color Picker"
      stageSlotRef={stageSlotRef}
      stage={
        stageSlotRef ? undefined : (
          <ColorPickerStagePreview
            config={config}
            onValueChange={(value) => patchConfig({ value })}
            onFormatChange={(format) => patchConfig({ format })}
          />
        )
      }
      configTitle="Color Picker"
      configDescription="Interactive HSVA color picker with spring-physics loupe, HEX/RGB/HSL channels, alpha slider, eyedropper, and preset swatches."
      onReset={() => onConfigChange(DEFAULT_COLOR_PICKER_CONFIG)}
      onPlay={onPlay}
      showCopyPrompt
      codeSnippet={jsxSnippet}
      componentList={componentList}
      activeComponentId={activeComponentId}
      onSelectComponent={onSelectComponent}
      onClose={onClose}
      onOpenInStudio={onOpenInStudio}
      isClosing={isClosing}
      skipEntranceMotion={skipEntranceMotion}
    >
      {/* Theme */}
      <ShowcaseSection
        label="Theme (2)"
        valueLabel={config.theme === "dark" ? "Dark" : "Light"}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {(["dark", "light"] as const).map((item) => {
            const isSelected = config.theme === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => patchConfig({ theme: item })}
                className={cn(
                  "h-9 px-3 rounded-xl border text-xs font-medium capitalize transition-all cursor-pointer flex items-center justify-center",
                  isSelected
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/80 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </ShowcaseSection>

      {/* Presentation Mode */}
      <ShowcaseSection
        label="Presentation (2)"
        valueLabel={config.mode === "popover" ? "Popover" : "Inline"}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {(["popover", "inline"] as const).map((item) => {
            const isSelected = config.mode === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => patchConfig({ mode: item })}
                className={cn(
                  "h-9 px-3 rounded-xl border text-xs font-medium capitalize transition-all cursor-pointer flex items-center justify-center",
                  isSelected
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/80 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </ShowcaseSection>

      {/* Feature Toggles */}
      <div className="flex flex-col gap-2">
        <ShowcaseToggleField
          label="Alpha Channel"
          checked={config.alpha}
          onCheckedChange={(alpha) => patchConfig({ alpha })}
          ariaLabel="Toggle alpha channel"
        />
        <ShowcaseToggleField
          label="Preset Swatches"
          checked={config.showPresets}
          onCheckedChange={(showPresets) => patchConfig({ showPresets })}
          ariaLabel="Toggle preset swatches"
        />
      </div>
    </ComponentDetailLayout>
  );
};
