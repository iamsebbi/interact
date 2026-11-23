import { readFile } from "node:fs/promises";
import path from "node:path";
import type { CodeLanguage } from "./shiki";

export interface LoadedSourceFile {
  path: string;
  name: string;
  lang: CodeLanguage;
  content: string;
}

const REGISTRY_ROOT = path.resolve(process.cwd(), "src", "registry");

function detectLanguage(filePath: string): CodeLanguage {
  if (filePath.endsWith(".css")) return "css";
  if (filePath.endsWith(".json")) return "json";
  if (filePath.endsWith(".sh") || filePath.endsWith(".bash")) return "bash";
  if (filePath.endsWith(".md")) return "markdown";
  if (filePath.endsWith(".ts")) return "ts";
  return "tsx";
}

export async function readRegistrySourceFiles(
  relativePaths: readonly string[],
): Promise<LoadedSourceFile[]> {
  const results: LoadedSourceFile[] = [];

  for (const rel of relativePaths) {
    const normalized = rel.replace(/^src\/registry\//, "");
    const absolute = path.join(REGISTRY_ROOT, normalized);
    if (!absolute.startsWith(REGISTRY_ROOT + path.sep)) {
      throw new Error(`Refusing to read path outside src/registry: ${rel}`);
    }
    const content = await readFile(absolute, "utf8");
    results.push({
      path: rel,
      name: path.basename(rel),
      lang: detectLanguage(rel),
      content,
    });
  }

  return results;
}
