"use client";

import { SelectField, Slider, Switch, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import type { ApproveRejectSize } from "./approve-reject";
import {
  APPROVE_REJECT_SIZE_OPTIONS,
  APPROVE_REJECT_THEME_OPTIONS,
  type ApproveRejectConfig,
  type ApproveRejectStudioTheme,
  DEFAULT_APPROVE_REJECT_CONFIG,
} from "./config";

const LABEL_FIELDS: ReadonlyArray<{
  key: "rejectLabel" | "rejectedLabel" | "approveLabel" | "approvedLabel";
  label: string;
  placeholder: string;
}> = [
  { key: "rejectLabel", label: "Reject", placeholder: "Reject" },
  { key: "rejectedLabel", label: "Rejected", placeholder: "Rejected" },
  { key: "approveLabel", label: "Approve", placeholder: "Approve" },
  { key: "approvedLabel", label: "Approved", placeholder: "Approved" },
];

export function ApproveRejectInspector({
  config,
  onChange,
}: ComponentInspectorProps<ApproveRejectConfig>) {
  const patch = (next: Partial<ApproveRejectConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Size"
        value={config.size}
        options={APPROVE_REJECT_SIZE_OPTIONS}
        onValueChange={(next) => patch({ size: next as ApproveRejectSize })}
      />

      <SelectField
        label="Theme"
        value={config.theme}
        options={APPROVE_REJECT_THEME_OPTIONS}
        onValueChange={(next) =>
          patch({ theme: next as ApproveRejectStudioTheme })
        }
      />

      {LABEL_FIELDS.map(({ key, label, placeholder }) => (
        <TextField
          key={key}
          label={label}
          value={config[key]}
          placeholder={placeholder}
          onValueChange={(value) => patch({ [key]: value })}
        />
      ))}

      {config.autoReset && (
        <Slider
          label="Delay"
          value={config.resetDelaySec}
          min={1.0}
          max={6.0}
          step={0.2}
          unit="s"
          defaultValue={DEFAULT_APPROVE_REJECT_CONFIG.resetDelaySec}
          onValueChange={(resetDelaySec) => patch({ resetDelaySec })}
        />
      )}

      <Switch
        label="Tray"
        checked={config.showTray}
        onCheckedChange={(showTray) => patch({ showTray })}
        aria-label="Toggle pill tray container around buttons"
      />

      <Switch
        label="Auto Reset"
        checked={config.autoReset}
        onCheckedChange={(autoReset) => patch({ autoReset })}
        aria-label="Toggle automatic reset timer after confirmation"
      />
    </div>
  );
}
