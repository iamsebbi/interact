import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type { MeetingSchedulerTheme } from "./meeting-scheduler";

export interface MeetingSchedulerConfig {
  label: string;
  people: string;
  times: string;
  durations: string;
  theme: MeetingSchedulerTheme;
  bounce: number;
  speed: number;
}

export const DEFAULT_MEETING_SCHEDULER_CONFIG: MeetingSchedulerConfig = {
  label: "Schedule a call",
  people: "Ava Chen, Marco Rossi, Lena Park, Sam Okafor, Noor Haddad",
  times: "09:00, 09:30, 10:30, 13:00, 14:30, 16:00",
  durations: "15 min, 30 min, 45 min",
  theme: "light",
  bounce: 1,
  speed: 1,
};

export const MEETING_SCHEDULER_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function parseCsvList(
  raw: string,
  fallback: readonly string[],
): string[] {
  const seen = new Set<string>();
  const parsed: string[] = [];
  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    parsed.push(trimmed);
  }
  return parsed.length > 0 ? parsed : [...fallback];
}

export function buildMeetingSchedulerJsx(
  config: MeetingSchedulerConfig,
): string {
  const esc = (s: string) => s.replace(/"/g, '\\"');
  const lines = [
    `import { MeetingScheduler } from "@/components/ui/meeting-scheduler";`,
    ``,
    `<MeetingScheduler`,
  ];

  if (config.label !== DEFAULT_MEETING_SCHEDULER_CONFIG.label) {
    lines.push(`  label="${esc(config.label || "Schedule a call")}"`);
  }
  if (config.times !== DEFAULT_MEETING_SCHEDULER_CONFIG.times) {
    const items = parseCsvList(config.times, [
      "09:00",
      "09:30",
      "10:30",
      "13:00",
      "14:30",
      "16:00",
    ]);
    lines.push(
      `  times={[${items.map((item) => `"${esc(item)}"`).join(", ")}]}`,
    );
  }
  if (config.durations !== DEFAULT_MEETING_SCHEDULER_CONFIG.durations) {
    const items = parseCsvList(config.durations, [
      "15 min",
      "30 min",
      "45 min",
    ]);
    lines.push(
      `  durations={[${items.map((item) => `"${esc(item)}"`).join(", ")}]}`,
    );
  }
  if (config.people !== DEFAULT_MEETING_SCHEDULER_CONFIG.people) {
    const items = parseCsvList(config.people, [
      "Ava Chen",
      "Marco Rossi",
      "Lena Park",
      "Sam Okafor",
      "Noor Haddad",
    ]);
    lines.push(
      `  people={[${items.map((item) => `"${esc(item)}"`).join(", ")}]}`,
    );
  }
  if (config.theme !== DEFAULT_MEETING_SCHEDULER_CONFIG.theme) {
    lines.push(`  theme="${config.theme}"`);
  }
  if (config.bounce !== DEFAULT_MEETING_SCHEDULER_CONFIG.bounce) {
    lines.push(`  bounce={${Number(config.bounce.toFixed(2))}}`);
  }
  if (config.speed !== DEFAULT_MEETING_SCHEDULER_CONFIG.speed) {
    lines.push(`  speed={${Number(config.speed.toFixed(2))}}`);
  }

  if (lines.length === 3) {
    return `import { MeetingScheduler } from "@/components/ui/meeting-scheduler";\n\n<MeetingScheduler />`;
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function buildMeetingSchedulerAiPrompt(
  config: MeetingSchedulerConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/meeting-scheduler.json",
): string {
  return [
    "Implement the Meeting Scheduler component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: @ui-sdk/react, @ui-sdk/core, react, motion, clsx, tailwind-merge",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildMeetingSchedulerJsx(config),
    "```",
  ].join("\n");
}

export const meetingSchedulerGenerators: ComponentGenerators<MeetingSchedulerConfig> =
  {
    buildJsx: buildMeetingSchedulerJsx,
    buildAiPrompt: buildMeetingSchedulerAiPrompt,
  };
