import type { ComponentType } from "react";

export const INTERACTION_CATEGORIES = [
  "Actions",
  "Inputs",
  "Selection",
  "Feedback",
  "Flows",
  "Effects",
] as const;

export type InteractionCategory = (typeof INTERACTION_CATEGORIES)[number];

export type StudioSceneBg = "dots" | "dark" | "light";

export interface ComponentPropDoc {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface ComponentHowItWorksStep {
  title: string;
  description: string;
}

export interface ComponentPreviewProps {
  className?: string;
  replaySignal?: number;
  previewActive?: boolean;
}

export interface ComponentDemoProps<TConfig = Record<string, unknown>> {
  config: TConfig;
  onConfigChange: (next: TConfig) => void;
  playKey?: number;
}

export interface ComponentInspectorProps<TConfig = Record<string, unknown>> {
  config: TConfig;
  onChange: (next: TConfig) => void;
}

/**
 * 100% JSON-serializable metadata for a registry item.
 * Safe to import in Server Components, metadata routes, and Node scripts
 * (zero React components, zero functions, zero CSS imports).
 */
export interface ComponentMeta<TConfig = Record<string, unknown>> {
  slug: string;
  title: string;
  shortTitle?: string;
  tagline: string;
  description: string;
  categories: readonly InteractionCategory[];
  masonryHeight: number;
  cardHeightClass: string;
  gridScale?: number;
  previewBounds?: { width: number; height: number };
  dependencies: readonly string[];
  sourceFiles: readonly string[];
  defaultConfig: TConfig;
  props: readonly ComponentPropDoc[];
  howItWorks: readonly ComponentHowItWorksStep[];
  hiddenOnHome?: boolean;
  isPro?: boolean;
}

/** Pure TypeScript code/prompt generators (no React or CSS imports). */
export interface ComponentGenerators<TConfig = Record<string, unknown>> {
  buildJsx: (config: TConfig) => string;
  buildAiPrompt: (config: TConfig) => string;
}

/** Client-only lazy components + generators resolved by slug on the client. */
export interface ComponentClientEntry<TConfig = Record<string, unknown>>
  extends ComponentGenerators<TConfig> {
  Preview: ComponentType<ComponentPreviewProps>;
  Demo: ComponentType<ComponentDemoProps<TConfig>>;
  Inspector: ComponentType<ComponentInspectorProps<TConfig>>;
  preload?: () => Promise<void>;
}
