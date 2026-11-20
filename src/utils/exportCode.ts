import { TileConfig, GlobalsConfig } from "../types/gradient";
import { getBlobShapeStyle } from "../constants/shapes";
import { hexToRgba } from "./color";
import { toPng } from "html-to-image";
import { getEchoVector } from "../components/GradientTile";

/**
 * Generează un cod React (JSX + Inline CSS/Tailwind) complet, gata de copiat
 */
export function generateReactSnippet(tile: TileConfig, g: GlobalsConfig): string {
  const tileName = tile.name ? tile.name.replace(/[^a-zA-Z0-9]/g, "") : "GradientCard";
  const componentName = tileName.charAt(0).toUpperCase() + tileName.slice(1) || "GradientCard";

  const rimOpacity = tile.rimOpacity ?? g.rimOpacity;
  const rimBlur = tile.rimBlur ?? g.rimBlur;
  const rimSpread = tile.rimSpread ?? g.rimSpread;
  const contrast = tile.contrast ?? g.contrast;
  const saturate = tile.saturate ?? g.saturate;
  const blurScale = tile.blurScale ?? g.blurScale;

  const rimShadow = `inset 0 0 ${rimBlur}px ${rimSpread}px ${hexToRgba(tile.rim, rimOpacity)}`;

  const blobsCode = tile.blobs
    .flatMap((b, i) => {
      const shape = getBlobShapeStyle(b);
      const baseScale = b.scale ?? 1;
      const echoCount = Math.min(8, Math.max(0, b.echoCount || 0));
      const echoSteps: number[] = [];
      if (echoCount > 0) {
        if (b.echoOrder === "back-to-front") {
          for (let k = 0; k <= echoCount; k++) echoSteps.push(k);
        } else {
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
        const w = +(b.w * effectiveScale).toFixed(1);
        const h = +(b.h * effectiveScale).toFixed(1);
        const stepOpacity = +(Math.pow(b.echoFade ?? 0.75, stepK)).toFixed(3);
        const blur = +(b.blur * (1 + stepK * 0.05) * blurScale).toFixed(1);

        if (shape.svgPath) {
          return `        {/* Blob #${i + 1}${stepK > 0 ? ` [Ecou ${stepK}]` : ""}: ${shape.label} */}
        <svg
          viewBox="0 0 256 256"
          style={{
            position: "absolute",
            left: "${stepX}%",
            top: "${stepY}%",
            width: "${w}%",
            height: "${h}%",
            opacity: ${stepOpacity},
            ${b.blendMode ? `mixBlendMode: "${b.blendMode}",\n            ` : ""}transform: "translate(-50%, -50%) rotate(${b.rot}deg)",
            filter: "blur(${blur}px)",
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <path d="${shape.svgPath}" fill="${b.color}" />
        </svg>`;
        }

        return `        {/* Blob #${i + 1}${stepK > 0 ? ` [Ecou ${stepK}]` : ""}: ${shape.label} */}
        <div
          style={{
            position: "absolute",
            left: "${stepX}%",
            top: "${stepY}%",
            width: "${w}%",
            height: "${h}%",
            opacity: ${stepOpacity},
            ${b.blendMode ? `mixBlendMode: "${b.blendMode}",\n            ` : ""}backgroundColor: "${b.color}",
            borderRadius: "${shape.borderRadius || "50%"}",
            ${shape.clipPath ? `clipPath: "${shape.clipPath}",\n            ` : ""}transform: "translate(-50%, -50%) rotate(${b.rot}deg)",
            filter: "blur(${blur}px)",
            pointerEvents: "none",
          }}
        />`;
      });
    })
    .join("\n\n");

  const isNoise = tile.noise ?? g.noise;
  const noiseOpacity = tile.noiseOpacity ?? g.noiseOpacity ?? 0.2;
  const noiseScale = tile.noiseScale ?? g.noiseScale ?? 1;

  const noiseCode = isNoise
    ? `\n      {/* Strat Film Grain (Noise Overlay) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          mixBlendMode: "overlay",
          opacity: ${noiseOpacity},
          pointerEvents: "none",
        }}
      >
        <filter id="tile-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="${(0.65 / noiseScale).toFixed(3)}"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#tile-noise)" />
      </svg>`
    : "";

  return `import React from "react";

export function ${componentName}() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "${g.size}px",
        aspectRatio: "1 / 1",
        borderRadius: "${g.radius}%",
        overflow: "hidden",
        backgroundColor: "${tile.base}",
        boxShadow: "${rimShadow}",
        isolation: "isolate",
      }}
    >
      {/* Strat de blob-uri cu filtre */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: "contrast(${contrast}) saturate(${saturate})",
        }}
      >
${blobsCode}
      </div>${noiseCode}

      {/* Strat de iluminare Rim */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          boxShadow: "${rimShadow}",
        }}
      />
    </div>
  );
}

export default ${componentName};
`;
}

