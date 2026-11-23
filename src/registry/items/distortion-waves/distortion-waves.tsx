"use client";

/**
 * DistortionWave integration notes (Libraries.dev `distortion-waves`):
 * - Outer shell vs. inner views: Put `borderRadius`, `overflow: "hidden"`, outer
 *   border/hairline, and `boxShadow` on `<DistortionWave style={...} />`, NOT on
 *   `children` or `revealedContent`. Inner views must have opaque backgrounds and
 *   no outer perimeter border so only interior elements bend (not the card edge).
 * - Tailwind v4 preflight: `[data-distortion-wave]` keeps `border-style: none`
 *   in `src/index.css` to prevent 3px fallback borders in the SVG snapshot; set
 *   explicit inline `borderTop: "1px solid ..."` / `border: "1px solid ..."` only
 *   on inner boxes/dividers that intentionally draw hairlines.
 * - `source` & `overlay`: Pass the triggering control (`"vertical"`/`"horizontal"`)
 *   or top/center badge/token (`"center"`) as `source`, and place live controls
 *   that must stay sharp and unbent inside `overlay`.
 * - One-shot replay: Use `ref.current?.reset()` before setting `revealed={false}`
 *   if returning to the initial view without a reverse collapse animation.
 * - Assets: External images/fonts need CORS to appear in snapshots; iframes are skipped.
 */

export {
  backgroundOf,
  bezierEase,
  type CaptureFunction,
  type CaptureRequest,
  COVER_ZONE,
  DistortionWave,
  DistortionWave as DistortionWaves,
  DistortionWave as default,
  type DistortionWaveHandle,
  type DistortionWaveProps,
  type DistortionWaveProps as DistortionWavesProps,
  type DotBuffer,
  defaultStyle,
  duration,
  type FrameOptions,
  type Front,
  hexToRgb,
  LUMPS,
  makeParticles,
  newFront,
  PALETTES as DISTORTION_WAVE_PALETTES,
  type Palette,
  type PaletteLike,
  type PaletteName,
  type PaletteName as DistortionWavePalette,
  type PlayOptions,
  type Point,
  particleAt,
  type Rect,
  type RendererOptions,
  type RGB,
  rgbToHex,
  rimLumps,
  type ScreenSlot,
  type Snapshot,
  type SnapshotOptions,
  type SourceLike,
  type Spot,
  singlePalette,
  smooth,
  snapshot,
  WaveController,
  type WaveOptions,
  WaveRenderer,
  type WaveStyle,
  type WaveStyleInput,
  type WaveStyleInput as DistortionWaveStyleInput,
  type WaveType,
  type WaveType as DistortionWaveType,
  waveFront,
} from "distortion-waves";
