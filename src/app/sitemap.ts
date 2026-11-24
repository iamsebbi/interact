import type { MetadataRoute } from "next";
import { CATALOG_META } from "@/registry";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://interact.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/how-to-use`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/pricing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/studio`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const componentRoutes: MetadataRoute.Sitemap = CATALOG_META.map((entry) => ({
    url: `${SITE_URL}/components/${entry.slug}`,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...componentRoutes];
}
