import React from "react";
import {
  BOT_AVATAR_SHAPES,
  BOT_BODY_COLORS,
  BOT_EXPRESSIONS,
} from "../../bot-avatar";
import {
  ShowcaseSection,
  ShowcaseToggleField,
} from "../../showcase/ComponentDetailLayout";
import { ColorPickerControl, SliderControl } from "../StudioControls";
import { StudioBotConfig, DEFAULT_STUDIO_BOT_CONFIG } from "../registry";
import { cn } from "../../../utils/cn";

export interface BotAvatarInspectorProps {
  config: StudioBotConfig;
  onChange: (next: StudioBotConfig) => void;
}

export const BotAvatarInspector: React.FC<BotAvatarInspectorProps> = ({
  config,
  onChange,
}) => {
  const patch = (p: Partial<StudioBotConfig>) => onChange({ ...config, ...p });
  const activeShape =
    BOT_AVATAR_SHAPES.find((s) => s.id === config.shape) ?? BOT_AVATAR_SHAPES[0];
  const activeExpr =
    BOT_EXPRESSIONS.find((e) => e.id === config.expression) ?? BOT_EXPRESSIONS[0];

  return (
    <div className="space-y-4 text-xs">
      {/* All 7 Body Shapes */}
      <ShowcaseSection
        label={`Body Shape (${BOT_AVATAR_SHAPES.length})`}
        valueLabel={activeShape.label}
      >
        <div className="grid grid-cols-4 gap-1.5">
          {BOT_AVATAR_SHAPES.map((item) => {
            const selected = item.id === config.shape;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => patch({ shape: item.id })}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl border text-[11px] font-medium transition-all cursor-pointer",
                  selected
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <svg viewBox="0 0 100 100" className="size-5 shrink-0">
                  <path
                    d={item.path}
                    fill={selected ? config.bodyColor : "currentColor"}
                    fillOpacity={selected ? 1 : 0.35}
                  />
                </svg>
                <span className="truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </ShowcaseSection>

      {/* All 10 Expressions */}
      <ShowcaseSection
        label={`Expression (${BOT_EXPRESSIONS.length})`}
        valueLabel={activeExpr.label}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {BOT_EXPRESSIONS.map((item) => {
            const selected = item.id === config.expression;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => patch({ expression: item.id })}
                className={cn(
                  "h-8 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-center",
                  selected
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </ShowcaseSection>

      {/* Colors */}
      <div className="pt-3 border-t border-border space-y-2.5">
        <ShowcaseSection label="Body Palette">
          <div className="flex flex-wrap items-center gap-1.5">
            {BOT_BODY_COLORS.map((c) => {
              const selected =
                c.hex.toUpperCase() === config.bodyColor.toUpperCase();
              return (
                <button
                  key={c.id}
                  type="button"
                  title={c.label}
                  aria-label={c.label}
                  onClick={() => patch({ bodyColor: c.hex })}
                  className={cn(
                    "size-7 rounded-full border transition-transform cursor-pointer",
                    selected
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-105 border-white/40"
                      : "border-white/15 hover:scale-105"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </ShowcaseSection>

        <ColorPickerControl
          label="Body Color"
          value={config.bodyColor}
          onChange={(bodyColor) => patch({ bodyColor })}
        />
        <ColorPickerControl
          label="Eye Color"
          value={config.eyeColor}
          onChange={(eyeColor) => patch({ eyeColor })}
        />
      </div>

      {/* Dimensions & Behavior */}
      <div className="pt-3 border-t border-border space-y-2">
        <SliderControl
          label="Avatar Size"
          unit="px"
          value={config.size}
          min={64}
          max={320}
          step={4}
          defaultValue={DEFAULT_STUDIO_BOT_CONFIG.size}
          onChange={(size) => patch({ size })}
        />
        <ShowcaseToggleField
          label="Gaze Tracking"
          checked={config.trackGaze}
          onCheckedChange={(trackGaze) => patch({ trackGaze })}
        />
        <ShowcaseToggleField
          label="Interactive Gestures"
          checked={config.interactive}
          onCheckedChange={(interactive) => patch({ interactive })}
        />
        <ShowcaseToggleField
          label="Haptic Vibration"
          checked={config.enableVibration}
          onCheckedChange={(enableVibration) => patch({ enableVibration })}
        />
      </div>
    </div>
  );
};
