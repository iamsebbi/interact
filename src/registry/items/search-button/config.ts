import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { SearchButtonSize, SearchButtonTheme } from "./search-button";

export interface SearchButtonConfig {
  size: SearchButtonSize;
  theme: SearchButtonTheme;
  expandedWidth: number;
  placeholder: string;
  magneticStrength: number;
}

export const DEFAULT_SEARCH_BUTTON_CONFIG: SearchButtonConfig = {
  size: "xl",
  theme: "light",
  expandedWidth: 320,
  placeholder: "Search...",
  magneticStrength: 4,
};

export const SEARCH_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

export const SEARCH_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function buildSearchButtonJsx(config: SearchButtonConfig): string {
  const lines = [
    `import { SearchButton } from "@/components/ui/search-button";`,
    ``,
    `<SearchButton`,
  ];
  if (config.size !== DEFAULT_SEARCH_BUTTON_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  if (config.theme !== DEFAULT_SEARCH_BUTTON_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  if (config.expandedWidth !== DEFAULT_SEARCH_BUTTON_CONFIG.expandedWidth) {
    lines.push(`  expandedWidth={${config.expandedWidth}}`);
  }
  if (config.placeholder !== DEFAULT_SEARCH_BUTTON_CONFIG.placeholder) {
    lines.push(`  placeholder="${config.placeholder.replace(/"/g, '\\"')}"`);
  }
  if (config.magneticStrength <= 0) {
    lines.push(`  magnetic={false}`);
  } else if (
    config.magneticStrength !== DEFAULT_SEARCH_BUTTON_CONFIG.magneticStrength
  ) {
    lines.push(`  magneticStrength={${config.magneticStrength}}`);
  }
  lines.push(`  onSearch={(query) => console.log("Search:", query)}`);
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildSearchButtonAiPrompt(
  config: SearchButtonConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/search-button.json",
): string {
  return [
    "Implement the Search Button component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, motion, @animate-ui/react",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildSearchButtonJsx(config),
    "```",
  ].join("\n");
}

export const searchButtonGenerators: ComponentGenerators<SearchButtonConfig> = {
  buildJsx: buildSearchButtonJsx,
  buildAiPrompt: buildSearchButtonAiPrompt,
};
