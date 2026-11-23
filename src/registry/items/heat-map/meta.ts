import type { ComponentMeta } from "@/registry/types";
import { DEFAULT_HEAT_MAP_CONFIG, type HeatMapConfig } from "./config";

export const heatMapMeta: ComponentMeta<HeatMapConfig> = {
  slug: "heat-map",
  title: "Heat Map",
  shortTitle: "Heat Map",
  tagline:
    "Interactive canvas field with 256-entry thermal LUT, melting cursor cooling, and click-to-cycle liquid shapes",
  description:
    "An interactive thermal-field canvas for React built with zero external dependencies. Shapes and typography rest in flat neutral grey until the cursor moves near, swelling nearby dots and melting strokes through a 256-entry thermal palette.\nMade for creative hero headers, interactive brand marks, playful cards, and experimental canvases.",
  categories: ["Hover", "Press"],
  masonryHeight: 280,
  cardHeightClass: "h-[250px] sm:h-[280px]",
  gridScale: 0.9,
  previewBounds: { width: 300, height: 170 },
  dependencies: ["react"],
  sourceFiles: [
    "src/registry/items/heat-map/heat-map.tsx",
    "src/registry/items/heat-map/heat-map.css",
  ],
  defaultConfig: DEFAULT_HEAT_MAP_CONFIG,
  props: [
    {
      name: "shape",
      type: '"Dots" | "Asterisk" | "Word" | "Rosette" | "Rings" | "Clover"',
      defaultValue: '"Clover"',
      description:
        "Initial shape rendered in the field; clicking cycles to the next shape.",
    },
    {
      name: "colors",
      type: '"Neon" | "Fire" | "Sea" | "Pop"',
      defaultValue: '"Neon"',
      description:
        "256-entry thermal color palette revealed around the pointer.",
    },
    {
      name: "heat",
      type: "number",
      defaultValue: "60",
      description:
        "Intensity and radius of the cursor cooling effect (0..100).",
    },
    {
      name: "soft",
      type: "number",
      defaultValue: "50",
      description: "Shadow blur softness of the underlying field (0..100).",
    },
    {
      name: "area",
      type: "number",
      defaultValue: "50",
      description:
        "Size multiplier for the reveal patch and dot swelling radius (0..100).",
    },
    {
      name: "replaySignal",
      type: "number",
      defaultValue: "0",
      description:
        "Incrementing counter that triggers a synthetic pointer sweep across the shape.",
    },
  ],
  howItWorks: [
    {
      title: "Shadow-blurred brightness field",
      description:
        "Renders strokes off-screen with shadowBlur (avoiding Safari ctx.filter gaps) so nearby dots and stems overlap and pool seamlessly.",
    },
    {
      title: "Cursor cooling & thermal LUT",
      description:
        "Applies a radial multiply gradient around the pointer so core strokes thin and split into concentric bands across a cached 256-entry color lookup table.",
    },
    {
      title: "On-demand animation loop",
      description:
        "Only runs requestAnimationFrame while pointer position, presence, or shape melt-in is settling, parking completely at rest.",
    },
  ],
};
