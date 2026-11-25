import type { ComponentMeta } from "@/registry/types";
import {
  DEFAULT_SEGMENTED_CONTROL_CONFIG,
  type SegmentedControlConfig,
} from "./config";

export const segmentedControlMeta: ComponentMeta<SegmentedControlConfig> = {
  slug: "segmented-control",
  title: "Segmented Control",
  shortTitle: "Segmented",
  tagline:
    "Elastic pill selector with two-edge spring physics where the leading edge shoots ahead and the trailing edge catches up cleanly",
  description:
    "An accessible segmented control for React built on @ui-sdk/react/segmented-control and Motion springs. Switching segments launches the active pill's leading edge immediately while its trailing edge follows 55ms later with perceptual bounce physics and tactile hover/press growth.\nMade for timeframe pickers, billing toggles, view switchers, and compact filter bars.",
  categories: ["Selection"],
  masonryHeight: 210,
  cardHeightClass: "h-[195px] sm:h-[210px]",
  previewBounds: { width: 344, height: 60 },
  dependencies: ["@ui-sdk/react", "@ui-sdk/core", "motion"],
  sourceFiles: ["src/registry/items/segmented-control/segmented-control.tsx"],
  defaultConfig: DEFAULT_SEGMENTED_CONTROL_CONFIG,
  props: [
    {
      name: "items",
      type: "readonly (string | { value: string; label: string; disabled?: boolean })[]",
      required: true,
      description:
        "Ordered list of selectable options as strings or value/label objects with optional per-item disabled state.",
    },
    {
      name: "value / defaultValue",
      type: "string | null",
      defaultValue: "undefined / first enabled item",
      description: "Controlled active value or initial uncontrolled selection.",
    },
    {
      name: "onValueChange",
      type: "(value: string | null, details) => void",
      defaultValue: "undefined",
      description:
        "Callback fired on pointer, keyboard, or agent changes with cancelable change details.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"xl"',
      description:
        "Controls overall height, pill inset, horizontal padding, and typography from Small (36px) to Extra Large (56px).",
    },
    {
      name: "theme",
      type: '"light" | "dark"',
      defaultValue: '"light"',
      description:
        "Explicit light or dark surface palette independent of the surrounding page theme.",
    },
    {
      name: "stretch",
      type: "number",
      defaultValue: "1",
      description:
        "Scales the trailing-edge delay from 0 (rigid slide) through 1 (55ms elastic stretch) up to 2 (110ms).",
    },
    {
      name: "bounce",
      type: "number",
      defaultValue: "1",
      description:
        "Scales spring overshoot across leading snap, trailing catch-up, and press-grow micro-interactions (0 to 1.6).",
    },
    {
      name: "speed",
      type: "number",
      defaultValue: "1",
      description:
        "Scales spring velocity and trailing delay timing from 0.5× (slow) to 2× (snappy).",
    },
    {
      name: "showTray",
      type: "boolean",
      defaultValue: "true",
      description:
        "Toggles the elevated pill tray around the floating active indicator.",
    },
  ],
  howItWorks: [
    {
      title: "Two-edge perceptual spring stretch",
      description:
        "Separate left and right MotionValues drive the indicator pill: the leading edge fires immediately with a crisp snap spring while the trailing edge launches 55ms later with an underdamped catch-up bounce.",
    },
    {
      title: "Stable-width hover & press growth",
      description:
        "Hidden bold sizers keep every segment width constant across weight changes while full-hitbox pointer springs subtly grow labels on hover and press without shifting neighbors.",
    },
    {
      title: "Native radio-group semantics & agent bridge",
      description:
        "Built on @ui-sdk/react/segmented-control for single-tab-stop arrow navigation, disabled skipping, hidden radio form submission, and automatic createAgent() support.",
    },
  ],
};
