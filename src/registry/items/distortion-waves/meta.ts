import type { ComponentMeta } from "@/registry/types";
import {
  DEFAULT_DISTORTION_WAVES_CONFIG,
  type DistortionWavesConfig,
} from "./config";

export const distortionWavesMeta: ComponentMeta<DistortionWavesConfig> = {
  slug: "distortion-waves",
  title: "Distortion Waves",
  shortTitle: "Waves",
  tagline:
    "WebGL2 optical wave transition from Libraries.dev that opens from the triggering element and bends the DOM between two views",
  description:
    "A WebGL2 optical wave transition for React powered by Libraries.dev's distortion-waves. Opens from the exact button or badge that triggered it, bending a snapshot of the DOM as one opaque view sweeps into another while overlay controls stay live and sharp.\nMade for payment confirmations, receipt reveals, mode switches, and state transitions.",
  categories: ["Effects"],
  masonryHeight: 400,
  cardHeightClass: "h-[380px] sm:h-[400px]",
  gridScale: 0.58,
  previewBounds: { width: 380, height: 475 },
  dependencies: ["react", "distortion-waves"],
  sourceFiles: ["src/registry/items/distortion-waves/distortion-waves.tsx"],
  defaultConfig: DEFAULT_DISTORTION_WAVES_CONFIG,
  props: [
    {
      name: "revealed",
      type: "boolean",
      defaultValue: "false",
      description:
        "True sends the wave out to reveal revealedContent; false collapses it back into the source.",
    },
    {
      name: "children",
      type: "ReactNode",
      defaultValue: "undefined",
      description:
        "Initial DOM view the wave passes over. Give it an opaque background; omit revealedContent to ripple in place via ref.play().",
    },
    {
      name: "revealedContent",
      type: "ReactNode",
      defaultValue: "undefined",
      description: "Second opaque DOM view left behind by the wave front.",
    },
    {
      name: "overlay",
      type: "ReactNode",
      defaultValue: "undefined",
      description:
        "Live unbent content rendered above the wave (e.g. the triggering button, spinner, or video).",
    },
    {
      name: "type",
      type: '"vertical" | "horizontal" | "center"',
      defaultValue: '"vertical"',
      description:
        "Wave front origin and direction matching where the action starts.",
    },
    {
      name: "palette",
      type: '"colorful" | "green" | "ocean" | "sunset" | "mono" | Palette | string',
      defaultValue: '"colorful"',
      description:
        "Named spectrum, custom Palette object, or hex color (#RRGGBB) for the wave rim.",
    },
    {
      name: "source",
      type: "Element | RefObject<Element | null> | Rect | null",
      defaultValue: "pressed control",
      description:
        "Element, ref, or local rect the wave opens from. Defaults to the last pressed or focused control.",
    },
    {
      name: "focus",
      type: "{ x: number; y: number } | null",
      defaultValue: "last press",
      description:
        "Touch point in the element's CSS pixels that leans the wave front toward the pointer.",
    },
    {
      name: "waveStyle",
      type: "WaveStyleInput",
      defaultValue: "defaultStyle(type)",
      description:
        "Tune anticipation, travel, returnSpeed, amplitude, lensWidth, aberration, blur, rimWidth, and particleCount.",
    },
  ],
  howItWorks: [
    {
      title: "Action-matched source & live overlay",
      description:
        "Pass the triggering element or ref as source and keep interactive controls inside overlay so they stay crisp and unbent above the sweeping wave.",
    },
    {
      title: "WebGL2 DOM refraction & chromatic rim",
      description:
        "Snapshots both opaque views with continuous border-radius clipping and tunes physics via waveStyle (anticipation, travel, returnSpeed, amplitude, lensWidth, aberration, blur, rimWidth, particleCount).",
    },
    {
      title: "Controlled revealed & imperative handle",
      description:
        "Toggle revealed to expand or collapse back into source, scrub directly between 0 and 1, or drive transitions imperatively with ref.play(), reverse(), reset(), and prepare().",
    },
  ],
};
