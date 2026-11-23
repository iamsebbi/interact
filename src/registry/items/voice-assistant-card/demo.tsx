"use client";

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
  const paused = signal > 0 && previewActive === false;

  return (
    <VoiceAssistantCard
      theme="light"
      paused={paused}
      replaySignal={signal}
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
