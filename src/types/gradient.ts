export type AnimationMode = "scale" | "lift" | "fade" | "rotate";

export type Direction =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type RimOrigin = "top" | "right" | "bottom" | "left";
export type RimAnimationMode = "bloom" | "glint" | "breathe" | "scale-down";

export type BeamSize = "md" | "sm" | "line" | "pulse-outside" | "pulse-inner";
export type BeamColorVariant =
  | "colorful"
  | "mono"
  | "ocean"
  | "sunset"
  | "forest"
  | "candy"
  | "ice"
  | "gold";

export type BlobShape = string;

export type BlobBlendMode =
  | "normal"
  | "plus-lighter"
  | "screen"
  | "overlay"
  | "color-dodge"
  | "soft-light";

export interface BlobConfig {
  id?: string;
  name?: string;
  w: number;
  h: number;
  x: number;
  y: number;
  color: string;
  blur: number;
  rot: number;
  pill?: boolean;
  shape?: BlobShape;
  scale?: number;
  blendMode?: BlobBlendMode;
  animate?: boolean;
  animationMode?: AnimationMode;
  animationDirection?: Direction;
  animationSpeed?: number;
  animationScale?: number;
  // Ecou & Undă de Șoc (Stroboscopic / Wave Trail)
  echoCount?: number; // 0 = off, 1-8 pași de ecou
  echoOffset?: number; // distanță per pas în % (ex: 8..35%)
  echoDirection?: Direction; // direcția de propagare (default "right")
  echoScaleStep?: number; // scalare progresivă per pas (ex: 1.05..1.4)
  echoFade?: number; // atenuare opacitate per pas (ex: 0.6..0.95)
  echoOrder?: "front-to-back" | "back-to-front"; // ordinea straturilor de ecou
}

export interface TileConfig {
  name?: string;
  base: string;
  rim: string;
  blobs: BlobConfig[];
  contrast?: number;
  saturate?: number;
  blurScale?: number;
  rimOpacity?: number;
  rimBlur?: number;
  rimSpread?: number;
  animate?: boolean;
  animationMode?: AnimationMode;
  animationDirection?: Direction;
  animationSpeed?: number;
  animationScale?: number;
  rimAnimate?: boolean;
  rimAnimationMode?: RimAnimationMode;
  rimOrigin?: RimOrigin;
  rimAnimationSpeed?: number;
  beamActive?: boolean;
  beamSize?: BeamSize;
  beamColorVariant?: BeamColorVariant;
  beamStrength?: number;
  beamDuration?: number;
  // Textură Granulată / Film Grain (Noise)
  noise?: boolean;
  noiseOpacity?: number; // 0..1 (default 0.2)
  noiseScale?: number; // 0.5..3 (default 1)
}

export interface GlobalsConfig {
  size: number;
  gap: number;
  radius: number; // % din latură (squircle approx)
  contrast: number;
  saturate: number;
  blurScale: number;
  rimOpacity: number;
  rimBlur: number;
  rimSpread: number;
  columns: number;
  autoColumns?: boolean;
  animate: boolean;
  animationMode: AnimationMode;
  animationDirection: Direction;
  animationSpeed: number;
  animationScale: number;
  rimAnimate: boolean;
  rimAnimationMode: RimAnimationMode;
  rimOrigin: RimOrigin;
  rimAnimationSpeed: number;
  beamActive: boolean;
  beamSize: BeamSize;
  beamColorVariant: BeamColorVariant;
  beamStrength: number;
  beamDuration: number;
  // Textură Granulată Global
  noise: boolean;
  noiseOpacity: number;
  noiseScale: number;
}

export type GlobalPresetKey = "soft" | "vivid" | "crisp";

export interface GlobalPreset {
  contrast: number;
  saturate: number;
  blurScale: number;
  rimOpacity: number;
  rimBlur: number;
  rimSpread: number;
}

export interface GradientStudioConfig {
  globals: GlobalsConfig;
  tiles: TileConfig[];
}
