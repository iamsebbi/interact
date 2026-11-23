import { type BundledLanguage, codeToHtml } from "shiki";

export type CodeLanguage = "tsx" | "ts" | "css" | "bash" | "json" | "markdown";

export async function highlightCode(
  code: string,
  lang: CodeLanguage = "tsx",
): Promise<string> {
  return codeToHtml(code, {
    lang: lang as BundledLanguage,
    themes: {
      light: "github-light-default",
      dark: "github-dark-default",
    },
    defaultColor: false,
  });
}
