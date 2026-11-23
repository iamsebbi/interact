import { CodeTabsClient } from "@/components/showcase/CodeTabsClient";
import {
  buildHighlightedCodeData,
  type RawSourceFileTab,
} from "@/lib/component-code";
import type { ComponentHowItWorksStep, ComponentPropDoc } from "@/registry";

export type { RawSourceFileTab };

export interface CodeTabsProps {
  slug: string;
  cliCommand?: string;
  dependencies?: readonly string[];
  usageCode: string;
  sourceFiles?: readonly RawSourceFileTab[];
  propsDocs?: readonly ComponentPropDoc[];
  howItWorks?: readonly ComponentHowItWorksStep[];
  overview?: string;
}

export async function CodeTabs(props: CodeTabsProps) {
  const data = await buildHighlightedCodeData(props);
  return <CodeTabsClient data={data} />;
}
