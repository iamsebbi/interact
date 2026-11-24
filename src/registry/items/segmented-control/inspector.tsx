"use client";

import { SelectField, Slider, Switch, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_SEGMENTED_CONTROL_CONFIG,
  SEGMENTED_CONTROL_SIZE_OPTIONS,
  SEGMENTED_CONTROL_THEME_OPTIONS,
  type SegmentedControlConfig,
} from "./config";
import type {
  SegmentedControlSize,
  SegmentedControlTheme,
} from "./segmented-control";

export function SegmentedControlInspector({
  config,
  onChange,
}: ComponentInspectorProps<SegmentedControlConfig>) {
  const patch = (next: Partial<SegmentedControlConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={SEGMENTED_CONTROL_SIZE_OPTIONS}
        onValueChange={(next) => patch({ size: next as SegmentedControlSize })}
      />

      <SelectField
        label="Theme"
        value={config.theme}
        options={SEGMENTED_CONTROL_THEME_OPTIONS}
        onValueChange={(next) =>
          patch({ theme: next as SegmentedControlTheme })
        }
      />

      <TextField
        label="Options"
        value={config.options}
        placeholder="Day, Week, Month, Year"
        onValueChange={(options) => patch({ options })}
      />

      <Slider
        label="Stretch"
        value={config.stretch}
        defaultValue={DEFAULT_SEGMENTED_CONTROL_CONFIG.stretch}
        min={0}
        max={2}
        step={0.05}
        unit="×"
        onValueChange={(stretch) => patch({ stretch })}
      />

      <Slider
        label="Bounce"
        value={config.bounce}
        defaultValue={DEFAULT_SEGMENTED_CONTROL_CONFIG.bounce}
        min={0}
        max={1.6}
        step={0.05}
        unit="×"
        onValueChange={(bounce) => patch({ bounce })}
      />

      <Slider
        label="Speed"
        value={config.speed}
        defaultValue={DEFAULT_SEGMENTED_CONTROL_CONFIG.speed}
        min={0.5}
        max={2}
        step={0.05}
        unit="×"
        onValueChange={(speed) => patch({ speed })}
      />

      <Switch
        label="Show Tray"
        checked={config.showTray}
        onCheckedChange={(showTray) => patch({ showTray })}
        aria-label="Toggle elevated tray around active indicator"
      />
    </div>
  );
}
