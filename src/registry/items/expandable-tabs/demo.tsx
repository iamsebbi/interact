"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import {
  DEFAULT_EXPANDABLE_TABS_CONFIG,
  type ExpandableTabsConfig,
} from "./config";
import { ExpandableTabs, type ExpandableTabsItem } from "./expandable-tabs";

const PLAY_CYCLE: ReadonlyArray<string | null> = [
  "launch",
  "inbox",
  "flows",
  "assets",
  "status",
  null,
];

function LucideIcon({
  children,
  className = "h-4 w-4",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

const ChevronRightGlyph = () => (
  <LucideIcon className="h-4 w-4 shrink-0 text-muted-foreground">
    <path d="m9 18 6-6-6-6" />
  </LucideIcon>
);

const RocketIcon = () => (
  <LucideIcon>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </LucideIcon>
);

const InboxIcon = () => (
  <LucideIcon>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </LucideIcon>
);

const WorkflowIcon = () => (
  <LucideIcon>
    <rect width="8" height="8" x="3" y="3" rx="2" />
    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
    <rect width="8" height="8" x="13" y="13" rx="2" />
  </LucideIcon>
);

const PackageOpenIcon = () => (
  <LucideIcon>
    <path d="M12 22v-9" />
    <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
    <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
    <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
  </LucideIcon>
);

const ChartSplineIcon = () => (
  <LucideIcon>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" />
  </LucideIcon>
);

const RowIcons = {
  fileText: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </LucideIcon>
  ),
  clipboardCheck: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </LucideIcon>
  ),
  megaphone: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </LucideIcon>
  ),
  calendarClock: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.5 17.5 16 16.3V14" />
      <circle cx="16" cy="16" r="6" />
    </LucideIcon>
  ),
  cloudUpload: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M12 13v8" />
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="m8 17 4-4 4 4" />
    </LucideIcon>
  ),
  messageCircle: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </LucideIcon>
  ),
  users: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </LucideIcon>
  ),
  badgeCheck: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </LucideIcon>
  ),
  gitBranch: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </LucideIcon>
  ),
  webhook: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
      <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
      <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
    </LucideIcon>
  ),
  refreshCw: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </LucideIcon>
  ),
  swatchBook: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z" />
      <path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7" />
      <path d="M 7 17h.01" />
      <path d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8" />
    </LucideIcon>
  ),
  images: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M18 22H4a2 2 0 0 1-2-2V6" />
      <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
      <circle cx="12" cy="8" r="2" />
      <rect width="16" height="16" x="6" y="2" rx="2" />
    </LucideIcon>
  ),
  brush: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </LucideIcon>
  ),
  gauge: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </LucideIcon>
  ),
  chartSpline: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" />
    </LucideIcon>
  ),
  siren: () => (
    <LucideIcon className="h-4 w-4 text-muted-foreground">
      <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
      <path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
      <path d="M21 12h1" />
      <path d="M18.5 4.5 18 5" />
      <path d="M2 12h1" />
      <path d="M12 2v1" />
      <path d="m4.929 4.929.707.707" />
      <path d="M12 12v6" />
    </LucideIcon>
  ),
} as const;

type RowIconKey = keyof typeof RowIcons;

function Menu({
  rows,
}: {
  rows: ReadonlyArray<{ icon: RowIconKey; label: string }>;
}) {
  return (
    <div className="flex w-[17.125rem] flex-col gap-0.5">
      {rows.map(({ icon, label }) => {
        const Icon = RowIcons[icon];
        return (
          <button
            key={label}
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted active:scale-100"
          >
            <Icon />
            <span className="flex-1">{label}</span>
            <ChevronRightGlyph />
          </button>
        );
      })}
    </div>
  );
}

