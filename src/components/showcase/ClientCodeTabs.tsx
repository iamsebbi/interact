"use client";

import { useEffect, useState } from "react";
import {
  CodeTabsClient,
  type HighlightedCodeAccordionData,
} from "@/components/showcase/CodeTabsClient";

const resolvedCodeCache = new Map<string, HighlightedCodeAccordionData>();
const inflightCodeCache = new Map<
  string,
  Promise<HighlightedCodeAccordionData | null>
>();

async function fetchComponentCodeData(
  slug: string,
): Promise<HighlightedCodeAccordionData | null> {
  const existing = resolvedCodeCache.get(slug);
  if (existing) return existing;

  const inflight = inflightCodeCache.get(slug);
  if (inflight) return inflight;

  const request = fetch(`/api/components/${slug}/code`)
    .then(async (res) => {
      if (!res.ok) return null;
      const json = (await res.json()) as HighlightedCodeAccordionData;
      resolvedCodeCache.set(slug, json);
      return json;
    })
    .catch(() => null)
    .finally(() => {
      inflightCodeCache.delete(slug);
    });

  inflightCodeCache.set(slug, request);
  return request;
}

export function preloadComponentCode(slug: string): void {
  if (typeof window === "undefined") return;
  if (resolvedCodeCache.has(slug) || inflightCodeCache.has(slug)) return;
  void fetchComponentCodeData(slug);
}

export function ClientCodeTabs({ slug }: { slug: string }) {
  const [data, setData] = useState<HighlightedCodeAccordionData | null>(
    () => resolvedCodeCache.get(slug) ?? null,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const cached = resolvedCodeCache.get(slug);
    if (cached) {
      setData(cached);
      setFailed(false);
      return;
    }

    let cancelled = false;
    setFailed(false);
    setData(null);

    void fetchComponentCodeData(slug).then((loaded) => {
      if (cancelled) return;
      if (loaded) {
        setData(loaded);
      } else {
        setFailed(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (data) {
    return <CodeTabsClient data={data} />;
  }

  if (failed) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-xs text-muted-foreground">
        Could not load component source.
      </div>
    );
  }

  return (
    <output
      aria-label="Loading component code"
      className="flex min-h-0 flex-1 flex-col gap-2 pt-1"
    >
      <div className="h-[42px] w-full animate-pulse rounded-2xl bg-control/70" />
      <div className="h-[42px] w-full animate-pulse rounded-2xl bg-control/70" />
      <div className="min-h-0 flex-1 animate-pulse rounded-2xl bg-control/60" />
    </output>
  );
}
