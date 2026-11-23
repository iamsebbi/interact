"use client";

import { SelectField, Slider, Switch } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_UPLOAD_BUTTON_CONFIG,
  UPLOAD_SIZE_OPTIONS,
  type UploadButtonConfig,
} from "./config";

export function UploadButtonInspector({
  config,
  onChange,
}: ComponentInspectorProps<UploadButtonConfig>) {
  const patch = (next: Partial<UploadButtonConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={UPLOAD_SIZE_OPTIONS}
        onValueChange={(next) =>
          patch({ size: next as UploadButtonConfig["size"] })
        }
      />

      <Slider
        label="Duration"
        value={config.durationSec}
        min={1.2}
        max={6.0}
        step={0.4}
        unit="s"
        defaultValue={DEFAULT_UPLOAD_BUTTON_CONFIG.durationSec}
        onValueChange={(durationSec) => patch({ durationSec })}
      />

      <Switch
        label="Simulate Retry"
        checked={config.simulateFailure}
        onCheckedChange={(simulateFailure) => patch({ simulateFailure })}
      />

      <Switch
        label="Anchored"
        checked={config.anchored}
        onCheckedChange={(anchored) => patch({ anchored })}
      />
    </div>
  );
}
