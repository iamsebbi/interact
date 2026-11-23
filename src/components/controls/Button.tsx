"use client";

import { Button as ButtonPrimitive } from "@ui-sdk/react/button";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "chip"
  | "elevated"
  | "ghost"
  | "pro"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ComponentProps<typeof ButtonPrimitive> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-primary hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-control text-foreground hover:bg-control-hover active:bg-chip-pressed",
  chip: "control-chip text-foreground",
  elevated: "control-elevated hover:bg-chip-hover active:bg-chip-pressed",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-control hover:text-foreground active:bg-control-hover",
  pro: "control-pro font-medium",
  destructive:
    "bg-destructive text-destructive-foreground shadow-primary hover:bg-destructive-hover active:bg-destructive-active",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9 px-3.5 text-[13px] gap-2",
  lg: "h-10 px-5 text-sm gap-2",
  icon: "size-9 p-0",
};

export function Button({
  variant = "chip",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-pill font-medium whitespace-nowrap select-none outline-none transition-[background-color,color,box-shadow,scale,opacity] duration-150 ease-smooth active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-disabled:pointer-events-none data-disabled:opacity-45 data-pending:opacity-75 motion-reduce:transition-none motion-reduce:active:scale-100",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
}
