"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Button,
} from "@/components/controls";
import {
  Check,
  ChevronDown,
  ClaudeIcon,
  Copy,
  CursorIcon,
  OpenAIIcon,
  RefreshCw,
  Sparkles,
  Sun,
} from "@/components/icons";
import { DotMatrixWave } from "@/components/showcase/DotMatrixWave";
import { cn } from "@/lib/utils";
import { CATALOG_META, getRegistryCliCommand } from "@/registry";

interface RegistryTableRow {
  slug: string;
  shortTitle: string;
  summary: string;
}

const FAQ_ITEMS = [
  {
    id: "registry-model",
    question: "Do I need an npm package to use interact.dev components?",
    answer:
      "No. Using the shadcn registry model, component source files are copied straight into your codebase so you own and customize every line, while peer libraries like motion or @ui-sdk/react are installed automatically.",
  },
  {
    id: "oklch-palette",
    question: "How does the OKLCH Palette generator avoid muddy colors?",
    answer:
      "Standard sRGB and HSL ramps produce uneven perceived brightness and dull midtones. The Palette component computes perceptually uniform lightness ramps in OKLCH space and maps chroma cleanly inside the sRGB gamut.",
  },
  {
    id: "tailwind-nextjs",
    question: "Are the components compatible with Tailwind CSS & Next.js?",
    answer:
      "Yes. Components use semantic Tailwind tokens (bg-primary, bg-control, text-foreground, border-border) and standard React hooks. BotAvatar also works standalone without Tailwind CSS.",
  },
  {
    id: "reduced-motion",
    question: "How do the spring animations handle accessibility?",
    answer:
      "Interactive controls use @ui-sdk/react primitives for keyboard support, agent readiness, and :focus-visible rings, keep live numeric counters fixed with tabular-nums to avoid layout jitter, and simplify transitions when prefers-reduced-motion is enabled.",
  },
] as const;

interface AgentGridCell {
  id: string;
  Icon?: ComponentType<{ className?: string }>;
  active?: boolean;
  muted?: boolean;
}

const AGENT_GRID_CELLS: readonly AgentGridCell[] = [
  { id: "r1-1", muted: true },
  { id: "r1-2", muted: true },
  { id: "r1-3", muted: true },
  { id: "r1-4", muted: true },
  { id: "r2-1" },
  { id: "r2-claude", Icon: ClaudeIcon, active: true },
  { id: "r2-openai", Icon: OpenAIIcon, active: true },
  { id: "r2-cursor", Icon: CursorIcon, active: true },
  { id: "r3-1", muted: true },
  { id: "r3-2", muted: true },
  { id: "r3-3", muted: true },
  { id: "r3-4", muted: true },
];

function StepBadge({ step }: { step: number }) {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold tabular-nums text-primary-foreground">
      {step}
    </span>
  );
}

