import { defaultStyle } from "distortion-waves";
import type { SelectFieldOption } from "@/components/controls";
import type { ComponentGenerators } from "@/registry/types";
import type {
  DistortionWavePalette,
  DistortionWaveType,
} from "./distortion-waves";

export type DistortionWavesTheme = "dark" | "light";
export type DistortionWavesStudioTheme = DistortionWavesTheme;

export interface DistortionWavesConfig {
  type: DistortionWaveType;
  palette: DistortionWavePalette;
  theme: DistortionWavesStudioTheme;
  travel: number;
  amplitude: number;
  lensWidth: number;
  aberration: number;
  blur: number;
  particleCount: number;
  title: string;
  subtitle: string;
  amount: string;
  ctaLabel: string;
}

export const DEFAULT_DISTORTION_WAVES_CONFIG: DistortionWavesConfig = {
  type: "vertical",
  palette: "colorful",
  theme: "light",
  travel: 2.28,
  amplitude: 34,
  lensWidth: 150,
  aberration: 0.78,
  blur: 18,
  particleCount: 64,
  title: "Maya Chen",
  subtitle: "Studio rent",
  amount: "$1,250.00",
  ctaLabel: "Confirm",
};

export function getDistortionWavesDirectionDefaults(
  nextType: DistortionWaveType,
): Partial<DistortionWavesConfig> {
  const tuned = defaultStyle(nextType);
  const basePhysics: Partial<DistortionWavesConfig> = {
    type: nextType,
    palette: nextType === "center" ? "green" : "colorful",
    travel: Number(tuned.travel.toFixed(2)),
    amplitude: Math.round(tuned.amplitude),
    lensWidth: Math.round(tuned.lensWidth),
    aberration: Number(tuned.aberration.toFixed(2)),
    blur: Math.round(tuned.blur),
    particleCount: Math.round(tuned.particleCount),
  };

  if (nextType === "center") {
    return {
      ...basePhysics,
      title: "Add credits",
      subtitle: "Current balance: $65.73",
      amount: "$85.73",
      ctaLabel: "Buy $20 tokens",
    };
  }

  return {
    ...basePhysics,
    title: "Maya Chen",
    subtitle: "Studio rent",
    amount: "$1,250.00",
    ctaLabel: "Confirm",
  };
}

export const DISTORTION_WAVES_TYPE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "vertical", label: "Vertical" },
  { value: "center", label: "Center Ring" },
  { value: "horizontal", label: "Horizontal" },
];

export const DISTORTION_WAVES_PALETTE_OPTIONS: readonly SelectFieldOption[] = [
  { value: "colorful", label: "Colorful" },
  { value: "green", label: "Green" },
  { value: "ocean", label: "Ocean" },
  { value: "sunset", label: "Sunset" },
  { value: "mono", label: "Mono" },
];

export const DISTORTION_WAVES_THEME_OPTIONS: readonly SelectFieldOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function normalizeDistortionWavesText(
  value: string,
  fallback: string,
): string {
  const trimmed = value.trim();
  return trimmed ? value : fallback;
}

