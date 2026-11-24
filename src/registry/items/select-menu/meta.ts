import type { ComponentMeta } from "@/registry/types";
import { DEFAULT_SELECT_MENU_CONFIG, type SelectMenuConfig } from "./config";

export const selectMenuMeta: ComponentMeta<SelectMenuConfig> = {
  slug: "select-menu",
  title: "Select Menu",
  shortTitle: "Select Menu",
  tagline:
    "Morphing pill selector that opens in place around its current value and collapses cleanly back around the newly chosen option",
  description:
    "A single-surface morphing select menu for React powered by synchronized Motion springs. Clicking the compact capsule expands it upward and downward around the active row while fading the prefix, morphing chevrons into a sliding checkmark, and cascading surrounding options outward — then folds smoothly back to the exact width of the new choice.\nMade for sort menus, compact filter bars, inspector dropdowns, and macOS-inspired toolbars.",
  categories: ["Select", "Press"],
  masonryHeight: 340,
  cardHeightClass: "h-[320px] sm:h-[340px]",
  previewBounds: { width: 280, height: 270 },
  dependencies: ["react", "motion", "clsx", "tailwind-merge"],
  sourceFiles: ["src/registry/items/select-menu/select-menu.tsx"],
  defaultConfig: DEFAULT_SELECT_MENU_CONFIG,
  props: [
    {
      name: "items",
      type: "readonly (string | { value: string; label: string; disabled?: boolean })[]",
      required: true,
      description:
        "Ordered list of selectable options as strings or value/label objects with optional disabled entries.",
    },
    {
      name: "label",
      type: "string",
      defaultValue: '"Sort"',
      description:
        "Optional muted inline prefix shown before the selected value when closed; fades out smoothly on open.",
    },
    {
      name: "value / defaultValue",
      type: "string",
      defaultValue: "undefined / first item",
      description: "Controlled active value or initial uncontrolled selection.",
    },
    {
      name: "open / defaultOpen",
      type: "boolean",
      defaultValue: "undefined / false",
      description: "Controlled or initial open state of the morphing menu.",
    },
    {
      name: "onValueChange / onOpenChange",
      type: "(value: string, index: number) => void / (open: boolean) => void",
      defaultValue: "undefined",
      description:
        "Callbacks invoked when an option is selected or when the menu opens or closes.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description:
        "Controls row height, capsule inset, font size, and icon scale from Small (36px) to Extra Large (54px).",
    },
    {
      name: "theme",
      type: '"light" | "dark"',
      defaultValue: '"light"',
      description:
        "Explicit light or dark surface palette independent of the surrounding page theme.",
    },
    {
      name: "bounce / speed / blur",
      type: "number",
      defaultValue: "1 / 1 / 1",
      description:
        "Fine-tune spring overshoot (0–1.6), choreography speed (0.5–2), and optical blur intensity (0–2).",
    },
    {
      name: "showTray",
      type: "boolean",
      defaultValue: "true",
      description:
        "Toggles the elevated outer pill surface and layered shadow around the active row highlight.",
    },
  ],
  howItWorks: [
    {
      title: "In-place morph anchored to the active row",
      description:
        "Outer placeholder width stays locked while the floating capsule springs its width, height, vertical offset, and internal content offset simultaneously so the selected option never jumps vertically.",
    },
    {
      title: "Three-stage open & close choreography",
      description:
        "Width expands first while the prefix blurs out and chevrons morph into a checkmark; 50ms later the list blooms vertically and neighboring rows ripple in outward by distance from the active index.",
    },
    {
      title: "Gliding highlight & checkmark travel",
      description:
        "Hovering or pressing ArrowUp/ArrowDown glides the highlight pill with a snap spring; picking a row glides the checkmark onto it before collapsing smoothly to the new label's exact width.",
    },
  ],
};
