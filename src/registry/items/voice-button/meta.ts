import type { ComponentMeta } from "@/registry/types";
import { DEFAULT_VOICE_BUTTON_CONFIG, type VoiceButtonConfig } from "./config";

export const voiceButtonMeta: ComponentMeta<VoiceButtonConfig> = {
  slug: "voice-button",
  title: "Voice Button",
  shortTitle: "Voice",
  tagline:
    "Interactive voice pill button with VoiceGlow reactive beam, NumberFlow timer, and emerging Stop circle",
  description:
    "An interactive voice pill button for React built on ui-sdk Button, VoiceGlow, and NumberFlow. Clicking Voice morphs into a live timer with a sound-reactive edge beam while a circular Stop button emerges on the right, supporting both simulated Demo Voice and live microphone Demo Live modes.\nMade for voice assistants, audio recorders, dictation triggers, and conversational UIs.",
  categories: ["Inputs"],
  masonryHeight: 210,
  cardHeightClass: "h-[195px] sm:h-[210px]",
  previewBounds: { width: 250, height: 56 },
  dependencies: [
    "@ui-sdk/react",
    "@ui-sdk/core",
    "@number-flow/react",
    "voice-glow",
    "motion",
    "@animate-ui/react",
  ],
  sourceFiles: [
    "src/registry/items/voice-button/voice-button.tsx",
    "src/registry/icons/mic.tsx",
    "src/registry/icons/square.tsx",
  ],
  defaultConfig: DEFAULT_VOICE_BUTTON_CONFIG,
  props: [
    {
      name: "mode",
      type: '"voice" | "live"',
      defaultValue: '"voice"',
      description:
        "Switches between simulated speech curves (Demo Voice) and real getUserMedia microphone capture (Demo Live).",
    },
    {
      name: "label / listeningLabel",
      type: "string / string",
      defaultValue: '"Voice" / "Listening"',
      description:
        "Idle pill label and fallback active label when showTimer is false.",
    },
    {
      name: "showTimer",
      type: "boolean",
      defaultValue: "true",
      description:
        "Displays a rolling NumberFlow elapsed timer (0:00) while listening.",
    },
    {
      name: "colorVariant / look",
      type: '"colorful" | "ocean" | "sunset" | "forest" | "candy" | "ice" | "gold" | "mono" / "glow" | "dither"',
      defaultValue: '"colorful" / "glow"',
      description:
        "VoiceGlow palette and rendering look along the bottom edge of the pill.",
    },
    {
      name: "strength / sensitivity",
      type: "number / number",
      defaultValue: "1 / 3.1",
      description:
        "Controls VoiceBeam glow opacity and live microphone input gain.",
    },
    {
      name: "size / theme",
      type: '"sm" | "md" | "lg" | "xl" / "dark" | "light"',
      defaultValue: '"xl" / "light"',
      description:
        "Controls pill height and Stop circle size (36px / 44px / 48px / 54px) plus light or dark styling.",
    },
    {
      name: "onStart / onStop / onMicrophoneStateChange",
      type: "() => void / (durationMs: number) => void / (state, error) => void",
      defaultValue: "undefined",
      description:
        "Lifecycle callbacks for starting, stopping via the Stop circle, and tracking microphone permission state.",
    },
  ],
  howItWorks: [
    {
      title: "ui-sdk Button + async microphone pending",
      description:
        "Uses @ui-sdk/react/button for the pill and Stop circle, returning the getUserMedia promise in Demo Live so pending state, double-click protection, and focus recovery are handled natively.",
    },
    {
      title: "VoiceGlow beam inside an SVG gooey pill",
      description:
        "The solid pill and emerging right Stop circle fuse in a scoped SVG blur + alpha-cutout backdrop while VoiceBeam renders a crisp sound-reactive edge glow inside the foreground pill.",
    },
    {
      title: "Dual-mode Demo Voice & Demo Live",
      description:
        "Demo Voice drives VoiceBeam with a 60fps simulated speech curve without permissions; Demo Live connects useMicrophone() on user click and feeds the live MediaStream to the beam.",
    },
  ],
};
