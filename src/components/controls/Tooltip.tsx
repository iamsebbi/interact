"use client";

import {
  TooltipContent as TooltipContentPrimitive,
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
} from "@ui-sdk/react/tooltip";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Tooltip = TooltipPrimitive;
export const TooltipTrigger = TooltipTriggerPrimitive;

export function TooltipContent({
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof TooltipContentPrimitive>) {
  return (
    <TooltipContentPrimitive
      sideOffset={sideOffset}
      className={cn(
        "surface-tooltip z-50 inline-flex h-8 items-center px-3 text-xs font-normal whitespace-nowrap pointer-events-none select-none origin-(--transform-origin) transition-[opacity,transform,filter] duration-150 ease-smooth data-starting-style:scale-[0.96] data-starting-style:opacity-0 data-starting-style:blur-[3px] data-ending-style:scale-[0.96] data-ending-style:opacity-0 data-ending-style:blur-[3px] motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}
