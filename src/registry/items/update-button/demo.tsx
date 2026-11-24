"use client";

import { useEffect, useState } from "react";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { UpdateButtonConfig } from "./config";
import { UpdateButton, type UpdateButtonStatus } from "./update-button";

export function UpdateButtonPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [status, setStatus] = useState<UpdateButtonStatus>("idle");

  useEffect(() => {
    if (!isActive || signal <= 0) {
      setStatus("idle");
      return;
    }
    const t = window.setTimeout(() => {
      setStatus("updating");
    }, 50);
    return () => window.clearTimeout(t);
  }, [isActive, signal]);

  return (
    <UpdateButton
      size="xl"
      theme="light"
      durationMs={2100}
      checkDurationMs={650}
      autoReset={false}
      status={status}
      onStatusChange={setStatus}
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
