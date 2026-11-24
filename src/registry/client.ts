"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { COMPONENT_GENERATORS } from "./generators";
import type {
  ComponentClientEntry,
  ComponentDemoProps,
  ComponentGenerators,
  ComponentInspectorProps,
  ComponentPreviewProps,
} from "./types";

const resolvedRegistryEntries = new WeakMap<
  ComponentClientEntry<Record<string, unknown>>,
  Partial<
    Pick<
      ComponentClientEntry<Record<string, unknown>>,
      "Preview" | "Demo" | "Inspector"
    >
  >
>();

function buildClientEntry<
  TDemo extends Record<string, unknown>,
  TInsp extends Record<string, unknown>,
>(
  loadDemo: () => Promise<TDemo>,
  loadInspector: () => Promise<TInsp>,
  names: {
    preview: keyof TDemo & string;
    demo: keyof TDemo & string;
    inspector: keyof TInsp & string;
  },
  generators: ComponentGenerators<Record<string, unknown>>,
): ComponentClientEntry<Record<string, unknown>> {
  const resolved: Partial<
    Pick<
      ComponentClientEntry<Record<string, unknown>>,
      "Preview" | "Demo" | "Inspector"
    >
  > = {};

  const resolveDemo = () =>
    loadDemo().then((m) => {
      resolved.Preview = m[
        names.preview
      ] as ComponentType<ComponentPreviewProps>;
      resolved.Demo = m[names.demo] as ComponentType<
        ComponentDemoProps<Record<string, unknown>>
      >;
      return m;
    });

  const resolveInspector = () =>
    loadInspector().then((m) => {
      resolved.Inspector = m[names.inspector] as ComponentType<
        ComponentInspectorProps<Record<string, unknown>>
      >;
      return m;
    });

  const entry: ComponentClientEntry<Record<string, unknown>> = {
    Preview: dynamic<ComponentPreviewProps>(() =>
      resolveDemo().then(
        (m) => m[names.preview] as ComponentType<ComponentPreviewProps>,
      ),
    ),
    Demo: dynamic<ComponentDemoProps<Record<string, unknown>>>(() =>
      resolveDemo().then(
        (m) =>
          m[names.demo] as ComponentType<
            ComponentDemoProps<Record<string, unknown>>
          >,
      ),
    ),
    Inspector: dynamic<ComponentInspectorProps<Record<string, unknown>>>(() =>
      resolveInspector().then(
        (m) =>
          m[names.inspector] as ComponentType<
            ComponentInspectorProps<Record<string, unknown>>
          >,
      ),
    ),
    preload: () =>
      Promise.all([resolveDemo(), resolveInspector()]).then(() => undefined),
    ...generators,
  };

  resolvedRegistryEntries.set(entry, resolved);
  return entry;
}

/**
 * Client-only registry mapping each slug to its lazy-loaded `Preview`, `Demo`,
 * and `Inspector` components (via `next/dynamic`) plus its JSX/AI prompt builders.
 */
export const COMPONENT_CLIENT_REGISTRY: Record<
  string,
  ComponentClientEntry<Record<string, unknown>>
