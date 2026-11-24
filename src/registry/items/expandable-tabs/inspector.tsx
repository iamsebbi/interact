"use client";

import { SelectField, Switch, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  EXPANDABLE_TABS_DEFAULT_OPTIONS,
  EXPANDABLE_TABS_THEME_OPTIONS,
  type ExpandableTabsConfig,
  type ExpandableTabsDefaultTab,
  type ExpandableTabsStudioTheme,
} from "./config";

const TAB_LABEL_FIELDS: ReadonlyArray<{
  key:
    | "launchLabel"
    | "inboxLabel"
    | "flowsLabel"
    | "assetsLabel"
    | "statusLabel";
  label: string;
  placeholder: string;
}> = [
  { key: "launchLabel", label: "Tab 1", placeholder: "Launch" },
  { key: "inboxLabel", label: "Tab 2", placeholder: "Inbox" },
  { key: "flowsLabel", label: "Tab 3", placeholder: "Flows" },
  { key: "assetsLabel", label: "Tab 4", placeholder: "Assets" },
  { key: "statusLabel", label: "Tab 5", placeholder: "Status" },
];

export function ExpandableTabsInspector({
  config,
  onChange,
}: ComponentInspectorProps<ExpandableTabsConfig>) {
  const patch = (next: Partial<ExpandableTabsConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Theme"
        value={config.theme}
        options={EXPANDABLE_TABS_THEME_OPTIONS}
        onValueChange={(next) =>
          patch({ theme: next as ExpandableTabsStudioTheme })
        }
      />

      <SelectField
        label="Default Tab"
        value={config.defaultTab}
        options={EXPANDABLE_TABS_DEFAULT_OPTIONS}
        onValueChange={(next) =>
          patch({ defaultTab: next as ExpandableTabsDefaultTab })
        }
      />

      {TAB_LABEL_FIELDS.map(({ key, label, placeholder }) => (
        <TextField
          key={key}
          label={label}
          value={config[key]}
          placeholder={placeholder}
          onValueChange={(value) => patch({ [key]: value })}
        />
      ))}

      <Switch
        label="Close Outside"
        checked={config.closeOnOutsideClick}
        onCheckedChange={(closeOnOutsideClick) =>
          patch({ closeOnOutsideClick })
        }
        aria-label="Toggle closing expanded panel when clicking outside"
      />
    </div>
  );
}
