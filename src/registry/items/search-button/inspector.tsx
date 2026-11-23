"use client";

import { SelectField, Slider, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_SEARCH_BUTTON_CONFIG,
  SEARCH_SIZE_OPTIONS,
  SEARCH_THEME_OPTIONS,
  type SearchButtonConfig,
} from "./config";
import type { SearchButtonSize, SearchButtonTheme } from "./search-button";

export function SearchButtonInspector({
  config,
  onChange,
}: ComponentInspectorProps<SearchButtonConfig>) {
  const patch = (next: Partial<SearchButtonConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={SEARCH_SIZE_OPTIONS}
        onValueChange={(next) => patch({ size: next as SearchButtonSize })}
      />

      <SelectField
        label="Theme"
        value={config.theme}
        options={SEARCH_THEME_OPTIONS}
        onValueChange={(next) => patch({ theme: next as SearchButtonTheme })}
      />

      <TextField
        label="Placeholder"
        value={config.placeholder}
        placeholder="Search..."
        onValueChange={(placeholder) => patch({ placeholder })}
      />

      <Slider
        label="Width"
        value={config.expandedWidth}
        min={200}
        max={440}
        step={10}
        unit="px"
        defaultValue={DEFAULT_SEARCH_BUTTON_CONFIG.expandedWidth}
        onValueChange={(expandedWidth) => patch({ expandedWidth })}
      />

      <Slider
        label="Pull"
        value={config.magneticStrength}
        min={0}
        max={24}
        step={1}
        unit="px"
        defaultValue={DEFAULT_SEARCH_BUTTON_CONFIG.magneticStrength}
        onValueChange={(magneticStrength) => patch({ magneticStrength })}
      />
    </div>
  );
}
