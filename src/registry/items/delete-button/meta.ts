import type { ComponentMeta } from "@/registry/types";
import {
  DEFAULT_DELETE_BUTTON_CONFIG,
  type DeleteButtonConfig,
} from "./config";

export const deleteButtonMeta: ComponentMeta<DeleteButtonConfig> = {
  slug: "delete-button",
  title: "Delete Button",
  shortTitle: "Delete",
  tagline:
    "Circular delete trigger that splits via an SVG gooey bridge into Confirm and Cancel pills",
  description:
    "A circular delete icon button for React built on ui-sdk Button primitives. Clicking the Trash trigger splits it via an SVG gooey liquid bridge into two contextual pills — Confirm and Cancel — before optionally settling through a brief Deleted state.\nMade for destructive row actions, item cards, settings drawers, and inline confirmations.",
  categories: ["Press"],
  masonryHeight: 210,
  cardHeightClass: "h-[195px] sm:h-[210px]",
  previewBounds: { width: 260, height: 56 },
  dependencies: [
    "@ui-sdk/react",
    "@ui-sdk/core",
    "motion",
    "@animate-ui/react",
  ],
  sourceFiles: [
    "src/registry/items/delete-button/delete-button.tsx",
    "src/registry/icons/check.tsx",
    "src/registry/icons/trash-2.tsx",
  ],
  defaultConfig: DEFAULT_DELETE_BUTTON_CONFIG,
  props: [
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"xl"',
      description:
        "Controls circle diameter, pill height, gooey gap, and icon scale from Small (36px) to Extra Large (54px).",
    },
    {
      name: "theme",
      type: '"light" | "dark"',
      defaultValue: '"light"',
      description:
        "Explicit light or dark surface palette across idle, confirmation, and cancel pills (defaults to light).",
    },
    {
      name: "confirmLabel / cancelLabel / deletedLabel",
      type: "string / string / string",
      defaultValue: '"Confirm" / "Cancel" / "Deleted"',
      description:
        "Custom labels for the confirmation pill, cancel pill, and temporary deleted pill.",
    },
    {
      name: "showDeletedState",
      type: "boolean",
      defaultValue: "true",
      description:
        "Shows a brief Deleted confirmation pill before returning to the circular Trash trigger.",
    },
    {
      name: "deletedDurationMs",
      type: "number",
      defaultValue: "1400",
      description:
        "Duration in milliseconds before the Deleted pill morphs back to idle.",
    },
  ],
  howItWorks: [
    {
      title: "Separated gooey backdrop & crisp labels",
      description:
        "Applies feGaussianBlur + feColorMatrix only to the solid backdrop shapes so the liquid neck bridges across the gap without blurring icons or text.",
    },
    {
      title: "Spring-driven split & collapse",
      description:
        "Imperative MotionValue springs drive primary width, cancel pill width, and gap spacing simultaneously so rapid clicks never strand widths.",
    },
    {
      title: "Optional Deleted confirmation",
      description:
        "Confirming either morphs straight back to the Trash circle or briefly shows a Deleted check pill before resetting.",
    },
  ],
};
