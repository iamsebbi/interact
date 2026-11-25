import type { ComponentMeta } from "@/registry/types";
import {
  DEFAULT_SEARCH_BUTTON_CONFIG,
  type SearchButtonConfig,
} from "./config";

export const searchButtonMeta: ComponentMeta<SearchButtonConfig> = {
  slug: "search-button",
  title: "Search Button",
  shortTitle: "Search",
  tagline:
    "Magnetic circular search button that springs open into an interactive pill search bar",
  description:
    "A morphing search circle button for React. Built on ui-sdk Button, Field, and Input primitives, clicking the circular icon springs open into a full pill search bar with blur-faded input, concentric clear/close action, Escape dismissal, and outside-click collapse.\nMade for navbars, toolbars, command headers, and compact filter bars.",
  categories: ["Inputs"],
  masonryHeight: 210,
  cardHeightClass: "h-[195px] sm:h-[210px]",
  previewBounds: { width: 336, height: 64 },
  dependencies: [
    "@ui-sdk/react",
    "@ui-sdk/core",
    "motion",
    "@animate-ui/react",
  ],
  sourceFiles: [
    "src/registry/items/search-button/search-button.tsx",
    "src/registry/icons/search.tsx",
    "src/registry/icons/x.tsx",
  ],
  defaultConfig: DEFAULT_SEARCH_BUTTON_CONFIG,
  props: [
    {
      name: "open / defaultOpen / onOpenChange",
      type: "boolean / (open: boolean, reason) => void",
      defaultValue: "false",
      description:
        "Controlled or uncontrolled expanded state of the search bar and transition reason callback.",
    },
    {
      name: "value / defaultValue / onValueChange",
      type: "string / (value: string, details) => void",
      defaultValue: '""',
      description:
        "Controlled or uncontrolled query string powered by ui-sdk Input and Field primitives.",
    },
    {
      name: "size / theme",
      type: '"sm" | "md" | "lg" | "xl" / "dark" | "light"',
      defaultValue: '"xl" / "light"',
      description:
        "Controls circle/pill height (36px / 44px / 48px / 54px) and light/dark surface palette.",
    },
    {
      name: "expandedWidth",
      type: "number",
      defaultValue: "320",
      description:
        "Target width in pixels when morphed into the pill search input bar.",
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: '"Search..."',
      description: "Placeholder text shown inside the expanded search input.",
    },
    {
      name: "magnetic / magneticRadius / magneticStrength",
      type: "boolean / number / number",
      defaultValue: "true / 24 / 4",
      description:
        "Enables magnetic cursor attraction on the collapsed circle within magneticRadius (px) outside the button edge up to magneticStrength (px).",
    },
    {
      name: "closeOnOutsideClick / clearOnClose / closeOnSubmit",
      type: "boolean",
      defaultValue: "true / false / false",
      description:
        "Controls outside pointerdown dismissal, query clearing on collapse, and collapse on Enter submit.",
    },
    {
      name: "onSearch / onClear",
      type: "(value: string) => void / () => void",
      defaultValue: "undefined",
      description:
        "Callbacks fired when pressing Enter / clicking the search icon or clearing the query.",
    },
  ],
  howItWorks: [
    {
      title: "ui-sdk Field + Input + Button foundation",
      description:
        "Combines Field focus/filled tracking, Input onValueChange controlled/uncontrolled state, and Button focusableWhenDisabled semantics.",
    },
    {
      title: "Zero-jump circle-to-bar morph",
      description:
        "The left Search icon keeps a constant inset from the pill edge so expanding from a 54px circle to a 320px bar glides smoothly without remounting or snapping.",
    },
    {
      title: "Dual-purpose concentric action & keyboard UX",
      description:
        "Clicking the concentric right X clears non-empty text and refocuses, or collapses when empty; Escape and outside pointerdown dismiss cleanly.",
    },
  ],
};
