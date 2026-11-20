import {
  BOT_EYE_COLOR,
  DEFAULT_BOT_BODY_COLOR,
  DEFAULT_BOT_SHAPE,
} from "../bot-avatar";
import {
  DEFAULT_BOT_AVATAR_CONFIG,
  type BotAvatarConfig,
} from "../showcase/demos/BotAvatarDemo";
import {
  DEFAULT_COLOR_PICKER_CONFIG,
  buildColorPickerJsx,
  type ColorPickerConfig,
} from "../showcase/demos/ColorPickerDemo";
import {
  DEFAULT_PALETTE_CONFIG,
  buildPaletteJsx,
  type PaletteConfig,
} from "../showcase/demos/PaletteDemo";
import {
  DEFAULT_WAKE_SLIDER_CONFIG,
  buildWakeSliderJsx,
  type WakeSliderConfig,
} from "../showcase/demos/WakeSliderDemo";
import { DEFAULT_GLOBALS, DEFAULT_TILES } from "../../constants/defaults";
import { GlobalsConfig, TileConfig } from "../../types/gradient";
import { clone } from "../../utils/color";
import { generateReactSnippet } from "../../utils/exportCode";

export type StudioComponentId =
  | "bot-avatar"
  | "color-picker"
  | "palette"
  | "wake-slider"
  | "gradient";

export type StudioTier = "free" | "pro";
export type StudioSceneBg = "dots" | "dark" | "light";

export interface StudioBotConfig extends BotAvatarConfig {
  bodyColor: string;
  eyeColor: string;
  interactive: boolean;
  enableVibration: boolean;
}

export interface StudioGradientConfig {
  tile: TileConfig;
  globals: GlobalsConfig;
}

export interface StudioConfigMap {
  "bot-avatar": StudioBotConfig;
  "color-picker": ColorPickerConfig;
  palette: PaletteConfig;
  "wake-slider": WakeSliderConfig;
  gradient: StudioGradientConfig;
}

export interface StudioComponentMeta {
  id: StudioComponentId;
  title: string;
  shortTitle: string;
  tier: StudioTier;
  description: string;
  dependencies: string[];
  sourceFiles: string[];
}

export const STUDIO_COMPONENTS: readonly StudioComponentMeta[] = [
  {
    id: "bot-avatar",
    title: "Bot Avatar",
    shortTitle: "Bot Avatar",
    tier: "free",
    description:
      "Interactive 2.5D SVG avatar with 3D gaze tracking, organic blinking, 7 body shapes, and 10 expressions.",
    dependencies: ["react", "motion"],
    sourceFiles: [
      "src/components/bot-avatar/BotAvatar.tsx",
      "src/components/bot-avatar/botAvatarConfig.ts",
      "src/components/bot-avatar/index.ts",
    ],
  },
  {
    id: "color-picker",
    title: "Color Picker",
    shortTitle: "Color Picker",
    tier: "free",
    description:
      "Interactive HSVA color picker with spring-physics loupe, HEX/RGB/HSL channels, alpha slider, and eyedropper.",
    dependencies: ["react", "motion", "@animate-ui/react"],
    sourceFiles: [
      "src/components/ui/color-picker.tsx",
      "src/components/ui/color-picker-utils/*",
    ],
  },
  {
    id: "palette",
    title: "OKLCH Palette",
    shortTitle: "Palette",
    tier: "free",
    description:
      "Perceptually uniform OKLCH color ramp generator with elastic SVG goo morph transitions.",
    dependencies: ["react", "motion", "@animate-ui/react"],
    sourceFiles: [
      "src/components/palette/Palette.tsx",
      "src/components/palette/Palette.css",
    ],
  },
  {
    id: "wake-slider",
    title: "Wake Slider",
    shortTitle: "Wake Slider",
    tier: "free",
    description:
      "Kinetic bar-track range slider with velocity-driven wave wake and NumberFlow numeric readout.",
    dependencies: ["react", "@number-flow/react"],
    sourceFiles: [
      "src/components/ui/wake-slider.tsx",
      "src/components/ui/wake-slider.css",
    ],
  },
  {
    id: "gradient",
    title: "Squircle Gradient",
    shortTitle: "Gradient",
    tier: "free",
    description:
      "Layered SVG & CSS squircle gradient tile with organic blob shapes, echo trails, rim lighting, film grain, and border beams.",
    dependencies: ["react", "border-beam", "motion", "@animate-ui/react"],
    sourceFiles: [
      "src/components/GradientTile.tsx",
      "src/constants/shapes.ts",
      "src/types/gradient.ts",
    ],
  },
];

