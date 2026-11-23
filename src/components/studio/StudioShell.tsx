"use client";

import { toast } from "@ui-sdk/react/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/controls";
import { RefreshCw, Undo2 } from "@/components/icons";
import { CodeExportDialog } from "@/components/studio/CodeExportDialog";
import { StageCanvas } from "@/components/studio/StageCanvas";
import { StudioDock } from "@/components/studio/StudioDock";
import { cn } from "@/lib/utils";
import {
  CATALOG_META,
  type ComponentMeta,
  getRegistryCliCommand,
  type StudioSceneBg,
} from "@/registry";
import { getComponentClient } from "@/registry/client";

export function StudioShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedSlug = searchParams.get("component");

  const activeEntry: ComponentMeta<Record<string, unknown>> | undefined =
    useMemo(() => {
      if (CATALOG_META.length === 0) return undefined;
      return (
        CATALOG_META.find((item) => item.slug === requestedSlug) ??
        CATALOG_META[0]
      );
    }, [requestedSlug]);

  const activeClient = activeEntry
    ? getComponentClient(activeEntry.slug)
    : undefined;

  const [configs, setConfigs] = useState<
    Record<string, Record<string, unknown>>
  >(() =>
    Object.fromEntries(
      CATALOG_META.map((item) => [item.slug, item.defaultConfig]),
    ),
  );
  const [sceneBg, setSceneBg] = useState<StudioSceneBg>("dots");
  const [zoom, setZoom] = useState<number>(1);
  const [playKey, setPlayKey] = useState(0);
  const [copiedJsx, setCopiedJsx] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const activeConfig = activeEntry
    ? (configs[activeEntry.slug] ?? activeEntry.defaultConfig)
    : undefined;

  const updateActiveConfig = (next: Record<string, unknown>) => {
    if (!activeEntry) return;
    setConfigs((prev) => ({ ...prev, [activeEntry.slug]: next }));
  };

  const handleSelectComponent = (slug: string) => {
    router.replace(`/studio?component=${slug}`, { scroll: false });
  };

  const handleReset = () => {
    if (activeEntry) {
      updateActiveConfig(activeEntry.defaultConfig);
    }
    toast("Reset to defaults");
  };

  const jsxCode =
    activeClient && activeConfig ? activeClient.buildJsx(activeConfig) : "";

  const promptCode =
    activeClient && activeConfig
      ? activeClient.buildAiPrompt(activeConfig)
      : "";

  const installCode = activeEntry
    ? getRegistryCliCommand(activeEntry.slug)
    : "";

  const jsonCode = JSON.stringify(activeConfig ?? {}, null, 2);

  const handleCopyJsx = async () => {
    try {
      await navigator.clipboard.writeText(jsxCode);
      setCopiedJsx(true);
      toast("JSX copied to clipboard");
      window.setTimeout(() => setCopiedJsx(false), 1800);
    } catch {
      toast("Could not copy JSX");
    }
  };

  const ActiveDemo = activeClient?.Demo;
  const ActiveInspector = activeClient?.Inspector;

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row">
      <aside
        aria-label="Studio components"
        className="surface-panel flex shrink-0 flex-col gap-2 p-3 lg:w-56"
      >
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[11px] font-medium text-subtle-foreground">
            Components
          </span>
          <span className="font-mono text-[11px] text-subtle-foreground">
            {CATALOG_META.length}
          </span>
        </div>

        <nav
          aria-label="Component list"
          className="scrollbar-thin flex gap-1 overflow-x-auto lg:flex-col lg:overflow-y-auto"
        >
          {CATALOG_META.map((item) => {
            const selected = item.slug === activeEntry?.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => handleSelectComponent(item.slug)}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "flex h-9 shrink-0 cursor-pointer items-center rounded-md px-3 text-left text-[13px] font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-150 ease-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  selected
                    ? "bg-control-active text-control-active-foreground shadow-control"
                    : "text-muted-foreground hover:bg-control hover:text-foreground",
                )}
              >
                {item.title}
              </button>
            );
          })}
        </nav>
      </aside>

      <StageCanvas
        sceneBg={sceneBg}
        zoom={zoom}
        dock={
          <StudioDock
            sceneBg={sceneBg}
            onChangeSceneBg={setSceneBg}
            zoom={zoom}
            onChangeZoom={setZoom}
            onPlay={() => setPlayKey((k) => k + 1)}
            onCopyJsx={handleCopyJsx}
            copiedJsx={copiedJsx}
            onOpenExport={() => setExportOpen(true)}
          />
        }
      >
        {ActiveDemo && activeConfig && (
          <ActiveDemo
            config={activeConfig}
            onConfigChange={updateActiveConfig}
            playKey={playKey}
          />
        )}
      </StageCanvas>

      <aside
        aria-label="Inspector controls"
        className="surface-panel flex shrink-0 flex-col gap-4 overflow-y-auto p-4 lg:w-72"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium text-foreground-strong">
            {activeEntry ? activeEntry.title : "Inspector"}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPlayKey((k) => k + 1)}
              aria-label="Replay stage"
              className="size-8"
            >
              <RefreshCw size={14} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              aria-label="Reset inspector"
              className="size-8"
            >
              <Undo2 size={14} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {ActiveInspector && activeConfig && (
          <ActiveInspector
            config={activeConfig}
            onChange={updateActiveConfig}
          />
        )}
      </aside>

      <CodeExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title={activeEntry?.title ?? "Component"}
        jsxCode={jsxCode}
        promptCode={promptCode}
        installCode={installCode}
        jsonCode={jsonCode}
      />
    </div>
  );
}
