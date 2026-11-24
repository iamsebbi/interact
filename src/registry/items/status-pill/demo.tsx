"use client";

import { cn } from "@/lib/utils";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { StatusPillConfig } from "./config";
import { StatusPill } from "./status-pill";

export function StatusPillPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <StatusPill
        size="md"
        theme="light"
        demoMode="succeed"
        demoFiles={3}
        active={isActive}
        replaySignal={isActive ? signal : 0}
      />
    </div>
  );
}

export function StatusPillDemo({
  config,
  playKey,
}: ComponentDemoProps<StatusPillConfig>) {
  return (
    <div className="flex items-center justify-center">
      <StatusPill
        idleLabel={config.idleLabel}
        doneLabel={config.doneLabel}
        failLabel={config.failLabel}
        retryLabel={config.retryLabel}
        demoFiles={config.demoFiles}
        demoMode={config.demoMode}
        size={config.size}
        theme={config.theme}
        showTray={config.showTray}
        replaySignal={playKey || undefined}
      />
    </div>
  );
}
