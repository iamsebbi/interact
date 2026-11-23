import type { HighlightedCodeAccordionData } from "@/components/showcase/CodeTabsClient";
import { readRegistrySourceFiles } from "@/lib/registry-source";
import { type CodeLanguage, highlightCode } from "@/lib/shiki";
import {
  type ComponentHowItWorksStep,
  type ComponentPropDoc,
  getComponentMetaBySlug,
  getRegistryCliCommand,
} from "@/registry";
import { getComponentGenerators } from "@/registry/generators";

export interface RawSourceFileTab {
  path: string;
  name: string;
  code: string;
  lang: CodeLanguage;
}

export interface BuildHighlightedCodeInput {
  slug: string;
  cliCommand?: string;
  dependencies?: readonly string[];
  usageCode: string;
  sourceFiles?: readonly RawSourceFileTab[];
  propsDocs?: readonly ComponentPropDoc[];
  howItWorks?: readonly ComponentHowItWorksStep[];
  overview?: string;
}

function wrapTextLines(text: string, maxWidth = 66): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxWidth) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function getPropsInterfaceName(slug: string): string {
  if (slug === "gradient") return "GradientTileProps";
  const pascal = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return `${pascal}Props`;
}

function formatPropsCode(
  propsDocs: readonly ComponentPropDoc[],
  slug: string,
): string {
  const interfaceName = getPropsInterfaceName(slug);
  const lines: string[] = [`export interface ${interfaceName} {`];

  propsDocs.forEach((prop, index) => {
    if (index > 0) lines.push("");

    const descLines = wrapTextLines(prop.description, 60);
    if (descLines.length === 1) {
      lines.push(`  /** ${descLines[0]} */`);
    } else {
      lines.push("  /**");
      for (const descLine of descLines) {
        lines.push(`   * ${descLine}`);
      }
      lines.push("   */");
    }

    const opt = prop.required ? "" : "?";
    const defaultComment =
      prop.defaultValue && prop.defaultValue !== "undefined"
        ? ` // default: ${prop.defaultValue}`
        : "";
    const singleLine = `  ${prop.name}${opt}: ${prop.type};${defaultComment}`;
    if (singleLine.length > 68 && prop.type.includes(" | ")) {
      const unionParts = prop.type.split(/\s*\|\s*/);
      lines.push(`  ${prop.name}${opt}:`);
      unionParts.forEach((part, partIdx) => {
        const isLast = partIdx === unionParts.length - 1;
        lines.push(`    | ${part}${isLast ? `;${defaultComment}` : ""}`);
      });
    } else {
      lines.push(singleLine);
    }
  });

  lines.push("}");
  return lines.join("\n");
}

function formatHowItWorksCode(
  steps: readonly ComponentHowItWorksStep[],
  overview?: string,
): string {
  const lines: string[] = [];
  if (overview) {
    lines.push(...wrapTextLines(overview));
  }
  for (const step of steps) {
    if (lines.length > 0) lines.push("");
    lines.push(`## ${step.title}`, ...wrapTextLines(step.description));
  }
  return lines.join("\n");
}

export async function buildHighlightedCodeData({
  slug,
  cliCommand,
  dependencies,
  usageCode,
  sourceFiles = [],
  propsDocs = [],
  howItWorks = [],
  overview,
}: BuildHighlightedCodeInput): Promise<HighlightedCodeAccordionData> {
  const npmDeps = (dependencies ?? []).filter((dep) => dep !== "react");
  const installRaw =
    cliCommand || (npmDeps.length > 0 ? `pnpm add ${npmDeps.join(" ")}` : "");

  const propsRaw = propsDocs.length > 0 ? formatPropsCode(propsDocs, slug) : "";
  const howItWorksRaw =
    howItWorks.length > 0 ? formatHowItWorksCode(howItWorks, overview) : "";

  const [installHtml, usageHtml, highlightedFiles, propsHtml, howItWorksHtml] =
    await Promise.all([
      installRaw ? highlightCode(installRaw, "bash") : Promise.resolve(""),
      highlightCode(usageCode, "tsx"),
      Promise.all(
        sourceFiles.map(async (file) => ({
          path: file.path,
          name: file.name,
          raw: file.code,
          html: await highlightCode(file.code, file.lang),
        })),
      ),
      propsRaw ? highlightCode(propsRaw, "ts") : Promise.resolve(""),
      howItWorksRaw
        ? highlightCode(howItWorksRaw, "markdown")
        : Promise.resolve(""),
    ]);

  return {
    install: installRaw ? { raw: installRaw, html: installHtml } : undefined,
    usage: { raw: usageCode, html: usageHtml },
    sourceFiles: highlightedFiles,
    props: propsRaw
      ? { count: propsDocs.length, raw: propsRaw, html: propsHtml }
      : undefined,
    howItWorks: howItWorksRaw
      ? { raw: howItWorksRaw, html: howItWorksHtml }
      : undefined,
  };
}

const serverCodeCache = new Map<
  string,
  Promise<HighlightedCodeAccordionData | null>
>();

export function getComponentCodeDataBySlug(
  slug: string,
): Promise<HighlightedCodeAccordionData | null> {
  const cached = serverCodeCache.get(slug);
  if (cached) return cached;

  const task = (async () => {
    const meta = getComponentMetaBySlug(slug);
    if (!meta) return null;

    const sourceFiles = await readRegistrySourceFiles(meta.sourceFiles);
    const generators = getComponentGenerators(meta.slug);
    const usageCode = generators
      ? generators.buildJsx(meta.defaultConfig)
      : `// Usage example for ${meta.title}`;

    return buildHighlightedCodeData({
      slug: meta.slug,
      cliCommand: getRegistryCliCommand(meta.slug),
      dependencies: meta.dependencies,
      usageCode,
      sourceFiles: sourceFiles.map((file) => ({
        path: file.path,
        name: file.name,
        code: file.content,
        lang: file.lang,
      })),
      propsDocs: meta.props,
      howItWorks: meta.howItWorks,
      overview: meta.description,
    });
  })();

  serverCodeCache.set(slug, task);
  return task;
}
