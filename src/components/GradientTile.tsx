import React from "react";
import { BorderBeam } from "border-beam";
import {
  TileConfig,
  GlobalsConfig,
  BlobConfig,
  AnimationMode,
  Direction,
  RimOrigin,
  RimAnimationMode,
  BeamSize,
  BeamColorVariant,
} from "@/types/gradient";
import { DEFAULT_GLOBALS } from "@/constants/defaults";
import { getBlobShapeStyle } from "@/constants/shapes";
import { hexToRgba } from "@/utils/color";
import { cn } from "@/lib/utils";

const gradientAnimationStyles = `
  @keyframes gradient-blob-scale {
    from {
      opacity: 0;
      transform: translate(var(--scale-x, -50%), var(--scale-y, -50%)) rotate(var(--blob-rot, 0deg)) scale(var(--scale-start));
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(var(--blob-rot, 0deg)) scale(1);
    }
  }
  @keyframes gradient-blob-lift {
    from {
      opacity: 0;
      transform: translate(var(--lift-x), var(--lift-y)) rotate(var(--blob-rot, 0deg));
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(var(--blob-rot, 0deg));
    }
  }
  @keyframes gradient-blob-fade {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) rotate(var(--blob-rot, 0deg)) scale(var(--fade-scale-start, 0.92));
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(var(--blob-rot, 0deg)) scale(1);
    }
  }
  @keyframes gradient-blob-rotate {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) rotate(var(--rotate-start)) scale(var(--rotate-scale-start, 0.85));
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(var(--blob-rot, 0deg)) scale(1);
    }
  }
  @keyframes gradient-rim-bloom {
    0% {
      opacity: 0;
      filter: brightness(2.2) blur(4px);
    }
    50% {
      opacity: 1;
      filter: brightness(1.3) blur(1px);
    }
    100% {
      opacity: 1;
      filter: brightness(1) blur(0);
    }
  }
  /* Glint: baza de rim face un fade-in fluid până la 100% */
  .gradient-rim-glint {
    animation-name: gradient-rim-fade-in;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-fill-mode: both;
  }
  @keyframes gradient-rim-fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  /* Stratul de reflexie (sheen) care strălucește direcțional și se dizolvă lin la 0 */
  .gradient-rim-glint::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    animation-name: gradient-rim-sheen;
    animation-duration: inherit;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-fill-mode: both;
  }

  @keyframes gradient-rim-sheen {
    0% {
      opacity: 0;
      filter: brightness(2.2);
    }
    30% {
      opacity: 1;
      filter: brightness(1.7);
    }
    100% {
      opacity: 0;
      filter: brightness(1);
    }
  }

  .gradient-rim-glint-top::after {
    box-shadow: inset 0 3px 10px 2px rgba(255, 255, 255, 0.95), inset 0 0 16px 2px var(--glint-color, #ffffff);
    background: radial-gradient(ellipse 95% 45% at 50% 0%, rgba(255, 255, 255, 0.6) 0%, transparent 75%);
  }
  .gradient-rim-glint-bottom::after {
    box-shadow: inset 0 -3px 10px 2px rgba(255, 255, 255, 0.95), inset 0 0 16px 2px var(--glint-color, #ffffff);
    background: radial-gradient(ellipse 95% 45% at 50% 100%, rgba(255, 255, 255, 0.6) 0%, transparent 75%);
  }
  .gradient-rim-glint-left::after {
    box-shadow: inset 3px 0 10px 2px rgba(255, 255, 255, 0.95), inset 0 0 16px 2px var(--glint-color, #ffffff);
    background: radial-gradient(ellipse 45% 95% at 0% 50%, rgba(255, 255, 255, 0.6) 0%, transparent 75%);
  }
  .gradient-rim-glint-right::after {
    box-shadow: inset -3px 0 10px 2px rgba(255, 255, 255, 0.95), inset 0 0 16px 2px var(--glint-color, #ffffff);
    background: radial-gradient(ellipse 45% 95% at 100% 50%, rgba(255, 255, 255, 0.6) 0%, transparent 75%);
  }
  @keyframes gradient-rim-breathe {
    0%, 100% {
      opacity: 0.38;
      filter: brightness(0.85);
    }
    50% {
      opacity: 1;
      filter: brightness(1.28);
    }
  }
  @keyframes gradient-rim-scale-down {
    0% {
      opacity: 0;
      transform: scale(1.22);
      filter: blur(5px) brightness(1.8);
    }
    35% {
      opacity: 0.9;
    }
    100% {
      opacity: 1;
      transform: scale(1);
      filter: blur(0px) brightness(1);
    }
  }
  .gradient-blob-scale,
  .gradient-blob-lift,
  .gradient-blob-fade,
  .gradient-blob-rotate {
    animation-fill-mode: backwards;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }
  .gradient-blob-scale { animation-name: gradient-blob-scale; }
  .gradient-blob-lift { animation-name: gradient-blob-lift; }
  .gradient-blob-fade { animation-name: gradient-blob-fade; }
  .gradient-blob-rotate { animation-name: gradient-blob-rotate; }
  .gradient-rim {
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-fill-mode: both;
  }
  .gradient-rim-bloom { animation-name: gradient-rim-bloom; }
  .gradient-rim-scale-down { animation-name: gradient-rim-scale-down; }
  .gradient-rim-breathe {
    animation-name: gradient-rim-breathe;
    animation-timing-function: cubic-bezier(0.45, 0.05, 0.55, 0.95);
    animation-iteration-count: infinite;
    animation-fill-mode: none;
  }
  .gradient-rim-scale-down { animation-name: gradient-rim-scale-down; }
`;

