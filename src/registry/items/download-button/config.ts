import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";

export interface DownloadButtonConfig {
  sizeMB: number;
  durationSec: number;
  progressFormat: "size" | "percent";
  size: "sm" | "md" | "lg" | "xl";
}

export const DEFAULT_DOWNLOAD_BUTTON_CONFIG: DownloadButtonConfig = {
  sizeMB: 32,
  durationSec: 3.2,
  progressFormat: "size",
  size: "xl",
};

export const DOWNLOAD_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

export const DOWNLOAD_READOUT_OPTIONS: readonly SelectFieldOption[] = [
  { value: "size", label: "Megabytes" },
  { value: "percent", label: "Percentage" },
];

export function buildDownloadButtonJsx(config: DownloadButtonConfig): string {
  const lines = [
    `import { DownloadButton } from "@/components/ui/download-button";`,
    ``,
    `<DownloadButton`,
    `  sizeMB={${config.sizeMB}}`,
  ];
  if (config.durationSec !== DEFAULT_DOWNLOAD_BUTTON_CONFIG.durationSec) {
    lines.push(`  durationMs={${Math.round(config.durationSec * 1000)}}`);
  }
  if (config.progressFormat !== DEFAULT_DOWNLOAD_BUTTON_CONFIG.progressFormat) {
    lines.push(`  progressFormat="${config.progressFormat}"`);
  }
  if (config.size !== DEFAULT_DOWNLOAD_BUTTON_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  lines.push(`  onOpen={() => console.log("Open downloaded file")}`);
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildDownloadButtonAiPrompt(
  config: DownloadButtonConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/download-button.json",
): string {
  return [
    "Implement the Download Button component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, motion, @animate-ui/react",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildDownloadButtonJsx(config),
    "```",
  ].join("\n");
}

export const downloadButtonGenerators: ComponentGenerators<DownloadButtonConfig> =
  {
    buildJsx: buildDownloadButtonJsx,
    buildAiPrompt: buildDownloadButtonAiPrompt,
  };
