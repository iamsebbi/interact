import React, { useState } from "react";
import {
  BeamColorVariant,
  BeamSize,
  BlobConfig,
  GlobalPresetKey,
  GlobalsConfig,
  RimAnimationMode,
  RimOrigin,
  TileConfig,
} from "../../../types/gradient";
import { DEFAULT_GLOBALS, DEFAULT_TILES, GLOBAL_PRESETS } from "../../../constants/defaults";
import { StudioTabTile } from "../tabs/StudioTabTile";
import { StudioTabMotion } from "../tabs/StudioTabMotion";
import { SliderControl } from "../StudioControls";
import { Button } from "../../ui/button";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsHighlight,
  TabsHighlightItem,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs";
import { Layers01, Sparkles, Settings02, Add01, Dices, Eye, EyeOff } from "../../icons";
import { cn } from "../../../utils/cn";

type GradientTab = "tile" | "motion" | "scene";

export interface GradientInspectorProps {
  tile: TileConfig;
  globals: GlobalsConfig;
  blobIdx: number;
  setBi: React.Dispatch<React.SetStateAction<number>>;
  setHoveredBlob: (idx: number | null) => void;
  patchTile: (patch: Partial<TileConfig>) => void;
  patchBlob: (idx: number, patch: Partial<BlobConfig>) => void;
  patchGlobals: (patch: Partial<GlobalsConfig>) => void;
  addBlob: () => void;
  duplicateBlob: (idx: number) => void;
  removeBlob: () => void;
  removeSpecificBlob: (idx: number) => void;
  shuffleTile: () => void;
  disableBlur: boolean;
  onToggleBlur: () => void;
  onOpenPresets: () => void;
  onBumpAnimation: () => void;
  onDebouncedBumpAnimation: () => void;
}

