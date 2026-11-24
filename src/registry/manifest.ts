import { approveRejectMeta } from "./items/approve-reject/meta";
import { deleteButtonMeta } from "./items/delete-button/meta";
import { distortionWavesMeta } from "./items/distortion-waves/meta";
import { downloadButtonMeta } from "./items/download-button/meta";
import { expandableTabsMeta } from "./items/expandable-tabs/meta";
import { heatMapMeta } from "./items/heat-map/meta";
import { meetingSchedulerMeta } from "./items/meeting-scheduler/meta";
import { searchButtonMeta } from "./items/search-button/meta";
import { segmentedControlMeta } from "./items/segmented-control/meta";
import { selectMenuMeta } from "./items/select-menu/meta";
import { statusPillMeta } from "./items/status-pill/meta";
import { stepPlayerMeta } from "./items/step-player/meta";
import { updateButtonMeta } from "./items/update-button/meta";
import { uploadButtonMeta } from "./items/upload-button/meta";
import { voiceAssistantCardMeta } from "./items/voice-assistant-card/meta";
import { voiceButtonMeta } from "./items/voice-button/meta";
import type { ComponentMeta, InteractionCategory } from "./types";

/**
 * Pure serializable manifest of all migrated registry items.
 * Never import React components, CSS files, or functions here so Server Components
 * and Node CLI scripts (`scripts/check-registry.ts`) stay fast and crash-free.
 */
export const CATALOG_META: readonly ComponentMeta<Record<string, unknown>>[] = [
  downloadButtonMeta,
  uploadButtonMeta,
  searchButtonMeta,
  updateButtonMeta,
  voiceButtonMeta,
  stepPlayerMeta,
  heatMapMeta,
  approveRejectMeta,
  deleteButtonMeta,
  expandableTabsMeta,
  segmentedControlMeta,
  selectMenuMeta,
  meetingSchedulerMeta,
  statusPillMeta,
  voiceAssistantCardMeta,
  distortionWavesMeta,
] as unknown as readonly ComponentMeta<Record<string, unknown>>[];

export const REGISTRY_BASE_URL =
  process.env.NEXT_PUBLIC_REGISTRY_URL?.replace(/\/+$/, "") ||
  "https://interact.dev/r";

export function getComponentMetaBySlug(
  slug: string,
): ComponentMeta<Record<string, unknown>> | undefined {
  return CATALOG_META.find((entry) => entry.slug === slug);
}

export function getComponentsMetaByCategory(
  category: InteractionCategory | "All",
): readonly ComponentMeta<Record<string, unknown>>[] {
  const visible = CATALOG_META.filter((entry) => !entry.hiddenOnHome);
  if (category === "All") return visible;
  return visible.filter((entry) => entry.categories.includes(category));
}

export function getRegistryCliCommand(slug: string): string {
  return `pnpm dlx shadcn@latest add ${REGISTRY_BASE_URL}/${slug}.json`;
}
