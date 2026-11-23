"use client";

import { SelectField, Slider, Switch, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_UPDATE_BUTTON_CONFIG,
  UPDATE_SIZE_OPTIONS,
  UPDATE_THEME_OPTIONS,
  type UpdateButtonConfig,
} from "./config";
import type { UpdateButtonSize, UpdateButtonTheme } from "./update-button";

export function UpdateButtonInspector({
  config,
  onChange,
}: ComponentInspectorProps<UpdateButtonConfig>) {
  const patch = (next: Partial<UpdateButtonConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={UPDATE_SIZE_OPTIONS}
        onValueChange={(next) => patch({ size: next as UpdateButtonSize })}
      />

      <SelectField
        label="Theme"
        value={config.theme}
        options={UPDATE_THEME_OPTIONS}
        onValueChange={(next) => patch({ theme: next as UpdateButtonTheme })}
      />

      <TextField
        label="Label"
        value={config.label}
        placeholder="Update"
        onValueChange={(label) => patch({ label })}
      />

      <TextField
        label="Updating"
        value={config.updatingLabel}
        placeholder="Updating"
        onValueChange={(updatingLabel) => patch({ updatingLabel })}
      />

      <TextField
        label="Completed"
        value={config.completedLabel}
        placeholder="Updated"
        onValueChange={(completedLabel) => patch({ completedLabel })}
      />

      <Slider
        label="Duration"
        value={config.durationSec}
        min={1.0}
        max={6.0}
        step={0.2}
        unit="s"
        defaultValue={DEFAULT_UPDATE_BUTTON_CONFIG.durationSec}
        onValueChange={(durationSec) => patch({ durationSec })}
      />

      <Switch
        label="Show Percentage"
        checked={config.showPercentage}
        onCheckedChange={(showPercentage) => patch({ showPercentage })}
      />

      <Switch
        label="Auto Reset"
        checked={config.autoReset}
        onCheckedChange={(autoReset) => patch({ autoReset })}
      />
    </div>
  );
}
