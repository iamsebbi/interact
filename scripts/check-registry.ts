import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { CATALOG_META } from "../src/registry/manifest";

interface RegistryFileEntry {
  path: string;
  target?: string;
  content?: string;
}

interface RegistryItem {
  name: string;
  files?: RegistryFileEntry[];
}

interface RegistryManifest {
  name: string;
  items: RegistryItem[];
}

interface Token {
  kind: "id" | "string" | "punct";
  value: string;
}

const CODE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"] as const;
const ALLOWED_CONSUMER_IMPORTS = new Set(["@/lib/utils"]);

const normalizeNewlines = (value: string) => value.replace(/\r\n/g, "\n");
const normalizePosix = (value: string) =>
  path.posix.normalize(value.replace(/\\/g, "/")).replace(/^\/+/, "");

function isCodeFile(filePath: string): boolean {
  return CODE_EXTENSIONS.some((ext) => filePath.endsWith(ext));
}

function buildTargetLookup(targets: string[]): Set<string> {
  const lookup = new Set<string>();
  for (const rawTarget of targets) {
    const target = normalizePosix(rawTarget);
    lookup.add(target);
    for (const ext of CODE_EXTENSIONS) {
      if (target.endsWith(ext)) {
        const withoutExt = target.slice(0, -ext.length);
        lookup.add(withoutExt);
        if (withoutExt.endsWith("/index")) {
          lookup.add(withoutExt.slice(0, -"/index".length));
        }
        break;
      }
    }
  }
  return lookup;
}

function tokenizeCode(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = source.length;

  while (i < len) {
    const ch = source[i];

    // Whitespace
    if (ch <= " ") {
      i += 1;
      continue;
    }

    // Line comment
    if (ch === "/" && source[i + 1] === "/") {
      i += 2;
      while (i < len && source[i] !== "\n") i += 1;
      continue;
    }

    // Block comment
    if (ch === "/" && source[i + 1] === "*") {
      i += 2;
      while (i < len && !(source[i] === "*" && source[i + 1] === "/")) i += 1;
      i += 2;
      continue;
    }

    // String literal
    if (ch === '"' || ch === "'") {
      const quote = ch;
      i += 1;
      let value = "";
      while (i < len && source[i] !== quote) {
        if (source[i] === "\\" && i + 1 < len) {
          value += source[i + 1];
          i += 2;
        } else {
          value += source[i];
          i += 1;
        }
      }
      i += 1;
      tokens.push({ kind: "string", value });
      continue;
    }

    // Template literal (skip contents cleanly; handle nested ${...} braces)
    if (ch === "`") {
      i += 1;
      let braceDepth = 0;
      while (i < len) {
        if (source[i] === "\\" && i + 1 < len) {
          i += 2;
          continue;
        }
        if (braceDepth === 0 && source[i] === "`") {
          i += 1;
          break;
        }
        if (source[i] === "$" && source[i + 1] === "{") {
          braceDepth += 1;
          i += 2;
          continue;
        }
        if (braceDepth > 0 && source[i] === "}") {
          braceDepth -= 1;
        }
        i += 1;
      }
      continue;
    }

    // Identifier
    if (/[A-Za-z_$]/.test(ch)) {
      const start = i;
      i += 1;
      while (i < len && /[\w$]/.test(source[i])) i += 1;
      tokens.push({ kind: "id", value: source.slice(start, i) });
      continue;
    }

    tokens.push({ kind: "punct", value: ch });
    i += 1;
  }

  return tokens;
}

