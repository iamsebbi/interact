"use client";

import { toast } from "@ui-sdk/react/toast";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  type MouseEvent,
  type ReactNode,
  type Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  type ButtonProps,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@/components/controls";
import { Bookmark, Check, RefreshCw, Share2, X } from "@/components/icons";
import { preloadComponentCode } from "@/components/showcase/ClientCodeTabs";
import { cn } from "@/lib/utils";
import type { ComponentMeta } from "@/registry";
import { getComponentClient, preloadComponentClient } from "@/registry/client";

const SAVED_STORAGE_KEY = "interact:saved-products";
const MORPH_EASE = [0.22, 1, 0.36, 1] as const;

export interface ComponentNavItem {
  slug: string;
  title: string;
}

export interface ShowcaseSectionProps {
  label: string;
  valueLabel?: string;
  children: ReactNode;
  className?: string;
}

export function ShowcaseSection({
  label,
  valueLabel,
  children,
  className,
}: ShowcaseSectionProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        {valueLabel && (
          <span className="font-mono text-[11px] tabular-nums text-foreground">
            {valueLabel}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export interface ShowcaseToggleFieldProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function ShowcaseToggleField({
  label,
  checked,
  onCheckedChange,
  className,
}: ShowcaseToggleFieldProps) {
  return (
    <Switch
      label={label}
      checked={checked}
      onCheckedChange={onCheckedChange}
      rowClassName={className}
    />
  );
}

export interface ShowcaseChoiceButtonProps
  extends Omit<ButtonProps, "variant" | "size"> {
  selected?: boolean;
}

export function ShowcaseChoiceButton({
  selected = false,
  className,
  ...props
}: ShowcaseChoiceButtonProps) {
  return (
    <Button
      variant={selected ? "elevated" : "secondary"}
      size="sm"
      aria-pressed={selected}
      className={cn(
        "justify-start rounded-xl text-xs",
        selected
          ? "font-semibold text-foreground"
          : "font-medium text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function loadSavedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export interface ComponentDetailViewProps {
  meta: ComponentMeta<Record<string, unknown>>;
  componentList: readonly ComponentNavItem[];
  codeSlot: ReactNode;
  propsSlot: ReactNode;
  onClose?: () => void;
  onSelectSlug?: (slug: string) => void;
  stageWrapperRef?: Ref<HTMLDivElement>;
  stageRef?: Ref<HTMLDivElement>;
}

export function ComponentDetailView({
  meta,
  componentList,
  codeSlot,
  propsSlot,
  onClose,
  onSelectSlug,
  stageWrapperRef,
  stageRef,
}: ComponentDetailViewProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const slug = meta.slug;
  const title = meta.title;
  const description = meta.description;
  const isPro = meta.isPro ?? false;
  const clientEntry = getComponentClient(meta.slug, {
    preferResolved: Boolean(onClose),
  });

  const [config, setConfig] = useState<Record<string, unknown>>(
    () => meta.defaultConfig,
  );
  const [stageTab, setStageTab] = useState<"preview" | "code">("preview");
  const [isSaved, setIsSaved] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const promptTimerRef = useRef<number | null>(null);
  const shareTimerRef = useRef<number | null>(null);

  const handleNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    nextSlug: string,
  ) => {
    if (
      !onSelectSlug ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    e.preventDefault();
    if (nextSlug === slug) return;
    preloadComponentClient(nextSlug);
    preloadComponentCode(nextSlug);
    onSelectSlug(nextSlug);
  };

  useEffect(() => {
    setIsSaved(loadSavedSlugs().includes(slug));
  }, [slug]);

  useEffect(() => {
    return () => {
      if (promptTimerRef.current !== null) {
        window.clearTimeout(promptTimerRef.current);
      }
      if (shareTimerRef.current !== null) {
        window.clearTimeout(shareTimerRef.current);
      }
    };
  }, []);

  const Demo = clientEntry?.Demo;
  const Inspector = clientEntry?.Inspector;

  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      try {
        const current = loadSavedSlugs();
        const updated = next
          ? Array.from(new Set([...current, slug]))
          : current.filter((item) => item !== slug);
        window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage quota or private-mode errors
      }
      return next;
    });
  };

  const handleCopyPrompt = async () => {
    const promptText = clientEntry ? clientEntry.buildAiPrompt(config) : "";
    if (!promptText) return;

    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      toast("AI prompt copied");
      if (promptTimerRef.current !== null) {
        window.clearTimeout(promptTimerRef.current);
      }
      promptTimerRef.current = window.setTimeout(() => {
        setCopiedPrompt(false);
        promptTimerRef.current = null;
      }, 2000);
    } catch {
      toast("Could not copy prompt");
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: `${title} — interact.dev`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiedShare(true);
      toast("Component link copied");
      if (shareTimerRef.current !== null) {
        window.clearTimeout(shareTimerRef.current);
      }
      shareTimerRef.current = window.setTimeout(() => {
        setCopiedShare(false);
        shareTimerRef.current = null;
      }, 2000);
    } catch {
      // User cancelled share sheet or clipboard denied
    }
  };

  const handleReset = () => {
    setConfig(meta.defaultConfig);
  };

  const isCodeMode = stageTab === "code";
  const paragraphs = description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-5 lg:px-6 lg:pt-[max(2rem,calc((100dvh_-_min(800px,calc(100dvh_-_5rem)))_/_2))] lg:pb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-5 xl:gap-6">
        {componentList.length > 0 && (
          <aside
            aria-label="Components list"
            data-overlay-surface
            data-side="left"
            className="dtl-side-panel relative z-10 hidden shrink-0 flex-col gap-1 pt-1 lg:sticky lg:top-8 lg:flex lg:w-40 xl:w-44"
          >
            <span className="px-2.5 pb-1.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              Components
            </span>
            <nav
              aria-label="Component navigation"
              className="flex flex-col gap-0.5"
            >
              {componentList.map((item) => {
                const isActive = item.slug === slug;
                return (
                  <Link
                    key={item.slug}
                    href={`/components/${item.slug}`}
                    onClick={(e) => handleNavClick(e, item.slug)}
                    onPointerEnter={() => {
                      preloadComponentClient(item.slug);
                      preloadComponentCode(item.slug);
                    }}
                    onFocus={() => {
                      preloadComponentClient(item.slug);
                      preloadComponentCode(item.slug);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      isActive
                        ? "font-semibold text-foreground-strong"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 shrink-0 rounded-full transition-opacity",
                        isActive
                          ? "bg-primary opacity-100"
                          : "bg-muted-foreground/40 opacity-0",
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        <div className="flex flex-col gap-3 sm:gap-4 lg:w-full lg:max-w-[calc(min(800px,calc(100dvh_-_5rem))_+_320px)] lg:min-w-0 lg:flex-initial lg:gap-5 xl:max-w-[calc(min(800px,calc(100dvh_-_5rem))_+_340px)]">
          <div className="grid h-[calc(100dvh-1rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] shrink-0 grid-cols-1 grid-rows-1 sm:h-[calc(100dvh-2.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] lg:h-auto lg:grid-cols-[minmax(0,min(800px,calc(100dvh-5rem)))_300px] lg:grid-rows-none lg:items-stretch lg:gap-5 xl:grid-cols-[minmax(0,min(800px,calc(100dvh-5rem)))_320px]">
            <div
              ref={stageWrapperRef}
              className="relative z-20 h-full w-full shrink-0 lg:aspect-square lg:h-auto"
            >
              <div
                ref={stageRef}
                data-overlay-surface
                className="dtl-stage-card surface-panel relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[28px] p-[14px] sm:p-[18px]"
              >
                <Tabs
                  value={stageTab}
                  onValueChange={(nextTab) => {
                    if (nextTab === "preview" || nextTab === "code") {
                      setStageTab(nextTab);
                    }
                  }}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <div className="dtl-stage-corner relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-2 pb-2">
                    <TabsList aria-label="Stage view">
                      <TabsTab value="preview">Preview</TabsTab>
                      <TabsTab value="code">Code</TabsTab>
                    </TabsList>

                    {isCodeMode && (
                      <div className="ml-auto flex shrink-0 items-center justify-end gap-1.5">
                        <Button
                          variant={copiedPrompt ? "pro" : "chip"}
                          size="md"
                          onClick={handleCopyPrompt}
                          aria-label={
                            copiedPrompt ? "Prompt copied" : "Copy prompt"
                          }
                          title={copiedPrompt ? "Copied" : "Copy AI prompt"}
                          className="h-10 px-3.5 md:h-9"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={copiedPrompt ? "copied" : "prompt"}
                              initial={
                                shouldReduceMotion
                                  ? false
                                  : { opacity: 0, scale: 0.94 }
                              }
                              animate={{ opacity: 1, scale: 1 }}
                              exit={
                                shouldReduceMotion
                                  ? undefined
                                  : { opacity: 0, scale: 0.94 }
                              }
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : { duration: 0.16, ease: MORPH_EASE }
                              }
                              className="inline-flex items-center gap-1.5 whitespace-nowrap"
                            >
                              {copiedPrompt && (
                                <Check size={14} aria-hidden="true" />
                              )}
                              <span>
                                {copiedPrompt ? "Copied" : "Copy prompt"}
                              </span>
                            </motion.span>
                          </AnimatePresence>
                        </Button>

                        {onClose ? (
                          <Button
                            variant="chip"
                            size="icon"
                            onClick={onClose}
                            aria-label="Close code view"
                            title="Exit"
                            className="size-10 shrink-0 text-muted-foreground hover:text-foreground md:size-9 lg:hidden"
                          >
                            <X size={18} aria-hidden="true" />
                          </Button>
                        ) : (
                          <Button
                            variant="chip"
                            size="icon"
                            render={<Link href="/" />}
                            aria-label="Close code view"
                            title="Exit"
                            className="size-10 shrink-0 text-muted-foreground hover:text-foreground md:size-9 lg:hidden"
                          >
                            <X size={18} aria-hidden="true" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <TabsPanel
                    value="preview"
                    className="relative flex min-h-0 flex-1 flex-col"
                  >
                    <div className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center">
                      <div className="dtl-stage-content inline-flex shrink-0 items-center justify-center">
                        {Demo && (
                          <Demo config={config} onConfigChange={setConfig} />
                        )}
                      </div>
                    </div>

                    <span className="dtl-stage-tools pointer-events-none absolute bottom-0 left-0 z-20 flex h-10 max-w-[calc(100%-9rem)] items-center truncate px-1 text-sm font-medium tracking-tight text-foreground-strong lg:hidden">
                      {title}
                    </span>

                    <div className="dtl-stage-tools absolute right-0 bottom-0 z-20 flex items-center gap-1.5">
                      <Button
                        variant={isSaved ? "pro" : "chip"}
                        size="icon"
                        onClick={handleToggleSave}
                        aria-label={
                          isSaved ? `Unsave ${title}` : `Save ${title}`
                        }
                        aria-pressed={isSaved}
                        title={isSaved ? "Saved" : "Save"}
                        className="size-10 md:size-9"
                      >
                        <Bookmark size={16} aria-hidden="true" />
                      </Button>
                      <Button
                        variant={copiedShare ? "pro" : "chip"}
                        size="icon"
                        onClick={handleShare}
                        aria-label={
                          copiedShare ? "Link copied" : "Share component link"
                        }
                        title={copiedShare ? "Copied" : "Share component link"}
                        className="size-10 md:size-9"
                      >
                        {copiedShare ? (
                          <Check size={16} aria-hidden="true" />
                        ) : (
                          <Share2 size={16} aria-hidden="true" />
                        )}
                      </Button>
                      {onClose ? (
                        <Button
                          variant="chip"
                          size="icon"
                          onClick={onClose}
                          aria-label="Close preview"
                          title="Exit"
                          className="size-10 shrink-0 text-muted-foreground hover:text-foreground md:size-9 lg:hidden"
                        >
                          <X size={18} aria-hidden="true" />
                        </Button>
                      ) : (
                        <Button
                          variant="chip"
                          size="icon"
                          render={<Link href="/" />}
                          aria-label="Close preview"
                          title="Exit"
                          className="size-10 shrink-0 text-muted-foreground hover:text-foreground md:size-9 lg:hidden"
                        >
                          <X size={18} aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </TabsPanel>

                  <TabsPanel
                    value="code"
                    className="flex min-h-0 flex-1 flex-col overflow-hidden"
                  >
                    {codeSlot}
                  </TabsPanel>
                </Tabs>
              </div>
            </div>

            <aside
              aria-label="Quick Config"
              data-overlay-surface
              className="dtl-side-panel relative z-10 hidden h-full min-h-0 w-full lg:block lg:h-auto"
            >
              <div className="surface-panel flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden rounded-[28px] p-[14px] select-none sm:p-[18px] lg:absolute lg:inset-0 lg:gap-3">
                <div className="flex shrink-0 items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="min-w-0 truncate text-base font-semibold tracking-tight text-foreground-strong">
                      {title}
                    </h2>
                    {isPro && (
                      <span className="control-pro shrink-0 rounded-pill px-2 py-0.5 font-mono text-[10px] font-medium">
                        PRO
                      </span>
                    )}
                  </div>

                  {onClose ? (
                    <Button
                      variant="chip"
                      size="icon"
                      onClick={onClose}
                      aria-label="Close component details"
                      title="Exit"
                      className="size-10 shrink-0 text-muted-foreground hover:text-foreground md:size-9"
                    >
                      <X size={18} aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button
                      variant="chip"
                      size="icon"
                      render={<Link href="/" />}
                      aria-label="Close component details"
                      title="Exit"
                      className="size-10 shrink-0 text-muted-foreground hover:text-foreground md:size-9"
                    >
                      <X size={18} aria-hidden="true" />
                    </Button>
                  )}
                </div>

                <div className="no-scrollbar -mx-1 flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-1 py-0.5 text-xs">
                  {Inspector && (
                    <Inspector config={config} onChange={setConfig} />
                  )}
                </div>

                <div className="grid shrink-0 grid-cols-2 gap-2 pt-0.5 lg:flex lg:flex-col">
                  <Button
                    variant="chip"
                    size="md"
                    onClick={handleReset}
                    title="Reset to default values"
                    className="h-10 w-full"
                  >
                    <RefreshCw size={14} aria-hidden="true" />
                    <span>Reset</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    render={<Link href={`/studio?component=${slug}`} />}
                    title="Open in Studio Pro"
                    className="h-10 w-full"
                  >
                    Open in Studio
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          {(paragraphs.length > 0 || propsSlot) && (
            <section
              aria-labelledby="component-docs-heading"
              data-overlay-surface
              className="dtl-docs-panel surface-panel hidden w-full flex-col gap-4 rounded-[28px] p-[18px] sm:p-6 lg:flex"
            >
              <div className="flex max-w-3xl flex-col gap-1.5">
                <h1
                  id="component-docs-heading"
                  className="text-base font-semibold tracking-tight text-foreground-strong sm:text-lg"
                >
                  {title}
                </h1>
                {paragraphs.length > 0 && (
                  <div className="flex flex-col gap-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              {propsSlot}

              <p className="pt-0.5 text-xs text-muted-foreground">
                Free under MIT.{" "}
                <a
                  href="https://github.com/iamsebbi/interact/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
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
}
