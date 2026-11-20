import React from "react";
import { GlobalsConfig } from "../../../types/gradient";
import { DEFAULT_GLOBALS } from "../../../constants/defaults";
import { SliderControl } from "../StudioControls";
import { Switch } from "../../ui/switch";
import { Refresh } from "../../icons";

export interface StudioTabGlobalsProps {
  g: GlobalsConfig;
  fittedTileSize: number;
  setGlobal: <K extends keyof GlobalsConfig>(k: K) => (v: GlobalsConfig[K]) => void;
  resetAll: () => void;
}

export const StudioTabGlobals: React.FC<StudioTabGlobalsProps> = ({
  g,
  fittedTileSize,
  setGlobal,
  resetAll,
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold tracking-tight text-white block">
          Grid Geometry
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
          Auto-Fit: {fittedTileSize}px
        </span>
      </div>
      <SliderControl
        label="Tile Size (Max)"
        unit="px"
        value={g.size}
        min={80}
        max={260}
        defaultValue={DEFAULT_GLOBALS.size}
        onChange={setGlobal("size")}
      />
      <SliderControl
        label="Corner Radius"
        unit="%"
        value={g.radius}
        min={10}
        max={50}
        defaultValue={DEFAULT_GLOBALS.radius}
        onChange={setGlobal("radius")}
        ticks={[10, 25, 40, 50]}
      />
      <SliderControl
        label="Spacing (Gap)"
        unit="px"
        value={g.gap}
        min={0}
        max={48}
        defaultValue={DEFAULT_GLOBALS.gap}
        onChange={setGlobal("gap")}
      />
      <div className="pt-2 border-t border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-white block">
              Auto Columns
            </span>
            <span className="text-[11px] text-muted-foreground block">
              Calculates the optimal layout for your screen
            </span>
          </div>
          <Switch
            checked={g.autoColumns !== false}
            onCheckedChange={(checked) => setGlobal("autoColumns")(checked)}
          />
        </div>

        {g.autoColumns === false && (
          <SliderControl
            label="Fixed Columns"
            value={g.columns}
            min={1}
            max={8}
            defaultValue={DEFAULT_GLOBALS.columns}
            onChange={setGlobal("columns")}
            ticks={[1, 2, 3, 4, 5, 6, 7, 8]}
            showTickLabels={true}
          />
        )}
      </div>

      <div className="pt-3.5 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Reset entire scene</span>
        <button
          type="button"
          onClick={resetAll}
          className="px-3.5 py-1.5 rounded-full bg-secondary hover:bg-accent border border-border text-muted-foreground hover:text-foreground text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Refresh size={14} />
          <span>Reset All</span>
        </button>
      </div>
    </>
  );
};
