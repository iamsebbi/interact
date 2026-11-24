"use client";

import { useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  VoiceBeam,
  type VoiceBeamColorVariant,
  type VoiceBeamLook,
  type VoiceBeamMotion,
} from "voice-glow";
import { cn } from "@/lib/utils";
import "./voice-assistant-card.css";

export type VoiceAssistantPhase = "idle" | "listening" | "thinking";
export type VoiceAssistantTheme = "dark" | "light";

export interface VoiceAssistantCardProps {
  assistantName?: string;
  assistantRole?: string;
  initials?: string;
  greeting?: string;
  transcript?: string;
  wordIntervalMs?: number;
  strength?: number;
  colorVariant?: VoiceBeamColorVariant;
  look?: VoiceBeamLook;
  theme?: VoiceAssistantTheme;
  paused?: boolean;
  replaySignal?: number;
  onPhaseChange?: (phase: VoiceAssistantPhase) => void;
  className?: string;
}

const DEFAULT_TRANSCRIPT =
  "Block out two hours tomorrow morning for deep work and mute notifications";
const DEFAULT_WORD_MS = 280;
const DEFAULT_STRENGTH = 0.6;
const CAPTIONS: Record<VoiceAssistantPhase, string> = {
  idle: "Tap to speak",
  listening: "Listening…",
  thinking: "One moment",
};

const cssMs = (el: HTMLElement, name: string, fb: number) => {
  const v = parseFloat(getComputedStyle(el).getPropertyValue(name));
  return Number.isFinite(v) ? v : fb;
};

function SwapText({
  value,
  reduceMotion,
}: {
  value: string;
  reduceMotion: boolean;
}) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (value === shown) return;
    if (reduceMotion) {
      setShown(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-enter-start");
    el.classList.add("is-exit");
    const t = window.setTimeout(
      () => setShown(value),
      cssMs(el, "--text-swap-dur", 150),
    );
    return () => window.clearTimeout(t);
  }, [value, shown, reduceMotion]);

  useLayoutEffect(() => {
    void shown;
    if (reduceMotion) return;
    const el = ref.current;
    if (!el?.classList.contains("is-exit")) return;
    el.classList.remove("is-exit");
    el.classList.add("is-enter-start");
    void el.offsetHeight;
    el.classList.remove("is-enter-start");
  }, [shown, reduceMotion]);

  return (
    <span ref={ref} className="t-text-swap" aria-live="polite">
      {shown}
    </span>
  );
}

function getThinkingMotion(): VoiceBeamMotion {
  const t =
    (typeof performance !== "undefined" ? performance.now() : Date.now()) /
    1000;
  return {
    gather: 1,
    offset: Math.sin(t * 2.2) * 0.45,
    stretch: 0.25,
    heldLevel: 0.38,
    cornerFollow: 0.35,
  };
}