/**
 * Generează un fișier pur HTML + CSS
 */
export function generateHtmlCssSnippet(tile: TileConfig, g: GlobalsConfig): string {
  const rimOpacity = tile.rimOpacity ?? g.rimOpacity;
  const rimBlur = tile.rimBlur ?? g.rimBlur;
  const rimSpread = tile.rimSpread ?? g.rimSpread;
  const contrast = tile.contrast ?? g.contrast;
  const saturate = tile.saturate ?? g.saturate;
  const blurScale = tile.blurScale ?? g.blurScale;

  const isNoise = tile.noise ?? g.noise;
  const noiseOpacity = tile.noiseOpacity ?? g.noiseOpacity ?? 0.2;
  const noiseScale = tile.noiseScale ?? g.noiseScale ?? 1;

  const rimShadow = `inset 0 0 ${rimBlur}px ${rimSpread}px ${hexToRgba(tile.rim, rimOpacity)}`;

  const blobsHtmlList: string[] = [];
  const blobsCssList: string[] = [];

  tile.blobs.forEach((b, i) => {
    const shape = getBlobShapeStyle(b);
    const baseScale = b.scale ?? 1;
    const echoCount = Math.min(8, Math.max(0, b.echoCount || 0));
    const echoSteps: number[] = [];
    if (echoCount > 0) {
      if (b.echoOrder === "back-to-front") {
        for (let k = 0; k <= echoCount; k++) echoSteps.push(k);
      } else {
        for (let k = echoCount; k >= 0; k--) echoSteps.push(k);
      }
    } else {
      echoSteps.push(0);
    }
    const vec = getEchoVector(b.echoDirection || "right");

    echoSteps.forEach((stepK) => {
      const stepClass = stepK > 0 ? `blob-${i + 1}-echo-${stepK}` : `blob-${i + 1}`;
      const echoComment = stepK > 0 ? ` [Ecou ${stepK}]` : "";
      const offsetDist = stepK * (b.echoOffset ?? 12);
      const stepX = +(b.x + vec.dx * offsetDist).toFixed(1);
      const stepY = +(b.y + vec.dy * offsetDist).toFixed(1);
      const scaleMult = Math.pow(b.echoScaleStep ?? 1.15, stepK);
      const effectiveScale = baseScale * scaleMult;
      const w = +(b.w * effectiveScale).toFixed(1);
      const h = +(b.h * effectiveScale).toFixed(1);
      const stepOpacity = +(Math.pow(b.echoFade ?? 0.75, stepK)).toFixed(3);
      const blur = +(b.blur * (1 + stepK * 0.05) * blurScale).toFixed(1);

      if (shape.svgPath) {
        blobsHtmlList.push(`    <!-- Blob ${i + 1}${echoComment}: ${shape.label} -->
    <svg class="blob ${stepClass}" viewBox="0 0 256 256">
      <path d="${shape.svgPath}" fill="${b.color}" />
    </svg>`);

        blobsCssList.push(`  .${stepClass} {
    left: ${stepX}%;
    top: ${stepY}%;
    width: ${w}%;
    height: ${h}%;
    opacity: ${stepOpacity};
    ${b.blendMode ? `mix-blend-mode: ${b.blendMode};\n    ` : ""}transform: translate(-50%, -50%) rotate(${b.rot}deg);
    filter: blur(${blur}px);
  }`);
      } else {
        blobsHtmlList.push(`    <!-- Blob ${i + 1}${echoComment}: ${shape.label} -->
    <div class="blob ${stepClass}"></div>`);

        blobsCssList.push(`  .${stepClass} {
    left: ${stepX}%;
    top: ${stepY}%;
    width: ${w}%;
    height: ${h}%;
    opacity: ${stepOpacity};
    ${b.blendMode ? `mix-blend-mode: ${b.blendMode};\n    ` : ""}background-color: ${b.color};
    border-radius: ${shape.borderRadius || "50%"};
    ${shape.clipPath ? `clip-path: ${shape.clipPath};\n    ` : ""}transform: translate(-50%, -50%) rotate(${b.rot}deg);
    filter: blur(${blur}px);
  }`);
      }
    });
  });

  const blobsHtml = blobsHtmlList.join("\n");
  const blobsCss = blobsCssList.join("\n\n");

  const noiseHtml = isNoise
    ? `\n  <!-- Strat Film Grain (Noise Overlay) -->
  <svg class="noise-overlay" aria-hidden="true">
    <filter id="tile-noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="${(0.65 / noiseScale).toFixed(3)}"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#tile-noise)" />
  </svg>`
    : "";

  const noiseCss = isNoise
    ? `\n\n  .noise-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    mix-blend-mode: overlay;
    opacity: ${noiseOpacity};
    pointer-events: none;
  }`
    : "";

  return `<!-- Gradient Tile HTML -->
<div class="gradient-card">
  <div class="blobs-container">
${blobsHtml}
  </div>${noiseHtml}
  <div class="rim-glow"></div>
</div>

<style>
  .gradient-card {
    position: relative;
    width: ${g.size}px;
    height: ${g.size}px;
    border-radius: ${g.radius}%;
    overflow: hidden;
    background-color: ${tile.base};
    box-shadow: ${rimShadow};
    isolation: isolate;
  }

  .blobs-container {
    position: absolute;
    inset: 0;
    filter: contrast(${contrast}) saturate(${saturate});
  }

  .blob {
    position: absolute;
    pointer-events: none;
    overflow: visible;
  }

${blobsCss}${noiseCss}

  .rim-glow {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: ${rimShadow};
  }
</style>
`;
}

