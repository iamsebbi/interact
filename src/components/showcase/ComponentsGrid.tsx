"use client";

import { useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  type ComponentType,
  type MouseEvent,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/controls";
import { Bookmark, SlidersHorizontal } from "@/components/icons";
import {
  CategoryFilter,
  type CategoryFilterValue,
} from "@/components/showcase/CategoryFilter";
import {
  ClientCodeTabs,
  preloadComponentCode,
} from "@/components/showcase/ClientCodeTabs";
import {
  ComponentDetailView,
  type ComponentNavItem,
} from "@/components/showcase/ComponentDetailView";
import { PropsTable } from "@/components/showcase/PropsTable";
import { registerShowcaseGrid } from "@/lib/showcase-grid-presence";
import { cn } from "@/lib/utils";
import {
  CATALOG_META,
  type ComponentMeta,
  type ComponentPreviewProps,
  getComponentMetaBySlug,
  getComponentsMetaByCategory,
} from "@/registry";
import { getComponentClient, preloadComponentClient } from "@/registry/client";

const SAVED_STORAGE_KEY = "interact:saved-products";
const HOVER_INTENT_MS = 200;
const OPEN_MORPH_MS = 380;
const CLOSE_UNMOUNT_MS = 340;
const CLOSE_FADE_UNMOUNT_MS = 280;
const CLOSE_REVEAL_SOURCE_MS = 190;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface RectBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface OverlaySession {
  slug: string;
  initialOn: boolean;
  needsOpenFlip: boolean;
  sourceRect: RectBox | null;
}

function toRectBox(rect: DOMRect): RectBox {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function loadSavedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface SafePreviewFrameProps {
  Preview: ComponentType<ComponentPreviewProps> | null;
  replaySignal: number;
  previewActive: boolean;
  preferredScale: number;
  bounds?: { width: number; height: number };
}

function SafePreviewFrame({
  Preview,
  replaySignal,
  previewActive,
  preferredScale,
  bounds,
}: SafePreviewFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const freezeHostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(preferredScale);

  const shouldFreeze = !previewActive && replaySignal > 0;

  useEffect(() => {
    const host = freezeHostRef.current;
    if (!host || typeof host.getAnimations !== "function") return;
    for (const anim of host.getAnimations({ subtree: true })) {
      if (shouldFreeze) {
        anim.pause();
      } else if (anim.playState === "paused") {
        anim.play();
      }
    }
  }, [shouldFreeze]);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el || !bounds) {
      setScale(preferredScale);
      return;
    }

    const updateScale = () => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth <= 0 || clientHeight <= 0) return;
      // Leave margin inside the safe stage so ambient elevation shadows never clip against card controls.
      const availableWidth = Math.max(clientWidth - 28, clientWidth * 0.86);
      const availableHeight = Math.max(clientHeight - 28, clientHeight * 0.86);
      const next = Math.min(
        preferredScale,
        availableWidth / bounds.width,
        availableHeight / bounds.height,
      );
      const clamped = Math.max(0.35, Math.round(next * 1000) / 1000);
      setScale((prev) => (prev === clamped ? prev : clamped));
    };

    updateScale();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [preferredScale, bounds]);

  return (
    <div
      ref={frameRef}
      className="pointer-events-none absolute inset-x-4 top-[56px] bottom-[56px] z-10 flex items-center justify-center sm:inset-x-5 sm:top-[60px] sm:bottom-[60px]"
    >
      {Preview && (
        <div
          ref={freezeHostRef}
          data-preview-frozen={shouldFreeze ? "true" : undefined}
          className="inline-flex shrink-0 items-center justify-center"
          style={{ transform: `scale(${scale})` }}
        >
          <Preview replaySignal={replaySignal} previewActive={previewActive} />
        </div>
      )}
    </div>
  );
}

interface GridCardProps {
  entry: ComponentMeta<Record<string, unknown>>;
  isSaved: boolean;
  replaySignal: number;
  previewActive: boolean;
  registerCardRef: (slug: string, el: HTMLElement | null) => void;
  onWarm: (slug: string) => void;
  onHoverEnter: (slug: string, pointerType: string) => void;
  onHoverLeave: (slug: string) => void;
  onOpen: (slug: string, e: MouseEvent<HTMLElement>) => void;
  onToggleSaved: (slug: string) => void;
}

