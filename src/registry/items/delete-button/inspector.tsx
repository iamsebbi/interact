"use client";

import { SelectField, Slider, Switch, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_DELETE_BUTTON_CONFIG,
  DELETE_BUTTON_SIZE_OPTIONS,
  DELETE_BUTTON_THEME_OPTIONS,
  type DeleteButtonConfig,
  type DeleteButtonStudioTheme,
} from "./config";
import type { DeleteButtonSize } from "./delete-button";

const LABEL_FIELDS: ReadonlyArray<{
  key: "confirmLabel" | "cancelLabel" | "deletedLabel";
  label: string;
  placeholder: string;
}> = [
  { key: "confirmLabel", label: "Confirm", placeholder: "Confirm" },
  { key: "cancelLabel", label: "Cancel", placeholder: "Cancel" },
  { key: "deletedLabel", label: "Deleted", placeholder: "Deleted" },
];

export function DeleteButtonInspector({
  config,
  onChange,
}: ComponentInspectorProps<DeleteButtonConfig>) {
  const patch = (next: Partial<DeleteButtonConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={DELETE_BUTTON_SIZE_OPTIONS}
        onValueChange={(next) => patch({ size: next as DeleteButtonSize })}
      />

      <SelectField
        label="Theme"
        value={config.theme}
        options={DELETE_BUTTON_THEME_OPTIONS}
        onValueChange={(next) =>
          patch({ theme: next as DeleteButtonStudioTheme })
        }
      />

      {LABEL_FIELDS.map(({ key, label, placeholder }) => (
        <TextField
          key={key}
          label={label}
          value={config[key]}
          placeholder={placeholder}
          onValueChange={(value) => patch({ [key]: value })}
        />
      ))}

      <Slider
        label="Hold"
        value={config.deletedDurationSec}
        min={0.6}
        max={3.0}
        step={0.2}
        unit="s"
        defaultValue={DEFAULT_DELETE_BUTTON_CONFIG.deletedDurationSec}
        onValueChange={(deletedDurationSec) => patch({ deletedDurationSec })}
      />

      <Switch
        label="Show Tray"
        checked={config.showTray}
        onCheckedChange={(showTray) => patch({ showTray })}
        aria-label="Toggle elevated tray around delete button"
      />
    </div>
  );
}
