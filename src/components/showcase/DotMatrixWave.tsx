import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  fadeOutAt?: number;
}

type RgbTuple = readonly [number, number, number];
type ColorPair = readonly [RgbTuple, RgbTuple];

// True complementary color-wheel pairs (~170-180° apart: cool <-> warm contrast per dot)
const LED_PAIRS_DARK: readonly ColorPair[] = [
  [
    [34, 211, 238], // cyan #22D3EE (188°)
    [255, 122, 107], // coral #FF7A6B (6°)
  ],
  [
    [139, 92, 246], // violet #8B5CF6 (258°)
    [251, 191, 36], // amber #FBBF24 (43°)
  ],
  [
    [52, 211, 153], // emerald #34D399 (158°)
    [244, 114, 182], // pink #F472B6 (330°)
  ],
];

// Deeper saturation for crisp contrast on light backgrounds
const LED_PAIRS_LIGHT: readonly ColorPair[] = [
  [
    [8, 145, 178], // cyan #0891B2
    [232, 80, 63], // coral #E8503F
  ],
  [
    [124, 58, 237], // violet #7C3AED
    [217, 119, 6], // amber #D97706
  ],
  [
    [5, 150, 105], // emerald #059669
    [219, 39, 119], // pink #DB2777
  ],
];

const HALO_SPRITE_SIZE = 80;
const CORE_SPRITE_SIZE = 32;

interface LedSprites {
  halos: HTMLCanvasElement[];
  cores: HTMLCanvasElement[];
}

