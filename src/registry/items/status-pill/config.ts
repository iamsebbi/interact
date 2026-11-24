import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type {
  StatusPillDemoMode,
  StatusPillSize,
  StatusPillTheme,
} from "./status-pill";

export interface StatusPillConfig {
  idleLabel: string;
  doneLabel: string;
  failLabel: string;
  retryLabel: string;
  demoFiles: number;
  demoMode: StatusPillDemoMode;
  size: StatusPillSize;
  theme: StatusPillTheme;
  showTray: boolean;
}

export const DEFAULT_STATUS_PILL_CONFIG: StatusPillConfig = {
  idleLabel: "Up to date",
  doneLabel: "Synced",
  failLabel: "Sync failed",
  retryLabel: "Retry",
  demoFiles: 4,
  demoMode: "alternate",
  size: "md",
  theme: "light",
  showTray: true,
};

export const STATUS_PILL_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small (36px)" },
  { value: "md", label: "Medium (44px)" },
  { value: "lg", label: "Large (50px)" },
  { value: "xl", label: "Extra Large (54px)" },
];

export const STATUS_PILL_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const STATUS_PILL_DEMO_OPTIONS: readonly SelectFieldOption[] = [
  { value: "alternate", label: "Every other fails" },
  { value: "succeed", label: "Always works" },
  { value: "fail", label: "Always fails" },
];

export function buildStatusPillJsx(config: StatusPillConfig): string {
  const esc = (s: string) => s.replace(/"/g, '\\"');
  const lines = [
    `import { StatusPill } from "@/components/ui/status-pill";`,
    ``,
    `<StatusPill`,
  ];

  if (config.idleLabel !== DEFAULT_STATUS_PILL_CONFIG.idleLabel) {
    lines.push(`  idleLabel="${esc(config.idleLabel || "Up to date")}"`);
  }
  if (config.doneLabel !== DEFAULT_STATUS_PILL_CONFIG.doneLabel) {
    lines.push(`  doneLabel="${esc(config.doneLabel || "Synced")}"`);
  }
  if (config.failLabel !== DEFAULT_STATUS_PILL_CONFIG.failLabel) {
    lines.push(`  failLabel="${esc(config.failLabel || "Sync failed")}"`);
  }
  if (config.retryLabel !== DEFAULT_STATUS_PILL_CONFIG.retryLabel) {
    lines.push(`  retryLabel="${esc(config.retryLabel || "Retry")}"`);
  }
  if (config.demoFiles !== DEFAULT_STATUS_PILL_CONFIG.demoFiles) {
    lines.push(`  demoFiles={${config.demoFiles}}`);
  }
  if (config.demoMode !== DEFAULT_STATUS_PILL_CONFIG.demoMode) {
    lines.push(`  demoMode="${config.demoMode}"`);
  }
  if (config.size !== DEFAULT_STATUS_PILL_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  if (config.theme !== DEFAULT_STATUS_PILL_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  if (!config.showTray) {
    lines.push(`  showTray={false}`);
  }

  if (lines.length === 3) {
    return `import { StatusPill } from "@/components/ui/status-pill";\n\n<StatusPill />`;
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildStatusPillAiPrompt(
  config: StatusPillConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/status-pill.json",
): string {
  return [
    "Implement the Status Pill component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: react, motion, clsx, tailwind-merge",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildStatusPillJsx(config),
    "```",
  ].join("\n");
}

export const statusPillGenerators: ComponentGenerators<StatusPillConfig> = {
  buildJsx: buildStatusPillJsx,
  buildAiPrompt: buildStatusPillAiPrompt,
};