export function VoiceAssistantCard({
  assistantName = "Kai",
  assistantRole = "Personal assistant",
  initials = "KA",
  greeting = "What's on your mind today?",
  transcript = DEFAULT_TRANSCRIPT,
  wordIntervalMs = DEFAULT_WORD_MS,
  strength = DEFAULT_STRENGTH,
  colorVariant = "mono",
  look = "glow",
  theme = "light",
  paused = false,
  replaySignal,
  onPhaseChange,
  className,
}: VoiceAssistantCardProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [phase, setPhase] = useState<VoiceAssistantPhase>("idle");
  const [count, setCount] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const speaking = useRef(false);
  const timers = useRef<number[]>([]);
  const prevReplayRef = useRef<number | undefined>(replaySignal);

  const words = useMemo(() => {
    const trimmed = transcript.trim();
    return trimmed ? trimmed.split(/\s+/) : [];
  }, [transcript]);

  const wordTokens = useMemo(
    () =>
      words.map((word, offset) => ({
        id: `${offset}-${word}`,
        word,
        isLast: offset === words.length - 1,
        offset,
      })),
    [words],
  );

  const setPhaseWithCallback = useCallback(
    (next: VoiceAssistantPhase) => {
      setPhase(next);
      onPhaseChange?.(next);
    },
    [onPhaseChange],
  );

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const think = useCallback(() => {
    speaking.current = false;
    setPhaseWithCallback("thinking");
    later(() => setPhaseWithCallback("idle"), 1800);
  }, [later, setPhaseWithCallback]);

  const start = useCallback(() => {
    clearTimers();
    setRunKey((k) => k + 1);
    setCount(0);
    speaking.current = true;
    setPhaseWithCallback("listening");
    if (reduceMotion) {
      setCount(words.length);
      later(think, Math.max(800, words.length * Math.min(wordIntervalMs, 140)));
      return;
    }
    words.forEach((_, i) => {
      later(() => setCount(i + 1), 400 + i * wordIntervalMs);
    });
    later(think, 400 + words.length * wordIntervalMs + 500);
  }, [
    clearTimers,
    later,
    reduceMotion,
    setPhaseWithCallback,
    think,
    wordIntervalMs,
    words,
  ]);

  useEffect(() => {
    if (!paused) return;
    clearTimers();
    speaking.current = false;
  }, [paused, clearTimers]);

  useEffect(() => {
    if (replaySignal === 0) {
      if (prevReplayRef.current !== 0) {
        prevReplayRef.current = 0;
        clearTimers();
        speaking.current = false;
        setRunKey(0);
        setCount(0);
        setPhase("idle");
      }
      return;
    }
    if (
      paused ||
      replaySignal === undefined ||
      prevReplayRef.current === replaySignal
    ) {
      return;
    }
    prevReplayRef.current = replaySignal;
    start();
  }, [paused, replaySignal, start, clearTimers]);

  const onTap = () => {
    if (phase === "listening") {
      clearTimers();
      setCount(words.length);
      think();
    } else {
      start();
    }
  };

  const level = useCallback(() => {
    if (!speaking.current) return 0.06;
    const t = Date.now();
    const v =
      0.55 +
      Math.sin(t / 150) * 0.22 +
      Math.sin(t / 61) * 0.12 +
      Math.sin(t / 37) * 0.08;
    return Math.max(0.06, Math.min(1, v)) * strength;
  }, [strength]);

  const live = phase === "listening";
  const avatarStyle = {
    "--av-bg": "#DCEFE8",
    "--av-fg": "#1E3F35",
    "--av-size": "32px",
  } as CSSProperties;

  return (
    <div
      data-theme={theme}
      data-paused={paused ? "true" : undefined}
      className={cn("va-card", className)}
    >
      <VoiceBeam
        className="va-beam"
        level={level}
        paused={paused}
        theme={theme}
        colorVariant={colorVariant}
        look={look}
        borderRadius={25}
        motion={
          phase === "thinking" && !reduceMotion ? getThinkingMotion : null
        }
      >
        <div className="va-inner">
          <div className="va-content">
            <header className="va-top">
              <span
                className="t-av"
                style={avatarStyle}
                role="img"
                aria-label={assistantName}
              >
                {initials.slice(0, 2).toUpperCase()}
              </span>
              <div className="va-top-text">
                <span className="va-name">{assistantName}</span>
                <span className="va-meta">{assistantRole}</span>
              </div>
            </header>
            <div className="va-divider" aria-hidden="true" />
            <div className="va-body">
              <div className="va-bubble-row">
                <p className="va-bubble" style={{ margin: 0 }}>
                  <span>{greeting}</span>
                </p>
              </div>
              <p
                className="va-transcript"
                key={runKey}
                style={{ margin: 0 }}
                aria-live="polite"
              >
                {runKey > 0 &&
                  wordTokens.map((token) => (
                    <span key={token.id}>
                      <span
                        className={`t-stream-w${token.offset < count ? " is-in" : ""}`}
                      >
                        {token.word}
                      </span>
                      {!token.isLast ? " " : ""}
                    </span>
                  ))}
              </p>
            </div>
            <div className="va-bottom">
              <span className="va-caption">
                <SwapText value={CAPTIONS[phase]} reduceMotion={reduceMotion} />
              </span>
              <button
                type="button"
                className={`va-mic${live ? " is-live" : ""}`}
                aria-label={live ? "Stop speaking" : "Start speaking"}
                aria-pressed={live}
                onClick={onTap}
              >
                <span className="va-wave" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </button>
            </div>
          </div>
        </div>
      </VoiceBeam>
    </div>
  );
}

export default VoiceAssistantCard;
