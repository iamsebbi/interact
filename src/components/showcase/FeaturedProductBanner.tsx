"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/controls";
import { ArrowRight, Check, Copy } from "@/components/icons";
import { REGISTRY_BASE_URL } from "@/registry";
import { ApproveReject } from "@/registry/items/approve-reject/approve-reject";
import { DeleteButton } from "@/registry/items/delete-button/delete-button";
import { DownloadButton } from "@/registry/items/download-button/download-button";
import { UpdateButton } from "@/registry/items/update-button/update-button";

const BUTTONS_PACK_SLUGS = [
  "download-button",
  "upload-button",
  "update-button",
  "delete-button",
  "approve-reject",
  "voice-button",
  "search-button",
] as const;

const INSTALL_ALL_CMD = `pnpm dlx shadcn@latest add ${BUTTONS_PACK_SLUGS.map((slug) => `${REGISTRY_BASE_URL}/${slug}.json`).join(" ")}`;

export function FeaturedProductBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopyCli = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(INSTALL_ALL_CMD).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <section
      aria-label="Buttons collection"
      className="mx-auto w-full max-w-[1240px] px-4 sm:px-6"
    >
      <div className="overflow-hidden rounded-[22px] border border-border/80 bg-card/60">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          {/* Left: quiet editorial intro */}
          <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
            <div className="flex flex-col gap-2.5">
              <p className="text-xs font-medium text-muted-foreground">
                01 / Collection
              </p>
              <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-[30px] sm:leading-[1.12]">
                Buttons
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Seven stateful React buttons built on ui-sdk and Motion—with
                progress, confirmation, undo, voice, and search lifecycles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="primary"
                size="md"
                render={<Link href="/products/buttons" />}
              >
                <span>Open Buttons</span>
                <ArrowRight className="size-3.5" />
              </Button>
              <Button
                variant="chip"
                size="md"
                onClick={handleCopyCli}
                aria-label="Copy shadcn CLI command for all 7 buttons"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy CLI</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right: cropped monochrome application corner */}
          <div className="relative overflow-hidden border-t border-border/70 bg-[#ecebe7] pt-6 pl-5 sm:pt-7 sm:pl-7 lg:border-t-0 lg:border-l dark:bg-[#111110]">
            <div className="flex h-full flex-col justify-between rounded-tl-[18px] border-t border-l border-black/10 bg-white shadow-[-10px_-6px_32px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#181817]">
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5 dark:border-white/[0.07]">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <span className="font-mono text-[11px] text-neutral-400">
                  workspace / releases
                </span>
                <span className="w-8" />
              </div>

              {/* Release row + overlapping approval card */}
              <div className="flex flex-col gap-3.5 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      interact-desktop-2.4.dmg
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400">
                      32 MB · macOS universal
                    </span>
                  </div>
                  <DownloadButton size="sm" theme="light" sizeMB={32} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/[0.07] bg-[#f8f8f6] px-3.5 py-3 shadow-xs dark:border-white/[0.08] dark:bg-[#20201e]">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      Deploy #482 · production
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Ava Chen · now
                    </span>
                  </div>
                  <ApproveReject size="sm" theme="light" />
                </div>
              </div>

              {/* Anchored bottom toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] bg-[#fafaf8] px-4 py-3 sm:px-5 dark:border-white/[0.07] dark:bg-[#141413]">
                <UpdateButton
                  size="sm"
                  theme="light"
                  label="Update"
                  completedLabel="Up to date"
                />
                <DeleteButton size="sm" theme="light" showDeletedState />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
