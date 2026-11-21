import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { CodeBlock } from "../ui/code-block";
import {
  getShowcaseComponentDocs,
  type ComponentHowItWorksDoc,
  type ComponentPropDoc,
} from "../studio/registry";
import {
  fetchRegistryFiles,
  getCachedRegistryFiles,
  type RegistrySourceFile,
} from "./registrySource";
import {
  Tabs,
  TabsHighlight,
  TabsHighlightItem,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { cn } from "../../utils/cn";
import {
  Bookmark,
  Cancel01,
  Check,
  ChevronRight,
  Copy01,
  Loading01,
  Play,
  Refresh,
  Share01,
} from "../icons";

export interface ShowcaseComponentNavItem {
  id: string;
  title: string;
}

export interface ShowcaseStageHeaderProps {
  stageTab: "block" | "code";
  onStageTabChange: (tab: "block" | "code") => void;
  onCodeTabIntent?: () => void;
  hasCode?: boolean;
  title?: React.ReactNode;
  hideTitle?: boolean;
  stageHeaderRight?: React.ReactNode;
  hasCopyPrompt?: boolean;
  promptText?: string;
  copiedPrompt?: boolean;
  onCopyPrompt?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  saveLabel?: string;
}

const STAGE_TAB_TRIGGER_CLASS =
  "relative z-10 h-full px-4 rounded-full text-sm font-medium flex items-center justify-center transition-colors cursor-pointer text-muted-foreground hover:text-foreground data-[state=active]:text-primary-foreground data-[state=active]:font-semibold before:content-[''] before:absolute before:-inset-y-1.5 before:inset-x-0 md:before:hidden";

const HEADER_MORPH_EASE = [0.22, 1, 0.36, 1] as const;

export const ShowcaseStageHeader: React.FC<ShowcaseStageHeaderProps> = ({
  stageTab,
  onStageTabChange,
  onCodeTabIntent,
  hasCode = false,
  title,
  hideTitle = false,
  stageHeaderRight,
  hasCopyPrompt = false,
  promptText,
  copiedPrompt = false,
  onCopyPrompt,
  isSaved = false,
  onToggleSave,
  saveLabel = "component",
}) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const isCodeMode = stageTab === "code" && hasCopyPrompt;
  const showMorphAction = isCodeMode || (stageTab !== "code" && Boolean(onToggleSave));
  const morphContentKey = isCodeMode
    ? copiedPrompt
      ? "copied"
      : "prompt"
    : "save";

  const morphTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: HEADER_MORPH_EASE };

  return (
    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-2 shrink-0">
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        {hasCode && (
          <Tabs
            value={stageTab}
            onValueChange={(v) => onStageTabChange(v as "block" | "code")}
          >
            <TabsHighlight className="absolute inset-0 rounded-full bg-primary shadow-xs">
              <TabsList className="inline-flex h-9 items-center rounded-full bg-secondary/80 p-0.5 ring-1 ring-border">
                <TabsHighlightItem value="block" className="h-full">
                  <TabsTrigger value="block" className={STAGE_TAB_TRIGGER_CLASS}>
                    Preview
                  </TabsTrigger>
                </TabsHighlightItem>
                <TabsHighlightItem value="code" className="h-full">
                  <TabsTrigger
                    value="code"
                    onPointerEnter={onCodeTabIntent}
                    onFocus={onCodeTabIntent}
                    className={STAGE_TAB_TRIGGER_CLASS}
                  >
                    Code
                  </TabsTrigger>
                </TabsHighlightItem>
              </TabsList>
            </TabsHighlight>
          </Tabs>
        )}

        {!hideTitle && title && (
          <h2 className="text-base font-semibold tracking-tight text-foreground truncate">
            {title}
          </h2>
        )}
      </div>

      {(stageHeaderRight || showMorphAction) && (
        <div className="flex items-center justify-end gap-1.5 shrink-0 ml-auto">
          {stageHeaderRight}
          {showMorphAction && (
            <motion.button
              type="button"
              layout
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              transition={{ layout: morphTransition }}
              style={{ borderRadius: 9999 }}
              onClick={isCodeMode ? onCopyPrompt : onToggleSave}
              aria-label={
                isCodeMode
                  ? copiedPrompt
                    ? "Prompt copied"
                    : "Copy prompt"
                  : isSaved
                    ? `Unsave ${saveLabel}`
                    : `Save ${saveLabel}`
              }
              aria-pressed={isCodeMode ? undefined : isSaved}
              title={
                isCodeMode
                  ? copiedPrompt
                    ? "Copied"
                    : promptText
                      ? "Copy AI prompt"
                      : "Copy prompt"
                  : isSaved
                    ? "Saved"
                    : "Save"
              }
              className={cn(
                "relative inline-flex h-10 md:h-9 items-center justify-center text-sm font-medium transition-colors duration-200 cursor-pointer before:content-[''] before:absolute before:-inset-0.5 md:before:hidden",
                isCodeMode ? "px-3.5" : "w-10 md:w-9 px-0",
                isCodeMode
                  ? copiedPrompt
                    ? "glass-chosen text-primary"
                    : "glass-control text-foreground"
                  : isSaved
                    ? "glass-chosen text-primary"
                    : "glass-control text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="relative inline-flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  {isCodeMode ? (
                    <motion.span
                      key={morphContentKey}
                      initial={
                        shouldReduceMotion
                          ? false
                          : { opacity: 0, filter: "blur(6px)", scale: 0.92 }
                      }
                      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                      exit={
                        shouldReduceMotion
                          ? undefined
                          : { opacity: 0, filter: "blur(6px)", scale: 0.92 }
                      }
                      transition={morphTransition}
                      className="inline-flex items-center whitespace-nowrap"
                    >
                      {copiedPrompt ? "Copied" : "Copy prompt"}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="save"
                      initial={
                        shouldReduceMotion
                          ? false
                          : { opacity: 0, filter: "blur(6px)", scale: 0.85 }
                      }
                      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                      exit={
                        shouldReduceMotion
                          ? undefined
                          : { opacity: 0, filter: "blur(6px)", scale: 0.85 }
                      }
                      transition={morphTransition}
                      className="inline-flex items-center justify-center"
                    >
                      <Bookmark active={isSaved} className="size-[18px] md:size-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export interface ShowcaseCodePanelProps {
  componentId?: string;
  codeTitle?: string;
  codeSnippet: string;
  copiedCode?: boolean;
  onCopyCode?: () => void;
  cliCommand?: string;
  dependencies?: readonly string[];
  propsDocs?: readonly ComponentPropDoc[];
  howItWorks?: ComponentHowItWorksDoc;
}

type CodePanelSectionId =
  | "install"
  | "usage"
  | "code"
  | "props"
  | "how-it-works";

interface CodeAccordionCardProps {
  title: string;
  badge?: React.ReactNode;
  isOpen: boolean;
  onSelect: () => void;
  headerRight?: React.ReactNode;
  copied: boolean;
  onCopy?: () => void;
  copyDisabled?: boolean;
  copyLabel: string;
  fillHeight?: boolean;
  reduceMotion?: boolean;
  children: React.ReactNode;
}

const ACCORDION_EASE = [0.22, 1, 0.36, 1] as const;

function wrapTextLines(text: string, maxWidth = 66): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxWidth) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function formatHowItWorksCode(doc: ComponentHowItWorksDoc): string {
  const lines: string[] = [...wrapTextLines(doc.summary)];
  for (const point of doc.points) {
    lines.push("", `## ${point.title}`, ...wrapTextLines(point.detail));
  }
  return lines.join("\n");
}

function getPropsInterfaceName(componentId?: string): string {
  if (!componentId) return "ComponentProps";
  if (componentId === "gradient") return "GradientTileProps";
  const pascal = componentId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return `${pascal}Props`;
}

function formatPropsCode(
  propsDocs: readonly ComponentPropDoc[],
  componentId?: string
): string {
  const interfaceName = getPropsInterfaceName(componentId);
  const lines: string[] = [`export interface ${interfaceName} {`];

  propsDocs.forEach((prop, index) => {
    if (index > 0) lines.push("");

    const descLines = wrapTextLines(prop.description, 60);
    if (descLines.length === 1) {
      lines.push(`  /** ${descLines[0]} */`);
    } else {
      lines.push(`  /**`);
      for (const descLine of descLines) {
        lines.push(`   * ${descLine}`);
      }
      lines.push(`   */`);
    }

    const names = prop.name.split(/\s*\/\s*/).filter(Boolean);
    const defaults = prop.defaultValue.split(/\s*\/\s*/);

    names.forEach((name, nameIdx) => {
      const def =
        defaults.length === names.length
          ? defaults[nameIdx]
          : prop.defaultValue;
      const defaultComment =
        def && def !== "undefined" ? ` // default: ${def}` : "";
      const singleLine = `  ${name}?: ${prop.type};${defaultComment}`;

      if (singleLine.length > 68 && prop.type.includes(" | ")) {
        const unionParts = prop.type.split(/\s*\|\s*/);
        lines.push(`  ${name}?:`);
        unionParts.forEach((part, partIdx) => {
          const isLast = partIdx === unionParts.length - 1;
          lines.push(
            `    | ${part}${isLast ? `;${defaultComment}` : ""}`
          );
        });
      } else {
        lines.push(singleLine);
      }
    });
  });

  lines.push(`}`);
  return lines.join("\n");
}

const CodeAccordionCard: React.FC<CodeAccordionCardProps> = ({
  title,
  badge,
  isOpen,
  onSelect,
  headerRight,
  copied,
  onCopy,
  copyDisabled = false,
  copyLabel,
  fillHeight = true,
  reduceMotion = false,
  children,
}) => (
  <motion.section
    initial={false}
    animate={fillHeight ? { flexGrow: isOpen ? 1 : 0 } : undefined}
    transition={
      reduceMotion
        ? { duration: 0 }
        : { duration: 0.22, ease: ACCORDION_EASE }
    }
    style={
      fillHeight
        ? { flexBasis: "42px", minHeight: "42px" }
        : { minHeight: "42px" }
    }
    className={cn(
      "rounded-2xl border border-border bg-secondary/45 overflow-hidden flex flex-col transition-colors",
      !fillHeight && "shrink-0"
    )}
  >
    <div className="flex items-center justify-between gap-2 px-3 h-[42px] shrink-0">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onSelect}
        className="flex-1 min-w-0 flex items-center gap-2 text-left py-0.5 text-foreground hover:text-foreground/90 transition-colors cursor-pointer"
      >
        <ChevronRight
          size={14}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-90 text-foreground"
          )}
        />
        <span className="text-xs font-semibold tracking-tight truncate">
          {title}
        </span>
        {badge}
      </button>

      <div className="flex items-center gap-1.5 shrink-0 max-w-[65%]">
        {headerRight}
        {onCopy && (
          <button
            type="button"
            disabled={copyDisabled}
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            aria-label={copyLabel}
            title={copied ? "Copied" : copyLabel}
            className={cn(
              "h-7 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0",
              copyDisabled && "opacity-40 cursor-not-allowed",
              copied
                ? "px-2 text-primary bg-primary/10 text-[11px] font-medium"
                : "w-7 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
          >
            {copied ? (
              <>
                <Check size={13} />
                <span>Copied</span>
              </>
            ) : (
              <Copy01 size={14} />
            )}
          </button>
        )}
      </div>
    </div>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="body"
          initial={
            reduceMotion
              ? false
              : fillHeight
                ? { opacity: 0, y: 4 }
                : { opacity: 0, height: 0 }
          }
          animate={fillHeight ? { opacity: 1, y: 0 } : { opacity: 1, height: "auto" }}
          exit={
            reduceMotion
              ? undefined
              : fillHeight
                ? { opacity: 0 }
                : { opacity: 0, height: 0 }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.18, ease: ACCORDION_EASE }
          }
          className={cn(
            "overflow-hidden",
            fillHeight && "flex-1 min-h-0 flex flex-col"
          )}
        >
          <div
            className={cn(
              "px-2.5 pb-2.5",
              fillHeight && "flex-1 min-h-0 flex flex-col"
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.section>
);

export const ShowcaseCodePanel: React.FC<ShowcaseCodePanelProps> = ({
  componentId,
  codeSnippet,
  copiedCode = false,
  onCopyCode,
  cliCommand,
  dependencies,
  propsDocs,
  howItWorks,
}) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const hasInstall = Boolean(
    cliCommand || (dependencies ?? []).some((dep) => dep !== "react")
  );
  const [activeSection, setActiveSection] = useState<CodePanelSectionId | null>(
    () => (hasInstall ? "install" : "usage")
  );
  const [copiedSection, setCopiedSection] = useState<CodePanelSectionId | null>(
    null
  );
  const copyTimerRef = useRef<number | null>(null);

  const initialFiles = componentId ? getCachedRegistryFiles(componentId) : null;
  const [sourceFiles, setSourceFiles] = useState<RegistrySourceFile[]>(
    () => initialFiles ?? []
  );
  const [sourceLoading, setSourceLoading] = useState(
    () => Boolean(componentId && !initialFiles)
  );
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [activeFilePath, setActiveFilePath] = useState<string>(
    () => initialFiles?.[0]?.path ?? ""
  );
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!componentId) {
      setSourceFiles([]);
      setSourceError(null);
      setSourceLoading(false);
      setActiveFilePath("");
      return;
    }

    const cached = getCachedRegistryFiles(componentId);
    if (cached && reloadNonce === 0) {
      setSourceFiles(cached);
      setActiveFilePath((prev) =>
        cached.some((f) => f.path === prev) ? prev : cached[0]?.path ?? ""
      );
      setSourceError(null);
      setSourceLoading(false);
      return;
    }

    let cancelled = false;
    setSourceLoading(true);
    setSourceError(null);

    fetchRegistryFiles(componentId)
      .then((files) => {
        if (cancelled) return;
        setSourceFiles(files);
        setActiveFilePath((prev) =>
          files.some((f) => f.path === prev) ? prev : files[0]?.path ?? ""
        );
        setSourceLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setSourceFiles([]);
        setSourceError(
          err instanceof Error ? err.message : "Could not load source files"
        );
        setSourceLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [componentId, reloadNonce]);

  const activeFile = useMemo(
    () =>
      sourceFiles.find((file) => file.path === activeFilePath) ??
      sourceFiles[0] ??
      null,
    [sourceFiles, activeFilePath]
  );

  const npmDeps = useMemo(
    () => (dependencies ?? []).filter((dep) => dep !== "react"),
    [dependencies]
  );

  const installCopyText = useMemo(() => {
    if (cliCommand) return cliCommand;
    if (npmDeps.length > 0) return `npm install ${npmDeps.join(" ")}`;
    return "";
  }, [cliCommand, npmDeps]);

  const propsCode = useMemo(() => {
    if (!propsDocs || propsDocs.length === 0) return "";
    return formatPropsCode(propsDocs, componentId);
  }, [propsDocs, componentId]);

  const howItWorksCode = useMemo(
    () => (howItWorks ? formatHowItWorksCode(howItWorks) : ""),
    [howItWorks]
  );

  const toggleSection = (id: CodePanelSectionId) => {
    setActiveSection((prev) => (prev === id ? null : id));
  };

  const openSection = (id: CodePanelSectionId) => {
    setActiveSection(id);
  };

  const copySectionText = async (
    section: CodePanelSectionId,
    text: string
  ) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (section === "usage") {
        onCopyCode?.();
      }
      setCopiedSection(section);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedSection(null);
        copyTimerRef.current = null;
      }, 1800);
    } catch {}
  };

  const hasProps = Boolean(propsDocs && propsDocs.length > 0);

  return (
    <div className="relative z-10 flex-1 min-h-0 w-full mt-1 flex flex-col gap-2 overflow-hidden">
      {hasInstall && (
        <CodeAccordionCard
          title="Install"
          isOpen={activeSection === "install"}
          onSelect={() => toggleSection("install")}
          copied={copiedSection === "install"}
          onCopy={() => copySectionText("install", installCopyText)}
          copyDisabled={!installCopyText}
          copyLabel="Copy install command"
          fillHeight={false}
          reduceMotion={shouldReduceMotion}
        >
          <div className="rounded-xl border border-border/70 bg-background/85 px-3.5 py-2.5 overflow-x-auto">
            <CodeBlock
              code={installCopyText}
              lang="bash"
              wrap
              className="text-[15px]"
            />
          </div>
        </CodeAccordionCard>
      )}

      <CodeAccordionCard
        title="Usage"
        isOpen={activeSection === "usage"}
        onSelect={() => toggleSection("usage")}
        copied={copiedSection === "usage" || copiedCode}
        onCopy={() => copySectionText("usage", codeSnippet)}
        copyDisabled={!codeSnippet}
        copyLabel="Copy usage JSX"
        reduceMotion={shouldReduceMotion}
      >
        <div className="flex-1 min-h-0 rounded-xl border border-border/70 bg-background/85 py-3 pr-3.5 pl-2 overflow-auto">
          <CodeBlock
            code={codeSnippet}
            lang="tsx"
            showLineNumbers
            className="text-[15px]"
          />
        </div>
      </CodeAccordionCard>

      {componentId && (
        <CodeAccordionCard
          title="Code"
          isOpen={activeSection === "code"}
          onSelect={() => toggleSection("code")}
          copied={copiedSection === "code"}
          onCopy={() => copySectionText("code", activeFile?.content ?? "")}
          copyDisabled={!activeFile}
          copyLabel={
            activeFile ? `Copy ${activeFile.name}` : "Copy component source"
          }
          reduceMotion={shouldReduceMotion}
          headerRight={
            activeSection === "code" ? (
              sourceFiles.length > 1 ? (
                <div
                  className="inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-background/75 border border-border/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  {sourceFiles.map((file) => {
                    const isActive = activeFile?.path === file.path;
                    return (
                      <button
                        key={file.path}
                        type="button"
                        title={file.target ?? file.path}
                        onClick={() => {
                          setActiveFilePath(file.path);
                          openSection("code");
                        }}
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap",
                          isActive
                            ? "bg-secondary text-foreground font-semibold shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {file.tabLabel}
                      </button>
                    );
                  })}
                </div>
              ) : activeFile ? (
                <span
                  title={activeFile.target ?? activeFile.path}
                  className="px-2 py-0.5 rounded-md bg-background/70 border border-border/70 text-[11px] font-mono text-muted-foreground"
                >
                  {activeFile.tabLabel}
                </span>
              ) : null
            ) : null
          }
        >
          <div className="flex-1 min-h-0 rounded-xl border border-border/70 bg-background/85 overflow-auto py-3 pr-3.5 pl-2">
            {sourceLoading ? (
              <div className="h-full min-h-[140px] flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loading01 size={14} />
                <span>Loading source files...</span>
              </div>
            ) : sourceError ? (
              <div className="h-full min-h-[140px] flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground text-center">
                <span>{sourceError}</span>
                <button
                  type="button"
                  onClick={() => setReloadNonce((n) => n + 1)}
                  className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-foreground text-[11px] font-medium cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : activeFile ? (
              <CodeBlock
                code={activeFile.content}
                lang={activeFile.lang}
                showLineNumbers
                className="text-[15px]"
              />
            ) : (
              <div className="h-full min-h-[140px] flex items-center justify-center text-xs text-muted-foreground">
                No source files found.
              </div>
            )}
          </div>
        </CodeAccordionCard>
      )}

      {hasProps && (
        <CodeAccordionCard
          title="Props"
          badge={
            <span className="px-1.5 py-0.2 rounded-full bg-background/70 border border-border/70 text-[10px] font-mono text-muted-foreground">
              {propsDocs!.length}
            </span>
          }
          isOpen={activeSection === "props"}
          onSelect={() => toggleSection("props")}
          copied={copiedSection === "props"}
          onCopy={() => copySectionText("props", propsCode)}
          copyDisabled={!propsCode}
          copyLabel="Copy props interface"
          reduceMotion={shouldReduceMotion}
        >
          <div className="flex-1 min-h-0 rounded-xl border border-border/70 bg-background/85 overflow-auto py-3 pr-3.5 pl-2">
            <CodeBlock
              code={propsCode}
              lang="ts"
              showLineNumbers
              className="text-[15px]"
            />
          </div>
        </CodeAccordionCard>
      )}

      {howItWorks && (
        <CodeAccordionCard
          title="How it works"
          isOpen={activeSection === "how-it-works"}
          onSelect={() => toggleSection("how-it-works")}
          copied={copiedSection === "how-it-works"}
          onCopy={() => copySectionText("how-it-works", howItWorksCode)}
          copyDisabled={!howItWorksCode}
          copyLabel="Copy how it works notes"
          reduceMotion={shouldReduceMotion}
        >
          <div className="flex-1 min-h-0 rounded-xl border border-border/70 bg-background/85 overflow-auto py-3 pr-3.5 pl-2">
            <CodeBlock
              code={howItWorksCode}
              lang="markdown"
              showLineNumbers
              className="text-[15px]"
            />
          </div>
        </CodeAccordionCard>
      )}
    </div>
  );
};

