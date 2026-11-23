"use client";

import { SelectField, Slider, TextField } from "@/components/controls";
import type { ComponentInspectorProps } from "@/registry/types";
import {
  DEFAULT_DISTORTION_WAVES_CONFIG,
  DISTORTION_WAVES_PALETTE_OPTIONS,
  DISTORTION_WAVES_THEME_OPTIONS,
  DISTORTION_WAVES_TYPE_OPTIONS,
  type DistortionWavesConfig,
  type DistortionWavesStudioTheme,
  getDistortionWavesDirectionDefaults,
} from "./config";
import type {
  DistortionWavePalette,
  DistortionWaveType,
} from "./distortion-waves";

export function DistortionWavesInspector({
  config,
  onChange,
}: ComponentInspectorProps<DistortionWavesConfig>) {
  const patch = (next: Partial<DistortionWavesConfig>) =>
    onChange({ ...config, ...next });
  const d = DEFAULT_DISTORTION_WAVES_CONFIG;

  return (
    <div className="flex flex-col gap-2 text-xs">
      <SelectField
        label="Direction"
        value={config.type}
        options={DISTORTION_WAVES_TYPE_OPTIONS}
        onValueChange={(next) =>
          patch(getDistortionWavesDirectionDefaults(next as DistortionWaveType))
        }
      />

      <SelectField
        label="Palette"
        value={config.palette}
        options={DISTORTION_WAVES_PALETTE_OPTIONS}
        onValueChange={(next) =>
          patch({ palette: next as DistortionWavePalette })
        }
      />

      <SelectField
        label="Theme"
        value={config.theme}
        options={DISTORTION_WAVES_THEME_OPTIONS}
        onValueChange={(next) =>
          patch({ theme: next as DistortionWavesStudioTheme })
        }
      />

      <Slider
        label="Travel"
        value={config.travel}
        min={0.6}
        max={4.5}
        step={0.05}
        unit="s"
        defaultValue={d.travel}
        onValueChange={(travel) => patch({ travel })}
      />

      <Slider
        label="Amplitude"
        value={config.amplitude}
        min={6}
        max={72}
        step={1}
        unit="px"
        defaultValue={d.amplitude}
        onValueChange={(amplitude) => patch({ amplitude })}
      />

      <Slider
        label="Lens Width"
        value={config.lensWidth}
        min={40}
        max={260}
        step={5}
        unit="px"
        defaultValue={d.lensWidth}
        onValueChange={(lensWidth) => patch({ lensWidth })}
      />

      <Slider
        label="Aberration"
        value={config.aberration}
        min={0}
        max={2}
        step={0.05}
        defaultValue={d.aberration}
        onValueChange={(aberration) => patch({ aberration })}
      />

      <Slider
        label="Blur"
        value={config.blur}
        min={0}
        max={40}
        step={1}
        unit="px"
        defaultValue={d.blur}
        onValueChange={(blur) => patch({ blur })}
      />

      <Slider
        label="Particles"
        value={config.particleCount}
        min={0}
        max={140}
        step={4}
        defaultValue={d.particleCount}
        onValueChange={(particleCount) => patch({ particleCount })}
      />

      <TextField
        label="Title"
        value={config.title}
        placeholder={d.title}
        onValueChange={(title) => patch({ title })}
      />

      <TextField
        label="Subtitle"
        value={config.subtitle}
        placeholder={d.subtitle}
        onValueChange={(subtitle) => patch({ subtitle })}
      />

      <TextField
        label="Amount"
        value={config.amount}
        placeholder={d.amount}
        onValueChange={(amount) => patch({ amount })}
      />

      <TextField
        label="Button"
        value={config.ctaLabel}
        placeholder={d.ctaLabel}
        onValueChange={(ctaLabel) => patch({ ctaLabel })}
      />
    </div>
  );
}