function extractImportSpecifiers(sourceText: string): string[] {
  const tokens = tokenizeCode(sourceText);
  const specifiers: string[] = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.kind !== "id") continue;

    // Ignore property access like `obj.import` or `obj.export`
    const prev = i > 0 ? tokens[i - 1] : undefined;
    if (prev?.kind === "punct" && prev.value === ".") continue;

    if (token.value === "import") {
      const next = tokens[i + 1];
      if (!next) continue;

      // Dynamic import("...")
      if (
        next.kind === "punct" &&
        next.value === "(" &&
        tokens[i + 2]?.kind === "string" &&
        tokens[i + 3]?.kind === "punct" &&
        tokens[i + 3].value === ")"
      ) {
        specifiers.push(tokens[i + 2].value);
        i += 3;
        continue;
      }

      // Side-effect import "..."
      if (next.kind === "string") {
        specifiers.push(next.value);
        i += 1;
        continue;
      }

      // Static import ... from "..."
      let j = i + 1;
      let braceDepth = 0;
      while (j < tokens.length) {
        const cur = tokens[j];
        if (cur.kind === "punct" && cur.value === "{") braceDepth += 1;
        else if (cur.kind === "punct" && cur.value === "}")
          braceDepth = Math.max(0, braceDepth - 1);
        else if (braceDepth === 0 && cur.kind === "punct" && cur.value === ";")
          break;
        else if (
          braceDepth === 0 &&
          cur.kind === "id" &&
          cur.value === "from" &&
          tokens[j + 1]?.kind === "string"
        ) {
          specifiers.push(tokens[j + 1].value);
          i = j + 1;
          break;
        }
        j += 1;
      }
      continue;
    }

    if (token.value === "export") {
      let j = i + 1;
      if (tokens[j]?.kind === "id" && tokens[j].value === "type") {
        j += 1;
      }
      const start = tokens[j];
      if (start?.kind !== "punct") continue;

      if (start.value === "*") {
        j += 1;
        if (tokens[j]?.kind === "id" && tokens[j].value === "as") {
          j += 2;
        }
        if (
          tokens[j]?.kind === "id" &&
          tokens[j].value === "from" &&
          tokens[j + 1]?.kind === "string"
        ) {
          specifiers.push(tokens[j + 1].value);
          i = j + 1;
        }
      } else if (start.value === "{") {
        let braceDepth = 1;
        j += 1;
        while (j < tokens.length && braceDepth > 0) {
          if (tokens[j].kind === "punct" && tokens[j].value === "{")
            braceDepth += 1;
          else if (tokens[j].kind === "punct" && tokens[j].value === "}")
            braceDepth -= 1;
          j += 1;
        }
        if (
          tokens[j]?.kind === "id" &&
          tokens[j].value === "from" &&
          tokens[j + 1]?.kind === "string"
        ) {
          specifiers.push(tokens[j + 1].value);
          i = j + 1;
        }
      }
    }
  }

  return specifiers;
}

function validateFileImports(
  itemName: string,
  sourceLabel: string,
  targetPath: string,
  content: string,
  declaredTargets: Set<string>,
  errors: string[],
): void {
  if (!isCodeFile(targetPath)) return;

  const targetDir = path.posix.dirname(normalizePosix(targetPath));
  const specifiers = extractImportSpecifiers(content);

  for (const specifier of specifiers) {
    if (specifier === "@/registry" || specifier.startsWith("@/registry/")) {
      errors.push(
        `Item "${itemName}" (${sourceLabel}) imports internal path "${specifier}". Use a consumer-resolvable alias matching a declared target (e.g. "@/components/animate-ui/icons/...").`,
      );
      continue;
    }

    if (specifier.startsWith("@/")) {
      if (ALLOWED_CONSUMER_IMPORTS.has(specifier)) continue;
      const expectedTarget = normalizePosix(specifier.slice(2));
      if (!declaredTargets.has(expectedTarget)) {
        errors.push(
          `Item "${itemName}" (${sourceLabel}) imports "${specifier}", which does not match any declared target in registry.json (expected target like "${expectedTarget}.tsx").`,
        );
      }
      continue;
    }

    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      const resolvedTarget = normalizePosix(
        path.posix.join(targetDir, specifier),
      );
      if (!declaredTargets.has(resolvedTarget)) {
        errors.push(
          `Item "${itemName}" (${sourceLabel}) imports relative path "${specifier}" (resolves to "${resolvedTarget}"), which is not declared in registry.json targets.`,
        );
      }
    }
  }
}

