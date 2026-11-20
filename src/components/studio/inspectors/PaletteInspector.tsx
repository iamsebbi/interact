import React, { useState } from "react";
import {
  DEFAULT_PALETTE_CONFIG,
  type PaletteConfig,
} from "../../showcase/demos/PaletteDemo";
import { SliderControl } from "../StudioControls";
import { Button } from "../../ui/button";
import { Refresh, Check } from "../../icons";

export interface PaletteInspectorProps {
  config: PaletteConfig;
  onChange: (next: PaletteConfig) => void;
  activeColors: string[];
  onRoll: () => void;
}

export const PaletteInspector: React.FC<PaletteInspectorProps> = ({
  config,
  onChange,
  activeColors,
  onRoll,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const patch = (p: Partial<PaletteConfig>) => onChange({ ...config, ...p });

  const handleCopy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1400);
    } catch {}
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-2">
        <SliderControl
          label="Color Count"
          value={config.count}
          min={3}
          max={5}
          step={1}
          defaultValue={DEFAULT_PALETTE_CONFIG.count}
          onChange={(count) => patch({ count })}
        />
        <SliderControl
          label="Corner Radius"
          unit="px"
          value={config.corner}
          min={0}
          max={20}
          step={1}
          defaultValue={DEFAULT_PALETTE_CONFIG.corner}
          onChange={(corner) => patch({ corner })}
        />
        <SliderControl
          label="Morph Speed"
          unit="%"
          value={config.morph}
          min={0}
          max={100}
          step={5}
          defaultValue={DEFAULT_PALETTE_CONFIG.morph}
          onChange={(morph) => patch({ morph })}
        />
      </div>

      <div className="pt-3 border-t border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Generated OKLCH Ramp
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onRoll}
            iconLeft={<Refresh size={13} />}
          >
            Roll
          </Button>
        </div>

        <div className="space-y-1.5">
          {activeColors.slice(0, config.count).map((hex, i) => (
            <button
              key={`${hex}-${i}`}
              type="button"
              onClick={() => handleCopy(hex)}
              className="w-full h-9 px-3 rounded-xl bg-secondary/70 hover:bg-secondary border border-border flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="size-4 rounded-md border border-white/15 shrink-0"
                  style={{ backgroundColor: hex }}
                />
                <span className="font-mono text-xs text-foreground uppercase">
                  {hex}
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                {copiedHex === hex ? (
                  <>
                    <Check size={12} className="text-emerald-500" />
                    Copied
                  </>
                ) : (
                  `#${i + 1}`
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