export function HowToUseContent() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const rows: readonly RegistryTableRow[] = CATALOG_META.map((entry) => ({
    slug: entry.slug,
    shortTitle: entry.shortTitle ?? entry.title,
    summary: entry.tagline || entry.description,
  }));

  const handleCopyCli = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(getRegistryCliCommand(slug));
      setCopiedId(slug);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedId(null);
        copyTimerRef.current = null;
      }, 1800);
    } catch {
      // Ignore clipboard permission errors in restricted contexts
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background pb-20 text-foreground antialiased">
      <section className="relative flex min-h-[44vh] w-full flex-col items-center justify-center overflow-hidden px-4 py-10 text-center sm:min-h-[48vh]">
        <DotMatrixWave className="absolute inset-0 z-0" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-3.5">
          <h1 className="max-w-2xl text-3xl font-medium leading-[1.08] tracking-tight text-foreground-strong sm:text-5xl">
            How to use
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground text-balance sm:text-base">
            Every component ships as a CLI command and an AI prompt. Copy it,
            paste it into your coding agent, and make it yours. Three steps, no
            setup.
          </p>
        </div>
      </section>

      <section
        aria-label="Workflow steps"
        className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="surface-panel flex flex-col justify-between gap-7 overflow-hidden rounded-[28px] p-6 sm:p-7">
            <div className="space-y-2.5">
              <StepBadge step={1} />
              <h2 className="pt-1 text-base font-semibold tracking-tight text-foreground-strong">
                Copy the prompt
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-[13px]">
                Every component page has a Copy prompt button and CLI command.
                One paste gives your agent the full component.
              </p>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none relative -mx-2 -mb-2 pt-2 select-none"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 55%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 55%, transparent 100%)",
              }}
            >
              <div className="surface-stage space-y-3 rounded-2xl p-3">
                <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1">
                      Presets <ChevronDown size={10} />
                    </span>
                    <RefreshCw size={10} />
                    <span className="control-chip inline-flex items-center gap-1 rounded-pill px-2 py-0.5 font-medium text-foreground">
                      <Copy size={9} />
                      Copy prompt
                    </span>
                  </div>
                  <div className="inline-flex items-center rounded-pill bg-control p-0.5 text-[9px] ring-1 ring-border-subtle">
                    <span className="control-elevated rounded-pill px-1.5 py-0.5 font-medium text-foreground">
                      Manual
                    </span>
                    <span className="px-1.5 py-0.5 text-muted-foreground">
                      Agent
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_1.15fr] items-stretch gap-2.5">
                  <div className="relative min-h-[82px] overflow-hidden rounded-xl bg-control ring-1 ring-border-subtle">
                    <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-foreground/10 blur-xl" />
                  </div>
                  <div className="space-y-2 text-[10px]">
                    <div>
                      <div className="mb-1 text-muted-foreground">Variant</div>
                      <div className="inline-flex gap-0.5 rounded-pill bg-control p-0.5 ring-1 ring-border-subtle">
                        <span className="control-elevated rounded-pill px-2 py-0.5 font-medium text-foreground">
                          Pill
                        </span>
                        <span className="px-2 py-0.5 text-muted-foreground">
                          Circle
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-muted-foreground">Size</div>
                      <div className="inline-flex gap-0.5 rounded-pill bg-control p-0.5 ring-1 ring-border-subtle">
                        <span className="control-elevated rounded-pill px-2 py-0.5 font-medium text-foreground">
                          XL
                        </span>
                        <span className="px-2 py-0.5 text-muted-foreground">
                          MD
                        </span>
                        <span className="px-2 py-0.5 text-muted-foreground">
                          SM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-panel flex flex-col justify-between gap-7 overflow-hidden rounded-[28px] p-6 sm:p-7">
            <div className="space-y-2.5">
              <StepBadge step={2} />
              <h2 className="pt-1 text-base font-semibold tracking-tight text-foreground-strong">
                Paste it in your agent
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-[13px]">
                Drop it into Claude Code, Cursor or Codex. The agent installs
                the registry files and wires it in, matched to your theme.
              </p>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none flex items-center justify-center py-1 select-none"
            >
              <div className="grid grid-cols-4 gap-2">
                {AGENT_GRID_CELLS.map(({ id, Icon, active, muted }) => (
                  <div
                    key={id}
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl sm:size-12",
                      active
                        ? "control-elevated text-foreground-strong"
                        : muted
                          ? "bg-control/50 opacity-45 ring-1 ring-border-subtle"
                          : "bg-control opacity-75 ring-1 ring-border-subtle",
                    )}
                  >
                    {Icon && <Icon className="size-4 sm:size-[18px]" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-panel flex flex-col justify-between gap-7 overflow-hidden rounded-[28px] p-6 sm:p-7">
            <div className="space-y-2.5">
              <StepBadge step={3} />
              <h2 className="pt-1 text-base font-semibold tracking-tight text-foreground-strong">
                Make it yours
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-[13px]">
                Open the{" "}
                <Link
                  href="/studio"
                  className="text-foreground underline underline-offset-4 transition-colors hover:text-foreground-strong"
                >
                  Studio
                </Link>{" "}
                to tune every knob live, then copy the configured result as JSX
                or props.
              </p>
            </div>

            <div
              aria-hidden="true"
              className="surface-stage pointer-events-none flex min-h-[152px] flex-col justify-between gap-4 rounded-2xl p-3.5 select-none"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-2.5 text-[11px]">
                <div className="inline-flex items-center gap-1 rounded-pill bg-control p-0.5 ring-1 ring-border-subtle">
                  <span className="px-2.5 py-0.5 text-muted-foreground">
                    Manual controls
                  </span>
                  <span className="control-elevated rounded-pill px-2.5 py-0.5 font-medium text-foreground">
                    Agent
                  </span>
                </div>
                <Sun size={13} className="text-muted-foreground" />
              </div>

              <div className="flex justify-end">
                <span className="control-chip inline-flex items-center rounded-2xl px-3 py-1.5 text-xs text-foreground">
                  Make it more subtle
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                <Sparkles size={13} className="shrink-0" />
                <span>Reading the current settings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="all-components-heading"
        className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-10 text-center">
          <h2
            id="all-components-heading"
            className="text-2xl font-medium tracking-tight text-foreground-strong sm:text-3xl"
          >
            All {rows.length} components
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle text-xs font-medium text-muted-foreground">
                <th className="py-3 pr-6 font-medium whitespace-nowrap">
                  Component
                </th>
                <th className="py-3 pr-6 font-medium whitespace-nowrap">
                  Registry
                </th>
                <th className="py-3 font-medium">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-sm md:text-[13px]">
              {rows.map((row) => {
                const isCopied = copiedId === row.slug;
                return (
                  <tr key={row.slug} className="group">
                    <td className="py-3.5 pr-6 font-medium whitespace-nowrap text-foreground-strong">
                      {row.shortTitle}
                    </td>
                    <td className="py-3.5 pr-6 whitespace-nowrap">
                      <Button
                        variant={isCopied ? "pro" : "chip"}
                        size="sm"
                        aria-label={`Copy CLI command for ${row.shortTitle}`}
                        title={`Copy: ${getRegistryCliCommand(row.slug)}`}
                        onClick={() => handleCopyCli(row.slug)}
                        className="h-6 gap-1.5 rounded-md px-2.5 font-mono text-xs"
                      >
                        <span>{isCopied ? "copied cli" : row.slug}</span>
                        {isCopied ? (
                          <Check size={11} aria-hidden="true" />
                        ) : (
                          <Copy
                            size={11}
                            aria-hidden="true"
                            className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                          />
                        )}
                      </Button>
                    </td>
                    <td className="py-3.5 leading-relaxed text-muted-foreground">
                      {row.summary}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="technical-faq-heading"
        className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-8 text-center">
          <h2
            id="technical-faq-heading"
            className="text-2xl font-medium tracking-tight text-foreground-strong sm:text-3xl"
          >
            Technical FAQ
          </h2>
        </div>

        <Accordion
          variant="flush"
          aria-label="Technical FAQ"
          defaultValue={[FAQ_ITEMS[0].id]}
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionPanel>{item.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
