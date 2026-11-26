"use client";

import { Button as ButtonPrimitive } from "@ui-sdk/react/button";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type MeetingSchedulerTheme = "light" | "dark";
export type MeetingSchedulerStep = "rest" | "time" | "people" | "busy" | "done";

export interface MeetingSchedulerBooking {
  date: string;
  time: string;
  duration: string;
  attendees: string[];
}

export interface MeetingSchedulerProps {
  label?: string;
  timeTitle?: string;
  peopleTitle?: string;
  times?: readonly string[];
  durations?: readonly string[];
  defaultDuration?: string;
  people?: readonly string[];
  nextLabel?: string;
  backLabel?: string;
  scheduleLabel?: string;
  busyLabel?: string;
  theme?: MeetingSchedulerTheme;
  width?: number;
  resetAfterMs?: number;
  /** Scales spring bounce / overshoot (0 to 1.6). */
  bounce?: number;
  /** Scales overall spring speed (0.5 to 2). */
  speed?: number;
  /** Controlled step (primarily for demos/previews). */
  step?: MeetingSchedulerStep;
  onStepChange?: (step: MeetingSchedulerStep) => void;
  onSchedule?: (
    booking: MeetingSchedulerBooking,
  ) => boolean | undefined | Promise<boolean | undefined>;
  onCancel?: () => void;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_TIMES = [
  "09:00",
  "09:30",
  "10:30",
  "13:00",
  "14:30",
  "16:00",
] as const;

const DEFAULT_DURATIONS = ["15 min", "30 min", "45 min"] as const;

const DEFAULT_PEOPLE = [
  "Ava Chen",
  "Marco Rossi",
  "Lena Park",
  "Sam Okafor",
  "Noor Haddad",
] as const;

const LIGHT_TONES = [
  "#ECE3D6",
  "#DDE6DE",
  "#E4DFEC",
  "#EDE4CB",
  "#DCE5EC",
  "#F0DEDA",
] as const;

const DARK_TONES = [
  "#4D4436",
  "#3A4840",
  "#433D51",
  "#4B4430",
  "#394652",
  "#4F3C38",
] as const;

const ROW_H = 44;
const DAY_H = 56;
const CLOSED_PAD = 5;
const OPEN_PAD = 8;
const GRID_GAP = 8;
const SECTION_GAP = 14;

type SpringKind = "pop" | "morph" | "snap" | "settle" | "press";

const SPRING_PARAMS: Record<SpringKind, readonly [number, number]> = {
  pop: [0.5, 0.5],
  morph: [0.4, 0.36],
  snap: [0.38, 0.25],
  settle: [0.32, 0.2],
  press: [0.26, 0.4],
};

function perceptualSpring(
  kind: SpringKind,
  speed: number,
  bounceScale: number,
) {
  const [basePeriod, baseBounce] = SPRING_PARAMS[kind];
  const period = basePeriod / Math.max(0.25, speed);
  const clampedBounce = Math.min(0.85, Math.max(0, baseBounce * bounceScale));
  const stiffness = ((2 * Math.PI) / period) ** 2;
  const damping = (4 * Math.PI * (1 - clampedBounce)) / period;
  return { type: "spring" as const, stiffness, damping, mass: 1 };
}

function isSlotBusy(dayIndex: number, timeIndex: number) {
  return (dayIndex * 5 + timeIndex * 3 + 1) % 4 === 0;
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/[\s@._-]+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  return (
    parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)
  ).toUpperCase();
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

function getUpcomingWeekdays(): Date[] {
  const dates: Date[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  while (dates.length < 5) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(new Date(cursor));
    }
  }
  return dates;
}

function CalendarIcon({ className }: { className?: string }) {
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
      <rect x="4.2" y="5.6" width="15.6" height="14.2" rx="3" />
      <path d="M4.2 10.2h15.6M8.6 3.6v3.6M15.4 3.6v3.6" />
    </svg>
  );
}

function CalendarCheckIcon({ className }: { className?: string }) {
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
      <rect x="4.2" y="5.6" width="15.6" height="14.2" rx="3" />
      <path d="M4.2 10.2h15.6M8.6 3.6v3.6M15.4 3.6v3.6" />
      <path d="M9.4 14.6l1.8 1.8 3.5-3.6" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M7 7l10 10M17 7L7 17" />
    </svg>
  );
}

function BackIcon({ className }: { className?: string }) {
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
      <path d="M14.6 6.4L9 12l5.6 5.6" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("animate-spin", className)}
    >
      <circle cx="12" cy="12" r="7.5" opacity={0.28} />
      <path d="M12 4.5a7.5 7.5 0 0 1 7.5 7.5" />
    </svg>
  );
}

interface MorphChar {
  id: string;
  char: string;
  delayMs: number;
}

