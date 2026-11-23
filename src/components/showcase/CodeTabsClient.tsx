"use client";

import { toast } from "@ui-sdk/react/toast";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/controls";
import { Check, ChevronRight, Copy } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface HighlightedCodeBlock {
  raw: string;
  html: string;
}

export interface HighlightedSourceFile extends HighlightedCodeBlock {
  path: string;
  name: string;
}

export interface HighlightedCodeAccordionData {
  install?: HighlightedCodeBlock;
  usage: HighlightedCodeBlock;
  sourceFiles: readonly HighlightedSourceFile[];
  props?: HighlightedCodeBlock & { count: number };
  howItWorks?: HighlightedCodeBlock;
}

export interface CodeTabsClientProps {
  data: HighlightedCodeAccordionData;
}

type SectionId = "install" | "usage" | "code" | "props" | "how-it-works";

const ACCORDION_EASE = [0.22, 1, 0.36, 1] as const;

interface CodeAccordionCardProps {
  title: string;
  badge?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  headerRight?: ReactNode;
  copied: boolean;
  onCopy?: () => void;
  copyDisabled?: boolean;
  copyLabel: string;
  fillHeight?: boolean;
  reduceMotion: boolean;
  children: ReactNode;
}

function CodeAccordionCard({
  title,
  badge,
  isOpen,
  onToggle,
  headerRight,
  copied,
  onCopy,
  copyDisabled = false,
  copyLabel,
  fillHeight = true,
  reduceMotion,
  children,
}: CodeAccordionCardProps) {
  return (
    <motion.section
      aria-label={title}
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
        "flex flex-col overflow-hidden rounded-2xl bg-control/80 ring-1 ring-border-subtle",
        !fillHeight && "shrink-0",
      )}
    >
      <div className="flex h-[42px] shrink-0 items-center justify-between gap-2 px-3">
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={isOpen}
          onClick={onToggle}
          className="h-7 min-w-0 flex-1 justify-start gap-2 rounded-lg px-1 text-left text-foreground hover:bg-transparent hover:text-foreground-strong active:scale-100"
        >
          <ChevronRight
            size={14}
            aria-hidden="true"
            className={cn(
              "shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-90 text-foreground",
            )}
          />
          <span className="truncate text-xs font-semibold tracking-tight">
            {title}
          </span>
          {badge}
        </Button>

        <div className="flex max-w-[65%] shrink-0 items-center gap-1.5">
          {headerRight}
          {onCopy && (
            <Button
              variant={copied ? "pro" : "ghost"}
              size="sm"
              disabled={copyDisabled}
              onClick={(event) => {
                event.stopPropagation();
                onCopy();
              }}
              aria-label={copyLabel}
              title={copied ? "Copied" : copyLabel}
              className={cn(
                "h-7 shrink-0 rounded-lg text-[11px]",
                copied ? "gap-1 px-2" : "w-7 px-0",
              )}
            >
              {copied ? (
                <>
                  <Check size={12} aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <Copy size={13} aria-hidden="true" />
              )}
            </Button>
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
            animate={
              fillHeight ? { opacity: 1, y: 0 } : { opacity: 1, height: "auto" }
            }
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
              fillHeight && "flex min-h-0 flex-1 flex-col",
            )}
          >
            <div
              className={cn(
                "px-2.5 pb-2.5",
                fillHeight && "flex min-h-0 flex-1 flex-col",
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export function CodeTabsClient({ data }: CodeTabsClientProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [activeSection, setActiveSection] = useState<SectionId | null>(() =>
    data.install ? "install" : "usage",
  );
  const [activeFilePath, setActiveFilePath] = useState<string>(
    () => data.sourceFiles[0]?.path ?? "",
  );
  const [copiedSection, setCopiedSection] = useState<SectionId | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const activeFile =
    data.sourceFiles.find((file) => file.path === activeFilePath) ??
    data.sourceFiles[0] ??
    null;

  const toggleSection = (section: SectionId) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const handleCopy = async (
    section: SectionId,
    text: string,
    label: string,
  ) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast(`Copied ${label}`);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedSection(null);
        copyTimerRef.current = null;
      }, 1800);
    } catch {
      toast("Failed to copy");
    }
  };

  return (
    <div className="relative z-10 mt-1 flex min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      {data.install && (
        <CodeAccordionCard
          title="Install"
          isOpen={activeSection === "install"}
          onToggle={() => toggleSection("install")}
          copied={copiedSection === "install"}
          onCopy={() =>
            handleCopy("install", data.install?.raw ?? "", "install command")
          }
          copyLabel="Copy install command"
          fillHeight={false}
          reduceMotion={reduceMotion}
        >
          <div className="surface-stage overflow-x-auto rounded-xl px-3.5 py-2.5">
            <div
              className="font-mono text-[13px] leading-relaxed [&_pre]:whitespace-pre-wrap [&_pre]:break-all"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted server-generated Shiki HTML
              dangerouslySetInnerHTML={{ __html: data.install.html }}
            />
          </div>
        </CodeAccordionCard>
      )}

      <CodeAccordionCard
        title="Usage"
        isOpen={activeSection === "usage"}
        onToggle={() => toggleSection("usage")}
        copied={copiedSection === "usage"}
        onCopy={() => handleCopy("usage", data.usage.raw, "usage JSX")}
        copyLabel="Copy usage JSX"
        reduceMotion={reduceMotion}
      >
        <div className="surface-stage scrollbar-thin min-h-0 flex-1 overflow-auto rounded-xl py-3 pr-3.5 pl-2">
          <div
            className="code-line-numbers font-mono text-[13px] leading-[1.65]"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted server-generated Shiki HTML
            dangerouslySetInnerHTML={{ __html: data.usage.html }}
          />
        </div>
      </CodeAccordionCard>

      {data.sourceFiles.length > 0 && (
        <CodeAccordionCard
          title="Code"
          isOpen={activeSection === "code"}
          onToggle={() => toggleSection("code")}
          copied={copiedSection === "code"}
          onCopy={() =>
            handleCopy(
              "code",
              activeFile?.raw ?? "",
              activeFile?.name ?? "source code",
            )
          }
          copyDisabled={!activeFile}
          copyLabel={
            activeFile ? `Copy ${activeFile.name}` : "Copy component source"
          }
          reduceMotion={reduceMotion}
          headerRight={
            activeSection === "code" ? (
              data.sourceFiles.length > 1 ? (
                <div className="inline-flex items-center gap-0.5 rounded-lg bg-stage p-0.5 ring-1 ring-border-subtle">
                  {data.sourceFiles.map((file) => {
                    const isActive = activeFile?.path === file.path;
                    return (
                      <Button
                        key={file.path}
                        variant={isActive ? "elevated" : "ghost"}
                        size="sm"
                        aria-pressed={isActive}
                        title={file.path}
                        onClick={() => {
                          setActiveFilePath(file.path);
                          setActiveSection("code");
                        }}
                        className="h-6 rounded-md px-2 font-mono text-[11px]"
                      >
                        {file.name}
                      </Button>
                    );
                  })}
                </div>
              ) : activeFile ? (
                <span
                  title={activeFile.path}
                  className="rounded-md bg-stage px-2 py-0.5 font-mono text-[11px] text-muted-foreground ring-1 ring-border-subtle"
                >
                  {activeFile.name}
                </span>
              ) : null
            ) : null
          }
        >
          <div className="surface-stage scrollbar-thin min-h-0 flex-1 overflow-auto rounded-xl py-3 pr-3.5 pl-2">
            {activeFile ? (
              <div
                className="code-line-numbers font-mono text-[13px] leading-[1.65]"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted server-generated Shiki HTML
                dangerouslySetInnerHTML={{ __html: activeFile.html }}
              />
            ) : null}
          </div>
        </CodeAccordionCard>
      )}

      {data.props && (
        <CodeAccordionCard
          title="Props"
          badge={
            <span className="rounded-pill bg-stage px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground ring-1 ring-border-subtle">
              {data.props.count}
            </span>
          }
          isOpen={activeSection === "props"}
          onToggle={() => toggleSection("props")}
          copied={copiedSection === "props"}
          onCopy={() =>
            handleCopy("props", data.props?.raw ?? "", "props interface")
          }
          copyLabel="Copy props interface"
          reduceMotion={reduceMotion}
        >
          <div className="surface-stage scrollbar-thin min-h-0 flex-1 overflow-auto rounded-xl py-3 pr-3.5 pl-2">
            <div
              className="code-line-numbers font-mono text-[13px] leading-[1.65]"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted server-generated Shiki HTML
              dangerouslySetInnerHTML={{ __html: data.props.html }}
            />
          </div>
        </CodeAccordionCard>
      )}

      {data.howItWorks && (
        <CodeAccordionCard
          title="How it works"
          isOpen={activeSection === "how-it-works"}
          onToggle={() => toggleSection("how-it-works")}
          copied={copiedSection === "how-it-works"}
          onCopy={() =>
            handleCopy(
              "how-it-works",
              data.howItWorks?.raw ?? "",
              "how it works notes",
            )
          }
          copyLabel="Copy how it works notes"
          reduceMotion={reduceMotion}
        >
          <div className="surface-stage scrollbar-thin min-h-0 flex-1 overflow-auto rounded-xl py-3 pr-3.5 pl-2">
            <div
              className="code-line-numbers font-mono text-[13px] leading-[1.65]"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted server-generated Shiki HTML
              dangerouslySetInnerHTML={{ __html: data.howItWorks.html }}
            />
          </div>
        </CodeAccordionCard>
      )}
    </div>
  );
}
