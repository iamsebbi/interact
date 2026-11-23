"use client";

import { useEffect, useState } from "react";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { UpdateButtonConfig } from "./config";
import { UpdateButton } from "./update-button";

export function UpdateButtonPreview({
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
    <UpdateButton
      key={trackedSignal}
      size="xl"
      theme="light"
      durationMs={2100}
      checkDurationMs={650}
      autoReset={false}
      paused={!isActive}
      replaySignal={innerReplay}
      className={className}
    />
  );
}

export function UpdateButtonDemo({
  config,
  playKey,
}: ComponentDemoProps<UpdateButtonConfig>) {
  return (
    <UpdateButton
      label={config.label || "Update"}
      updatingLabel={config.updatingLabel || "Updating"}
      completedLabel={config.completedLabel || "Updated"}
      showPercentage={config.showPercentage}
      durationMs={Math.round(config.durationSec * 1000)}
      autoReset={config.autoReset}
      size={config.size}
      theme={config.theme}
      replaySignal={playKey || undefined}
    />
  );
}
