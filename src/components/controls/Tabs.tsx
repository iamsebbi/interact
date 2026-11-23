"use client";

import {
  TabsIndicator as TabsIndicatorPrimitive,
  TabsList as TabsListPrimitive,
  TabsPanel as TabsPanelPrimitive,
  Tabs as TabsPrimitive,
  TabsTab as TabsTabPrimitive,
} from "@ui-sdk/react/tabs";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive;

export function TabsList({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof TabsListPrimitive>, "children"> & {
  children?: ReactNode;
}) {
  return (
    <TabsListPrimitive
      className={cn(
        "relative isolate inline-flex h-9 items-center gap-[3px] rounded-pill bg-tabs-track p-[3px]",
        className,
      )}
      {...props}
    >
      <TabsIndicatorPrimitive className="pointer-events-none absolute top-(--active-tab-top) left-(--active-tab-left) -z-10 h-(--active-tab-height) w-(--active-tab-width) rounded-pill bg-tabs-pill shadow-tabs-pill transition-[top,left,width,height] duration-250 ease-smooth motion-reduce:transition-none" />
      {children}
    </TabsListPrimitive>
  );
}

export function TabsTab({
  className,
  ...props
}: ComponentProps<typeof TabsTabPrimitive>) {
  return (
    <TabsTabPrimitive
      className={cn(
        "relative z-10 inline-flex h-[30px] cursor-pointer items-center justify-center gap-1.5 rounded-pill px-3 text-[13px] font-medium whitespace-nowrap text-tabs-text select-none outline-none transition-colors duration-200 ease-smooth hover:text-tabs-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-selected:text-tabs-active data-disabled:pointer-events-none data-disabled:opacity-45",
        className,
      )}
      {...props}
    />
  );
}

export function TabsPanel({
  className,
  ...props
}: ComponentProps<typeof TabsPanelPrimitive>) {
  return (
    <TabsPanelPrimitive className={cn("outline-none", className)} {...props} />
  );
}
