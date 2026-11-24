"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import {
  DEFAULT_SELECT_MENU_CONFIG,
  parseSelectMenuOptions,
  type SelectMenuConfig,
} from "./config";
import { SelectMenu } from "./select-menu";

const PREVIEW_OPTIONS = parseSelectMenuOptions(
  DEFAULT_SELECT_MENU_CONFIG.options,
);
const PREVIEW_IDLE_VALUE = PREVIEW_OPTIONS[1] ?? PREVIEW_OPTIONS[0];

export function SelectMenuPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [selected, setSelected] = useState<string>(PREVIEW_IDLE_VALUE);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isActive || signal <= 0) {
      setOpen(false);
      setSelected(PREVIEW_IDLE_VALUE);
      return;
    }

    const timers = [
      window.setTimeout(() => setOpen(true), 120),
      window.setTimeout(() => setSelected("Price: low to high"), 1050),
      window.setTimeout(() => setOpen(false), 1220),
      window.setTimeout(() => setOpen(true), 2250),
      window.setTimeout(() => setSelected("Newest"), 3150),
      window.setTimeout(() => setOpen(false), 3320),
    ];

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [isActive, signal]);

  return (
    <div
      className={cn(
        "flex h-[260px] w-full items-start justify-center pt-[64px]",
        className,
      )}
    >
      <SelectMenu
        label={DEFAULT_SELECT_MENU_CONFIG.label}
        items={PREVIEW_OPTIONS}
        value={selected}
        open={open}
        onValueChange={(next) => setSelected(next)}
        onOpenChange={setOpen}
        size="md"
        theme="light"
      />
    </div>
  );
}

export function SelectMenuDemo({
  config,
  playKey,
}: ComponentDemoProps<SelectMenuConfig>) {
  const options = useMemo(
    () => parseSelectMenuOptions(config.options),
    [config.options],
  );
  const [selected, setSelected] = useState<string>(options[0]);
  const [open, setOpen] = useState(false);
  const prevPlayKeyRef = useRef(playKey ?? 0);

  const activeValue = options.includes(selected) ? selected : options[0];

  useEffect(() => {
    const nextPlayKey = playKey ?? 0;
    if (nextPlayKey === prevPlayKeyRef.current) return;
    prevPlayKeyRef.current = nextPlayKey;

    const currentIdx = options.indexOf(activeValue);
    const nextValue = options[(currentIdx + 1) % options.length] ?? options[0];

    setOpen(true);
    const t1 = window.setTimeout(() => {
      setSelected(nextValue);
    }, 680);
    const t2 = window.setTimeout(() => {
      setOpen(false);
    }, 860);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [activeValue, options, playKey]);

  return (
    <div className="flex min-h-[320px] w-full items-center justify-center">
      <SelectMenu
        label={config.label}
        items={options}
        value={activeValue}
        open={open}
        onValueChange={(next) => setSelected(next)}
        onOpenChange={setOpen}
        size={config.size}
        theme={config.theme}
        bounce={config.bounce}
        speed={config.speed}
        blur={config.blur}
        showTray={config.showTray}
      />
    </div>
  );
}
