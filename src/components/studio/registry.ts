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

export const REGISTRY_FALLBACK_URL =
  "https://raw.githubusercontent.com/iamsebbi/interact/main/public/r";

export function getRegistryBaseUrl(): string {
  const configured = import.meta.env?.VITE_REGISTRY_URL?.replace(/\/+$/, "");
  if (configured) return configured;

  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `${origin}/r`;
    }
  }

  return REGISTRY_FALLBACK_URL;
}

export const REGISTRY_BASE_URL = getRegistryBaseUrl();

export function getRegistryCliCommand(id: StudioComponentId): string {
  return `npx shadcn@latest add ${getRegistryBaseUrl()}/${id}.json`;
}

export interface ComponentPropDoc {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export const STUDIO_COMPONENT_PROPS: Record<
  StudioComponentId,
  readonly ComponentPropDoc[]
> = {
  "bot-avatar": [
    {
      name: "shape",
      type: '"squircle" | "cloud" | "drop" | "triangle" | "cube" | "berry" | "circle"',
      defaultValue: '"squircle"',
      description: "Body silhouette and 3D facial projection surface profile.",
    },
    {
      name: "expression",
      type: '"idle" | "happy" | "excited" | "wink" | "focused" | "confused" | "surprised" | "angry" | "sleepy" | "loading"',
      defaultValue: '"idle"',
      description: "Active eye geometry and idle/reactive body animation state.",
    },
    {
      name: "size",
      type: "number",
      defaultValue: "180",
      description: "Rendered SVG width and height in pixels.",
    },
    {
      name: "bodyColor",
      type: "string",
      defaultValue: '"#222428"',
      description: "Primary body fill color (hex or CSS color).",
    },
    {
      name: "eyeColor",
      type: "string",
      defaultValue: '"#FFFFFF"',
      description: "Eye and facial detail stroke/fill color.",
    },
    {
      name: "trackGaze",
      type: "boolean",
      defaultValue: "true",
      description: "Enables proximity pointer/cursor 3D eye & head tracking.",
    },
    {
      name: "interactive",
      type: "boolean",
      defaultValue: "true",
      description: "Enables tap bounce, long-press pet, poke annoyance, and wake reactions.",
    },
    {
      name: "enableVibration",
      type: "boolean",
      defaultValue: "true",
      description: "Triggers navigator.vibrate haptic feedback on supported devices.",
    },
  ],
  "color-picker": [
    {
      name: "value",
      type: "string",
      defaultValue: "undefined",
      description: "Controlled hex color (#rgb, #rrggbb, or #rrggbbaa).",
    },
    {
      name: "defaultValue",
      type: "string",
      defaultValue: '"#3478f6"',
      description: "Initial uncontrolled hex color.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      defaultValue: "undefined",
      description: "Fires continuously while dragging or typing a valid hex color.",
    },
    {
      name: "onValueCommit",
      type: "(value: string) => void",
      defaultValue: "undefined",
      description: "Fires once an interaction settles (pointer release, preset, commit).",
    },
    {
      name: "alpha",
      type: "boolean",
      defaultValue: "true",
      description: "Enables opacity slider and alpha channel editing.",
    },
    {
      name: "open / defaultOpen",
      type: "boolean",
      defaultValue: "false",
      description: "Controls popover open state when using ColorPickerTrigger + Content.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables pointer and keyboard interactions.",
    },
  ],
  palette: [
    {
      name: "count",
      type: "number",
      defaultValue: "4",
      description: "Number of color swatches in the palette (clamped 3..5).",
    },
    {
      name: "corner",
      type: "number",
      defaultValue: "10",
      description: "Corner radius in pixels applied to each swatch and button.",
    },
    {
      name: "morph",
      type: "number",
      defaultValue: "50",
      description: "Fluid SVG goo transition speed (0..100).",
    },
    {
      name: "colors",
      type: "string[]",
      defaultValue: "undefined",
      description: "Optional external hex array to override generated OKLCH swatches.",
    },
    {
      name: "onChange",
      type: "(colors: string[]) => void",
      defaultValue: "undefined",
      description: "Callback invoked with new hex colors when rolling a palette.",
    },
    {
      name: "onSwatchClick",
      type: "(color: string, index: number) => void",
      defaultValue: "undefined",
      description: "Custom swatch click handler (defaults to copying hex to clipboard).",
    },
    {
      name: "rollSignal",
      type: "number",
      defaultValue: "0",
      description: "Increment externally to trigger an animated palette roll.",
    },
  ],
  "wake-slider": [
    {
      name: "value / defaultValue",
      type: "number",
      defaultValue: "50",
      description: "Controlled or initial numeric value of the slider.",
    },
    {
      name: "min / max / step",
      type: "number",
      defaultValue: "0 / 100 / 1",
      description: "Numeric range bounds and quantization step.",
    },
    {
      name: "bars",
      type: "number",
      defaultValue: "32",
      description: "Number of vertical track bars (clamped 12..64).",
    },
    {
      name: "wake",
      type: "number",
      defaultValue: "60",
      description: "Peak velocity-driven wave energy amplitude (0..100).",
    },
    {
      name: "unit",
      type: "string",
      defaultValue: '""',
      description: "Optional unit suffix rendered beside the NumberFlow readout.",
    },
    {
      name: "showReading",
      type: "boolean",
      defaultValue: "true",
      description: "Toggles the animated NumberFlow numeric readout.",
    },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: "false",
      description: "Stretches the bar track to fill its container width.",
    },
    {
      name: "onChange",
      type: "(val: number) => void",
      defaultValue: "undefined",
      description: "Fires when the slider value changes via pointer or keyboard.",
    },
  ],
  gradient: [
    {
      name: "tile",
      type: "TileConfig",
      defaultValue: "undefined",
      description: "Full tile configuration object (base, rim, blobs, motion, beam, noise).",
    },
    {
      name: "globals",
      type: "Partial<GlobalsConfig>",
      defaultValue: "DEFAULT_GLOBALS",
      description: "Global rendering defaults (size, radius, contrast, saturate, blurScale).",
    },
    {
      name: "size",
      type: "number | string",
      defaultValue: "205",
      description: "Tile width and height (px number or CSS length).",
    },
    {
      name: "radius",
      type: "number",
      defaultValue: "30",
      description: "Squircle border radius percentage.",
    },
    {
      name: "animate",
      type: "boolean",
      defaultValue: "true",
      description: "Enables blob entrance animations (scale, lift, fade, rotate).",
    },
    {
      name: "rimAnimate",
      type: "boolean",
      defaultValue: "false",
      description: "Enables rim light animations (bloom, glint, breathe, scale-down).",
    },
    {
      name: "beamActive",
      type: "boolean",
      defaultValue: "false",
      description: "Wraps the tile in an animated BorderBeam perimeter effect.",
    },
    {
      name: "noise",
      type: "boolean",
      defaultValue: "false",
      description: "Overlays an SVG fractalNoise film grain texture.",
    },
  ],
};

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
