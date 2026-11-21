import React from "react";
import {
  DEFAULT_DOWNLOAD_BUTTON_CONFIG,
  DOWNLOAD_READOUT_CATEGORIES,
  DOWNLOAD_SIZE_CATEGORIES,
  type DownloadButtonConfig,
} from "../../showcase/demos/DownloadButtonDemo";
import { Component as FluidDropdown } from "../../ui/fluid-dropdown";
import { SliderControl } from "../StudioControls";

export interface DownloadButtonInspectorProps {
  config: DownloadButtonConfig;
  onChange: (next: DownloadButtonConfig) => void;
}

export const DownloadButtonInspector: React.FC<DownloadButtonInspectorProps> = ({
  config,
  onChange,
}) => {
  const patch = (p: Partial<DownloadButtonConfig>) => onChange({ ...config, ...p });

  return (
    <div className="space-y-2 text-xs">
      <FluidDropdown
        label="Size"
        categories={DOWNLOAD_SIZE_CATEGORIES}
        selectedCategory={
          DOWNLOAD_SIZE_CATEGORIES.find((c) => c.id === config.size) ??
          DOWNLOAD_SIZE_CATEGORIES[3]
        }
        onSelectCategory={(cat) =>
          patch({ size: cat.id as DownloadButtonConfig["size"] })
        }
        showDividerAfterFirst={false}
        portal
        triggerClassName="h-11 rounded-xl bg-secondary/80 hover:bg-secondary border-border px-3.5 text-xs text-foreground"
      />

      <FluidDropdown
        label="Readout"
        categories={DOWNLOAD_READOUT_CATEGORIES}
        selectedCategory={
          DOWNLOAD_READOUT_CATEGORIES.find(
            (c) => c.id === config.progressFormat
          ) ?? DOWNLOAD_READOUT_CATEGORIES[0]
        }
        onSelectCategory={(cat) =>
          patch({
            progressFormat: cat.id as DownloadButtonConfig["progressFormat"],
          })
        }
        showDividerAfterFirst={false}
        portal
        triggerClassName="h-11 rounded-xl bg-secondary/80 hover:bg-secondary border-border px-3.5 text-xs text-foreground"
      />

      <SliderControl
        label="File Size"
        unit="MB"
        value={config.sizeMB}
        min={4}
        max={256}
        step={4}
        defaultValue={DEFAULT_DOWNLOAD_BUTTON_CONFIG.sizeMB}
        onChange={(sizeMB) => patch({ sizeMB })}
      />
      <SliderControl
        label="Duration"
        unit="s"
        value={config.durationSec}
        min={1.2}
        max={6.0}
        step={0.4}
        defaultValue={DEFAULT_DOWNLOAD_BUTTON_CONFIG.durationSec}
        onChange={(durationSec) => patch({ durationSec })}
      />
    </div>
  );
};
