"use client";

import {
  DialogBackdrop as DialogBackdropPrimitive,
  DialogClose as DialogClosePrimitive,
  DialogContent as DialogContentPrimitive,
  DialogDescription as DialogDescriptionPrimitive,
  Dialog as DialogPrimitive,
  DialogTitle as DialogTitlePrimitive,
  DialogTrigger as DialogTriggerPrimitive,
} from "@ui-sdk/react/dialog";
import type { ComponentProps, ReactNode } from "react";
import { X } from "@/components/icons";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive;
export const DialogTrigger = DialogTriggerPrimitive;
export const DialogClose = DialogClosePrimitive;

export function DialogBackdrop({
  className,
  ...props
}: ComponentProps<typeof DialogBackdropPrimitive>) {
  return (
    <DialogBackdropPrimitive
      className={cn(
        "fixed inset-0 z-50 bg-black/55 backdrop-blur-sm transition-opacity duration-200 ease-smooth data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: Omit<ComponentProps<typeof DialogContentPrimitive>, "children"> & {
  children?: ReactNode;
  showClose?: boolean;
}) {
  return (
    <DialogContentPrimitive
      className={cn(
        "surface-popover fixed top-1/2 left-1/2 z-50 w-[min(calc(100vw-2rem),42rem)] max-h-[85dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg p-6 text-popover-foreground outline-none transition-[opacity,transform] duration-200 ease-smooth data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:scale-[0.97] data-ending-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
      {showClose && (
        <DialogClosePrimitive
          aria-label="Close dialog"
          className="control-chip absolute top-4 right-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-pill text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <X size={15} aria-hidden="true" />
        </DialogClosePrimitive>
      )}
    </DialogContentPrimitive>
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogTitlePrimitive>) {
  return (
    <DialogTitlePrimitive
      className={cn(
        "text-base font-medium tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogDescriptionPrimitive>) {
  return (
    <DialogDescriptionPrimitive
      className={cn(
        "text-[13px] leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
