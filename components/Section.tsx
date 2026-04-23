import { cn } from "@/lib/utils";
import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  grid?: boolean;
  container?: boolean;
  padding?: boolean;
}

/**
 * A reusable layout component that enforces the global grid system.
 * Mobile: 4 Columns
 * Tablet/Laptop: 8 Columns
 * Desktop: 12 Columns
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(({ 
  children, 
  className, 
  id, 
  grid = true, 
  container = true,
  padding = true
}, ref) => {
  return (
    <section 
      ref={ref}
      id={id} 
      className={cn(
        "relative w-full",
        className
      )}
    >
      <div className={cn(
        "w-full",
        container && "mx-auto max-w-[1920px]",
        padding && "py-12 md:py-24 px-4 md:px-12",
        grid && "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-8",
      )}>
        {children}
      </div>
    </section>
  );
});

Section.displayName = "Section";

/**
 * Utility sub-component for items within a Section
 */
export function GridItem({ 
  children, 
  className,
  span = "col-span-full"
}: { 
  children: React.ReactNode; 
  className?: string;
  span?: string;
}) {
  return (
    <div className={cn(span, className)}>
      {children}
    </div>
  );
}
