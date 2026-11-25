import type { ComponentMeta } from "@/registry/types";
import { type CodeInputConfig, DEFAULT_CODE_INPUT_CONFIG } from "./config";

export const codeInputMeta: ComponentMeta<CodeInputConfig> = {
  slug: "code-input",
  title: "Code Input",
  shortTitle: "Code Input",
  tagline:
    "A lock pill that splits center-outward into OTP digit cells, rolls digits in, verifies with character morphing, or shakes and clears on error",
  description:
    "An interactive one-time-code input for React powered by Motion springs. Clicking splits the Enter code pill center-outward into 4–8 asymmetric rounded cells with a gliding focus ring and blinking caret. Digits roll vertically on entry, collapse inward to Verify, and either morph into a green Verified pill with sheen or shake red and roll digits out right-to-left.\nMade for 2FA verification, SMS/email OTP flows, invite codes, and PIN confirmation.",
  categories: ["Inputs"],
  masonryHeight: 215,
  cardHeightClass: "h-[200px] sm:h-[215px]",
  previewBounds: { width: 310, height: 60 },
  dependencies: [
    "@ui-sdk/react",
    "@ui-sdk/core",
    "react",
    "motion",
    "clsx",
    "tailwind-merge",
  ],
  sourceFiles: ["src/registry/items/code-input/code-input.tsx"],
  defaultConfig: DEFAULT_CODE_INPUT_CONFIG,
  props: [
    {
      name: "length",
      type: "number",
      defaultValue: "6",
      description:
        "Number of digit cells (4 to 8) split out from the center pill.",
    },
    {
      name: "testCode",
      type: "string",
      defaultValue: '"123456"',
      description:
        "Expected numeric code when using built-in demo verification without `onVerify`.",
    },
    {
      name: "onVerify",
      type: "(code: string) => boolean | Promise<boolean>",
      defaultValue: "undefined",
      description:
        "Custom sync or async verifier; returning false triggers the red shake and right-to-left clear.",
    },
    {
      name: "label / busyLabel / doneLabel",
      type: "string",
      defaultValue: '"Enter code" / "Verifying" / "Verified"',
      description:
        "Labels morphed character-by-character across rest, verifying, and verified states.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description:
        "Controls pill and cell height from Small (36px) to Extra Large (54px).",
    },
    {
      name: "theme",
      type: '"light" | "dark"',
      defaultValue: '"light"',
      description:
        "Explicit light or dark surface palette independent of the surrounding page theme.",
    },
    {
      name: "bounce / speed",
      type: "number / number",
      defaultValue: "1 / 1",
      description:
        "Scales spring overshoot (0–1.6) and overall choreography speed (0.5–2).",
    },
    {
      name: "showTray",
      type: "boolean",
      defaultValue: "true",
      description:
        "Toggles the elevated outer pill tray surrounding the button and digit cells.",
    },
  ],
  howItWorks: [
    {
      title: "Center-outward split & edges-inward collapse",
      description:
        "Cells fan out from the center with distance-based spring stagger on open, and fold back edges-first when the final digit triggers verification.",
    },
    {
      title: "Gliding cursor ring & rolling digits",
      description:
        "A single native numeric OTP input drives a gliding inset focus ring that adapts its corner radii per cell while digits roll vertically in and out.",
    },
    {
      title: "Character-morph verification & shake recovery",
      description:
        "Valid codes morph Verifying into green Verified with a diagonal sheen; wrong codes split back out red, kick a horizontal shake, and roll digits out right-to-left.",
    },
  ],
};
