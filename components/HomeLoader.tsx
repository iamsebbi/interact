"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useIsClient } from "@/lib/use-is-client";

const DynamicLoader = dynamic(
  () => import("./Loader").then((mod) => mod.Loader),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 z-9999 bg-background" />,
  },
);

/**
 * Client-only gate that lazy-loads the GSAP intro Loader only on first visit.
 */
export function HomeLoader() {
  const isClient = useIsClient();
  const [loaderDone, setLoaderDone] = useState(false);

  const showLoader =
    isClient && !loaderDone && !sessionStorage.getItem("hasVisited");

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem("hasVisited", "true");
    setLoaderDone(true);
  }, []);

  if (!showLoader) return null;

  return <DynamicLoader onComplete={handleLoaderComplete} />;
}
