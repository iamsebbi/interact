"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy } from "@/components/icons";
import { cn } from "@/lib/utils";
import { REGISTRY_BASE_URL } from "@/registry";
import { ApproveReject } from "@/registry/items/approve-reject/approve-reject";
import { DeleteButton } from "@/registry/items/delete-button/delete-button";
import { DownloadButton } from "@/registry/items/download-button/download-button";
import { SearchButton } from "@/registry/items/search-button/search-button";
import { UpdateButton } from "@/registry/items/update-button/update-button";
import { UploadButton } from "@/registry/items/upload-button/upload-button";
import { VoiceButton } from "@/registry/items/voice-button/voice-button";

type ButtonSize = "sm" | "md" | "lg" | "xl";
type ButtonTheme = "light" | "dark";
type InstallTab = "cli" | "nextjs" | "vite" | "agents";

interface ButtonPackEntry {
  slug: string;
  name: string;
  states: string;
  recovery: string;
  deps: string;
}

const BUTTON_ENTRIES: readonly ButtonPackEntry[] = [
  {
    slug: "download-button",
    name: "Download Button",
    states: "idle → downloading ↔ paused → completing → completed",
    recovery: "Pause, Resume, Cancel",
    deps: "@ui-sdk/react, motion, @animate-ui/react",
  },
  {
    slug: "upload-button",
    name: "Upload Button",
    states: "idle → uploading / error → completing → completed → copied",
    recovery: "Inline Retry, Copy link",
    deps: "@ui-sdk/react, motion, @animate-ui/react",
  },
  {
    slug: "update-button",
    name: "Update Button",
    states: "idle → updating → completing → completed",
    recovery: "Emerging Cancel circle",
    deps: "@ui-sdk/react, motion, @animate-ui/react",
  },
  {
    slug: "delete-button",
    name: "Delete Button",
    states: "idle → confirming → deleted",
    recovery: "Two-step Confirm / Cancel",
    deps: "@ui-sdk/react, motion, @animate-ui/react",
  },
  {
    slug: "approve-reject",
    name: "Approve Reject",
    states: "idle → approved / rejected",
    recovery: "Opposite-pill Undo",
    deps: "@ui-sdk/react, motion, @animate-ui/react",
  },
  {
    slug: "voice-button",
    name: "Voice Button",
    states: "idle ↔ listening",
    recovery: "Dedicated Stop circle",
    deps: "@ui-sdk/react, voice-glow, @number-flow/react, motion",
  },
  {
    slug: "search-button",
    name: "Search Button",
    states: "closed ↔ open",
    recovery: "Clear, Escape, Outside click",
    deps: "@ui-sdk/react, motion, @animate-ui/react",
  },
];

const NEXTJS_SNIPPET = `/* src/app/globals.css */
@layer ui-sdk;
@import "tailwindcss";

/* src/components/ReleaseBar.tsx */
"use client";

import { DownloadButton } from "@/components/ui/download-button";
import { ApproveReject } from "@/components/ui/approve-reject";

export function ReleaseBar() {
  return (
    <div className="flex items-center gap-3">
      <DownloadButton sizeMB={32} />
      <ApproveReject />
    </div>
  );
}`;

const VITE_SNIPPET = `/* src/index.css */
@layer ui-sdk;
@import "tailwindcss";

/* src/App.tsx */
import { UpdateButton } from "@/components/ui/update-button";
import { DeleteButton } from "@/components/ui/delete-button";

export function App() {
  return (
    <div className="flex items-center gap-4 p-8">
      <UpdateButton label="Update to 2.4" />
      <DeleteButton showDeletedState />
    </div>
  );
}`;

const AGENTS_SNIPPET = `import { createAgent } from "@ui-sdk/react/agent";

const agent = createAgent();

await agent.act({
  steps: [
    { ref: "Download 32 MB", action: "press" },
    { ref: "Approve", action: "press" },
  ],
});`;

