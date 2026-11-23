"use client";

import { useEffect, useRef, useState } from "react";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import type { SearchButtonConfig } from "./config";
import { SearchButton } from "./search-button";

const PREVIEW_QUERY = "Liquid wave";

export function SearchButtonPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [trackedSignal, setTrackedSignal] = useState(signal);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  if (signal !== trackedSignal) {
    setTrackedSignal(signal);
    setOpen(false);
    setQuery("");
  }

  useEffect(() => {
    if (!isActive || trackedSignal <= 0) return;

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setOpen(true), 50));

    for (let i = 1; i <= PREVIEW_QUERY.length; i++) {
      timers.push(
        window.setTimeout(
          () => setQuery(PREVIEW_QUERY.slice(0, i)),
          370 + i * 75,
        ),
      );
    }

    const typedAt = 370 + PREVIEW_QUERY.length * 75;
    timers.push(window.setTimeout(() => setQuery(""), typedAt + 800));
    timers.push(window.setTimeout(() => setOpen(false), typedAt + 1050));

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [isActive, trackedSignal]);

  return (
    <SearchButton
      key={trackedSignal}
      size="xl"
      theme="light"
      expandedWidth={260}
      open={open}
      value={query}
      autoFocusOnOpen={false}
      closeOnOutsideClick={false}
      className={className}
    />
  );
}

export function SearchButtonDemo({
  config,
  playKey,
}: ComponentDemoProps<SearchButtonConfig>) {
  const [open, setOpen] = useState(false);
  const lastConfigRef = useRef({
    expandedWidth: config.expandedWidth,
    placeholder: config.placeholder,
  });

  useEffect(() => {
    const prev = lastConfigRef.current;
    if (
      prev.expandedWidth !== config.expandedWidth ||
      prev.placeholder !== config.placeholder
    ) {
      lastConfigRef.current = {
        expandedWidth: config.expandedWidth,
        placeholder: config.placeholder,
      };
      setOpen(true);
    }
  }, [config.expandedWidth, config.placeholder]);

  return (
    <SearchButton
      open={open}
      onOpenChange={(next) => setOpen(next)}
      size={config.size}
      theme={config.theme}
      expandedWidth={config.expandedWidth}
      placeholder={config.placeholder}
      magnetic={config.magneticStrength > 0}
      magneticStrength={config.magneticStrength}
      replaySignal={playKey || undefined}
    />
  );
}
