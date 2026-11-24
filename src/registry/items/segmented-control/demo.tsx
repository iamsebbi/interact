"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import {
  parseSegmentedControlOptions,
  type SegmentedControlConfig,
} from "./config";
import { SegmentedControl } from "./segmented-control";

const PREVIEW_OPTIONS = ["Day", "Week", "Month", "Year"] as const;
const PREVIEW_IDLE_VALUE = "Week";

export function SegmentedControlPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [selected, setSelected] = useState<string>(PREVIEW_IDLE_VALUE);

  useEffect(() => {
    if (!isActive || signal <= 0) {
      setSelected(PREVIEW_IDLE_VALUE);
      return;
    }

    const timers = [
      window.setTimeout(() => setSelected("Year"), 120),
      window.setTimeout(() => setSelected("Day"), 1020),
      window.setTimeout(() => setSelected("Month"), 1920),
      window.setTimeout(() => setSelected(PREVIEW_IDLE_VALUE), 2820),
    ];

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [isActive, signal]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <SegmentedControl
        items={PREVIEW_OPTIONS}
        value={selected}
        onValueChange={(next) => {
          if (next) setSelected(next);
        }}
        size="xl"
        theme="light"
        aria-label="Preview time range"
      />
    </div>
  );
}

export function SegmentedControlDemo({
  config,
  playKey,
}: ComponentDemoProps<SegmentedControlConfig>) {
  const options = useMemo(
    () => parseSegmentedControlOptions(config.options),
    [config.options],
  );
  const [selected, setSelected] = useState<string>(options[1] ?? options[0]);
  const prevPlayKeyRef = useRef(playKey ?? 0);

  const activeValue = options.includes(selected)
    ? selected
    : (options[1] ?? options[0]);

  useEffect(() => {
    const nextPlayKey = playKey ?? 0;
    if (nextPlayKey === prevPlayKeyRef.current) return;
    prevPlayKeyRef.current = nextPlayKey;
    setSelected((prev) => {
      const idx = options.indexOf(prev);
      return options[(idx + 1) % options.length] ?? options[0];
    });
  }, [options, playKey]);

  return (
    <div className="flex items-center justify-center">
      <SegmentedControl
        items={options}
        value={activeValue}
        onValueChange={(next) => {
          if (next) setSelected(next);
        }}
        size={config.size}
        theme={config.theme}
        stretch={config.stretch}
        bounce={config.bounce}
        speed={config.speed}
        showTray={config.showTray}
        aria-label="Time range"
      />
    </div>
  );
}