const GridCard = memo(function GridCard({
  entry,
  isSaved,
  replaySignal,
  previewActive,
  registerCardRef,
  onWarm,
  onHoverEnter,
  onHoverLeave,
  onOpen,
  onToggleSaved,
}: GridCardProps) {
  const { slug, title } = entry;
  const Preview = getComponentClient(slug)?.Preview ?? null;

  return (
    <article
      ref={(el) => registerCardRef(slug, el)}
      onPointerEnter={(e) => onHoverEnter(slug, e.pointerType)}
      onPointerLeave={() => onHoverLeave(slug)}
      onPointerDown={() => onWarm(slug)}
      onFocus={() => onWarm(slug)}
      className="surface-panel group relative flex aspect-square w-full flex-col justify-between overflow-hidden rounded-[28px] p-[14px] transition-colors sm:p-[18px]"
    >
      <Link
        href={`/components/${slug}`}
        onClick={(e) => onOpen(slug, e)}
        aria-label={`Open ${title}`}
        className="absolute inset-0 z-0 rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      />

      <SafePreviewFrame
        Preview={Preview}
        replaySignal={replaySignal}
        previewActive={previewActive}
        preferredScale={entry.gridScale ?? 1}
        bounds={entry.previewBounds}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end pb-[14px] pr-[106px] pl-[14px] opacity-100 transition-all duration-200 sm:pb-[18px] sm:pr-[110px] sm:pl-[18px] md:translate-y-1 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
        <span className="control-chip inline-flex h-10 max-w-full items-center truncate rounded-pill px-3.5 text-xs font-medium tracking-tight text-foreground sm:text-[13px] md:h-9">
          {title}
        </span>
      </div>

      <div className="pointer-events-auto absolute right-[14px] bottom-[14px] z-20 flex items-center gap-1.5 opacity-100 transition-opacity duration-200 sm:right-[18px] sm:bottom-[18px] md:pointer-events-none md:opacity-0 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100 md:group-hover:pointer-events-auto md:group-hover:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100">
        <Button
          variant={isSaved ? "elevated" : "chip"}
          size="icon"
          aria-label={isSaved ? `Unsave ${title}` : `Save ${title}`}
          aria-pressed={isSaved}
          title={isSaved ? "Saved" : "Save"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSaved(slug);
          }}
          className={cn(
            "size-10 md:size-9",
            isSaved
              ? "text-pro-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Bookmark size={16} aria-hidden="true" />
        </Button>
        <Button
          variant="chip"
          size="icon"
          aria-label={`Edit ${title}`}
          title="Edit"
          render={
            <Link
              href={`/components/${slug}`}
              onClick={(e) => onOpen(slug, e)}
            />
          }
          className="size-10 md:size-9"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
});

export function ComponentsGrid() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilterValue>("All");
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [replayCounts, setReplayCounts] = useState<Record<string, number>>({});
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [session, setSession] = useState<OverlaySession | null>(null);

  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const hiddenCardRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const stageWrapperRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const pointerDownInEmptyRef = useRef(false);
  const isClosingRef = useRef(false);
  const suppressHoverPlayUntilRef = useRef(0);
  const hoverTimersRef = useRef<Map<string, number>>(new Map());
  const sessionRef = useRef<OverlaySession | null>(null);
  sessionRef.current = session;

  const rafRef = useRef<number | null>(null);
  const openCleanupTimerRef = useRef<number | null>(null);
  const revealSourceTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearAnimationTimers = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (openCleanupTimerRef.current !== null) {
      window.clearTimeout(openCleanupTimerRef.current);
      openCleanupTimerRef.current = null;
    }
    if (revealSourceTimerRef.current !== null) {
      window.clearTimeout(revealSourceTimerRef.current);
      revealSourceTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const clearHoverTimers = useCallback(() => {
    for (const timer of hoverTimersRef.current.values()) {
      window.clearTimeout(timer);
    }
    hoverTimersRef.current.clear();
  }, []);

  const restoreHiddenCard = useCallback(() => {
    const prev = hiddenCardRef.current;
    if (prev) {
      prev.style.opacity = "";
      prev.style.pointerEvents = "";
      hiddenCardRef.current = null;
    }
  }, []);

  const hideSourceCard = useCallback(
    (slug: string) => {
      restoreHiddenCard();
      const cardEl = cardRefs.current.get(slug);
      if (cardEl) {
        cardEl.style.opacity = "0";
        cardEl.style.pointerEvents = "none";
        hiddenCardRef.current = cardEl;
      }
    },
    [restoreHiddenCard],
  );

  const registerCardRef = useCallback(
    (slug: string, el: HTMLElement | null) => {
      if (el) {
        cardRefs.current.set(slug, el);
      } else {
        cardRefs.current.delete(slug);
      }
    },
    [],
  );

  useIsomorphicLayoutEffect(() => {
    return registerShowcaseGrid();
  }, []);

  useEffect(() => {
    setSavedSlugs(loadSavedSlugs());
    return () => {
      clearAnimationTimers();
      clearHoverTimers();
      restoreHiddenCard();
    };
  }, [clearAnimationTimers, clearHoverTimers, restoreHiddenCard]);

  const toggleSaved = useCallback((slug: string) => {
    setSavedSlugs((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug];
      try {
        window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors in restricted contexts
      }
      return next;
    });
  }, []);

  const warmSlug = useCallback((slug: string) => {
    preloadComponentClient(slug);
    preloadComponentCode(slug);
  }, []);

  const handleCardHoverEnter = useCallback(
    (slug: string, pointerType: string) => {
      warmSlug(slug);
      if (
        pointerType === "touch" ||
        shouldReduceMotion ||
        sessionRef.current !== null ||
        performance.now() < suppressHoverPlayUntilRef.current
      ) {
        return;
      }
      const existing = hoverTimersRef.current.get(slug);
      if (existing !== undefined) {
        window.clearTimeout(existing);
      }
      const timer = window.setTimeout(() => {
        hoverTimersRef.current.delete(slug);
        if (
          sessionRef.current !== null ||
          performance.now() < suppressHoverPlayUntilRef.current
        ) {
          return;
        }
        setActiveSlug(slug);
        setReplayCounts((prev) => ({
          ...prev,
          [slug]: (prev[slug] ?? 0) + 1,
        }));
      }, HOVER_INTENT_MS);
      hoverTimersRef.current.set(slug, timer);
    },
    [shouldReduceMotion, warmSlug],
  );

  const handleCardHoverLeave = useCallback((slug: string) => {
    const existing = hoverTimersRef.current.get(slug);
    if (existing !== undefined) {
      window.clearTimeout(existing);
      hoverTimersRef.current.delete(slug);
    }
    setActiveSlug((prev) => (prev === slug ? null : prev));
  }, []);

  const isEmptyOverlayTarget = useCallback((target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    if (!window.matchMedia("(min-width: 1024px)").matches) return false;
    if (overlayRef.current?.querySelector('[aria-expanded="true"]')) {
      return false;
    }
    return !target.closest("[data-overlay-surface]");
  }, []);

  const openPreview = useCallback(
    (slug: string, pushUrl: boolean) => {
      clearAnimationTimers();
      clearHoverTimers();
      setActiveSlug(null);
      setReplayCounts((prev) => (prev[slug] ? { ...prev, [slug]: 0 } : prev));
      isClosingRef.current = false;
      warmSlug(slug);

      const cardEl = cardRefs.current.get(slug);
      const sourceRect = cardEl
        ? toRectBox(cardEl.getBoundingClientRect())
        : null;

      if (pushUrl && typeof window !== "undefined") {
        window.history.pushState(
          { interactPreviewSlug: slug },
          "",
          `/components/${slug}`,
        );
      }

      if (shouldReduceMotion || !sourceRect || sourceRect.width <= 0) {
        hideSourceCard(slug);
        setSession({
          slug,
          initialOn: true,
          needsOpenFlip: false,
          sourceRect: null,
        });
        return;
      }

      hideSourceCard(slug);
      setSession({
        slug,
        initialOn: false,
        needsOpenFlip: true,
        sourceRect,
      });
    },
    [
      clearAnimationTimers,
      clearHoverTimers,
      hideSourceCard,
      shouldReduceMotion,
      warmSlug,
    ],
  );

  const closePreview = useCallback(
    (fromPopstate = false) => {
      const current = sessionRef.current;
      if (!current || isClosingRef.current) return;

      isClosingRef.current = true;
      clearAnimationTimers();
      setActiveSlug(null);
      setReplayCounts((prev) =>
        prev[current.slug] ? { ...prev, [current.slug]: 0 } : prev,
      );

      if (!fromPopstate && typeof window !== "undefined") {
        window.history.replaceState(null, "", "/");
      }

      if (shouldReduceMotion) {
        suppressHoverPlayUntilRef.current = performance.now() + 300;
        isClosingRef.current = false;
        restoreHiddenCard();
        setSession(null);
        return;
      }

      const overlayEl = overlayRef.current;
      const stageEl = stageRef.current;
      const wrapperEl = stageWrapperRef.current;
      const wrapperRect = wrapperEl
        ? toRectBox(wrapperEl.getBoundingClientRect())
        : null;
      const targetCard = cardRefs.current.get(current.slug);
      const cardRect = targetCard
        ? toRectBox(targetCard.getBoundingClientRect())
        : null;

      const canFlipBack =
        overlayEl !== null &&
        stageEl !== null &&
        wrapperRect !== null &&
        wrapperRect.width > 0 &&
        wrapperRect.height > 0 &&
        wrapperRect.top + wrapperRect.height > 0 &&
        wrapperRect.top < window.innerHeight &&
        cardRect !== null &&
        cardRect.width > 0 &&
        cardRect.height > 0 &&
        cardRect.top + cardRect.height > -40 &&
        cardRect.top < window.innerHeight + 40;

      if (canFlipBack) {
        const dx = cardRect.left - wrapperRect.left;
        const dy = cardRect.top - wrapperRect.top;
        const sx = cardRect.width / wrapperRect.width;
        const sy = cardRect.height / wrapperRect.height;

        stageEl.style.willChange = "transform";
        overlayEl.dataset.flipClose = "true";
        overlayEl.dataset.closing = "true";
        overlayEl.dataset.on = "false";

        rafRef.current = window.requestAnimationFrame(() => {
          rafRef.current = null;
          stageEl.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`;
        });

        revealSourceTimerRef.current = window.setTimeout(() => {
          revealSourceTimerRef.current = null;
          suppressHoverPlayUntilRef.current = performance.now() + 300;
          restoreHiddenCard();
        }, CLOSE_REVEAL_SOURCE_MS);

        closeTimerRef.current = window.setTimeout(() => {
          closeTimerRef.current = null;
          stageEl.style.transform = "";
          stageEl.style.willChange = "";
          suppressHoverPlayUntilRef.current = performance.now() + 300;
          isClosingRef.current = false;
          restoreHiddenCard();
          setSession(null);
        }, CLOSE_UNMOUNT_MS);
        return;
      }

      suppressHoverPlayUntilRef.current = performance.now() + 300;
      restoreHiddenCard();
      if (overlayEl) {
        delete overlayEl.dataset.flipClose;
        overlayEl.dataset.closing = "true";
        overlayEl.dataset.on = "false";
      }

      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        isClosingRef.current = false;
        setSession(null);
      }, CLOSE_FADE_UNMOUNT_MS);
    },
    [clearAnimationTimers, restoreHiddenCard, shouldReduceMotion],
  );

  const handleOpenPreview = useCallback(
    (slug: string, e: MouseEvent<HTMLElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      openPreview(slug, true);
    },
    [openPreview],
  );

  const handleSelectSlug = useCallback(
    (nextSlug: string) => {
      clearAnimationTimers();
      isClosingRef.current = false;
      if (stageRef.current) {
        stageRef.current.style.transition = "";
        stageRef.current.style.transform = "";
        stageRef.current.style.willChange = "";
      }
      hideSourceCard(nextSlug);
      warmSlug(nextSlug);
      window.history.pushState(
        { interactPreviewSlug: nextSlug },
        "",
        `/components/${nextSlug}`,
      );
      overlayRef.current?.scrollTo?.({ top: 0 });
      setSession({
        slug: nextSlug,
        initialOn: true,
        needsOpenFlip: false,
        sourceRect: null,
      });
    },
    [clearAnimationTimers, hideSourceCard, warmSlug],
  );

  const overlayPresent = session !== null;

  useIsomorphicLayoutEffect(() => {
    if (!overlayPresent) return;

    const root = document.documentElement;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const prevHtmlOverflow = root.style.overflow;
    const prevHtmlGutter = root.style.scrollbarGutter;
    const prevBodyPaddingRight = document.body.style.paddingRight;

    root.style.overflow = "hidden";
    root.style.scrollbarGutter = "auto";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      root.style.overflow = prevHtmlOverflow;
      root.style.scrollbarGutter = prevHtmlGutter;
      document.body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [overlayPresent]);

  useIsomorphicLayoutEffect(() => {
    if (!session?.needsOpenFlip) return;

    const overlayEl = overlayRef.current;
    const stageEl = stageRef.current;
    const wrapperEl = stageWrapperRef.current;
    const sourceRect = session.sourceRect;

    if (!overlayEl || !stageEl || !wrapperEl || !sourceRect) {
      if (overlayEl) overlayEl.dataset.on = "true";
      return;
    }

    const wrapperRect = toRectBox(wrapperEl.getBoundingClientRect());
    if (wrapperRect.width <= 0 || wrapperRect.height <= 0) {
      overlayEl.dataset.on = "true";
      return;
    }

    const dx = sourceRect.left - wrapperRect.left;
    const dy = sourceRect.top - wrapperRect.top;
    const sx = sourceRect.width / wrapperRect.width;
    const sy = sourceRect.height / wrapperRect.height;

    stageEl.style.transition = "none";
    stageEl.style.willChange = "transform";
    stageEl.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`;
    void stageEl.offsetWidth;
    stageEl.style.transition = "";

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      stageEl.style.transform = "translate3d(0px, 0px, 0) scale(1, 1)";
      overlayEl.dataset.on = "true";
    });

    openCleanupTimerRef.current = window.setTimeout(() => {
      openCleanupTimerRef.current = null;
      stageEl.style.transform = "";
      stageEl.style.willChange = "";
    }, OPEN_MORPH_MS + 30);
  }, [session]);

  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(
        /^\/components\/([^/]+)\/?$/,
      );
      if (match) {
        const nextSlug = decodeURIComponent(match[1]);
        if (getComponentMetaBySlug(nextSlug)) {
          openPreview(nextSlug, false);
          return;
        }
      }
      closePreview(true);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [closePreview, openPreview]);

  useEffect(() => {
    if (!overlayPresent) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) {
        closePreview(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overlayPresent, closePreview]);

  const items = useMemo(
    () => getComponentsMetaByCategory(activeCategory),
    [activeCategory],
  );

  const componentList = useMemo<ComponentNavItem[]>(
    () => CATALOG_META.map((item) => ({ slug: item.slug, title: item.title })),
    [],
  );

  const activeMeta = useMemo(
    () => (session ? getComponentMetaBySlug(session.slug) : undefined),
    [session],
  );

  return (
    <section
      id="products-grid"
      aria-label="Component showcase"
      className="mx-auto flex w-full max-w-[1240px] scroll-mt-20 flex-col gap-4 px-4 sm:px-6"
    >
      <CategoryFilter
        value={activeCategory}
        onValueChange={setActiveCategory}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((entry) => (
          <GridCard
            key={entry.slug}
            entry={entry}
            isSaved={savedSlugs.includes(entry.slug)}
            replaySignal={replayCounts[entry.slug] ?? 0}
            previewActive={activeSlug === entry.slug}
            registerCardRef={registerCardRef}
            onWarm={warmSlug}
            onHoverEnter={handleCardHoverEnter}
            onHoverLeave={handleCardHoverLeave}
            onOpen={handleOpenPreview}
            onToggleSaved={toggleSaved}
          />
        ))}
      </div>

      {session && activeMeta && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeMeta.title} preview`}
          data-on={session.initialOn ? "true" : "false"}
          onPointerDown={(e) => {
            pointerDownInEmptyRef.current =
              e.button === 0 && isEmptyOverlayTarget(e.target);
          }}
          onClick={(e) => {
            const startedInEmpty = pointerDownInEmptyRef.current;
            pointerDownInEmptyRef.current = false;
            if (startedInEmpty && isEmptyOverlayTarget(e.target)) {
              closePreview(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" && !e.defaultPrevented) {
              e.stopPropagation();
              closePreview(false);
            }
          }}
          className="dtl-overlay no-scrollbar fixed inset-0 z-[45] overflow-y-auto overscroll-contain"
        >
          <div
            aria-hidden="true"
            className="dtl-scrim pointer-events-none fixed inset-0 bg-background"
          />

          <div className="relative z-10 min-h-full">
            <ComponentDetailView
              key={activeMeta.slug}
              meta={activeMeta}
              componentList={componentList}
              codeSlot={<ClientCodeTabs slug={activeMeta.slug} />}
              propsSlot={<PropsTable props={activeMeta.props} />}
              stageWrapperRef={stageWrapperRef}
              stageRef={stageRef}
              onClose={() => closePreview(false)}
              onSelectSlug={handleSelectSlug}
            />
          </div>
        </div>
      )}
    </section>
  );
}