/**
 * Generează un SVG standalone complet (poate fi importat direct în Figma / Illustrator)
 */
export function generateSvgSnippet(tile: TileConfig, g: GlobalsConfig): string {
  const size = 500;
  const rimOpacity = tile.rimOpacity ?? g.rimOpacity;
  const rimBlur = tile.rimBlur ?? g.rimBlur;
  const blurScale = tile.blurScale ?? g.blurScale;
  const radiusPx = (g.radius / 100) * (size / 2);

  const isNoise = tile.noise ?? g.noise;
  const noiseOpacity = tile.noiseOpacity ?? g.noiseOpacity ?? 0.2;
  const noiseScale = tile.noiseScale ?? g.noiseScale ?? 1;

  const filterDefs: string[] = [];
  const blobsSvg: string[] = [];

  tile.blobs.forEach((b, i) => {
    const shape = getBlobShapeStyle(b);
    const baseScale = b.scale ?? 1;
    const echoCount = Math.min(8, Math.max(0, b.echoCount || 0));
    const echoSteps: number[] = [];
    if (echoCount > 0) {
      if (b.echoOrder === "back-to-front") {
        for (let k = 0; k <= echoCount; k++) echoSteps.push(k);
      } else {
        for (let k = echoCount; k >= 0; k--) echoSteps.push(k);
      }
    } else {
      echoSteps.push(0);
    }
    const vec = getEchoVector(b.echoDirection || "right");

    echoSteps.forEach((stepK) => {
      const filterId = stepK > 0 ? `blur-${i + 1}-echo-${stepK}` : `blur-${i + 1}`;
      const echoComment = stepK > 0 ? ` [Ecou ${stepK}]` : "";
      const offsetDist = stepK * (b.echoOffset ?? 12);
      const stepX = +(b.x + vec.dx * offsetDist).toFixed(1);
      const stepY = +(b.y + vec.dy * offsetDist).toFixed(1);
      const scaleMult = Math.pow(b.echoScaleStep ?? 1.15, stepK);
      const effectiveScale = baseScale * scaleMult;
      const wPx = +((b.w * effectiveScale / 100) * size).toFixed(1);
      const hPx = +((b.h * effectiveScale / 100) * size).toFixed(1);
      const xPx = +((stepX / 100) * size).toFixed(1);
      const yPx = +((stepY / 100) * size).toFixed(1);
      const stepOpacity = +(Math.pow(b.echoFade ?? 0.75, stepK)).toFixed(3);
      const blur = Math.max(1, +(b.blur * (1 + stepK * 0.05) * blurScale * 1.8).toFixed(1));

      filterDefs.push(`    <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${blur}" />
    </filter>`);

      const blendStyle = b.blendMode ? `mix-blend-mode: ${b.blendMode}; ` : "";
      const groupStyle = `${blendStyle}opacity: ${stepOpacity};`;

      if (shape.svgPath) {
        const scaleX = +(wPx / 256).toFixed(4);
        const scaleY = +(hPx / 256).toFixed(4);

        blobsSvg.push(`    <!-- Blob ${i + 1}${echoComment}: ${shape.label} -->
    <g transform="translate(${xPx}, ${yPx}) rotate(${b.rot})" filter="url(#${filterId})" style="${groupStyle}">
      <g transform="translate(-${+wPx / 2}, -${+hPx / 2}) scale(${scaleX}, ${scaleY})">
        <path d="${shape.svgPath}" fill="${b.color}" />
      </g>
    </g>`);
      } else if (shape.clipPath && shape.clipPath.startsWith("polygon(")) {
        // Parsare poligon CSS în coordonate SVG relative la centrul blob-ului
        const pointsRaw = shape.clipPath.replace(/^polygon\(/, "").replace(/\)$/, "");
        const svgPoints = pointsRaw
          .split(",")
          .map((pair) => {
            const [pXStr, pYStr] = pair.trim().split(/\s+/);
            const pXPercent = parseFloat(pXStr) / 100;
            const pYPercent = parseFloat(pYStr) / 100;
            const ptX = +((pXPercent - 0.5) * wPx).toFixed(1);
            const ptY = +((pYPercent - 0.5) * hPx).toFixed(1);
            return `${ptX},${ptY}`;
          })
          .join(" ");

        blobsSvg.push(`    <!-- Blob ${i + 1}${echoComment}: ${shape.label} -->
    <g transform="translate(${xPx}, ${yPx}) rotate(${b.rot})" filter="url(#${filterId})" style="${groupStyle}">
      <polygon points="${svgPoints}" fill="${b.color}" />
    </g>`);
      } else if (shape.borderRadius && shape.borderRadius !== "50%") {
        // Formă rotunjită sau pastilă
        const rx = shape.borderRadius.includes("%")
          ? (parseFloat(shape.borderRadius) / 100) * (Math.min(wPx, hPx) / 2)
          : Math.min(wPx, hPx) / 2;

        blobsSvg.push(`    <!-- Blob ${i + 1}${echoComment}: ${shape.label} -->
    <g transform="translate(${xPx}, ${yPx}) rotate(${b.rot})" filter="url(#${filterId})" style="${groupStyle}">
      <rect x="-${+wPx / 2}" y="-${+hPx / 2}" width="${wPx}" height="${hPx}" rx="${rx.toFixed(1)}" ry="${rx.toFixed(1)}" fill="${b.color}" />
    </g>`);
      } else {
        blobsSvg.push(`    <!-- Blob ${i + 1}${echoComment}: ${shape.label} -->
    <g transform="translate(${xPx}, ${yPx}) rotate(${b.rot})" filter="url(#${filterId})" style="${groupStyle}">
      <ellipse cx="0" cy="0" rx="${+wPx / 2}" ry="${+hPx / 2}" fill="${b.color}" />
    </g>`);
      }
    });
  });

  const noiseFilterDef = isNoise
    ? `\n    <filter id="svg-noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="${(0.65 / noiseScale).toFixed(3)}"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>`
    : "";

  const noiseOverlaySvg = isNoise
    ? `\n    <!-- Strat Film Grain (Noise Overlay) -->
    <rect width="${size}" height="${size}" filter="url(#svg-noise)" style="mix-blend-mode: overlay; opacity: ${noiseOpacity};" />`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <clipPath id="card-clip">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${radiusPx}" ry="${radiusPx}" />
    </clipPath>
${filterDefs.join("\n")}${noiseFilterDef}
  </defs>

  <!-- Fundal & Card Clipped -->
  <g clip-path="url(#card-clip)">
    <rect width="${size}" height="${size}" fill="${tile.base}" />
${blobsSvg.join("\n\n")}${noiseOverlaySvg}
    <!-- Rim Light -->
    <rect width="${size}" height="${size}" fill="none" stroke="${hexToRgba(tile.rim, rimOpacity)}" stroke-width="${rimBlur * 0.8}" opacity="${rimOpacity}" />
  </g>
</svg>
`;
}

/**
 * Descarcă un element HTML direct ca fișier PNG la rezoluție înaltă (ex: 2x sau 4x)
 */
export async function downloadTileAsPng(
  element: HTMLElement,
  filename: string,
  pixelRatio: number = 2
): Promise<void> {
  const dataUrl = await toPng(element, {
    pixelRatio,
    cacheBust: true,
  });

  const a = document.createElement("a");
  a.download = `${filename}.png`;
  a.href = dataUrl;
  a.click();
}

/**
 * Descarcă codul SVG ca fișier .svg
 */
export function downloadSvgString(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `${filename}.svg`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}
