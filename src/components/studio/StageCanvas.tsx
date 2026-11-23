"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { StudioSceneBg } from "@/registry";

export interface StageCanvasProps {
  sceneBg: StudioSceneBg;
  zoom: number;
  children: ReactNode;
  dock?: ReactNode;
  className?: string;
}

const SCENE_CLASSES: Record<StudioSceneBg, string> = {
  dots: "bg-stage bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px]",
  dark: "bg-[#121212] text-white",
  light: "bg-[#f4f4f4] text-[#0d0d0d]",
};

export function StageCanvas({
  sceneBg,
  zoom,
  children,
  dock,
  className,
}: StageCanvasProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[480px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg p-8 transition-colors duration-200 ease-smooth",
        SCENE_CLASSES[sceneBg],
        className,
      )}
    >
      <div
        className="flex items-center justify-center transition-transform duration-200 ease-smooth motion-reduce:transition-none"
        style={{ transform: `scale(${zoom})` }}
      >
        {children}
      </div>

      {dock && (
        <div className="pointer-events-auto absolute right-4 bottom-4 left-4 flex justify-center">
          {dock}
        </div>
      )}
    </div>
  );
}
