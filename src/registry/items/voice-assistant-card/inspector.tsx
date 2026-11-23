"use client";

import type { VoiceBeamColorVariant, VoiceBeamLook } from "voice-glow";
import {
  SelectField,
  Slider,
  TextareaField,
  TextField,
} from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_VOICE_ASSISTANT_CARD_CONFIG,
  VOICE_ASSISTANT_COLOR_OPTIONS,
  VOICE_ASSISTANT_LOOK_OPTIONS,
  VOICE_ASSISTANT_THEME_OPTIONS,
  type VoiceAssistantCardConfig,
  type VoiceAssistantStudioTheme,
} from "./config";

export function VoiceAssistantCardInspector({
  config,
  onChange,
}: ComponentInspectorProps<VoiceAssistantCardConfig>) {
  const patch = (next: Partial<VoiceAssistantCardConfig>) =>
    onChange({ ...config, ...next });

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Theme"
        value={config.theme}
        options={VOICE_ASSISTANT_THEME_OPTIONS}
        onValueChange={(next) =>
          patch({ theme: next as VoiceAssistantStudioTheme })
        }
      />

      <SelectField
        label="Beam Color"
        value={config.colorVariant}
        options={VOICE_ASSISTANT_COLOR_OPTIONS}
        onValueChange={(next) =>
          patch({ colorVariant: next as VoiceBeamColorVariant })
        }
      />

      <SelectField
        label="Look"
        value={config.look}
        options={VOICE_ASSISTANT_LOOK_OPTIONS}
        onValueChange={(next) => patch({ look: next as VoiceBeamLook })}
      />

      <Slider
        label="Word Pace"
        unit="ms"
        value={config.wordIntervalMs}
        min={120}
        max={500}
        step={20}
        defaultValue={DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.wordIntervalMs}
        onValueChange={(wordIntervalMs) => patch({ wordIntervalMs })}
      />

      <Slider
        label="Strength"
        value={config.strength}
        min={0.2}
        max={1}
        step={0.05}
        defaultValue={DEFAULT_VOICE_ASSISTANT_CARD_CONFIG.strength}
        onValueChange={(strength) => patch({ strength })}
      />

      <TextField
        label="Assistant"
        value={config.assistantName}
        placeholder="Kai"
        onValueChange={(assistantName) => patch({ assistantName })}
      />

      <TextField
        label="Role"
        value={config.assistantRole}
        placeholder="Personal assistant"
        onValueChange={(assistantRole) => patch({ assistantRole })}
      />

      <TextField
        label="Initials"
        maxLength={2}
        value={config.initials}
        placeholder="KA"
        className="w-20 uppercase"
        onValueChange={(initials) => patch({ initials })}
      />

      <TextField
        label="Greeting"
        layout="stacked"
        value={config.greeting}
        placeholder="What's on your mind today?"
        onValueChange={(greeting) => patch({ greeting })}
      />

      <TextareaField
        label="Transcript"
        rows={3}
        value={config.transcript}
        placeholder="Block out two hours tomorrow morning for deep work and mute notifications"
        onValueChange={(transcript) => patch({ transcript })}
      />
    </div>
  );
}
