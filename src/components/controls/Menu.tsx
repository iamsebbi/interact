"use client";

import {
  MenuContent as MenuContentPrimitive,
  MenuGroupLabel as MenuGroupLabelPrimitive,
  MenuGroup as MenuGroupPrimitive,
  MenuItem as MenuItemPrimitive,
  Menu as MenuPrimitive,
  MenuSeparator as MenuSeparatorPrimitive,
  MenuTrigger as MenuTriggerPrimitive,
} from "@ui-sdk/react/menu";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Menu = MenuPrimitive;
export const MenuTrigger = MenuTriggerPrimitive;
export const MenuGroup = MenuGroupPrimitive;

export function MenuContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentProps<typeof MenuContentPrimitive>) {
  return (
    <MenuContentPrimitive
      sideOffset={sideOffset}
      className={cn(
        "surface-popover z-50 min-w-52 border-0 p-1.5 text-popover-foreground outline-none origin-(--transform-origin) transition-[opacity,transform] duration-250 ease-smooth data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:scale-[0.97] data-ending-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export function MenuItem({
  className,
  ...props
}: ComponentProps<typeof MenuItemPrimitive>) {
  return (
    <MenuItemPrimitive
      className={cn(
        "flex min-h-8 w-full cursor-pointer items-center gap-2 rounded-sm px-2.5 text-[13px] font-normal text-popover-foreground no-underline outline-none select-none transition-colors duration-100 data-highlighted:bg-menu-hover active:bg-menu-active data-disabled:pointer-events-none data-disabled:opacity-45",
        className,
      )}
      {...props}
    />
  );
}

export function MenuGroupLabel({
  className,
  ...props
}: ComponentProps<typeof MenuGroupLabelPrimitive>) {
  return (
    <MenuGroupLabelPrimitive
      className={cn(
        "px-2.5 py-1.5 text-[11px] font-medium text-subtle-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function MenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuSeparatorPrimitive>) {
  return (
    <MenuSeparatorPrimitive
      className={cn("-mx-1.5 my-1.5 h-px bg-menu-divider", className)}
      {...props}
    />
  );
}
