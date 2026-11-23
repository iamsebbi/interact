import type { ComponentMeta } from "@/registry/types";
import {
  DEFAULT_DOWNLOAD_BUTTON_CONFIG,
  type DownloadButtonConfig,
} from "./config";

export const downloadButtonMeta: ComponentMeta<DownloadButtonConfig> = {
  slug: "download-button",
  title: "Download Button",
  shortTitle: "Download",
  tagline:
    "Multi-state pill download button with Pause/Play, Cancel, and morphing Open state",
  description:
    "A multi-state pill download button for React. Clicking Download spawns a Pause/Play circle button on the right; pausing reveals a left Cancel circle button, and completing shrinks the pill to an animated checkmark before expanding into Open.\nMade for file managers, asset installers, export actions, and tactile progress feedback.",
  categories: ["Press", "Loading"],
  masonryHeight: 210,
  cardHeightClass: "h-[195px] sm:h-[210px]",
  gridScale: 0.88,
  previewBounds: { width: 320, height: 64 },
  dependencies: [
    "@ui-sdk/react",
    "@ui-sdk/core",
    "motion",
    "@animate-ui/react",
  ],
  sourceFiles: [
    "src/registry/items/download-button/download-button.tsx",
    "src/registry/icons/pause.tsx",
    "src/registry/icons/play.tsx",
    "src/registry/icons/x.tsx",
    "src/registry/icons/check.tsx",
  ],
  defaultConfig: DEFAULT_DOWNLOAD_BUTTON_CONFIG,
  props: [
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
        'Switches the live tabular-nums readout between transferred "x of y MB" and completion percentage.',
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
      defaultValue: '"light"',
      description:
        "Explicit light or dark palette across the central pill and secondary circle buttons.",
    },
    {
      name: "status / progress",
      type: "DownloadButtonStatus / number",
      defaultValue: "undefined",
      description:
        "Optional controlled state machine status and 0-100 progress percentage for real network streams.",
    },
    {
      name: "resetOnOpen / replaySignal",
      type: "boolean / number",
      defaultValue: "true / undefined",
      description:
        "Resets back to idle when Open is clicked (enabled by default), or restarts a download cycle whenever replaySignal increments.",
    },
  ],
  howItWorks: [
    {
      title: "Emerging side circle controls",
      description:
        "Starting the download expands a right-hand Pause/Play circle out from behind the pill; pausing pops out a left-hand Cancel (X) circle, while resuming or canceling retracts it smoothly.",
    },
    {
      title: "60fps sweep + tabular readout",
      description:
        "A requestAnimationFrame loop drives scaleX directly on the inner fill span while React updates only when the rounded readout changes for a jitter-free tabular-nums readout.",
    },
    {
      title: "Contracting checkmark to Open",
      description:
        "At 100%, side controls retract and the pill springs down into a circle to draw an SVG checkmark before expanding into the Open button.",
    },
  ],
};
