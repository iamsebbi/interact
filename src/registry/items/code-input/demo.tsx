"use client";

import { cn } from "@/lib/utils";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import { CodeInput } from "./code-input";
import type { CodeInputConfig } from "./config";

export function CodeInputPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <CodeInput
        size="md"
        theme="light"
        length={6}
        testCode="123456"
        active={isActive}
        replaySignal={isActive ? signal : 0}
      />
    </div>
  );
}

export function CodeInputDemo({
  config,
  playKey,
}: ComponentDemoProps<CodeInputConfig>) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <CodeInput
        length={config.length}
        label={config.label}
        busyLabel={config.busyLabel}
        doneLabel={config.doneLabel}
        testCode={config.testCode}
        size={config.size}
        theme={config.theme}
        bounce={config.bounce}
        speed={config.speed}
        showTray={config.showTray}
        replaySignal={playKey || undefined}
      />
      <p className="text-xs text-muted-foreground">
        Type{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
          {config.testCode.slice(0, config.length) || "123456"}
        </code>{" "}
        to verify, or any other digits to see error shake.
      </p>
    </div>
  );
}