function CopyInline({
  value,
  label = "Copy",
  tone = "auto",
}: {
  value: string;
  label?: string;
  tone?: "auto" | "stage-light" | "stage-dark";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
        tone === "stage-light"
          ? "border-black/15 bg-white/75 text-[#1a1915]/80 hover:border-black/25 hover:bg-white hover:text-[#1a1915]"
          : tone === "stage-dark"
            ? "border-white/15 bg-white/[0.05] text-white/80 hover:border-white/25 hover:bg-white/10 hover:text-white"
            : "border-border/80 bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {copied ? (
        <>
          <Check className="size-3" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="size-3" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export function ButtonsProductPage() {
  const [stageTheme, setStageTheme] = useState<ButtonTheme>("light");
  const [stageSize, setStageSize] = useState<ButtonSize>("md");
  const [installTab, setInstallTab] = useState<InstallTab>("cli");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() =>
    BUTTON_ENTRIES.map((entry) => entry.slug),
  );
  const [lastQuery, setLastQuery] = useState<string>("");

  const cliCommand = useMemo(() => {
    const active =
      selectedSlugs.length > 0
        ? selectedSlugs
        : BUTTON_ENTRIES.map((entry) => entry.slug);
    return `pnpm dlx shadcn@latest add ${active.map((slug) => `${REGISTRY_BASE_URL}/${slug}.json`).join(" ")}`;
  }, [selectedSlugs]);

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug)
        ? prev.length > 1
          ? prev.filter((item) => item !== slug)
          : prev
        : [...prev, slug],
    );
  };

  const isDarkStage = stageTheme === "dark";

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[1200px] flex-col gap-16 px-4 pt-6 pb-24 text-foreground antialiased sm:px-6 sm:pt-10">
      {/* Top nav + Hero */}
      <section className="flex flex-col gap-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Catalog</span>
        </Link>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <h1 className="text-3xl leading-[1.06] font-medium tracking-tight text-foreground sm:text-5xl">
              Buttons
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Seven stateful React buttons built on{" "}
              <code className="font-mono text-[13px] text-foreground">
                @ui-sdk/react
              </code>{" "}
              and Motion. Each handles its own async states, confirmation,
              cancellation, and keyboard semantics.
            </p>
          </div>

          {/* Minimal monochrome stage controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-border/80 bg-card/60 p-0.5">
              {(["light", "dark"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setStageTheme(mode)}
                  className={cn(
                    "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                    stageTheme === mode
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center rounded-lg border border-border/80 bg-card/60 p-0.5">
              {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setStageSize(sz)}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-1 text-xs font-medium uppercase transition-colors",
                    stageSize === sz
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clean architectural 7-button grid with hairline borders */}
        <div
          className={cn(
            "overflow-hidden rounded-[22px] border transition-colors duration-200",
            isDarkStage
              ? "border-white/10 bg-[#121211] text-white"
              : "border-black/[0.08] bg-[#f5f4f0] text-[#1a1915]",
          )}
        >
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              isDarkStage
                ? "divide-y divide-white/[0.07] md:divide-x"
                : "divide-y divide-black/[0.06] md:divide-x",
            )}
          >
            {/* 1. Download */}
            <div className="flex flex-col justify-between p-6">
              <div className="flex min-h-[120px] items-center justify-center">
                <DownloadButton
                  size={stageSize}
                  theme={stageTheme}
                  sizeMB={32}
                />
              </div>
              <div className="flex items-center justify-between pt-4 text-xs">
                <Link
                  href="/components/download-button"
                  className="font-medium opacity-75 transition-opacity hover:opacity-100"
                >
                  Download Button
                </Link>
                <CopyInline
                  value={`pnpm dlx shadcn@latest add ${REGISTRY_BASE_URL}/download-button.json`}
                  label="CLI"
                  tone={isDarkStage ? "stage-dark" : "stage-light"}
                />
              </div>
            </div>

            {/* 2. Update */}
            <div className="flex flex-col justify-between p-6">
              <div className="flex min-h-[120px] items-center justify-center">
                <UpdateButton size={stageSize} theme={stageTheme} />
              </div>
              <div className="flex items-center justify-between pt-4 text-xs">
                <Link
                  href="/components/update-button"
                  className="font-medium opacity-75 transition-opacity hover:opacity-100"
                >
                  Update Button
                </Link>
                <CopyInline
                  value={`pnpm dlx shadcn@latest add ${REGISTRY_BASE_URL}/update-button.json`}
                  label="CLI"
                  tone={isDarkStage ? "stage-dark" : "stage-light"}
                />
              </div>
            </div>

            {/* 3. Delete */}
            <div className="flex flex-col justify-between p-6">
              <div className="flex min-h-[120px] items-center justify-center">
                <DeleteButton
                  size={stageSize}
                  theme={stageTheme}
                  showDeletedState
                />
              </div>
              <div className="flex items-center justify-between pt-4 text-xs">
                <Link
                  href="/components/delete-button"
                  className="font-medium opacity-75 transition-opacity hover:opacity-100"
                >
                  Delete Button
                </Link>
                <CopyInline
                  value={`pnpm dlx shadcn@latest add ${REGISTRY_BASE_URL}/delete-button.json`}
                  label="CLI"
                  tone={isDarkStage ? "stage-dark" : "stage-light"}
                />
              </div>
            </div>

            {/* 4. Approve Reject */}
            <div className="flex flex-col justify-between p-6">
              <div className="flex min-h-[120px] items-center justify-center">
                <ApproveReject size={stageSize} theme={stageTheme} />
              </div>
              <div className="flex items-center justify-between pt-4 text-xs">
                <Link
                  href="/components/approve-reject"
                  className="font-medium opacity-75 transition-opacity hover:opacity-100"
                >
                  Approve Reject
                </Link>
                <CopyInline
                  value={`pnpm dlx shadcn@latest add ${REGISTRY_BASE_URL}/approve-reject.json`}
                  label="CLI"
                  tone={isDarkStage ? "stage-dark" : "stage-light"}
                />
              </div>
            </div>

            {/* 5. Voice */}
            <div className="flex flex-col justify-between p-6">
              <div className="flex min-h-[120px] items-center justify-center">
                <VoiceButton size={stageSize} theme={stageTheme} />
              </div>
              <div className="flex items-center justify-between pt-4 text-xs">
                <Link
                  href="/components/voice-button"
                  className="font-medium opacity-75 transition-opacity hover:opacity-100"
                >
                  Voice Button
                </Link>
                <CopyInline
                  value={`pnpm dlx shadcn@latest add ${REGISTRY_BASE_URL}/voice-button.json`}
                  label="CLI"
                  tone={isDarkStage ? "stage-dark" : "stage-light"}
                />
              </div>
            </div>

            {/* 6. Search */}
            <div className="flex flex-col justify-between p-6">
              <div className="flex min-h-[120px] items-center justify-center">
                <SearchButton
                  size={stageSize}
                  theme={stageTheme}
                  expandedWidth={220}
                />
              </div>
              <div className="flex items-center justify-between pt-4 text-xs">
                <Link
                  href="/components/search-button"
                  className="font-medium opacity-75 transition-opacity hover:opacity-100"
                >
                  Search Button
                </Link>
                <CopyInline
                  value={`pnpm dlx shadcn@latest add ${REGISTRY_BASE_URL}/search-button.json`}
                  label="CLI"
                  tone={isDarkStage ? "stage-dark" : "stage-light"}
                />
              </div>
            </div>

            {/* 7. Upload (full width row so queue expands freely) */}
            <div className="flex flex-col justify-between p-6 md:col-span-2 lg:col-span-3">
              <div className="flex min-h-[140px] items-center justify-center py-2">
                <UploadButton size={stageSize} theme={stageTheme} />
              </div>
              <div className="flex items-center justify-between pt-4 text-xs">
                <Link
                  href="/components/upload-button"
                  className="font-medium opacity-75 transition-opacity hover:opacity-100"
                >
                  Upload Button
                </Link>
                <CopyInline
                  value={`pnpm dlx shadcn@latest add ${REGISTRY_BASE_URL}/upload-button.json`}
                  label="CLI"
                  tone={isDarkStage ? "stage-dark" : "stage-light"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Cropped Real-World Product Corners */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
          In context
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Scene 1: Cropped Phone Lock-Screen Notification (ApproveReject) */}
          <div className="relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[22px] border border-border/80 bg-[#e9e8e3] px-5 pt-8 dark:bg-[#111110] lg:col-span-5">
            {/* Cropped top of a phone frame rising from bottom */}
            <div className="mx-auto w-full max-w-[330px] translate-y-2 rounded-t-[38px] border border-b-0 border-black/15 bg-[#f7f7f5] px-4 pt-3 pb-7 shadow-[0_-12px_40px_rgba(0,0,0,0.08)] dark:border-white/12 dark:bg-[#191918]">
              {/* Status bar + dynamic island */}
              <div className="mb-5 flex items-center justify-between px-2 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                <span>9:41</span>
                <span className="h-5 w-20 rounded-full bg-neutral-900 dark:bg-black" />
                <span className="font-mono text-[10px]">5G</span>
              </div>

              {/* Push Notification card */}
              <div className="flex flex-col gap-3.5 rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-sm dark:border-white/[0.07] dark:bg-[#222220]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
                      PR
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        Deploy #482 to Production
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Ava Chen · 14 checks passed
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400">now</span>
                </div>

                <div className="flex justify-center pt-1">
                  <ApproveReject size="sm" theme="light" />
                </div>
              </div>
            </div>
          </div>

          {/* Scene 2: Cropped macOS App Bottom-Right Corner (Update + Download) */}
          <div className="relative flex min-h-[300px] items-end justify-end overflow-hidden rounded-[22px] border border-border/80 bg-[#ecebe7] pt-8 pl-6 dark:bg-[#111110] lg:col-span-7">
            {/* Cropped desktop window extending off top-left & right */}
            <div className="flex h-full w-full flex-col justify-between rounded-tl-[20px] border-t border-l border-black/10 bg-white shadow-[-12px_-8px_36px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#191918]">
              {/* Window titlebar */}
              <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3 dark:border-white/[0.07]">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  Releases / v2.4.1
                </span>
                <span className="w-8" />
              </div>

              {/* Subtle muted changelog lines */}
              <div className="flex flex-col gap-2.5 px-5 py-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    interact-desktop-2.4.1.dmg
                  </span>
                  <span className="font-mono text-[11px] text-neutral-400">
                    32 MB
                  </span>
                </div>
                <div className="h-2 w-3/4 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-2 w-1/2 rounded-full bg-neutral-100 dark:bg-neutral-800" />
              </div>

              {/* Anchored action bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] bg-[#fafaf8] px-5 py-4 dark:border-white/[0.07] dark:bg-[#141413]">
                <DownloadButton size="sm" theme="light" sizeMB={32} />
                <UpdateButton
                  size="sm"
                  theme="light"
                  label="Install update"
                  completedLabel="Up to date"
                />
              </div>
            </div>
          </div>

          {/* Scene 3: Cropped Settings Modal Corner (DeleteButton) */}
          <div className="relative flex min-h-[260px] items-start justify-end overflow-hidden rounded-[22px] border border-border/80 bg-[#e9e8e3] pt-0 pb-8 pl-8 dark:bg-[#111110] lg:col-span-6">
            {/* Cropped modal hanging from top-right */}
            <div className="flex w-full flex-col justify-between gap-5 rounded-bl-[20px] border-b border-l border-black/10 bg-white p-6 shadow-[-8px_12px_32px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#191918]">
              <div className="flex flex-col gap-1">
                <p className="font-mono text-[11px] text-neutral-400">
                  settings / danger-zone
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Delete staging workspace
                </p>
                <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Removes preview deployments, environment variables, and logs
                  permanently.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-black/[0.06] pt-4 dark:border-white/[0.07]">
                <span className="font-mono text-[11px] text-neutral-400">
                  ws_staging_eu01
                </span>
                <DeleteButton size="sm" theme="light" showDeletedState />
              </div>
            </div>
          </div>

          {/* Scene 4: Cropped Bottom OS Floating Dock (SearchButton + VoiceButton) */}
          <div className="relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[22px] border border-border/80 bg-[#ecebe7] p-6 dark:bg-[#111110] lg:col-span-6">
            {/* Faint cropped editor canvas lines above dock */}
            <div className="flex flex-col gap-2 opacity-50">
              <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                <span>command-surface</span>
                <span>{lastQuery ? `"${lastQuery}"` : "⌘K"}</span>
              </div>
              <div className="mt-2 h-2 w-2/3 rounded-full bg-black/[0.07] dark:bg-white/[0.07]" />
              <div className="h-2 w-1/2 rounded-full bg-black/[0.05] dark:bg-white/[0.05]" />
            </div>

            {/* Floating bottom dock */}
            <div className="mx-auto flex items-center gap-3 rounded-full border border-black/[0.08] bg-white/95 px-3 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-[#1e1e1c]/95">
              <SearchButton
                size="sm"
                theme="light"
                expandedWidth={210}
                onSearch={(q) => setLastQuery(q)}
              />
              <span className="h-5 w-px bg-black/10 dark:bg-white/10" />
              <VoiceButton size="sm" theme="light" />
            </div>
          </div>

          {/* Scene 5: Cropped Drive / Asset Corner (UploadButton) */}
          <div className="relative flex min-h-[240px] items-end overflow-hidden rounded-[22px] border border-border/80 bg-[#e9e8e3] px-6 pt-8 dark:bg-[#111110] lg:col-span-12">
            <div className="flex w-full flex-col gap-5 rounded-t-[20px] border border-b-0 border-black/10 bg-white px-6 pt-5 pb-7 shadow-[0_-10px_32px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-[#191918] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <p className="font-mono text-[11px] text-neutral-400">
                  drive / brand-assets-2026
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  5 files staged for upload
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Click to expand the live upload queue, retry failed items, and
                  copy the share link.
                </p>
              </div>
              <div className="flex shrink-0 items-center justify-center">
                <UploadButton size="sm" theme="light" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Installation & Contexts */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
          Installation
        </h2>

        <div className="overflow-hidden rounded-[18px] border border-border/80 bg-card/60">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-1">
              {(
                [
                  ["cli", "shadcn CLI"],
                  ["nextjs", "Next.js"],
                  ["vite", "Vite"],
                  ["agents", "AI Agents"],
                ] as const
              ).map(([tabKey, tabLabel]) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setInstallTab(tabKey)}
                  className={cn(
                    "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    installTab === tabKey
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tabLabel}
                </button>
              ))}
            </div>

            <CopyInline
              value={
                installTab === "cli"
                  ? cliCommand
                  : installTab === "nextjs"
                    ? NEXTJS_SNIPPET
                    : installTab === "vite"
                      ? VITE_SNIPPET
                      : AGENTS_SNIPPET
              }
              label="Copy"
            />
          </div>

          <div className="p-4 sm:p-5">
            {installTab === "cli" && (
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {BUTTON_ENTRIES.map((entry) => {
                    const active = selectedSlugs.includes(entry.slug);
                    return (
                      <button
                        key={entry.slug}
                        type="button"
                        onClick={() => toggleSlug(entry.slug)}
                        className={cn(
                          "cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border/80 bg-transparent text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {entry.name}
                      </button>
                    );
                  })}
                </div>
                <pre className="overflow-x-auto rounded-xl border border-border/70 bg-background/80 p-4 font-mono text-xs leading-relaxed text-foreground">
                  <code>{cliCommand}</code>
                </pre>
              </div>
            )}

            {installTab === "nextjs" && (
              <pre className="overflow-x-auto rounded-xl border border-border/70 bg-background/80 p-4 font-mono text-xs leading-relaxed text-foreground">
                <code>{NEXTJS_SNIPPET}</code>
              </pre>
            )}

            {installTab === "vite" && (
              <pre className="overflow-x-auto rounded-xl border border-border/70 bg-background/80 p-4 font-mono text-xs leading-relaxed text-foreground">
                <code>{VITE_SNIPPET}</code>
              </pre>
            )}

            {installTab === "agents" && (
              <pre className="overflow-x-auto rounded-xl border border-border/70 bg-background/80 p-4 font-mono text-xs leading-relaxed text-foreground">
                <code>{AGENTS_SNIPPET}</code>
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Reference Table */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
          Reference
        </h2>

        <div className="overflow-x-auto rounded-[18px] border border-border/80 bg-card/60">
          <table className="w-full min-w-[680px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border/70 text-muted-foreground">
                <th className="px-4 py-3 font-medium">Component</th>
                <th className="px-4 py-3 font-medium">States</th>
                <th className="px-4 py-3 font-medium">Recovery</th>
                <th className="px-4 py-3 font-medium">Dependencies</th>
                <th className="px-4 py-3 text-right font-medium">Docs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {BUTTON_ENTRIES.map((entry) => (
                <tr
                  key={entry.slug}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {entry.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {entry.states}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {entry.recovery}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {entry.deps}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/components/${entry.slug}`}
                      className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span>Open</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