function MorphText({
  text,
  staggerMs = 13,
  speed = 1,
  reduceMotion = false,
  transition,
  className,
}: {
  text: string;
  staggerMs?: number;
  speed?: number;
  reduceMotion?: boolean;
  transition: ReturnType<typeof perceptualSpring>;
  className?: string;
}) {
  const nextIdRef = useRef(0);
  const [items, setItems] = useState<MorphChar[]>(() =>
    [...text].map((char) => ({
      id: `c${nextIdRef.current++}`,
      char,
      delayMs: 0,
    })),
  );
  const prevTextRef = useRef(text);

  useEffect(() => {
    const prev = prevTextRef.current;
    if (prev === text) return;
    prevTextRef.current = text;

    setItems((current) => {
      const prevChars = [...prev];
      const nextChars = [...text];
      let prefix = 0;
      while (
        prefix < prevChars.length &&
        prefix < nextChars.length &&
        prevChars[prefix] === nextChars[prefix]
      ) {
        prefix++;
      }
      let suffix = 0;
      while (
        suffix < prevChars.length - prefix &&
        suffix < nextChars.length - prefix &&
        prevChars[prevChars.length - 1 - suffix] ===
          nextChars[nextChars.length - 1 - suffix]
      ) {
        suffix++;
      }

      const keptPrefix = current.slice(0, prefix).map((c) => ({
        ...c,
        delayMs: 0,
      }));
      const keptSuffix =
        suffix > 0
          ? current.slice(current.length - suffix).map((c) => ({
              ...c,
              delayMs: 0,
            }))
          : [];
      const inserted = nextChars
        .slice(prefix, nextChars.length - suffix)
        .map((char, idx) => ({
          id: `c${nextIdRef.current++}`,
          char,
          delayMs: Math.round((idx * staggerMs) / Math.max(0.25, speed)),
        }));

      return [...keptPrefix, ...inserted, ...keptSuffix];
    });
  }, [speed, staggerMs, text]);

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={cn(
        "relative inline-flex whitespace-pre [font-kerning:none]",
        className,
      )}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item) => (
            <motion.span
              key={item.id}
              layout="position"
              initial={{ opacity: 0, scale: 0.55, filter: "blur(5px)" }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                transition: {
                  ...transition,
                  delay: item.delayMs / 1000,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.55,
                filter: "blur(5px)",
                transition: { duration: 0.16 / Math.max(0.25, speed) },
              }}
              transition={transition}
              className="inline-block"
            >
              {item.char === " " ? "\u00A0" : item.char}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
    </span>
  );
}

