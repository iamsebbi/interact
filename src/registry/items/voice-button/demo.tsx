"use client";

import { useEffect, useState } from "react";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { VoiceButtonConfig } from "./config";
import { setVoiceLiveStatus } from "./mic-status";
import { VoiceButton, type VoiceButtonStatus } from "./voice-button";

export function VoiceButtonPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [status, setStatus] = useState<VoiceButtonStatus>("idle");

  useEffect(() => {
    if (!isActive || signal <= 0) {
      setStatus("idle");
      return;
    }

    const timers = [
      window.setTimeout(() => setStatus("listening"), 50),
      window.setTimeout(() => setStatus("idle"), 2610),
    ];

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [isActive, signal]);

  return (
    <VoiceButton
      size="xl"
      theme="light"
      status={status}
      className={className}
    />
  );
}

export function VoiceButtonDemo({
  config,
  playKey,
}: ComponentDemoProps<VoiceButtonConfig>) {
  return (
    <VoiceButton
      mode={config.mode}
      label={config.label || "Voice"}
      listeningLabel={config.listeningLabel || "Listening"}
      showTimer={config.showTimer}
      size={config.size}
      theme={config.theme}
      colorVariant={config.colorVariant}
      look={config.look}
      strength={config.strength}
      sensitivity={config.sensitivity}
      replaySignal={playKey || undefined}
      onMicrophoneStateChange={(state, error) => {
        setVoiceLiveStatus(state, error);
      }}
    />
  );
}
