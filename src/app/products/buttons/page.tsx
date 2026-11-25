import type { Metadata } from "next";
import { ButtonsProductPage } from "@/components/products/ButtonsProductPage";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://interact.dev";

export const metadata: Metadata = {
  title: "Buttons — Stateful React Buttons Pack",
  description:
    "Seven physics-driven, stateful React buttons—Download, Upload, Update, Delete, Approve/Reject, Voice, and Search—built on @ui-sdk/react and Motion for modern web apps and AI agents.",
  alternates: {
    canonical: "/products/buttons",
  },
  openGraph: {
    title: "Buttons — Stateful React Buttons Pack — interact.dev",
    description:
      "Seven physics-driven, stateful React buttons built on @ui-sdk/react and Motion with real-world product scenes and one-command shadcn CLI install.",
    url: `${SITE_URL}/products/buttons`,
  },
};

const BUTTONS_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "interact.dev Buttons Pack",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/products/buttons`,
      description:
        "Seven stateful React UI buttons built on @ui-sdk/react and Motion: Download Button, Upload Button, Update Button, Delete Button, Approve Reject, Voice Button, and Search Button.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Buttons",
          item: `${SITE_URL}/products/buttons`,
        },
      ],
    },
  ],
};

export default function ButtonsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD structured data for SEO/GEO
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BUTTONS_JSON_LD) }}
      />
      <ButtonsProductPage />
    </>
  );
}
