"use client";

import { SelectField, Slider, Switch, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_STATUS_PILL_CONFIG,
  STATUS_PILL_DEMO_OPTIONS,
  STATUS_PILL_SIZE_OPTIONS,
  STATUS_PILL_THEME_OPTIONS,
  type StatusPillConfig,
} from "./config";
import type {
  StatusPillDemoMode,
  StatusPillSize,
  StatusPillTheme,
} from "./status-pill";

export function StatusPillInspector({
  config,
  onChange,
}: ComponentInspectorProps<StatusPillConfig>) {
  const patch = (next: Partial<StatusPillConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={STATUS_PILL_SIZE_OPTIONS}
        onValueChange={(next) => patch({ size: next as StatusPillSize })}
      />

      <SelectField
        label="Theme"
        value={config.theme}
        options={STATUS_PILL_THEME_OPTIONS}
        onValueChange={(next) => patch({ theme: next as StatusPillTheme })}
      />

      <SelectField
        label="Demo Mode"
        value={config.demoMode}
        options={STATUS_PILL_DEMO_OPTIONS}
        onValueChange={(next) =>
          patch({ demoMode: next as StatusPillDemoMode })
        }
      />

      <Slider
        label="Files"
        value={config.demoFiles}
        defaultValue={DEFAULT_STATUS_PILL_CONFIG.demoFiles}
        min={1}
        max={10}
        step={1}
        onValueChange={(demoFiles) => patch({ demoFiles })}
      />

      <TextField
        label="Idle Label"
        value={config.idleLabel}
        placeholder="Up to date"
        onValueChange={(idleLabel) => patch({ idleLabel })}
      />

      <TextField
        label="Done Label"
        value={config.doneLabel}
        placeholder="Synced"
        onValueChange={(doneLabel) => patch({ doneLabel })}
      />

      <TextField
        label="Fail Label"
        value={config.failLabel}
        placeholder="Sync failed"
        onValueChange={(failLabel) => patch({ failLabel })}
      />

      <Switch
        label="Show Tray"
        checked={config.showTray}
        onCheckedChange={(showTray) => patch({ showTray })}
        aria-label="Toggle elevated tray around status pill"
      />
    </div>
  );
}