export interface GradientTileProps {
  /** Configurație completă opțională de tip TileConfig */
  tile?: TileConfig;
  /** Opțiuni globale de randare și post-procesare */
  globals?: Partial<GlobalsConfig>;

  // Proprietăți directe opționale (pentru utilizare rapidă ca element standalone)
  base?: string;
  rim?: string;
  blobs?: BlobConfig[];

  // Dimensiuni & Formă
  size?: number | string;
  radius?: number; // în %

  // Filtre vizuale
  contrast?: number;
  saturate?: number;
  blurScale?: number;
  disableBlur?: boolean;

  // Rim (margine luminoasă)
  rimOpacity?: number;
  rimBlur?: number;
  rimSpread?: number;

  // BorderBeam (efect de contur luminos animat)
  beamActive?: boolean;
  beamSize?: BeamSize;
  beamColorVariant?: BeamColorVariant;
  beamStrength?: number;
  beamDuration?: number;

  // Animație
  animate?: boolean;
  animationMode?: AnimationMode;
  animationDirection?: Direction;
  animationSpeed?: number;
  animationScale?: number;
  rimAnimate?: boolean;
  rimAnimationMode?: RimAnimationMode;
  rimOrigin?: RimOrigin;
  rimAnimationSpeed?: number;

  // Textură Granulată / Film Grain (Noise)
  noise?: boolean;
  noiseOpacity?: number;
  noiseScale?: number;

  // Selecție & Interactivitate
  selected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  animationKey?: string | number;

