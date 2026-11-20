import React, { useEffect, useState } from "react";
import type { HighlighterCore } from "shiki/core";
import { cn } from "@/lib/utils";

export type CodeLanguage = "tsx" | "bash" | "json" | "css" | "markdown" | "text";

let highlighterPromise: Promise<HighlighterCore> | null = null;

async function getShikiHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [
        { createHighlighterCore },
        { createJavaScriptRegexEngine },
        githubDark,
        githubLight,
        langTsx,
        langBash,
        langJson,
        langCss,
        langMarkdown,
      ] = await Promise.all([
        import("shiki/core"),
        import("shiki/engine/javascript"),
        import("shiki/themes/github-dark.mjs"),
        import("shiki/themes/github-light.mjs"),
        import("shiki/langs/tsx.mjs"),
        import("shiki/langs/bash.mjs"),
        import("shiki/langs/json.mjs"),
        import("shiki/langs/css.mjs"),
        import("shiki/langs/markdown.mjs"),
      ]);

      return createHighlighterCore({
        themes: [githubDark.default, githubLight.default],
        langs: [
          langTsx.default,
          langBash.default,
          langJson.default,
          langCss.default,
          langMarkdown.default,
        ],
        engine: createJavaScriptRegexEngine(),
      });
    })();
  }

  return highlighterPromise;
}

function useIsDarkTheme(): boolean {
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export interface CodeBlockProps {
  code: string;
  lang?: CodeLanguage;
  className?: string;
  wrap?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  lang = "tsx",
  className,
  wrap = false,
}) => {
  const isDark = useIsDarkTheme();
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (lang === "text") {
      setHtml(null);
      return;
    }

    let cancelled = false;
    getShikiHighlighter()
      .then((highlighter) => {
        if (cancelled) return;
        const rendered = highlighter.codeToHtml(code, {
          lang,
          theme: isDark ? "github-dark" : "github-light",
        });
        setHtml(rendered);
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });

    return () => {
      cancelled = true;
    };
  }, [code, lang, isDark]);

  const wrapClass = wrap
    ? "[&_pre]:whitespace-pre-wrap [&_pre]:break-words whitespace-pre-wrap break-words"
    : "[&_pre]:whitespace-pre whitespace-pre";

  if (html) {
    return (
      <div
        className={cn(
          "font-mono text-xs leading-relaxed select-text [&_pre]:!bg-transparent [&_pre]:m-0 [&_pre]:p-0 [&_pre]:font-mono [&_code]:font-mono",
          wrapClass,
          className
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <pre
      className={cn(
        "m-0 font-mono text-xs text-muted-foreground leading-relaxed select-text",
        wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
        className
      )}
    >
      <code>{code}</code>
    </pre>
  );
};

export default CodeBlock;