export function buildDistortionWavesJsx(config: DistortionWavesConfig): string {
  const d = DEFAULT_DISTORTION_WAVES_CONFIG;
  const baseStyle = defaultStyle(config.type);
  const waveStyleEntries: string[] = [];

  if (config.travel !== Number(baseStyle.travel.toFixed(2))) {
    waveStyleEntries.push(`travel: ${config.travel}`);
  }
  if (config.amplitude !== Math.round(baseStyle.amplitude)) {
    waveStyleEntries.push(`amplitude: ${config.amplitude}`);
  }
  if (config.lensWidth !== Math.round(baseStyle.lensWidth)) {
    waveStyleEntries.push(`lensWidth: ${config.lensWidth}`);
  }
  if (config.aberration !== Number(baseStyle.aberration.toFixed(2))) {
    waveStyleEntries.push(`aberration: ${config.aberration}`);
  }
  if (config.blur !== Math.round(baseStyle.blur)) {
    waveStyleEntries.push(`blur: ${config.blur}`);
  }
  if (config.particleCount !== Math.round(baseStyle.particleCount)) {
    waveStyleEntries.push(`particleCount: ${config.particleCount}`);
  }

  if (config.type === "center") {
    const ctaLabel = normalizeDistortionWavesText(
      config.ctaLabel,
      "Buy $20 tokens",
    );
    const props: string[] = [
      `type="center"`,
      `revealed={bought}`,
      `source={token}`,
    ];
    if (config.palette !== "green") {
      props.push(`palette="${config.palette}"`);
    }
    if (waveStyleEntries.length > 0) {
      props.push(`waveStyle={{ ${waveStyleEntries.join(", ")} }}`);
    }
    props.push(`revealedContent={<Credits added />}`);
    props.push(
      `overlay={`,
      `  <button onClick={() => { if (bought) { wave.current?.reset(); setBought(false); } else { setBought(true); } }}>`,
      `    {bought ? "Done" : "${ctaLabel}"}`,
      `  </button>`,
      `}`,
    );
    props.push(
      `style={{ width: 380, height: 386, borderRadius: 38, overflow: "hidden" }}`,
    );

    return [
      `import { useRef, useState } from "react";`,
      `import { DistortionWave, type DistortionWaveHandle } from "@/components/ui/distortion-waves";`,
      ``,
      `function AddCredits() {`,
      `  const [bought, setBought] = useState(false);`,
      `  const wave = useRef<DistortionWaveHandle>(null);`,
      `  const token = useRef<HTMLDivElement>(null);`,
      ``,
      `  return (`,
      `    <DistortionWave`,
      `      ref={wave}`,
      ...props.map((line) => `      ${line}`),
      `    >`,
      `      <Credits tokenRef={token} />`,
      `    </DistortionWave>`,
      `  );`,
      `}`,
    ].join("\n");
  }

  const ctaLabel = normalizeDistortionWavesText(config.ctaLabel, d.ctaLabel);
  const props: string[] = [`revealed={sent}`];

  if (config.type !== d.type) {
    props.push(`type="${config.type}"`);
  }
  if (config.palette !== d.palette) {
    props.push(`palette="${config.palette}"`);
  }
  props.push(`source={button}`);
  if (waveStyleEntries.length > 0) {
    props.push(`waveStyle={{ ${waveStyleEntries.join(", ")} }}`);
  }
  props.push(`revealedContent={<Review sent />}`);
  props.push(
    `overlay={`,
    `  <button ref={button} onClick={() => { if (sent) { wave.current?.reset(); setSent(false); } else { setSent(true); } }}>`,
    `    {sent ? "Done" : "${ctaLabel}"}`,
    `  </button>`,
    `}`,
  );
  props.push(
    `style={{ width: 380, height: 475, borderRadius: 28, overflow: "hidden" }}`,
  );

  return [
    `import { useRef, useState } from "react";`,
    `import { DistortionWave, type DistortionWaveHandle } from "@/components/ui/distortion-waves";`,
    ``,
    `function Transfer() {`,
    `  const [sent, setSent] = useState(false);`,
    `  const wave = useRef<DistortionWaveHandle>(null);`,
    `  const button = useRef<HTMLButtonElement>(null);`,
    ``,
    `  return (`,
    `    <DistortionWave`,
    `      ref={wave}`,
    ...props.map((line) => `      ${line}`),
    `    >`,
    `      <Review />`,
    `    </DistortionWave>`,
    `  );`,
    `}`,
  ].join("\n");
}

export function buildDistortionWavesAiPrompt(
  config: DistortionWavesConfig,
  cliCommand = "pnpm dlx shadcn@latest add https://interact.dev/r/distortion-waves.json",
): string {
  return [
    "Implement the Distortion Waves component from interact.dev in React + TypeScript.",
    `Install via shadcn CLI: ${cliCommand}`,
    "Dependencies: react, distortion-waves",
    "",
    "Render it with this exact configuration:",
    "```tsx",
    buildDistortionWavesJsx(config),
    "```",
  ].join("\n");
}

export const distortionWavesGenerators: ComponentGenerators<DistortionWavesConfig> =
  {
    buildJsx: buildDistortionWavesJsx,
    buildAiPrompt: buildDistortionWavesAiPrompt,
  };
