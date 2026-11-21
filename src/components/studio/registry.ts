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
import {
  DEFAULT_DOWNLOAD_BUTTON_CONFIG,
  buildDownloadButtonJsx,
  type DownloadButtonConfig,
} from "../showcase/demos/DownloadButtonDemo";
import { DEFAULT_GLOBALS, DEFAULT_TILES } from "../../constants/defaults";
import { GlobalsConfig, TileConfig } from "../../types/gradient";
import { clone } from "../../utils/color";
import { generateReactSnippet } from "../../utils/exportCode";

export type StudioComponentId =
  | "bot-avatar"
  | "color-picker"
  | "palette"
  | "wake-slider"
  | "gradient"
  | "download-button";

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
  "download-button": DownloadButtonConfig;
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
  {
    id: "download-button",
    title: "Download Button",
    shortTitle: "Download",
    tier: "free",
    description:
      "Interactive pill download button that spawns a Pause/Play circle, reveals a left Cancel action while paused, contracts to a checkmark, and expands into Open.",
    dependencies: ["@base-ui/react", "react", "motion", "@number-flow/react", "@animate-ui/react"],
    sourceFiles: [
      "src/components/ui/download-button.tsx",
      "src/components/animate-ui/icons/pause.tsx",
      "src/components/animate-ui/icons/play.tsx",
      "src/components/animate-ui/icons/x.tsx",
      "src/components/animate-ui/icons/check.tsx",
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
    case "download-button":
      return clone(DEFAULT_DOWNLOAD_BUTTON_CONFIG) as StudioConfigMap[K];
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
    case "download-button":
      return buildDownloadButtonJsx(config as DownloadButtonConfig);
  }
}

export const REGISTRY_FALLBACK_URL =
  "https://interactdev.vercel.app/r";

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

export function getRegistryCliCommand(id: string): string {
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
  "download-button": [
    {
      name: "label / openLabel",
      type: "string",
      defaultValue: '"Download" / "Open"',
      description:
        "Idle pill label and final action label shown after the checkmark confirmation beat.",
    },
    {
      name: "sizeMB / unit",
      type: "number / string",
      defaultValue: '32 / "MB"',
      description:
        "File size displayed beside the idle label and used when progressFormat is set to size.",
    },
    {
      name: "durationMs / checkDurationMs",
      type: "number",
      defaultValue: "3200 / 900",
      description:
        "Simulated download duration in ms (when progress is uncontrolled) and checkmark circle hold duration.",
    },
    {
      name: "progressFormat",
      type: '"size" | "percent"',
      defaultValue: '"size"',
      description:
        'Switches the live NumberFlow tabular-nums readout between transferred "x of y MB" and completion percentage.',
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"xl"',
      description:
        "Controls pill height (36px / 44px / 48px / 54px) and matching side circle button dimensions.",
    },
    {
      name: "theme",
      type: '"dark" | "light"',
      defaultValue: "undefined",
      description:
        "Optional explicit dark or light palette override across the central pill and secondary circle buttons.",
    },
    {
      name: "status / progress",
      type: "DownloadButtonStatus / number",
      defaultValue: "undefined",
      description:
        "Optional controlled state machine status and 0–100 progress percentage for real network streams.",
    },
    {
      name: "resetOnOpen / replaySignal",
      type: "boolean / number",
      defaultValue: "true / undefined",
      description:
        "Resets back to idle when Open is clicked (enabled by default), or restarts a download cycle whenever replaySignal increments.",
    },
  ],
};

export interface ComponentHowItWorksPoint {
  title: string;
  detail: string;
}

export interface ComponentHowItWorksDoc {
  summary: string;
  points: readonly ComponentHowItWorksPoint[];
}

export const STUDIO_COMPONENT_HOW_IT_WORKS: Record<
  StudioComponentId,
  ComponentHowItWorksDoc
