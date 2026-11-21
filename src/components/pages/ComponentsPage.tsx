import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { animate, useReducedMotion } from "motion/react";
import { Bookmark, Check, Play, Settings2, Share01 } from "../icons";
import { GlobalsConfig, TileConfig } from "../../types/gradient";
import { DEFAULT_GLOBALS } from "../../constants/defaults";
import {
  getRegistryCliCommand,
  getShowcaseComponentDocs,
  type StudioComponentId,
} from "../studio/registry";
import {
  BotAvatar,
  DEFAULT_BOT_BODY_COLOR,
  DEFAULT_BOT_SHAPE,
  type AvatarExpression,
} from "../bot-avatar";
import { Palette } from "../palette/Palette";
import { WakeSlider } from "../ui/wake-slider";
import { DownloadButton } from "../ui/download-button";
import { GradientTile } from "../GradientTile";
import { Button } from "../ui/button";
import {
  BotAvatarDemo,
  buildBotAvatarJsx,
  DEFAULT_BOT_AVATAR_CONFIG,
  type BotAvatarConfig,
} from "../showcase/demos/BotAvatarDemo";
import {
  COLOR_PICKER_PLAY_COLORS,
  ColorPickerDemo,
  ColorPickerStagePreview,
  buildColorPickerJsx,
  DEFAULT_COLOR_PICKER_CONFIG,
  type ColorPickerConfig,
} from "../showcase/demos/ColorPickerDemo";
import {
  PaletteDemo,
  buildPaletteJsx,
  DEFAULT_PALETTE_CONFIG,
  type PaletteConfig,
} from "../showcase/demos/PaletteDemo";
import {
  WakeSliderDemo,
  buildWakeSliderJsx,
  DEFAULT_WAKE_SLIDER_CONFIG,
  type WakeSliderConfig,
} from "../showcase/demos/WakeSliderDemo";
import {
  GradientTileDemo,
  buildGradientTileJsx,
  DEFAULT_GRADIENT_TILE_CONFIG,
  resolveGradientTile,
  type GradientTileConfig,
} from "../showcase/demos/GradientTileDemo";
import {
  DownloadButtonDemo,
  buildDownloadButtonJsx,
  DEFAULT_DOWNLOAD_BUTTON_CONFIG,
  type DownloadButtonConfig,
} from "../showcase/demos/DownloadButtonDemo";
import {
  ShowcaseCodePanel,
  ShowcaseStageHeader,
  shareCurrentUrl,
} from "../showcase/ComponentDetailLayout";
import { prefetchComponentCode } from "../showcase/registrySource";
import { DotMatrixWave } from "../showcase/DotMatrixWave";
import { cn } from "../../utils/cn";

export type ProductId =
  | "gradient"
  | "bot-avatar"
  | "color-picker"
  | "palette"
  | "wake-slider"
  | "download-button";

interface ProductMeta {
  id: ProductId;
  title: string;
  description: string;
  masonryHeight: number;
  cardHeightClass: string;
}

const MASONRY_GAP_PX = 20;

const PRODUCTS: ProductMeta[] = [
  {
    id: "bot-avatar",
    title: "Bot Avatar",
    description:
      "Interactive 2.5D SVG avatar with 3D gaze tracking, organic blinking, 7 body shapes, 10 expressions, and tactile gestures.",
    masonryHeight: 310,
    cardHeightClass: "h-[280px] sm:h-[310px]",
  },
  {
    id: "color-picker",
    title: "Color Picker",
    description:
      "Interactive HSVA color picker with spring-physics loupe, HEX/RGB/HSL channels, alpha slider, eyedropper, and preset swatches.",
    masonryHeight: 230,
    cardHeightClass: "h-[210px] sm:h-[230px]",
  },
  {
    id: "gradient",
    title: "Squircle Gradient",
    description:
      "Layered SVG & CSS squircle gradient tile with organic blob shapes, echo trails, rim lighting, film grain, and border beams.",
    masonryHeight: 360,
    cardHeightClass: "h-[290px] sm:h-[360px]",
  },
  {
    id: "wake-slider",
    title: "Wake Slider",
    description:
      "Kinetic bar-track range slider with velocity-driven wave wake and NumberFlow numeric readout.",
    masonryHeight: 220,
    cardHeightClass: "h-[200px] sm:h-[220px]",
  },
  {
    id: "palette",
    title: "OKLCH Palette",
    description:
      "Perceptually uniform OKLCH color ramp generator with elastic SVG goo transitions and instant hex copy.",
    masonryHeight: 240,
    cardHeightClass: "h-[210px] sm:h-[240px]",
  },
  {
    id: "download-button",
    title: "Download Button",
    description:
      "Multi-state pill download button with emerging Pause/Play and Cancel circles, live progress sweep, and checkmark-to-Open morph.",
    masonryHeight: 210,
    cardHeightClass: "h-[195px] sm:h-[210px]",
  },
];

const LG_MEDIA_QUERY = "(min-width: 1024px)";
const SM_MEDIA_QUERY = "(min-width: 640px)";

function subscribeMasonryQueries(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const lgMq = window.matchMedia(LG_MEDIA_QUERY);
  const smMq = window.matchMedia(SM_MEDIA_QUERY);
  lgMq.addEventListener("change", callback);
  smMq.addEventListener("change", callback);
  return () => {
    lgMq.removeEventListener("change", callback);
    smMq.removeEventListener("change", callback);
  };
}

function getMasonryColumnCountSnapshot(): 1 | 2 | 3 {
  if (typeof window === "undefined" || !window.matchMedia) return 3;
  if (window.matchMedia(LG_MEDIA_QUERY).matches) return 3;
  if (window.matchMedia(SM_MEDIA_QUERY).matches) return 2;
  return 1;
}

function distributeMasonryColumns<T extends { masonryHeight: number }>(
  items: readonly T[],
  columnCount: number
): T[][] {
  const cols: T[][] = Array.from({ length: columnCount }, () => []);
  const heights = new Array<number>(columnCount).fill(0);

  for (const item of items) {
    let shortestCol = 0;
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < heights[shortestCol]) {
        shortestCol = i;
      }
    }
    cols[shortestCol].push(item);
    heights[shortestCol] +=
      item.masonryHeight + (cols[shortestCol].length > 1 ? MASONRY_GAP_PX : 0);
  }

  return cols;
}

