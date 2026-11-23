import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { StepPlayerSize } from "./step-player";

export const MIN_STEPS = 3;
export const MAX_STEPS = 8;

export interface StepPlayerConfig {
  size: StepPlayerSize;
  steps: number;
  pace: number;
  wake: number;
}

export const DEFAULT_STEP_PLAYER_CONFIG: StepPlayerConfig = {
  size: "xl",
  steps: 5,
  pace: 3,
  wake: 100,
};

export const STEP_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

export function buildStepPlayerJsx(config: StepPlayerConfig): string {
  const lines = [
    `import { StepPlayer } from "@/components/ui/step-player";`,
    ``,
    `<StepPlayer`,
  ];
  if (config.size !== "md") {
    lines.push(`  size="${config.size}"`);
  }
  if (config.steps !== DEFAULT_STEP_PLAYER_CONFIG.steps) {
    lines.push(`  steps={${config.steps}}`);
  }
  if (config.pace !== DEFAULT_STEP_PLAYER_CONFIG.pace) {
    lines.push(`  pace={${config.pace}}`);
  }
  if (config.wake !== DEFAULT_STEP_PLAYER_CONFIG.wake) {
    lines.push(`  wake={${config.wake}}`);
  }
  if (lines.length === 3) {
    return `import { StepPlayer } from "@/components/ui/step-player";\n\n<StepPlayer />`;
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildStepPlayerAiPrompt(
  config: StepPlayerConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/step-player.json",
): string {
  return [
    "Implement the Step Player component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: react",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildStepPlayerJsx(config),
    "```",
  ].join("\n");
}

export const stepPlayerGenerators: ComponentGenerators<StepPlayerConfig> = {
  buildJsx: buildStepPlayerJsx,
  buildAiPrompt: buildStepPlayerAiPrompt,
};