> = {
  "bot-avatar": {
    summary:
      "A 100×100 interactive SVG character whose body silhouette, 2.5D gaze projection, and facial rigs run on spring physics and direct DOM transforms.",
    points: [
      {
        title: "2.5D surface projection",
        detail:
          "Each body shape in botAvatarConfig.ts defines a surfaceProfile that bounds and curves eye/head offsets with useMotionValue and useSpring as the pointer approaches.",
      },
      {
        title: "Autonomous blink & expression poses",
        detail:
          "10 expression presets (EYE_POSES) morph SVG eye paths with AnimatePresence, layered over an organic randomized blink timer and idle body motion loops.",
      },
      {
        title: "Tactile gesture reactions",
        detail:
          "Tap bounce, long-press pet, and rapid poke annoyance mutate transforms smoothly while respecting useReducedMotion and optional navigator.vibrate haptics.",
      },
    ],
  },
  "color-picker": {
    summary:
      "A compound HSVA color picker that preserves hue across greyscale edits and pairs pointer-captured dragging with spring-physics loupe feedback.",
    points: [
      {
        title: "Lossless HSVA internal model",
        detail:
          "State is stored as HSVA in context so sliding into pure black or grey never discards hue or saturation when converting to HEX, RGB, or HSL.",
      },
      {
        title: "Spring-physics loupe",
        detail:
          "The 2D saturation/value canvas uses pointer capture, velocity tracking (useVelocity), and SPRING_GLIDE / SPRING_PRESS springs for tactile thumb motion.",
      },
      {
        title: "Eyedropper & keyboard nudging",
        detail:
          "Supports native EyeDropper sampling when available, arrow-key micro-adjustments, preset swatches, and outside/Escape dismissal via useDismiss.",
      },
    ],
  },
  palette: {
    summary:
      "An OKLCH color ramp generator that keeps perceptual lightness steps even and transitions swatches through a scoped SVG goo filter.",
    points: [
      {
        title: "Perceptually uniform OKLCH ramp",
        detail:
          "Instead of spinning HSL hues, Palette holds a hue family, ramps lightness L evenly, and peaks chroma C in the mid-tones before converting to hex.",
      },
      {
        title: "Scoped SVG goo filter",
        detail:
          "A feGaussianBlur + feColorMatrix alpha-cut filter generated with useId() fuses moving swatch blobs without colliding across multiple mounted instances.",
      },
      {
        title: "Elastic motion & copy",
        detail:
          "Rolling generates a fresh ramp with configurable corner radius and morph speed, while clicking any swatch copies its hex value directly.",
      },
    ],
  },
  "wake-slider": {
    summary:
      "A thumb-less bar-track range slider where pointer velocity injects energy into individual bars that decay on a zero-rerender requestAnimationFrame loop.",
    points: [
      {
        title: "Per-bar kinetic energy",
        detail:
          "A Float32Array tracks each bar's energy. Crossing a bar during a fast drag injects energy proportional to pointer speed, leaving a natural trailing wake.",
      },
      {
        title: "Direct DOM transforms",
        detail:
          "An exponential decay RAF loop writes scaleY/transform directly onto bar refs and stops automatically once energy settles, avoiding React re-renders per frame.",
      },
      {
        title: "NumberFlow readout & ARIA",
        detail:
          "React only re-renders when the quantized value changes, driving NumberFlow numeric transitions alongside full keyboard slider controls.",
      },
    ],
  },
  gradient: {
    summary:
      "A layered squircle tile combining organic SVG/CSS blobs, shockwave echo trails, rim lighting, film grain, and perimeter border beams.",
    points: [
      {
        title: "Multi-layer blob composition",
        detail:
          "Blobs render as CSS radii, clip-paths, or SVG paths with optional echoCount trails that step position, scale, blur, and opacity front-to-back or back-to-front.",
      },
      {
        title: "Optical filter fusion",
        detail:
          "Global blurScale, saturate, and contrast filters blend discrete shapes into smooth atmospheric gradients, optionally topped with feTurbulence fractalNoise grain.",
      },
      {
        title: "Entrance, rim & beam lighting",
        detail:
          "Supports CSS keyframe entrance modes (scale, lift, fade, rotate), rim bloom/glint/breathe animations, and an optional BorderBeam perimeter effect.",
      },
    ],
  },
  "download-button": {
    summary:
      "A 5-state pill machine (idle → downloading ↔ paused → completing → completed) built on Base UI Button and Progress primitives with Motion springs and a 60fps progress sweep.",
    points: [
      {
        title: "Emerging side circle controls",
        detail:
          "Starting the download expands a right-hand Pause/Play circle out from behind the pill; pausing pops out a left-hand Cancel (X) circle, while resuming or canceling retracts it smoothly.",
      },
      {
        title: "60fps sweep + NumberFlow readout",
        detail:
          "A requestAnimationFrame loop drives scaleX directly on the inner fill span while React only updates when the rounded readout changes for tabular-nums NumberFlow.",
      },
      {
        title: "Contracting checkmark to Open",
        detail:
          "At 100%, side controls retract and the pill springs down into a circle to draw an SVG checkmark before expanding into the Open button.",
      },
    ],
  },
};

