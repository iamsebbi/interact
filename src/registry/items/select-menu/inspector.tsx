"use client";

import { SelectField, Slider, Switch, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_SELECT_MENU_CONFIG,
  SELECT_MENU_SIZE_OPTIONS,
  SELECT_MENU_THEME_OPTIONS,
  type SelectMenuConfig,
} from "./config";
import type { SelectMenuSize, SelectMenuTheme } from "./select-menu";

export function SelectMenuInspector({
  config,
  onChange,
}: ComponentInspectorProps<SelectMenuConfig>) {
  const patch = (next: Partial<SelectMenuConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={SELECT_MENU_SIZE_OPTIONS}
        onValueChange={(next) => patch({ size: next as SelectMenuSize })}
      />

      <SelectField
        label="Theme"
        value={config.theme}
        options={SELECT_MENU_THEME_OPTIONS}
        onValueChange={(next) => patch({ theme: next as SelectMenuTheme })}
      />

      <TextField
        label="Label"
        value={config.label}
        placeholder="Sort"
        onValueChange={(label) => patch({ label })}
      />

      <TextField
        label="Options"
        value={config.options}
        placeholder="Newest, Most popular, Top rated"
        onValueChange={(options) => patch({ options })}
      />

      <Slider
        label="Bounce"
        value={config.bounce}
        defaultValue={DEFAULT_SELECT_MENU_CONFIG.bounce}
        min={0}
        max={1.6}
        step={0.05}
        unit="×"
        onValueChange={(bounce) => patch({ bounce })}
      />

      <Slider
        label="Speed"
        value={config.speed}
        defaultValue={DEFAULT_SELECT_MENU_CONFIG.speed}
        min={0.5}
        max={2}
        step={0.05}
        unit="×"
        onValueChange={(speed) => patch({ speed })}
      />

      <Slider
        label="Blur"
        value={config.blur}
        defaultValue={DEFAULT_SELECT_MENU_CONFIG.blur}
        min={0}
        max={2}
        step={0.05}
        unit="×"
        onValueChange={(blur) => patch({ blur })}
      />

      <Switch
        label="Show Tray"
        checked={config.showTray}
        onCheckedChange={(showTray) => patch({ showTray })}
        aria-label="Toggle elevated tray around active row"
      />
    </div>
  );
}
