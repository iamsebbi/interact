import React from "react";
import { Play, Sun, Moon, Grid, Code01, Download04 } from "../icons";
import { cn } from "../../utils/cn";
import { StudioSceneBg } from "./registry";

export interface StudioDockProps {
  sceneBg: StudioSceneBg;
  onChangeSceneBg: (bg: StudioSceneBg) => void;
  zoom: number;
  onChangeZoom: (zoom: number) => void;
  onPlay: () => void;
  onCopyJsx: () => void;
  copiedJsx: boolean;
  onOpenExport: () => void;
}

const ZOOM_LEVELS = [0.75, 1, 1.25] as const;

export const StudioDock: React.FC<StudioDockProps> = ({
  sceneBg,
  onChangeSceneBg,
  zoom,
  onChangeZoom,
  onPlay,
  onCopyJsx,
  copiedJsx,
  onOpenExport,
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-wrap items-center justify-center gap-1 p-1.5 rounded-full bg-popover/90 border border-border backdrop-blur-md shadow-xl text-xs"
    >
      {/* Play / Replay */}
      <button
        type="button"
        onClick={onPlay}
        title="Play / Replay animation"
        className="h-8 px-3 rounded-full hover:bg-secondary text-foreground flex items-center gap-1.5 font-medium transition-colors cursor-pointer active:scale-95"
      >
        <Play size={14} />
        <span>Play</span>
      </button>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Scene Background Switcher */}
      <div className="flex items-center gap-0.5 bg-secondary/70 rounded-full p-0.5 border border-border">
        <button
          type="button"
          onClick={() => onChangeSceneBg("dots")}
          title="Dot Grid Scene"
          aria-label="Dot Grid Scene"
          className={cn(
            "size-7 rounded-full flex items-center justify-center transition-colors cursor-pointer",
            sceneBg === "dots"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Grid size={13} />
        </button>
        <button
          type="button"
          onClick={() => onChangeSceneBg("dark")}
          title="Dark Solid Scene"
          aria-label="Dark Solid Scene"
          className={cn(
            "size-7 rounded-full flex items-center justify-center transition-colors cursor-pointer",
            sceneBg === "dark"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Moon size={13} />
        </button>
        <button
          type="button"
          onClick={() => onChangeSceneBg("light")}
          title="Light Scene"
          aria-label="Light Scene"
          className={cn(
            "size-7 rounded-full flex items-center justify-center transition-colors cursor-pointer",
            sceneBg === "light"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sun size={13} />
        </button>
      </div>

      <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />

      {/* Zoom Scale */}
      <div className="hidden sm:flex items-center gap-0.5 bg-secondary/70 rounded-full p-0.5 border border-border">
        {ZOOM_LEVELS.map((z) => {
          const active = Math.abs(zoom - z) < 0.01;
          return (
            <button
              key={z}
              type="button"
              onClick={() => onChangeZoom(z)}
              title={`Zoom ${Math.round(z * 100)}%`}
              className={cn(
                "h-7 px-2 rounded-full font-mono text-[11px] transition-colors cursor-pointer",
                active
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {Math.round(z * 100)}%
            </button>
          );
        })}
      </div>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Quick Copy JSX */}
      <button
        type="button"
        onClick={onCopyJsx}
        title="Copy React JSX"
        className="h-8 px-3 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium transition-colors cursor-pointer active:scale-95"
      >
        <Code01 size={14} />
        <span>{copiedJsx ? "Copied!" : "Copy JSX"}</span>
      </button>

      {/* Open Export Modal */}
      <button
        type="button"
        onClick={onOpenExport}
        title="Open Export Modal"
        className="h-8 px-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1.5 font-medium transition-all cursor-pointer active:scale-95"
      >
        <Download04 size={14} />
        <span>Export</span>
      </button>
    </div>
  );
};
