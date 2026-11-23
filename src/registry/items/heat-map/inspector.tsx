"use client";

import { SelectField, Slider } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_HEAT_MAP_CONFIG,
  HEAT_MAP_COLOR_OPTIONS,
  HEAT_MAP_SHAPE_OPTIONS,
  type HeatMapConfig,
} from "./config";
import type { HeatMapColors, HeatMapShape } from "./heat-map";

export function HeatMapInspector({
  config,
  onChange,
}: ComponentInspectorProps<HeatMapConfig>) {
  const patch = (next: Partial<HeatMapConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Shape"
        value={config.shape}
        options={HEAT_MAP_SHAPE_OPTIONS}
        onValueChange={(next) => patch({ shape: next as HeatMapShape })}
      />

      <SelectField
        label="Colors"
        value={config.colors}
        options={HEAT_MAP_COLOR_OPTIONS}
        onValueChange={(next) => patch({ colors: next as HeatMapColors })}
      />

      <Slider
        label="Heat"
        unit="%"
        value={config.heat}
        min={0}
        max={100}
        step={5}
        defaultValue={DEFAULT_HEAT_MAP_CONFIG.heat}
        onValueChange={(heat) => patch({ heat })}
      />

      <Slider
        label="Soft"
        unit="%"
        value={config.soft}
        min={0}
        max={100}
        step={5}
        defaultValue={DEFAULT_HEAT_MAP_CONFIG.soft}
        onValueChange={(soft) => patch({ soft })}
      />

      <Slider
        label="Area"
        unit="%"
        value={config.area}
        min={0}
        max={100}
        step={5}
        defaultValue={DEFAULT_HEAT_MAP_CONFIG.area}
        onValueChange={(area) => patch({ area })}
      />
    </div>
  );
}
