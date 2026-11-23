import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type {
  VoiceButtonColorVariant,
  VoiceButtonLook,
  VoiceButtonMode,
  VoiceButtonSize,
  VoiceButtonTheme,
} from "./voice-button";

export interface VoiceButtonConfig {
  mode: VoiceButtonMode;
  label: string;
  listeningLabel: string;
  showTimer: boolean;
  size: VoiceButtonSize;
  theme: VoiceButtonTheme;
  colorVariant: VoiceButtonColorVariant;
  look: VoiceButtonLook;
  strength: number;
  sensitivity: number;
}

export const DEFAULT_VOICE_BUTTON_CONFIG: VoiceButtonConfig = {
  mode: "voice",
  label: "Voice",
  listeningLabel: "Listening",
  showTimer: true,
  size: "xl",
  theme: "light",
  colorVariant: "colorful",
  look: "glow",
  strength: 1,
  sensitivity: 3.1,
};

export const VOICE_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

export const VOICE_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const VOICE_COLOR_OPTIONS: readonly SelectFieldOption[] = [
  { value: "colorful", label: "Colorful" },
  { value: "ocean", label: "Ocean" },
  { value: "sunset", label: "Sunset" },
  { value: "forest", label: "Forest" },
  { value: "candy", label: "Candy" },
  { value: "ice", label: "Ice" },
  { value: "gold", label: "Gold" },
  { value: "mono", label: "Mono" },
];

export const VOICE_LOOK_OPTIONS: readonly SelectFieldOption[] = [
  { value: "glow", label: "Glow" },
  { value: "dither", label: "Dither" },
];

export function buildVoiceButtonJsx(config: VoiceButtonConfig): string {
  const label = config.label || DEFAULT_VOICE_BUTTON_CONFIG.label;
  const listeningLabel =
    config.listeningLabel || DEFAULT_VOICE_BUTTON_CONFIG.listeningLabel;

  const lines = [
    `import { VoiceButton } from "@/components/ui/voice-button";`,
    ``,
    `<VoiceButton`,
  ];
  if (config.mode !== DEFAULT_VOICE_BUTTON_CONFIG.mode) {
    lines.push(`  mode="${config.mode}"`);
  }
  if (label !== DEFAULT_VOICE_BUTTON_CONFIG.label) {
    lines.push(`  label="${label.replace(/"/g, '\\"')}"`);
  }
  if (!config.showTimer) {
    lines.push(`  showTimer={false}`);
    if (listeningLabel !== DEFAULT_VOICE_BUTTON_CONFIG.listeningLabel) {
      lines.push(`  listeningLabel="${listeningLabel.replace(/"/g, '\\"')}"`);
    }
  }
  if (config.size !== DEFAULT_VOICE_BUTTON_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  if (config.theme !== DEFAULT_VOICE_BUTTON_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  if (config.colorVariant !== DEFAULT_VOICE_BUTTON_CONFIG.colorVariant) {
    lines.push(`  colorVariant="${config.colorVariant}"`);
  }
  if (config.look !== DEFAULT_VOICE_BUTTON_CONFIG.look) {
    lines.push(`  look="${config.look}"`);
  }
  if (config.strength !== DEFAULT_VOICE_BUTTON_CONFIG.strength) {
    lines.push(`  strength={${config.strength}}`);
  }
  if (config.sensitivity !== DEFAULT_VOICE_BUTTON_CONFIG.sensitivity) {
    lines.push(`  sensitivity={${config.sensitivity}}`);
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildVoiceButtonAiPrompt(
  config: VoiceButtonConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/voice-button.json",
): string {
  return [
    "Implement the Voice Button component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, @number-flow/react, voice-glow, motion, @animate-ui/react",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildVoiceButtonJsx(config),
    "```",
  ].join("\n");
}

export const voiceButtonGenerators: ComponentGenerators<VoiceButtonConfig> = {
  buildJsx: buildVoiceButtonJsx,
  buildAiPrompt: buildVoiceButtonAiPrompt,
};
