import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { DeleteButtonSize, DeleteButtonTheme } from "./delete-button";

export type DeleteButtonStudioTheme = DeleteButtonTheme;

export interface DeleteButtonConfig {
  confirmLabel: string;
  cancelLabel: string;
  deletedLabel: string;
  deletedDurationSec: number;
  size: DeleteButtonSize;
  theme: DeleteButtonStudioTheme;
  showTray: boolean;
}

export const DEFAULT_DELETE_BUTTON_CONFIG: DeleteButtonConfig = {
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  deletedLabel: "Deleted",
  deletedDurationSec: 1.4,
  size: "xl",
  theme: "light",
  showTray: true,
};

export const DELETE_BUTTON_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small (36px)" },
  { value: "md", label: "Medium (44px)" },
  { value: "lg", label: "Large (48px)" },
  { value: "xl", label: "Extra Large (54px)" },
];

export const DELETE_BUTTON_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function buildDeleteButtonJsx(config: DeleteButtonConfig): string {
  const confirmLabel =
    config.confirmLabel || DEFAULT_DELETE_BUTTON_CONFIG.confirmLabel;
  const cancelLabel =
    config.cancelLabel || DEFAULT_DELETE_BUTTON_CONFIG.cancelLabel;
  const deletedLabel =
    config.deletedLabel || DEFAULT_DELETE_BUTTON_CONFIG.deletedLabel;

  const lines = [
    `import { DeleteButton } from "@/components/ui/delete-button";`,
    ``,
    `<DeleteButton`,
  ];
  if (confirmLabel !== DEFAULT_DELETE_BUTTON_CONFIG.confirmLabel) {
    lines.push(`  confirmLabel="${confirmLabel.replace(/"/g, '\\"')}"`);
  }
  if (cancelLabel !== DEFAULT_DELETE_BUTTON_CONFIG.cancelLabel) {
    lines.push(`  cancelLabel="${cancelLabel.replace(/"/g, '\\"')}"`);
  }
  if (deletedLabel !== DEFAULT_DELETE_BUTTON_CONFIG.deletedLabel) {
    lines.push(`  deletedLabel="${deletedLabel.replace(/"/g, '\\"')}"`);
  }
  if (
    config.deletedDurationSec !==
    DEFAULT_DELETE_BUTTON_CONFIG.deletedDurationSec
  ) {
    lines.push(
      `  deletedDurationMs={${Math.round(config.deletedDurationSec * 1000)}}`,
    );
  }
  if (config.size !== DEFAULT_DELETE_BUTTON_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  if (config.theme !== DEFAULT_DELETE_BUTTON_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  if (!config.showTray) {
    lines.push(`  showTray={false}`);
  }
  lines.push(`  onConfirm={() => console.log("Confirmed delete")}`);
  lines.push(`  onCancel={() => console.log("Cancelled delete")}`);
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildDeleteButtonAiPrompt(
  config: DeleteButtonConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/delete-button.json",
): string {
  return [
    "Implement the Delete Button component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, motion, @animate-ui/react",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildDeleteButtonJsx(config),
    "```",
  ].join("\n");
}

export const deleteButtonGenerators: ComponentGenerators<DeleteButtonConfig> = {
  buildJsx: buildDeleteButtonJsx,
  buildAiPrompt: buildDeleteButtonAiPrompt,
};
