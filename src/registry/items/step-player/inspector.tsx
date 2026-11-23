"use client";

import { SelectField, Slider } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_STEP_PLAYER_CONFIG,
  MAX_STEPS,
  MIN_STEPS,
  STEP_SIZE_OPTIONS,
  type StepPlayerConfig,
} from "./config";
import type { StepPlayerSize } from "./step-player";

export function StepPlayerInspector({
  config,
  onChange,
}: ComponentInspectorProps<StepPlayerConfig>) {
  const patch = (next: Partial<StepPlayerConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={STEP_SIZE_OPTIONS}
        onValueChange={(next) => patch({ size: next as StepPlayerSize })}
      />

      <Slider
        label="Steps"
        value={config.steps}
        min={MIN_STEPS}
        max={MAX_STEPS}
        step={1}
        defaultValue={DEFAULT_STEP_PLAYER_CONFIG.steps}
        onValueChange={(steps) => patch({ steps })}
      />

      <Slider
        label="Pace"
        unit="s"
        value={config.pace}
        min={0.5}
        max={8}
        step={0.5}
        defaultValue={DEFAULT_STEP_PLAYER_CONFIG.pace}
        onValueChange={(pace) => patch({ pace })}
      />

      <Slider
        label="Wake"
        unit="%"
        value={config.wake}
        min={0}
        max={100}
        step={5}
        defaultValue={DEFAULT_STEP_PLAYER_CONFIG.wake}
        onValueChange={(wake) => patch({ wake })}
      />
    </div>
  );
}
