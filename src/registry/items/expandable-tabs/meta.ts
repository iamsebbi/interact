import type { ComponentMeta } from "@/registry/types";
import {
  DEFAULT_EXPANDABLE_TABS_CONFIG,
  type ExpandableTabsConfig,
} from "./config";

export const expandableTabsMeta: ComponentMeta<ExpandableTabsConfig> = {
  slug: "expandable-tabs",
  title: "Expandable Tabs",
  shortTitle: "Tabs",
  tagline:
    "Bottom-docked navigation bar that expands upward into dynamic content panels while smoothly revealing active tab labels",
  description:
    "A bottom-docked expandable tab bar for React built on Motion springs. Clicking any icon expands the active pill to reveal its label while springing the card upward to reveal measured menu or action panels with smooth blur transitions.\nMade for floating docks, quick command menus, compact toolbars, and mobile-style action trays.",
  categories: ["Selection"],
  masonryHeight: 400,
  cardHeightClass: "h-[380px] sm:h-[400px]",
  gridScale: 0.82,
  previewBounds: { width: 300, height: 290 },
  dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  sourceFiles: ["src/registry/items/expandable-tabs/expandable-tabs.tsx"],
  defaultConfig: DEFAULT_EXPANDABLE_TABS_CONFIG,
  props: [
    {
      name: "items",
      type: "ExpandableTabsItem[]",
      required: true,
      description:
        "Tab entries defining id, label, icon node, and panel content rendered when active.",
    },
    {
      name: "value",
      type: "string | null",
      defaultValue: "undefined",
      description:
        "Controlled active tab id; null renders the compact collapsed icon bar.",
    },
    {
      name: "defaultValue",
      type: "string | null",
      defaultValue: "null",
      description:
        "Initial active tab id when uncontrolled; null starts collapsed.",
    },
    {
      name: "onValueChange",
      type: '(id: string | null, reason?: "tab" | "outside" | "escape") => void',
      defaultValue: "undefined",
      description:
        "Callback fired when a tab is toggled or dismissed via outside click or Escape.",
    },
    {
      name: "closeOnOutsideClick",
      type: "boolean",
      defaultValue: "true",
      description:
        "Closes the expanded panel automatically on outside pointerdown or Escape key.",
    },
    {
      name: "theme",
      type: '"light" | "dark"',
      defaultValue: '"light"',
      description:
        "Explicit light or dark surface palette independent of the surrounding page theme.",
    },
    {
      name: "classNames",
      type: "ExpandableTabsClassNames",
      defaultValue: "undefined",
      description:
        "Slot-level class overrides for root, panel, bar, tab, activeTab, icon, label, and pill.",
    },
  ],
  howItWorks: [
    {
      title: "Measured panel & label bounds",
      description:
        "Hidden offscreen grids and label sizers track intrinsic offsetWidth/offsetHeight via ResizeObserver so shell springs match any content without layout shift.",
    },
    {
      title: "Upward popLayout panel swap",
      description:
        "Switching active tabs cross-fades panels with vertical translate and 4px blur under AnimatePresence while keeping transformOrigin anchored at the bottom.",
    },
    {
      title: "Escape & outside dismissal",
      description:
        "Automatically collapses back to the compact icon bar on Escape or outside pointerdown, with controlled/uncontrolled state and reduced-motion variants.",
    },
  ],
};