export const DEFAULT_STUDIO_BOT_CONFIG: StudioBotConfig = {
  ...DEFAULT_BOT_AVATAR_CONFIG,
  shape: DEFAULT_BOT_SHAPE,
  bodyColor: DEFAULT_BOT_BODY_COLOR,
  eyeColor: BOT_EYE_COLOR,
  interactive: true,
  enableVibration: true,
};

export function getDefaultStudioConfig<K extends StudioComponentId>(
  id: K
): StudioConfigMap[K] {
  switch (id) {
    case "bot-avatar":
      return clone(DEFAULT_STUDIO_BOT_CONFIG) as StudioConfigMap[K];
    case "color-picker":
      return clone(DEFAULT_COLOR_PICKER_CONFIG) as StudioConfigMap[K];
    case "palette":
      return clone(DEFAULT_PALETTE_CONFIG) as StudioConfigMap[K];
    case "wake-slider":
      return clone(DEFAULT_WAKE_SLIDER_CONFIG) as StudioConfigMap[K];
    case "gradient":
      return {
        tile: clone(DEFAULT_TILES[0]),
        globals: clone(DEFAULT_GLOBALS),
      } as StudioConfigMap[K];
  }
}

export function buildStudioBotJsx(config: StudioBotConfig): string {
  const lines = [
    `import { BotAvatar } from "@/components/bot-avatar";`,
    ``,
    `<BotAvatar`,
    `  shape="${config.shape}"`,
    `  expression="${config.expression}"`,
    `  size={${config.size}}`,
  ];
  if (config.bodyColor.toUpperCase() !== DEFAULT_BOT_BODY_COLOR.toUpperCase()) {
    lines.push(`  bodyColor="${config.bodyColor}"`);
  }
  if (config.eyeColor.toUpperCase() !== BOT_EYE_COLOR.toUpperCase()) {
    lines.push(`  eyeColor="${config.eyeColor}"`);
  }
  if (!config.trackGaze) {
    lines.push(`  trackGaze={false}`);
  }
  if (!config.interactive) {
    lines.push(`  interactive={false}`);
  }
  if (!config.enableVibration) {
    lines.push(`  enableVibration={false}`);
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildStudioJsx<K extends StudioComponentId>(
  id: K,
  config: StudioConfigMap[K]
): string {
  switch (id) {
    case "bot-avatar":
      return buildStudioBotJsx(config as StudioBotConfig);
    case "color-picker":
      return buildColorPickerJsx(config as ColorPickerConfig);
    case "palette":
      return buildPaletteJsx(config as PaletteConfig);
    case "wake-slider":
      return buildWakeSliderJsx(config as WakeSliderConfig);
    case "gradient": {
      const grad = config as StudioGradientConfig;
      return generateReactSnippet(grad.tile, grad.globals);
    }
  }
}

export const REGISTRY_BASE_URL = "https://interact.dev/r";

export function getRegistryCliCommand(id: StudioComponentId): string {
  return `npx shadcn@latest add ${REGISTRY_BASE_URL}/${id}.json`;
}

export function buildStudioAiPrompt<K extends StudioComponentId>(
  id: K,
  config: StudioConfigMap[K]
): string {
  const meta = STUDIO_COMPONENTS.find((c) => c.id === id)!;
  const jsx = buildStudioJsx(id, config);
  const cliCommand = getRegistryCliCommand(id);
  const deps = meta.dependencies.filter((d) => d !== "react");
  const installLine =
    deps.length > 0 ? `Dependencies: ${deps.join(", ")}\n` : "";

  return [
    `Implement the ${meta.title} component from interact.dev in React + TypeScript.`,
    `Install via shadcn CLI: ${cliCommand}`,
    installLine.trim(),
    ``,
    `Render it with this exact configuration:`,
    `\`\`\`tsx`,
    jsx,
    `\`\`\``,
  ]
    .filter(Boolean)
    .join("\n");
}
