"use client";

import { SelectField, Slider, Switch, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import type { CodeInputSize, CodeInputTheme } from "./code-input";
import {
  CODE_INPUT_SIZE_OPTIONS,
  CODE_INPUT_THEME_OPTIONS,
  type CodeInputConfig,
  DEFAULT_CODE_INPUT_CONFIG,
} from "./config";

export function CodeInputInspector({
  config,
  onChange,
}: ComponentInspectorProps<CodeInputConfig>) {
  const patch = (next: Partial<CodeInputConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={CODE_INPUT_SIZE_OPTIONS}
        onValueChange={(next) => patch({ size: next as CodeInputSize })}
      />

      <SelectField
        label="Theme"
        value={config.theme}
        options={CODE_INPUT_THEME_OPTIONS}
        onValueChange={(next) => patch({ theme: next as CodeInputTheme })}
      />

      <Slider
        label="Digits"
        value={config.length}
        defaultValue={DEFAULT_CODE_INPUT_CONFIG.length}
        min={4}
        max={8}
        step={1}
        onValueChange={(length) => patch({ length })}
      />

      <TextField
        label="Valid Code"
        value={config.testCode}
        placeholder="123456"
        onValueChange={(testCode) => patch({ testCode })}
      />

      <TextField
        label="Label"
        value={config.label}
        placeholder="Enter code"
        onValueChange={(label) => patch({ label })}
      />

      <TextField
        label="Done Label"
        value={config.doneLabel}
        placeholder="Verified"
        onValueChange={(doneLabel) => patch({ doneLabel })}
      />

      <Slider
        label="Bounce"
        value={config.bounce}
        defaultValue={DEFAULT_CODE_INPUT_CONFIG.bounce}
        min={0}
        max={1.6}
        step={0.05}
        onValueChange={(bounce) => patch({ bounce })}
      />

      <Slider
        label="Speed"
        value={config.speed}
        defaultValue={DEFAULT_CODE_INPUT_CONFIG.speed}
        min={0.5}
        max={2}
        step={0.05}
        onValueChange={(speed) => patch({ speed })}
      />

      <Switch
        label="Show Tray"
        checked={config.showTray}
        onCheckedChange={(showTray) => patch({ showTray })}
        aria-label="Toggle elevated tray around code input"
      />
    </div>
  );
}
