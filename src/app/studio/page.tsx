import type { Metadata } from "next";
import { Suspense } from "react";
import { StudioShell } from "@/components/studio/StudioShell";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Interactive component playground to customize props, preview light and dark stages, and export JSX or AI prompts.",
};

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-[1440px] items-center justify-center px-6">
          <div className="surface-stage h-full w-full animate-pulse" />
        </div>
      }
    >
      <StudioShell />
    </Suspense>
  );
}
