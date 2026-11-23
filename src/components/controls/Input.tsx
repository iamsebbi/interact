"use client";

import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Input as InputPrimitive } from "@ui-sdk/react/input";
import { Textarea as TextareaPrimitive } from "@ui-sdk/react/textarea";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface TextFieldProps
  extends Omit<ComponentProps<typeof InputPrimitive>, "onChange"> {
  label: string;
  layout?: "inline" | "stacked";
  rowClassName?: string;
}

export function TextField({
  label,
  layout = "inline",
  className,
  rowClassName,
  disabled = false,
  ...props
}: TextFieldProps) {
  const isStacked = layout === "stacked";

  return (
    <Field
      disabled={disabled}
      className={cn(
        "control-row flex w-full text-xs",
        isStacked
          ? "flex-col gap-1.5 rounded-xl p-3"
          : "h-11 items-center justify-between gap-2 rounded-xl px-3.5",
        disabled && "pointer-events-none opacity-45",
        rowClassName,
      )}
    >
      <FieldLabel className="shrink-0 font-normal text-muted-foreground">
        {label}
      </FieldLabel>
      <InputPrimitive
        className={cn(
          "bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none",
          isStacked ? "w-full text-left" : "w-36 min-w-0 flex-1 text-right",
          className,
        )}
        {...props}
      />
    </Field>
  );
}

export interface TextareaFieldProps
  extends Omit<ComponentProps<typeof TextareaPrimitive>, "onChange"> {
  label: string;
  rowClassName?: string;
}

export function TextareaField({
  label,
  className,
  rowClassName,
  disabled = false,
  rows = 3,
  ...props
}: TextareaFieldProps) {
  return (
    <Field
      disabled={disabled}
      className={cn(
        "control-row flex w-full flex-col gap-1.5 rounded-xl p-3 text-xs",
        disabled && "pointer-events-none opacity-45",
        rowClassName,
      )}
    >
      <FieldLabel className="font-normal text-muted-foreground">
        {label}
      </FieldLabel>
      <TextareaPrimitive
        rows={rows}
        className={cn(
          "w-full resize-none bg-transparent text-xs leading-relaxed text-foreground placeholder:text-muted-foreground outline-none",
          className,
        )}
        {...props}
      />
    </Field>
  );
}
