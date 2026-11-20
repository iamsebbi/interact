import React from "react";
import {
  COLOR_PICKER_FORMATS,
  COLOR_PICKER_PRESETS,
  type ColorPickerConfig,
} from "../../showcase/demos/ColorPickerDemo";
import {
  ShowcaseSection,
  ShowcaseToggleField,
} from "../../showcase/ComponentDetailLayout";
import { ColorPickerControl } from "../StudioControls";
import { cn } from "../../../utils/cn";

export interface ColorPickerInspectorProps {
  config: ColorPickerConfig;
  onChange: (next: ColorPickerConfig) => void;
}

export const ColorPickerInspector: React.FC<ColorPickerInspectorProps> = ({
  config,
  onChange,
}) => {
  const patch = (p: Partial<ColorPickerConfig>) => onChange({ ...config, ...p });

  return (
    <div className="space-y-4 text-xs">
      {/* Value */}
      <div className="space-y-2">
        <ColorPickerControl
          label="Active Color"
          value={config.value}
          alpha={config.alpha}
          onChange={(value) => patch({ value })}
        />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {COLOR_PICKER_PRESETS.map((preset) => {
            const selected =
              preset.value.toLowerCase() === config.value.toLowerCase();
            return (
              <button
                key={preset.value}
                type="button"
                title={preset.label}
                aria-label={preset.label}
                onClick={() => patch({ value: preset.value })}
                className={cn(
                  "size-6 rounded-full border transition-transform cursor-pointer",
                  selected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-105 border-white/40"
                    : "border-white/15 hover:scale-105"
                )}
                style={{ backgroundColor: preset.value }}
              />
            );
          })}
        </div>
      </div>

      {/* Theme & Presentation */}
      <div className="pt-3 border-t border-border space-y-3">
        <ShowcaseSection
          label="Theme (2)"
          valueLabel={config.theme === "dark" ? "Dark" : "Light"}
        >
          <div className="grid grid-cols-2 gap-1.5">
            {(["dark", "light"] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => patch({ theme })}
                className={cn(
                  "h-9 rounded-xl border text-xs font-medium capitalize transition-all cursor-pointer",
                  config.theme === theme
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {theme}
              </button>
            ))}
          </div>
        </ShowcaseSection>

        <ShowcaseSection
          label="Presentation (2)"
          valueLabel={config.mode === "popover" ? "Popover" : "Inline"}
        >
          <div className="grid grid-cols-2 gap-1.5">
            {(["popover", "inline"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => patch({ mode })}
                className={cn(
                  "h-9 rounded-xl border text-xs font-medium capitalize transition-all cursor-pointer",
                  config.mode === mode
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </ShowcaseSection>

        <ShowcaseSection
          label={`Channel Format (${COLOR_PICKER_FORMATS.length})`}
          valueLabel={config.format.toUpperCase()}
        >
          <div className="grid grid-cols-3 gap-1.5">
            {COLOR_PICKER_FORMATS.map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => patch({ format })}
                className={cn(
                  "h-8 rounded-xl border font-mono text-xs uppercase transition-all cursor-pointer",
                  config.format === format
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {format}
              </button>
            ))}
          </div>
        </ShowcaseSection>
      </div>

      {/* Feature Toggles */}
      <div className="pt-3 border-t border-border space-y-2">
        <ShowcaseToggleField
          label="Alpha Channel"
          checked={config.alpha}
          onCheckedChange={(alpha) => patch({ alpha })}
        />
        <ShowcaseToggleField
          label="Eyedropper Tool"
          checked={config.showEyeDropper}
          onCheckedChange={(showEyeDropper) => patch({ showEyeDropper })}
        />
        <ShowcaseToggleField
          label="Preset Swatches"
          checked={config.showPresets}
          onCheckedChange={(showPresets) => patch({ showPresets })}
        />
        <ShowcaseToggleField
          label="Disabled"
          checked={config.disabled}
          onCheckedChange={(disabled) => patch({ disabled })}
        />
      </div>
    </div>
  );
};
