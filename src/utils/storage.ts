import { GlobalsConfig, GradientStudioConfig, TileConfig, BlobConfig } from "../types/gradient";
import { DEFAULT_GLOBALS, DEFAULT_TILES } from "../constants/defaults";
import { clone } from "./color";

const STORAGE_KEY = "gradient-tiles-config-v9";

// Asigură ID-uri unice și permanente pentru toate straturile de blob
export function ensureBlobIds(tiles: TileConfig[]): TileConfig[] {
  return tiles.map((tile, ti) => ({
    ...tile,
    blobs: (tile.blobs || []).map((b: BlobConfig, bi: number) => ({
      ...b,
      id: b.id || `b-${ti}-${bi}-${Math.random().toString(36).slice(2, 7)}`,
    })),
  }));
}

// Interfață pentru mediul window.storage dacă este prezent
interface CustomWindow extends Window {
  storage?: {
    get: (key: string) => Promise<{ value: string } | null>;
    set: (key: string, value: string) => Promise<boolean>;
  };
}

export function loadSavedConfigSync(): GradientStudioConfig | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v) {
      const parsed = JSON.parse(v);
      if (validConfig(parsed)) {
        const cleanedTiles = (parsed.tiles || []).filter(
          (t: any) => !t?.riptide && !t?.webgl
        );
        const savedTiles =
          cleanedTiles.length > 0 ? [...cleanedTiles] : clone(DEFAULT_TILES);
        if (savedTiles.length < DEFAULT_TILES.length) {
          for (let i = savedTiles.length; i < DEFAULT_TILES.length; i++) {
            savedTiles.push(clone(DEFAULT_TILES[i]));
          }
        }
        parsed.tiles = ensureBlobIds(
          savedTiles.map((t: any) =>
            t.animate === false && !t.animationMode ? { ...t, animate: undefined } : t
          )
        );
        return parsed;
      }
    }
  } catch (e) {
    // ignoră eroarea
  }
  return null;
}

export async function loadSavedConfig(): Promise<GradientStudioConfig | null> {
  const win = window as unknown as CustomWindow;
  try {
    if (win.storage) {
      const r = await win.storage.get(STORAGE_KEY);
      if (r && r.value) {
        const parsed = JSON.parse(r.value);
        if (validConfig(parsed)) {
          const cleanedTiles = (parsed.tiles || []).filter(
            (t: any) => !t?.riptide && !t?.webgl
          );
          const savedTiles =
            cleanedTiles.length > 0 ? [...cleanedTiles] : clone(DEFAULT_TILES);
          if (savedTiles.length < DEFAULT_TILES.length) {
            for (let i = savedTiles.length; i < DEFAULT_TILES.length; i++) {
              savedTiles.push(clone(DEFAULT_TILES[i]));
            }
          }
          parsed.tiles = ensureBlobIds(savedTiles);
          return parsed;
        }
      }
    }
  } catch (e) {
    // ignoră eroarea
  }

  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v) {
      const parsed = JSON.parse(v);
      if (validConfig(parsed)) {
        const cleanedTiles = (parsed.tiles || []).filter(
          (t: any) => !t?.riptide && !t?.webgl
        );
        const savedTiles =
          cleanedTiles.length > 0 ? [...cleanedTiles] : clone(DEFAULT_TILES);
        if (savedTiles.length < DEFAULT_TILES.length) {
          for (let i = savedTiles.length; i < DEFAULT_TILES.length; i++) {
            savedTiles.push(clone(DEFAULT_TILES[i]));
          }
        }
        parsed.tiles = ensureBlobIds(savedTiles);
        return parsed;
      }
    }
  } catch (e) {
    // ignoră eroarea
  }

  return null;
}

export async function saveStudioConfig(text: string): Promise<boolean> {
  const win = window as unknown as CustomWindow;
  let ok = false;
  try {
    if (win.storage) {
      const r = await win.storage.set(STORAGE_KEY, text);
      if (r) ok = true;
    }
  } catch (e) {
    // ignoră
  }

  try {
    localStorage.setItem(STORAGE_KEY, text);
    ok = true;
  } catch (e) {
    // ignoră
  }

  return ok;
}

export const validConfig = (d: any): d is GradientStudioConfig => {
  return (
    d &&
    d.globals &&
    Array.isArray(d.tiles) &&
    d.tiles.length > 0
  );
};

export const normalizeGlobals = (globals: Partial<GlobalsConfig>): GlobalsConfig => {
  const rawMode = globals.animationMode as string | undefined;
  const mode = ["scale", "lift", "fade", "rotate"].includes(rawMode || "")
    ? (rawMode as GlobalsConfig["animationMode"])
    : rawMode === "fade"
    ? "fade"
    : rawMode === "swivel" || rawMode === "wheel"
    ? "rotate"
    : rawMode === "float-in" || rawMode === "fly-in" || rawMode === "rise-up"
    ? "lift"
    : "scale";

  const rawDir = globals.animationDirection;
  const direction = [
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ].includes(rawDir || "")
    ? (rawDir as GlobalsConfig["animationDirection"])
    : DEFAULT_GLOBALS.animationDirection;

  const rawRim = globals.rimOrigin;
  const rimOrigin = ["top", "right", "bottom", "left"].includes(rawRim || "")
    ? (rawRim as GlobalsConfig["rimOrigin"])
    : DEFAULT_GLOBALS.rimOrigin;

  const rawRimMode = globals.rimAnimationMode;
  const rimAnimationMode = ["bloom", "glint", "breathe", "scale-down"].includes(rawRimMode || "")
    ? (rawRimMode as GlobalsConfig["rimAnimationMode"])
    : DEFAULT_GLOBALS.rimAnimationMode;

  return {
    ...DEFAULT_GLOBALS,
    ...globals,
    animate: true,
    animationMode: mode,
    animationDirection: direction,
    rimOrigin: rimOrigin,
    rimAnimationMode: rimAnimationMode,
  };
};
