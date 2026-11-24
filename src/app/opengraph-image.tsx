import { ImageResponse } from "next/og";
import { CATALOG_META } from "@/registry";

export const alt =
  "interact.dev — Interactive React UI Components & Micro-interactions";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
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
          gap: "14px",
          fontSize: "28px",
          color: "#a3a3a3",
        }}
      >
        <svg
          width="30"
          height="28"
          viewBox="0 0 84 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 32.5 0.0 L 32.4 27.5 L 7.7 17.1 L 0.0 34.3 L 25.6 45.4 L 8.4 66.1 L 24.0 79.2 L 42.0 57.9 L 60.0 79.2 L 75.6 66.1 L 58.4 45.4 L 84.0 34.3 L 76.3 17.1 L 51.6 27.5 L 51.5 0.0 Z"
            fill="#ffffff"
          />
        </svg>
        <span style={{ color: "#ffffff", fontWeight: 600 }}>interact</span>
        <span style={{ marginLeft: "-14px", color: "#8f8f8f" }}>.dev</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            fontSize: "68px",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: "#ffffff",
            maxWidth: "960px",
          }}
        >
          Interactive UI components for modern products.
        </div>
        <div
          style={{
            fontSize: "28px",
            lineHeight: 1.4,
            color: "#b3b3b3",
            maxWidth: "880px",
          }}
        >
          Copy-ready micro-interactions, live Studio customization, and shadcn
          CLI install.
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
          {CATALOG_META.length} components · Studio · shadcn registry
        </span>
      </div>
    </div>,
    size,
  );
}
