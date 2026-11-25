import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { SelectMenuSize, SelectMenuTheme } from "./select-menu";

export interface SelectMenuConfig {
  label: string;
  options: string;
  size: SelectMenuSize;
  theme: SelectMenuTheme;
  bounce: number;
  speed: number;
  blur: number;
  showTray: boolean;
}

export const DEFAULT_SELECT_MENU_CONFIG: SelectMenuConfig = {
  label: "Sort",
  options:
    "Newest, Most popular, Price: low to high, Price: high to low, Top rated",
  size: "md",
  theme: "light",
  bounce: 1,
  speed: 1,
  blur: 1,
  showTray: true,
};

export const SELECT_MENU_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small (36px)" },
  { value: "md", label: "Medium (44px)" },
  { value: "lg", label: "Large (50px)" },
  { value: "xl", label: "Extra Large (54px)" },
];

export const SELECT_MENU_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const FALLBACK_OPTIONS = [
  "Newest",
  "Most popular",
  "Price: low to high",
  "Price: high to low",
  "Top rated",
] as const;

export function parseSelectMenuOptions(raw: string): string[] {
  const seen = new Set<string>();
  const parsed: string[] = [];
  for (const part of raw.split(",")) {
    const label = part.trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    parsed.push(label);
  }
  return parsed.length >= 2 ? parsed : [...FALLBACK_OPTIONS];
}

export function buildSelectMenuJsx(config: SelectMenuConfig): string {
  const items = parseSelectMenuOptions(config.options);
  const esc = (s: string) => s.replace(/"/g, '\\"');
  const serializedItems = items.map((label) => `"${esc(label)}"`).join(", ");

  const lines = [
    `import { SelectMenu } from "@/components/ui/select-menu";`,
    ``,
    `<SelectMenu`,
  ];

  if (config.label !== DEFAULT_SELECT_MENU_CONFIG.label) {
    lines.push(`  label="${esc(config.label)}"`);
  }
  lines.push(`  items={[${serializedItems}]}`);
  lines.push(`  defaultValue="${esc(items[0])}"`);

  if (config.size !== DEFAULT_SELECT_MENU_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  if (config.theme !== DEFAULT_SELECT_MENU_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  if (config.bounce !== DEFAULT_SELECT_MENU_CONFIG.bounce) {
    lines.push(`  bounce={${Number(config.bounce.toFixed(2))}}`);
  }
  if (config.speed !== DEFAULT_SELECT_MENU_CONFIG.speed) {
    lines.push(`  speed={${Number(config.speed.toFixed(2))}}`);
  }
  if (config.blur !== DEFAULT_SELECT_MENU_CONFIG.blur) {
    lines.push(`  blur={${Number(config.blur.toFixed(2))}}`);
  }
  if (!config.showTray) {
    lines.push(`  showTray={false}`);
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildSelectMenuAiPrompt(
  config: SelectMenuConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/select-menu.json",
): string {
  return [
    "Implement the Select Menu component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, react, motion, clsx, tailwind-merge",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildSelectMenuJsx(config),
    "```",
  ].join("\n");
}

export const selectMenuGenerators: ComponentGenerators<SelectMenuConfig> = {
  buildJsx: buildSelectMenuJsx,
  buildAiPrompt: buildSelectMenuAiPrompt,
};
