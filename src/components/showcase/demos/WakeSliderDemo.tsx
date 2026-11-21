import React, { useMemo, useState } from "react";
import { WakeSlider, WakeSliderField } from "../../ui/wake-slider";
import {
  ComponentDetailLayout,
  ShowcaseSection,
  ShowcaseToggleField,
  type ShowcaseComponentNavItem,
} from "../ComponentDetailLayout";
import { cn } from "../../../utils/cn";

const UNIT_OPTIONS = ["%", "px", "x", "s", ""] as const;

export interface WakeSliderConfig {
  value: number;
  min: number;
  max: number;
  step: number;
  bars: number;
  wake: number;
  unit: string;
  showReading: boolean;
  fullWidth: boolean;
  disabled: boolean;
}

export const DEFAULT_WAKE_SLIDER_CONFIG: WakeSliderConfig = {
  value: 64,
  min: 0,
  max: 100,
  step: 1,
  bars: 32,
  wake: 65,
  unit: "%",
  showReading: true,
  fullWidth: true,
  disabled: false,
};

export function buildWakeSliderJsx(config: WakeSliderConfig): string {
  const clamped = Math.min(config.max, Math.max(config.min, config.value));
  const lines = [
    `import { WakeSlider } from "@/components/ui/wake-slider";`,
    ``,
    `<WakeSlider`,
    `  value={${clamped}}`,
    `  min={${config.min}}`,
    `  max={${config.max}}`,
    `  step={${config.step}}`,
    `  bars={${config.bars}}`,
    `  wake={${config.wake}}`,
  ];
  if (config.unit) lines.push(`  unit="${config.unit}"`);
  if (!config.showReading) lines.push(`  showReading={false}`);
  if (config.fullWidth) lines.push(`  fullWidth`);
  if (config.disabled) lines.push(`  disabled`);
  lines.push(`  onChange={(val) => setValue(val)}`);
  lines.push(`/>`);
  return lines.join("\n");
}

export interface WakeSliderDemoProps {
  componentList?: ShowcaseComponentNavItem[];
  activeComponentId?: string;
  onSelectComponent?: (id: string) => void;
  onClose?: () => void;
  onOpenInStudio?: () => void;
  config?: WakeSliderConfig;
  onConfigChange?: (next: WakeSliderConfig) => void;
  stageSlotRef?: React.RefObject<HTMLDivElement | null>;
  isClosing?: boolean;
  skipEntranceMotion?: boolean;
  onPlay?: () => void;
}

export const WakeSliderDemo: React.FC<WakeSliderDemoProps> = ({
  componentList,
  activeComponentId,
  onSelectComponent,
  onClose,
  onOpenInStudio,
  config: controlledConfig,
  onConfigChange,
  stageSlotRef,
  isClosing,
  skipEntranceMotion,
  onPlay,
}) => {
  const [internalConfig, setInternalConfig] = useState<WakeSliderConfig>(DEFAULT_WAKE_SLIDER_CONFIG);
  const config = controlledConfig ?? internalConfig;
  const setConfig = onConfigChange ?? setInternalConfig;
  const patchConfig = (patch: Partial<WakeSliderConfig>) => setConfig({ ...config, ...patch });

  const clampedValue = Math.min(config.max, Math.max(config.min, config.value));
  const jsxSnippet = useMemo(() => buildWakeSliderJsx(config), [config]);

  return (
    <ComponentDetailLayout
      title="Wake Slider"
      stageSlotRef={stageSlotRef}
      stage={
        stageSlotRef ? undefined : (
          <div className="w-full max-w-md px-4">
            <WakeSlider
              value={clampedValue}
              min={config.min}
              max={config.max}
              step={config.step}
              bars={config.bars}
              wake={config.wake}
              unit={config.unit}
              showReading={config.showReading}
              fullWidth={config.fullWidth}
              disabled={config.disabled}
              onChange={(value) => patchConfig({ value })}
            />
          </div>
        )
      }
      configTitle="Wake Slider"
      configDescription="Kinetic bar-track range slider with velocity-driven wave wake and NumberFlow numeric readout."
      onReset={() => setConfig(DEFAULT_WAKE_SLIDER_CONFIG)}
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
      <div className="flex flex-col gap-2 text-xs">
        <WakeSliderField
          label="Value"
          value={clampedValue}
          min={config.min}
          max={config.max}
          step={config.step}
          unit={config.unit}
          defaultValue={DEFAULT_WAKE_SLIDER_CONFIG.value}
          onChange={(value) => patchConfig({ value })}
        />
        <WakeSliderField
          label="Bar Count"
          value={config.bars}
          min={12}
          max={48}
          step={2}
          defaultValue={DEFAULT_WAKE_SLIDER_CONFIG.bars}
          onChange={(bars) => patchConfig({ bars })}
        />
        <WakeSliderField
          label="Wake Amplitude"
          value={config.wake}
          min={0}
          max={100}
          step={5}
          unit="%"
          defaultValue={DEFAULT_WAKE_SLIDER_CONFIG.wake}
          onChange={(wake) => patchConfig({ wake })}
        />

        <ShowcaseSection
          label={`Unit (${UNIT_OPTIONS.length})`}
          valueLabel={config.unit || "None"}
        >
          <div className="grid grid-cols-5 gap-1">
            {UNIT_OPTIONS.map((u) => {
              const isSelected = config.unit === u;
              return (
                <button
                  key={u || "none"}
                  type="button"
                  onClick={() => patchConfig({ unit: u })}
                  className={cn(
                    "h-8 rounded-xl border font-mono text-xs transition-all cursor-pointer flex items-center justify-center",
                    isSelected
                      ? "glass-chosen text-foreground font-semibold"
                      : "bg-secondary/80 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {u || "—"}
                </button>
              );
            })}
          </div>
        </ShowcaseSection>

        <ShowcaseToggleField
          label="Show Reading"
          checked={config.showReading}
          onCheckedChange={(showReading) => patchConfig({ showReading })}
          ariaLabel="Toggle numeric reading"
        />
        <ShowcaseToggleField
          label="Disabled"
          checked={config.disabled}
          onCheckedChange={(disabled) => patchConfig({ disabled })}
          ariaLabel="Toggle disabled state"
        />
      </div>
    </ComponentDetailLayout>
  );
};
