import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeTabs } from "@/components/showcase/CodeTabs";
import {
  ComponentDetailView,
  type ComponentNavItem,
} from "@/components/showcase/ComponentDetailView";
import { PropsTable } from "@/components/showcase/PropsTable";
import { readRegistrySourceFiles } from "@/lib/registry-source";
import {
  CATALOG_META,
  getComponentMetaBySlug,
  getRegistryCliCommand,
} from "@/registry";
import { getComponentGenerators } from "@/registry/generators";

interface ComponentPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATALOG_META.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: ComponentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getComponentMetaBySlug(slug);
  if (!meta) return { title: "Component Not Found" };

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: `${meta.title} — interact.dev`,
      description: meta.description,
    },
  };
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params;
  const meta = getComponentMetaBySlug(slug);
  if (!meta) notFound();

  const componentList: ComponentNavItem[] = CATALOG_META.map((item) => ({
    slug: item.slug,
    title: item.title,
  }));

  const sourceFiles = await readRegistrySourceFiles(meta.sourceFiles);
  const generators = getComponentGenerators(meta.slug);
  const usageCode = generators
    ? generators.buildJsx(meta.defaultConfig)
    : `// Usage example for ${meta.title}`;

  return (
    <div data-component-detail-page>
      <ComponentDetailView
        meta={meta}
        componentList={componentList}
        codeSlot={
          <CodeTabs
            slug={meta.slug}
            cliCommand={getRegistryCliCommand(meta.slug)}
            dependencies={meta.dependencies}
            usageCode={usageCode}
            sourceFiles={sourceFiles.map((file) => ({
              path: file.path,
              name: file.name,
              code: file.content,
              lang: file.lang,
            }))}
            propsDocs={meta.props}
            howItWorks={meta.howItWorks}
            overview={meta.description}
          />
        }
        propsSlot={<PropsTable props={meta.props} />}
      />
    </div>
  );
}
