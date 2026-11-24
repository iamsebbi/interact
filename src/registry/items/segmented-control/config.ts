import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type {
  SegmentedControlSize,
  SegmentedControlTheme,
} from "./segmented-control";

export interface SegmentedControlConfig {
  options: string;
  size: SegmentedControlSize;
  theme: SegmentedControlTheme;
  stretch: number;
  bounce: number;
  speed: number;
  showTray: boolean;
}

export const DEFAULT_SEGMENTED_CONTROL_CONFIG: SegmentedControlConfig = {
  options: "Day, Week, Month, Year",
  size: "xl",
  theme: "light",
  stretch: 1,
  bounce: 1,
  speed: 1,
  showTray: true,
};

export const SEGMENTED_CONTROL_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small (36px)" },
  { value: "md", label: "Medium (44px)" },
  { value: "lg", label: "Large (50px)" },
  { value: "xl", label: "Extra Large (56px)" },
];

export const SEGMENTED_CONTROL_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const FALLBACK_OPTIONS = ["Day", "Week", "Month", "Year"] as const;

export function parseSegmentedControlOptions(raw: string): string[] {
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

export function buildSegmentedControlJsx(
  config: SegmentedControlConfig,
): string {
  const items = parseSegmentedControlOptions(config.options);
  const serializedItems = items
    .map((label) => `"${label.replace(/"/g, '\\"')}"`)
    .join(", ");

  const lines = [
    `import { SegmentedControl } from "@/components/ui/segmented-control";`,
    ``,
    `<SegmentedControl`,
    `  items={[${serializedItems}]}`,
    `  defaultValue="${(items[1] ?? items[0]).replace(/"/g, '\\"')}"`,
  ];

  if (config.size !== DEFAULT_SEGMENTED_CONTROL_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  if (config.theme !== DEFAULT_SEGMENTED_CONTROL_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  if (config.stretch !== DEFAULT_SEGMENTED_CONTROL_CONFIG.stretch) {
    lines.push(`  stretch={${Number(config.stretch.toFixed(2))}}`);
  }
  if (config.bounce !== DEFAULT_SEGMENTED_CONTROL_CONFIG.bounce) {
    lines.push(`  bounce={${Number(config.bounce.toFixed(2))}}`);
  }
  if (config.speed !== DEFAULT_SEGMENTED_CONTROL_CONFIG.speed) {
    lines.push(`  speed={${Number(config.speed.toFixed(2))}}`);
  }
  if (!config.showTray) {
    lines.push(`  showTray={false}`);
  }
  lines.push(`  aria-label="Time range"`);
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildSegmentedControlAiPrompt(
  config: SegmentedControlConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/segmented-control.json",
): string {
  return [
    "Implement the Segmented Control component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, motion",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildSegmentedControlJsx(config),
    "```",
  ].join("\n");
}

export const segmentedControlGenerators: ComponentGenerators<SegmentedControlConfig> =
  {
    buildJsx: buildSegmentedControlJsx,
    buildAiPrompt: buildSegmentedControlAiPrompt,
  };
