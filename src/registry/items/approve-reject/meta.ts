import type { ComponentMeta } from "@/registry/types";
import {
  type ApproveRejectConfig,
  DEFAULT_APPROVE_REJECT_CONFIG,
} from "./config";

export const approveRejectMeta: ComponentMeta<ApproveRejectConfig> = {
  slug: "approve-reject",
  title: "Approve Reject",
  shortTitle: "Approve Reject",
  tagline:
    "Contextual two-button decision pair where the chosen pill expands into confirmation and the opposite morphs into Undo",
  description:
    "A contextual two-button decision pair for React built on ui-sdk Button primitives. Both pills rest in neutral surfaces with colored X and Check icons; picking Approve or Reject expands that pill into a colored confirmation state while the opposite pill morphs into a circular Undo button.\nMade for agent approvals, PR reviews, moderation queues, and confirmation bars.",
  categories: ["Actions"],
  masonryHeight: 210,
  cardHeightClass: "h-[195px] sm:h-[210px]",
  previewBounds: { width: 270, height: 56 },
  dependencies: [
    "@ui-sdk/react",
    "@ui-sdk/core",
    "motion",
    "@animate-ui/react",
  ],
  sourceFiles: [
    "src/registry/items/approve-reject/approve-reject.tsx",
    "src/registry/icons/check.tsx",
    "src/registry/icons/undo-2.tsx",
    "src/registry/icons/x.tsx",
  ],
  defaultConfig: DEFAULT_APPROVE_REJECT_CONFIG,
  props: [
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"xl"',
      description:
        "Controls pill height, circle diameter, gap, and icon scale across Small (36px) to Extra Large (54px).",
    },
    {
      name: "theme",
      type: '"light" | "dark"',
      defaultValue: '"light"',
      description:
        "Explicit light or dark surface palette across idle and confirmed pills (defaults to light).",
    },
    {
      name: "rejectLabel / rejectedLabel",
      type: "string / string",
      defaultValue: '"Reject" / "Rejected"',
      description:
        "Idle and expanded confirmation labels for the left Reject action.",
    },
    {
      name: "approveLabel / approvedLabel",
      type: "string / string",
      defaultValue: '"Approve" / "Approved"',
      description:
        "Idle and expanded confirmation labels for the right Approve action.",
    },
    {
      name: "status / defaultStatus",
      type: '"idle" | "approved" | "rejected"',
      defaultValue: 'undefined / "idle"',
      description: "Controlled or initial decision state.",
    },
    {
      name: "autoReset",
      type: "boolean",
      defaultValue: "true",
      description:
        "Automatically returns to idle after resetDelayMs if Undo is not pressed.",
    },
    {
      name: "resetDelayMs",
      type: "number",
      defaultValue: "2400",
      description:
        "Duration in milliseconds before auto-resetting back to idle.",
    },
  ],
  howItWorks: [
    {
      title: "Constant total container width",
      description:
        "Offscreen sizers measure all four label states so the left and right widths always sum to the same total, letting the gap glide cleanly with zero layout shift.",
    },
    {
      title: "Neutral idle with semantic icons",
      description:
        "Keeps both surfaces and labels neutral at rest while coloring only the X and Check icons, then transitions the chosen pill to solid red or green on confirmation.",
    },
    {
      title: "Symmetric Undo slot",
      description:
        "Collapses the unchosen button into a circular Undo2 button with draw animation matching the pill height, restoring idle state on click.",
    },
  ],
};