> = {
  "download-button": buildClientEntry(
    () => import("./items/download-button/demo"),
    () => import("./items/download-button/inspector"),
    {
      preview: "DownloadButtonPreview",
      demo: "DownloadButtonDemo",
      inspector: "DownloadButtonInspector",
    },
    COMPONENT_GENERATORS["download-button"],
  ),
  "upload-button": buildClientEntry(
    () => import("./items/upload-button/demo"),
    () => import("./items/upload-button/inspector"),
    {
      preview: "UploadButtonPreview",
      demo: "UploadButtonDemo",
      inspector: "UploadButtonInspector",
    },
    COMPONENT_GENERATORS["upload-button"],
  ),
  "search-button": buildClientEntry(
    () => import("./items/search-button/demo"),
    () => import("./items/search-button/inspector"),
    {
      preview: "SearchButtonPreview",
      demo: "SearchButtonDemo",
      inspector: "SearchButtonInspector",
    },
    COMPONENT_GENERATORS["search-button"],
  ),
  "update-button": buildClientEntry(
    () => import("./items/update-button/demo"),
    () => import("./items/update-button/inspector"),
    {
      preview: "UpdateButtonPreview",
      demo: "UpdateButtonDemo",
      inspector: "UpdateButtonInspector",
    },
    COMPONENT_GENERATORS["update-button"],
  ),
  "voice-button": buildClientEntry(
    () => import("./items/voice-button/demo"),
    () => import("./items/voice-button/inspector"),
    {
      preview: "VoiceButtonPreview",
      demo: "VoiceButtonDemo",
      inspector: "VoiceButtonInspector",
    },
    COMPONENT_GENERATORS["voice-button"],
  ),
  "approve-reject": buildClientEntry(
    () => import("./items/approve-reject/demo"),
    () => import("./items/approve-reject/inspector"),
    {
      preview: "ApproveRejectPreview",
      demo: "ApproveRejectDemo",
      inspector: "ApproveRejectInspector",
    },
    COMPONENT_GENERATORS["approve-reject"],
  ),
  "delete-button": buildClientEntry(
    () => import("./items/delete-button/demo"),
    () => import("./items/delete-button/inspector"),
    {
      preview: "DeleteButtonPreview",
      demo: "DeleteButtonDemo",
      inspector: "DeleteButtonInspector",
    },
    COMPONENT_GENERATORS["delete-button"],
  ),
  "expandable-tabs": buildClientEntry(
    () => import("./items/expandable-tabs/demo"),
    () => import("./items/expandable-tabs/inspector"),
    {
      preview: "ExpandableTabsPreview",
      demo: "ExpandableTabsDemo",
      inspector: "ExpandableTabsInspector",
    },
    COMPONENT_GENERATORS["expandable-tabs"],
  ),
  "segmented-control": buildClientEntry(
    () => import("./items/segmented-control/demo"),
    () => import("./items/segmented-control/inspector"),
    {
      preview: "SegmentedControlPreview",
      demo: "SegmentedControlDemo",
      inspector: "SegmentedControlInspector",
    },
    COMPONENT_GENERATORS["segmented-control"],
  ),
  "select-menu": buildClientEntry(
    () => import("./items/select-menu/demo"),
    () => import("./items/select-menu/inspector"),
    {
      preview: "SelectMenuPreview",
      demo: "SelectMenuDemo",
      inspector: "SelectMenuInspector",
    },
    COMPONENT_GENERATORS["select-menu"],
  ),
  "meeting-scheduler": buildClientEntry(
    () => import("./items/meeting-scheduler/demo"),
    () => import("./items/meeting-scheduler/inspector"),
    {
      preview: "MeetingSchedulerPreview",
      demo: "MeetingSchedulerDemo",
      inspector: "MeetingSchedulerInspector",
    },
    COMPONENT_GENERATORS["meeting-scheduler"],
  ),
  "status-pill": buildClientEntry(
    () => import("./items/status-pill/demo"),
    () => import("./items/status-pill/inspector"),
    {
      preview: "StatusPillPreview",
      demo: "StatusPillDemo",
      inspector: "StatusPillInspector",
    },
    COMPONENT_GENERATORS["status-pill"],
  ),
  "step-player": buildClientEntry(
    () => import("./items/step-player/demo"),
    () => import("./items/step-player/inspector"),
    {
      preview: "StepPlayerPreview",
      demo: "StepPlayerDemo",
      inspector: "StepPlayerInspector",
    },
    COMPONENT_GENERATORS["step-player"],
  ),
  "heat-map": buildClientEntry(
    () => import("./items/heat-map/demo"),
    () => import("./items/heat-map/inspector"),
    {
      preview: "HeatMapPreview",
      demo: "HeatMapDemo",
      inspector: "HeatMapInspector",
    },
    COMPONENT_GENERATORS["heat-map"],
  ),
  "voice-assistant-card": buildClientEntry(
    () => import("./items/voice-assistant-card/demo"),
    () => import("./items/voice-assistant-card/inspector"),
    {
      preview: "VoiceAssistantCardPreview",
      demo: "VoiceAssistantCardDemo",
      inspector: "VoiceAssistantCardInspector",
    },
    COMPONENT_GENERATORS["voice-assistant-card"],
  ),
  "distortion-waves": buildClientEntry(
    () => import("./items/distortion-waves/demo"),
    () => import("./items/distortion-waves/inspector"),
    {
      preview: "DistortionWavesPreview",
      demo: "DistortionWavesDemo",
      inspector: "DistortionWavesInspector",
    },
    COMPONENT_GENERATORS["distortion-waves"],
  ),
};

const preloadedSlugs = new Set<string>();

export function getComponentClient(
  slug: string,
  options?: { preferResolved?: boolean },
): ComponentClientEntry<Record<string, unknown>> | undefined {
  const entry = COMPONENT_CLIENT_REGISTRY[slug];
  if (!entry) return undefined;
  // Keep SSR and client hydration fiber trees identical by returning the
  // stable `next/dynamic` wrapper unless the caller is strictly client-only
  // (e.g. the interactive detail overlay).
  if (!options?.preferResolved) return entry;
  const resolved = resolvedRegistryEntries.get(entry);
  if (!resolved) return entry;
  return {
    ...entry,
    Preview: resolved.Preview ?? entry.Preview,
    Demo: resolved.Demo ?? entry.Demo,
    Inspector: resolved.Inspector ?? entry.Inspector,
  };
}

export function preloadComponentClient(slug: string): void {
  if (preloadedSlugs.has(slug)) return;
  const entry = COMPONENT_CLIENT_REGISTRY[slug];
  if (!entry?.preload) return;
  preloadedSlugs.add(slug);
  void entry.preload().catch(() => {
    preloadedSlugs.delete(slug);
  });
}
