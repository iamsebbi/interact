import type { ComponentMeta } from "@/registry/types";
import { DEFAULT_STEP_PLAYER_CONFIG, type StepPlayerConfig } from "./config";

export const stepPlayerMeta: ComponentMeta<StepPlayerConfig> = {
  slug: "step-player",
  title: "Step Player",
  shortTitle: "Steps",
  tagline:
    "Two-pill step timeline with two-edge slot easing, boat-wake dot ripple, and quad-morphed Play/Pause mark",
  description:
    "A kinetic two-pill step player for React built with zero external dependencies. Each dot animates its left and right edges while a staggered boat-wake ripple travels across crossed steps alongside a continuous quad-morphed Play/Pause control.\nMade for onboarding tours, feature walkthroughs, story timelines, and playback steppers.",
  categories: ["Select", "Loading"],
  masonryHeight: 210,
  cardHeightClass: "h-[195px] sm:h-[210px]",
  previewBounds: { width: 260, height: 56 },
  dependencies: ["react"],
  sourceFiles: [
    "src/registry/items/step-player/step-player.tsx",
    "src/registry/items/step-player/step-player.css",
  ],
  defaultConfig: DEFAULT_STEP_PLAYER_CONFIG,
  props: [
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description:
        "Controls pill height and dot/bar scale across Small (36px), Medium (44px), Large (48px), and Extra Large (54px).",
    },
    {
      name: "steps",
      type: "number",
      defaultValue: "5",
      description:
        "Number of step dots in the track (clamped between 3 and 8).",
    },
    {
      name: "pace",
      type: "number",
      defaultValue: "3",
      description:
        "Duration in seconds each active step takes to fill before advancing.",
    },
    {
      name: "wake",
      type: "number",
      defaultValue: "100",
      description:
        "Ripple reach and lift/squash balance (0–100) across crossed dots when switching steps.",
    },
  ],
  howItWorks: [
    {
      title: "Two-edge slot layout",
      description:
        "Instead of translating a separate active indicator, every dot animates its own left and right edge targets with cubic ease-out and a critically damped fallback spring.",
    },
    {
      title: "Boat-wake dot ripple",
      description:
        "Only dots crossed between the origin and target step lift in sequence (staggered from departure toward landing), with the wake knob scaling reach and landing lift vs. squash.",
    },
    {
      title: "Continuous quad-morphed Play/Pause mark",
      description:
        "Two matching 4-point SVG quadrilaterals morph between pause bars and a split play triangle with sinusoidal volume-preserving tilt and squash.",
    },
  ],
};
