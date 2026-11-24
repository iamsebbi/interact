"use client";

import type { CSSProperties } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import type {
  ComponentDemoProps,
  ComponentPreviewProps,
} from "@/registry/types";
import {
  DEFAULT_DISTORTION_WAVES_CONFIG,
  type DistortionWavesConfig,
  type DistortionWavesTheme,
  normalizeDistortionWavesText,
} from "./config";
import {
  DistortionWave,
  type DistortionWaveHandle,
  type DistortionWavePalette,
  type DistortionWaveStyleInput,
  type DistortionWaveType,
} from "./distortion-waves";

export interface DistortionWavesShowcaseProps {
  type?: DistortionWaveType;
  palette?: DistortionWavePalette | (string & {});
  theme?: DistortionWavesTheme;
  title?: string;
  subtitle?: string;
  amount?: string;
  ctaLabel?: string;
  resetLabel?: string;
  travel?: number;
  amplitude?: number;
  lensWidth?: number;
  aberration?: number;
  blur?: number;
  particleCount?: number;
  scrub?: number | null;
  replaySignal?: number;
  previewActive?: boolean;
  width?: number;
  height?: number;
  onFinish?: (revealed: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

function CheckIcon({
  className,
  strokeWidth = 2.4,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CoinsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="9.5" cy="7.5" rx="5.5" ry="2.5" />
      <path d="M4 7.5v3.5c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5V7.5" />
      <path d="M4 11v3.5c0 1.38 2.46 2.5 5.5 2.5 1.15 0 2.22-.16 3.1-.43" />
      <ellipse cx="16.5" cy="13.5" rx="4.5" ry="2" />
      <path d="M12 13.5V17c0 1.1 2.01 2 4.5 2s4.5-.9 4.5-2v-3.5" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function DistortionWavesShowcase({
  type = "vertical",
  palette,
  theme = "light",
  title,
  subtitle,
  amount,
  ctaLabel,
  resetLabel = "Done",
  travel,
  amplitude,
  lensWidth,
  aberration,
  blur,
  particleCount,
  scrub = null,
  replaySignal,
  previewActive,
  width = 380,
  height,
  onFinish,
  className,
  style,
}: DistortionWavesShowcaseProps) {
  const waveRef = useRef<DistortionWaveHandle>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const centerTokenRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [frozenScrub, setFrozenScrub] = useState<number | null>(null);
  const isDark = theme === "dark";
  const prevReplayRef = useRef<number | undefined>(replaySignal);
  const replayRafRef = useRef<number | null>(null);
  const returnTimerRef = useRef<number | null>(null);
  const needsPostUnscrubResetRef = useRef<"replay" | "idle" | null>(null);
  const revealedRef = useRef(revealed);
  revealedRef.current = revealed;
  const frozenScrubRef = useRef(frozenScrub);
  frozenScrubRef.current = frozenScrub;
  const previewActiveRef = useRef(previewActive);
  previewActiveRef.current = previewActive;

  const cardHeight = height ?? (type === "center" ? 386 : 447);
  const resolvedPalette = palette ?? (type === "center" ? "green" : "colorful");

  useEffect(() => {
    return () => {
      if (replayRafRef.current !== null) {
        cancelAnimationFrame(replayRafRef.current);
      }
      if (returnTimerRef.current !== null) {
        window.clearTimeout(returnTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (previewActive !== false) return;
    if (replayRafRef.current !== null) {
      cancelAnimationFrame(replayRafRef.current);
      replayRafRef.current = null;
    }
    if (returnTimerRef.current !== null) {
      window.clearTimeout(returnTimerRef.current);
      returnTimerRef.current = null;
    }
    if (revealedRef.current) {
      setRevealed(false);
    }
  }, [previewActive]);

  useLayoutEffect(() => {
    const mode = needsPostUnscrubResetRef.current;
    if (!mode || frozenScrub !== null) return;
    needsPostUnscrubResetRef.current = null;
    waveRef.current?.reset();
    if (mode === "replay") {
      replayRafRef.current = requestAnimationFrame(() => {
        replayRafRef.current = null;
        if (previewActiveRef.current !== false) {
          setRevealed(true);
        }
      });
    }
  }, [frozenScrub]);

  useEffect(() => {
    if (replaySignal === 0) {
      if (prevReplayRef.current !== 0) {
        prevReplayRef.current = 0;
        if (replayRafRef.current !== null) {
          cancelAnimationFrame(replayRafRef.current);
          replayRafRef.current = null;
        }
        if (returnTimerRef.current !== null) {
          window.clearTimeout(returnTimerRef.current);
          returnTimerRef.current = null;
        }
        if (frozenScrubRef.current !== null) {
          needsPostUnscrubResetRef.current = "idle";
          setFrozenScrub(null);
          setRevealed(false);
        } else {
          needsPostUnscrubResetRef.current = null;
          waveRef.current?.reset();
          setRevealed(false);
        }
      }
      return;
    }
    if (
      replaySignal === undefined ||
      prevReplayRef.current === replaySignal ||
      previewActiveRef.current === false
    ) {
      return;
    }
    prevReplayRef.current = replaySignal;
    if (replayRafRef.current !== null) {
      cancelAnimationFrame(replayRafRef.current);
      replayRafRef.current = null;
    }
    if (returnTimerRef.current !== null) {
      window.clearTimeout(returnTimerRef.current);
      returnTimerRef.current = null;
    }
    if (frozenScrubRef.current !== null) {
      needsPostUnscrubResetRef.current = "replay";
      setFrozenScrub(null);
      setRevealed(false);
      return;
    }
    if (!revealedRef.current) {
      setRevealed(true);
      return;
    }
    waveRef.current?.reset();
    setRevealed(false);
    replayRafRef.current = requestAnimationFrame(() => {
      replayRafRef.current = null;
      if (previewActiveRef.current !== false) {
        setRevealed(true);
      }
    });
  }, [replaySignal]);

  const handleWaveFinish = useCallback(
    (isRevealed: boolean) => {
      onFinish?.(isRevealed);
      if (isRevealed && previewActiveRef.current === true) {
        if (returnTimerRef.current !== null) {
          window.clearTimeout(returnTimerRef.current);
        }
        returnTimerRef.current = window.setTimeout(() => {
          returnTimerRef.current = null;
          if (previewActiveRef.current === true) {
            setRevealed(false);
          }
        }, 650);
      }
    },
    [onFinish],
  );

  const handleAction = useCallback(() => {
    if (replayRafRef.current !== null) {
      cancelAnimationFrame(replayRafRef.current);
      replayRafRef.current = null;
    }
    if (revealed) {
      waveRef.current?.reset();
      setRevealed(false);
      return;
    }
    setRevealed(true);
  }, [revealed]);

  const waveStyle = useMemo<DistortionWaveStyleInput | undefined>(() => {
    const next: DistortionWaveStyleInput = {};
    if (travel !== undefined) next.travel = travel;
    if (amplitude !== undefined) next.amplitude = amplitude;
    if (lensWidth !== undefined) next.lensWidth = lensWidth;
    if (aberration !== undefined) next.aberration = aberration;
    if (blur !== undefined) next.blur = blur;
    if (particleCount !== undefined) next.particleCount = particleCount;
    return Object.keys(next).length > 0 ? next : undefined;
  }, [travel, amplitude, lensWidth, aberration, blur, particleCount]);

  // Both layers use strictly opaque backgrounds for WebGL2 snapshots
  const tokens = isDark
    ? {
        surface: "#1d1d1f",
        boxSurface: "#222224",
        ink: "#f5f5f7",
        muted: "rgba(255, 255, 255, 0.52)",
        hairline: "rgba(255, 255, 255, 0.08)",
        rowDivider: "rgba(255, 255, 255, 0.07)",
        badgeBg: "#2c2c2e",
        badgeFg: "#a1a1a6",
        checkCircleBg: "#2d2d30",
        checkCircleFg: "#e5e5ea",
        successBg: "#35ba00",
        successFg: "#ffffff",
        btnBg: "#ffffff",
        btnFg: "#111111",
        cardShadow:
          "0 18px 44px -12px rgba(0, 0, 0, 0.58), 0 0 0 1px rgba(255, 255, 255, 0.08)",
      }
    : {
        surface: "#ffffff",
        boxSurface: "#f7f7f8",
        ink: "#111113",
        muted: "rgba(17, 17, 19, 0.54)",
        hairline: "rgba(0, 0, 0, 0.08)",
        rowDivider: "rgba(0, 0, 0, 0.07)",
        badgeBg: "#ededf0",
        badgeFg: "#52525b",
        checkCircleBg: "#e7e7ec",
        checkCircleFg: "#18181b",
        successBg: "#28b400",
        successFg: "#ffffff",
        btnBg: "#141416",
        btnFg: "#ffffff",
        cardShadow:
          "0 0 0 1px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.04), 0 14px 32px -6px rgba(0, 0, 0, 0.08)",
      };

  const recipientName = title || "Maya Chen";
  const transferNote = subtitle || "Studio rent";
  const transferAmount = amount || "$1,250.00";
  const transferCta = ctaLabel || "Confirm";

  const creditsTitle = title || "Add credits";
  const creditsSubtitle = subtitle || "Current balance: $65.73";
  const creditsNewBalance = amount || "$85.73";
  const creditsCta = ctaLabel || "Buy $20 tokens";

  if (type === "center") {
    const features = [
      `Balance goes to ${creditsNewBalance} right away`,
      "Use credits for document rewrites",
      "Credits never expire",
    ];

    const renderCreditsView = (isRevealedView: boolean) => (
      <div
        style={{
          width,
          height: cardHeight,
          backgroundColor: tokens.surface,
          color: tokens.ink,
          borderStyle: "none",
        }}
        className="flex flex-col justify-between p-6 pb-[84px] text-left antialiased select-none"
      >
        <div className="flex flex-col items-center pt-1 text-center">
          <div
            ref={!isRevealedView ? centerTokenRef : undefined}
            style={{
              backgroundColor: isRevealedView
                ? tokens.successBg
                : tokens.badgeBg,
              color: isRevealedView ? tokens.successFg : tokens.badgeFg,
            }}
            className="mb-3.5 flex size-[46px] shrink-0 items-center justify-center rounded-full"
          >
            {isRevealedView ? (
              <CheckIcon className="size-5" strokeWidth={2.5} />
            ) : (
              <CoinsIcon className="size-[22px]" />
            )}
          </div>
          <div className="text-[22px] leading-tight font-semibold tracking-[-0.02em]">
            {isRevealedView
              ? creditsTitle === "Add credits"
                ? "Credits added"
                : `${creditsTitle} added`
              : creditsTitle}
          </div>
          <div
            style={{ color: tokens.muted }}
            className="mt-1 text-[13px] font-normal"
          >
            {isRevealedView
              ? `Current balance: ${creditsNewBalance}`
              : creditsSubtitle}
          </div>
        </div>

        <div
          style={{
            backgroundColor: tokens.boxSurface,
            border: `1px solid ${tokens.hairline}`,
          }}
          className="overflow-hidden rounded-[20px]"
        >
          {features.map((label, idx) => (
            <div
              key={label}
              style={{
                borderStyle: "none",
                borderTop: idx > 0 ? `1px solid ${tokens.rowDivider}` : "none",
              }}
              className="flex items-center gap-3 px-4 py-3 text-[13px] leading-snug font-medium"
            >
              <span
                style={{
                  backgroundColor: tokens.checkCircleBg,
                  color: tokens.checkCircleFg,
                }}
                className="flex size-5 shrink-0 items-center justify-center rounded-full"
              >
                <CheckIcon className="size-3" strokeWidth={2.5} />
              </span>
              <span className="truncate">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );

    const creditsOverlay = (
      <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-center">
        <button
          ref={ctaButtonRef}
          type="button"
          onClick={handleAction}
          style={{
            backgroundColor: tokens.btnBg,
            color: tokens.btnFg,
          }}
          className="pointer-events-auto flex h-12 w-full cursor-pointer items-center justify-center rounded-full px-6 text-[14px] font-semibold tracking-[-0.01em] shadow-sm transition-transform active:scale-[0.98]"
        >
          {revealed ? resetLabel : creditsCta}
        </button>
      </div>
    );

    return (
      <div
        data-theme={theme}
        className={cn("inline-block max-w-full", className)}
        style={{
          backgroundColor: tokens.surface,
          borderRadius: 38,
          ...style,
        }}
      >
        <DistortionWave
          ref={waveRef}
          revealed={revealed}
          type="center"
          palette={resolvedPalette}
          source={centerTokenRef}
          waveStyle={waveStyle}
          scrub={scrub}
          onFinish={onFinish}
          revealedContent={renderCreditsView(true)}
          overlay={creditsOverlay}
          className="max-w-full"
          style={{
            width,
            maxWidth: "100%",
            height: cardHeight,
            borderRadius: 38,
            overflow: "hidden",
            boxShadow: tokens.cardShadow,
          }}
        >
          {renderCreditsView(false)}
        </DistortionWave>
      </div>
    );
  }

  const isHorizontal = type === "horizontal";

  const renderTransferView = (isRevealedView: boolean) => {
    const rows = [
      { label: "From", value: "Everyday ·· 4821" },
      {
        label: isRevealedView ? "Arrived" : "Arrives",
        value: isRevealedView ? "Just now" : "In seconds",
      },
      { label: "Fee", value: "Free" },
      { label: "Note", value: transferNote },
    ];

    return (
      <div
        style={{
          width,
          height: cardHeight,
          backgroundColor: tokens.surface,
          color: tokens.ink,
          borderStyle: "none",
        }}
        className={cn(
          "flex flex-col justify-between p-6 text-left antialiased select-none",
          isHorizontal ? "pl-[82px]" : "pb-[84px]",
        )}
      >
        <div className="flex flex-col items-center pt-1 text-center">
          <div className="mb-3 flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
            {isRevealedView ? (
              <div
                style={{
                  backgroundColor: tokens.successBg,
                  color: tokens.successFg,
                }}
                className="flex size-full items-center justify-center rounded-full"
              >
                <CheckIcon className="size-5" strokeWidth={2.5} />
              </div>
            ) : (
              /* biome-ignore lint/performance/noImgElement: local asset serialized inside distortion-waves SVG foreignObject snapshot */
              <img
                src="/images/maya-chen.jpg"
                alt={recipientName}
                className="size-full object-cover"
              />
            )}
          </div>

          <div className="text-[13px] leading-snug">
            <span style={{ color: tokens.muted }}>
              {isRevealedView ? "Sent to " : "Sending to "}
            </span>
            <span className="font-medium">{recipientName}</span>
          </div>

          <div className="mt-1 text-[34px] leading-tight font-semibold tracking-[-0.03em] tabular-nums">
            {transferAmount}
          </div>
        </div>

        <div
          style={{
            backgroundColor: tokens.boxSurface,
            border: `1px solid ${tokens.hairline}`,
          }}
          className="overflow-hidden rounded-[20px]"
        >
          {rows.map((row, idx) => (
            <div
              key={row.label}
              style={{
                borderStyle: "none",
                borderTop: idx > 0 ? `1px solid ${tokens.rowDivider}` : "none",
              }}
              className="flex items-center justify-between gap-3 px-4 py-3 text-[13px]"
            >
              <span style={{ color: tokens.muted }}>{row.label}</span>
              <span className="truncate font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const transferOverlay = isHorizontal ? (
    <div className="pointer-events-none absolute inset-y-4 left-4 flex items-stretch">
      <button
        ref={ctaButtonRef}
        type="button"
        onClick={handleAction}
        aria-label={revealed ? resetLabel : transferCta}
        style={{
          backgroundColor: tokens.btnBg,
          color: tokens.btnFg,
        }}
        className="pointer-events-auto flex w-12 cursor-pointer items-center justify-center rounded-[22px] shadow-sm transition-transform active:scale-[0.97]"
      >
        {revealed ? (
          <CheckIcon className="size-5" strokeWidth={2.3} />
        ) : (
          <ArrowRightIcon className="size-5" />
        )}
      </button>
    </div>
  ) : (
    <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-center">
      <button
        ref={ctaButtonRef}
        type="button"
        onClick={handleAction}
        style={{
          backgroundColor: tokens.btnBg,
          color: tokens.btnFg,
        }}
        className="pointer-events-auto flex h-12 w-full cursor-pointer items-center justify-center rounded-full px-6 text-[14px] font-semibold tracking-[-0.01em] shadow-sm transition-transform active:scale-[0.98]"
      >
        {revealed ? resetLabel : transferCta}
      </button>
    </div>
  );

  return (
    <div
      data-theme={theme}
      className={cn("inline-block max-w-full", className)}
      style={{
        backgroundColor: tokens.surface,
        borderRadius: 38,
        ...style,
      }}
    >
      <DistortionWave
        ref={waveRef}
        revealed={revealed}
        type={type}
        palette={resolvedPalette}
        source={ctaButtonRef}
        waveStyle={waveStyle}
        scrub={scrub ?? frozenScrub}
        onFinish={handleWaveFinish}
        revealedContent={renderTransferView(true)}
        overlay={transferOverlay}
        className="max-w-full"
        style={{
          width,
          maxWidth: "100%",
          height: cardHeight,
          borderRadius: 38,
          overflow: "hidden",
          boxShadow: tokens.cardShadow,
        }}
      >
        {renderTransferView(false)}
      </DistortionWave>
    </div>
  );
}

export function DistortionWavesPreview({
  className,
  replaySignal,
  previewActive,
}: ComponentPreviewProps) {
  return (
    <DistortionWavesShowcase
      theme="light"
      replaySignal={replaySignal}
      previewActive={previewActive}
      className={className}
    />
  );
}

export function DistortionWavesDemo({
  config,
  playKey,
}: ComponentDemoProps<DistortionWavesConfig>) {
  const d = DEFAULT_DISTORTION_WAVES_CONFIG;

  return (
    <DistortionWavesShowcase
      type={config.type}
      palette={config.palette}
      theme={config.theme}
      travel={config.travel}
      amplitude={config.amplitude}
      lensWidth={config.lensWidth}
      aberration={config.aberration}
      blur={config.blur}
      particleCount={config.particleCount}
      title={normalizeDistortionWavesText(config.title, d.title)}
      subtitle={normalizeDistortionWavesText(config.subtitle, d.subtitle)}
      amount={normalizeDistortionWavesText(config.amount, d.amount)}
      ctaLabel={normalizeDistortionWavesText(config.ctaLabel, d.ctaLabel)}
      replaySignal={playKey || undefined}
    />
  );
}
