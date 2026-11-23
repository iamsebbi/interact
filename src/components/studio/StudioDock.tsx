"use client";

import {
  Button,
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/controls";
import {
  Check,
  Code,
  Download,
  LayoutGrid,
  Moon,
  Play,
  Sun,
} from "@/components/icons";
import type { StudioSceneBg } from "@/registry";

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

const ZOOM_LEVELS = ["0.75", "1", "1.25"] as const;

export function StudioDock({
  sceneBg,
  onChangeSceneBg,
  zoom,
  onChangeZoom,
  onPlay,
  onCopyJsx,
  copiedJsx,
  onOpenExport,
}: StudioDockProps) {
  return (
    <div className="surface-popover flex flex-wrap items-center justify-center gap-1.5 rounded-pill p-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPlay}
        aria-label="Replay preview"
      >
        <Play size={13} aria-hidden="true" />
        <span>Play</span>
      </Button>

      <div aria-hidden="true" className="mx-0.5 h-4 w-px bg-menu-divider" />

      <SegmentedControl
        aria-label="Canvas background"
        value={sceneBg}
        onValueChange={(next) => {
          if (next) onChangeSceneBg(next as StudioSceneBg);
        }}
        className="h-8"
      >
        <SegmentedControlItem
          value="dots"
          aria-label="Dot grid background"
          className="h-[26px] px-2"
        >
          <LayoutGrid size={13} aria-hidden="true" />
          <span className="sr-only">Dots</span>
        </SegmentedControlItem>
        <SegmentedControlItem
          value="dark"
          aria-label="Dark background"
          className="h-[26px] px-2"
        >
          <Moon size={13} aria-hidden="true" />
          <span className="sr-only">Dark</span>
        </SegmentedControlItem>
        <SegmentedControlItem
          value="light"
          aria-label="Light background"
          className="h-[26px] px-2"
        >
          <Sun size={13} aria-hidden="true" />
          <span className="sr-only">Light</span>
        </SegmentedControlItem>
      </SegmentedControl>

      <div
        aria-hidden="true"
        className="mx-0.5 hidden h-4 w-px bg-menu-divider sm:block"
      />

      <SegmentedControl
        aria-label="Canvas zoom"
        value={String(zoom)}
        onValueChange={(next) => {
          if (next) onChangeZoom(Number(next));
        }}
        className="hidden h-8 sm:inline-flex"
      >
        {ZOOM_LEVELS.map((level) => (
          <SegmentedControlItem
            key={level}
            value={level}
            className="h-[26px] px-2 font-mono text-[11px]"
          >
            {Math.round(Number(level) * 100)}%
          </SegmentedControlItem>
        ))}
      </SegmentedControl>

      <div aria-hidden="true" className="mx-0.5 h-4 w-px bg-menu-divider" />

      <Button variant="ghost" size="sm" onClick={onCopyJsx}>
        {copiedJsx ? (
          <Check size={13} aria-hidden="true" />
        ) : (
          <Code size={13} aria-hidden="true" />
        )}
        <span>{copiedJsx ? "Copied" : "Copy JSX"}</span>
      </Button>

      <Button variant="primary" size="sm" onClick={onOpenExport}>
        <Download size={13} aria-hidden="true" />
        <span>Export</span>
      </Button>
    </div>
  );
}
