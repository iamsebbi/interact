import React, { useEffect, useMemo, useRef, useState } from "react";
import type { HighlighterCore, LanguageRegistration, ThemeRegistration } from "shiki/core";
import { cn } from "@/lib/utils";

export type CodeLanguage =
  | "tsx"
  | "ts"
  | "bash"
  | "json"
  | "css"
  | "markdown"
  | "text";

type ShikiLang = Exclude<CodeLanguage, "text" | "ts"> | "typescript";
type ShikiTheme = "github-dark" | "github-light";

const MAX_CACHE_ENTRIES = 60;
const highlightedHtmlCache = new Map<string, string>();

let highlighterPromise: Promise<HighlighterCore> | null = null;
const themeLoadPromises = new Map<ShikiTheme, Promise<void>>();
const langLoadPromises = new Map<ShikiLang, Promise<void>>();

const THEME_IMPORTERS: Record<ShikiTheme, () => Promise<{ default: ThemeRegistration }>> = {
  "github-dark": () => import("shiki/themes/github-dark.mjs"),
  "github-light": () => import("shiki/themes/github-light.mjs"),
};

const LANG_IMPORTERS: Record<ShikiLang, () => Promise<{ default: LanguageRegistration | LanguageRegistration[] }>> = {
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  bash: () => import("shiki/langs/bash.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
};

function toShikiLang(lang: Exclude<CodeLanguage, "text">): ShikiLang {
  return lang === "ts" ? "typescript" : lang;
}

function getCacheKey(code: string, lang: CodeLanguage, isDark: boolean): string {
  return `${isDark ? "d" : "l"}:${lang}:${code}`;
}

function setBoundedCache(key: string, value: string) {
  if (highlightedHtmlCache.has(key)) {
    highlightedHtmlCache.delete(key);
  } else if (highlightedHtmlCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = highlightedHtmlCache.keys().next().value;
    if (oldestKey !== undefined) highlightedHtmlCache.delete(oldestKey);
  }
  highlightedHtmlCache.set(key, value);
}

export function getCachedHighlightedHtml(
  code: string,
  lang: CodeLanguage,
  isDark: boolean
): string | null {
  if (lang === "text") return null;
  return highlightedHtmlCache.get(getCacheKey(code, lang, isDark)) ?? null;
}

async function getShikiHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
        await Promise.all([
          import("shiki/core"),
          import("shiki/engine/javascript"),
        ]);

      return createHighlighterCore({
        themes: [],
        langs: [],
        engine: createJavaScriptRegexEngine(),
      });
    })();
  }

  return highlighterPromise;
}

async function ensureThemeAndLang(
  highlighter: HighlighterCore,
  theme: ShikiTheme,
  lang: ShikiLang
): Promise<void> {
  if (!themeLoadPromises.has(theme)) {
    themeLoadPromises.set(
      theme,
      THEME_IMPORTERS[theme]().then((mod) => highlighter.loadTheme(mod.default))
    );
  }
  if (!langLoadPromises.has(lang)) {
    langLoadPromises.set(
      lang,
      LANG_IMPORTERS[lang]().then((mod) => highlighter.loadLanguage(mod.default))
    );
  }
  await Promise.all([themeLoadPromises.get(theme)!, langLoadPromises.get(lang)!]);
}

export async function highlightCode(
  code: string,
  lang: CodeLanguage,
  isDark: boolean
): Promise<string | null> {
  if (lang === "text") return null;
  const cached = getCachedHighlightedHtml(code, lang, isDark);
  if (cached) return cached;

  const theme: ShikiTheme = isDark ? "github-dark" : "github-light";
  const shikiLang = toShikiLang(lang);
  const highlighter = await getShikiHighlighter();
  await ensureThemeAndLang(highlighter, theme, shikiLang);
  const rendered = highlighter.codeToHtml(code, {
    lang: shikiLang,
    theme,
  });
  setBoundedCache(getCacheKey(code, lang, isDark), rendered);
  return rendered;
}

function resolveContainerIsDark(el: HTMLElement | null): boolean {
  if (typeof document === "undefined") return true;
  const themedAncestor = el?.closest(".dark, .light");
  if (themedAncestor) {
    return themedAncestor.classList.contains("dark");
  }
  return document.documentElement.classList.contains("dark");
}

function useIsDarkTheme(containerRef: React.RefObject<HTMLDivElement | null>): boolean {
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const themedAncestor = containerRef.current?.closest(".dark, .light");
    const update = () => setIsDark(resolveContainerIsDark(containerRef.current));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    if (themedAncestor && themedAncestor !== root) {
      observer.observe(themedAncestor, { attributes: true, attributeFilter: ["class"] });
    }
    return () => observer.disconnect();
  }, [containerRef]);

  return isDark;
}

export interface CodeBlockProps {
  code: string;
  lang?: CodeLanguage;
  className?: string;
  wrap?: boolean;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  lang = "tsx",
  className,
  wrap = false,
  showLineNumbers = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDark = useIsDarkTheme(containerRef);

  const normalizedCode = useMemo(
    () => (showLineNumbers ? code.replace(/\r?\n$/, "") : code),
    [code, showLineNumbers]
  );

  const cacheKey = useMemo(
    () => getCacheKey(normalizedCode, lang, isDark),
    [normalizedCode, lang, isDark]
  );

  const [renderedEntry, setRenderedEntry] = useState<{
    key: string;
    value: string;
  } | null>(() => {
    const cached = getCachedHighlightedHtml(normalizedCode, lang, isDark);
    return cached ? { key: cacheKey, value: cached } : null;
  });

  const cachedHtml = useMemo(
    () => getCachedHighlightedHtml(normalizedCode, lang, isDark),
    [normalizedCode, lang, isDark]
  );

  const html =
    renderedEntry?.key === cacheKey ? renderedEntry.value : cachedHtml;

  useEffect(() => {
    if (lang === "text" || cachedHtml) {
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let timerId = 0;

    const run = () => {
      highlightCode(normalizedCode, lang, isDark)
        .then((rendered) => {
          if (!cancelled && rendered) {
            setRenderedEntry({ key: cacheKey, value: rendered });
          }
        })
        .catch(() => {});
    };

    if (normalizedCode.length > 4000 && typeof window !== "undefined") {
      // Yield a paint frame so tab/pill transitions stay smooth on large files
      rafId = window.requestAnimationFrame(() => {
        timerId = window.setTimeout(run, 0);
      });
    } else {
      run();
    }

    return () => {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, [normalizedCode, lang, isDark, cacheKey, cachedHtml]);

  const wrapClass = wrap
    ? "[&_pre]:whitespace-pre-wrap [&_pre]:break-words whitespace-pre-wrap break-words"
    : "[&_pre]:whitespace-pre whitespace-pre";

  if (html) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "font-mono text-xs leading-relaxed select-text [&_pre]:!bg-transparent [&_pre]:m-0 [&_pre]:p-0 [&_pre]:outline-none [&_pre]:font-mono [&_code]:font-mono",
          showLineNumbers && "code-line-numbers",
          wrapClass,
          className
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div ref={containerRef}>
      <pre
        className={cn(
          "m-0 font-mono text-xs text-muted-foreground leading-relaxed select-text outline-none",
          showLineNumbers && "code-line-numbers",
          wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
          className
        )}
      >
        <code>
          {showLineNumbers
            ? normalizedCode.split("\n").map((line, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className="line">{line}</span>
                  {idx < arr.length - 1 ? "\n" : null}
                </React.Fragment>
              ))
            : normalizedCode}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
