import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, Code2, Sparkles, Terminal, FileJson } from "../icons";
import { Button } from "../ui/button";
import { CodeBlock, type CodeLanguage } from "../ui/code-block";
import { cn } from "../../utils/cn";
import {
  STUDIO_COMPONENTS,
  StudioComponentId,
  StudioConfigMap,
  buildStudioAiPrompt,
  buildStudioJsx,
  getRegistryCliCommand,
} from "./registry";

interface StudioCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentId: StudioComponentId;
  config: StudioConfigMap[StudioComponentId];
}

type ModalTab = "jsx" | "prompt" | "deps" | "json";

export const StudioCodeModal: React.FC<StudioCodeModalProps> = ({
  isOpen,
  onClose,
  componentId,
  config,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>("jsx");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const meta = STUDIO_COMPONENTS.find((c) => c.id === componentId)!;
  const jsxCode = buildStudioJsx(componentId, config as never);
  const promptCode = buildStudioAiPrompt(componentId, config as never);
  const npmDeps = meta.dependencies.filter((d) => d !== "react");
  const cliCommand = getRegistryCliCommand(componentId);
  const depsSnippet = [
    `# 1. Install automatically via shadcn CLI`,
    cliCommand,
    ``,
    npmDeps.length > 0
      ? `# 2. Or install npm packages manually\nnpm install ${npmDeps.join(" ")}`
      : `# 2. No extra npm packages required beyond React`,
    ``,
    `# Component files`,
    ...meta.sourceFiles.map((f) => `- ${f}`),
  ].join("\n");
  const jsonSnippet = JSON.stringify(config, null, 2);

  const currentContent =
    activeTab === "jsx"
      ? jsxCode
      : activeTab === "prompt"
      ? promptCode
      : activeTab === "deps"
      ? depsSnippet
      : jsonSnippet;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const tabs: { id: ModalTab; label: string; icon: React.ReactNode }[] = [
    { id: "jsx", label: "React JSX", icon: <Code2 size={14} /> },
    { id: "prompt", label: "AI Prompt", icon: <Sparkles size={14} /> },
    { id: "deps", label: "Install & Files", icon: <Terminal size={14} /> },
    { id: "json", label: "JSON", icon: <FileJson size={14} /> },
  ];

  const currentLang: CodeLanguage =
    activeTab === "jsx"
      ? "tsx"
      : activeTab === "prompt"
      ? "markdown"
      : activeTab === "deps"
      ? "bash"
      : "json";

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-foreground"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className="text-base font-semibold tracking-tight truncate">
                Export {meta.title}
              </h2>
              <span
                className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase",
                  meta.tier === "pro"
                    ? "bg-primary/15 text-primary border-primary/25 font-semibold"
                    : "bg-secondary text-muted-foreground border-border"
                )}
              >
                {meta.tier}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close export modal"
              className="size-8 rounded-full bg-secondary hover:bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Tab Strip */}
          <div className="px-5 pt-3 pb-2 border-b border-border flex flex-wrap items-center gap-1.5">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const currentLang: CodeLanguage =
    activeTab === "jsx"
      ? "tsx"
      : activeTab === "prompt"
      ? "markdown"
      : activeTab === "deps"
      ? "bash"
      : "json";

  return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCopied(false);
                  }}
                  className={cn(
                    "h-8 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer",
                    active
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Code Body */}
          <div className="flex-1 min-h-0 overflow-auto p-5">
            <div className="w-full rounded-2xl bg-secondary/60 border border-border p-4 overflow-x-auto">
              <CodeBlock code={currentContent} lang={currentLang} wrap />
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-border flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground truncate">
              {meta.dependencies.join(" · ")}
            </span>
            <Button
              variant="primary"
              size="md"
              onClick={handleCopy}
              iconLeft={copied ? <Check size={14} /> : <Copy size={14} />}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
