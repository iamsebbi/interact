import React from "react";
import {
  DEFAULT_WAKE_SLIDER_CONFIG,
  type WakeSliderConfig,
} from "../../showcase/demos/WakeSliderDemo";
import {
  ShowcaseSection,
  ShowcaseToggleField,
} from "../../showcase/ComponentDetailLayout";
import { SliderControl } from "../StudioControls";
import { cn } from "../../../utils/cn";

const UNIT_OPTIONS = ["%", "px", "x", "s", ""] as const;

export interface WakeSliderInspectorProps {
  config: WakeSliderConfig;
  onChange: (next: WakeSliderConfig) => void;
}

export const WakeSliderInspector: React.FC<WakeSliderInspectorProps> = ({
  config,
  onChange,
}) => {
  const patch = (p: Partial<WakeSliderConfig>) => onChange({ ...config, ...p });
  const clamped = Math.min(config.max, Math.max(config.min, config.value));

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-2">
        <SliderControl
          label="Value"
          unit={config.unit}
          value={clamped}
          min={config.min}
          max={config.max}
          step={config.step}
          defaultValue={DEFAULT_WAKE_SLIDER_CONFIG.value}
          onChange={(value) => patch({ value })}
        />
        <SliderControl
          label="Bar Count"
          value={config.bars}
          min={12}
          max={56}
          step={2}
          defaultValue={DEFAULT_WAKE_SLIDER_CONFIG.bars}
          onChange={(bars) => patch({ bars })}
        />
        <SliderControl
          label="Wake Amplitude"
          unit="%"
          value={config.wake}
          min={0}
          max={100}
          step={5}
          defaultValue={DEFAULT_WAKE_SLIDER_CONFIG.wake}
          onChange={(wake) => patch({ wake })}
        />
      </div>

      <div className="pt-3 border-t border-border space-y-2">
        <SliderControl
          label="Minimum"
          value={config.min}
          min={-50}
          max={Math.max(-50, config.max - 10)}
          step={5}
          defaultValue={DEFAULT_WAKE_SLIDER_CONFIG.min}
          onChange={(min) =>
            patch({ min, value: Math.max(min, config.value) })
          }
        />
        <SliderControl
          label="Maximum"
          value={config.max}
          min={config.min + 10}
          max={500}
          step={10}
          defaultValue={DEFAULT_WAKE_SLIDER_CONFIG.max}
          onChange={(max) =>
            patch({ max, value: Math.min(max, config.value) })
          }
        />
        <SliderControl
          label="Step"
          value={config.step}
          min={0.5}
          max={10}
          step={0.5}
          defaultValue={DEFAULT_WAKE_SLIDER_CONFIG.step}
          onChange={(step) => patch({ step })}
        />
      </div>

      <div className="pt-3 border-t border-border space-y-3">
        <ShowcaseSection
          label={`Unit (${UNIT_OPTIONS.length})`}
          valueLabel={config.unit || "None"}
        >
          <div className="grid grid-cols-5 gap-1">
            {UNIT_OPTIONS.map((u) => (
              <button
                key={u || "none"}
                type="button"
                onClick={() => patch({ unit: u })}
                className={cn(
                  "h-8 rounded-xl border font-mono text-xs transition-all cursor-pointer flex items-center justify-center",
                  config.unit === u
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {u || "—"}
              </button>
            ))}
          </div>
        </ShowcaseSection>

        <ShowcaseToggleField
          label="Show Reading"
          checked={config.showReading}
          onCheckedChange={(showReading) => patch({ showReading })}
        />
        <ShowcaseToggleField
          label="Full Width"
          checked={config.fullWidth}
          onCheckedChange={(fullWidth) => patch({ fullWidth })}
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
