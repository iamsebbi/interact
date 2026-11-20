import React, { useMemo } from "react";
import { GradientTile } from "../../GradientTile";
import { DEFAULT_GLOBALS, DEFAULT_TILES } from "../../../constants/defaults";
import { AnimationMode, TileConfig } from "../../../types/gradient";
import { WakeSliderField } from "../../ui/wake-slider";
import {
  ComponentDetailLayout,
  ShowcaseSection,
  ShowcaseToggleField,
  type ShowcaseComponentNavItem,
} from "../ComponentDetailLayout";
import { cn } from "../../../utils/cn";

const FEATURED_PRESET_INDICES = [0, 12, 16, 17, 18, 19] as const;
const ANIMATION_MODES: readonly AnimationMode[] = ["scale", "lift", "fade", "rotate"];

export interface GradientTileConfig {
  presetIndex: number;
  size: number;
  radius: number;
  animate: boolean;
  animationMode: AnimationMode;
  noise: boolean;
  beamActive: boolean;
}

export const DEFAULT_GRADIENT_TILE_CONFIG: GradientTileConfig = {
  presetIndex: 0,
  size: 240,
  radius: 28,
  animate: true,
  animationMode: "scale",
  noise: false,
  beamActive: false,
};

export function resolveGradientTile(config: GradientTileConfig): TileConfig {
  const baseTile = DEFAULT_TILES[config.presetIndex] ?? DEFAULT_TILES[0];
  return {
    ...baseTile,
    animate: config.animate,
    animationMode: config.animationMode,
    noise: config.noise,
    beamActive: config.beamActive,
  };
}

export function buildGradientTileJsx(config: GradientTileConfig): string {
  const baseTile = DEFAULT_TILES[config.presetIndex] ?? DEFAULT_TILES[0];
  const presetName = baseTile.name || `Preset #${config.presetIndex + 1}`;
  return [
    `import { GradientTile } from "@/components/GradientTile";`,
    `import { DEFAULT_TILES, DEFAULT_GLOBALS } from "@/constants/defaults";`,
    ``,
    `// "${presetName}"`,
    `<GradientTile`,
    `  tile={{`,
    `    ...DEFAULT_TILES[${config.presetIndex}],`,
    `    animate: ${config.animate},`,
    `    animationMode: "${config.animationMode}",`,
    `    noise: ${config.noise},`,
    `    beamActive: ${config.beamActive},`,
    `  }}`,
    `  globals={{ ...DEFAULT_GLOBALS, radius: ${config.radius} }}`,
    `  size={${config.size}}`,
    `/>`,
  ].join("\n");
}

export interface GradientTileDemoProps {
  componentList?: ShowcaseComponentNavItem[];
  activeComponentId?: string;
  onSelectComponent?: (id: string) => void;
  onClose?: () => void;
  onOpenInStudio?: () => void;
  config: GradientTileConfig;
  onConfigChange: (next: GradientTileConfig) => void;
  stageSlotRef?: React.RefObject<HTMLDivElement | null>;
  isClosing?: boolean;
  skipEntranceMotion?: boolean;
  onPlay?: () => void;
}

export const GradientTileDemo: React.FC<GradientTileDemoProps> = ({
  componentList,
  activeComponentId,
  onSelectComponent,
  onClose,
  onOpenInStudio,
  config,
  onConfigChange,
  stageSlotRef,
  isClosing,
  skipEntranceMotion,
  onPlay,
}) => {
  const patchConfig = (patch: Partial<GradientTileConfig>) =>
    onConfigChange({ ...config, ...patch });

  const resolvedTile = useMemo(() => resolveGradientTile(config), [config]);
  const jsxSnippet = useMemo(() => buildGradientTileJsx(config), [config]);

  return (
    <ComponentDetailLayout
      title="Squircle Gradient"
      stageSlotRef={stageSlotRef}
      stage={
        stageSlotRef ? undefined : (
          <GradientTile
            tile={resolvedTile}
            globals={{ ...DEFAULT_GLOBALS, radius: config.radius }}
            size={config.size}
          />
        )
      }
      configTitle="Squircle Gradient"
      configDescription="Layered SVG & CSS squircle gradient tile with organic blob shapes, echo trails, rim lighting, film grain, and border beams."
      onReset={() => onConfigChange(DEFAULT_GRADIENT_TILE_CONFIG)}
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
      {/* Preset Picker */}
      <ShowcaseSection
        label={`Preset (${FEATURED_PRESET_INDICES.length})`}
        valueLabel={resolvedTile.name || `#${config.presetIndex + 1}`}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {FEATURED_PRESET_INDICES.map((idx) => {
            const preset = DEFAULT_TILES[idx];
            if (!preset) return null;
            const isSelected = config.presetIndex === idx;
            const dotA = preset.blobs?.[0]?.color || preset.rim;
            const dotB = preset.blobs?.[1]?.color || dotA;
            return (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  patchConfig({
                    presetIndex: idx,
                    animate: preset.animate ?? true,
                    animationMode: preset.animationMode ?? "scale",
                    noise: Boolean(preset.noise),
                    beamActive: Boolean(preset.beamActive),
                  })
                }
                className={cn(
                  "h-9 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-2 text-left",
                  isSelected
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <span
                  className="size-3.5 rounded-full shrink-0 border border-white/20"
                  style={{
                    background: `linear-gradient(135deg, ${dotA}, ${dotB})`,
                  }}
                />
                <span className="truncate">{preset.name || `Preset ${idx + 1}`}</span>
              </button>
            );
          })}
        </div>
      </ShowcaseSection>

      {/* Motion Mode */}
      <ShowcaseSection
        label={`Entrance (${ANIMATION_MODES.length})`}
        valueLabel={config.animationMode}
      >
        <div className="grid grid-cols-4 gap-1">
          {ANIMATION_MODES.map((mode) => {
            const isSelected = config.animationMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => patchConfig({ animationMode: mode, animate: true })}
                className={cn(
                  "h-8 px-1.5 rounded-xl border text-[11px] font-medium capitalize transition-all cursor-pointer flex items-center justify-center",
                  isSelected
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </ShowcaseSection>

      <div className="flex flex-col gap-2 text-xs">
        <WakeSliderField
          label="Tile Size"
          value={config.size}
          min={140}
          max={320}
          step={10}
          unit="px"
          defaultValue={DEFAULT_GRADIENT_TILE_CONFIG.size}
          onChange={(size) => patchConfig({ size })}
        />
        <WakeSliderField
          label="Squircle Radius"
          value={config.radius}
          min={0}
          max={50}
          step={2}
          unit="%"
          defaultValue={DEFAULT_GRADIENT_TILE_CONFIG.radius}
          onChange={(radius) => patchConfig({ radius })}
        />
        <ShowcaseToggleField
          label="Entrance Motion"
          checked={config.animate}
          onCheckedChange={(animate) => patchConfig({ animate })}
          ariaLabel="Toggle entrance motion"
        />
        <ShowcaseToggleField
          label="Film Grain"
          checked={config.noise}
          onCheckedChange={(noise) => patchConfig({ noise })}
          ariaLabel="Toggle film grain"
        />
        <ShowcaseToggleField
          label="Border Beam"
          checked={config.beamActive}
          onCheckedChange={(beamActive) => patchConfig({ beamActive })}
          ariaLabel="Toggle border beam"
        />
      </div>
    </ComponentDetailLayout>
  );
};
