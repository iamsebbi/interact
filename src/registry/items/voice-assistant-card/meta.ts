import type { ComponentMeta } from "@/registry/types";
import {
  DEFAULT_VOICE_ASSISTANT_CARD_CONFIG,
  type VoiceAssistantCardConfig,
} from "./config";

export const voiceAssistantCardMeta: ComponentMeta<VoiceAssistantCardConfig> = {
  slug: "voice-assistant-card",
  title: "Voice Assistant Card",
  shortTitle: "Assistant",
  tagline:
    "Voice assistant card with floating iMessage greeting, word-by-word transcript stream, and VoiceBeam glow",
  description:
    "An interactive voice assistant card for React built with VoiceBeam. Features a floating iMessage-style greeting, tap-to-speak waveform trigger, word-by-word blurred transcript streaming, smooth caption swaps, and a rising voice glow across the card.\nMade for AI voice companions, conversational cards, and hands-free assistant demos.",
  categories: ["Flows"],
  masonryHeight: 440,
  cardHeightClass: "h-[410px] sm:h-[440px]",
  gridScale: 0.76,
  previewBounds: { width: 360, height: 340 },
  dependencies: ["react", "voice-glow", "motion"],
  sourceFiles: [
    "src/registry/items/voice-assistant-card/voice-assistant-card.tsx",
    "src/registry/items/voice-assistant-card/voice-assistant-card.css",
  ],
  defaultConfig: DEFAULT_VOICE_ASSISTANT_CARD_CONFIG,
  props: [
    {
      name: "assistantName",
      type: "string",
      defaultValue: '"Kai"',
      description: "Display name rendered in the assistant card header.",
    },
    {
      name: "assistantRole",
      type: "string",
      defaultValue: '"Personal assistant"',
      description: "Subtitle shown below the assistant name.",
    },
    {
      name: "initials",
      type: "string",
      defaultValue: '"KA"',
      description: "Two-letter avatar badge initials.",
    },
    {
      name: "greeting",
      type: "string",
      defaultValue: '"What\'s on your mind today?"',
      description: "Floating iMessage-style greeting bubble copy.",
    },
    {
      name: "transcript",
      type: "string",
      defaultValue:
        '"Block out two hours tomorrow morning for deep work and mute notifications"',
      description: "Demo speech transcript streamed word by word when active.",
    },
    {
      name: "wordIntervalMs",
      type: "number",
      defaultValue: "280",
      description: "Interval in milliseconds between each streamed word.",
    },
    {
      name: "strength",
      type: "number",
      defaultValue: "0.6",
      description:
        "Peak VoiceBeam intensity multiplier during simulated speech.",
    },
    {
      name: "colorVariant",
      type: '"colorful" | "ocean" | "sunset" | "forest" | "candy" | "ice" | "gold" | "mono"',
      defaultValue: '"mono"',
      description: "Palette used by the VoiceBeam glow along the card bottom.",
    },
    {
      name: "look",
      type: '"glow" | "dither"',
      defaultValue: '"glow"',
      description:
        "VoiceBeam rendering style (soft glow or ordered pixel dither).",
    },
    {
      name: "theme",
      type: '"light" | "dark"',
      defaultValue: '"light"',
      description:
        "Explicit light or dark palette for both card surfaces and VoiceBeam (defaults to light).",
    },
    {
      name: "replaySignal",
      type: "number",
      defaultValue: "undefined",
      description:
        "Incrementing counter that triggers the speech demo from parent controls.",
    },
    {
      name: "onPhaseChange",
      type: '(phase: "idle" | "listening" | "thinking") => void',
      defaultValue: "undefined",
      description:
        "Callback fired whenever the assistant transitions between idle, listening, and thinking.",
    },
  ],
  howItWorks: [
    {
      title: "Word-by-word blur stream",
      description:
        "Splits the transcript into tokens and reveals each word on a staggered timer with 350ms opacity and 1px blur easing.",
    },
    {
      title: "Caption swap & floating bubble",
      description:
        "SwapText cross-transitions status captions over 150ms with vertical slide + blur while the iMessage greeting gently floats.",
    },
    {
      title: "Simulated VoiceBeam & thinking motion",
      description:
        "Drives VoiceBeam with a multi-sine speech envelope during listening and gathers the beam horizontally while thinking.",
    },
  ],
};