const root = process.cwd();
const registryPath = path.join(root, "registry.json");
const publicRDir = path.join(root, "public", "r");

const errors: string[] = [];

if (!existsSync(registryPath)) {
  errors.push("Missing registry.json at project root.");
} else {
  const manifest = JSON.parse(
    readFileSync(registryPath, "utf8"),
  ) as RegistryManifest;
  const manifestItems = new Map(
    manifest.items.map((item) => [item.name, item]),
  );
  const catalogSlugs = new Set(CATALOG_META.map((entry) => entry.slug));

  for (const entry of CATALOG_META) {
    if (!manifestItems.has(entry.slug)) {
      errors.push(
        `Catalog entry "${entry.slug}" is missing from registry.json.`,
      );
    }
    for (const file of entry.sourceFiles) {
      if (!existsSync(path.join(root, file))) {
        errors.push(`Catalog "${entry.slug}" references missing file: ${file}`);
      }
    }
  }

  for (const item of manifest.items) {
    if (!catalogSlugs.has(item.name)) {
      errors.push(
        `registry.json item "${item.name}" is missing from CATALOG_META.`,
      );
    }

    const files = item.files ?? [];
    const declaredTargets = buildTargetLookup(
      files.map((file) => file.target).filter((t): t is string => Boolean(t)),
    );
    const sourceContents = new Map<string, string>();

    for (const file of files) {
      const absolutePath = path.join(root, file.path);
      if (!existsSync(absolutePath)) {
        errors.push(
          `registry.json item "${item.name}" references missing file: ${file.path}`,
        );
      } else {
        const content = readFileSync(absolutePath, "utf8");
        sourceContents.set(normalizePosix(file.path), content);
        if (file.target) {
          validateFileImports(
            item.name,
            file.path,
            file.target,
            content,
            declaredTargets,
            errors,
          );
        }
      }

      if (!file.target) {
        errors.push(
          `registry.json item "${item.name}" file "${file.path}" must declare an explicit "target" (e.g. "components/ui/...").`,
        );
      }
    }

    if (existsSync(publicRDir)) {
      const builtPath = path.join(publicRDir, `${item.name}.json`);
      if (!existsSync(builtPath)) {
        errors.push(
          `Missing built registry output: public/r/${item.name}.json`,
        );
      } else {
        const builtItem = JSON.parse(
          readFileSync(builtPath, "utf8"),
        ) as RegistryItem;
        const builtFiles = builtItem.files ?? [];
        const builtByPath = new Map(
          builtFiles.map((file) => [normalizePosix(file.path), file]),
        );

        for (const file of files) {
          const key = normalizePosix(file.path);
          const builtFile = builtByPath.get(key);
          if (!builtFile) {
            errors.push(
              `Built output public/r/${item.name}.json is missing file "${file.path}". Run "pnpm run registry:build".`,
            );
            continue;
          }
          if (builtFile.target !== file.target) {
            errors.push(
              `Built output public/r/${item.name}.json target mismatch for "${file.path}" (got "${builtFile.target ?? ""}", expected "${file.target ?? ""}"). Run "pnpm run registry:build".`,
            );
          }
          const diskContent = sourceContents.get(key);
          if (
            diskContent !== undefined &&
            typeof builtFile.content === "string" &&
            normalizeNewlines(builtFile.content) !==
              normalizeNewlines(diskContent)
          ) {
            errors.push(
              `Built output public/r/${item.name}.json is out of sync with "${file.path}". Run "pnpm run registry:build".`,
            );
          }
          if (builtFile.target && typeof builtFile.content === "string") {
            validateFileImports(
              item.name,
              `public/r/${item.name}.json -> ${builtFile.path}`,
              builtFile.target,
              builtFile.content,
              declaredTargets,
              errors,
            );
          }
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Registry validation failed:");
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(
  `Registry check passed (${CATALOG_META.length} catalog entries in sync with registry.json and valid distributable imports).`,
);
