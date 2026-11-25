import type { ComponentMeta } from "@/registry/types";
import {
  DEFAULT_UPDATE_BUTTON_CONFIG,
  type UpdateButtonConfig,
} from "./config";

export const updateButtonMeta: ComponentMeta<UpdateButtonConfig> = {
  slug: "update-button",
  title: "Update Button",
  shortTitle: "Update",
  tagline:
    "Interactive update pill button with inner progress sweep and emerging Cancel circle",
  description:
    "An interactive update pill button for React built on ui-sdk Button and Progress primitives. Clicking Update reveals an inner progress sweep while a circular Cancel (X) button springs out to the right, then contracts into a checkmark circle before settling into Updated.\nMade for software updaters, sync actions, deploy triggers, and tactile progress feedback.",
  categories: ["Actions", "Feedback"],
  masonryHeight: 210,
  cardHeightClass: "h-[195px] sm:h-[210px]",
  previewBounds: { width: 280, height: 56 },
  dependencies: [
    "@ui-sdk/react",
    "@ui-sdk/core",
    "motion",
    "@animate-ui/react",
  ],
  sourceFiles: [
    "src/registry/items/update-button/update-button.tsx",
    "src/registry/icons/refresh-cw.tsx",
    "src/registry/icons/check.tsx",
    "src/registry/icons/x.tsx",
  ],
  defaultConfig: DEFAULT_UPDATE_BUTTON_CONFIG,
  props: [
    {
      name: "label / updatingLabel / completedLabel",
      type: "string / string / string",
      defaultValue: '"Update" / "Updating" / "Updated"',
      description:
        "Visible pill labels across the idle, active updating, and completed states.",
    },
    {
      name: "showPercentage",
      type: "boolean",
      defaultValue: "false",
      description:
        "Displays a tabular-nums completion percentage beside the updating label.",
    },
    {
      name: "durationMs / checkDurationMs / completedDurationMs",
      type: "number",
      defaultValue: "2800 / 850 / 1600",
      description:
        "Simulated update duration, checkmark circle pause, and completed state hold before auto-reset.",
    },
    {
      name: "autoReset",
      type: "boolean",
      defaultValue: "true",
      description:
        "Automatically transitions from Updated back to idle after completedDurationMs.",
    },
    {
      name: "status / progress",
      type: '"idle" | "updating" | "completing" | "completed" / number',
      defaultValue: "undefined",
      description: "Optional controlled status and 0-100 progress percentage.",
    },
    {
      name: "size / theme",
      type: '"sm" | "md" | "lg" | "xl" / "dark" | "light"',
      defaultValue: '"xl" / "light"',
      description:
        "Controls pill height and concentric circle size (36px / 44px / 48px / 54px) plus component-scoped dark or light styling.",
    },
    {
      name: "onStart / onCancel / onComplete / onReset",
      type: "() => void",
      defaultValue: "undefined",
      description:
        "Lifecycle callbacks fired when starting, cancelling via the X circle, completing, or resetting.",
    },
  ],
  howItWorks: [
    {
      title: "ui-sdk Button + Progress foundation",
      description:
        "Uses @ui-sdk/react/button for accessible pill and cancel actions with focusableWhenDisabled support, paired with @ui-sdk/react/progress for screen-reader and agent progress semantics.",
    },
    {
      title: "SVG gooey Cancel (X) droplet",
      description:
        "A scoped SVG blur + alpha-cutout backdrop layer fuses the solid pill and emerging X circle into a liquid metaball bridge without distorting crisp foreground text, progress fill, or focus rings.",
    },
    {
      title: "Zero-jump blur crossfade & spring width",
      description:
        "Unscaled offsetWidth/scrollWidth measurement with absolute-centered 6px blur swaps prevents horizontal shifting before contracting into an animated checkmark circle and expanding into Updated.",
    },
  ],
};
