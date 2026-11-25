import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { CodeInputSize, CodeInputTheme } from "./code-input";

export interface CodeInputConfig {
  length: number;
  label: string;
  busyLabel: string;
  doneLabel: string;
  testCode: string;
  size: CodeInputSize;
  theme: CodeInputTheme;
  bounce: number;
  speed: number;
  showTray: boolean;
}

export const DEFAULT_CODE_INPUT_CONFIG: CodeInputConfig = {
  length: 6,
  label: "Enter code",
  busyLabel: "Verifying",
  doneLabel: "Verified",
  testCode: "123456",
  size: "md",
  theme: "light",
  bounce: 1,
  speed: 1,
  showTray: true,
};

export const CODE_INPUT_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small (36px)" },
  { value: "md", label: "Medium (44px)" },
  { value: "lg", label: "Large (50px)" },
  { value: "xl", label: "Extra Large (54px)" },
];

export const CODE_INPUT_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function buildCodeInputJsx(config: CodeInputConfig): string {
  const esc = (s: string) => s.replace(/"/g, '\\"');
  const lines = [
    `import { CodeInput } from "@/components/ui/code-input";`,
    ``,
    `<CodeInput`,
  ];

  if (config.length !== DEFAULT_CODE_INPUT_CONFIG.length) {
    lines.push(`  length={${config.length}}`);
  }
  if (config.label !== DEFAULT_CODE_INPUT_CONFIG.label) {
    lines.push(`  label="${esc(config.label || "Enter code")}"`);
  }
  if (config.busyLabel !== DEFAULT_CODE_INPUT_CONFIG.busyLabel) {
    lines.push(`  busyLabel="${esc(config.busyLabel || "Verifying")}"`);
  }
  if (config.doneLabel !== DEFAULT_CODE_INPUT_CONFIG.doneLabel) {
    lines.push(`  doneLabel="${esc(config.doneLabel || "Verified")}"`);
  }
  if (config.testCode !== DEFAULT_CODE_INPUT_CONFIG.testCode) {
    lines.push(`  testCode="${esc(config.testCode || "123456")}"`);
  }
  if (config.size !== DEFAULT_CODE_INPUT_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  if (config.theme !== DEFAULT_CODE_INPUT_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  if (config.bounce !== DEFAULT_CODE_INPUT_CONFIG.bounce) {
    lines.push(`  bounce={${config.bounce}}`);
  }
  if (config.speed !== DEFAULT_CODE_INPUT_CONFIG.speed) {
    lines.push(`  speed={${config.speed}}`);
  }
  if (!config.showTray) {
    lines.push(`  showTray={false}`);
  }

  if (lines.length === 3) {
    return `import { CodeInput } from "@/components/ui/code-input";\n\n<CodeInput />`;
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildCodeInputAiPrompt(
  config: CodeInputConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/code-input.json",
): string {
  return [
    "Implement the Code Input component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, react, motion, clsx, tailwind-merge",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildCodeInputJsx(config),
    "```",
  ].join("\n");
}

export const codeInputGenerators: ComponentGenerators<CodeInputConfig> = {
  buildJsx: buildCodeInputJsx,
  buildAiPrompt: buildCodeInputAiPrompt,
};
