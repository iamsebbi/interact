"use client";

import { SelectField, Slider, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_MEETING_SCHEDULER_CONFIG,
  MEETING_SCHEDULER_THEME_OPTIONS,
  type MeetingSchedulerConfig,
} from "./config";
import type { MeetingSchedulerTheme } from "./meeting-scheduler";

export function MeetingSchedulerInspector({
  config,
  onChange,
}: ComponentInspectorProps<MeetingSchedulerConfig>) {
  const patch = (next: Partial<MeetingSchedulerConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Theme"
        value={config.theme}
        options={MEETING_SCHEDULER_THEME_OPTIONS}
        onValueChange={(next) =>
          patch({ theme: next as MeetingSchedulerTheme })
        }
      />

      <TextField
        label="Label"
        value={config.label}
        placeholder="Schedule a call"
        onValueChange={(label) => patch({ label })}
      />

      <TextField
        label="Times"
        value={config.times}
        placeholder="09:00, 09:30, 10:30, 13:00"
        onValueChange={(times) => patch({ times })}
      />

      <TextField
        label="Durations"
        value={config.durations}
        placeholder="15 min, 30 min, 45 min"
        onValueChange={(durations) => patch({ durations })}
      />

      <TextField
        label="People"
        value={config.people}
        placeholder="Ava Chen, Marco Rossi, Lena Park"
        onValueChange={(people) => patch({ people })}
      />

      <Slider
        label="Bounce"
        value={config.bounce}
        defaultValue={DEFAULT_MEETING_SCHEDULER_CONFIG.bounce}
        min={0}
        max={1.6}
        step={0.05}
        unit="×"
        onValueChange={(bounce) => patch({ bounce })}
      />

      <Slider
        label="Speed"
        value={config.speed}
        defaultValue={DEFAULT_MEETING_SCHEDULER_CONFIG.speed}
        min={0.5}
        max={2}
        step={0.05}
        unit="×"
        onValueChange={(speed) => patch({ speed })}
      />
    </div>
  );
}
