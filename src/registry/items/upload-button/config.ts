import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";

export interface UploadButtonConfig {
  durationSec: number;
  simulateFailure: boolean;
  anchored: boolean;
  size: "sm" | "md" | "lg" | "xl";
}

export const DEFAULT_UPLOAD_BUTTON_CONFIG: UploadButtonConfig = {
  durationSec: 3.2,
  simulateFailure: true,
  anchored: false,
  size: "xl",
};

export const UPLOAD_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small (36px)" },
  { value: "md", label: "Medium (44px)" },
  { value: "lg", label: "Large (48px)" },
  { value: "xl", label: "Extra Large (54px)" },
];

export function buildUploadButtonJsx(config: UploadButtonConfig): string {
  const lines = [
    `import { UploadButton } from "@/components/ui/upload-button";`,
    ``,
    `<UploadButton`,
  ];
  if (config.durationSec !== DEFAULT_UPLOAD_BUTTON_CONFIG.durationSec) {
    lines.push(`  durationMs={${Math.round(config.durationSec * 1000)}}`);
  }
  if (config.simulateFailure !== DEFAULT_UPLOAD_BUTTON_CONFIG.simulateFailure) {
    lines.push(`  simulateFailure={${config.simulateFailure}}`);
  }
  if (!config.anchored) {
    lines.push(`  anchored={false}`);
  }
  if (config.size !== DEFAULT_UPLOAD_BUTTON_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  lines.push(`  onCopyLink={() => console.log("Share link copied")}`);
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildUploadButtonAiPrompt(
  config: UploadButtonConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/upload-button.json",
): string {
  return [
    "Implement the Upload Button component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, motion, @animate-ui/react",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildUploadButtonJsx(config),
    "```",
  ].join("\n");
}

export const uploadButtonGenerators: ComponentGenerators<UploadButtonConfig> = {
  buildJsx: buildUploadButtonJsx,
  buildAiPrompt: buildUploadButtonAiPrompt,
};
