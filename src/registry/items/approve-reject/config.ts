import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { ApproveRejectSize, ApproveRejectTheme } from "./approve-reject";

export type ApproveRejectStudioTheme = ApproveRejectTheme;

export interface ApproveRejectConfig {
  approveLabel: string;
  approvedLabel: string;
  rejectLabel: string;
  rejectedLabel: string;
  autoReset: boolean;
  resetDelaySec: number;
  size: ApproveRejectSize;
  theme: ApproveRejectStudioTheme;
}

export const DEFAULT_APPROVE_REJECT_CONFIG: ApproveRejectConfig = {
  approveLabel: "Approve",
  approvedLabel: "Approved",
  rejectLabel: "Reject",
  rejectedLabel: "Rejected",
  autoReset: true,
  resetDelaySec: 2.4,
  size: "xl",
  theme: "light",
};

export const APPROVE_REJECT_SIZE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

export const APPROVE_REJECT_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function buildApproveRejectJsx(config: ApproveRejectConfig): string {
  const approveLabel =
    config.approveLabel || DEFAULT_APPROVE_REJECT_CONFIG.approveLabel;
  const approvedLabel =
    config.approvedLabel || DEFAULT_APPROVE_REJECT_CONFIG.approvedLabel;
  const rejectLabel =
    config.rejectLabel || DEFAULT_APPROVE_REJECT_CONFIG.rejectLabel;
  const rejectedLabel =
    config.rejectedLabel || DEFAULT_APPROVE_REJECT_CONFIG.rejectedLabel;

  const lines = [
    `import { ApproveReject } from "@/components/ui/approve-reject";`,
    ``,
    `<ApproveReject`,
  ];
  if (approveLabel !== DEFAULT_APPROVE_REJECT_CONFIG.approveLabel) {
    lines.push(`  approveLabel="${approveLabel.replace(/"/g, '\\"')}"`);
  }
  if (approvedLabel !== DEFAULT_APPROVE_REJECT_CONFIG.approvedLabel) {
    lines.push(`  approvedLabel="${approvedLabel.replace(/"/g, '\\"')}"`);
  }
  if (rejectLabel !== DEFAULT_APPROVE_REJECT_CONFIG.rejectLabel) {
    lines.push(`  rejectLabel="${rejectLabel.replace(/"/g, '\\"')}"`);
  }
  if (rejectedLabel !== DEFAULT_APPROVE_REJECT_CONFIG.rejectedLabel) {
    lines.push(`  rejectedLabel="${rejectedLabel.replace(/"/g, '\\"')}"`);
  }
  if (!config.autoReset) {
    lines.push(`  autoReset={false}`);
  } else if (
    config.resetDelaySec !== DEFAULT_APPROVE_REJECT_CONFIG.resetDelaySec
  ) {
    lines.push(`  resetDelayMs={${Math.round(config.resetDelaySec * 1000)}}`);
  }
  if (config.size !== DEFAULT_APPROVE_REJECT_CONFIG.size) {
    lines.push(`  size="${config.size}"`);
  }
  if (config.theme !== DEFAULT_APPROVE_REJECT_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  lines.push(`  onApprove={() => console.log("Approved")}`);
  lines.push(`  onReject={() => console.log("Rejected")}`);
  lines.push(`  onUndo={(prev) => console.log("Undid", prev)}`);
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildApproveRejectAiPrompt(
  config: ApproveRejectConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/approve-reject.json",
): string {
  return [
    "Implement the Approve Reject component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, motion, @animate-ui/react",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildApproveRejectJsx(config),
    "```",
  ].join("\n");
}

export const approveRejectGenerators: ComponentGenerators<ApproveRejectConfig> =
  {
    buildJsx: buildApproveRejectJsx,
    buildAiPrompt: buildApproveRejectAiPrompt,
  };
