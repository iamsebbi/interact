"use client";

import { useEffect, useState } from "react";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { DownloadButtonConfig } from "./config";
import { DownloadButton } from "./download-button";

export function DownloadButtonPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [trackedSignal, setTrackedSignal] = useState(signal);
  const [innerReplay, setInnerReplay] = useState(0);

  if (signal !== trackedSignal) {
    setTrackedSignal(signal);
    setInnerReplay(0);
  }

  useEffect(() => {
    if (!isActive || trackedSignal <= 0) return;
    const t = window.setTimeout(() => {
      setInnerReplay((prev) => prev + 1);
    }, 50);
    return () => window.clearTimeout(t);
  }, [isActive, trackedSignal]);

  return (
    <DownloadButton
      key={trackedSignal}
      size="xl"
      durationMs={2200}
      checkDurationMs={650}
      paused={!isActive}
      replaySignal={innerReplay}
      className={className}
    />
  );
}

export function DownloadButtonDemo({
  config,
  playKey,
}: ComponentDemoProps<DownloadButtonConfig>) {
  return (
    <DownloadButton
      sizeMB={config.sizeMB}
      durationMs={Math.round(config.durationSec * 1000)}
      progressFormat={config.progressFormat}
      size={config.size}
      replaySignal={playKey || undefined}
    />
  );
}
