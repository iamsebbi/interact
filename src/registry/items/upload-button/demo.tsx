"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { UploadButtonConfig } from "./config";
import { UploadButton } from "./upload-button";

export function UploadButtonPreview({
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
    <UploadButton
      key={trackedSignal}
      size="xl"
      anchored={false}
      durationMs={2200}
      summaryDurationMs={750}
      autoRetryDelayMs={900}
      autoCopyDelayMs={800}
      resetAfterCopied={false}
      paused={!isActive}
      replaySignal={innerReplay}
      className={className}
    />
  );
}

export function UploadButtonDemo({
  config,
  playKey,
}: ComponentDemoProps<UploadButtonConfig>) {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <motion.div
      initial={false}
      animate={{ y: config.anchored ? 64 : 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", visualDuration: 0.28, bounce: 0.2 }
      }
    >
      <UploadButton
        durationMs={Math.round(config.durationSec * 1000)}
        simulateFailure={config.simulateFailure}
        anchored={config.anchored}
        size={config.size}
        replaySignal={playKey || undefined}
      />
    </motion.div>
  );
}
