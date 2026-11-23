"use client";

import {
  Button,
  SelectField,
  Slider,
  Switch,
  TextField,
} from "@/components/controls";
import { cn } from "@/lib/utils";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_VOICE_BUTTON_CONFIG,
  VOICE_COLOR_OPTIONS,
  VOICE_LOOK_OPTIONS,
  VOICE_SIZE_OPTIONS,
  VOICE_THEME_OPTIONS,
  type VoiceButtonConfig,
} from "./config";
import { useVoiceLiveStatus } from "./mic-status";
import type {
  VoiceButtonColorVariant,
  VoiceButtonLook,
  VoiceButtonMode,
  VoiceButtonSize,
  VoiceButtonTheme,
} from "./voice-button";

const DEMO_MODES: readonly { id: VoiceButtonMode; label: string }[] = [
  { id: "voice", label: "Demo Voice" },
  { id: "live", label: "Demo Live" },
];

export function VoiceButtonInspector({
  config,
  onChange,
}: ComponentInspectorProps<VoiceButtonConfig>) {
  const { micState, micError } = useVoiceLiveStatus();
  const patch = (next: Partial<VoiceButtonConfig>) =>
    onChange({ ...config, ...next });

  const liveStatusText =
    config.mode === "live"
      ? micState === "live"
        ? "Microphone live — speak to drive the beam."
        : micState === "requesting"
          ? "Waiting for microphone permission…"
          : micState === "denied"
            ? "Microphone permission denied. Allow access in your browser."
            : micState === "unsupported"
              ? "Microphone capture requires HTTPS or localhost."
              : micState === "error"
                ? micError?.message || "Could not start microphone."
                : "Click the pill on stage to start live microphone capture."
      : null;

  const isErrorState =
    micState === "denied" || micState === "error" || micState === "unsupported";

  return (
    <div className="flex flex-col gap-2 text-xs">
      <div className="flex items-center gap-2">
        {DEMO_MODES.map((item) => {
          const isActive = config.mode === item.id;
          return (
            <Button
              key={item.id}
              type="button"
              size="md"
              variant={isActive ? "primary" : "secondary"}
              onClick={() => patch({ mode: item.id })}
              aria-pressed={isActive}
              className="flex-1 text-xs"
            >
              <span>{item.label}</span>
            </Button>
          );
        })}
      </div>

      {liveStatusText && (
        <p
          role={isErrorState ? "alert" : "status"}
          className={cn(
            "px-0.5 py-0.5 text-[13px] leading-snug",
            isErrorState ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {liveStatusText}
        </p>
      )}

      <SelectField
        label="Size"
        value={config.size}
        options={VOICE_SIZE_OPTIONS}
        onValueChange={(next) => patch({ size: next as VoiceButtonSize })}
      />

      <SelectField
        label="Theme"
        value={config.theme}
        options={VOICE_THEME_OPTIONS}
        onValueChange={(next) => patch({ theme: next as VoiceButtonTheme })}
      />

      <SelectField
        label="Color"
        value={config.colorVariant}
        options={VOICE_COLOR_OPTIONS}
        onValueChange={(next) =>
          patch({ colorVariant: next as VoiceButtonColorVariant })
        }
      />

      <SelectField
        label="Look"
        value={config.look}
        options={VOICE_LOOK_OPTIONS}
        onValueChange={(next) => patch({ look: next as VoiceButtonLook })}
      />

      <TextField
        label="Label"
        value={config.label}
        placeholder="Voice"
        onValueChange={(label) => patch({ label })}
      />

      {!config.showTimer && (
        <TextField
          label="Listening"
          value={config.listeningLabel}
          placeholder="Listening"
          onValueChange={(listeningLabel) => patch({ listeningLabel })}
        />
      )}

      <Slider
        label="Strength"
        value={config.strength}
        min={0.2}
        max={1}
        step={0.05}
        defaultValue={DEFAULT_VOICE_BUTTON_CONFIG.strength}
        onValueChange={(strength) => patch({ strength })}
      />

      {config.mode === "live" && (
        <Slider
          label="Gain"
          value={config.sensitivity}
          min={1}
          max={6}
          step={0.1}
          defaultValue={DEFAULT_VOICE_BUTTON_CONFIG.sensitivity}
          onValueChange={(sensitivity) => patch({ sensitivity })}
        />
      )}

      <Switch
        label="Show Timer"
        checked={config.showTimer}
        onCheckedChange={(showTimer) => patch({ showTimer })}
        aria-label="Toggle elapsed timer during voice capture"
      />
    </div>
  );
}
