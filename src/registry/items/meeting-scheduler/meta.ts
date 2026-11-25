import type { ComponentMeta } from "@/registry/types";
import {
  DEFAULT_MEETING_SCHEDULER_CONFIG,
  type MeetingSchedulerConfig,
} from "./config";

export const meetingSchedulerMeta: ComponentMeta<MeetingSchedulerConfig> = {
  slug: "meeting-scheduler",
  title: "Meeting Scheduler",
  shortTitle: "Scheduler",
  tagline:
    "Compact call trigger that morphs into a two-step day, time, and attendee picker, then folds into a confirmed booking pill",
  description:
    "A multi-step interactive meeting scheduler for React powered by Motion springs. Clicking the trigger expands it into a weekday strip and time grid with traveling selection pills and disabled busy slots, flows into attendee avatar chips and duration toggles, and collapses back into a green confirmation capsule with a diagonal sheen sweep.\nMade for booking widgets, team calendars, sales demos, and quick call triggers.",
  categories: ["Flows"],
  masonryHeight: 380,
  cardHeightClass: "h-[360px] sm:h-[380px]",
  gridScale: 0.8,
  previewBounds: { width: 344, height: 340 },
  dependencies: [
    "@ui-sdk/react",
    "@ui-sdk/core",
    "react",
    "motion",
    "clsx",
    "tailwind-merge",
  ],
  sourceFiles: ["src/registry/items/meeting-scheduler/meeting-scheduler.tsx"],
  defaultConfig: DEFAULT_MEETING_SCHEDULER_CONFIG,
  props: [
    {
      name: "label",
      type: "string",
      defaultValue: '"Schedule a call"',
      description: "Label shown on the compact resting trigger pill.",
    },
    {
      name: "times",
      type: "readonly string[]",
      defaultValue: '["09:00", "09:30", "10:30", "13:00", "14:30", "16:00"]',
      description: "Time slots rendered in the 3-column picker grid.",
    },
    {
      name: "durations",
      type: "readonly string[]",
      defaultValue: '["15 min", "30 min", "45 min"]',
      description: "Selectable meeting length pills on step two.",
    },
    {
      name: "people",
      type: "readonly string[]",
      defaultValue: "5 sample attendees",
      description:
        "Attendee names rendered as toggleable chips with generated initials avatars.",
    },
    {
      name: "theme",
      type: '"light" | "dark"',
      defaultValue: '"light"',
      description:
        "Explicit light or dark surface palette independent of the surrounding page theme.",
    },
    {
      name: "onSchedule",
      type: "(booking: MeetingSchedulerBooking) => boolean | void | Promise<boolean | void>",
      defaultValue: "undefined",
      description:
        "Async booking handler receiving date, time, duration, and attendees; returning false returns to step two.",
    },
    {
      name: "bounce / speed",
      type: "number",
      defaultValue: "1 / 1",
      description:
        "Scales perceptual spring overshoot (0–1.6) and choreography speed (0.5–2).",
    },
  ],
  howItWorks: [
    {
      title: "Measured container morph",
      description:
        "Offscreen sizers track exact resting pill width, confirmation pill width, and wrapped attendee height via offsetWidth/offsetHeight so the shell springs cleanly without distortion inside scaled frames.",
    },
    {
      title: "Traveling selection pills",
      description:
        "Weekday, time, and duration grids share a single dark indicator pill that glides horizontally and vertically across uniform grid slots on spring physics while skipping busy times.",
    },
    {
      title: "Two-step flow to confirmed capsule",
      description:
        "Progresses from day/time selection to attendee chips and duration, shows an inline spinner while booking, then folds back into a green confirmation pill with a diagonal sheen sweep.",
    },
  ],
};