export const GradientInspector: React.FC<GradientInspectorProps> = ({
  tile,
  globals,
  blobIdx,
  setBi,
  setHoveredBlob,
  patchTile,
  patchBlob,
  patchGlobals,
  addBlob,
  duplicateBlob,
  removeBlob,
  removeSpecificBlob,
  shuffleTile,
  disableBlur,
  onToggleBlur,
  onOpenPresets,
  onBumpAnimation,
  onDebouncedBumpAnimation,
}) => {
  const [activeTab, setActiveTab] = useState<GradientTab>("tile");
  const [openAspect, setOpenAspect] = useState(true);
  const [openTransform, setOpenTransform] = useState(true);
  const [openFinishes, setOpenFinishes] = useState(false);

  const safeBlobIdx = Math.min(blobIdx, Math.max(0, tile.blobs.length - 1));
  const blob = tile.blobs[safeBlobIdx] ?? {
    w: 50,
    h: 50,
    x: 50,
    y: 50,
    color: "#6366f1",
    blur: 30,
    rot: 0,
  };

  const tRimOpacity = tile.rimOpacity ?? globals.rimOpacity;
  const tRimBlur = tile.rimBlur ?? globals.rimBlur;
  const tRimSpread = tile.rimSpread ?? globals.rimSpread;
  const tRimAnimate = tile.rimAnimate ?? globals.rimAnimate;
  const tRimMode: RimAnimationMode = tile.rimAnimationMode || globals.rimAnimationMode;
  const tRimOrigin: RimOrigin = tile.rimOrigin || globals.rimOrigin;
  const tRimSpeed = tile.rimAnimationSpeed ?? globals.rimAnimationSpeed;
  const tContrast = tile.contrast ?? globals.contrast;
  const tSaturate = tile.saturate ?? globals.saturate;
  const tBlurScale = tile.blurScale ?? globals.blurScale;
  const tBeamActive = tile.beamActive ?? globals.beamActive;
  const tBeamSize: BeamSize = tile.beamSize || globals.beamSize;
  const tBeamColor: BeamColorVariant = tile.beamColorVariant || globals.beamColorVariant;
  const tBeamStrength = tile.beamStrength ?? globals.beamStrength;
  const tBeamDuration = tile.beamDuration ?? globals.beamDuration;
  const tNoise = tile.noise ?? globals.noise;
  const tNoiseOpacity = tile.noiseOpacity ?? globals.noiseOpacity;
  const tNoiseScale = tile.noiseScale ?? globals.noiseScale;
  const tAnimate = tile.animate === undefined ? globals.animate : tile.animate;
  const tAnimMode = tile.animationMode || globals.animationMode;
  const tAnimDir = tile.animationDirection || globals.animationDirection;
  const tAnimSpeed = tile.animationSpeed ?? globals.animationSpeed;
  const tAnimScale = tile.animationScale ?? globals.animationScale;

  const applyTilePreset = (presetKey: GlobalPresetKey) => {
    const p = GLOBAL_PRESETS[presetKey];
    patchTile({
      contrast: p.contrast,
      saturate: p.saturate,
      blurScale: p.blurScale,
      rimOpacity: p.rimOpacity,
      rimBlur: p.rimBlur,
      rimSpread: p.rimSpread,
    });
  };

  const tabs: { id: GradientTab; label: string; icon: React.ReactNode }[] = [
    { id: "tile", label: "Layer", icon: <Layers01 size={14} /> },
    { id: "motion", label: "Effects", icon: <Sparkles size={14} /> },
    { id: "scene", label: "Geometry", icon: <Settings02 size={14} /> },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Quick Gradient Actions Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenPresets}
          iconLeft={<Sparkles size={13} />}
        >
          Presets ({DEFAULT_TILES.length})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addBlob}
          iconLeft={<Add01 size={13} />}
        >
          Add Blob
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={shuffleTile}
          iconLeft={<Dices size={13} />}
        >
          Shuffle
        </Button>
        <button
          type="button"
          onClick={onToggleBlur}
          title={disableBlur ? "Enable blob blur" : "Disable blur to inspect shapes"}
          className={cn(
            "h-8 px-2.5 rounded-full border text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer",
            disableBlur
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary/70 border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {disableBlur ? <EyeOff size={13} /> : <Eye size={13} />}
          <span>{disableBlur ? "Raw" : "Blur"}</span>
        </button>
      </div>

      {/* Tile Name */}
      <input
        type="text"
        value={tile.name || ""}
        placeholder="Gradient tile name..."
        onChange={(e) => patchTile({ name: e.target.value })}
        className="w-full h-8 px-3 rounded-full bg-input border border-border text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring transition-colors"
      />

      {/* Gradient Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as GradientTab)}
        className="flex flex-col gap-3"
      >
        <TabsHighlight className="absolute inset-0 rounded-full bg-primary shadow-xs">
          <TabsList className="flex items-center rounded-full bg-secondary/70 p-1 border border-border">
            {tabs.map((tab) => (
              <TabsHighlightItem key={tab.id} value={tab.id} className="flex-1">
                <TabsTrigger
                  value={tab.id}
                  className="w-full relative z-10 py-1.5 px-2 rounded-full text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-muted-foreground hover:text-foreground data-[state=active]:text-primary-foreground data-[state=active]:font-semibold"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              </TabsHighlightItem>
            ))}
          </TabsList>
        </TabsHighlight>

        <TabsContents>
          <TabsContent value="tile" className="space-y-3.5 text-xs text-foreground">
            <StudioTabTile
              isEmpty={false}
              tile={tile}
              blobIdx={safeBlobIdx}
              blob={blob}
              addBlob={addBlob}
              duplicateBlob={() => duplicateBlob(safeBlobIdx)}
              removeBlob={removeBlob}
              removeSpecificBlob={removeSpecificBlob}
              setBi={setBi}
              setHoveredBlob={setHoveredBlob}
              patchTile={patchTile}
              patchBlob={(patch) => patchBlob(safeBlobIdx, patch)}
              openAspect={openAspect}
              setOpenAspect={setOpenAspect}
              openTransform={openTransform}
              setOpenTransform={setOpenTransform}
              openFinishes={openFinishes}
              setOpenFinishes={setOpenFinishes}
            />
          </TabsContent>

          <TabsContent value="motion" className="space-y-3.5 text-xs text-foreground">
            <StudioTabMotion
              isEmpty={false}
              activeTi={0}
              tile={tile}
              patchTile={patchTile}
              applyTilePreset={applyTilePreset}
              bumpTileAnimation={onBumpAnimation}
              debouncedBumpAnim={onDebouncedBumpAnimation}
              tRimOpacity={tRimOpacity}
              tRimBlur={tRimBlur}
              tRimSpread={tRimSpread}
              tRimAnimate={tRimAnimate}
              tRimMode={tRimMode}
              tRimOrigin={tRimOrigin}
              tRimSpeed={tRimSpeed}
              tContrast={tContrast}
              tSaturate={tSaturate}
              tBlurScale={tBlurScale}
              tBeamActive={tBeamActive}
              tBeamSize={tBeamSize}
              tBeamColor={tBeamColor}
              tBeamStrength={tBeamStrength}
              tBeamDuration={tBeamDuration}
              tNoise={tNoise}
              tNoiseOpacity={tNoiseOpacity}
              tNoiseScale={tNoiseScale}
              tAnimate={tAnimate}
              tAnimMode={tAnimMode}
              tAnimDir={tAnimDir}
              tAnimSpeed={tAnimSpeed}
              tAnimScale={tAnimScale}
            />
          </TabsContent>

          <TabsContent value="scene" className="space-y-3 text-xs text-foreground">
            <SliderControl
              label="Tile Size"
              unit="px"
              value={globals.size}
              min={140}
              max={380}
              step={10}
              defaultValue={280}
              onChange={(size) => patchGlobals({ size })}
            />
            <SliderControl
              label="Squircle Radius"
              unit="%"
              value={globals.radius}
              min={0}
              max={50}
              step={2}
              defaultValue={DEFAULT_GLOBALS.radius}
              onChange={(radius) => patchGlobals({ radius })}
              ticks={[0, 15, 30, 50]}
            />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
};
