"use client";

import { useEffect, useState } from "react";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import { ApproveReject, type ApproveRejectStatus } from "./approve-reject";
import type { ApproveRejectConfig } from "./config";

export function ApproveRejectPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [status, setStatus] = useState<ApproveRejectStatus>("idle");

  useEffect(() => {
    if (!isActive || signal <= 0) {
      setStatus("idle");
      return;
    }

    const timers = [
      window.setTimeout(() => setStatus("approved"), 50),
      window.setTimeout(() => setStatus("idle"), 1160),
      window.setTimeout(() => setStatus("rejected"), 1710),
      window.setTimeout(() => setStatus("idle"), 2810),
    ];

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [isActive, signal]);

  return (
    <ApproveReject
      size="xl"
      theme="light"
      status={status}
      className={className}
    />
  );
}

export function ApproveRejectDemo({
  config,
  playKey,
}: ComponentDemoProps<ApproveRejectConfig>) {
  return (
    <ApproveReject
      approveLabel={config.approveLabel || "Approve"}
      approvedLabel={config.approvedLabel || "Approved"}
      rejectLabel={config.rejectLabel || "Reject"}
      rejectedLabel={config.rejectedLabel || "Rejected"}
      autoReset={config.autoReset}
      resetDelayMs={Math.round(config.resetDelaySec * 1000)}
      showTray={config.showTray}
      size={config.size}
      theme={config.theme}
      replaySignal={playKey || undefined}
    />
  );
}
