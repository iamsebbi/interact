import React from "react";
import {
  TileConfig,
  GlobalPresetKey,
  RimOrigin,
  RimAnimationMode,
  BeamSize,
  BeamColorVariant,
  AnimationMode,
  Direction,
} from "../../../types/gradient";
import {
  DEFAULT_GLOBALS,
  GLOBAL_PRESETS,
  RIM_ANIMATION_MODES,
  BEAM_PRESETS,
  BEAM_COLORS,
  ENTRANCE_EFFECTS,
} from "../../../constants/defaults";
import { ColorPickerControl, SliderControl, DirectionPicker } from "../StudioControls";
import { Switch } from "../../ui/switch";
import { cn } from "../../../utils/cn";
import { Sparkles } from "../../icons";

export interface StudioTabMotionProps {
  isEmpty: boolean;
  activeTi: number;
  tile: TileConfig;
  patchTile: (patch: Partial<TileConfig>) => void;
  applyTilePreset: (preset: GlobalPresetKey) => void;
  bumpTileAnimation: (idx?: number) => void;
  debouncedBumpAnim: (idx?: number) => void;
  tRimOpacity: number;
  tRimBlur: number;
  tRimSpread: number;
  tRimAnimate: boolean;
  tRimMode: RimAnimationMode;
  tRimOrigin: RimOrigin;
  tRimSpeed: number;
  tContrast: number;
  tSaturate: number;
  tBlurScale: number;
  tBeamActive: boolean;
  tBeamSize: BeamSize;
  tBeamColor: BeamColorVariant;
  tBeamStrength: number;
  tBeamDuration: number;
  tNoise: boolean;
  tNoiseOpacity: number;
  tNoiseScale: number;
  tAnimate: boolean;
  tAnimMode: AnimationMode;
  tAnimDir: Direction;
  tAnimSpeed: number;
  tAnimScale: number;
}

