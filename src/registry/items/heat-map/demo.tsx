"use client";

import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { HeatMapConfig } from "./config";
import { HeatMap } from "./heat-map";

export function HeatMapPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;

  return <HeatMap replaySignal={isActive ? signal : 0} className={className} />;
}

export function HeatMapDemo({
  config,
  playKey,
}: ComponentDemoProps<HeatMapConfig>) {
  return (
    <HeatMap
      shape={config.shape}
      colors={config.colors}
      heat={config.heat}
      soft={config.soft}
      area={config.area}
      replaySignal={playKey || undefined}
    />
  );
}
