import React, { useMemo, useState } from "react";
import { DownloadButton } from "../../ui/download-button";
import { Component as FluidDropdown, type Category } from "../../ui/fluid-dropdown";
import { WakeSliderField } from "../../ui/wake-slider";
import {
  ComponentDetailLayout,
  type ShowcaseComponentNavItem,
} from "../ComponentDetailLayout";

export interface DownloadButtonConfig {
  sizeMB: number;
  durationSec: number;
  progressFormat: "size" | "percent";
  size: "sm" | "md" | "lg" | "xl";
}

export const DEFAULT_DOWNLOAD_BUTTON_CONFIG: DownloadButtonConfig = {
  sizeMB: 32,
  durationSec: 3.2,
  progressFormat: "size",
  size: "xl",
};

export const DOWNLOAD_SIZE_CATEGORIES: Category[] = [
  { id: "sm", label: "Small", color: "currentColor" },
  { id: "md", label: "Medium", color: "currentColor" },
  { id: "lg", label: "Large", color: "currentColor" },
  { id: "xl", label: "Extra Large", color: "currentColor" },
];

export const DOWNLOAD_READOUT_CATEGORIES: Category[] = [
  { id: "size", label: "Megabytes", color: "currentColor" },
  { id: "percent", label: "Percentage", color: "currentColor" },
];

export function buildDownloadButtonJsx(config: DownloadButtonConfig): string {
  const lines = [
    `import { DownloadButton } from "@/components/ui/download-button";`,
    ``,
    `<DownloadButton`,
    `  sizeMB={${config.sizeMB}}`,
  ];
  if (config.durationSec !== DEFAULT_DOWNLOAD_BUTTON_CONFIG.durationSec) {
    lines.push(`  durationMs={${Math.round(config.durationSec * 1000)}}`);
  }
  if (config.progressFormat !== DEFAULT_DOWNLOAD_BUTTON_CONFIG.progressFormat) {
    lines.push(`  progressFormat="${config.progressFormat}"`);
  }
  if (config.size !== DEFAULT_DOWNLOAD_BUTTON_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  lines.push(`  onOpen={() => console.log("Open downloaded file")}`);
  lines.push(`/>`);
  return lines.join("\n");
}

export interface DownloadButtonDemoProps {
  componentList?: ShowcaseComponentNavItem[];
  activeComponentId?: string;
  onSelectComponent?: (id: string) => void;
  onClose?: () => void;
  onOpenInStudio?: () => void;
  config?: DownloadButtonConfig;
  onConfigChange?: (next: DownloadButtonConfig) => void;
  stageSlotRef?: React.RefObject<HTMLDivElement | null>;
  isClosing?: boolean;
  skipEntranceMotion?: boolean;
  onPlay?: () => void;
  onReset?: () => void;
}

export const DownloadButtonDemo: React.FC<DownloadButtonDemoProps> = ({
  componentList,
  activeComponentId,
  onSelectComponent,
  onClose,
  onOpenInStudio,
  config: controlledConfig,
  onConfigChange,
  stageSlotRef,
  isClosing,
  skipEntranceMotion,
  onPlay,
  onReset,
}) => {
  const [internalConfig, setInternalConfig] = useState<DownloadButtonConfig>(
    DEFAULT_DOWNLOAD_BUTTON_CONFIG
  );
  const [replaySignal, setReplaySignal] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const config = controlledConfig ?? internalConfig;
  const setConfig = onConfigChange ?? setInternalConfig;
  const patchConfig = (patch: Partial<DownloadButtonConfig>) =>
    setConfig({ ...config, ...patch });

  const jsxSnippet = useMemo(() => buildDownloadButtonJsx(config), [config]);

  const handleReset = () => {
    setConfig(DEFAULT_DOWNLOAD_BUTTON_CONFIG);
    setResetKey((k) => k + 1);
    onReset?.();
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
      return;
    }
    setReplaySignal((s) => s + 1);
  };

  return (
    <ComponentDetailLayout
      title="Download Button"
      stageSlotRef={stageSlotRef}
      stage={
        stageSlotRef ? undefined : (
          <DownloadButton
            key={resetKey}
            sizeMB={config.sizeMB}
            durationMs={Math.round(config.durationSec * 1000)}
            progressFormat={config.progressFormat}
            size={config.size}
            replaySignal={replaySignal}
          />
        )
      }
      configTitle="Download Button"
      configDescription="Interactive pill download trigger that spawns a Pause/Play circle, reveals a left Cancel action while paused, contracts to a checkmark, and expands into Open."
      onReset={handleReset}
      onPlay={handlePlay}
      showCopyPrompt
      codeSnippet={jsxSnippet}
      componentList={componentList}
      activeComponentId={activeComponentId}
      onSelectComponent={onSelectComponent}
      onClose={onClose}
      onOpenInStudio={onOpenInStudio}
      isClosing={isClosing}
      skipEntranceMotion={skipEntranceMotion}
    >
      <div className="flex flex-col gap-2 text-xs">
        <FluidDropdown
          label="Size"
          categories={DOWNLOAD_SIZE_CATEGORIES}
          selectedCategory={
            DOWNLOAD_SIZE_CATEGORIES.find((c) => c.id === config.size) ??
            DOWNLOAD_SIZE_CATEGORIES[3]
          }
          onSelectCategory={(cat) =>
            patchConfig({ size: cat.id as DownloadButtonConfig["size"] })
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
            patchConfig({
              progressFormat: cat.id as DownloadButtonConfig["progressFormat"],
            })
          }
          showDividerAfterFirst={false}
          portal
          triggerClassName="h-11 rounded-xl bg-secondary/80 hover:bg-secondary border-border px-3.5 text-xs text-foreground"
        />

        <WakeSliderField
          label="File Size"
          value={config.sizeMB}
          min={4}
          max={256}
          step={4}
          unit="MB"
          defaultValue={DEFAULT_DOWNLOAD_BUTTON_CONFIG.sizeMB}
          onChange={(sizeMB) => patchConfig({ sizeMB })}
        />
        <WakeSliderField
          label="Duration"
          value={config.durationSec}
          min={1.2}
          max={6.0}
          step={0.4}
          unit="s"
          defaultValue={DEFAULT_DOWNLOAD_BUTTON_CONFIG.durationSec}
          onChange={(durationSec) => patchConfig({ durationSec })}
        />
      </div>
    </ComponentDetailLayout>
  );
};
