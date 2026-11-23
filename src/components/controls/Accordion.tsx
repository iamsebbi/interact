"use client";

import {
  AccordionHeader as AccordionHeaderPrimitive,
  AccordionItem as AccordionItemPrimitive,
  AccordionPanel as AccordionPanelPrimitive,
  Accordion as AccordionPrimitive,
  AccordionTrigger as AccordionTriggerPrimitive,
} from "@ui-sdk/react/accordion";
import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Accordion({
  variant = "flush",
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive> & {
  variant?: "flush" | "panel";
}) {
  return (
    <AccordionPrimitive
      data-variant={variant}
      className={cn(
        variant === "flush" ? "divide-y divide-border" : "flex flex-col gap-2",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionItem({
  variant = "flush",
  className,
  ...props
}: ComponentProps<typeof AccordionItemPrimitive> & {
  variant?: "flush" | "panel";
}) {
  return (
    <AccordionItemPrimitive
      className={cn(
        variant === "panel" && "surface-panel overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionTrigger({
  variant = "flush",
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof AccordionTriggerPrimitive>, "children"> & {
  children?: ReactNode;
  variant?: "flush" | "panel";
}) {
  return (
    <AccordionHeaderPrimitive className="m-0">
      <AccordionTriggerPrimitive
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-4 text-left font-medium text-foreground-strong outline-none transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          variant === "flush"
            ? "min-h-12 rounded-sm py-4 text-base hover:text-foreground/80 md:text-sm"
            : "px-5 py-4 text-sm hover:bg-control",
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        <ChevronDown
          size={16}
          className="shrink-0 text-muted-foreground transition-transform duration-200 ease-smooth in-data-open:rotate-180"
          aria-hidden="true"
        />
      </AccordionTriggerPrimitive>
    </AccordionHeaderPrimitive>
  );
}

export function AccordionPanel({
  variant = "flush",
  className,
  ...props
}: ComponentProps<typeof AccordionPanelPrimitive> & {
  variant?: "flush" | "panel";
}) {
  return (
    <AccordionPanelPrimitive
      className={cn(
        "text-sm leading-relaxed text-muted-foreground md:text-[13px]",
        variant === "flush" ? "pb-4" : "px-5 pb-4",
        className,
      )}
      {...props}
    />
  );
}
