import type { VoiceBeamColorVariant, VoiceBeamLook } from "voice-glow";
import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { VoiceAssistantTheme } from "./voice-assistant-card";

export type VoiceAssistantStudioTheme = VoiceAssistantTheme;

export interface VoiceAssistantCardConfig {
  assistantName: string;
  assistantRole: string;
  initials: string;
  greeting: string;
  transcript: string;
  wordIntervalMs: number;
  strength: number;
  colorVariant: VoiceBeamColorVariant;
  look: VoiceBeamLook;
  theme: VoiceAssistantStudioTheme;
}

export const DEFAULT_VOICE_ASSISTANT_CARD_CONFIG: VoiceAssistantCardConfig = {
  assistantName: "Kai",
  assistantRole: "Personal assistant",
  initials: "KA",
  greeting: "What's on your mind today?",
  transcript:
    "Block out two hours tomorrow morning for deep work and mute notifications",
  wordIntervalMs: 280,
  strength: 0.6,
  colorVariant: "mono",
  look: "glow",
  theme: "light",
};

export const VOICE_ASSISTANT_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const VOICE_ASSISTANT_COLOR_OPTIONS: readonly SelectFieldOption[] = [
  { value: "colorful", label: "Colorful" },
  { value: "ocean", label: "Ocean" },
  { value: "sunset", label: "Sunset" },
  { value: "forest", label: "Forest" },
  { value: "candy", label: "Candy" },
  { value: "ice", label: "Ice" },
  { value: "gold", label: "Gold" },
  { value: "mono", label: "Mono" },
];

export const VOICE_ASSISTANT_LOOK_OPTIONS: readonly SelectFieldOption[] = [
  { value: "glow", label: "Glow" },
  { value: "dither", label: "Dither" },
];

function escapeAttr(v: string): string {
  return v.replace(/"/g, '\\"');
}

export function buildVoiceAssistantCardJsx(
  config: VoiceAssistantCardConfig,
): string {
  const assistantName =
    config.assistantName || DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.assistantName;
  const assistantRole =
    config.assistantRole || DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.assistantRole;
  const initials =
    config.initials || DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.initials;
  const greeting =
    config.greeting || DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.greeting;
  const transcript =
    config.transcript || DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.transcript;

  const lines = [
    `import { VoiceAssistantCard } from "@/components/ui/voice-assistant-card";`,
    ``,
    `<VoiceAssistantCard`,
  ];
  if (assistantName !== DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.assistantName) {
    lines.push(`  assistantName="${escapeAttr(assistantName)}"`);
  }
  if (assistantRole !== DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.assistantRole) {
    lines.push(`  assistantRole="${escapeAttr(assistantRole)}"`);
  }
  if (initials !== DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.initials) {
    lines.push(`  initials="${escapeAttr(initials)}"`);
  }
  if (greeting !== DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.greeting) {
    lines.push(`  greeting="${escapeAttr(greeting)}"`);
  }
  if (transcript !== DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.transcript) {
    lines.push(`  transcript="${escapeAttr(transcript)}"`);
  }
  if (
    config.wordIntervalMs !== DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.wordIntervalMs
  ) {
    lines.push(`  wordIntervalMs={${config.wordIntervalMs}}`);
  }
  if (config.strength !== DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.strength) {
    lines.push(`  strength={${config.strength}}`);
  }
  if (
    config.colorVariant !== DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.colorVariant
  ) {
    lines.push(`  colorVariant="${config.colorVariant}"`);
  }
  if (config.look !== DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.look) {
    lines.push(`  look="${config.look}"`);
  }
  if (config.theme !== DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  if (lines.length === 3) {
    return `import { VoiceAssistantCard } from "@/components/ui/voice-assistant-card";\n\n<VoiceAssistantCard />`;
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildVoiceAssistantCardAiPrompt(
  config: VoiceAssistantCardConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/voice-assistant-card.json",
): string {
  return [
    "Implement the Voice Assistant Card component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: react, voice-glow, motion",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildVoiceAssistantCardJsx(config),
    "```",
  ].join("\n");
}

export const voiceAssistantCardGenerators: ComponentGenerators<VoiceAssistantCardConfig> =
  {
    buildJsx: buildVoiceAssistantCardJsx,
    buildAiPrompt: buildVoiceAssistantCardAiPrompt,
  };
