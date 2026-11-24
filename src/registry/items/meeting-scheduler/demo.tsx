"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import {
  DEFAULT_MEETING_SCHEDULER_CONFIG,
  type MeetingSchedulerConfig,
  parseCsvList,
} from "./config";
import {
  MeetingScheduler,
  type MeetingSchedulerStep,
} from "./meeting-scheduler";

export function MeetingSchedulerPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [step, setStep] = useState<MeetingSchedulerStep>("rest");

  useEffect(() => {
    if (!isActive || signal <= 0) {
      setStep("rest");
      return;
    }

    const timers = [
      window.setTimeout(() => setStep("time"), 100),
      window.setTimeout(() => setStep("people"), 1450),
      window.setTimeout(() => setStep("done"), 2750),
      window.setTimeout(() => setStep("rest"), 4200),
    ];

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [isActive, signal]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <MeetingScheduler step={step} theme="light" />
    </div>
  );
}

export function MeetingSchedulerDemo({
  config,
  playKey,
}: ComponentDemoProps<MeetingSchedulerConfig>) {
  const [instanceKey, setInstanceKey] = useState(0);
  const prevPlayKeyRef = useRef(playKey ?? 0);

  useEffect(() => {
    const nextPlayKey = playKey ?? 0;
    if (nextPlayKey === prevPlayKeyRef.current) return;
    prevPlayKeyRef.current = nextPlayKey;
    setInstanceKey((prev) => prev + 1);
  }, [playKey]);

  const times = useMemo(
    () =>
      parseCsvList(
        config.times,
        parseCsvList(DEFAULT_MEETING_SCHEDULER_CONFIG.times, []),
      ),
    [config.times],
  );
  const durations = useMemo(
    () =>
      parseCsvList(
        config.durations,
        parseCsvList(DEFAULT_MEETING_SCHEDULER_CONFIG.durations, []),
      ),
    [config.durations],
  );
  const people = useMemo(
    () =>
      parseCsvList(
        config.people,
        parseCsvList(DEFAULT_MEETING_SCHEDULER_CONFIG.people, []),
      ),
    [config.people],
  );

  return (
    <div className="flex min-h-[340px] w-full items-center justify-center">
      <MeetingScheduler
        key={instanceKey}
        label={config.label || DEFAULT_MEETING_SCHEDULER_CONFIG.label}
        times={times}
        durations={durations}
        people={people}
        theme={config.theme}
        bounce={config.bounce}
        speed={config.speed}
      />
    </div>
  );
}