export const STUDIO_COMPONENT_OVERVIEWS: Record<StudioComponentId, string> = {
  "bot-avatar":
    "An interactive 2.5D SVG character for React. Move your pointer near to track gaze, tap to bounce, hold to pet, or switch between 7 organic silhouettes and 10 facial expressions.\nMade for AI assistants, onboarding companions, empty states, and conversational UIs.",
  "color-picker":
    "A tactile HSVA color picker for React with a spring-physics loupe. Drag across the 2D saturation/value canvas, scrub hue or alpha, sample screen pixels via EyeDropper, or edit HEX, RGB, and HSL channels.\nMade for design tools, theme editors, studios, and creative web apps.",
  palette:
    "A perceptually uniform OKLCH color ramp generator for React. Roll a fresh 3 to 5 swatch palette with even lightness steps and elastic SVG goo transitions, then click any swatch to copy its hex value.\nMade for design systems, brand generators, token pickers, and color workspaces.",
  "wake-slider":
    "A thumb-less kinetic bar-track slider for React. Drag slowly to fill bars cleanly, or sweep fast to send a velocity-driven wave wake rippling behind the pointer alongside a smooth NumberFlow readout.\nMade for audio controls, parameter scrubbing, kinetic inspectors, and tactile UI.",
  gradient:
    "A layered squircle gradient tile for React. Combine organic SVG and CSS blob shapes with echo trails, radial rim lighting, fractal noise grain, and perimeter border beams.\nMade for hero cards, app icons, feature backdrops, and atmospheric surfaces.",
  "download-button":
    "A multi-state pill download button for React. Clicking Download spawns a Pause/Play circle button on the right; pausing reveals a left Cancel circle button, and completing shrinks the pill to an animated checkmark before expanding into Open.\nMade for file managers, asset installers, export actions, and tactile progress feedback.",
};

export interface ShowcaseComponentDocsEntry {
  title: string;
  dependencies: string[];
  props: readonly ComponentPropDoc[];
  howItWorks: ComponentHowItWorksDoc;
  overview: string;
}

const SHOWCASE_EXTRA_DOCS: Record<string, ShowcaseComponentDocsEntry> = {};

export function getShowcaseComponentDocs(
  id?: string
): ShowcaseComponentDocsEntry | undefined {
  if (!id) return undefined;
  if (id in STUDIO_COMPONENT_PROPS) {
    const studioId = id as StudioComponentId;
    const meta = STUDIO_COMPONENTS.find((c) => c.id === studioId);
    if (!meta) return undefined;
    return {
      title: meta.title,
      dependencies: meta.dependencies,
      props: STUDIO_COMPONENT_PROPS[studioId],
      howItWorks: STUDIO_COMPONENT_HOW_IT_WORKS[studioId],
      overview: STUDIO_COMPONENT_OVERVIEWS[studioId],
    };
  }
  return SHOWCASE_EXTRA_DOCS[id];
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
