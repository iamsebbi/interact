import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BlobConfig,
  GlobalsConfig,
  TileConfig,
} from "../../types/gradient";
import { DEFAULT_TILES } from "../../constants/defaults";
import { clone } from "../../utils/color";
import { ensureBlobIds } from "../../utils/storage";
import { GradientTile } from "../GradientTile";
import { BotAvatar, type AvatarExpression } from "../bot-avatar";
import { Palette } from "../palette/Palette";
import { WakeSlider } from "../ui/wake-slider";
import { DownloadButton } from "../ui/download-button";
import {
  COLOR_PICKER_PLAY_COLORS,
  ColorPickerStagePreview,
  type ColorPickerConfig,
} from "../showcase/demos/ColorPickerDemo";
import { type PaletteConfig } from "../showcase/demos/PaletteDemo";
import { type WakeSliderConfig } from "../showcase/demos/WakeSliderDemo";
import { type DownloadButtonConfig } from "../showcase/demos/DownloadButtonDemo";
import { BlobHandlesOverlay } from "./BlobHandlesOverlay";
import { ExportModal } from "./ExportModal";
import { PresetsModal } from "./PresetsModal";
import { StudioDock } from "./StudioDock";
import { StudioCodeModal } from "./StudioCodeModal";
import { BotAvatarInspector } from "./inspectors/BotAvatarInspector";
import { ColorPickerInspector } from "./inspectors/ColorPickerInspector";
import { PaletteInspector } from "./inspectors/PaletteInspector";
import { WakeSliderInspector } from "./inspectors/WakeSliderInspector";
import { GradientInspector } from "./inspectors/GradientInspector";
import { DownloadButtonInspector } from "./inspectors/DownloadButtonInspector";
import {
  STUDIO_COMPONENTS,
  StudioBotConfig,
  StudioComponentId,
  StudioConfigMap,
  StudioGradientConfig,
  StudioSceneBg,
  buildStudioAiPrompt,
  buildStudioJsx,
  getDefaultStudioConfig,
} from "./registry";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";
import { Check, Code01, Download04, Refresh, Sparkles } from "../icons";

const STUDIO_STORAGE_KEY = "interact:studio-v2";

export interface IncomingStudioTarget {
  componentId: StudioComponentId;
  config?: unknown;
}

export interface StudioProps {
  onNavigateToShowcase?: () => void;
  incomingTarget?: IncomingStudioTarget | null;
}

function createInitialConfigs(): StudioConfigMap {
  const base: StudioConfigMap = {
    "bot-avatar": getDefaultStudioConfig("bot-avatar"),
    "color-picker": getDefaultStudioConfig("color-picker"),
    palette: getDefaultStudioConfig("palette"),
    "wake-slider": getDefaultStudioConfig("wake-slider"),
    gradient: {
      ...getDefaultStudioConfig("gradient"),
      globals: { ...getDefaultStudioConfig("gradient").globals, size: 280 },
    },
    "download-button": getDefaultStudioConfig("download-button"),
  };

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STUDIO_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StudioConfigMap>;
        if (parsed["bot-avatar"]) {
          base["bot-avatar"] = { ...base["bot-avatar"], ...parsed["bot-avatar"] };
        }
        if (parsed["color-picker"]) {
          base["color-picker"] = {
            ...base["color-picker"],
            ...parsed["color-picker"],
          };
        }
        if (parsed.palette) {
          base.palette = { ...base.palette, ...parsed.palette };
        }
        if (parsed["wake-slider"]) {
          base["wake-slider"] = {
            ...base["wake-slider"],
            ...parsed["wake-slider"],
          };
        }
        if (parsed.gradient?.tile && parsed.gradient?.globals) {
          const tile = ensureBlobIds([parsed.gradient.tile])[0];
          base.gradient = {
            tile,
            globals: { ...base.gradient.globals, ...parsed.gradient.globals },
          };
        }
        if (parsed["download-button"]) {
          base["download-button"] = {
            ...base["download-button"],
            ...parsed["download-button"],
          };
        }
      }
    } catch {
      // ignore invalid stored state
    }
  }

  return base;
}