export const StudioTabMotion: React.FC<StudioTabMotionProps> = ({
  isEmpty,
  activeTi,
  tile,
  patchTile,
  applyTilePreset,
  bumpTileAnimation,
  debouncedBumpAnim,
  tRimOpacity,
  tRimBlur,
  tRimSpread,
  tRimAnimate,
  tRimMode,
  tRimOrigin,
  tRimSpeed,
  tContrast,
  tSaturate,
  tBlurScale,
  tBeamActive,
  tBeamSize,
  tBeamColor,
  tBeamStrength,
  tBeamDuration,
  tNoise,
  tNoiseOpacity,
  tNoiseScale,
  tAnimate,
  tAnimMode,
  tAnimDir,
  tAnimSpeed,
  tAnimScale,
}) => {
  return (
    <>
      {/* 1. Background & Rim Light */}
      <div className="space-y-3">
        <span className="text-[13px] font-semibold tracking-tight text-white block">
          Background & Rim Light
        </span>
        <div className="space-y-1">
          <ColorPickerControl
            label="Base Background"
            value={tile.base}
            empty={isEmpty}
            onChange={(v) => patchTile({ base: v })}
          />
          <ColorPickerControl
            label="Rim Color"
            value={tile.rim}
            empty={isEmpty}
            onChange={(v) => patchTile({ rim: v })}
          />
        </div>

        <div className="space-y-1 pt-1">
          <SliderControl
            label="Rim Opacity"
            value={tRimOpacity}
            min={0}
            max={1}
            step={0.01}
            defaultValue={DEFAULT_GLOBALS.rimOpacity}
            empty={isEmpty}
            onChange={(v) => patchTile({ rimOpacity: v })}
          />
          <SliderControl
            label="Rim Blur"
            unit="px"
            value={tRimBlur}
            min={0}
            max={40}
            defaultValue={DEFAULT_GLOBALS.rimBlur}
            empty={isEmpty}
            onChange={(v) => patchTile({ rimBlur: v })}
          />
          <SliderControl
            label="Rim Spread"
            unit="px"
            value={tRimSpread}
            min={0}
            max={14}
            defaultValue={DEFAULT_GLOBALS.rimSpread}
            empty={isEmpty}
            onChange={(v) => patchTile({ rimSpread: v })}
          />
        </div>

        {/* Dynamic Rim Animation */}
        <div className="pt-2 border-t border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">
              Rim Animation
            </span>
            <Switch
              checked={!isEmpty && !!tRimAnimate}
              onCheckedChange={(checked) => {
                patchTile({
                  rimAnimate: checked,
                  ...(checked && !tile.rimAnimationMode
                    ? { rimAnimationMode: "glint", rimOrigin: "top", rimAnimationSpeed: 0.8 }
                    : {}),
                });
                bumpTileAnimation(activeTi);
              }}
              aria-label="Rim Animation"
            />
          </div>

          {tRimAnimate && (
            <div className="space-y-2 pt-0.5">
              <div className="grid grid-cols-4 rounded-full bg-secondary p-1 border border-border">
                {RIM_ANIMATION_MODES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => {
                      patchTile({ rimAnimate: true, rimAnimationMode: m.value });
                      bumpTileAnimation(activeTi);
                    }}
                    title={m.description}
                    className={cn(
                      "py-1 px-1 rounded-full text-[11px] font-medium transition-all text-center cursor-pointer truncate",
                      !isEmpty && tRimMode === m.value
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {tRimMode === "glint" && (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium px-1">
                    Glint Origin
                  </span>
                  <div className="grid grid-cols-4 rounded-full bg-secondary p-1 border border-border">
                    {(
                      [
                        { value: "top", label: "Top" },
                        { value: "right", label: "Right" },
                        { value: "bottom", label: "Bottom" },
                        { value: "left", label: "Left" },
                      ] as { value: RimOrigin; label: string }[]
                    ).map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => {
                          patchTile({ rimOrigin: o.value });
                          bumpTileAnimation(activeTi);
                        }}
                        className={cn(
                          "py-1 px-1.5 rounded-full text-[11px] font-medium transition-all text-center cursor-pointer",
                          !isEmpty && tRimOrigin === o.value
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <SliderControl
                label={tRimMode === "breathe" ? "Pulse Frequency" : "Rim Speed"}
                unit="×"
                value={tRimSpeed}
                min={0.25}
                max={3}
                step={0.05}
                defaultValue={1}
                empty={isEmpty}
                onChange={(v) => {
                  patchTile({ rimAnimationSpeed: v });
                  debouncedBumpAnim(activeTi);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. Filters & Presets */}
      <div className="pt-4 border-t border-border space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold tracking-tight text-white">
            Filters
          </span>
          {/* Capsulă segmentată compactă pentru preseturi */}
          <div className="inline-flex rounded-full bg-secondary p-0.5 border border-border">
            {(Object.keys(GLOBAL_PRESETS) as GlobalPresetKey[]).map((preset) => {
              const p = GLOBAL_PRESETS[preset];
              const isPresetActive =
                !isEmpty &&
                tContrast === p.contrast &&
                tSaturate === p.saturate &&
                tBlurScale === p.blurScale &&
                tRimOpacity === p.rimOpacity &&
                tRimBlur === p.rimBlur &&
                tRimSpread === p.rimSpread;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyTilePreset(preset)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-medium capitalize transition-all cursor-pointer",
                    isPresetActive
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1">
          <SliderControl
            label="Blur Intensity"
            unit="×"
            value={tBlurScale}
            min={0.3}
            max={2.5}
            step={0.01}
            defaultValue={DEFAULT_GLOBALS.blurScale}
            empty={isEmpty}
            onChange={(v) => patchTile({ blurScale: v })}
          />
          <SliderControl
            label="Contrast"
            unit="×"
            value={tContrast}
            min={0.8}
            max={1.6}
            step={0.01}
            defaultValue={DEFAULT_GLOBALS.contrast}
            empty={isEmpty}
            onChange={(v) => patchTile({ contrast: v })}
          />
          <SliderControl
            label="Saturation"
            unit="×"
            value={tSaturate}
            min={0.6}
            max={1.6}
            step={0.01}
            defaultValue={DEFAULT_GLOBALS.saturate}
            empty={isEmpty}
            onChange={(v) => patchTile({ saturate: v })}
          />
        </div>
      </div>

      {/* 3. Border Beam */}
      <div className="pt-4 border-t border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold tracking-tight text-white">
            Border Beam
          </span>
          <Switch
            checked={!isEmpty && !!tBeamActive}
            onCheckedChange={(checked) =>
              patchTile({
                beamActive: checked,
                ...(checked && !tile.beamSize
                  ? {
                      beamSize: "md",
                      beamColorVariant: "colorful",
                      beamStrength: 0.8,
                      beamDuration: 3,
                    }
                  : {}),
              })
            }
            aria-label="Toggle Border Beam"
          />
        </div>

        <div
          className={cn(
            "space-y-3 transition-opacity duration-200",
            !tBeamActive && "opacity-35 pointer-events-none"
          )}
        >
          {/* Beam Style */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Style
            </span>
            <div className="flex flex-wrap gap-1.5">
              {BEAM_PRESETS.map((s) => {
                const isCurrent = !isEmpty && tBeamSize === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() =>
                      patchTile({
                        beamActive: true,
                        beamSize: s.value,
                        beamDuration: s.defaultDuration,
                      })
                    }
                    className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-medium transition-all border cursor-pointer",
                      isCurrent
                        ? "bg-primary text-primary-foreground border-transparent shadow-xs"
                        : "bg-card text-muted-foreground border-border hover:border-ring hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Beam Color Palette */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Palette
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {BEAM_COLORS.map((c) => {
                const isCurrentColor = !isEmpty && tBeamColor === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() =>
                      patchTile({
                        beamActive: true,
                        beamColorVariant: c.value,
                      })
                    }
                    className={cn(
                      "py-1 px-2 rounded-full text-[11px] font-medium transition-all border flex items-center justify-center gap-1.5 cursor-pointer",
                      isCurrentColor
                        ? "bg-primary text-primary-foreground border-transparent shadow-xs"
                        : "bg-card text-muted-foreground border-border hover:border-ring hover:text-foreground"
                    )}
                  >
                    <span
                      className="size-2 rounded-full shrink-0 border border-black/30"
                      style={{ background: c.swatch }}
                    />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Beam Sliders */}
          <div className="space-y-1 pt-0.5">
            <SliderControl
              label="Strength"
              value={tBeamStrength}
              min={0.1}
              max={1}
              step={0.05}
              defaultValue={0.75}
              empty={isEmpty}
              onChange={(v) => patchTile({ beamStrength: v })}
            />
            <SliderControl
              label="Duration"
              unit="s"
              value={tBeamDuration}
              min={0.8}
              max={6}
              step={0.1}
              defaultValue={3.5}
              empty={isEmpty}
              onChange={(v) => patchTile({ beamDuration: v })}
            />
          </div>
        </div>
      </div>

      {/* 4. Film Grain (Noise Overlay) */}
      <div className="pt-4 border-t border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold tracking-tight text-white flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-400" />
            Film Grain (Noise Overlay)
          </span>
          <Switch
            checked={!isEmpty && !!tNoise}
            onCheckedChange={(checked) => {
              patchTile({
                noise: checked,
                ...(checked && tile.noiseOpacity === undefined
                  ? { noiseOpacity: 0.12, noiseScale: 1.0 }
                  : {}),
              });
            }}
            aria-label="Toggle Film Grain"
          />
        </div>

        <div
          className={cn(
            "space-y-3 transition-opacity duration-200",
            !tNoise && "opacity-35 pointer-events-none"
          )}
        >
          <SliderControl
            label="Grain Opacity"
            unit="%"
            value={Math.round(tNoiseOpacity * 100)}
            min={5}
            max={60}
            step={1}
            defaultValue={12}
            empty={isEmpty}
            onChange={(v) => patchTile({ noiseOpacity: v / 100 })}
          />

          <SliderControl
            label="Grain Scale"
            unit="×"
            value={tNoiseScale}
            min={0.5}
            max={2.5}
            step={0.1}
            defaultValue={1}
            empty={isEmpty}
            onChange={(v) => patchTile({ noiseScale: v })}
          />
        </div>
      </div>

      {/* 5. Entrance Animation */}
      <div className="pt-4 border-t border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold tracking-tight text-white">
            Entrance Animation
          </span>
          <Switch
            checked={!isEmpty && !!tAnimate}
            onCheckedChange={(checked) => {
              patchTile({
                animate: checked,
                animationMode: tAnimMode,
              });
              if (checked && activeTi !== null) bumpTileAnimation(activeTi);
            }}
            aria-label="Entrance Animation"
          />
        </div>

        <div
          className={cn(
            "space-y-2 transition-opacity duration-200",
            !tAnimate && "opacity-35 pointer-events-none"
          )}
        >
          <div className="grid grid-cols-4 rounded-full bg-secondary p-1 border border-border">
            {ENTRANCE_EFFECTS.map((eff) => (
              <button
                key={eff.value}
                type="button"
                onClick={() => {
                  patchTile({
                    animate: true,
                    animationMode: eff.value,
                  });
                  bumpTileAnimation(activeTi);
                }}
                className={cn(
                  "py-1 px-1.5 rounded-full text-[11px] font-medium transition-all text-center cursor-pointer",
                  !isEmpty && tAnimMode === eff.value
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {eff.label}
              </button>
            ))}
          </div>

          {(tAnimMode === "lift" || tAnimMode === "scale") && (
            <DirectionPicker
              value={tAnimDir}
              onChange={(d) => {
                patchTile({
                  animate: true,
                  animationDirection: d,
                });
                bumpTileAnimation(activeTi);
              }}
            />
          )}

          <SliderControl
            label="Speed"
            unit="×"
            value={tAnimSpeed}
            min={0.25}
            max={3}
            step={0.05}
            defaultValue={1}
            empty={isEmpty}
            onChange={(v) => {
              patchTile({ animationSpeed: v });
              debouncedBumpAnim(activeTi);
            }}
          />
          <SliderControl
            label="Amplitude"
            value={tAnimScale}
            min={0}
            max={0.25}
            step={0.01}
            defaultValue={0.12}
            empty={isEmpty}
            onChange={(v) => {
              patchTile({ animationScale: v });
              debouncedBumpAnim(activeTi);
            }}
          />
        </div>
      </div>
    </>
  );
};
