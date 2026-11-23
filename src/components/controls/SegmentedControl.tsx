"use client";

import {
  SegmentedControlIndicator as SegmentedControlIndicatorPrimitive,
  SegmentedControlItem as SegmentedControlItemPrimitive,
  SegmentedControl as SegmentedControlPrimitive,
} from "@ui-sdk/react/segmented-control";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SegmentedControl({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof SegmentedControlPrimitive>, "children"> & {
  children?: ReactNode;
}) {
  return (
    <SegmentedControlPrimitive
      className={cn(
        "relative isolate inline-flex h-9 items-center gap-[3px] rounded-pill bg-tabs-track p-[3px]",
        className,
      )}
      {...props}
    >
      <SegmentedControlIndicatorPrimitive className="pointer-events-none absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) -z-10 h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) rounded-pill bg-tabs-pill shadow-tabs-pill transition-[top,left,width,height] duration-200 ease-smooth motion-reduce:transition-none" />
      {children}
    </SegmentedControlPrimitive>
  );
}

export function SegmentedControlItem({
  className,
  ...props
}: ComponentProps<typeof SegmentedControlItemPrimitive>) {
  return (
    <SegmentedControlItemPrimitive
      className={cn(
        "relative z-10 inline-flex h-[30px] cursor-pointer items-center justify-center gap-1.5 rounded-pill px-3 text-[13px] font-medium whitespace-nowrap text-tabs-text select-none outline-none transition-colors duration-150 ease-smooth hover:text-tabs-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-checked:text-tabs-active data-disabled:pointer-events-none data-disabled:opacity-45",
        className,
      )}
      {...props}
    />
  );
}
