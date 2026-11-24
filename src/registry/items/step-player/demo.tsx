"use client";

import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { StepPlayerConfig } from "./config";
import { StepPlayer } from "./step-player";

export function StepPlayerPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = (previewActive ?? signal > 0) && signal > 0;

  return (
    <div className={className}>
      <StepPlayer size="xl" pace={0.85} playing={isActive} />
    </div>
  );
}

export function StepPlayerDemo({
  config,
  playKey,
}: ComponentDemoProps<StepPlayerConfig>) {
  return (
    <StepPlayer
      key={playKey}
      size={config.size}
      steps={config.steps}
      pace={config.pace}
      wake={config.wake}
    />
  );
}