export function MeetingScheduler({
  label = "Schedule a call",
  timeTitle = "Pick a time",
  peopleTitle = "Who's coming?",
  times = DEFAULT_TIMES,
  durations = DEFAULT_DURATIONS,
  defaultDuration = "30 min",
  people = DEFAULT_PEOPLE,
  nextLabel = "Next",
  backLabel = "Back",
  scheduleLabel = "Schedule",
  busyLabel = "Scheduling",
  theme = "light",
  width = 340,
  resetAfterMs = 2800,
  bounce = 1,
  speed = 1,
  step: controlledStep,
  onStepChange,
  onSchedule,
  onCancel,
  className,
  style,
}: MeetingSchedulerProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const isDark = theme === "dark";
  const clampedBounce = Math.max(
    0,
    Math.min(1.6, Number.isFinite(bounce) ? bounce : 1),
  );
  const clampedSpeed = Math.max(
    0.5,
    Math.min(2, Number.isFinite(speed) ? speed : 1),
  );
  const cardWidth = Math.max(300, Math.min(440, Math.round(width)));
  const innerWidth = cardWidth - 2 * OPEN_PAD;

  const timeList = useMemo(
    () => (times.length > 0 ? times.slice(0, 6) : [...DEFAULT_TIMES]),
    [times],
  );
  const durationList = useMemo(
    () =>
      durations.length > 0 ? durations.slice(0, 4) : [...DEFAULT_DURATIONS],
    [durations],
  );
  const peopleList = useMemo(
    () => (people.length > 0 ? people.slice(0, 8) : [...DEFAULT_PEOPLE]),
    [people],
  );
  const dates = useMemo(() => getUpcomingWeekdays(), []);

  const defaultDurIndex = useMemo(() => {
    const idx = durationList.indexOf(defaultDuration);
    return Math.max(0, idx);
  }, [defaultDuration, durationList]);

  const isStepControlled = controlledStep !== undefined;
  const [internalStep, setInternalStep] =
    useState<MeetingSchedulerStep>("rest");
  const step = isStepControlled ? controlledStep : internalStep;

  const [dayIndex, setDayIndex] = useState(0);
  const [timeIndex, setTimeIndex] = useState<number>(-1);
  const [durIndex, setDurIndex] = useState(defaultDurIndex);
  const [selectedPeople, setSelectedPeople] = useState<number[]>(() =>
    peopleList.slice(0, 2).map((_, idx) => idx),
  );
  const [doneSummary, setDoneSummary] = useState("");
  const [showSheen, setShowSheen] = useState(false);

  const timersRef = useRef<number[]>([]);
  const restPillRef = useRef<HTMLSpanElement | null>(null);
  const donePillRef = useRef<HTMLSpanElement | null>(null);
  const peopleGridRef = useRef<HTMLDivElement | null>(null);

  const [restWidth, setRestWidth] = useState(() =>
    Math.max(168, label.length * 8.4 + 62),
  );
  const [doneWidth, setDoneWidth] = useState(236);
  const [peopleHeight, setPeopleHeight] = useState(80);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback(
    (ms: number, fn: () => void) => {
      const id = window.setTimeout(
        fn,
        Math.round(ms / Math.max(0.25, clampedSpeed)),
      );
      timersRef.current.push(id);
    },
    [clampedSpeed],
  );

  const setStep = useCallback(
    (next: MeetingSchedulerStep) => {
      if (!isStepControlled) setInternalStep(next);
      onStepChange?.(next);
    },
    [isStepControlled, onStepChange],
  );

  // Measure offscreen pill & people-chip heights via offsetWidth/offsetHeight (immune to ancestor scale()).
  useIsomorphicLayoutEffect(() => {
    if (restPillRef.current && restPillRef.current.offsetWidth > 0) {
      setRestWidth(restPillRef.current.offsetWidth);
    }
    if (donePillRef.current && donePillRef.current.offsetWidth > 0) {
      setDoneWidth(donePillRef.current.offsetWidth);
    }
    if (peopleGridRef.current && peopleGridRef.current.offsetHeight > 0) {
      setPeopleHeight(peopleGridRef.current.offsetHeight);
    }
  }, [doneSummary, innerWidth, label, peopleList]);

  useEffect(() => clearTimers, [clearTimers]);

  const activeDate = dates[dayIndex] ?? dates[0];
  const activeTimeLabel = timeIndex >= 0 ? (timeList[timeIndex] ?? "") : "";
  const activeDurationLabel = durationList[durIndex] ?? durationList[0] ?? "";
  const whenLabel = `${activeDate.toLocaleDateString("en-US", {
    weekday: "short",
  })} ${activeDate.getDate()} · ${activeTimeLabel}`;
  const formattedDoneLabel =
    doneSummary || `${whenLabel || "Scheduled"} · ${activeDurationLabel}`;

  const resetAll = useCallback(() => {
    clearTimers();
    setShowSheen(false);
    setDayIndex(0);
    setTimeIndex(-1);
    setDurIndex(defaultDurIndex);
    setSelectedPeople(peopleList.slice(0, 2).map((_, idx) => idx));
    setStep("rest");
  }, [clearTimers, defaultDurIndex, peopleList, setStep]);

  const handleOpen = () => {
    if (step !== "rest") return;
    clearTimers();
    setStep("time");
  };

  const handleCancel = useCallback(() => {
    if (step === "rest" || step === "busy") return;
    resetAll();
    onCancel?.();
  }, [onCancel, resetAll, step]);

  const handlePickDay = (idx: number) => {
    if (idx === dayIndex) return;
    setDayIndex(idx);
    if (timeIndex >= 0 && isSlotBusy(idx, timeIndex)) {
      setTimeIndex(-1);
    }
  };

  const handlePickTime = (idx: number) => {
    if (isSlotBusy(dayIndex, idx)) return;
    setTimeIndex(idx);
  };

  const handleSchedule = async () => {
    if (selectedPeople.length === 0 || timeIndex < 0) return;
    clearTimers();
    setStep("busy");

    const booking: MeetingSchedulerBooking = {
      date: activeDate.toISOString().slice(0, 10),
      time: activeTimeLabel,
      duration: activeDurationLabel,
      attendees: selectedPeople
        .map((idx) => peopleList[idx])
        .filter((name): name is string => Boolean(name)),
    };

    let succeeded = true;
    if (onSchedule) {
      try {
        succeeded = (await onSchedule(booking)) !== false;
      } catch {
        succeeded = false;
      }
    } else {
      await new Promise<void>((resolve) => {
        scheduleTimer(900, resolve);
      });
    }

    if (!succeeded) {
      setStep("people");
      return;
    }

    setDoneSummary(`${whenLabel} · ${activeDurationLabel}`);
    setStep("done");
    if (!reduceMotion) {
      scheduleTimer(380, () => setShowSheen(true));
      scheduleTimer(1280, () => setShowSheen(false));
    }
    if (resetAfterMs > 0) {
      scheduleTimer(resetAfterMs, () => {
        resetAll();
      });
    }
  };

  // Escape closes open steps cleanly.
  useEffect(() => {
    if (step !== "time" && step !== "people") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleCancel, step]);

  const isExpanded = step === "time" || step === "people" || step === "busy";
  const timeRows = Math.ceil(timeList.length / 3);
  const timeGridHeight = timeRows * ROW_H + (timeRows - 1) * GRID_GAP;

  const targetWidth =
    step === "rest"
      ? restWidth + 2 * CLOSED_PAD
      : step === "done"
        ? doneWidth + 2 * CLOSED_PAD
        : cardWidth;

  const targetHeight =
    step === "rest" || step === "done"
      ? ROW_H + 2 * CLOSED_PAD
      : step === "time"
        ? OPEN_PAD +
          ROW_H +
          SECTION_GAP +
          DAY_H +
          SECTION_GAP +
          timeGridHeight +
          SECTION_GAP +
          ROW_H +
          OPEN_PAD
        : OPEN_PAD +
          ROW_H +
          SECTION_GAP +
          peopleHeight +
          SECTION_GAP +
          ROW_H +
          SECTION_GAP +
          ROW_H +
          OPEN_PAD;

  const pad = isExpanded ? OPEN_PAD : CLOSED_PAD;
  const trayRadius = ROW_H / 2 + pad;

  const morphSpring = useMemo(
    () => perceptualSpring("morph", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const snapSpring = useMemo(
    () => perceptualSpring("snap", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const popSpring = useMemo(
    () => perceptualSpring("pop", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const pressSpring = useMemo(
    () => perceptualSpring("press", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );

  const dayCellW = (innerWidth - 4 * GRID_GAP) / 5;
  const timeCellW = (innerWidth - 2 * GRID_GAP) / 3;
  const durCellW =
    (innerWidth - (durationList.length - 1) * GRID_GAP) / durationList.length;

  const headerTitle =
    step === "rest"
      ? label
      : step === "time"
        ? timeTitle
        : step === "done"
          ? formattedDoneLabel
          : peopleTitle;

  const tones = isDark ? DARK_TONES : LIGHT_TONES;
  const canAdvanceTime = timeIndex >= 0;
  const canSchedule = selectedPeople.length > 0 && timeIndex >= 0;

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-slot="meeting-scheduler"
        data-step={step}
        data-theme={theme}
        className={cn(
          "relative inline-block select-none align-middle tabular-nums",
          className,
        )}
        style={style}
      >
        {/* Offscreen sizers for exact pill widths and wrapped attendee chip height */}
        <div
          aria-hidden="true"
          className="pointer-events-none invisible absolute top-0 left-0"
        >
          <span
            ref={restPillRef}
            className="inline-flex h-[44px] items-center gap-2 rounded-full pr-5 pl-3.5 text-[15px] font-semibold whitespace-nowrap"
          >
            <CalendarIcon className="size-[18px] shrink-0" />
            <span>{label}</span>
          </span>
          <span
            ref={donePillRef}
            className="inline-flex h-[44px] items-center gap-2 rounded-full pr-5 pl-3.5 text-[15px] font-semibold whitespace-nowrap"
          >
            <CalendarCheckIcon className="size-[18px] shrink-0" />
            <span>{formattedDoneLabel}</span>
          </span>
          <div
            ref={peopleGridRef}
            style={{ width: innerWidth }}
            className="flex flex-wrap gap-2"
          >
            {peopleList.map((name) => (
              <span
                key={name}
                className="inline-flex h-[36px] items-center gap-2 rounded-full pr-4 pl-1.5 text-[14px] font-medium"
              >
                <span className="size-[26px] rounded-full" />
                <span>{getFirstName(name)}</span>
              </span>
            ))}
          </div>
        </div>

        <motion.div
          animate={{
            width: targetWidth,
            height: targetHeight,
            borderRadius: trayRadius,
          }}
          transition={reduceMotion ? { duration: 0 } : morphSpring}
          className={cn(
            "relative overflow-hidden",
            isDark
              ? "bg-[#26262b] text-[#ffffff] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_1px_1px_rgba(0,0,0,0.3),0_6px_16px_-6px_rgba(0,0,0,0.45),0_22px_44px_-24px_rgba(0,0,0,0.6)]"
              : "bg-white text-[#111111] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04),0_6px_16px_-6px_rgba(0,0,0,0.1),0_22px_44px_-24px_rgba(0,0,0,0.16)]",
          )}
        >
          {/* Header row (morphs between compact trigger pill, expanded title bar, and green confirmation pill) */}
          <div
            style={{ padding: pad }}
            className="flex h-full w-full flex-col justify-between"
          >
            <div className="relative flex w-full shrink-0 items-center">
              <ButtonPrimitive
                onClick={handleOpen}
                disabled={step !== "rest"}
                render={
                  <motion.button
                    type="button"
                    animate={{ marginRight: isExpanded ? ROW_H + GRID_GAP : 0 }}
                    transition={reduceMotion ? { duration: 0 } : morphSpring}
                    whileHover={
                      step === "rest" && !reduceMotion
                        ? { scale: 1.02 }
                        : undefined
                    }
                    whileTap={
                      step === "rest" && !reduceMotion
                        ? { scale: 1.04, transition: pressSpring }
                        : undefined
                    }
                  />
                }
                className={cn(
                  "relative flex h-[44px] min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-full pr-4 pl-3.5 text-[15px] font-semibold outline-none transition-colors duration-200",
                  "focus-visible:ring-2 focus-visible:ring-offset-2",
                  isDark
                    ? "focus-visible:ring-[#60a5fa]/60 focus-visible:ring-offset-[#26262b]"
                    : "focus-visible:ring-[#0062d6]/55 focus-visible:ring-offset-white",
                  step === "done"
                    ? isDark
                      ? "cursor-default bg-[#16a34a] text-white"
                      : "cursor-default bg-[#15803d] text-white"
                    : step === "rest"
                      ? isDark
                        ? "cursor-pointer bg-[#323238] text-[#ffffff] hover:bg-[#3c3c44]"
                        : "cursor-pointer bg-[#f2f2f2] text-[#111111] hover:bg-[#e7e7ea]"
                      : isDark
                        ? "cursor-default bg-[#323238] text-[#ffffff]"
                        : "cursor-default bg-[#f2f2f2] text-[#111111]",
                )}
              >
                {showSheen && (
                  <motion.span
                    aria-hidden="true"
                    initial={{ x: "-115%" }}
                    animate={{ x: "115%" }}
                    transition={{ duration: 0.8, ease: [0.25, 0.7, 0.25, 1] }}
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 32%, rgba(255,255,255,0.52) 50%, transparent 68%)",
                    }}
                  />
                )}

                <span className="relative size-[18px] shrink-0">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={step === "done" ? "done-icon" : "cal-icon"}
                      initial={
                        reduceMotion
                          ? false
                          : {
                              opacity: 0,
                              scale: 0.45,
                              rotate: -35,
                              filter: "blur(4px)",
                            }
                      }
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        filter: "blur(0px)",
                      }}
                      exit={
                        reduceMotion
                          ? undefined
                          : {
                              opacity: 0,
                              scale: 0.45,
                              filter: "blur(4px)",
                              transition: { duration: 0.14 / clampedSpeed },
                            }
                      }
                      transition={popSpring}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {step === "done" ? (
                        <CalendarCheckIcon className="size-[18px]" />
                      ) : (
                        <CalendarIcon className="size-[18px]" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>

                <span className="relative flex min-w-0 flex-1 items-center overflow-hidden">
                  <MorphText
                    text={headerTitle}
                    staggerMs={13}
                    speed={clampedSpeed}
                    reduceMotion={reduceMotion}
                    transition={snapSpring}
                    className="truncate whitespace-nowrap"
                  />
                </span>
              </ButtonPrimitive>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <ButtonPrimitive
                    key="close-btn"
                    aria-label="Close scheduler"
                    disabled={step === "busy"}
                    onClick={handleCancel}
                    render={
                      <motion.button
                        type="button"
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, scale: 0.75, filter: "blur(5px)" }
                        }
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={
                          reduceMotion
                            ? undefined
                            : {
                                opacity: 0,
                                scale: 0.75,
                                filter: "blur(5px)",
                                transition: { duration: 0.14 / clampedSpeed },
                              }
                        }
                        whileHover={!reduceMotion ? { scale: 1.05 } : undefined}
                        whileTap={!reduceMotion ? { scale: 0.94 } : undefined}
                        transition={popSpring}
                      />
                    }
                    className={cn(
                      "absolute top-0 right-0 flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-colors",
                      "disabled:pointer-events-none disabled:opacity-45",
                      isDark
                        ? "bg-[#323238] text-[#ffffff] hover:bg-[#3c3c44]"
                        : "bg-[#f2f2f2] text-[#111111] hover:bg-[#e7e7ea]",
                    )}
                  >
                    <CloseIcon className="size-[18px]" />
                  </ButtonPrimitive>
                )}
              </AnimatePresence>
            </div>

            {/* Expanded interactive body */}
            <AnimatePresence mode="popLayout" initial={false}>
              {step === "time" && (
                <motion.div
                  key="step-time"
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 8, filter: "blur(6px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 0,
                          y: -6,
                          filter: "blur(6px)",
                          transition: { duration: 0.14 / clampedSpeed },
                        }
                  }
                  transition={popSpring}
                  className="flex flex-col gap-[14px] pt-[14px]"
                >
                  {/* 5-weekday selector with traveling pill */}
                  <motion.fieldset
                    aria-label="Choose a day"
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: 6, scale: 0.96, filter: "blur(5px)" }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { ...popSpring, delay: 0 }
                    }
                    className="m-0 border-0 p-0"
                  >
                    <div className="relative" style={{ height: DAY_H }}>
                      <div className="grid h-full grid-cols-5 gap-2">
                        {dates.map((d) => (
                          <div
                            key={d.toISOString()}
                            style={{ height: DAY_H }}
                            className={cn(
                              "rounded-[22px]",
                              isDark ? "bg-[#323238]" : "bg-[#f2f2f2]",
                            )}
                          />
                        ))}
                      </div>

                      <motion.div
                        aria-hidden="true"
                        animate={{ x: dayIndex * (dayCellW + GRID_GAP) }}
                        transition={reduceMotion ? { duration: 0 } : snapSpring}
                        style={{ width: dayCellW, height: DAY_H }}
                        className={cn(
                          "pointer-events-none absolute top-0 left-0 rounded-[22px]",
                          isDark ? "bg-[#ffffff]" : "bg-[#111111]",
                        )}
                      />

                      <div className="absolute inset-0 grid grid-cols-5 gap-2">
                        {dates.map((d, idx) => {
                          const active = idx === dayIndex;
                          return (
                            <button
                              key={d.toISOString()}
                              type="button"
                              aria-pressed={active}
                              onClick={() => handlePickDay(idx)}
                              style={{ height: DAY_H }}
                              className={cn(
                                "relative z-10 flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[22px] outline-none transition-colors duration-200",
                                active
                                  ? isDark
                                    ? "text-[#111111]"
                                    : "text-white"
                                  : isDark
                                    ? "text-[#ffffff]"
                                    : "text-[#111111]",
                              )}
                            >
                              <span
                                className={cn(
                                  "text-[10.5px] font-semibold tracking-[0.04em] uppercase transition-colors",
                                  active
                                    ? isDark
                                      ? "text-[#111111]/65"
                                      : "text-white/65"
                                    : isDark
                                      ? "text-[#a1a1aa]"
                                      : "text-[#71717a]",
                                )}
                              >
                                {d.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </span>
                              <span className="text-[16px] font-semibold leading-none">
                                {d.getDate()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.fieldset>

                  {/* 3-column times grid with traveling pill & busy slots */}
                  <motion.fieldset
                    aria-label="Choose a time"
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: 6, scale: 0.96, filter: "blur(5px)" }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { ...popSpring, delay: 0.05 / clampedSpeed }
                    }
                    className="m-0 border-0 p-0"
                  >
                    <div
                      className="relative"
                      style={{ height: timeGridHeight }}
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {timeList.map((t, idx) => {
                          const busy = isSlotBusy(dayIndex, idx);
                          return (
                            <div
                              key={t}
                              className={cn(
                                "h-[44px] rounded-full transition-colors duration-200",
                                busy
                                  ? isDark
                                    ? "bg-[#323238]/45"
                                    : "bg-[#f2f2f2]/45"
                                  : isDark
                                    ? "bg-[#323238]"
                                    : "bg-[#f2f2f2]",
                              )}
                            />
                          );
                        })}
                      </div>

                      <motion.div
                        aria-hidden="true"
                        animate={{
                          x:
                            (Math.max(0, timeIndex) % 3) *
                            (timeCellW + GRID_GAP),
                          y:
                            Math.floor(Math.max(0, timeIndex) / 3) *
                            (ROW_H + GRID_GAP),
                          opacity: timeIndex >= 0 ? 1 : 0,
                        }}
                        transition={reduceMotion ? { duration: 0 } : snapSpring}
                        style={{ width: timeCellW, height: ROW_H }}
                        className={cn(
                          "pointer-events-none absolute top-0 left-0 rounded-full",
                          isDark ? "bg-[#ffffff]" : "bg-[#111111]",
                        )}
                      />

                      <div className="absolute inset-0 grid grid-cols-3 gap-2">
                        {timeList.map((t, idx) => {
                          const busy = isSlotBusy(dayIndex, idx);
                          const active = idx === timeIndex;
                          return (
                            <button
                              key={t}
                              type="button"
                              disabled={busy}
                              aria-pressed={active}
                              onClick={() => handlePickTime(idx)}
                              className={cn(
                                "relative z-10 flex h-[44px] items-center justify-center rounded-full text-[15px] font-semibold outline-none transition-colors duration-200",
                                busy
                                  ? isDark
                                    ? "cursor-default text-[#6f6c64] line-through decoration-[1.5px]"
                                    : "cursor-default text-[#b8b5ad] line-through decoration-[1.5px]"
                                  : active
                                    ? isDark
                                      ? "cursor-pointer text-[#111111]"
                                      : "cursor-pointer text-white"
                                    : isDark
                                      ? "cursor-pointer text-[#ffffff]"
                                      : "cursor-pointer text-[#111111]",
                              )}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.fieldset>

                  {/* Next CTA */}
                  <ButtonPrimitive
                    disabled={!canAdvanceTime}
                    onClick={() => setStep("people")}
                    render={
                      <motion.button
                        type="button"
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: 6,
                                scale: 0.96,
                                filter: "blur(5px)",
                              }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { ...popSpring, delay: 0.1 / clampedSpeed }
                        }
                        whileHover={
                          canAdvanceTime && !reduceMotion
                            ? { scale: 1.015 }
                            : undefined
                        }
                        whileTap={
                          canAdvanceTime && !reduceMotion
                            ? { scale: 0.985 }
                            : undefined
                        }
                      />
                    }
                    className={cn(
                      "flex h-[44px] w-full items-center justify-center rounded-full text-[15px] font-semibold outline-none transition-colors duration-200",
                      canAdvanceTime
                        ? isDark
                          ? "cursor-pointer bg-[#ffffff] text-[#111111] hover:bg-[#e7e7ea]"
                          : "cursor-pointer bg-[#111111] text-white hover:bg-[#26262b]"
                        : isDark
                          ? "cursor-default bg-[#5e5b53] text-[#111111]/70"
                          : "cursor-default bg-[#cfccc3] text-white",
                    )}
                  >
                    {nextLabel}
                  </ButtonPrimitive>
                </motion.div>
              )}

              {(step === "people" || step === "busy") && (
                <motion.div
                  key="step-people"
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 8, filter: "blur(6px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 0,
                          y: -6,
                          filter: "blur(6px)",
                          transition: { duration: 0.14 / clampedSpeed },
                        }
                  }
                  transition={popSpring}
                  className="flex flex-col gap-[14px] pt-[14px]"
                >
                  {/* Attendee chips backed by @ui-sdk/react/toggle */}
                  <ToggleGroup
                    multiple
                    disabled={step === "busy"}
                    aria-label="Attendees"
                    value={selectedPeople
                      .map((idx) => peopleList[idx])
                      .filter((name): name is string => Boolean(name))}
                    onValueChange={(nextNames) => {
                      setSelectedPeople(
                        nextNames
                          .map((name) => peopleList.indexOf(name))
                          .filter((idx) => idx >= 0),
                      );
                    }}
                    render={
                      <motion.div
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: 6,
                                scale: 0.96,
                                filter: "blur(5px)",
                              }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { ...popSpring, delay: 0 }
                        }
                      />
                    }
                    className="flex flex-wrap gap-2"
                  >
                    {peopleList.map((name, idx) => {
                      const active = selectedPeople.includes(idx);
                      return (
                        <Toggle
                          key={name}
                          value={name}
                          disabled={step === "busy"}
                          render={
                            <motion.button
                              type="button"
                              whileTap={
                                step !== "busy" && !reduceMotion
                                  ? { scale: 0.96 }
                                  : undefined
                              }
                            />
                          }
                          className={cn(
                            "inline-flex h-[36px] cursor-pointer items-center gap-2 rounded-full pr-4 pl-1.5 text-[14px] font-medium outline-none transition-colors duration-200",
                            "disabled:pointer-events-none",
                            active
                              ? isDark
                                ? "bg-[#ffffff] text-[#111111]"
                                : "bg-[#111111] text-white"
                              : isDark
                                ? "bg-[#323238] text-[#ffffff] hover:bg-[#3c3c44]"
                                : "bg-[#f2f2f2] text-[#111111] hover:bg-[#e7e7ea]",
                          )}
                        >
                          <span
                            style={{
                              backgroundColor: tones[idx % tones.length],
                            }}
                            className={cn(
                              "inline-flex size-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold tracking-tight",
                              isDark ? "text-[#e2dacc]" : "text-[#5e574c]",
                            )}
                          >
                            {getInitials(name)}
                          </span>
                          <span>{getFirstName(name)}</span>
                        </Toggle>
                      );
                    })}
                  </ToggleGroup>

                  {/* Duration selector with traveling pill */}
                  <motion.fieldset
                    aria-label="Duration"
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: 6, scale: 0.96, filter: "blur(5px)" }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { ...popSpring, delay: 0.05 / clampedSpeed }
                    }
                    className="m-0 border-0 p-0"
                  >
                    <div className="relative" style={{ height: ROW_H }}>
                      <div
                        className="grid gap-2"
                        style={{
                          gridTemplateColumns: `repeat(${durationList.length}, 1fr)`,
                        }}
                      >
                        {durationList.map((dur) => (
                          <div
                            key={dur}
                            style={{ height: ROW_H }}
                            className={cn(
                              "rounded-full",
                              isDark ? "bg-[#323238]" : "bg-[#f2f2f2]",
                            )}
                          />
                        ))}
                      </div>

                      <motion.div
                        aria-hidden="true"
                        animate={{ x: durIndex * (durCellW + GRID_GAP) }}
                        transition={reduceMotion ? { duration: 0 } : snapSpring}
                        style={{ width: durCellW, height: ROW_H }}
                        className={cn(
                          "pointer-events-none absolute top-0 left-0 rounded-full",
                          isDark ? "bg-[#ffffff]" : "bg-[#111111]",
                        )}
                      />

                      <div
                        className="absolute inset-0 grid gap-2"
                        style={{
                          gridTemplateColumns: `repeat(${durationList.length}, 1fr)`,
                        }}
                      >
                        {durationList.map((dur, idx) => {
                          const active = idx === durIndex;
                          return (
                            <button
                              key={dur}
                              type="button"
                              disabled={step === "busy"}
                              aria-pressed={active}
                              onClick={() => setDurIndex(idx)}
                              style={{ height: ROW_H }}
                              className={cn(
                                "relative z-10 flex cursor-pointer items-center justify-center rounded-full text-[14.5px] font-semibold outline-none transition-colors duration-200",
                                "disabled:pointer-events-none",
                                active
                                  ? isDark
                                    ? "text-[#111111]"
                                    : "text-white"
                                  : isDark
                                    ? "text-[#ffffff]"
                                    : "text-[#111111]",
                              )}
                            >
                              {dur}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.fieldset>

                  {/* Back + Schedule row */}
                  <div className="flex w-full items-center">
                    <AnimatePresence initial={false}>
                      {step === "people" && (
                        <ButtonPrimitive
                          key="back-btn"
                          onClick={() => setStep("time")}
                          render={
                            <motion.button
                              type="button"
                              initial={
                                reduceMotion
                                  ? false
                                  : {
                                      opacity: 0,
                                      width: 0,
                                      marginRight: 0,
                                      filter: "blur(4px)",
                                    }
                              }
                              animate={{
                                opacity: 1,
                                width: "auto",
                                marginRight: GRID_GAP,
                                filter: "blur(0px)",
                                transition: reduceMotion
                                  ? { duration: 0 }
                                  : {
                                      ...snapSpring,
                                      delay: 0.09 / clampedSpeed,
                                    },
                              }}
                              exit={
                                reduceMotion
                                  ? undefined
                                  : {
                                      opacity: 0,
                                      width: 0,
                                      marginRight: 0,
                                      filter: "blur(4px)",
                                      transition: {
                                        duration: 0.18 / clampedSpeed,
                                        ease: [0.4, 0, 1, 1],
                                      },
                                    }
                              }
                            />
                          }
                          className={cn(
                            "flex h-[44px] shrink-0 cursor-pointer items-center overflow-hidden rounded-full text-[15px] font-semibold whitespace-nowrap outline-none transition-colors",
                            isDark
                              ? "bg-[#323238] text-[#ffffff] hover:bg-[#3c3c44]"
                              : "bg-[#f2f2f2] text-[#111111] hover:bg-[#e7e7ea]",
                          )}
                        >
                          <span className="inline-flex items-center gap-1.5 pr-4 pl-3">
                            <BackIcon className="size-[16px] shrink-0" />
                            <span>{backLabel}</span>
                          </span>
                        </ButtonPrimitive>
                      )}
                    </AnimatePresence>

                    <ButtonPrimitive
                      disabled={!canSchedule || step === "busy"}
                      onClick={handleSchedule}
                      render={
                        <motion.button
                          type="button"
                          initial={
                            reduceMotion
                              ? false
                              : {
                                  opacity: 0,
                                  y: 6,
                                  scale: 0.96,
                                  filter: "blur(5px)",
                                }
                          }
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            filter: "blur(0px)",
                          }}
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { ...popSpring, delay: 0.05 / clampedSpeed }
                          }
                          whileHover={
                            canSchedule && step === "people" && !reduceMotion
                              ? { scale: 1.015 }
                              : undefined
                          }
                          whileTap={
                            canSchedule && step === "people" && !reduceMotion
                              ? { scale: 0.985 }
                              : undefined
                          }
                        />
                      }
                      className={cn(
                        "flex h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold whitespace-nowrap outline-none transition-colors duration-200",
                        canSchedule
                          ? isDark
                            ? "cursor-pointer bg-[#ffffff] text-[#111111] hover:bg-[#e7e7ea]"
                            : "cursor-pointer bg-[#111111] text-white hover:bg-[#26262b]"
                          : isDark
                            ? "cursor-default bg-[#5e5b53] text-[#111111]/70"
                            : "cursor-default bg-[#cfccc3] text-white",
                      )}
                    >
                      {step === "busy" && (
                        <SpinnerIcon className="size-[17px] shrink-0" />
                      )}
                      <MorphText
                        text={
                          step === "busy"
                            ? busyLabel
                            : `${scheduleLabel} · ${whenLabel}`
                        }
                        staggerMs={12}
                        speed={clampedSpeed}
                        reduceMotion={reduceMotion}
                        transition={snapSpring}
                        className="truncate"
                      />
                    </ButtonPrimitive>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