  // Conținut & Stilizare
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const KEYFRAMES_STYLE_ID = "gradient-tile-keyframes";

function ensureGradientKeyframes() {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(KEYFRAMES_STYLE_ID);
  if (existing) {
    if (existing.textContent !== gradientAnimationStyles) {
      existing.textContent = gradientAnimationStyles;
    }
    return;
  }
  const styleEl = document.createElement("style");
  styleEl.id = KEYFRAMES_STYLE_ID;
  styleEl.textContent = gradientAnimationStyles;
  document.head.appendChild(styleEl);
}

export const getEchoVector = (dir?: Direction): { dx: number; dy: number } => {
  switch (dir) {
    case "left":
      return { dx: -1, dy: 0 };
    case "top":
      return { dx: 0, dy: -1 };
    case "bottom":
      return { dx: 0, dy: 1 };
    case "top-left":
      return { dx: -0.707, dy: -0.707 };
    case "top-right":
      return { dx: 0.707, dy: -0.707 };
    case "bottom-left":
      return { dx: -0.707, dy: 0.707 };
    case "bottom-right":
      return { dx: 0.707, dy: 0.707 };
    case "right":
    default:
      return { dx: 1, dy: 0 };
  }
};

export const GradientTile: React.FC<GradientTileProps> = React.memo(({
  tile,
  globals,
  base,
  rim,
  blobs,
  size,
  radius,
  contrast,
  saturate,
  blurScale,
  disableBlur = false,
  rimOpacity,
  rimBlur,
  rimSpread,
  beamActive,
  beamSize,
  beamColorVariant,
  beamStrength,
  beamDuration,
  animate,
  animationMode,
  animationDirection,
  animationSpeed,
  animationScale,
  rimAnimate,
  rimAnimationMode,
  rimOrigin,
  rimAnimationSpeed,
  noise: noiseProp,
  noiseOpacity: noiseOpacityProp,
  noiseScale: noiseScaleProp,
  selected = false,
  onClick,
  animationKey = 0,
  id,
  className = "",
  style,
  children,
}) => {
  // Îmbinăm valorile primite cu valorile implicite
  const g: GlobalsConfig = {
    ...DEFAULT_GLOBALS,
    ...globals,
    ...(size !== undefined && { size: typeof size === "number" ? size : DEFAULT_GLOBALS.size }),
    ...(radius !== undefined && { radius }),
    ...(contrast !== undefined && { contrast }),
    ...(saturate !== undefined && { saturate }),
    ...(blurScale !== undefined && { blurScale }),
    ...(rimOpacity !== undefined && { rimOpacity }),
    ...(rimBlur !== undefined && { rimBlur }),
    ...(rimSpread !== undefined && { rimSpread }),
    ...(beamActive !== undefined && { beamActive }),
    ...(beamSize !== undefined && { beamSize }),
    ...(beamColorVariant !== undefined && { beamColorVariant }),
    ...(beamStrength !== undefined && { beamStrength }),
    ...(beamDuration !== undefined && { beamDuration }),
    ...(animate !== undefined && { animate }),
    ...(animationMode !== undefined && { animationMode }),
    ...(animationDirection !== undefined && { animationDirection }),
    ...(animationSpeed !== undefined && { animationSpeed }),
    ...(animationScale !== undefined && { animationScale }),
    ...(rimAnimate !== undefined && { rimAnimate }),
    ...(rimAnimationMode !== undefined && { rimAnimationMode }),
    ...(rimOrigin !== undefined && { rimOrigin }),
    ...(rimAnimationSpeed !== undefined && { rimAnimationSpeed }),
    ...(noiseProp !== undefined && { noise: noiseProp }),
    ...(noiseOpacityProp !== undefined && { noiseOpacity: noiseOpacityProp }),
    ...(noiseScaleProp !== undefined && { noiseScale: noiseScaleProp }),
  };

  const currentTile: TileConfig = {
    base: base || tile?.base || "#09090b",
    rim: rim || tile?.rim || "#ffffff",
    blobs: blobs || tile?.blobs || [],
    contrast: contrast ?? tile?.contrast,
    saturate: saturate ?? tile?.saturate,
    blurScale: blurScale ?? tile?.blurScale,
    rimOpacity: rimOpacity ?? tile?.rimOpacity,
    rimBlur: rimBlur ?? tile?.rimBlur,
    rimSpread: rimSpread ?? tile?.rimSpread,
    animate: animate ?? tile?.animate,
    animationMode: animationMode || tile?.animationMode,
    animationDirection: animationDirection || tile?.animationDirection,
    animationSpeed: animationSpeed ?? tile?.animationSpeed,
    animationScale: animationScale ?? tile?.animationScale,
    rimAnimate: rimAnimate ?? tile?.rimAnimate,
    rimAnimationMode: rimAnimationMode || tile?.rimAnimationMode,
    rimOrigin: rimOrigin || tile?.rimOrigin,
    rimAnimationSpeed: rimAnimationSpeed ?? tile?.rimAnimationSpeed,
    beamActive: beamActive ?? tile?.beamActive,
    beamSize: beamSize || tile?.beamSize,
    beamColorVariant: beamColorVariant || tile?.beamColorVariant,
    beamStrength: beamStrength ?? tile?.beamStrength,
    beamDuration: beamDuration ?? tile?.beamDuration,
    noise: noiseProp ?? tile?.noise,
    noiseOpacity: noiseOpacityProp ?? tile?.noiseOpacity,
    noiseScale: noiseScaleProp ?? tile?.noiseScale,
  };

  const tileFilters = {
    contrast: currentTile.contrast ?? g.contrast,
    saturate: currentTile.saturate ?? g.saturate,
    blurScale: currentTile.blurScale ?? g.blurScale,
    rimOpacity: currentTile.rimOpacity ?? g.rimOpacity,
    rimBlur: currentTile.rimBlur ?? g.rimBlur,
    rimSpread: currentTile.rimSpread ?? g.rimSpread,
  };

  const tileMotion = {
    animate: currentTile.animate === undefined ? g.animate : currentTile.animate,
    mode: currentTile.animationMode || g.animationMode,
    direction: currentTile.animationDirection || g.animationDirection,
    speed: currentTile.animationSpeed || g.animationSpeed,
    scale: currentTile.animationScale ?? g.animationScale,
    rimAnimate: currentTile.rimAnimate === undefined ? g.rimAnimate : currentTile.rimAnimate,
    rimMode: currentTile.rimAnimationMode || g.rimAnimationMode || "bloom",
    rimOrigin: currentTile.rimOrigin || g.rimOrigin || "top",
    rimSpeed: currentTile.rimAnimationSpeed || g.rimAnimationSpeed || 1,
  };

  const containerWidth = size !== undefined ? size : g.size;
  const containerHeight = size !== undefined ? size : g.size;
  const rimShadow = `inset 0 0 ${tileFilters.rimBlur}px ${tileFilters.rimSpread}px ${hexToRgba(
    currentTile.rim,
    tileFilters.rimOpacity
  )}, inset 0 0 2px 1px rgba(255,255,255,${+(0.35 * tileFilters.rimOpacity).toFixed(3)})`;

  const isBeamActive = currentTile.beamActive !== undefined ? currentTile.beamActive : g.beamActive;
  const beamSizeProp = currentTile.beamSize || g.beamSize || "md";
  const beamColorProp = currentTile.beamColorVariant || g.beamColorVariant || "colorful";
  const beamStrengthProp = currentTile.beamStrength ?? g.beamStrength ?? 0.85;
  const beamDurationProp = currentTile.beamDuration ?? g.beamDuration ?? 2;

  const isNoise = currentTile.noise !== undefined ? currentTile.noise : g.noise;
  const noiseOpacity = currentTile.noiseOpacity ?? g.noiseOpacity ?? 0.2;
  const noiseScale = currentTile.noiseScale ?? g.noiseScale ?? 1;

  const tileSizeNumber = typeof containerWidth === "number" ? containerWidth : 150;
  const computedPixelRadius = Math.round((tileSizeNumber * (g.radius ?? 30)) / 100);

  React.useInsertionEffect(() => {
    ensureGradientKeyframes();
  }, []);

  const tileElement = (
    <div
      id={id}
      data-selected={selected || undefined}
      className={cn("gradient-tile-wrapper relative select-none overflow-hidden", className)}
      style={{
        width: containerWidth,
        height: containerHeight,
        borderRadius: `${g.radius}%`,
        clipPath: `inset(0 round ${g.radius}%)`,
        WebkitClipPath: `inset(0 round ${g.radius}%)`,
        transform: "translateZ(0)",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
      onClick={onClick}
    >
      {/* Strat de bază și izolare */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          clipPath: "inherit",
          WebkitClipPath: "inherit",
          overflow: "hidden",
          background: currentTile.base,
          isolation: "isolate",
          transform: "translateZ(0)",
        }}
      >
        {/* Strat Randare: Blob-uri SVG / CSS */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: `contrast(${tileFilters.contrast}) saturate(${tileFilters.saturate})`,
          }}
        >
          {currentTile.blobs.map((b, i) => {
            const blobMotion = {
              animate: b.animate === undefined ? tileMotion.animate : b.animate,
              mode: b.animationMode || tileMotion.mode,
              direction: b.animationDirection || tileMotion.direction,
              speed: b.animationSpeed || tileMotion.speed,
              scale: b.animationScale ?? tileMotion.scale,
            };
            // Cursa de ridicare proporțională cu slider-ul de amplitudine (scale)
            // La scale = 0 -> 0px (fără salt brusc, pur fade)
            // La scale = 0.08 -> ~20px (efect fluid elegant)
            // La scale = 0.25 -> 60px (efect accentuat)
            const liftDistance = Math.round(blobMotion.scale * 240);

            // Vectori corectați:
            // "top" (↑) pornește de jos (+distance) și urcă la poziție (-50%)
            // "bottom" (↓) pornește de sus (-distance) și coboară la poziție (-50%)
            // "left" (←) pornește din dreapta (+distance) și merge la poziție (-50%)
            // "right" (→) pornește din stânga (-distance) și merge la poziție (-50%)
            const liftX = ["left", "top-left", "bottom-left"].includes(blobMotion.direction)
              ? `calc(-50% + ${liftDistance}px)`
              : ["right", "top-right", "bottom-right"].includes(blobMotion.direction)
              ? `calc(-50% - ${liftDistance}px)`
              : "-50%";

            const liftY = ["top", "top-left", "top-right"].includes(blobMotion.direction)
              ? `calc(-50% + ${liftDistance}px)`
              : ["bottom", "bottom-left", "bottom-right"].includes(blobMotion.direction)
              ? `calc(-50% - ${liftDistance}px)`
              : "-50%";

            // Suport direcțional pentru scale (directional pop-in):
            // La o direcție setată, se aplică o translație subtilă în sensul indicat
            const scaleDistance = Math.round(blobMotion.scale * 80);
            const scaleX = ["left", "top-left", "bottom-left"].includes(blobMotion.direction)
              ? `calc(-50% + ${scaleDistance}px)`
              : ["right", "top-right", "bottom-right"].includes(blobMotion.direction)
              ? `calc(-50% - ${scaleDistance}px)`
              : "-50%";

            const scaleY = ["top", "top-left", "top-right"].includes(blobMotion.direction)
              ? `calc(-50% + ${scaleDistance}px)`
              : ["bottom", "bottom-left", "bottom-right"].includes(blobMotion.direction)
              ? `calc(-50% - ${scaleDistance}px)`
              : "-50%";

            // Calcul liniar continuu pentru amplitudine
            const scaleStart = Math.max(0.05, +(1 - blobMotion.scale * 4.5).toFixed(3));
            const fadeScaleStart = Math.max(0.7, +(1 - blobMotion.scale * 1.5).toFixed(3));
            const rotateScaleStart = Math.max(0.3, +(1 - blobMotion.scale * 2.5).toFixed(3));
            const rotateStart = `${b.rot - 15 - blobMotion.scale * 200}deg`;

            const shapeStyle = getBlobShapeStyle(b);
            const baseScale = b.scale ?? 1;

            // Suport Ecou & Undă de Șoc (Echo Trail)
            const echoCount = Math.min(8, Math.max(0, b.echoCount || 0));
            const echoSteps: number[] = [];
            if (echoCount > 0) {
              if (b.echoOrder === "back-to-front") {
                for (let k = 0; k <= echoCount; k++) echoSteps.push(k);
              } else {
                // Front-to-back: pașii cei mai depărtați se randează primii în fundal
                for (let k = echoCount; k >= 0; k--) echoSteps.push(k);
              }
            } else {
              echoSteps.push(0);
            }

            const vec = getEchoVector(b.echoDirection || "right");

            return echoSteps.map((stepK) => {
              const offsetDist = stepK * (b.echoOffset ?? 12);
              const stepX = +(b.x + vec.dx * offsetDist).toFixed(1);
              const stepY = +(b.y + vec.dy * offsetDist).toFixed(1);
              const scaleMult = Math.pow(b.echoScaleStep ?? 1.15, stepK);
              const effectiveScale = baseScale * scaleMult;
              const effectiveW = +(b.w * effectiveScale).toFixed(1);
              const effectiveH = +(b.h * effectiveScale).toFixed(1);
              const stepOpacity = +(Math.pow(b.echoFade ?? 0.75, stepK)).toFixed(3);
              const stepBlur = +(b.blur * (1 + stepK * 0.05)).toFixed(1);

              const elementKey = `${i}-step-${stepK}-${animationKey}`;

              if (shapeStyle.svgPath) {
                return (
                  <svg
                    key={elementKey}
                    viewBox="0 0 256 256"
                    className={blobMotion.animate ? `gradient-blob-${blobMotion.mode}` : ""}
                    style={
                      {
                        position: "absolute",
                        left: `${stepX}%`,
                        top: `${stepY}%`,
                        width: `${effectiveW}%`,
                        height: `${effectiveH}%`,
                        overflow: "visible",
                        opacity: stepOpacity,
                        mixBlendMode: b.blendMode || "normal",
                        filter: disableBlur
                          ? "drop-shadow(0 0 1px rgba(255,255,255,0.7)) drop-shadow(0 0 1px rgba(0,0,0,0.5))"
                          : `blur(${stepBlur * tileFilters.blurScale}px)`,
                        transform: `translate(-50%, -50%) rotate(${b.rot}deg)`,
                        "--blob-rot": `${b.rot}deg`,
                        "--lift-x": liftX,
                        "--lift-y": liftY,
                        "--scale-x": scaleX,
                        "--scale-y": scaleY,
                        "--scale-start": `${scaleStart}`,
                        "--fade-scale-start": `${fadeScaleStart}`,
                        "--rotate-scale-start": `${rotateScaleStart}`,
                        "--rotate-start": rotateStart,
                        animationDelay: `${((i + stepK * 0.2) * 0.14) / blobMotion.speed}s`,
                        animationDuration: `${(0.9 + i * 0.12) / blobMotion.speed}s`,
                      } as React.CSSProperties
                    }
                  >
                    <path
                      d={shapeStyle.svgPath}
                      fill={b.color}
                      stroke={disableBlur ? "rgba(255, 255, 255, 0.6)" : undefined}
                      strokeWidth={disableBlur ? 3 : undefined}
                    />
                  </svg>
                );
              }

              return (
                <div
                  key={elementKey}
                  className={blobMotion.animate ? `gradient-blob-${blobMotion.mode}` : ""}
                  style={
                    {
                      position: "absolute",
                      left: `${stepX}%`,
                      top: `${stepY}%`,
                      width: `${effectiveW}%`,
                      height: `${effectiveH}%`,
                      background: b.color,
                      borderRadius: shapeStyle.borderRadius,
                      clipPath: shapeStyle.clipPath,
                      opacity: stepOpacity,
                      mixBlendMode: b.blendMode || "normal",
                      filter: disableBlur
                        ? shapeStyle.clipPath
                          ? "drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #000)"
                          : "none"
                        : `blur(${stepBlur * tileFilters.blurScale}px)`,
                      border: disableBlur && !shapeStyle.clipPath ? "1.5px solid rgba(255, 255, 255, 0.45)" : undefined,
                      boxShadow: disableBlur && !shapeStyle.clipPath ? "0 0 0 1px rgba(0, 0, 0, 0.3)" : undefined,
                      transform: `translate(-50%, -50%) rotate(${b.rot}deg)`,
                      "--blob-rot": `${b.rot}deg`,
                      "--lift-x": liftX,
                      "--lift-y": liftY,
                      "--scale-x": scaleX,
                      "--scale-y": scaleY,
                      "--scale-start": `${scaleStart}`,
                      "--fade-scale-start": `${fadeScaleStart}`,
                      "--rotate-scale-start": `${rotateScaleStart}`,
                      "--rotate-start": rotateStart,
                      animationDelay: `${((i + stepK * 0.2) * 0.14) / blobMotion.speed}s`,
                      animationDuration: `${(0.9 + i * 0.12) / blobMotion.speed}s`,
                    } as React.CSSProperties
                  }
                />
              );
            });
          })}
        </div>

        {/* Strat Textură Granulată / Film Grain (Noise Overlay) */}
        {isNoise && (
          <svg
            className="pointer-events-none absolute inset-0 z-20 size-full"
            style={{
              borderRadius: "inherit",
              mixBlendMode: "overlay",
              opacity: noiseOpacity,
            }}
          >
            <filter id={`noise-filter-${id || "tile"}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency={`${(0.65 / noiseScale).toFixed(3)}`}
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#noise-filter-${id || "tile"})`} />
          </svg>
        )}

        {/* Strat Rim luminozitate (static sau animat) */}
        {tileFilters.rimOpacity > 0 && (
          <div
            key={
              tileMotion.rimAnimate
                ? `rim-${tileMotion.rimMode}-${tileMotion.rimOrigin}-${animationKey}`
                : "rim-static"
            }
            className={
              !tileMotion.rimAnimate
                ? undefined
                : tileMotion.rimMode === "glint"
                ? `gradient-rim gradient-rim-glint gradient-rim-glint-${tileMotion.rimOrigin}`
                : `gradient-rim gradient-rim-${tileMotion.rimMode}`
            }
            style={
              {
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                pointerEvents: "none",
                boxShadow: rimShadow,
                "--glint-color": currentTile.rim,
                animationDuration: tileMotion.rimAnimate
                  ? `${(tileMotion.rimMode === "breathe" ? 3.2 : 1.1) / tileMotion.rimSpeed}s`
                  : undefined,
              } as React.CSSProperties
            }
          />
        )}
      </div>

      {/* Strat opțional de conținut pentru carduri interactive (children) */}
      {children && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            height: "100%",
            borderRadius: "inherit",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );

  if (!isBeamActive) {
    return tileElement;
  }

  return (
    <BorderBeam
      size={beamSizeProp}
      colorVariant={beamColorProp}
      strength={beamStrengthProp}
      duration={beamDurationProp}
      active={Boolean(isBeamActive)}
      borderRadius={computedPixelRadius}
      className={cn("block", className)}
      style={{
        width: containerWidth,
        height: containerHeight,
        borderRadius: `${g.radius}%`,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
      onClick={onClick}
    >
      {tileElement}
    </BorderBeam>
  );
});

GradientTile.displayName = "GradientTile";

export default GradientTile;
