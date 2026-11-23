import type { ComponentMeta } from "@/registry/types";
import {
  DEFAULT_UPLOAD_BUTTON_CONFIG,
  type UploadButtonConfig,
} from "./config";

export const uploadButtonMeta: ComponentMeta<UploadButtonConfig> = {
  slug: "upload-button",
  title: "Upload Button",
  shortTitle: "Upload",
  tagline:
    "Expandable file upload trigger with stacked progress queue, inline Retry, and Copy link",
  description:
    "An expandable multi-file upload pill button for React. Triggering upload reveals a staggered stack of concentric file rows from behind the pill with live MB progress, full-row Retry on partial failure, and a morphing 2 uploaded -> Copy link -> Copied summary flow.\nMade for media uploaders, asset drops, shareable galleries, and tactile upload feedback.",
  categories: ["Press", "Loading"],
  masonryHeight: 340,
  cardHeightClass: "h-[320px] sm:h-[340px]",
  gridScale: 1,
  previewBounds: { width: 320, height: 200 },
  dependencies: [
    "@ui-sdk/react",
    "@ui-sdk/core",
    "motion",
    "@animate-ui/react",
  ],
  sourceFiles: [
    "src/registry/items/upload-button/upload-button.tsx",
    "src/registry/icons/check.tsx",
  ],
  defaultConfig: DEFAULT_UPLOAD_BUTTON_CONFIG,
  props: [
    {
      name: "items",
      type: "UploadItemInput[]",
      defaultValue: "DEFAULT_UPLOAD_ITEMS",
      description:
        "Array of file entries (id, name, sizeMB, optional thumbnail and failAtPercent threshold).",
    },
    {
      name: "label / itemNoun",
      type: "string",
      defaultValue: 'undefined / "photo"',
      description:
        'Custom idle label override or singular item noun used for generated copy ("Upload 2 photos", "Uploading 2 photos").',
    },
    {
      name: "copyLinkLabel / copiedLabel",
      type: "string",
      defaultValue: '"Copy link" / "Copied"',
      description:
        "Final interactive pill label after upload completion and confirmation text shown on click.",
    },
    {
      name: "durationMs / summaryDurationMs / copiedDurationMs",
      type: "number",
      defaultValue: "3200 / 1050 / 1400",
      description:
        "Base upload duration, summary hold before morphing to Copy link, and Copied hold before resetting to idle.",
    },
    {
      name: "simulateFailure",
      type: "boolean",
      defaultValue: "true",
      description:
        "Simulates a partial failure on one item during the first pass so the inline Retry flow can be demonstrated.",
    },
    {
      name: "anchored",
      type: "boolean",
      defaultValue: "true",
      description:
        "Keeps the trigger anchored at its Y coordinate (true) or drops dynamically from center while the stack is open (false).",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"xl"',
      description:
        "Controls pill height (36px / 44px / 48px / 54px), stacked row dimensions, and concentric thumbnail size.",
    },
    {
      name: "theme / shareUrl / replaySignal",
      type: '"dark" | "light" / string / number',
      defaultValue: '"light" / undefined / undefined',
      description:
        "Explicit light or dark palette (defaults to light), URL written to clipboard when Copy link is clicked, and replay trigger counter.",
    },
  ],
  howItWorks: [
    {
      title: "Anchored stack emerging from behind",
      description:
        "Queued file pills sit in an absolute bottom-full stack behind the z-10 trigger pill, emerging upward with staggered springs and blur(6px) transitions without shifting page layout.",
    },
    {
      title: "In-place rAF progress & tabular figures",
      description:
        "Per-item progress bars (scaleX) and 1-decimal MB readouts mutate DOM refs directly inside requestAnimationFrame with reused arrays and crisp tabular-nums digits.",
    },
    {
      title: "Full-row Retry & morphing summary",
      description:
        "Failed rows switch subtitles to Couldn't upload and expose a full-row ui-sdk Button overlay for Retry; finishing collapses the stack into N uploaded, morphs to Copy link, and confirms Copied.",
    },
  ],
};
