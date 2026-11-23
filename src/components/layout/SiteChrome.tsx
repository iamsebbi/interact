"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useIsShowcaseGridMounted } from "@/lib/showcase-grid-presence";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isGridMounted = useIsShowcaseGridMounted();
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");
  const isComponentDetail =
    pathname === "/components" || pathname.startsWith("/components/");
  const isStandaloneComponentPage = isComponentDetail && !isGridMounted;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      {!isStandaloneComponentPage && <Navbar />}
      <div className="flex-1">{children}</div>
      {!isStudio && !isStandaloneComponentPage && <Footer />}
    </div>
  );
}
