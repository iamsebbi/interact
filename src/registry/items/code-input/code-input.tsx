"use client";

import { Input as InputPrimitive } from "@ui-sdk/react/input";
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

export type CodeInputState = "rest" | "entry" | "verify" | "ok";
export type CodeInputSize = "sm" | "md" | "lg" | "xl";
export type CodeInputTheme = "light" | "dark";

export interface CodeInputProps {
  /** Number of digits (4 to 8, default 6). */
  length?: number;
  label?: string;
  busyLabel?: string;
  doneLabel?: string;
  /** Demo valid code used when `onVerify` is omitted (default `"123456"`). */
  testCode?: string;
  /** Milliseconds to hold the Verified state before resetting (0 disables auto-reset). */
  resetAfterMs?: number;
  size?: CodeInputSize;
  theme?: CodeInputTheme;
  bounce?: number;
  speed?: number;
  showTray?: boolean;
  /** Async or sync verifier; return `true` to verify or `false` to reject with shake. */
  onVerify?: (code: string) => boolean | Promise<boolean>;
  onComplete?: (code: string) => void;
  onVerified?: (code: string) => void;
  onRejected?: (code: string) => void;
  onOpen?: () => void;
  /** Incrementing counter that plays a demo typing run (used by previews/Studio Play). */
  replaySignal?: number;
  /** Smoothly resets to rest when false in grid previews. */
  active?: boolean;
  className?: string;
  style?: CSSProperties;
}

const SIZE_HEIGHT: Record<CodeInputSize, number> = {
  sm: 36,
  md: 44,
  lg: 50,
  xl: 54,
};

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

