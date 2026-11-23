"use client";

import { SelectField, Slider } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_DOWNLOAD_BUTTON_CONFIG,
  DOWNLOAD_READOUT_OPTIONS,
  DOWNLOAD_SIZE_OPTIONS,
  type DownloadButtonConfig,
} from "./config";

export function DownloadButtonInspector({
  config,
  onChange,
}: ComponentInspectorProps<DownloadButtonConfig>) {
  const patch = (next: Partial<DownloadButtonConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={DOWNLOAD_SIZE_OPTIONS}
        onValueChange={(next) =>
          patch({ size: next as DownloadButtonConfig["size"] })
        }
      />

      <SelectField
        label="Readout"
        value={config.progressFormat}
        options={DOWNLOAD_READOUT_OPTIONS}
        onValueChange={(next) =>
          patch({
            progressFormat: next as DownloadButtonConfig["progressFormat"],
          })
        }
      />

      <Slider
        label="File Size"
        value={config.sizeMB}
        min={4}
        max={256}
        step={4}
        unit="MB"
        defaultValue={DEFAULT_DOWNLOAD_BUTTON_CONFIG.sizeMB}
        onValueChange={(sizeMB) => patch({ sizeMB })}
      />

      <Slider
        label="Duration"
        value={config.durationSec}
        min={1.2}
        max={6.0}
        step={0.4}
        unit="s"
        defaultValue={DEFAULT_DOWNLOAD_BUTTON_CONFIG.durationSec}
        onValueChange={(durationSec) => patch({ durationSec })}
      />
    </div>
  );
}
