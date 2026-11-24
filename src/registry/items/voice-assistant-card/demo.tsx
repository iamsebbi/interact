"use client";

import { useEffect, useState } from "react";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { VoiceAssistantCardConfig } from "./config";
import { VoiceAssistantCard } from "./voice-assistant-card";

export function VoiceAssistantCardPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive === true;
  const [paused, setPaused] = useState(!isActive);

  useEffect(() => {
    if (isActive) {
      setPaused(false);
      return;
    }
    const t = window.setTimeout(() => setPaused(true), 600);
    return () => window.clearTimeout(t);
  }, [isActive]);

  return (
    <VoiceAssistantCard
      theme="light"
      paused={paused}
      replaySignal={isActive ? signal : 0}
      className={className}
    />
  );
}

export function VoiceAssistantCardDemo({
  config,
  playKey,
}: ComponentDemoProps<VoiceAssistantCardConfig>) {
  return (
    <VoiceAssistantCard
      assistantName={config.assistantName || "Kai"}
      assistantRole={config.assistantRole || "Personal assistant"}
      initials={config.initials || "KA"}
      greeting={config.greeting || "What's on your mind today?"}
      transcript={
        config.transcript ||
        "Block out two hours tomorrow morning for deep work and mute notifications"
      }
      wordIntervalMs={config.wordIntervalMs}
      strength={config.strength}
      colorVariant={config.colorVariant}
      look={config.look}
      theme={config.theme}
      replaySignal={playKey || undefined}
    />
  );
}