export async function shareCurrentUrl(shareTitle: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const shareUrl = window.location.href;
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title: shareTitle, url: shareUrl });
      return false;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return false;
    }
  }
  try {
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch {
    return false;
  }
}

export interface ComponentDetailLayoutProps {
  /** Component title displayed in the stage card header */
  title: React.ReactNode;
  /** Optional subtle monospace badge right beside the stage title */
  badge?: React.ReactNode;
  /** Right-aligned header slot in the stage card (e.g. variant pills, hints, tokens) */
  stageHeaderRight?: React.ReactNode;
  /** Live interactive component stage */
  stage?: React.ReactNode;
  /** External placeholder ref when stage card is rendered & promoted to fixed by parent */
  stageSlotRef?: React.RefObject<HTMLDivElement | null>;
  /** Optional footer inside the stage card below the live component */
  stageFooter?: React.ReactNode;
  /** Optional utility classes for the stage body container */
  stageBodyClassName?: string;
  /** Configuration card heading (defaults to "Quick Config") */
  configTitle?: React.ReactNode;
  /** Short component description displayed under configTitle in the config panel header */
  configDescription?: React.ReactNode;
  /** Optional monospace pill right beside the configuration title */
  configBadge?: React.ReactNode;
  /** Extra action buttons rendered beside Reset in the configuration header */
  configHeaderActions?: React.ReactNode;
  /** Handler for the standardized Reset button */
  onReset?: () => void;
  /** Tooltip for the Reset button */
  resetTitle?: string;
  /** Optional custom handler for the Share button (defaults to Web Share / clipboard URL copy) */
  onShare?: () => void;
  /** Tooltip for the Share button */
  shareTitle?: string;
  /** Dedicated per-component configuration controls */
  children: React.ReactNode;
  /** Copyable React / TSX usage snippet */
  codeSnippet?: string;
  /** Title for the code snippet block (defaults to "React / TSX Usage") */
  codeTitle?: string;
  /** Desktop-only borderless list of components rendered on the far left */
  componentList?: ShowcaseComponentNavItem[];
  /** Currently active component id in componentList */
  activeComponentId?: string;
  /** Callback when a component is selected from componentList */
  onSelectComponent?: (id: string) => void;
  /** Optional play/replay handler rendered as an icon button in the bottom-right of the stage card */
  onPlay?: () => void;
  /** Optional prompt text to copy when Copy Prompt is clicked */
  promptText?: string;
  /** Optional custom handler for the Copy Prompt button */
  onCopyPrompt?: () => void;
  /** Show the Copy Prompt button in the Code tab header */
  showCopyPrompt?: boolean;
  /** Whether this component is currently saved/bookmarked */
  isSaved?: boolean;
  /** Toggle saved/bookmarked state in the stage header */
  onToggleSave?: () => void;
  /** Optional close/exit handler rendered as an icon button in the top-right of the sidepanel */
  onClose?: () => void;
  /** Optional handler to open the current component configuration in Studio Pro */
  onOpenInStudio?: () => void;
  /** True while the detail overlay is playing its close transition */
  isClosing?: boolean;
  /** Skip initial sidepanel/list entrance motion (e.g. direct URL load) */
  skipEntranceMotion?: boolean;
  /** Optional outer container classes */
  className?: string;
}

