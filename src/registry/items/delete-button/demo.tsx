"use client";

import { useEffect, useState } from "react";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { DeleteButtonConfig } from "./config";
import { DeleteButton, type DeleteButtonStatus } from "./delete-button";

export function DeleteButtonPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [status, setStatus] = useState<DeleteButtonStatus>("idle");

  useEffect(() => {
    if (!isActive || signal <= 0) {
      setStatus("idle");
      return;
    }

    const timers = [
      window.setTimeout(() => setStatus("confirming"), 50),
      window.setTimeout(() => setStatus("idle"), 960),
      window.setTimeout(() => setStatus("confirming"), 1460),
      window.setTimeout(() => setStatus("deleted"), 2260),
    ];

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [isActive, signal]);

  return (
    <DeleteButton
      size="xl"
      theme="light"
      status={status}
      className={className}
    />
  );
}

export function DeleteButtonDemo({
  config,
  playKey,
}: ComponentDemoProps<DeleteButtonConfig>) {
  return (
    <DeleteButton
      confirmLabel={config.confirmLabel || "Confirm"}
      cancelLabel={config.cancelLabel || "Cancel"}
      deletedLabel={config.deletedLabel || "Deleted"}
      deletedDurationMs={Math.round(config.deletedDurationSec * 1000)}
      size={config.size}
      theme={config.theme}
      replaySignal={playKey || undefined}
    />
  );
}
