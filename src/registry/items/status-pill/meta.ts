import type { ComponentMeta } from "@/registry/types";
import { DEFAULT_STATUS_PILL_CONFIG, type StatusPillConfig } from "./config";

export const statusPillMeta: ComponentMeta<StatusPillConfig> = {
  slug: "status-pill",
  title: "Status Pill",
  shortTitle: "Status Pill",
  tagline:
    "Sync indicator pill that counts files down with a filling ring, confirms with a green sheen, and splits out Retry on failure",
  description:
    "An interactive sync status pill for React powered by Motion springs. Clicking starts a live countdown across queued files as an SVG progress ring fills, morphing into a green Synced capsule with a diagonal sheen — or splitting out a dark Retry pill on failure that resumes right where sync left off.\nMade for cloud sync indicators, document autosave badges, deployment bars, and background job triggers.",
  categories: ["Loading", "Press"],
  masonryHeight: 210,
  cardHeightClass: "h-[195px] sm:h-[210px]",
  previewBounds: { width: 290, height: 60 },
  dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  sourceFiles: ["src/registry/items/status-pill/status-pill.tsx"],
  defaultConfig: DEFAULT_STATUS_PILL_CONFIG,
  props: [
    {
      name: "status",
      type: '"idle" | "syncing" | "done" | "failed"',
      defaultValue: "undefined",
      description:
        "Controlled sync status; omit to let clicking run the built-in interactive sync simulation.",
    },
    {
      name: "remaining / total",
      type: "number / number",
      defaultValue: "undefined",
      description:
        "Controlled remaining and total file counts driving the label and SVG progress ring.",
    },
    {
      name: "demoFiles / demoMode",
      type: 'number / "alternate" | "succeed" | "fail"',
      defaultValue: '4 / "alternate"',
      description:
        "File count and success/failure behavior in interactive demo mode.",
    },
    {
      name: "idleLabel / doneLabel / failLabel / retryLabel",
      type: "string",
      defaultValue: '"Up to date" / "Synced" / "Sync failed" / "Retry"',
      description:
        "Labels displayed across idle, synced, failed, and retry pills.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description:
        "Controls capsule height from Small (36px) to Extra Large (54px).",
    },
    {
      name: "theme",
      type: '"light" | "dark"',
      defaultValue: '"light"',
      description:
        "Explicit light or dark surface palette independent of the surrounding page theme.",
    },
    {
      name: "showTray",
      type: "boolean",
      defaultValue: "true",
      description:
        "Toggles the elevated outer pill tray around the status and Retry capsules.",
    },
  ],
  howItWorks: [
    {
      title: "Measured width morphing",
      description:
        "Hidden sizers track exact main-capsule and Retry-button widths via offsetWidth so the outer tray springs smoothly across every state change without text clipping.",
    },
    {
      title: "Filling ring & rolling countdown",
      description:
        "Swaps the CloudCheck icon into an animated SVG stroke ring while remaining file counts roll vertically through AnimatePresence.",
    },
    {
      title: "Split-out Retry recovery",
      description:
        "On failure, the tray widens 120ms later to pop out a dark Retry pill that resumes syncing from the exact remaining file count.",
    },
  ],
};
