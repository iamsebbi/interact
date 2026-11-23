import { ImageResponse } from "next/og";
import { getComponentMetaBySlug } from "@/registry";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getComponentMetaBySlug(slug);
  const title = entry?.title ?? "interact.dev";
  const description =
    entry?.tagline ??
    "Interactive React UI components built on ui-sdk, Tailwind CSS v4, and Motion.";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        backgroundColor: "#121212",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "26px",
          color: "#a3a3a3",
        }}
      >
        <span style={{ color: "#ffffff", fontWeight: 600 }}>interact.dev</span>
        <span>·</span>
        <span>Components</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: "#ffffff",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "28px",
            lineHeight: 1.4,
            color: "#b3b3b3",
            maxWidth: "900px",
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "20px",
          color: "#7db4ff",
        }}
      >
        <span
          style={{
            padding: "8px 18px",
            borderRadius: "9999px",
            backgroundColor: "rgba(0, 113, 252, 0.18)",
          }}
        >
          @ui-sdk/react · Tailwind v4 · shadcn registry
        </span>
      </div>
    </div>,
    size,
  );
}