function LockIcon({ className }: { className?: string }) {
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
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.6" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5.5 12.6l4.2 4.2 8.8-9.3" />
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
                transition: { duration: 0.14 / Math.max(0.25, speed) },
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

function getCellRadius(index: number, count: number, height: number): string {
  const outer = height / 2;
  const inner = Math.round(outer * 0.55);
  if (index === 0) return `${outer}px ${inner}px ${inner}px ${outer}px`;
  if (index === count - 1) return `${inner}px ${outer}px ${outer}px ${inner}px`;
  return `${inner}px`;
}

export function CodeInput({
  length = 6,
  label = "Enter code",
  busyLabel = "Verifying",
  doneLabel = "Verified",
  testCode = "123456",
  resetAfterMs = 2100,
  size = "md",
  theme = "light",
  bounce = 1,
  speed = 1,
  showTray = true,
  onVerify,
  onComplete,
  onVerified,
  onRejected,
  onOpen,
  replaySignal,
  active,
  className,
  style,
}: CodeInputProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const isDark = theme === "dark";
  const count = Math.max(4, Math.min(8, Math.round(length)));
  const clampedBounce = Math.max(
    0,
    Math.min(1.6, Number.isFinite(bounce) ? bounce : 1),
  );
  const clampedSpeed = Math.max(
    0.5,
    Math.min(2, Number.isFinite(speed) ? speed : 1),
  );

  const height = SIZE_HEIGHT[size];
  const pad = 5;
  const fontSize = Number((height * 0.341).toFixed(2));
  const digitFontSize = Number((fontSize * 1.27).toFixed(2));
  const iconSize = Number((height * 0.41).toFixed(2));
  const iconGap = Math.round(height * 0.18);
  const cellW = Math.round((height * 40) / 44);
  const cellGap = Math.round((height * 6) / 44);
  const totalCellsW = count * cellW + (count - 1) * cellGap;

  const expectedCode = useMemo(() => {
    const clean = String(testCode ?? "").replace(/\D/g, "");
    return clean.length >= count
      ? clean.slice(0, count)
      : clean + "1234567890".slice(clean.length, count);
  }, [count, testCode]);
  const cellSlots = useMemo(
    () => Array.from({ length: count }, (_, i) => `cell-${count}-${i}`),
    [count],
  );

  const [state, setState] = useState<CodeInputState>("rest");
  const [digits, setDigits] = useState<string[]>(() => Array(count).fill(""));
  const [rollDir, setRollDir] = useState<1 | -1>(1);
  const [isBad, setIsBad] = useState(false);
  const [ringVisible, setRingVisible] = useState(false);
  const [mainExpanded, setMainExpanded] = useState(true);
  const [showSheen, setShowSheen] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [pressedRest, setPressedRest] = useState(false);

  const stateRef = useRef<CodeInputState>("rest");
  stateRef.current = state;
  const valueRef = useRef("");
  const timersRef = useRef<number[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mainSizerRef = useRef<HTMLSpanElement | null>(null);
  const [measuredMainW, setMeasuredMainW] = useState(146);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  const schedule = useCallback(
    (ms: number, fn: () => void) => {
      const id = window.setTimeout(
        fn,
        Math.round(ms / Math.max(0.25, clampedSpeed)),
      );
      timersRef.current.push(id);
    },
    [clampedSpeed],
  );

  // Keep digits array synced when `length` changes.
  useEffect(() => {
    clearTimers();
    valueRef.current = "";
    if (inputRef.current) inputRef.current.value = "";
    setDigits(Array(count).fill(""));
    setState("rest");
    setIsBad(false);
    setRingVisible(false);
    setMainExpanded(true);
    setShowSheen(false);
  }, [clearTimers, count]);

  useEffect(() => clearTimers, [clearTimers]);

  const activeMainLabel =
    state === "verify" ? busyLabel : state === "ok" ? doneLabel : label;

  // Measure pill width via offsetWidth (immune to ancestor transform: scale()).
  useIsomorphicLayoutEffect(() => {
    if (mainSizerRef.current && mainSizerRef.current.offsetWidth > 0) {
      setMeasuredMainW(mainSizerRef.current.offsetWidth);
    }
  }, [activeMainLabel, fontSize, height, iconSize]);

  const resetToRest = useCallback(() => {
    clearTimers();
    valueRef.current = "";
    if (inputRef.current) inputRef.current.value = "";
    setDigits(Array(count).fill(""));
    setIsBad(false);
    setRingVisible(false);
    setShowSheen(false);
    setMainExpanded(true);
    setState("rest");
  }, [clearTimers, count]);

  const closeFromEmpty = useCallback(() => {
    clearTimers();
    setRingVisible(false);
    setIsBad(false);
    setState("rest");
    setMainExpanded(false);
    schedule(60, () => {
      setMainExpanded(true);
    });
  }, [clearTimers, schedule]);

  const openUp = useCallback(() => {
    if (stateRef.current !== "rest") return;
    clearTimers();
    setIsBad(false);
    setShowSheen(false);
    setState("entry");
    setMainExpanded(false);
    setRingVisible(false);
    schedule(140, () => {
      if (stateRef.current === "entry") {
        setRingVisible(valueRef.current.length < count);
      }
    });
    onOpen?.();
  }, [clearTimers, count, onOpen, schedule]);

  const runVerification = useCallback(
    async (code: string) => {
      clearTimers();
      setRingVisible(false);
      setIsBad(false);
      setState("verify");
      setMainExpanded(false);
      onComplete?.(code);

      schedule(110, () => {
        if (stateRef.current === "verify") {
          setMainExpanded(true);
        }
      });

      const startedAt = performance.now();
      let passed = false;
      if (onVerify) {
        try {
          passed = Boolean(await onVerify(code));
        } catch {
          passed = false;
        }
      } else {
        passed = code === expectedCode;
      }

      const minDelay = 1150 / Math.max(0.25, clampedSpeed);
      const remainingWait = Math.max(
        0,
        minDelay - (performance.now() - startedAt),
      );
      if (remainingWait > 0) {
        await new Promise<void>((resolve) => {
          const id = window.setTimeout(resolve, remainingWait);
          timersRef.current.push(id);
        });
      }

      if (stateRef.current !== "verify") return;

      if (passed) {
        setState("ok");
        setMainExpanded(true);
        inputRef.current?.blur();
        if (!reduceMotion) {
          schedule(400, () => setShowSheen(true));
          schedule(1280, () => setShowSheen(false));
        }
        onVerified?.(code);
        if (resetAfterMs > 0) {
          schedule(resetAfterMs, () => {
            resetToRest();
          });
        }
      } else {
        // Rejected: split back into red cells, shake, roll digits out right-to-left, and refocus.
        setState("entry");
        setMainExpanded(false);
        setIsBad(true);
        setRingVisible(false);
        onRejected?.(code);

        schedule(140, () => {
          setShaking(true);
        });
        schedule(600, () => {
          setShaking(false);
        });

        valueRef.current = "";
        if (inputRef.current) inputRef.current.value = "";
        setRollDir(-1);

        for (let i = count - 1; i >= 0; i--) {
          const stepIdx = count - 1 - i;
          schedule(420 + stepIdx * 45, () => {
            setDigits((prev) => {
              const next = [...prev];
              next[i] = "";
              return next;
            });
          });
        }

        schedule(420 + count * 45, () => {
          setIsBad(false);
          if (stateRef.current === "entry") {
            setRingVisible(true);
          }
        });

        inputRef.current?.focus({ preventScroll: true });
      }
    },
    [
      clampedSpeed,
      clearTimers,
      count,
      expectedCode,
      onComplete,
      onRejected,
      onVerified,
      onVerify,
      reduceMotion,
      resetAfterMs,
      resetToRest,
      schedule,
    ],
  );

  const applyCodeValue = useCallback(
    (raw: string) => {
      const clean = raw.replace(/\D/g, "").slice(0, count);
      if (stateRef.current === "rest") {
        if (!clean) return;
        setState("entry");
        setMainExpanded(false);
        setIsBad(false);
        setShowSheen(false);
      } else if (stateRef.current !== "entry") {
        return;
      }
      const prev = valueRef.current;
      if (clean === prev) return;
      valueRef.current = clean;
      if (inputRef.current && inputRef.current.value !== clean) {
        inputRef.current.value = clean;
      }

      setRollDir(clean.length >= prev.length ? 1 : -1);
      setDigits(Array.from({ length: count }, (_, idx) => clean[idx] ?? ""));
      setRingVisible(clean.length < count);

      if (clean.length === count) {
        schedule(220, () => {
          void runVerification(clean);
        });
      }
    },
    [count, runVerification, schedule],
  );

  // Preview / Studio Play external replay & smooth hover-leave reset.
  const prevReplayRef = useRef(replaySignal ?? 0);
  useEffect(() => {
    if (active === false) {
      resetToRest();
      return;
    }
    const nextSignal = replaySignal ?? 0;
    if (nextSignal > 0 && nextSignal !== prevReplayRef.current) {
      prevReplayRef.current = nextSignal;
      resetToRest();
      schedule(60, () => {
        setState("entry");
        setMainExpanded(false);
        setRingVisible(true);
        const chars = expectedCode.slice(0, count).split("");
        chars.forEach((_ch, idx) => {
          schedule(240 + idx * 140, () => {
            const partial = chars.slice(0, idx + 1).join("");
            valueRef.current = partial;
            setRollDir(1);
            setDigits(
              Array.from({ length: count }, (_, i) => partial[i] ?? ""),
            );
            setRingVisible(partial.length < count);
            if (partial.length === count) {
              schedule(220, () => {
                void runVerification(partial);
              });
            }
          });
        });
      });
    }
  }, [
    active,
    count,
    expectedCode,
    replaySignal,
    resetToRest,
    runVerification,
    schedule,
  ]);

  const morphSpring = useMemo(
    () => perceptualSpring("morph", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const popSpring = useMemo(
    () => perceptualSpring("pop", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const snapSpring = useMemo(
    () => perceptualSpring("snap", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const settleSpring = useMemo(
    () => perceptualSpring("settle", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );
  const pressSpring = useMemo(
    () => perceptualSpring("press", clampedSpeed, clampedBounce),
    [clampedBounce, clampedSpeed],
  );

  const isEntry = state === "entry";
  const showMain = state !== "entry" && mainExpanded;
  const activeInnerW = isEntry ? totalCellsW : measuredMainW;
  const trayW = activeInnerW + 2 * pad;
  const trayH = height + 2 * pad;
  const trayRadius = height / 2 + pad;
  const activeRingIndex = Math.min(valueRef.current.length, count - 1);
  const halfIndex = (count - 1) / 2;

  const statusAnnouncement =
    state === "ok"
      ? doneLabel
      : state === "verify"
        ? busyLabel
        : isBad
          ? "Invalid code, try again"
          : state === "entry"
            ? `Entering ${count}-digit code`
            : label;

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-slot="code-input"
        data-status={state}
        data-error={isBad ? "true" : "false"}
        data-theme={theme}
        className={cn(
          "relative inline-block select-none align-middle tabular-nums",
          className,
        )}
        style={style}
      >
        <output aria-live="polite" className="sr-only">
          {statusAnnouncement}
        </output>

        {/* Offscreen sizer for exact main pill width */}
        <div
          aria-hidden="true"
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-nowrap"
          style={{ fontSize }}
        >
          <span
            ref={mainSizerRef}
            className="inline-flex items-center rounded-full font-semibold"
            style={{
              height,
              gap: iconGap,
              paddingLeft: Math.round(height * 0.45),
              paddingRight: Math.round(height * 0.45),
            }}
          >
            <span
              style={{ width: iconSize, height: iconSize }}
              className="inline-block shrink-0"
            />
            <span>{activeMainLabel}</span>
          </span>
        </div>

        {/* Outer shake wrapper */}
        <motion.div
          animate={
            shaking && !reduceMotion
              ? { x: [0, 14, -12, 9, -5, 2, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.42 / clampedSpeed, ease: "easeOut" }}
        >
          {/* Elevated outer tray */}
          <motion.div
            animate={{ width: trayW }}
            transition={reduceMotion ? { duration: 0 } : morphSpring}
            style={{
              height: trayH,
              borderRadius: trayRadius,
            }}
            className={cn(
              "relative overflow-hidden transition-[background-color,box-shadow] duration-200",
              showTray
                ? isDark
                  ? "bg-[#26262b] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_1px_1px_rgba(0,0,0,0.3),0_6px_16px_-6px_rgba(0,0,0,0.45),0_22px_44px_-24px_rgba(0,0,0,0.6)]"
                  : "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04),0_6px_16px_-6px_rgba(0,0,0,0.1),0_22px_44px_-24px_rgba(0,0,0,0.16)]"
                : "bg-transparent shadow-none",
            )}
          >
            {/* Main pill (Enter code / Verifying / Verified) */}
            <motion.div
              aria-hidden={!showMain}
              animate={{
                width: showMain ? measuredMainW : height,
                opacity: showMain ? 1 : 0,
                scale: showMain
                  ? pressedRest && state === "rest"
                    ? 1.06
                    : 1
                  : 0.55,
                filter: showMain || reduceMotion ? "blur(0px)" : "blur(8px)",
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : pressedRest && state === "rest"
                    ? pressSpring
                    : showMain
                      ? morphSpring
                      : settleSpring
              }
              style={{
                height,
                top: pad,
                left: "50%",
                x: "-50%",
                fontSize,
              }}
              className={cn(
                "pointer-events-none absolute flex items-center justify-center overflow-hidden rounded-full font-semibold whitespace-nowrap transition-colors duration-200",
                state === "ok"
                  ? isDark
                    ? "bg-[#16a34a] text-white"
                    : "bg-[#15803d] text-white"
                  : isDark
                    ? "bg-[#323238] text-[#ffffff]"
                    : "bg-[#f2f2f2] text-[#111111]",
              )}
            >
              {showSheen && (
                <motion.span
                  aria-hidden="true"
                  initial={{ x: "-115%" }}
                  animate={{ x: "115%" }}
                  transition={{ duration: 0.85, ease: [0.25, 0.7, 0.25, 1] }}
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 32%, rgba(255,255,255,0.58) 50%, transparent 68%)",
                  }}
                />
              )}

              <span
                className="flex items-center whitespace-nowrap"
                style={{ gap: iconGap }}
              >
                <span
                  style={{ width: iconSize, height: iconSize }}
                  className="relative inline-flex shrink-0 items-center justify-center"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={
                        state === "ok"
                          ? "ok"
                          : state === "verify"
                            ? "verify"
                            : "rest"
                      }
                      initial={
                        reduceMotion
                          ? false
                          : {
                              opacity: 0,
                              scale: 0.4,
                              rotate: -40,
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
                              scale: 0.4,
                              filter: "blur(4px)",
                              transition: { duration: 0.14 / clampedSpeed },
                            }
                      }
                      transition={popSpring}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {state === "ok" ? (
                        <CheckIcon className="h-full w-full" />
                      ) : state === "verify" ? (
                        <SpinnerIcon className="h-full w-full" />
                      ) : (
                        <LockIcon className="h-full w-full" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>

                <MorphText
                  text={activeMainLabel}
                  staggerMs={state === "ok" ? 14 : 13}
                  speed={clampedSpeed}
                  reduceMotion={reduceMotion}
                  transition={snapSpring}
                />
              </span>
            </motion.div>

            {/* Split-out digit cells */}
            <div
              aria-hidden={!isEntry}
              style={{
                top: pad,
                left: pad,
                width: totalCellsW,
                height,
              }}
              className="pointer-events-none absolute"
            >
              {digits.map((digit, idx) => {
                const targetX = idx * (cellW + cellGap);
                const centerX = totalCellsW / 2 - cellW / 2;
                const splitDelay =
                  (20 + Math.abs(idx - halfIndex) * 22) / (1000 * clampedSpeed);
                const collapseDelay =
                  ((halfIndex - Math.abs(idx - halfIndex)) * 30) /
                  (1000 * clampedSpeed);

                return (
                  <motion.div
                    key={cellSlots[idx]}
                    initial={false}
                    animate={{
                      x: isEntry ? targetX : centerX,
                      opacity: isEntry ? 1 : 0,
                      scale: isEntry ? 1 : 0.55,
                      filter:
                        isEntry || reduceMotion ? "blur(0px)" : "blur(8px)",
                    }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : isEntry
                          ? { ...popSpring, delay: splitDelay }
                          : { ...settleSpring, delay: collapseDelay }
                    }
                    style={{
                      width: cellW,
                      height,
                      borderRadius: getCellRadius(idx, count, height),
                      fontSize: digitFontSize,
                    }}
                    className={cn(
                      "absolute top-0 left-0 flex items-center justify-center overflow-hidden font-semibold transition-colors duration-200",
                      isBad
                        ? isDark
                          ? "bg-[#451a1f] text-[#ff5c61]"
                          : "bg-[#fef2f2] text-[#dc2626]"
                        : isDark
                          ? "bg-[#323238] text-[#ffffff]"
                          : "bg-[#f2f2f2] text-[#111111]",
                    )}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {digit && (
                        <motion.span
                          key={`${cellSlots[idx]}-${digit}`}
                          initial={
                            reduceMotion
                              ? false
                              : {
                                  opacity: 0,
                                  y: rollDir > 0 ? "0.62em" : "-0.62em",
                                  filter: "blur(4px)",
                                }
                          }
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={
                            reduceMotion
                              ? undefined
                              : {
                                  opacity: 0,
                                  y: rollDir > 0 ? "-0.62em" : "0.62em",
                                  filter: "blur(4px)",
                                  transition: {
                                    duration: 0.16 / clampedSpeed,
                                  },
                                }
                          }
                          transition={snapSpring}
                          className="inline-block leading-none"
                        >
                          {digit}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Traveling active-cell focus ring with blinking caret */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  x: activeRingIndex * (cellW + cellGap),
                  opacity: isEntry && ringVisible ? 1 : 0,
                  scale: isEntry && ringVisible ? 1 : 0.72,
                  borderRadius: getCellRadius(activeRingIndex, count, height),
                }}
                transition={reduceMotion ? { duration: 0 } : snapSpring}
                style={{
                  width: cellW,
                  height,
                  boxShadow: isDark
                    ? "inset 0 0 0 2px #ffffff"
                    : "inset 0 0 0 2px #111111",
                }}
                className="pointer-events-none absolute top-0 left-0 z-10 flex items-center justify-center"
              >
                {isEntry && ringVisible && (
                  <motion.span
                    animate={
                      reduceMotion ? undefined : { opacity: [1, 1, 0, 0, 1] }
                    }
                    transition={{
                      duration: 1.1,
                      repeat: Number.POSITIVE_INFINITY,
                      times: [0, 0.49, 0.5, 0.99, 1],
                    }}
                    className={cn(
                      "h-[40%] w-[1.5px] rounded-full",
                      isDark ? "bg-[#ffffff]" : "bg-[#111111]",
                    )}
                  />
                )}
              </motion.div>
            </div>

            {/* Transparent native OTP input backed by @ui-sdk/react/input */}
            <InputPrimitive
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={count}
              aria-label={`${count}-digit code`}
              disabled={state === "verify" || state === "ok"}
              value={digits.join("")}
              onValueChange={(nextVal) => {
                applyCodeValue(nextVal);
              }}
              onPointerDown={() => {
                if (state === "rest") setPressedRest(true);
              }}
              onPointerUp={() => setPressedRest(false)}
              onPointerLeave={() => setPressedRest(false)}
              onClick={() => {
                if (state === "rest") {
                  inputRef.current?.focus();
                  openUp();
                }
              }}
              onFocus={() => {
                if (state === "rest") openUp();
              }}
              onBlur={() => {
                if (state === "entry" && !valueRef.current) {
                  closeFromEmpty();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  inputRef.current?.blur();
                  if (state === "entry" && !valueRef.current) {
                    closeFromEmpty();
                  }
                }
              }}
              className={cn(
                "absolute inset-0 z-20 m-0 h-full w-full border-0 bg-transparent p-0 text-[16px] text-transparent caret-transparent opacity-0 outline-none",
                state === "entry" ? "cursor-text" : "cursor-pointer",
                (state === "verify" || state === "ok") && "pointer-events-none",
              )}
            />
          </motion.div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
