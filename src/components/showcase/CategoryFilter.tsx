"use client";

import { Button } from "@/components/controls";
import { cn } from "@/lib/utils";
import { INTERACTION_CATEGORIES, type InteractionCategory } from "@/registry";

export type CategoryFilterValue = "All" | InteractionCategory;

export interface CategoryFilterProps {
  value: CategoryFilterValue;
  onValueChange: (value: CategoryFilterValue) => void;
}

export function CategoryFilter({ value, onValueChange }: CategoryFilterProps) {
  return (
    <fieldset className="no-scrollbar m-0 flex min-w-0 items-center gap-1.5 overflow-x-auto border-0 p-0 py-0.5 sm:gap-2">
      <legend className="sr-only">Filter components by interaction</legend>
      <Button
        variant={value === "All" ? "primary" : "chip"}
        size="md"
        aria-pressed={value === "All"}
        onClick={() => onValueChange("All")}
        className={cn(
          "h-9 px-4 text-sm",
          value === "All"
            ? "font-semibold"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </Button>
      {INTERACTION_CATEGORIES.map((category) => {
        const isActive = value === category;
        return (
          <Button
            key={category}
            variant={isActive ? "primary" : "chip"}
            size="md"
            aria-pressed={isActive}
            onClick={() => onValueChange(isActive ? "All" : category)}
            className={cn(
              "h-9 px-4 text-sm",
              isActive
                ? "font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {category}
          </Button>
        );
      })}
    </fieldset>
  );
}
