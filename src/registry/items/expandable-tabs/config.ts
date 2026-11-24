import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { ExpandableTabsTheme } from "./expandable-tabs";

export type ExpandableTabsStudioTheme = ExpandableTabsTheme;
export type ExpandableTabsDefaultTab =
  | "none"
  | "launch"
  | "inbox"
  | "flows"
  | "assets"
  | "status";

export interface ExpandableTabsConfig {
  launchLabel: string;
  inboxLabel: string;
  flowsLabel: string;
  assetsLabel: string;
  statusLabel: string;
  defaultTab: ExpandableTabsDefaultTab;
  closeOnOutsideClick: boolean;
  theme: ExpandableTabsStudioTheme;
}

export const DEFAULT_EXPANDABLE_TABS_CONFIG: ExpandableTabsConfig = {
  launchLabel: "Launch",
  inboxLabel: "Inbox",
  flowsLabel: "Flows",
  assetsLabel: "Assets",
  statusLabel: "Status",
  defaultTab: "none",
  closeOnOutsideClick: true,
  theme: "light",
};

export const EXPANDABLE_TABS_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const EXPANDABLE_TABS_DEFAULT_OPTIONS: readonly SelectFieldOption[] = [
  { value: "none", label: "Collapsed" },
  { value: "launch", label: "Launch" },
  { value: "inbox", label: "Inbox" },
  { value: "flows", label: "Flows" },
  { value: "assets", label: "Assets" },
  { value: "status", label: "Status" },
];

export function buildExpandableTabsJsx(config: ExpandableTabsConfig): string {
  const esc = (s: string) => s.replace(/"/g, '\\"');
  const lines = [
    `import { ExpandableTabs } from "@/components/ui/expandable-tabs";`,
    ``,
    `<ExpandableTabs`,
    `  items={[`,
    `    { id: "launch", label: "${esc(config.launchLabel || "Launch")}", icon: <Rocket className="h-4 w-4" />, content: <LaunchMenu /> },`,
    `    { id: "inbox", label: "${esc(config.inboxLabel || "Inbox")}", icon: <Inbox className="h-4 w-4" />, content: <InboxMenu /> },`,
    `    { id: "flows", label: "${esc(config.flowsLabel || "Flows")}", icon: <Workflow className="h-4 w-4" />, content: <FlowsMenu /> },`,
    `    { id: "assets", label: "${esc(config.assetsLabel || "Assets")}", icon: <PackageOpen className="h-4 w-4" />, content: <AssetsMenu /> },`,
    `    { id: "status", label: "${esc(config.statusLabel || "Status")}", icon: <ChartSpline className="h-4 w-4" />, content: <StatusMenu /> },`,
    `  ]}`,
  ];
  if (config.defaultTab !== DEFAULT_EXPANDABLE_TABS_CONFIG.defaultTab) {
    lines.push(`  defaultValue="${config.defaultTab}"`);
  }
  if (!config.closeOnOutsideClick) {
    lines.push(`  closeOnOutsideClick={false}`);
  }
  if (config.theme !== DEFAULT_EXPANDABLE_TABS_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildExpandableTabsAiPrompt(
  config: ExpandableTabsConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/expandable-tabs.json",
): string {
  return [
    "Implement the Expandable Tabs component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: react, motion, clsx, tailwind-merge",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildExpandableTabsJsx(config),
    "```",
  ].join("\n");
}

export const expandableTabsGenerators: ComponentGenerators<ExpandableTabsConfig> =
  {
    buildJsx: buildExpandableTabsJsx,
    buildAiPrompt: buildExpandableTabsAiPrompt,
  };
