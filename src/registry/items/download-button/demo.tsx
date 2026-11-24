"use client";

import { useEffect, useState } from "react";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { DownloadButtonConfig } from "./config";
import { DownloadButton, type DownloadButtonStatus } from "./download-button";

export function DownloadButtonPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [status, setStatus] = useState<DownloadButtonStatus>("idle");

  useEffect(() => {
    if (!isActive || signal <= 0) {
      setStatus("idle");
      return;
    }
    const t = window.setTimeout(() => {
      setStatus("downloading");
    }, 50);
    return () => window.clearTimeout(t);
  }, [isActive, signal]);

  return (
    <DownloadButton
      size="xl"
      durationMs={2200}
      checkDurationMs={650}
      status={status}
      onStatusChange={setStatus}
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
