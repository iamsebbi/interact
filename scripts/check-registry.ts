import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { CATALOG_META } from "../src/registry/manifest";

interface RegistryManifest {
  name: string;
  items: Array<{
    name: string;
    files?: Array<{ path: string; target?: string }>;
  }>;
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
    for (const file of item.files ?? []) {
      if (!existsSync(path.join(root, file.path))) {
        errors.push(
          `registry.json item "${item.name}" references missing file: ${file.path}`,
        );
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
  `Registry check passed (${CATALOG_META.length} catalog entries in sync with registry.json).`,
);
