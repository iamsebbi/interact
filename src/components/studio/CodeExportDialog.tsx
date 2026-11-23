"use client";

import { toast } from "@ui-sdk/react/toast";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@/components/controls";
import { Check, Code, Copy, Sparkles, Terminal } from "@/components/icons";

export interface CodeExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  jsxCode: string;
  promptCode: string;
  installCode: string;
  jsonCode: string;
}

export function CodeExportDialog({
  open,
  onOpenChange,
  title,
  jsxCode,
  promptCode,
  installCode,
  jsonCode,
}: CodeExportDialogProps) {
  const [tab, setTab] = useState("jsx");
  const [copied, setCopied] = useState(false);

  const currentContent =
    tab === "jsx"
      ? jsxCode
      : tab === "prompt"
        ? promptCode
        : tab === "install"
          ? installCode
          : jsonCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      toast("Export snippet copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast("Could not copy snippet");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogBackdrop />
      <DialogContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 pr-10">
          <DialogTitle>Export {title}</DialogTitle>
          <DialogDescription>
            Copy configured React JSX, an AI coding-agent prompt, shadcn CLI
            install command, or raw JSON config.
          </DialogDescription>
        </div>

        <Tabs
          value={tab}
          onValueChange={(next) => {
            if (next) setTab(next);
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <TabsList aria-label="Export format">
              <TabsTab value="jsx">
                <Code size={13} aria-hidden="true" />
                <span>JSX</span>
              </TabsTab>
              <TabsTab value="prompt">
                <Sparkles size={13} aria-hidden="true" />
                <span>AI Prompt</span>
              </TabsTab>
              <TabsTab value="install">
                <Terminal size={13} aria-hidden="true" />
                <span>Install</span>
              </TabsTab>
              <TabsTab value="json">JSON</TabsTab>
            </TabsList>

            <Button variant="elevated" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check size={13} aria-hidden="true" />
              ) : (
                <Copy size={13} aria-hidden="true" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>

          <TabsPanel value="jsx">
            <pre className="surface-stage scrollbar-thin max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground-secondary">
              <code>{jsxCode}</code>
            </pre>
          </TabsPanel>
          <TabsPanel value="prompt">
            <pre className="surface-stage scrollbar-thin max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground-secondary">
              <code>{promptCode}</code>
            </pre>
          </TabsPanel>
          <TabsPanel value="install">
            <pre className="surface-stage scrollbar-thin max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground-secondary">
              <code>{installCode}</code>
            </pre>
          </TabsPanel>
          <TabsPanel value="json">
            <pre className="surface-stage scrollbar-thin max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground-secondary">
              <code>{jsonCode}</code>
            </pre>
          </TabsPanel>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
