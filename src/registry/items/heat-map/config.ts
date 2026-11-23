import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { HeatMapColors, HeatMapShape } from "./heat-map";

export interface HeatMapConfig {
  shape: HeatMapShape;
  colors: HeatMapColors;
  heat: number;
  soft: number;
  area: number;
}

export const HEAT_MAP_SHAPE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "Dots", label: "Dots" },
  { value: "Asterisk", label: "Asterisk" },
  { value: "Word", label: "Word" },
  { value: "Rosette", label: "Rosette" },
  { value: "Rings", label: "Rings" },
  { value: "Clover", label: "Clover" },
];

export const HEAT_MAP_COLOR_OPTIONS: readonly SelectFieldOption[] = [
  { value: "Neon", label: "Neon", swatch: "#ff5abe" },
  { value: "Fire", label: "Fire", swatch: "#ff821e" },
  { value: "Sea", label: "Sea", swatch: "#28d7c8" },
  { value: "Pop", label: "Pop", swatch: "#b46eff" },
];

export const DEFAULT_HEAT_MAP_CONFIG: HeatMapConfig = {
  shape: "Clover",
  colors: "Neon",
  heat: 60,
  soft: 50,
  area: 50,
};

export function buildHeatMapJsx(config: HeatMapConfig): string {
  const lines = [
    `import { HeatMap } from "@/components/ui/heat-map";`,
    ``,
    `<HeatMap`,
  ];
  if (config.shape !== DEFAULT_HEAT_MAP_CONFIG.shape) {
    lines.push(`  shape="${config.shape}"`);
  }
  if (config.colors !== DEFAULT_HEAT_MAP_CONFIG.colors) {
    lines.push(`  colors="${config.colors}"`);
  }
  if (config.heat !== DEFAULT_HEAT_MAP_CONFIG.heat) {
    lines.push(`  heat={${config.heat}}`);
  }
  if (config.soft !== DEFAULT_HEAT_MAP_CONFIG.soft) {
    lines.push(`  soft={${config.soft}}`);
  }
  if (config.area !== DEFAULT_HEAT_MAP_CONFIG.area) {
    lines.push(`  area={${config.area}}`);
  }
  if (lines.length === 3) {
    return `import { HeatMap } from "@/components/ui/heat-map";\n\n<HeatMap />`;
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildHeatMapAiPrompt(
  config: HeatMapConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/heat-map.json",
): string {
  return [
    "Implement the Heat Map component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: react",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildHeatMapJsx(config),
    "```",
  ].join("\n");
}

export const heatMapGenerators: ComponentGenerators<HeatMapConfig> = {
  buildJsx: buildHeatMapJsx,
  buildAiPrompt: buildHeatMapAiPrompt,
};
