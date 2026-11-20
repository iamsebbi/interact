import { BlobShape } from "@/types/gradient";
import { Layers } from "@/components/animate-ui/icons/layers";
import { Sparkles } from "@/components/animate-ui/icons/sparkles";
import React from "react";
import { BLOB_SHAPES_PACK_2 } from "./shapesPack2";

export interface BlobShapePreset {
  id: BlobShape;
  label: string;
  description: string;
  borderRadius?: string;
  clipPath?: string;
  svgPath?: string;
}

export interface ShapePack {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  shapes: BlobShapePreset[];
}

export const BLOB_SHAPES_PACK_1: BlobShapePreset[] = [
  {
    id: "circle",
    label: "Circle",
    description: "Classic sphere / uniform ellipse",
    borderRadius: "50%",
  },
  {
    id: "pill",
    label: "Pill",
    description: "Elongated capsule with rounded ends",
    borderRadius: "9999px",
  },
  {
    id: "squircle",
    label: "Squircle",
    description: "Super-rounded square (iOS style)",
    borderRadius: "28%",
  },
  {
    id: "organic",
    label: "Organic",
    description: "Natural asymmetric amorphous blob",
    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
  },
  {
    id: "fluid",
    label: "Fluid",
    description: "Undulating fluid wave shape",
    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
  },
  {
    id: "teardrop",
    label: "Teardrop",
    description: "Directional asymmetric droplet",
    borderRadius: "50% 50% 50% 0%",
  },
  {
    id: "diamond",
    label: "Diamond",
    description: "Soft-cornered diamond",
    borderRadius: "12% 88% 12% 88% / 88% 12% 88% 12%",
  },
  {
    id: "petal",
    label: "Petal",
    description: "Diagonal curved leaf / petal",
    borderRadius: "0% 100% 0% 100% / 0% 100% 0% 100%",
  },
  {
    id: "egg",
    label: "Ovoid",
    description: "Natural ovoid silhouette",
    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
  },
  {
    id: "pebble",
    label: "Pebble",
    description: "Smooth asymmetric river stone",
    borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
  },
  {
    id: "star",
    label: "4-Pt Star",
    description: "Radiant 4-point sparkle",
    clipPath:
      "polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%)",
  },
  {
    id: "triangle",
    label: "Triangle",
    description: "Pointed geometric triangle",
    clipPath: "polygon(50% 8%, 95% 90%, 5% 90%)",
  },
  {
    id: "hourglass",
    label: "Hourglass",
    description: "Flared pinch beam (Stripe / Linear style)",
    svgPath:
      "M 0 0 C 80 80, 115 110, 128 116 C 141 110, 176 80, 256 0 L 256 256 C 176 176, 141 146, 128 140 C 115 146, 80 176, 0 256 Z",
  },
  {
    id: "cross-flare",
    label: "Cross Flare",
    description: "4-point stellar lens flare (Web3 / Apple style)",
    svgPath:
      "M 128 0 C 128 90, 90 128, 0 128 C 90 128, 128 166, 128 256 C 128 166, 166 128, 256 128 C 166 128, 128 90, 128 0 Z",
  },
  {
    id: "wave-curve",
    label: "Horizon Wave",
    description: "Wavy fluid horizon band",
    svgPath:
      "M 0 160 C 60 115, 125 75, 180 115 C 215 140, 240 155, 256 165 L 256 256 L 0 256 Z",
  },
  {
    id: "parabola-dome",
    label: "Parabolic Dome",
    description: "Parabolic arch for celestial auroras",
    svgPath:
      "M 8 256 C 30 170, 72 35, 128 16 C 184 35, 226 170, 248 256 Z",
  },
];

export const SHAPE_PACKS: ShapePack[] = [
  {
    id: "pack-1",
    label: "Pack 1: Essentials",
    description: "16 core organic and geometric shapes",
    icon: Layers,
    color: "#818cf8",
    shapes: BLOB_SHAPES_PACK_1,
  },
  {
    id: "pack-2",
    label: "Pack 2: Custom Desktop",
    description: "Collection of 72 Brutalist vector shapes",
    icon: Sparkles,
    color: "#f472b6",
    shapes: BLOB_SHAPES_PACK_2,
  },
];

export const BLOB_SHAPES: BlobShapePreset[] = [
  ...BLOB_SHAPES_PACK_1,
  ...BLOB_SHAPES_PACK_2,
];

export function getBlobShapeStyle(blob?: { shape?: BlobShape; pill?: boolean } | null) {
  if (!blob) {
    return {
      borderRadius: "50%",
      clipPath: undefined,
      svgPath: undefined,
      shapeId: "circle" as BlobShape,
      label: "Circle",
    };
  }

  const shapeId: BlobShape = blob.shape ?? (blob.pill ? "pill" : "circle");
  const shape = BLOB_SHAPES.find((s) => s.id === shapeId) || BLOB_SHAPES[0];

  return {
    borderRadius: shape.borderRadius,
    clipPath: shape.clipPath,
    svgPath: shape.svgPath,
    shapeId,
    label: shape.label,
  };
}