const CUBIC_EASE = [0.22, 1, 0.36, 1] as const;
const GRID_AVATAR_SCALE = 0.82;
const GRID_PICKER_SCALE = 1;

export interface ComponentsPageProps {
  selectedProduct: ProductId | null;
  onSelectProduct: (id: ProductId | null) => void;
  onNavigateToStudio?: () => void;
  onOpenInStudio?: (componentId: StudioComponentId, config?: unknown) => void;
  onNavigateToPricing?: () => void;
  initialTile?: TileConfig;
  initialGlobals?: GlobalsConfig;
  onTileChange?: (tile: TileConfig) => void;
}

const SAVED_STORAGE_KEY = "interact:saved-products";

function loadSavedProducts(): ProductId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type TransitionPhase = "idle" | "opening" | "open" | "closing";

export const ComponentsPage: React.FC<ComponentsPageProps> = ({
  selectedProduct,
  onSelectProduct,
  onOpenInStudio,
  onNavigateToPricing,
}) => {
  const [savedProducts, setSavedProducts] = useState<ProductId[]>(() => loadSavedProducts());
  const [playingMap, setPlayingMap] = useState<Record<string, number>>({});
  const [botConfig, setBotConfig] = useState<BotAvatarConfig>(DEFAULT_BOT_AVATAR_CONFIG);
  const [colorPickerConfig, setColorPickerConfig] = useState<ColorPickerConfig>(
    DEFAULT_COLOR_PICKER_CONFIG
  );
  const [gridPickerConfig, setGridPickerConfig] = useState<ColorPickerConfig>(
    DEFAULT_COLOR_PICKER_CONFIG
  );
  const [paletteConfig, setPaletteConfig] = useState<PaletteConfig>(DEFAULT_PALETTE_CONFIG);
  const [wakeSliderConfig, setWakeSliderConfig] = useState<WakeSliderConfig>(
    DEFAULT_WAKE_SLIDER_CONFIG
  );
  const [gridWakeValue, setGridWakeValue] = useState<number>(DEFAULT_WAKE_SLIDER_CONFIG.value);
  const [gradientConfig, setGradientConfig] = useState<GradientTileConfig>(
    DEFAULT_GRADIENT_TILE_CONFIG
  );
  const [downloadButtonConfig, setDownloadButtonConfig] = useState<DownloadButtonConfig>(
    DEFAULT_DOWNLOAD_BUTTON_CONFIG
  );
  const [paletteRollCount, setPaletteRollCount] = useState(0);
  const [gradientAnimKey, setGradientAnimKey] = useState(0);
  const [downloadReplaySignal, setDownloadReplaySignal] = useState(0);
  const [downloadResetKey, setDownloadResetKey] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [gridPickerOpen, setGridPickerOpen] = useState(false);
  const [stageTab, setStageTab] = useState<"block" | "code">("block");
  const [codeMountedProduct, setCodeMountedProduct] = useState<ProductId | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const shareTimerRef = useRef<number | null>(null);

  const [activeProduct, setActiveProduct] = useState<ProductId | null>(selectedProduct);
  const [phase, setPhase] = useState<TransitionPhase>(selectedProduct !== null ? "open" : "idle");
  const [skipEntranceMotion, setSkipEntranceMotion] = useState<boolean>(selectedProduct !== null);

  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const targetSlotRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const previewScaleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const expandedHeaderRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const expandedPlayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fromRectRef = useRef<DOMRect | null>(null);
  const pointerDownOnBackdropRef = useRef(false);
  const lastPickerDismissAtRef = useRef(0);
  const pickerPlayStepRef = useRef(0);
  const botSizeRef = useRef<number>(botConfig.size);
  botSizeRef.current = botConfig.size;
  const animTokenRef = useRef(0);
  const activeAnimsRef = useRef<Array<{ stop: () => void }>>([]);
  const playTimersRef = useRef<Record<string, number>>({});
  const shouldReduceMotion = useReducedMotion();
  const columnCount = useSyncExternalStore(
    subscribeMasonryQueries,
    getMasonryColumnCountSnapshot,
    () => 3
  );
  const masonryColumns = useMemo(
    () => distributeMasonryColumns(PRODUCTS, columnCount),
    [columnCount]
  );

  const getGridScale = useCallback((id: ProductId) => {
    if (id === "bot-avatar") return GRID_AVATAR_SCALE;
    if (id === "color-picker") return GRID_PICKER_SCALE;
    return 1;
  }, []);

  const getTargetScale = useCallback((id: ProductId) => {
    if (id === "bot-avatar") return botSizeRef.current / 200;
    return 1;
  }, []);

  const stopActiveAnims = useCallback(() => {
    activeAnimsRef.current.forEach((ctrl) => ctrl.stop());
    activeAnimsRef.current = [];
  }, []);

  const clearCardFixedStyles = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    el.style.position = "";
    el.style.left = "";
    el.style.top = "";
    el.style.width = "";
    el.style.height = "";
    el.style.zIndex = "";
    el.style.margin = "";
  }, []);

  const applyRectToCard = useCallback((el: HTMLDivElement, rect: DOMRect) => {
    el.style.position = "fixed";
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.zIndex = "65";
    el.style.margin = "0";
  }, []);

  const openProduct = useCallback(
    (id: ProductId) => {
      if (activeProduct === id && (phase === "open" || phase === "opening")) {
        return;
      }
      stopActiveAnims();
      animTokenRef.current += 1;
      setStageTab("block");
      setPickerOpen(false);
      setGridPickerOpen(false);

      if (activeProduct !== null && activeProduct !== id && phase !== "closing") {
        clearCardFixedStyles(cardRefs.current[activeProduct]);
        const prevScaleEl = previewScaleRefs.current[activeProduct];
        if (prevScaleEl) {
          prevScaleEl.style.transform = `scale(${getGridScale(activeProduct)})`;
        }
        setSkipEntranceMotion(true);
        setActiveProduct(id);
        setPhase("open");
        onSelectProduct(id);
        return;
      }

      const cardEl = cardRefs.current[id];
      fromRectRef.current = cardEl ? cardEl.getBoundingClientRect() : null;
      setSkipEntranceMotion(false);
      setActiveProduct(id);
      setPhase("opening");
      onSelectProduct(id);
    },
    [activeProduct, phase, clearCardFixedStyles, getGridScale, onSelectProduct, stopActiveAnims]
  );

  // Sync external selectedProduct changes (browser back/forward or X button)
  useLayoutEffect(() => {
    if (selectedProduct !== null) {
      if (activeProduct !== selectedProduct) {
        stopActiveAnims();
        animTokenRef.current += 1;
        setStageTab("block");
      setPickerOpen(false);
      setGridPickerOpen(false);

        if (activeProduct !== null && phase !== "closing") {
          clearCardFixedStyles(cardRefs.current[activeProduct]);
          const prevScaleEl = previewScaleRefs.current[activeProduct];
          if (prevScaleEl) {
            prevScaleEl.style.transform = `scale(${getGridScale(activeProduct)})`;
          }
          setSkipEntranceMotion(true);
          setActiveProduct(selectedProduct);
          setPhase("open");
          return;
        }

        const cardEl = cardRefs.current[selectedProduct];
        fromRectRef.current = cardEl ? cardEl.getBoundingClientRect() : null;
        setSkipEntranceMotion(false);
        setActiveProduct(selectedProduct);
        setPhase("opening");
      }
      return;
    }

    if (activeProduct !== null && phase !== "closing") {
      setPhase("closing");
    }
  }, [selectedProduct, activeProduct, phase, clearCardFixedStyles, getGridScale, stopActiveAnims]);

  // Run open / close transitions on the single live card
  useLayoutEffect(() => {
    if (!activeProduct) return;

    const cardEl = cardRefs.current[activeProduct];
    const targetEl = targetSlotRef.current;
    const slotEl = slotRefs.current[activeProduct];
    const backdropEl = backdropRef.current;
    const previewScaleEl = previewScaleRefs.current[activeProduct];
    const expandedHeaderEl = expandedHeaderRefs.current[activeProduct];
    const expandedPlayEl = expandedPlayRefs.current[activeProduct];
    const gridScale = getGridScale(activeProduct);
    const targetScale = getTargetScale(activeProduct);

    if (!cardEl || !targetEl) return;

    const token = ++animTokenRef.current;
    stopActiveAnims();

    if (phase === "opening") {
      const to = targetEl.getBoundingClientRect();
      const from = fromRectRef.current ?? slotEl?.getBoundingClientRect() ?? to;

      if (shouldReduceMotion) {
        applyRectToCard(cardEl, to);
        if (backdropEl) backdropEl.style.opacity = "1";
        if (previewScaleEl) {
          previewScaleEl.style.transform = `scale(${targetScale})`;
        }
        setPhase("open");
        return;
      }

      applyRectToCard(cardEl, from);
      const dur = 0.36;
      const cardAnim = animate(
        cardEl,
        {
          left: [from.left, to.left],
          top: [from.top, to.top],
          width: [from.width, to.width],
          height: [from.height, to.height],
        },
        { duration: dur, ease: CUBIC_EASE }
      );
      activeAnimsRef.current.push(cardAnim);
      const waits: Promise<unknown>[] = [cardAnim.finished];

      if (backdropEl) {
        backdropEl.style.opacity = "0";
        const bgAnim = animate(
          backdropEl,
          { opacity: [0, 1] },
          { duration: 0.28, ease: CUBIC_EASE }
        );
        activeAnimsRef.current.push(bgAnim);
        waits.push(bgAnim.finished);
      }

      if (previewScaleEl) {
        const scaleAnim = animate(
          previewScaleEl,
          { scale: [gridScale, targetScale] },
          { duration: dur, ease: CUBIC_EASE }
        );
        activeAnimsRef.current.push(scaleAnim);
        waits.push(scaleAnim.finished);
      }

      if (expandedHeaderEl) {
        expandedHeaderEl.style.opacity = "0";
        const headerAnim = animate(
          expandedHeaderEl,
          { opacity: [0, 1] },
          { duration: 0.22, delay: 0.1, ease: CUBIC_EASE }
        );
        activeAnimsRef.current.push(headerAnim);
        waits.push(headerAnim.finished);
      }

      if (expandedPlayEl) {
        expandedPlayEl.style.opacity = "0";
        const playAnim = animate(
          expandedPlayEl,
          { opacity: [0, 1] },
          { duration: 0.22, delay: 0.1, ease: CUBIC_EASE }
        );
        activeAnimsRef.current.push(playAnim);
        waits.push(playAnim.finished);
      }

      Promise.all(waits).then(() => {
        if (animTokenRef.current !== token) return;
        setPhase("open");
      });
    } else if (phase === "closing") {
      const from = cardEl.getBoundingClientRect();
      const to = slotEl?.getBoundingClientRect() ?? from;
      setStageTab("block");
      setPickerOpen(false);
      setGridPickerOpen(false);

      if (shouldReduceMotion) {
        clearCardFixedStyles(cardEl);
        if (previewScaleEl) {
          previewScaleEl.style.transform = `scale(${gridScale})`;
        }
        setBotConfig(DEFAULT_BOT_AVATAR_CONFIG);
        setColorPickerConfig(DEFAULT_COLOR_PICKER_CONFIG);
        setPaletteConfig(DEFAULT_PALETTE_CONFIG);
        setWakeSliderConfig(DEFAULT_WAKE_SLIDER_CONFIG);
        setGradientConfig(DEFAULT_GRADIENT_TILE_CONFIG);
        setDownloadButtonConfig(DEFAULT_DOWNLOAD_BUTTON_CONFIG);
        setDownloadResetKey((k) => k + 1);
        setPickerOpen(false);
        setActiveProduct(null);
        setPhase("idle");
        return;
      }

      applyRectToCard(cardEl, from);
      const startScale = targetScale;
      setBotConfig(DEFAULT_BOT_AVATAR_CONFIG);
      setColorPickerConfig(DEFAULT_COLOR_PICKER_CONFIG);
      setPaletteConfig(DEFAULT_PALETTE_CONFIG);
      setWakeSliderConfig(DEFAULT_WAKE_SLIDER_CONFIG);
      setGradientConfig(DEFAULT_GRADIENT_TILE_CONFIG);
      setDownloadButtonConfig(DEFAULT_DOWNLOAD_BUTTON_CONFIG);
      setDownloadResetKey((k) => k + 1);
      setPickerOpen(false);
      const dur = 0.3;

      const cardAnim = animate(
        cardEl,
        {
          left: [from.left, to.left],
          top: [from.top, to.top],
          width: [from.width, to.width],
          height: [from.height, to.height],
        },
        { duration: dur, ease: CUBIC_EASE }
      );
      activeAnimsRef.current.push(cardAnim);

      const waits: Promise<unknown>[] = [cardAnim.finished];

      if (backdropEl) {
        const bgAnim = animate(
          backdropEl,
          { opacity: 0 },
          { duration: 0.26, ease: CUBIC_EASE }
        );
        activeAnimsRef.current.push(bgAnim);
        waits.push(bgAnim.finished);
      }

      if (previewScaleEl) {
        const scaleAnim = animate(
          previewScaleEl,
          { scale: [startScale, gridScale] },
          { duration: dur, ease: CUBIC_EASE }
        );
        activeAnimsRef.current.push(scaleAnim);
        waits.push(scaleAnim.finished);
      }

      if (expandedHeaderEl) {
        activeAnimsRef.current.push(
          animate(expandedHeaderEl, { opacity: 0 }, { duration: 0.14, ease: CUBIC_EASE })
        );
      }

      if (expandedPlayEl) {
        activeAnimsRef.current.push(
          animate(expandedPlayEl, { opacity: 0 }, { duration: 0.14, ease: CUBIC_EASE })
        );
      }

      Promise.all(waits).then(() => {
        if (animTokenRef.current !== token) return;
        clearCardFixedStyles(cardEl);
        if (previewScaleEl) {
          previewScaleEl.style.transform = `scale(${gridScale})`;
        }
        setActiveProduct(null);
        setPhase("idle");
      });
    } else if (phase === "open") {
      applyRectToCard(cardEl, targetEl.getBoundingClientRect());
      if (backdropEl) backdropEl.style.opacity = "1";
      if (previewScaleEl) previewScaleEl.style.transform = `scale(${targetScale})`;
      if (expandedHeaderEl) expandedHeaderEl.style.opacity = "1";
      if (expandedPlayEl) expandedPlayEl.style.opacity = "1";
    }
  }, [
    activeProduct,
    phase,
    shouldReduceMotion,
    applyRectToCard,
    clearCardFixedStyles,
    getGridScale,
    getTargetScale,
    stopActiveAnims,
  ]);

  // Keep promoted card locked onto targetSlotRef on resize / overlay scroll while open
  useEffect(() => {
    if (phase !== "open" || !activeProduct) return;

    const syncPosition = () => {
      const cardEl = cardRefs.current[activeProduct];
      const targetEl = targetSlotRef.current;
      if (cardEl && targetEl) {
        applyRectToCard(cardEl, targetEl.getBoundingClientRect());
      }
    };

    syncPosition();

    const targetEl = targetSlotRef.current;
    const ro = targetEl ? new ResizeObserver(syncPosition) : null;
    if (targetEl && ro) ro.observe(targetEl);

    const overlayEl = overlayRef.current;
    overlayEl?.addEventListener("scroll", syncPosition, { passive: true });
    window.addEventListener("resize", syncPosition);

    return () => {
      ro?.disconnect();
      overlayEl?.removeEventListener("scroll", syncPosition);
      window.removeEventListener("resize", syncPosition);
    };
  }, [phase, activeProduct, applyRectToCard]);

  // Sync live BotAvatar scale when user drags the Size slider in Quick Config
  useEffect(() => {
    if (phase !== "open" || activeProduct !== "bot-avatar") return;
    const scaleEl = previewScaleRefs.current["bot-avatar"];
    if (scaleEl) {
      scaleEl.style.transform = `scale(${botConfig.size / 200})`;
    }
  }, [phase, activeProduct, botConfig.size]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedProducts));
    } catch {
      // ignore storage quota / private mode errors
    }
  }, [savedProducts]);

  useEffect(() => {
    const timers = playTimersRef.current;
    return () => {
      Object.values(timers).forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  const resolveIsDarkForProduct = useCallback(
    (id: ProductId) => {
      if (id === "color-picker") {
        return colorPickerConfig.theme !== "light";
      }
      return typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : true;
    },
    [colorPickerConfig.theme]
  );

  // Keep Code panel mounted while promoted after first visit & warm registry/Shiki in background
  useEffect(() => {
    if (!activeProduct || phase === "closing") {
      setCodeMountedProduct(null);
      return;
    }
    if (stageTab === "code") {
      setCodeMountedProduct(activeProduct);
    }
  }, [activeProduct, phase, stageTab]);

  useEffect(() => {
    if (phase !== "open" || !activeProduct) return;
    const timerId = window.setTimeout(() => {
      prefetchComponentCode(activeProduct, resolveIsDarkForProduct(activeProduct));
    }, 220);
    return () => window.clearTimeout(timerId);
  }, [phase, activeProduct, resolveIsDarkForProduct]);

  useEffect(() => {
    if (activeProduct === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSelectProduct(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProduct, onSelectProduct]);

  const jsxSnippet = useMemo(() => {
    if (activeProduct === "color-picker") {
      return buildColorPickerJsx(colorPickerConfig);
    }
    if (activeProduct === "palette") {
      return buildPaletteJsx(paletteConfig);
    }
    if (activeProduct === "wake-slider") {
      return buildWakeSliderJsx(wakeSliderConfig);
    }
    if (activeProduct === "gradient") {
      return buildGradientTileJsx(gradientConfig);
    }
    if (activeProduct === "download-button") {
      return buildDownloadButtonJsx(downloadButtonConfig);
    }
    return buildBotAvatarJsx(botConfig);
  }, [activeProduct, botConfig, colorPickerConfig, paletteConfig, wakeSliderConfig, gradientConfig, downloadButtonConfig]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(jsxSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const handleCopyPrompt = async () => {
    const title = PRODUCTS.find((p) => p.id === activeProduct)?.title ?? "Component";
    const cliLine = activeProduct
      ? `\nInstall via shadcn CLI: ${getRegistryCliCommand(activeProduct)}\n`
      : "";
    const promptText = `Implement the ${title} component from interact.dev in React + TypeScript.${cliLine}\n${jsxSnippet}`;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {}
  };

  const handleShare = async (productTitle: string) => {
    const copied = await shareCurrentUrl(productTitle);
    if (!copied) return;
    setCopiedShare(true);
    if (shareTimerRef.current !== null) {
      window.clearTimeout(shareTimerRef.current);
    }
    shareTimerRef.current = window.setTimeout(() => {
      setCopiedShare(false);
      shareTimerRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (shareTimerRef.current !== null) {
        window.clearTimeout(shareTimerRef.current);
      }
    };
  }, []);

  const toggleSaved = (id: ProductId) => {
    setSavedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const triggerPlay = (id: ProductId) => {
    if (id === "palette") {
      setPaletteRollCount((prev) => prev + 1);
      return;
    }

    if (id === "wake-slider") {
      const steps = [28, 86, 48, 64];
      if (activeProduct === "wake-slider") {
        setWakeSliderConfig((prev) => {
          const idx = steps.indexOf(prev.value);
          const next = steps[(idx + 1) % steps.length];
          return { ...prev, value: next };
        });
      } else {
        setGridWakeValue((prev) => {
          const idx = steps.indexOf(prev);
          return steps[(idx + 1) % steps.length];
        });
      }
      return;
    }

    if (id === "gradient") {
      setGradientAnimKey((prev) => prev + 1);
      return;
    }

    if (id === "download-button") {
      setDownloadReplaySignal((prev) => prev + 1);
      return;
    }

    if (id === "color-picker") {
      if (performance.now() - lastPickerDismissAtRef.current < 250) {
        return;
      }
      if (activeProduct === "color-picker") {
        if (colorPickerConfig.mode === "popover") {
          setPickerOpen((prev) => !prev);
          return;
        }
        const nextColor =
          COLOR_PICKER_PLAY_COLORS[pickerPlayStepRef.current % COLOR_PICKER_PLAY_COLORS.length];
        pickerPlayStepRef.current += 1;
        setColorPickerConfig((prev) => ({ ...prev, value: nextColor }));
      } else {
        setGridPickerOpen((prev) => !prev);
      }
      return;
    }

    if (playTimersRef.current[id]) {
      window.clearTimeout(playTimersRef.current[id]);
    }
    setPlayingMap((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    playTimersRef.current[id] = window.setTimeout(() => {
      setPlayingMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      delete playTimersRef.current[id];
    }, 1600);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-background text-foreground antialiased flex flex-col">
      {/* Main Homepage Showcase (stays mounted underneath so nothing jumps on open/close) */}
      <div className="w-full pb-12 flex flex-col gap-6">
            {/* Semi-Hero Section (~50% viewport height, full width) */}
            <section className="relative w-full overflow-hidden min-h-[44vh] sm:min-h-[48vh] flex flex-col items-center justify-center text-center py-10 px-4">
              <DotMatrixWave className="absolute inset-0 z-0" />
              <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center gap-3.5">
                <h1 className="max-w-2xl text-3xl sm:text-5xl font-medium leading-[1.08] tracking-tight text-primary">
                  next-gen interactive
                  <br />
                  UI components
                </h1>
                <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
                  A library of interactive React components and micro-interactions—ready to drop into
                  your product and built for your AI agents.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      document
                        .getElementById("products-grid")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    Browse
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onNavigateToPricing?.()}
                  >
                    Get Full Access
                  </Button>
                </div>
              </div>
            </section>

            {/* Masonry Cards Grid (1 col mobile, 2 cols sm, 3 cols lg+) */}
            <div
              id="products-grid"
              className="scroll-mt-20 w-full max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start"
            >
              {masonryColumns.map((colProducts, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-5 min-w-0">
                  {colProducts.map((product) => {
                    const isSaved = savedProducts.includes(product.id);
                    const playStep = playingMap[product.id] ?? 0;
                    const isPromoted = activeProduct === product.id;
                    const playExpressions: AvatarExpression[] = ["excited", "happy", "wink", "surprised"];
                    const baseExpr = isPromoted ? botConfig.expression : "idle";
                    const pool = playExpressions.filter((e) => e !== baseExpr);
                    const botExpression: AvatarExpression =
                      playStep > 0 ? pool[(playStep - 1) % pool.length] : baseExpr;

                    return (
                      <div
                        key={product.id}
                        ref={(el) => {
                          slotRefs.current[product.id] = el;
                        }}
                        className={cn(
                          "relative",
                          product.id === "color-picker" && gridPickerOpen && !isPromoted && "z-30",
                          product.cardHeightClass
                        )}
                      >
                    <div
                      ref={(el) => {
                        cardRefs.current[product.id] = el;
                      }}
                      className={cn(
                        "group relative w-full h-full rounded-[28px] border border-border p-[14px] sm:p-[18px] flex flex-col justify-between transition-colors",
                        isPromoted && product.id === "color-picker" && phase !== "closing"
                          ? colorPickerConfig.theme === "light"
                            ? "light bg-background text-foreground"
                            : "dark bg-card text-card-foreground"
                          : "bg-card",
                        product.id === "color-picker" && stageTab !== "code"
                          ? "overflow-visible"
                          : "overflow-hidden",
                        !isPromoted && "hover:border-foreground/20"
                      )}
                    >
                      {/* Homepage interactions when sitting in grid */}
                      {!isPromoted && (
                        <>
                          <button
                            type="button"
                            aria-label={`Open ${product.title}`}
                            onClick={() => openProduct(product.id)}
                            className="absolute inset-0 z-0 rounded-[28px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                          />

                          <button
                            type="button"
                            aria-label={isSaved ? `Unsave ${product.title}` : `Save ${product.title}`}
                            aria-pressed={isSaved}
                            title={isSaved ? "Saved" : "Save"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaved(product.id);
                            }}
                            className={cn(
                              "absolute top-[14px] right-[14px] sm:top-[18px] sm:right-[18px] z-20 size-10 md:size-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer before:content-[''] before:absolute before:-inset-0.5 md:before:hidden",
                              "opacity-100 pointer-events-auto md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto",
                              isSaved
                                ? "glass-chosen text-primary"
                                : "glass-control text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Bookmark active={isSaved} className="size-[18px] md:size-4" />
                          </button>
                        </>
                      )}

                      {/* Expanded header (absolute so mounting/unmounting never shifts centered preview!) */}
                      {isPromoted && (
                        <div
                          ref={(el) => {
                            expandedHeaderRefs.current[product.id] = el;
                          }}
                          className="absolute top-[14px] left-[14px] right-[14px] sm:top-[18px] sm:left-[18px] sm:right-[18px] z-20"
                        >
                          <ShowcaseStageHeader
                            stageTab={stageTab}
                            onStageTabChange={setStageTab}
                            onCodeTabIntent={() =>
                              prefetchComponentCode(
                                product.id,
                                resolveIsDarkForProduct(product.id)
                              )
                            }
                            hasCode={true}
                            hideTitle={true}
                            hasCopyPrompt={true}
                            copiedPrompt={copiedPrompt}
                            onCopyPrompt={handleCopyPrompt}
                            isSaved={isSaved}
                            onToggleSave={() => toggleSaved(product.id)}
                            saveLabel={product.title}
                          />
                        </div>
                      )}

                      {/* Code panel when Code tab is active (kept mounted after first open for instant toggling) */}
                      {isPromoted &&
                        (stageTab === "code" || codeMountedProduct === product.id) && (
                          <div
                            className={cn(
                              "relative z-10 flex-1 min-h-0 pt-11 flex flex-col",
                              stageTab !== "code" && "hidden"
                            )}
                          >
                            {(() => {
                              const codeDocs = getShowcaseComponentDocs(product.id);
                              return (
                                <ShowcaseCodePanel
                                  componentId={product.id}
                                  codeSnippet={jsxSnippet}
                                  copiedCode={copiedCode}
                                  onCopyCode={handleCopyCode}
                                  cliCommand={getRegistryCliCommand(product.id)}
                                  dependencies={codeDocs?.dependencies}
                                  propsDocs={codeDocs?.props}
                                  howItWorks={codeDocs?.howItWorks}
                                />
                              );
                            })()}
                          </div>
                        )}

                      {/* Single live component instance (always centered at 50% / 50%, never shifts!) */}
                      <div
                        className={cn(
                          "absolute inset-0 z-10 flex items-center justify-center pointer-events-none",
                          isPromoted && stageTab === "code" && "hidden"
                        )}
                      >
                        <div
                          ref={(el) => {
                            previewScaleRefs.current[product.id] = el;
                          }}
                          className={cn(
                            "inline-flex items-center justify-center",
                            isPromoted ? "pointer-events-auto" : "pointer-events-none"
                          )}
                          style={{
                            transform: isPromoted
                              ? `scale(${getTargetScale(product.id)})`
                              : `scale(${getGridScale(product.id)})`,
                          }}
                          onClick={
                            isPromoted || product.id === "bot-avatar"
                              ? (e) => e.stopPropagation()
                              : undefined
                          }
                          onKeyDown={
                            isPromoted || product.id === "bot-avatar"
                              ? (e) => e.stopPropagation()
                              : undefined
                          }
                        >
                          {product.id === "bot-avatar" && (
                            <BotAvatar
                              shape={isPromoted ? botConfig.shape : DEFAULT_BOT_SHAPE}
                              expression={botExpression}
                              bodyColor={
                                isPromoted ? botConfig.bodyColor : DEFAULT_BOT_BODY_COLOR
                              }
                              size={200}
                              interactive={true}
                              interactivePadding={isPromoted ? undefined : 0}
                              tightHitbox={!isPromoted}
                              trackGaze={isPromoted ? botConfig.trackGaze : true}
                              enableVibration={true}
                            />
                          )}
                          {product.id === "color-picker" && (
                            <ColorPickerStagePreview
                              config={isPromoted ? colorPickerConfig : gridPickerConfig}
                              interactive={isPromoted}
                              shiftUp={isPromoted && phase !== "closing"}
                              animateShift={!skipEntranceMotion}
                              open={isPromoted ? pickerOpen : gridPickerOpen}
                              onOpenChange={(nextOpen) => {
                                if (!nextOpen) {
                                  lastPickerDismissAtRef.current = performance.now();
                                }
                                if (isPromoted) {
                                  setPickerOpen(nextOpen);
                                } else {
                                  setGridPickerOpen(nextOpen);
                                }
                              }}
                              onValueChange={(value) => {
                                if (isPromoted) {
                                  setColorPickerConfig((prev) => ({ ...prev, value }));
                                } else {
                                  setGridPickerConfig((prev) => ({ ...prev, value }));
                                }
                              }}
                              onFormatChange={(format) => {
                                if (isPromoted) {
                                  setColorPickerConfig((prev) => ({ ...prev, format }));
                                } else {
                                  setGridPickerConfig((prev) => ({ ...prev, format }));
                                }
                              }}
                            />
                          )}
                          {product.id === "palette" && (
                            <Palette
                              count={isPromoted ? paletteConfig.count : DEFAULT_PALETTE_CONFIG.count}
                              corner={isPromoted ? paletteConfig.corner : DEFAULT_PALETTE_CONFIG.corner}
                              morph={isPromoted ? paletteConfig.morph : DEFAULT_PALETTE_CONFIG.morph}
                              rollSignal={paletteRollCount}
                            />
                          )}
                          {product.id === "wake-slider" && (
                            <div className={isPromoted ? "w-[320px] sm:w-[380px]" : "w-[230px] sm:w-[250px]"}>
                              <WakeSlider
                                value={isPromoted ? wakeSliderConfig.value : gridWakeValue}
                                min={isPromoted ? wakeSliderConfig.min : DEFAULT_WAKE_SLIDER_CONFIG.min}
                                max={isPromoted ? wakeSliderConfig.max : DEFAULT_WAKE_SLIDER_CONFIG.max}
                                step={isPromoted ? wakeSliderConfig.step : DEFAULT_WAKE_SLIDER_CONFIG.step}
                                bars={isPromoted ? wakeSliderConfig.bars : 26}
                                wake={isPromoted ? wakeSliderConfig.wake : DEFAULT_WAKE_SLIDER_CONFIG.wake}
                                unit={isPromoted ? wakeSliderConfig.unit : DEFAULT_WAKE_SLIDER_CONFIG.unit}
                                showReading={
                                  isPromoted
                                    ? wakeSliderConfig.showReading
                                    : DEFAULT_WAKE_SLIDER_CONFIG.showReading
                                }
                                fullWidth
                                disabled={isPromoted ? wakeSliderConfig.disabled : false}
                                onChange={(value) => {
                                  if (isPromoted) {
                                    setWakeSliderConfig((prev) => ({ ...prev, value }));
                                  } else {
                                    setGridWakeValue(value);
                                  }
                                }}
                              />
                            </div>
                          )}
                          {product.id === "gradient" && (
                            <GradientTile
                              id={isPromoted ? "showcase-gradient-stage" : "showcase-gradient-grid"}
                              tile={resolveGradientTile(
                                isPromoted ? gradientConfig : DEFAULT_GRADIENT_TILE_CONFIG
                              )}
                              globals={{
                                ...DEFAULT_GLOBALS,
                                radius: isPromoted
                                  ? gradientConfig.radius
                                  : DEFAULT_GRADIENT_TILE_CONFIG.radius,
                              }}
                              size={isPromoted ? gradientConfig.size : 196}
                              animationKey={gradientAnimKey}
                            />
                          )}
                          {product.id === "download-button" && (
                            <DownloadButton
                              key={downloadResetKey}
                              sizeMB={
                                isPromoted
                                  ? downloadButtonConfig.sizeMB
                                  : DEFAULT_DOWNLOAD_BUTTON_CONFIG.sizeMB
                              }
                              durationMs={Math.round(
                                (isPromoted
                                  ? downloadButtonConfig.durationSec
                                  : DEFAULT_DOWNLOAD_BUTTON_CONFIG.durationSec) * 1000
                              )}
                              progressFormat={
                                isPromoted
                                  ? downloadButtonConfig.progressFormat
                                  : DEFAULT_DOWNLOAD_BUTTON_CONFIG.progressFormat
                              }
                              size={
                                isPromoted
                                  ? downloadButtonConfig.size
                                  : DEFAULT_DOWNLOAD_BUTTON_CONFIG.size
                              }
                              replaySignal={downloadReplaySignal}
                            />
                          )}
                        </div>
                      </div>

                      {/* Homepage footer controls */}
                      {!isPromoted && (
                        <>
                          <span className="pointer-events-none absolute bottom-[14px] left-[14px] sm:bottom-[18px] sm:left-[18px] z-20 h-10 md:h-9 flex items-center text-sm font-medium tracking-tight text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-200">
                            {product.title}
                          </span>

                          <div className="absolute bottom-[14px] right-[14px] sm:bottom-[18px] sm:right-[18px] z-20 flex items-center gap-1.5 opacity-100 pointer-events-auto md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto transition-opacity duration-200">
                            <button
                              type="button"
                              aria-label={`Play ${product.title}`}
                              title="Play"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerPlay(product.id);
                              }}
                              className="relative size-10 md:size-9 rounded-full glass-control flex items-center justify-center text-foreground cursor-pointer before:content-[''] before:absolute before:-inset-0.5 md:before:hidden"
                            >
                              <Play className="size-[18px] md:size-4" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Edit ${product.title}`}
                              title="Edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                openProduct(product.id);
                              }}
                              className="relative size-10 md:size-9 rounded-full glass-control flex items-center justify-center text-foreground cursor-pointer before:content-[''] before:absolute before:-inset-0.5 md:before:hidden"
                            >
                              <Settings2 className="size-[18px] md:size-4" />
                            </button>
                          </div>
                        </>
                      )}

                      {/* Expanded bottom-right Play & Share circle buttons */}
                      {isPromoted && stageTab !== "code" && (
                        <div
                          ref={(el) => {
                            expandedPlayRefs.current[product.id] = el;
                          }}
                          className="absolute bottom-[14px] right-[14px] sm:bottom-[18px] sm:right-[18px] z-20 flex items-center gap-1.5"
                        >
                          <button
                            type="button"
                            onClick={() => triggerPlay(product.id)}
                            aria-label={`Play ${product.title} animation`}
                            title="Play"
                            className="relative size-10 md:size-9 rounded-full glass-control flex items-center justify-center text-foreground cursor-pointer transition-transform active:scale-95 before:content-[''] before:absolute before:-inset-0.5 md:before:hidden"
                          >
                            <Play className="size-[18px] md:size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShare(product.title)}
                            aria-label={copiedShare ? "Link copied" : `Share ${product.title}`}
                            title={copiedShare ? "Copied" : "Share"}
                            className={cn(
                              "relative size-10 md:size-9 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 before:content-[''] before:absolute before:-inset-0.5 md:before:hidden",
                              copiedShare
                                ? "glass-chosen text-primary"
                                : "glass-control text-foreground"
                            )}
                          >
                            {copiedShare ? (
                              <Check className="size-[18px] md:size-4" />
                            ) : (
                              <Share01 className="size-[18px] md:size-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
                </div>
              ))}
            </div>
      </div>

      {/* Full-Screen Solid-Background Component Detail Overlay */}
      {activeProduct !== null && (
        <div
          ref={overlayRef}
          onPointerDown={(e) => {
            const target = e.target;
            pointerDownOnBackdropRef.current =
              target === overlayRef.current ||
              (target instanceof HTMLElement && target.dataset.showcaseBackdrop === "true");
          }}
          onClick={(e) => {
            const target = e.target;
            const isBackdrop =
              target === overlayRef.current ||
              (target instanceof HTMLElement && target.dataset.showcaseBackdrop === "true");
            if (isBackdrop && pointerDownOnBackdropRef.current && phase !== "closing") {
              pointerDownOnBackdropRef.current = false;
              onSelectProduct(null);
            }
          }}
          className={cn(
            "fixed inset-0 z-[60] overflow-y-auto",
            phase === "closing" && "pointer-events-none"
          )}
        >
          <div
            ref={backdropRef}
            className="fixed inset-0 bg-background pointer-events-none"
          />
          <div
            data-showcase-backdrop="true"
            className="relative z-10 min-h-full w-full flex flex-col justify-start"
          >
            {activeProduct === "bot-avatar" && (
              <BotAvatarDemo
                key={activeProduct}
                componentList={PRODUCTS.map(({ id, title }) => ({ id, title }))}
                activeComponentId={activeProduct}
                onSelectComponent={(id) => {
                  if (id === activeProduct) return;
                  openProduct(id as ProductId);
                }}
                onClose={() => onSelectProduct(null)}
                onOpenInStudio={
                  onOpenInStudio
                    ? () => onOpenInStudio("bot-avatar", botConfig)
                    : undefined
                }
                config={botConfig}
                onConfigChange={setBotConfig}
                stageSlotRef={targetSlotRef}
                isClosing={phase === "closing"}
                skipEntranceMotion={skipEntranceMotion}
              />
            )}
            {activeProduct === "color-picker" && (
              <ColorPickerDemo
                key={activeProduct}
                componentList={PRODUCTS.map(({ id, title }) => ({ id, title }))}
                activeComponentId={activeProduct}
                onSelectComponent={(id) => {
                  if (id === activeProduct) return;
                  openProduct(id as ProductId);
                }}
                onClose={() => onSelectProduct(null)}
                onOpenInStudio={
                  onOpenInStudio
                    ? () => onOpenInStudio("color-picker", colorPickerConfig)
                    : undefined
                }
                config={colorPickerConfig}
                onConfigChange={setColorPickerConfig}
                stageSlotRef={targetSlotRef}
                isClosing={phase === "closing"}
                skipEntranceMotion={skipEntranceMotion}
                onPlay={() => triggerPlay("color-picker")}
              />
            )}
            {activeProduct === "palette" && (
              <PaletteDemo
                key={activeProduct}
                componentList={PRODUCTS.map(({ id, title }) => ({ id, title }))}
                activeComponentId={activeProduct}
                onSelectComponent={(id) => {
                  if (id === activeProduct) return;
                  openProduct(id as ProductId);
                }}
                onClose={() => onSelectProduct(null)}
                onOpenInStudio={
                  onOpenInStudio
                    ? () => onOpenInStudio("palette", paletteConfig)
                    : undefined
                }
                config={paletteConfig}
                onConfigChange={setPaletteConfig}
                stageSlotRef={targetSlotRef}
                isClosing={phase === "closing"}
                skipEntranceMotion={skipEntranceMotion}
                onPlay={() => triggerPlay("palette")}
              />
            )}
            {activeProduct === "wake-slider" && (
              <WakeSliderDemo
                key={activeProduct}
                componentList={PRODUCTS.map(({ id, title }) => ({ id, title }))}
                activeComponentId={activeProduct}
                onSelectComponent={(id) => {
                  if (id === activeProduct) return;
                  openProduct(id as ProductId);
                }}
                onClose={() => onSelectProduct(null)}
                onOpenInStudio={
                  onOpenInStudio
                    ? () => onOpenInStudio("wake-slider", wakeSliderConfig)
                    : undefined
                }
                config={wakeSliderConfig}
                onConfigChange={setWakeSliderConfig}
                stageSlotRef={targetSlotRef}
                isClosing={phase === "closing"}
                skipEntranceMotion={skipEntranceMotion}
                onPlay={() => triggerPlay("wake-slider")}
              />
            )}
            {activeProduct === "gradient" && (
              <GradientTileDemo
                key={activeProduct}
                componentList={PRODUCTS.map(({ id, title }) => ({ id, title }))}
                activeComponentId={activeProduct}
                onSelectComponent={(id) => {
                  if (id === activeProduct) return;
                  openProduct(id as ProductId);
                }}
                onClose={() => onSelectProduct(null)}
                onOpenInStudio={
                  onOpenInStudio
                    ? () =>
                        onOpenInStudio("gradient", {
                          tile: resolveGradientTile(gradientConfig),
                          globals: {
                            ...DEFAULT_GLOBALS,
                            radius: gradientConfig.radius,
                            size: gradientConfig.size,
                          },
                        })
                    : undefined
                }
                config={gradientConfig}
                onConfigChange={setGradientConfig}
                stageSlotRef={targetSlotRef}
                isClosing={phase === "closing"}
                skipEntranceMotion={skipEntranceMotion}
                onPlay={() => triggerPlay("gradient")}
              />
            )}
            {activeProduct === "download-button" && (
              <DownloadButtonDemo
                key={activeProduct}
                componentList={PRODUCTS.map(({ id, title }) => ({ id, title }))}
                activeComponentId={activeProduct}
                onSelectComponent={(id) => {
                  if (id === activeProduct) return;
                  openProduct(id as ProductId);
                }}
                onClose={() => onSelectProduct(null)}
                onOpenInStudio={
                  onOpenInStudio
                    ? () => onOpenInStudio("download-button", downloadButtonConfig)
                    : undefined
                }
                config={downloadButtonConfig}
                onConfigChange={setDownloadButtonConfig}
                stageSlotRef={targetSlotRef}
                isClosing={phase === "closing"}
                skipEntranceMotion={skipEntranceMotion}
                onPlay={() => triggerPlay("download-button")}
                onReset={() => setDownloadResetKey((k) => k + 1)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
