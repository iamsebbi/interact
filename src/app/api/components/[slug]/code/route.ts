import { NextResponse } from "next/server";
import { getComponentCodeDataBySlug } from "@/lib/component-code";
import { CATALOG_META } from "@/registry";

export const dynamic = "force-static";

export function generateStaticParams() {
  return CATALOG_META.map((entry) => ({ slug: entry.slug }));
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const data = await getComponentCodeDataBySlug(slug);
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}
