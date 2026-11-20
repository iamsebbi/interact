import React, { useMemo, useState } from "react";
import { Palette } from "../../palette/Palette";
import { WakeSliderField } from "../../ui/wake-slider";
import {
  ComponentDetailLayout,
  type ShowcaseComponentNavItem,
} from "../ComponentDetailLayout";

export interface PaletteConfig {
  count: number;
  corner: number;
  morph: number;
}

export const DEFAULT_PALETTE_CONFIG: PaletteConfig = {
  count: 4,
  corner: 10,
  morph: 50,
};

export function buildPaletteJsx(config: PaletteConfig): string {
  return [
    `import { Palette } from "@/components/palette/Palette";`,
    ``,
    `<Palette`,
    `  count={${config.count}}`,
    `  corner={${config.corner}}`,
    `  morph={${config.morph}}`,
    `  onChange={(colors) => console.log(colors)}`,
    `/>`,
  ].join("\n");
}

export interface PaletteDemoProps {
  componentList?: ShowcaseComponentNavItem[];
  activeComponentId?: string;
  onSelectComponent?: (id: string) => void;
  onClose?: () => void;
  onOpenInStudio?: () => void;
  config?: PaletteConfig;
  onConfigChange?: (next: PaletteConfig) => void;
  stageSlotRef?: React.RefObject<HTMLDivElement | null>;
  isClosing?: boolean;
  skipEntranceMotion?: boolean;
  onPlay?: () => void;
}

export const PaletteDemo: React.FC<PaletteDemoProps> = ({
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
}) => {
  const [internalConfig, setInternalConfig] = useState<PaletteConfig>(DEFAULT_PALETTE_CONFIG);
  const config = controlledConfig ?? internalConfig;
  const setConfig = onConfigChange ?? setInternalConfig;
  const patchConfig = (patch: Partial<PaletteConfig>) => setConfig({ ...config, ...patch });

  const jsxSnippet = useMemo(() => buildPaletteJsx(config), [config]);

  return (
    <ComponentDetailLayout
      title="OKLCH Palette"
      stageSlotRef={stageSlotRef}
      stage={
        stageSlotRef ? undefined : (
          <Palette
            count={config.count}
            corner={config.corner}
            morph={config.morph}
          />
        )
      }
      configTitle="OKLCH Palette"
      configDescription="Perceptually uniform OKLCH color ramp generator with elastic SVG goo transitions and instant hex copy."
      onReset={() => setConfig(DEFAULT_PALETTE_CONFIG)}
      onPlay={onPlay}
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
        <WakeSliderField
          label="Color Count"
          value={config.count}
          min={3}
          max={5}
          step={1}
          defaultValue={DEFAULT_PALETTE_CONFIG.count}
          onChange={(count) => patchConfig({ count })}
        />
        <WakeSliderField
          label="Corner Radius"
          value={config.corner}
          min={0}
          max={20}
          step={1}
          unit="px"
          defaultValue={DEFAULT_PALETTE_CONFIG.corner}
          onChange={(corner) => patchConfig({ corner })}
        />
        <WakeSliderField
          label="Morph Speed"
          value={config.morph}
          min={0}
          max={100}
          step={5}
          unit="%"
          defaultValue={DEFAULT_PALETTE_CONFIG.morph}
          onChange={(morph) => patchConfig({ morph })}
        />
      </div>
    </ComponentDetailLayout>
  );
};
