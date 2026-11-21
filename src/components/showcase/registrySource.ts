import { highlightCode, type CodeLanguage } from "../ui/code-block";

export interface RegistrySourceFile {
  path: string;
  target?: string;
  name: string;
  tabLabel: string;
  lang: CodeLanguage;
  content: string;
}

interface RawRegistryFileItem {
  path?: string;
  target?: string;
  content?: string;
}

interface RawRegistryJson {
  files?: RawRegistryFileItem[];
}

const registryPromiseCache = new Map<string, Promise<RegistrySourceFile[]>>();
const registryResolvedCache = new Map<string, RegistrySourceFile[]>();

function getFileName(filePath: string): string {
  const parts = filePath.split("/");
  return parts[parts.length - 1] || filePath;
}

function getFileExtension(fileName: string): string {
  const idx = fileName.lastIndexOf(".");
  return idx >= 0 ? fileName.slice(idx + 1).toLowerCase() : "";
}

function inferCodeLanguage(fileName: string): CodeLanguage {
  const ext = getFileExtension(fileName);
  switch (ext) {
    case "tsx":
      return "tsx";
    case "ts":
      return "ts";
    case "css":
      return "css";
    case "json":
      return "json";
    case "md":
    case "mdx":
      return "markdown";
    case "sh":
    case "bash":
      return "bash";
    default:
      return "text";
  }
}

export function getCachedRegistryFiles(
  componentId: string
): RegistrySourceFile[] | null {
  return registryResolvedCache.get(componentId) ?? null;
}

function isPrimaryComponentTsx(filePath: string): boolean {
  if (!filePath.toLowerCase().endsWith(".tsx")) return false;
  if (filePath.includes("/animate-ui/") || filePath.includes("-utils/")) {
    return false;
  }
  return true;
}

export function fetchRegistryFiles(
  componentId: string
): Promise<RegistrySourceFile[]> {
  const cached = registryPromiseCache.get(componentId);
  if (cached) return cached;

  const request = (async () => {
    const res = await fetch(`/r/${encodeURIComponent(componentId)}.json`);
    if (!res.ok) {
      throw new Error(`Failed to load registry source (${res.status})`);
    }
    const data = (await res.json()) as RawRegistryJson;
    const rawFiles = Array.isArray(data.files) ? data.files : [];

    const validFiles = rawFiles.filter(
      (item): item is Required<Pick<RawRegistryFileItem, "path" | "content">> & RawRegistryFileItem =>
        typeof item.path === "string" && typeof item.content === "string"
    );

    const primaryTsx = validFiles.find((f) => isPrimaryComponentTsx(f.path));
    const primaryCss = validFiles.find((f) => f.path.toLowerCase().endsWith(".css"));
    const selectedFiles = [primaryTsx, primaryCss].filter(
      (f): f is Required<Pick<RawRegistryFileItem, "path" | "content">> & RawRegistryFileItem =>
        Boolean(f)
    );
    const displayFiles =
      selectedFiles.length > 0 ? selectedFiles : validFiles.slice(0, 1);

    const result: RegistrySourceFile[] = displayFiles.map((item) => {
      const name = getFileName(item.path);
      const ext = getFileExtension(name);
      return {
        path: item.path,
        target: item.target,
        name,
        tabLabel: ext || name,
        lang: inferCodeLanguage(name),
        content: item.content,
      };
    });

    registryResolvedCache.set(componentId, result);
    return result;
  })().catch((err) => {
    registryPromiseCache.delete(componentId);
    throw err;
  });

  registryPromiseCache.set(componentId, request);
  return request;
}

export function prefetchComponentCode(
  componentId: string,
  isDark = true
): void {
  fetchRegistryFiles(componentId)
    .then((files) => {
      const first = files[0];
      if (!first) return;
      return highlightCode(
        first.content.replace(/\r?\n$/, ""),
        first.lang,
        isDark
      );
    })
    .catch(() => {});
}