function createExpandableTabsDemoItems(
  config: Pick<
    ExpandableTabsConfig,
    "launchLabel" | "inboxLabel" | "flowsLabel" | "assetsLabel" | "statusLabel"
  >,
): ExpandableTabsItem[] {
  return [
    {
      id: "launch",
      label: config.launchLabel || "Launch",
      icon: <RocketIcon />,
      content: (
        <Menu
          rows={[
            { icon: "fileText", label: "Release Brief" },
            { icon: "clipboardCheck", label: "Launch Checklist" },
            { icon: "megaphone", label: "Campaign Notes" },
            { icon: "calendarClock", label: "Rollout Calendar" },
            { icon: "cloudUpload", label: "Ship Build" },
          ]}
        />
      ),
    },
    {
      id: "inbox",
      label: config.inboxLabel || "Inbox",
      icon: <InboxIcon />,
      content: (
        <Menu
          rows={[
            { icon: "messageCircle", label: "Client Feedback" },
            { icon: "users", label: "Team Requests" },
            { icon: "badgeCheck", label: "Approval Notes" },
          ]}
        />
      ),
    },
    {
      id: "flows",
      label: config.flowsLabel || "Flows",
      icon: <WorkflowIcon />,
      content: (
        <Menu
          rows={[
            { icon: "gitBranch", label: "Trigger Map" },
            { icon: "webhook", label: "Webhook Runs" },
            { icon: "refreshCw", label: "Retry Queue" },
          ]}
        />
      ),
    },
    {
      id: "assets",
      label: config.assetsLabel || "Assets",
      icon: <PackageOpenIcon />,
      content: (
        <Menu
          rows={[
            { icon: "swatchBook", label: "Brand Kit" },
            { icon: "images", label: "Mockup Library" },
            { icon: "brush", label: "Design Tokens" },
            { icon: "cloudUpload", label: "Export Queue" },
          ]}
        />
      ),
    },
    {
      id: "status",
      label: config.statusLabel || "Status",
      icon: <ChartSplineIcon />,
      content: (
        <Menu
          rows={[
            { icon: "gauge", label: "Activation" },
            { icon: "chartSpline", label: "Conversion" },
            { icon: "siren", label: "Incidents" },
          ]}
        />
      ),
    },
  ];
}

export function ExpandableTabsPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  const signal = replaySignal ?? 0;
  const isActive = previewActive ?? signal > 0;
  const [tabValue, setTabValue] = useState<string | null>(null);

  const items = useMemo(
    () => createExpandableTabsDemoItems(DEFAULT_EXPANDABLE_TABS_CONFIG),
    [],
  );

  useEffect(() => {
    if (!isActive || signal <= 0) {
      setTabValue(null);
      return;
    }

    const timers = [
      window.setTimeout(() => setTabValue("launch"), 80),
      window.setTimeout(() => setTabValue("inbox"), 1350),
      window.setTimeout(() => setTabValue("assets"), 2600),
      window.setTimeout(() => setTabValue(null), 3900),
    ];

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [isActive, signal]);

  return (
    <div
      className={cn(
        "flex h-[285px] w-full items-end justify-center pb-1",
        className,
      )}
    >
      <ExpandableTabs
        items={items}
        value={tabValue}
        theme="light"
        closeOnOutsideClick={false}
      />
    </div>
  );
}

export function ExpandableTabsDemo({
  config,
  playKey,
}: ComponentDemoProps<ExpandableTabsConfig>) {
  const [tabValue, setTabValue] = useState<string | null>(
    config.defaultTab === "none" ? null : config.defaultTab,
  );
  const [trackedDefaultTab, setTrackedDefaultTab] = useState(config.defaultTab);
  const prevPlayKeyRef = useRef(playKey ?? 0);

  if (config.defaultTab !== trackedDefaultTab) {
    setTrackedDefaultTab(config.defaultTab);
    setTabValue(config.defaultTab === "none" ? null : config.defaultTab);
  }

  useEffect(() => {
    const nextPlayKey = playKey ?? 0;
    if (nextPlayKey === prevPlayKeyRef.current) return;
    prevPlayKeyRef.current = nextPlayKey;
    setTabValue((prev) => {
      const idx = PLAY_CYCLE.indexOf(prev);
      return PLAY_CYCLE[(idx + 1) % PLAY_CYCLE.length];
    });
  }, [playKey]);

  const { launchLabel, inboxLabel, flowsLabel, assetsLabel, statusLabel } =
    config;
  const items = useMemo(
    () =>
      createExpandableTabsDemoItems({
        launchLabel,
        inboxLabel,
        flowsLabel,
        assetsLabel,
        statusLabel,
      }),
    [launchLabel, inboxLabel, flowsLabel, assetsLabel, statusLabel],
  );

  return (
    <div className="flex min-h-[340px] w-full items-end justify-center pb-2">
      <ExpandableTabs
        items={items}
        value={tabValue}
        onValueChange={(next) => setTabValue(next)}
        closeOnOutsideClick={config.closeOnOutsideClick}
        theme={config.theme}
      />
    </div>
  );
}
