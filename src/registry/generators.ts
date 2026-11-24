import { approveRejectGenerators } from "./items/approve-reject/config";
import { deleteButtonGenerators } from "./items/delete-button/config";
import { distortionWavesGenerators } from "./items/distortion-waves/config";
import { downloadButtonGenerators } from "./items/download-button/config";
import { expandableTabsGenerators } from "./items/expandable-tabs/config";
import { heatMapGenerators } from "./items/heat-map/config";
import { meetingSchedulerGenerators } from "./items/meeting-scheduler/config";
import { searchButtonGenerators } from "./items/search-button/config";
import { segmentedControlGenerators } from "./items/segmented-control/config";
import { selectMenuGenerators } from "./items/select-menu/config";
import { statusPillGenerators } from "./items/status-pill/config";
import { stepPlayerGenerators } from "./items/step-player/config";
import { updateButtonGenerators } from "./items/update-button/config";
import { uploadButtonGenerators } from "./items/upload-button/config";
import { voiceAssistantCardGenerators } from "./items/voice-assistant-card/config";
import { voiceButtonGenerators } from "./items/voice-button/config";
import type { ComponentGenerators } from "./types";

/**
 * Pure TypeScript code/prompt generators per component slug.
 * Safe to import in Server Components (e.g. initial Shiki Usage highlighting)
 * and Client Components without pulling in React UI or CSS bundles.
 */
export const COMPONENT_GENERATORS = {
  "download-button": downloadButtonGenerators,
  "upload-button": uploadButtonGenerators,
  "search-button": searchButtonGenerators,
  "update-button": updateButtonGenerators,
  "voice-button": voiceButtonGenerators,
  "step-player": stepPlayerGenerators,
  "heat-map": heatMapGenerators,
  "approve-reject": approveRejectGenerators,
  "delete-button": deleteButtonGenerators,
  "expandable-tabs": expandableTabsGenerators,
  "segmented-control": segmentedControlGenerators,
  "select-menu": selectMenuGenerators,
  "meeting-scheduler": meetingSchedulerGenerators,
  "status-pill": statusPillGenerators,
  "voice-assistant-card": voiceAssistantCardGenerators,
  "distortion-waves": distortionWavesGenerators,
} as unknown as Record<string, ComponentGenerators<Record<string, unknown>>>;

export function getComponentGenerators(
  slug: string,
): ComponentGenerators<Record<string, unknown>> | undefined {
  return COMPONENT_GENERATORS[slug];
}
