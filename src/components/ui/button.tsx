import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loading01 } from "@/components/icons";
import { cn } from "@/utils/cn";

/**
 * Standard Pastilă (full rounded / rounded-full) Button Variants
 * Folosește exclusiv tokenurile semantice definite în proiect.
 */
export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap outline-none select-none transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:border-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        outline:
          "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm",
        ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        accent: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        muted: "bg-muted text-muted-foreground hover:bg-muted/80",
      },
      size: {
        sm: "h-7 px-3 py-1.5 text-xs gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-9 px-4 py-2 text-sm gap-2 [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 px-4 py-2 text-sm gap-2 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 px-5 py-2.5 text-base gap-2.5 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9 p-0 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-7 p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11 p-0 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Icon opțional plasat în stânga etichetei */
  iconLeft?: React.ReactNode;
  /** Icon opțional plasat în dreapta etichetei */
  iconRight?: React.ReactNode;
  /** Afișează spinner de încărcare și dezactivează butonul */
  loading?: boolean;
  /** Compatibilitate API pentru animarea iconițelor la hover */
  animateIconOnHover?: boolean;
}

/**
 * Componentă Button Pastilă (M3 / Full Rounded)
 * - Toate variantele sunt complet rotunjite (`rounded-full`)
 * - Suport pentru iconLeft, iconRight, mod doar-icon, stări disabled și loading
 * - Tranziții fine și feedback tactil (`active:scale-95`)
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      iconLeft,
      iconRight,
      loading = false,
      disabled = false,
      animateIconOnHover: _animateIconOnHover = true,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        data-slot="button"
        data-variant={variant ?? "primary"}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading ? (
          <Loading01 className="size-4 shrink-0 text-current" aria-hidden="true" />
        ) : (
          iconLeft
        )}
        {children}
        {!loading && iconRight}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