function buildLedSprites(pairs: readonly ColorPair[], isDark: boolean): LedSprites {
  const halos: HTMLCanvasElement[] = [];
  const cores: HTMLCanvasElement[] = [];

  for (const [c1, c2] of pairs) {
    // 1. 2-lobe halo sprite with slight diagonal chromatic separation
    const halo = document.createElement("canvas");
    halo.width = HALO_SPRITE_SIZE;
    halo.height = HALO_SPRITE_SIZE;
    const hctx = halo.getContext("2d");
    if (hctx) {
      const half = HALO_SPRITE_SIZE * 0.5;
      const lobeRadius = half * 0.82;
      const offset = half * 0.11;
      const lobes: readonly [RgbTuple, number, number, number][] = [
        [c1, half - offset, half - offset, isDark ? 0.5 : 0.3],
        [c2, half + offset, half + offset, isDark ? 0.5 : 0.3],
      ];
      for (const [[r, g, b], lx, ly, peakAlpha] of lobes) {
        const grad = hctx.createRadialGradient(lx, ly, 0, lx, ly, lobeRadius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${peakAlpha})`);
        grad.addColorStop(0.42, `rgba(${r}, ${g}, ${b}, ${(peakAlpha * 0.34).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        hctx.fillStyle = grad;
        hctx.fillRect(0, 0, HALO_SPRITE_SIZE, HALO_SPRITE_SIZE);
      }
      if (isDark) {
        const hot = hctx.createRadialGradient(half, half, 0, half, half, half * 0.3);
        hot.addColorStop(0, "rgba(255, 255, 255, 0.52)");
        hot.addColorStop(1, "rgba(255, 255, 255, 0)");
        hctx.fillStyle = hot;
        hctx.fillRect(0, 0, HALO_SPRITE_SIZE, HALO_SPRITE_SIZE);
      }
    }
    halos.push(halo);

    // 2. Crisp circular LED core with a simple 2-stop diagonal gradient
    const core = document.createElement("canvas");
    core.width = CORE_SPRITE_SIZE;
    core.height = CORE_SPRITE_SIZE;
    const cctx = core.getContext("2d");
    if (cctx) {
      const grad = cctx.createLinearGradient(0, 0, CORE_SPRITE_SIZE, CORE_SPRITE_SIZE);
      grad.addColorStop(0, `rgb(${c1[0]}, ${c1[1]}, ${c1[2]})`);
      grad.addColorStop(1, `rgb(${c2[0]}, ${c2[1]}, ${c2[2]})`);
      cctx.fillStyle = grad;
      cctx.beginPath();
      cctx.arc(
        CORE_SPRITE_SIZE * 0.5,
        CORE_SPRITE_SIZE * 0.5,
        CORE_SPRITE_SIZE * 0.46,
        0,
        Math.PI * 2
      );
      cctx.fill();
    }
    cores.push(core);
  }

  return { halos, cores };
}

function drawPairStarFlare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  armLength: number,
  [c1, c2]: ColorPair,
  strength: number,
  isDark: boolean
) {
  const thickness = Math.max(0.5, armLength * 0.1);
  const edgeAlpha = (isDark ? 0.78 : 0.52) * strength;
  const midR = Math.round((c1[0] + c2[0]) * 0.5);
  const midG = Math.round((c1[1] + c2[1]) * 0.5);
  const midB = Math.round((c1[2] + c2[2]) * 0.5);
  const centerColor = isDark
    ? `rgba(255, 255, 255, ${(0.88 * strength).toFixed(3)})`
    : `rgba(${midR}, ${midG}, ${midB}, ${(0.72 * strength).toFixed(3)})`;

  ctx.save();

  // Horizontal flare spike: c1 -> center -> c2
  const hGrad = ctx.createLinearGradient(x - armLength, y, x + armLength, y);
  hGrad.addColorStop(0, `rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, 0)`);
  hGrad.addColorStop(0.28, `rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, ${edgeAlpha.toFixed(3)})`);
  hGrad.addColorStop(0.5, centerColor);
  hGrad.addColorStop(0.72, `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, ${edgeAlpha.toFixed(3)})`);
  hGrad.addColorStop(1, `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, 0)`);
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  ctx.moveTo(x - armLength, y);
  ctx.quadraticCurveTo(x, y - thickness, x + armLength, y);
  ctx.quadraticCurveTo(x, y + thickness, x - armLength, y);
  ctx.fill();

  // Vertical flare spike: c2 -> center -> c1
  const vGrad = ctx.createLinearGradient(x, y - armLength, x, y + armLength);
  vGrad.addColorStop(0, `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, 0)`);
  vGrad.addColorStop(0.28, `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, ${edgeAlpha.toFixed(3)})`);
  vGrad.addColorStop(0.5, centerColor);
  vGrad.addColorStop(0.72, `rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, ${edgeAlpha.toFixed(3)})`);
  vGrad.addColorStop(1, `rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, 0)`);
  ctx.fillStyle = vGrad;
  ctx.beginPath();
  ctx.moveTo(x, y - armLength);
  ctx.quadraticCurveTo(x + thickness, y, x, y + armLength);
  ctx.quadraticCurveTo(x - thickness, y, x, y - armLength);
  ctx.fill();

  ctx.restore();
}

export interface DotMatrixWaveProps {
  className?: string;
  /** Spacing between grid dots in CSS pixels (default: 22) */
  spacing?: number;
  /** Visual style of the dot matrix (default: "monochrome") */
  variant?: "monochrome" | "led";
}

/**
 * Subtle interactive dot-matrix wave background for the semi-hero section.
 * Responds softly to pointer proximity (hover) and concentric click ripples.
 */
export const DotMatrixWave: React.FC<DotMatrixWaveProps> = ({
  className,
  spacing = 22,
  variant = "monochrome",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isLed = variant === "led";
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let isInView = true;
    let isDark = document.documentElement.classList.contains("dark");
    let sprites: LedSprites = isLed
      ? buildLedSprites(isDark ? LED_PAIRS_DARK : LED_PAIRS_LIGHT, isDark)
      : { halos: [], cores: [] };

    // Smoothed pointer state
    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
      strength: 0,
    };

    const ripples: Ripple[] = [];

    const scheduleFrame = () => {
      if (reducedMotion || !isInView || document.hidden || rafId !== 0) return;
      rafId = requestAnimationFrame(draw);
    };

    const stopLoop = () => {
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(parent);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible !== isInView) {
          isInView = visible;
          if (isInView) {
            scheduleFrame();
          } else {
            stopLoop();
          }
        }
      },
      { threshold: 0.01 }
    );
    io.observe(parent);

    // Watch theme changes (dark/light)
    const mo = new MutationObserver(() => {
      const nextDark = document.documentElement.classList.contains("dark");
      if (nextDark !== isDark) {
        isDark = nextDark;
        if (isLed) {
          sprites = buildLedSprites(
            isDark ? LED_PAIRS_DARK : LED_PAIRS_LIGHT,
            isDark
          );
        }
        if (reducedMotion) {
          draw(performance.now());
        }
      }
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = parent.getBoundingClientRect();
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      if (!pointer.active) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      }
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (reducedMotion) return;
      const now = performance.now();
      ripples.push({
        x: e.clientX - parent.getBoundingClientRect().left,
        y: e.clientY - parent.getBoundingClientRect().top,
        startTime: now,
      });
      // Softly fade out the oldest active ripple when exceeding 6 so there is no abrupt visual jump
      let activeCount = 0;
      for (let i = 0; i < ripples.length; i++) {
        if (ripples[i].fadeOutAt === undefined) activeCount++;
      }
      if (activeCount > 6) {
        const oldest = ripples.find((r) => r.fadeOutAt === undefined);
        if (oldest) oldest.fadeOutAt = now;
      }
    };

    const handleMotionChange = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        stopLoop();
        draw(performance.now());
      } else {
        scheduleFrame();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        scheduleFrame();
      }
    };

    parent.addEventListener("pointermove", handlePointerMove, { passive: true });
    parent.addEventListener("pointerleave", handlePointerLeave);
    parent.addEventListener("click", handleClick);
    motionQuery.addEventListener("change", handleMotionChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const draw = (now: number) => {
      rafId = 0;
      const t = now * 0.001;

      // Smooth pointer tracking & presence fade
      pointer.x += (pointer.targetX - pointer.x) * 0.16;
      pointer.y += (pointer.targetY - pointer.y) * 0.16;
      const targetStrength = pointer.active ? 1 : 0;
      pointer.strength += (targetStrength - pointer.strength) * 0.09;

      // Prune expired or faded-out ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        if (
          now - rip.startTime > 1300 ||
          (rip.fadeOutAt !== undefined && now - rip.fadeOutAt >= 180)
        ) {
          ripples.splice(i, 1);
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);
      const offsetX = (width - (cols - 1) * spacing) * 0.5;
      const offsetY = (height - (rows - 1) * spacing) * 0.5;

      const baseRgb = isDark ? "255, 255, 255" : "24, 24, 27";
      const baseOpacity = 0.16;
      const hoverRadius = isLed ? 105 : 125;
      const pairs = isDark ? LED_PAIRS_DARK : LED_PAIRS_LIGHT;

      const activeLeds: {
        x: number;
        y: number;
        radius: number;
        intensity: number;
        flareBoost: number;
        pairIdx: number;
      }[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = offsetX + c * spacing;
          const baseY = offsetY + r * spacing;

          // 1. Subtle ambient wave
          const wave = reducedMotion
            ? 0
            : Math.sin(c * 0.28 + r * 0.22 - t * 1.15) * 0.5 +
              Math.cos(c * 0.14 - r * 0.25 + t * 0.75) * 0.5;

          let radius = 1.1 + wave * 0.24;
          let alpha = baseOpacity + wave * 0.042;
          let dx = 0;
          let dy = 0;
          let hoverEnergy = 0;
          let rippleEnergy = 0;

          // 2. Soft hover proximity glow & micro-displacement
          if (pointer.strength > 0.01) {
            const vx = baseX - pointer.x;
            const vy = baseY - pointer.y;
            const dist = Math.hypot(vx, vy);
            if (dist < hoverRadius && dist > 0.001) {
              const falloff = Math.pow(1 - dist / hoverRadius, 2) * pointer.strength;
              radius += falloff * 1.05;
              alpha += falloff * (isDark ? 0.26 : 0.22);
              hoverEnergy = falloff;
              const push = falloff * 2.2;
              dx += (vx / dist) * push;
              dy += (vy / dist) * push;
            }
          }

          // 3. Concentric click ripple wave
          for (let i = 0; i < ripples.length; i++) {
            const rip = ripples[i];
            const age = (now - rip.startTime) / 1000;
            const ripRadius = age * 260;
            const vx = baseX - rip.x;
            const vy = baseY - rip.y;
            const dist = Math.hypot(vx, vy);
            const band = Math.abs(dist - ripRadius);
            const bandWidth = 56;
            if (band < bandWidth && dist > 0.001) {
              const evictFade =
                rip.fadeOutAt !== undefined
                  ? Math.max(0, 1 - (now - rip.fadeOutAt) / 180)
                  : 1;
              const life = Math.max(0, 1 - age / 1.25) * evictFade;
              const ringProfile = Math.cos((band / bandWidth) * (Math.PI * 0.5));
              const pulse = ringProfile * ringProfile * life;
              radius += pulse * 1.25;
              alpha += pulse * (isDark ? 0.34 : 0.28);
              rippleEnergy = Math.max(rippleEnergy, pulse);
              const push = pulse * 3.0;
              dx += (vx / dist) * push;
              dy += (vy / dist) * push;
            }
          }

          const dotX = baseX + dx;
          const dotY = baseY + dy;

          if (isLed) {
            // Centered curved diagonal bands blooming in place with ~1-2 dot micro-drift
            const cc = c - (cols - 1) * 0.5;
            const rr = r - (rows - 1) * 0.5;
            const nx = (baseX - width * 0.5) / Math.max(1, width * 0.32);
            const ny = (baseY - height * 0.5) / Math.max(1, height * 0.34);
            const centerMask = Math.exp(-(nx * nx + ny * ny) * 1.35);

            const cycle = reducedMotion ? 1.1 : t * 0.85;
            const breathA = Math.pow(Math.max(0, Math.sin(cycle)), 1.6);
            const breathB = Math.pow(Math.max(0, Math.sin(cycle + Math.PI * 0.88)), 1.6);

            const bendA = Math.sin(rr * 0.2 + 0.4) * 1.35 + Math.cos(cc * 0.12) * 0.65;
            const driftA = Math.sin(cycle * 0.5) * 0.65;
            const stripeA = Math.max(0, Math.cos(cc * 0.22 + rr * 0.28 + bendA - 0.55 - driftA));
            const patchA = Math.pow(stripeA, 2.4) * breathA;

            const bendB = Math.cos(rr * 0.18 - 0.3) * 1.35 - Math.sin(cc * 0.11) * 0.65;
            const driftB = Math.cos(cycle * 0.5) * 0.65;
            const stripeB = Math.max(0, Math.cos(cc * 0.22 + rr * 0.28 + bendB + 0.85 - driftB));
            const patchB = Math.pow(stripeB, 2.4) * breathB;

            const ambientMax = isDark ? 0.54 : 0.42;
            const ambientLed = Math.min(ambientMax, Math.max(patchA, patchB) * centerMask * 0.56);

            const interactiveEnergy = Math.max(hoverEnergy, rippleEnergy * 1.05);
            const ledIntensity = Math.min(1, Math.max(ambientLed, interactiveEnergy));

            if (ledIntensity > 0.08) {
              // Dedicated 2-color pair per wave (patchA -> 0, patchB -> 1, interaction -> 2)
              const pairIdx =
                interactiveEnergy >= ambientLed ? 2 : patchA >= patchB ? 0 : 1;
              const ledRadius = radius + ledIntensity * 0.72;
              activeLeds.push({
                x: dotX,
                y: dotY,
                radius: ledRadius,
                intensity: ledIntensity,
                flareBoost: interactiveEnergy,
                pairIdx,
              });
              const underAlpha = Math.max(0.03, alpha * (1 - ledIntensity * 0.75));
              ctx.fillStyle = `rgba(${baseRgb}, ${underAlpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(dotX, dotY, Math.max(0.5, radius), 0, Math.PI * 2);
              ctx.fill();
              continue;
            }
          }

          ctx.fillStyle = `rgba(${baseRgb}, ${Math.min(0.65, Math.max(0.03, alpha)).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(dotX, dotY, Math.max(0.5, radius), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Pass 2 (LED variant): multi-color dot core + thresholded halo + crest/interactive flares
      if (isLed && activeLeds.length > 0) {
        ctx.save();
        if (isDark) {
          ctx.globalCompositeOperation = "lighter";
        }

        for (let i = 0; i < activeLeds.length; i++) {
          const led = activeLeds[i];
          const haloSprite = sprites.halos[led.pairIdx];
          const coreSprite = sprites.cores[led.pairIdx];

          // Draw large halo sprite only above intensity threshold to keep mobile FPS & contrast crisp
          if (led.intensity > 0.18) {
            const haloSize = (11 + led.intensity * 16) * (isDark ? 1.08 : 0.88);
            ctx.globalAlpha = Math.min(1, led.intensity * (isDark ? 0.78 : 0.45));
            ctx.drawImage(
              haloSprite,
              led.x - haloSize * 0.5,
              led.y - haloSize * 0.5,
              haloSize,
              haloSize
            );
          }

          // Multi-color prismatic dot core carries the crisp color
          const coreDiameter = Math.max(2, led.radius * 2.25);
          ctx.globalAlpha = Math.min(1, 0.32 + led.intensity * 0.68);
          ctx.drawImage(
            coreSprite,
            led.x - coreDiameter * 0.5,
            led.y - coreDiameter * 0.5,
            coreDiameter,
            coreDiameter
          );

          // Delicate 4-point star flare on ambient wave crests (intensity > 0.36) or strong on hover/click
          const flareLevel = Math.max(
            (led.intensity - 0.36) * 0.9,
            (led.flareBoost - 0.32) * 1.45
          );
          if (flareLevel > 0.06) {
            const clampedFlare = Math.min(1, flareLevel);
            const armLength = 4.5 + clampedFlare * 8.5;
            ctx.globalAlpha = 1;
            drawPairStarFlare(
              ctx,
              led.x,
              led.y,
              armLength,
              pairs[led.pairIdx],
              clampedFlare,
              isDark
            );
          }
        }

        ctx.restore();
      }

      if (!reducedMotion && isInView && !document.hidden) {
        rafId = requestAnimationFrame(draw);
      }
    };

    if (reducedMotion) {
      draw(performance.now());
    } else {
      scheduleFrame();
    }

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      parent.removeEventListener("pointermove", handlePointerMove);
      parent.removeEventListener("pointerleave", handlePointerLeave);
      parent.removeEventListener("click", handleClick);
      motionQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [spacing, variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none block size-full", className)}
      style={{
        maskImage:
          "radial-gradient(ellipse 48% 48% at 50% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.88) 32%, rgba(0, 0, 0, 0.26) 68%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 48% 48% at 50% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.88) 32%, rgba(0, 0, 0, 0.26) 68%, transparent 100%)",
      }}
    />
  );
};
