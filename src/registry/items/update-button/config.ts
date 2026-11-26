import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { UpdateButtonSize, UpdateButtonTheme } from "./update-button";

export interface UpdateButtonConfig {
  label: string;
  updatingLabel: string;
  completedLabel: string;
  showPercentage: boolean;
  durationSec: number;
  autoReset: boolean;
  size: UpdateButtonSize;
  theme: UpdateButtonTheme;
}

export const DEFAULT_UPDATE_BUTTON_CONFIG: UpdateButtonConfig = {
  label: "Update",
  updatingLabel: "Updating",
  completedLabel: "Updated",
  showPercentage: false,
  durationSec: 2.8,
  autoReset: true,
  size: "xl",
  theme: "light",
};

export const UPDATE_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small (36px)" },
  { value: "md", label: "Medium (44px)" },
  { value: "lg", label: "Large (48px)" },
  { value: "xl", label: "Extra Large (54px)" },
];

export const UPDATE_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

export function buildUpdateButtonJsx(config: UpdateButtonConfig): string {
  const label = config.label || DEFAULT_UPDATE_BUTTON_CONFIG.label;
  const updatingLabel =
    config.updatingLabel || DEFAULT_UPDATE_BUTTON_CONFIG.updatingLabel;
  const completedLabel =
    config.completedLabel || DEFAULT_UPDATE_BUTTON_CONFIG.completedLabel;

  const lines = [
    `import { UpdateButton } from "@/components/ui/update-button";`,
    ``,
    `<UpdateButton`,
  ];
  if (label !== DEFAULT_UPDATE_BUTTON_CONFIG.label) {
    lines.push(`  label="${label.replace(/"/g, '\\"')}"`);
  }
  if (updatingLabel !== DEFAULT_UPDATE_BUTTON_CONFIG.updatingLabel) {
    lines.push(`  updatingLabel="${updatingLabel.replace(/"/g, '\\"')}"`);
  }
  if (completedLabel !== DEFAULT_UPDATE_BUTTON_CONFIG.completedLabel) {
    lines.push(`  completedLabel="${completedLabel.replace(/"/g, '\\"')}"`);
  }
  if (config.showPercentage) {
    lines.push(`  showPercentage`);
  }
  if (config.durationSec !== DEFAULT_UPDATE_BUTTON_CONFIG.durationSec) {
    lines.push(`  durationMs={${Math.round(config.durationSec * 1000)}}`);
  }
  if (!config.autoReset) {
    lines.push(`  autoReset={false}`);
  }
  if (config.size !== DEFAULT_UPDATE_BUTTON_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  if (config.theme !== DEFAULT_UPDATE_BUTTON_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  lines.push(`  onComplete={() => console.log("Update complete")}`);
  lines.push(`  onCancel={() => console.log("Update cancelled")}`);
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildUpdateButtonAiPrompt(
  config: UpdateButtonConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/update-button.json",
): string {
  return [
    "Implement the Update Button component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, motion, @animate-ui/react",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildUpdateButtonJsx(config),
    "```",
  ].join("\n");
}

export const updateButtonGenerators: ComponentGenerators<UpdateButtonConfig> = {
  buildJsx: buildUpdateButtonJsx,
  buildAiPrompt: buildUpdateButtonAiPrompt,
};