const CUBIC_EASE = [0.22, 1, 0.36, 1] as const;

export const ComponentDetailLayout: React.FC<ComponentDetailLayoutProps> = ({
  title,
  badge,
  stageHeaderRight,
  stage,
  stageSlotRef,
  stageFooter,
  stageBodyClassName,
  configTitle = "Quick Config",
  configDescription,
  configBadge,
  configHeaderActions,
  onReset,
  resetTitle = "Reset to default values",
  onShare,
  shareTitle = "Share component link",
  children,
  codeSnippet,
  codeTitle = "React / TSX Usage",
  componentList,
  activeComponentId,
  onSelectComponent,
  onPlay,
  promptText,
  onCopyPrompt,
  showCopyPrompt = false,
  isSaved = false,
  onToggleSave,
  onClose,
  onOpenInStudio,
  isClosing = false,
  skipEntranceMotion = false,
  className,
}) => {
  const [stageTab, setStageTab] = useState<"block" | "code">("block");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const shareTimerRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const leftListRef = useRef<HTMLElement | null>(null);
  const sidepanelRef = useRef<HTMLDivElement | null>(null);
  const bottomDocRef = useRef<HTMLElement | null>(null);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    return () => {
      if (shareTimerRef.current !== null) {
        window.clearTimeout(shareTimerRef.current);
      }
    };
  }, []);

  // Sidepanel, left list & bottom documentation card enter smoothly when the card expands
  useLayoutEffect(() => {
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;

    if (shouldReduceMotion || skipEntranceMotion || !stageSlotRef) return;

    const enterOpts = { duration: 0.28, delay: 0.08, ease: CUBIC_EASE };
    if (leftListRef.current) {
      leftListRef.current.style.opacity = "0";
      leftListRef.current.style.transform = "translate3d(-12px, 0, 0)";
      animate(leftListRef.current, { opacity: 1, x: 0 }, enterOpts);
    }
    if (sidepanelRef.current) {
      sidepanelRef.current.style.opacity = "0";
      sidepanelRef.current.style.transform = "translate3d(16px, 0, 0)";
      animate(sidepanelRef.current, { opacity: 1, x: 0 }, enterOpts);
    }
    if (bottomDocRef.current) {
      bottomDocRef.current.style.opacity = "0";
      bottomDocRef.current.style.transform = "translate3d(0, 12px, 0)";
      animate(bottomDocRef.current, { opacity: 1, y: 0 }, enterOpts);
    }
  }, [shouldReduceMotion, skipEntranceMotion, stageSlotRef]);

  // Fade out sidepanel, left list & bottom documentation card cleanly on close
  useLayoutEffect(() => {
    if (!isClosing || shouldReduceMotion) return;

    const exitOpts = { duration: 0.18, ease: CUBIC_EASE };
    if (leftListRef.current) {
      animate(leftListRef.current, { opacity: 0, x: -8 }, exitOpts);
    }
    if (sidepanelRef.current) {
      animate(sidepanelRef.current, { opacity: 0, x: 12 }, exitOpts);
    }
    if (bottomDocRef.current) {
      animate(bottomDocRef.current, { opacity: 0, y: 8 }, exitOpts);
    }
  }, [isClosing, shouldReduceMotion]);

  const handleCopyCode = async () => {
    if (!codeSnippet) return;
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const handleCopyPrompt = async () => {
    if (onCopyPrompt) {
      onCopyPrompt();
      return;
    }
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {}
  };

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    const copied = await shareCurrentUrl(
      typeof title === "string" ? title : document.title
    );
    if (!copied) return;
    setCopiedShare(true);
    if (shareTimerRef.current !== null) {
      window.clearTimeout(shareTimerRef.current);
    }
    shareTimerRef.current = window.setTimeout(() => {
      setCopiedShare(false);
      shareTimerRef.current = null;
    }, 2000);
  };

  const hasCopyPrompt = showCopyPrompt || Boolean(promptText) || Boolean(onCopyPrompt);

  const hasSidebarList = Boolean(componentList && componentList.length > 0);
  const showcaseDocs = getShowcaseComponentDocs(activeComponentId);
  const docProps = showcaseDocs?.props;
  const docOverview =
    showcaseDocs?.overview ??
    (typeof configDescription === "string" ? configDescription : undefined);
  const docTitle = showcaseDocs?.title ?? title ?? configTitle;

  return (
    <div
      data-showcase-backdrop="true"
      className={cn(
        "w-full max-w-[1440px] mx-auto p-2 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-5 lg:px-6 lg:pt-[max(2rem,calc((100dvh_-_min(800px,calc(100dvh_-_5rem)))_/_2))] lg:pb-8 flex flex-col",
        className
      )}
    >
      <div
        data-showcase-backdrop="true"
        className="flex flex-col lg:flex-row lg:items-start lg:justify-center gap-4 lg:gap-5 xl:gap-6"
      >
        {/* 1. Desktop-only Component List on the left (no card) */}
        {hasSidebarList && (
          <aside
            ref={leftListRef}
            aria-label="Components list"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="hidden lg:flex lg:sticky lg:top-8 lg:w-40 xl:w-44 shrink-0 flex-col gap-1 pt-1"
          >
            <span className="px-2.5 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Components
            </span>
            <nav className="flex flex-col gap-0.5">
              {componentList!.map((item) => {
                const isActive = item.id === activeComponentId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (!isActive) onSelectComponent?.(item.id);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2",
                      isActive
                        ? "text-foreground font-semibold cursor-default"
                        : "text-muted-foreground hover:text-foreground cursor-pointer"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full shrink-0 transition-opacity",
                        isActive ? "bg-primary opacity-100" : "bg-muted-foreground/40 opacity-0"
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Workspace: Square Stage (up to 800x800 on 2K) + 300px/320px Quick Config Sidepanel + Bottom Docs Card */}
        <div
          data-showcase-backdrop="true"
          className="lg:flex-initial lg:w-full lg:max-w-[calc(min(800px,calc(100dvh_-_5rem))_+_320px)] xl:max-w-[calc(min(800px,calc(100dvh_-_5rem))_+_340px)] lg:min-w-0 flex flex-col gap-3 sm:gap-4 lg:gap-5"
        >
          <div
            data-showcase-backdrop="true"
            className="h-[calc(100dvh-1rem)] sm:h-[calc(100dvh-2.5rem)] lg:h-auto shrink-0 grid grid-cols-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-rows-none lg:grid-cols-[minmax(0,min(800px,calc(100dvh-5rem)))_300px] xl:grid-cols-[minmax(0,min(800px,calc(100dvh-5rem)))_320px] gap-2 sm:gap-4 lg:gap-5 lg:items-stretch"
          >
            {/* 1. Standardized Square Stage Container (or external slot when parent promotes card) */}
            {stageSlotRef ? (
              <div
                ref={stageSlotRef}
                aria-hidden="true"
                className="aspect-square w-full shrink-0 pointer-events-none"
              />
            ) : (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="aspect-square w-full shrink-0 rounded-[28px] bg-card border border-border p-[14px] sm:p-[18px] flex flex-col justify-between text-card-foreground relative overflow-hidden"
              >
                {(!configDescription || stageHeaderRight || badge || codeSnippet || hasCopyPrompt || onToggleSave) && (
                  <ShowcaseStageHeader
                    stageTab={stageTab}
                    onStageTabChange={setStageTab}
                    hasCode={Boolean(codeSnippet)}
                    title={title}
                    hideTitle={Boolean(configDescription)}
                    stageHeaderRight={
                      badge || stageHeaderRight ? (
                        <div className="flex items-center gap-2">
                          {badge && (
                            <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-[11px] font-mono text-muted-foreground">
                              {badge}
                            </span>
                          )}
                          {stageHeaderRight}
                        </div>
                      ) : undefined
                    }
                    hasCopyPrompt={hasCopyPrompt}
                    promptText={promptText}
                    copiedPrompt={copiedPrompt}
                    onCopyPrompt={handleCopyPrompt}
                    isSaved={isSaved}
                    onToggleSave={onToggleSave}
                    saveLabel={typeof title === "string" ? title : "component"}
                  />
                )}

                {stageTab === "code" && codeSnippet ? (
                  <ShowcaseCodePanel
                    codeTitle={codeTitle}
                    codeSnippet={codeSnippet}
                    copiedCode={copiedCode}
                    onCopyCode={handleCopyCode}
                  />
                ) : (
                  <>
                    <div
                      className={cn(
                        "relative z-10 flex-1 min-h-0 w-full flex items-center justify-center",
                        stageBodyClassName
                      )}
                    >
                      {stage}
                    </div>

                    {stageFooter && (
                      <div className="relative z-10 w-full pt-2 flex flex-col items-center justify-center gap-1.5 shrink-0">
                        {stageFooter}
                      </div>
                    )}

                    <div className="absolute bottom-[14px] right-[14px] sm:bottom-[18px] sm:right-[18px] z-20 flex items-center gap-1.5">
                      {onPlay && (
                        <button
                          type="button"
                          onClick={onPlay}
                          aria-label={`Play ${typeof title === "string" ? title : "component"} animation`}
                          title="Play"
                          className="relative size-10 md:size-9 rounded-full glass-control flex items-center justify-center text-foreground cursor-pointer transition-transform active:scale-95 before:content-[''] before:absolute before:-inset-0.5 md:before:hidden"
                        >
                          <Play className="size-[18px] md:size-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleShare}
                        aria-label={copiedShare ? "Link copied" : shareTitle}
                        title={copiedShare ? "Copied" : shareTitle}
                        className={cn(
                          "relative size-10 md:size-9 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 before:content-[''] before:absolute before:-inset-0.5 md:before:hidden",
                          copiedShare
                            ? "glass-chosen text-primary"
                            : "glass-control text-foreground"
                        )}
                      >
                        {copiedShare ? (
                          <Check className="size-[18px] md:size-4" />
                        ) : (
                          <Share01 className="size-[18px] md:size-4" />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 2. Quick Config Sidepanel (on mobile: fixed header + scrollable body + fixed footer inside remaining 100dvh; on lg+: 320px matching Stage height) */}
            <div
              ref={sidepanelRef}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full min-h-0 lg:h-auto lg:relative"
            >
              <div className="w-full h-full min-h-0 lg:absolute lg:inset-0 rounded-[28px] bg-card border border-border p-[14px] sm:p-[18px] text-card-foreground select-none flex flex-col gap-2 lg:gap-3 overflow-hidden">
                {/* Anchored Header */}
                <div className="shrink-0 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h2 className="text-base font-semibold tracking-tight text-foreground truncate min-w-0">
                      {configTitle}
                    </h2>
                    {configBadge && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-[10px] font-mono text-muted-foreground shrink-0">
                        {configBadge}
                      </span>
                    )}
                  </div>

                  {(configHeaderActions || onClose) && (
                    <div className="flex items-center gap-2 shrink-0">
                      {configHeaderActions}
                      {onClose && (
                        <button
                          type="button"
                          onClick={onClose}
                          aria-label="Close component details"
                          title="Exit"
                          className="relative size-10 rounded-full glass-control flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer before:content-[''] before:absolute before:-inset-0.5 lg:before:hidden"
                        >
                          <Cancel01 className="size-[18px]" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-3.5 px-1 -mx-1 py-0.5">
                  {children}
                </div>

                {/* Anchored Footer */}
                {(onReset || onOpenInStudio) && (
                  <div
                    className={cn(
                      "shrink-0 pt-0.5 gap-2",
                      onReset && onOpenInStudio
                        ? "grid grid-cols-2 lg:flex lg:flex-col"
                        : "flex flex-col"
                    )}
                  >
                    {onReset && (
                      <Button
                        variant="outline"
                        size="md"
                        onClick={onReset}
                        title={resetTitle}
                        className="relative w-full h-10 before:content-[''] before:absolute before:-inset-y-0.5 before:inset-x-0 lg:before:hidden"
                        iconLeft={<Refresh />}
                      >
                        Reset
                      </Button>
                    )}
                    {onOpenInStudio && (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={onOpenInStudio}
                        title="Open in Studio Pro"
                        className="relative w-full h-10 before:content-[''] before:absolute before:-inset-y-0.5 before:inset-x-0 lg:before:hidden"
                      >
                        Open in Studio
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Full-width Documentation & Props Card below the 2 cards */}
          {(docOverview || (docProps && docProps.length > 0)) && (
            <section
              ref={bottomDocRef}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-[28px] bg-card border border-border p-[18px] sm:p-6 text-card-foreground flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5 max-w-3xl">
                {docTitle && (
                  <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                    {docTitle}
                  </h3>
                )}
                {docOverview && (
                  <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {docOverview.split("\n").map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              {docProps && docProps.length > 0 && (
                <div className="rounded-2xl border border-border bg-background/40 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/80 text-xs font-medium text-muted-foreground">
                        <th className="py-3 pl-4 pr-3 font-medium">Name</th>
                        <th className="py-3 px-3 font-medium">Type</th>
                        <th className="py-3 px-3 font-medium">Default</th>
                        <th className="py-3 pl-3 pr-4 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {docProps.map((prop) => (
                        <tr key={prop.name} className="align-middle">
                          <td className="py-3 pl-4 pr-3 whitespace-nowrap">
                            <code className="inline-flex px-2 py-0.5 rounded-md bg-secondary border border-border text-xs font-mono text-foreground">
                              {prop.name}
                            </code>
                          </td>
                          <td className="py-3 px-3 font-mono text-xs text-muted-foreground min-w-[110px] max-w-[260px] break-words">
                            {prop.type}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <code className="inline-flex px-2 py-0.5 rounded-md bg-secondary/70 border border-border text-xs font-mono text-foreground">
                              {prop.defaultValue}
                            </code>
                          </td>
                          <td className="py-3 pl-3 pr-4 text-xs sm:text-[13px] text-muted-foreground leading-relaxed min-w-[220px]">
                            {prop.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-xs text-muted-foreground pt-0.5">
                Free under MIT.{" "}
                <a
                  href="https://github.com/iamsebbi/interact/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:underline underline-offset-4"
                >
                  License
                </a>
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export interface ShowcaseToggleFieldProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel?: string;
  className?: string;
}

export const ShowcaseToggleField: React.FC<ShowcaseToggleFieldProps> = ({
  label,
  checked,
  onCheckedChange,
  ariaLabel,
  className,
}) => (
  <div
    className={cn(
      "h-11 px-3.5 bg-secondary/80 hover:bg-secondary border border-border rounded-xl flex items-center justify-between gap-2 transition-colors text-xs",
      className
    )}
  >
    <span className="text-muted-foreground font-normal">{label}</span>
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={ariaLabel ?? `Toggle ${label}`}
    />
  </div>
);

export interface ShowcaseSectionProps {
  label: string;
  valueLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  label,
  valueLabel,
  children,
  className,
}) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {valueLabel && (
        <span className="text-[11px] font-mono text-foreground">{valueLabel}</span>
      )}
    </div>
    {children}
  </div>
);