type HistoryMap = Record<StudioComponentId, unknown[]>;

const EMPTY_HISTORY: HistoryMap = {
  "bot-avatar": [],
  "color-picker": [],
  palette: [],
  "wake-slider": [],
  gradient: [],
  "download-button": [],
};

export default function Studio({ incomingTarget }: StudioProps = {}) {
  const [activeId, setActiveId] = useState<StudioComponentId>(
    () => incomingTarget?.componentId ?? "bot-avatar"
  );
  const [configs, setConfigs] = useState<StudioConfigMap>(() => {
    const initial = createInitialConfigs();
    if (incomingTarget?.componentId && incomingTarget.config) {
      const id = incomingTarget.componentId;
      return {
        ...initial,
        [id]: {
          ...(initial[id] as object),
          ...(incomingTarget.config as object),
        },
      };
    }
    return initial;
  });

  const [past, setPast] = useState<HistoryMap>(EMPTY_HISTORY);
  const [future, setFuture] = useState<HistoryMap>(EMPTY_HISTORY);
  const isUndoingRef = useRef(false);
  const lastCommittedRef = useRef<Record<StudioComponentId, string>>({
    "bot-avatar": JSON.stringify(configs["bot-avatar"]),
    "color-picker": JSON.stringify(configs["color-picker"]),
    palette: JSON.stringify(configs.palette),
    "wake-slider": JSON.stringify(configs["wake-slider"]),
    gradient: JSON.stringify(configs.gradient),
    "download-button": JSON.stringify(configs["download-button"]),
  });

  // Scene & Dock state
  const [sceneBg, setSceneBg] = useState<StudioSceneBg>("dots");
  const [zoom, setZoom] = useState<number>(1);
  const [copiedJsx, setCopiedJsx] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);

  // Per-component interactive preview states
  const [botPlayExpr, setBotPlayExpr] = useState<AvatarExpression | null>(null);
  const botPlayStepRef = useRef(0);
  const botTimerRef = useRef<number | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerStepRef = useRef(0);

  const [paletteRollCount, setPaletteRollCount] = useState(0);
  const [paletteColors, setPaletteColors] = useState<string[]>([
    "#e6fffb",
    "#43e0cf",
    "#0b6f74",
    "#032224",
  ]);

  const [gradAnimKey, setGradAnimKey] = useState(0);
  const [downloadReplaySignal, setDownloadReplaySignal] = useState(0);
  const [downloadResetKey, setDownloadResetKey] = useState(0);
  const [blobIdx, setBlobIdx] = useState(0);
  const [draggingBlob, setDraggingBlob] = useState<number | null>(null);
  const [hoveredBlob, setHoveredBlob] = useState<number | null>(null);
  const [disableBlur, setDisableBlur] = useState(false);

  const gradTileRef = useRef<HTMLDivElement | null>(null);
  const dragCleanupRef = useRef<(() => void) | null>(null);
  const configsRef = useRef(configs);
  configsRef.current = configs;

  // Apply incoming target when user jumps from Showcase into Studio
  useEffect(() => {
    if (!incomingTarget) return;
    setActiveId(incomingTarget.componentId);
    if (incomingTarget.config) {
      const id = incomingTarget.componentId;
      setConfigs((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] as object),
          ...(incomingTarget.config as object),
        },
      }));
    }
  }, [incomingTarget]);

  // Persist Studio configs to localStorage (debounced)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(configs));
      } catch {
        // ignore quota errors
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [configs]);

  // Debounced per-component Undo history
  const activeConfig = configs[activeId];
  useEffect(() => {
    const serialized = JSON.stringify(activeConfig);
    if (isUndoingRef.current) {
      isUndoingRef.current = false;
      lastCommittedRef.current[activeId] = serialized;
      return;
    }
    if (serialized === lastCommittedRef.current[activeId]) return;

    const prevSnapshot = JSON.parse(lastCommittedRef.current[activeId]);
    const timer = window.setTimeout(() => {
      setPast((prev) => ({
        ...prev,
        [activeId]: [...prev[activeId].slice(-39), prevSnapshot],
      }));
      setFuture((prev) => ({ ...prev, [activeId]: [] }));
      lastCommittedRef.current[activeId] = serialized;
    }, 280);

    return () => window.clearTimeout(timer);
  }, [activeId, activeConfig]);

  // Cleanup drag & timers on unmount
  useEffect(() => {
    return () => {
      if (botTimerRef.current !== null) window.clearTimeout(botTimerRef.current);
      if (dragCleanupRef.current) dragCleanupRef.current();
    };
  }, []);

  const updateActiveConfig = useCallback(
    <K extends StudioComponentId>(id: K, next: StudioConfigMap[K]) => {
      setConfigs((prev) => ({ ...prev, [id]: next }));
    },
    []
  );

  const undo = useCallback(() => {
    const stack = past[activeId];
    if (stack.length === 0) return;
    const previous = stack[stack.length - 1];
    isUndoingRef.current = true;
    setPast((prev) => ({ ...prev, [activeId]: stack.slice(0, -1) }));
    setFuture((prev) => ({
      ...prev,
      [activeId]: [clone(configsRef.current[activeId]), ...prev[activeId]],
    }));
    setConfigs((prev) => ({ ...prev, [activeId]: previous }));
  }, [activeId, past]);

  const redo = useCallback(() => {
    const stack = future[activeId];
    if (stack.length === 0) return;
    const next = stack[0];
    isUndoingRef.current = true;
    setFuture((prev) => ({ ...prev, [activeId]: stack.slice(1) }));
    setPast((prev) => ({
      ...prev,
      [activeId]: [...prev[activeId], clone(configsRef.current[activeId])],
    }));
    setConfigs((prev) => ({ ...prev, [activeId]: next }));
  }, [activeId, future]);

  // Keyboard shortcuts (Ctrl+Z / Ctrl+Y)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  const handleReset = () => {
    const fresh = getDefaultStudioConfig(activeId);
    if (activeId === "gradient") {
      (fresh as StudioGradientConfig).globals.size = 280;
    }
    if (activeId === "download-button") {
      setDownloadResetKey((k) => k + 1);
    }
    updateActiveConfig(activeId, fresh as never);
    setBlobIdx(0);
  };

  const handlePlay = () => {
    if (activeId === "bot-avatar") {
      if (botTimerRef.current !== null) window.clearTimeout(botTimerRef.current);
      const pool: AvatarExpression[] = ["excited", "happy", "wink", "surprised"];
      const filtered = pool.filter((e) => e !== configs["bot-avatar"].expression);
      const next = filtered[botPlayStepRef.current % filtered.length];
      botPlayStepRef.current += 1;
      setBotPlayExpr(next);
      botTimerRef.current = window.setTimeout(() => {
        setBotPlayExpr(null);
        botTimerRef.current = null;
      }, 1500);
      return;
    }
    if (activeId === "color-picker") {
      if (configs["color-picker"].mode === "popover") {
        setPickerOpen((p) => !p);
      } else {
        const next =
          COLOR_PICKER_PLAY_COLORS[
            pickerStepRef.current % COLOR_PICKER_PLAY_COLORS.length
          ];
        pickerStepRef.current += 1;
        updateActiveConfig("color-picker", {
          ...configs["color-picker"],
          value: next,
        });
      }
      return;
    }
    if (activeId === "palette") {
      setPaletteRollCount((c) => c + 1);
      return;
    }
    if (activeId === "wake-slider") {
      const steps = [24, 88, 46, 64];
      const curr = configs["wake-slider"].value;
      const idx = steps.indexOf(curr);
      const next = steps[(idx + 1) % steps.length];
      updateActiveConfig("wake-slider", {
        ...configs["wake-slider"],
        value: next,
      });
      return;
    }
    if (activeId === "download-button") {
      setDownloadReplaySignal((s) => s + 1);
      return;
    }
    setGradAnimKey((k) => k + 1);
  };

  const handleCopyJsx = async () => {
    try {
      const code = buildStudioJsx(activeId, configs[activeId] as never);
      await navigator.clipboard.writeText(code);
      setCopiedJsx(true);
      setTimeout(() => setCopiedJsx(false), 1800);
    } catch {}
  };

  const handleCopyPrompt = async () => {
    try {
      const prompt = buildStudioAiPrompt(activeId, configs[activeId] as never);
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 1800);
    } catch {}
  };

  // Gradient helpers (single editable tile)
  const gradConfig = configs.gradient;
  const gradTile = gradConfig.tile;
  const gradGlobals = gradConfig.globals;

  const patchGradTile = (patch: Partial<TileConfig>) => {
    updateActiveConfig("gradient", {
      ...gradConfig,
      tile: { ...gradTile, ...patch },
    });
  };

  const patchGradGlobals = (patch: Partial<GlobalsConfig>) => {
    updateActiveConfig("gradient", {
      ...gradConfig,
      globals: { ...gradGlobals, ...patch },
    });
  };

  const patchGradBlob = (idx: number, patch: Partial<BlobConfig>) => {
    const nextBlobs = gradTile.blobs.map((b, i) =>
      i === idx ? { ...b, ...patch } : b
    );
    patchGradTile({ blobs: nextBlobs });
  };

  const addGradBlob = () => {
    const palette = ["#818cf8", "#38bdf8", "#f472b6", "#34d399", "#fbbf24"];
    const nextBlob: BlobConfig = {
      id: `b-${Date.now().toString(36)}`,
      w: 55,
      h: 55,
      x: 50,
      y: 50,
      color: palette[gradTile.blobs.length % palette.length],
      blur: 32,
      rot: 0,
    };
    const nextBlobs = [...gradTile.blobs, nextBlob];
    patchGradTile({ blobs: nextBlobs });
    setBlobIdx(nextBlobs.length - 1);
  };

  const duplicateGradBlob = (idx: number) => {
    const src = gradTile.blobs[idx];
    if (!src) return;
    const copyBlob: BlobConfig = {
      ...clone(src),
      id: `b-${Date.now().toString(36)}`,
      x: Math.min(95, src.x + 6),
      y: Math.min(95, src.y + 6),
    };
    const nextBlobs = [
      ...gradTile.blobs.slice(0, idx + 1),
      copyBlob,
      ...gradTile.blobs.slice(idx + 1),
    ];
    patchGradTile({ blobs: nextBlobs });
    setBlobIdx(idx + 1);
  };

  const removeSpecificGradBlob = (idx: number) => {
    if (gradTile.blobs.length <= 1) return;
    const nextBlobs = gradTile.blobs.filter((_, i) => i !== idx);
    patchGradTile({ blobs: nextBlobs });
    setBlobIdx((prev) => Math.max(0, Math.min(prev, nextBlobs.length - 1)));
  };

  const shuffleGradTile = () => {
    const rand = (min: number, max: number) =>
      Math.round(min + Math.random() * (max - min));
    const nextBlobs = gradTile.blobs.map((b) => ({
      ...b,
      x: rand(15, 85),
      y: rand(15, 85),
      rot: rand(-90, 90),
    }));
    patchGradTile({ blobs: nextBlobs });
  };

  const handleBlobPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    idx: number
  ) => {
    e.stopPropagation();
    const container = e.currentTarget.parentElement;
    if (!container) return;

    if (dragCleanupRef.current) dragCleanupRef.current();
    setBlobIdx(idx);
    setDraggingBlob(idx);

    const rect = container.getBoundingClientRect();
    const onMove = (ev: PointerEvent) => {
      const nx = Math.max(
        0,
        Math.min(100, Math.round(((ev.clientX - rect.left) / rect.width) * 100))
      );
      const ny = Math.max(
        0,
        Math.min(100, Math.round(((ev.clientY - rect.top) / rect.height) * 100))
      );
      const currentGrad = configsRef.current.gradient;
      const nextBlobs = currentGrad.tile.blobs.map((b, i) =>
        i === idx ? { ...b, x: nx, y: ny } : b
      );
      updateActiveConfig("gradient", {
        ...currentGrad,
        tile: { ...currentGrad.tile, blobs: nextBlobs },
      });
    };

    const onUp = () => {
      setDraggingBlob(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      dragCleanupRef.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    dragCleanupRef.current = onUp;
  };

  const handleBlobWheel = (
    e: React.WheelEvent<HTMLDivElement>,
    idx: number
  ) => {
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 4 : -4;
    const b = gradTile.blobs[idx];
    if (!b) return;
    patchGradBlob(idx, {
      w: Math.max(10, Math.min(160, b.w + delta)),
      h: Math.max(10, Math.min(160, b.h + delta)),
    });
  };

  const applyPresetTile = (preset: TileConfig) => {
    const clean = ensureBlobIds([clone(preset)])[0];
    patchGradTile(clean);
    setBlobIdx(0);
    setGradAnimKey((k) => k + 1);
  };

  const activeMeta = STUDIO_COMPONENTS.find((c) => c.id === activeId)!;
  const canUndo = past[activeId].length > 0;
  const canRedo = future[activeId].length > 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] w-full bg-background text-foreground flex flex-col lg:flex-row p-3 sm:p-4 gap-3.5 antialiased select-none lg:overflow-hidden">
      {/* LEFT: Main Interactive Canvas */}
      <main
        className={cn(
          "relative flex-1 min-h-[460px] lg:min-h-0 rounded-3xl border border-border flex flex-col items-center justify-between p-4 sm:p-5 overflow-hidden shadow-xl transition-colors",
          sceneBg === "light"
            ? "light bg-[#f4f4f6] text-neutral-900"
            : sceneBg === "dark"
            ? "dark bg-[#09090b] text-white"
            : "bg-card text-foreground"
        )}
      >
        {/* Dot Grid Overlay when sceneBg === "dots" */}
        {sceneBg === "dots" && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        )}

        {/* Top Component Switcher Pill */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-30 max-w-full overflow-x-auto no-scrollbar"
        >
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-popover/90 border border-border backdrop-blur-md shadow-lg text-xs">
            {STUDIO_COMPONENTS.map((comp) => {
              const isActive = comp.id === activeId;
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setActiveId(comp.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                  )}
                >
                  <span>{comp.shortTitle}</span>
                  {comp.tier === "pro" && (
                    <span
                      className={cn(
                        "text-[9px] font-mono px-1.5 py-0.2 rounded-full uppercase",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary/15 text-primary"
                      )}
                    >
                      PRO
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Live Component Stage */}
        <div className="relative z-10 flex-1 w-full flex items-center justify-center min-h-0 py-6">
          <div
            className="relative flex items-center justify-center transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            {activeId === "bot-avatar" && (
              <BotAvatar
                shape={configs["bot-avatar"].shape}
                expression={botPlayExpr ?? configs["bot-avatar"].expression}
                bodyColor={configs["bot-avatar"].bodyColor}
                eyeColor={configs["bot-avatar"].eyeColor}
                size={configs["bot-avatar"].size}
                trackGaze={configs["bot-avatar"].trackGaze}
                interactive={configs["bot-avatar"].interactive}
                enableVibration={configs["bot-avatar"].enableVibration}
              />
            )}

            {activeId === "color-picker" && (
              <ColorPickerStagePreview
                config={configs["color-picker"]}
                interactive={true}
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                onValueChange={(value) =>
                  updateActiveConfig("color-picker", {
                    ...configs["color-picker"],
                    value,
                  })
                }
                onFormatChange={(format) =>
                  updateActiveConfig("color-picker", {
                    ...configs["color-picker"],
                    format,
                  })
                }
              />
            )}

            {activeId === "palette" && (
              <Palette
                count={configs.palette.count}
                corner={configs.palette.corner}
                morph={configs.palette.morph}
                rollSignal={paletteRollCount}
                onChange={setPaletteColors}
              />
            )}

            {activeId === "wake-slider" && (
              <div className="w-[300px] sm:w-[400px] p-5 rounded-2xl bg-card/80 border border-border backdrop-blur-sm">
                <WakeSlider
                  value={Math.min(
                    configs["wake-slider"].max,
                    Math.max(
                      configs["wake-slider"].min,
                      configs["wake-slider"].value
                    )
                  )}
                  min={configs["wake-slider"].min}
                  max={configs["wake-slider"].max}
                  step={configs["wake-slider"].step}
                  bars={configs["wake-slider"].bars}
                  wake={configs["wake-slider"].wake}
                  unit={configs["wake-slider"].unit}
                  showReading={configs["wake-slider"].showReading}
                  fullWidth={configs["wake-slider"].fullWidth}
                  disabled={configs["wake-slider"].disabled}
                  onChange={(value) =>
                    updateActiveConfig("wake-slider", {
                      ...configs["wake-slider"],
                      value,
                    })
                  }
                />
              </div>
            )}

            {activeId === "gradient" && (
              <div ref={gradTileRef} className="relative flex items-center justify-center">
                <GradientTile
                  id="studio-gradient-tile"
                  tile={gradTile}
                  globals={gradGlobals}
                  size={gradGlobals.size}
                  animationKey={gradAnimKey}
                  selected={true}
                  disableBlur={disableBlur}
                  className="shadow-2xl"
                />
                <BlobHandlesOverlay
                  tile={gradTile}
                  radius={gradGlobals.radius}
                  blobIdx={Math.min(blobIdx, Math.max(0, gradTile.blobs.length - 1))}
                  draggingBlob={draggingBlob}
                  hoveredBlob={hoveredBlob}
                  onBlobPointerDown={handleBlobPointerDown}
                  onBlobWheel={handleBlobWheel}
                />
              </div>
            )}

            {activeId === "download-button" && (
              <DownloadButton
                key={downloadResetKey}
                sizeMB={configs["download-button"].sizeMB}
                durationMs={Math.round(configs["download-button"].durationSec * 1000)}
                progressFormat={configs["download-button"].progressFormat}
                size={configs["download-button"].size}
                theme={
                  sceneBg === "light"
                    ? "light"
                    : sceneBg === "dark"
                    ? "dark"
                    : undefined
                }
                replaySignal={downloadReplaySignal}
              />
            )}
          </div>
        </div>

        {/* Bottom Minimalist Dock */}
        <div className="relative z-30">
          <StudioDock
            sceneBg={sceneBg}
            onChangeSceneBg={setSceneBg}
            zoom={zoom}
            onChangeZoom={setZoom}
            onPlay={handlePlay}
            onCopyJsx={handleCopyJsx}
            copiedJsx={copiedJsx}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        </div>
      </main>

      {/* RIGHT: Inspector Sidepanel */}
      <aside className="w-full lg:w-96 rounded-3xl border border-border bg-card backdrop-blur-md overflow-hidden flex flex-col shadow-xl shrink-0">
        {/* Common Inspector Header */}
        <div className="p-4 border-b border-border flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm font-semibold tracking-tight text-foreground truncate">
              {activeMeta.title}
            </h2>
            <span
              className={cn(
                "text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase shrink-0",
                activeMeta.tier === "pro"
                  ? "bg-primary/15 text-primary border-primary/25 font-semibold"
                  : "bg-secondary text-muted-foreground border-border"
              )}
            >
              {activeMeta.tier}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
              className="size-8 rounded-full bg-secondary hover:bg-accent border border-border text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              ↶
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
              className="size-8 rounded-full bg-secondary hover:bg-accent border border-border text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              ↷
            </button>
            <button
              type="button"
              onClick={handleReset}
              title={`Reset ${activeMeta.title}`}
              aria-label={`Reset ${activeMeta.title}`}
              className="size-8 rounded-full bg-secondary hover:bg-accent border border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
            >
              <Refresh size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable Component-Specific Controls */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4">
          {activeId === "bot-avatar" && (
            <BotAvatarInspector
              config={configs["bot-avatar"]}
              onChange={(next: StudioBotConfig) =>
                updateActiveConfig("bot-avatar", next)
              }
            />
          )}

          {activeId === "color-picker" && (
            <ColorPickerInspector
              config={configs["color-picker"]}
              onChange={(next: ColorPickerConfig) =>
                updateActiveConfig("color-picker", next)
              }
            />
          )}

          {activeId === "palette" && (
            <PaletteInspector
              config={configs.palette}
              onChange={(next: PaletteConfig) =>
                updateActiveConfig("palette", next)
              }
              activeColors={paletteColors}
              onRoll={() => setPaletteRollCount((c) => c + 1)}
            />
          )}

          {activeId === "wake-slider" && (
            <WakeSliderInspector
              config={configs["wake-slider"]}
              onChange={(next: WakeSliderConfig) =>
                updateActiveConfig("wake-slider", next)
              }
            />
          )}

          {activeId === "gradient" && (
            <GradientInspector
              tile={gradTile}
              globals={gradGlobals}
              blobIdx={blobIdx}
              setBi={setBlobIdx}
              setHoveredBlob={setHoveredBlob}
              patchTile={patchGradTile}
              patchBlob={patchGradBlob}
              patchGlobals={patchGradGlobals}
              addBlob={addGradBlob}
              duplicateBlob={duplicateGradBlob}
              removeBlob={() => removeSpecificGradBlob(blobIdx)}
              removeSpecificBlob={removeSpecificGradBlob}
              shuffleTile={shuffleGradTile}
              disableBlur={disableBlur}
              onToggleBlur={() => setDisableBlur((p) => !p)}
              onOpenPresets={() => setIsPresetsModalOpen(true)}
              onBumpAnimation={() => setGradAnimKey((k) => k + 1)}
              onDebouncedBumpAnimation={() => setGradAnimKey((k) => k + 1)}
            />
          )}

          {activeId === "download-button" && (
            <DownloadButtonInspector
              config={configs["download-button"]}
              onChange={(next: DownloadButtonConfig) =>
                updateActiveConfig("download-button", next)
              }
            />
          )}
        </div>

        {/* Fixed Inspector Footer */}
        <div className="p-3.5 border-t border-border bg-card/80 flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={handleCopyJsx}
            className="flex-1"
            iconLeft={copiedJsx ? <Check size={14} /> : <Code01 size={14} />}
          >
            {copiedJsx ? "Copied" : "Copy JSX"}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={handleCopyPrompt}
            className="flex-1"
            iconLeft={copiedPrompt ? <Check size={14} /> : <Sparkles size={14} />}
          >
            {copiedPrompt ? "Copied" : "AI Prompt"}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsExportModalOpen(true)}
            iconLeft={<Download04 size={14} />}
          >
            Export
          </Button>
        </div>
      </aside>

      {/* Export Modals */}
      {activeId === "gradient" ? (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          tile={gradTile}
          globals={gradGlobals}
          tileElement={gradTileRef.current?.firstElementChild as HTMLElement | null}
        />
      ) : (
        <StudioCodeModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          componentId={activeId}
          config={configs[activeId]}
        />
      )}

      {/* Gradient Presets Modal */}
      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        globals={gradGlobals}
        activeTileIndex={0}
        onApplyToSelected={applyPresetTile}
        onAppendTile={applyPresetTile}
        onLoadPack={(pack) =>
          applyPresetTile(
            DEFAULT_TILES[pack.tileIndices[0]] ?? DEFAULT_TILES[0]
          )
        }
      />
    </div>
  );
}
