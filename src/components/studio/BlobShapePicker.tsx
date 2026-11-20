import React, { useState } from "react";
import {
  BLOB_SHAPES,
  SHAPE_PACKS,
  BlobShapePreset,
  ShapePack,
} from "../../constants/shapes";
import { BlobShape } from "../../types/gradient";
import { cn } from "../../utils/cn";
import { Dices } from "../icons";
import { Component as FluidDropdown, Category } from "../ui/fluid-dropdown";

interface BlobShapePickerProps {
  value?: BlobShape;
  pill?: boolean;
  empty?: boolean;
  onChange: (shape: BlobShape) => void;
}

function ShapeIcon({ shape, className }: { shape: BlobShapePreset; className?: string }) {
  if (shape.svgPath) {
    return (
      <svg viewBox="0 0 256 256" fill="currentColor" className={className}>
        <path d={shape.svgPath} />
      </svg>
    );
  }

  switch (shape.id) {
    case "circle":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="12" r="8.5" />
        </svg>
      );
    case "pill":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <rect x="3" y="7" width="18" height="10" rx="5" />
        </svg>
      );
    case "squircle":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5.5" />
        </svg>
      );
    case "organic":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 3.5C17.5 3.5 20.5 7.5 20.5 12C20.5 17.5 16.5 20.5 11.5 20.5C6.5 20.5 3.5 16.5 3.5 12C3.5 7.5 6.5 3.5 12 3.5Z" />
        </svg>
      );
    case "fluid":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M6 4C13 4 20 8 20 13.5C20 18 16 20 10.5 20C5 20 4 15 4 10C4 6 5 4 6 4Z" />
        </svg>
      );
    case "teardrop":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 3.5C12 3.5 20 11.5 20 16C20 19 16.5 21 12 21C7.5 21 4 19 4 16C4 11.5 12 3.5 12 3.5Z" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <rect
            x="5.5"
            y="5.5"
            width="13"
            height="13"
            rx="3"
            transform="rotate(45 12 12)"
          />
        </svg>
      );
    case "petal":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M4.5 19.5C4.5 10 10 4.5 19.5 4.5C19.5 14 14 19.5 4.5 19.5Z" />
        </svg>
      );
    case "egg":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <ellipse cx="12" cy="12.5" rx="7" ry="8.5" />
        </svg>
      );
    case "pebble":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M7 5C14 4 20 7 20 12.5C20 17 15 20 9 20C4 20 3.5 15.5 4 10.5C4.5 6.5 5.5 5.5 7 5Z" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2.5L14.6 9.4L21.5 12L14.6 14.6L12 21.5L9.4 14.6L2.5 12L9.4 9.4Z" />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <polygon points="12,3.5 20.5,19.5 3.5,19.5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="12" r="8.5" />
        </svg>
      );
  }
}

export const BlobShapePicker: React.FC<BlobShapePickerProps> = ({
  value,
  pill,
  empty = false,
  onChange,
}) => {
  const currentShapeId: BlobShape = value ?? (pill ? "pill" : "circle");

  // Pachetul inițial pe baza formei curente
  const [activePackId, setActivePackId] = useState<string>(() => {
    return (
      SHAPE_PACKS.find((p) => p.shapes.some((s) => s.id === currentShapeId))?.id ||
      "pack-1"
    );
  });

  const prevShapeRef = React.useRef(currentShapeId);

  // Sincronizare la schimbare externă
  React.useEffect(() => {
    if (prevShapeRef.current !== currentShapeId) {
      prevShapeRef.current = currentShapeId;
      const foundPack = SHAPE_PACKS.find((p) =>
        p.shapes.some((s) => s.id === currentShapeId)
      );
      if (foundPack) {
        setActivePackId(foundPack.id);
      }
    }
  }, [currentShapeId]);

  const dropdownCategories: Category[] = SHAPE_PACKS.map((pack) => ({
    id: pack.id,
    label: pack.label,
    icon: pack.icon,
    color: pack.color,
  }));

  const selectedCategory =
    dropdownCategories.find((c) => c.id === activePackId) || dropdownCategories[0];

  const currentPack: ShapePack =
    SHAPE_PACKS.find((p) => p.id === activePackId) || SHAPE_PACKS[0];

  const activePreset: BlobShapePreset =
    BLOB_SHAPES.find((s) => s.id === currentShapeId) || BLOB_SHAPES[0];

  const handleRandomize = () => {
    if (empty || currentPack.shapes.length === 0) return;
    const candidates = currentPack.shapes.filter((s) => s.id !== currentShapeId);
    const pool = candidates.length > 0 ? candidates : currentPack.shapes;
    const random = pool[Math.floor(Math.random() * pool.length)];
    onChange(random.id);
  };

  return (
    <div className="space-y-2.5 py-1.5">
      {/* 1. Selectorul de Pachete */}
      <div className="space-y-1 relative z-30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Shape Pack</span>
          <span className="text-xs text-muted-foreground font-mono">
            {currentPack.shapes.length} shapes
          </span>
        </div>

        <FluidDropdown
          categories={dropdownCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setActivePackId(cat.id);
          }}
          className="z-30"
        />
      </div>

      {/* 2. Container Preview, Grid & Informații despre Forma Activă */}
      <div className="relative z-10 p-2.5 rounded-xl bg-secondary/80 border border-border space-y-2">
        {/* Header Preview & Randomize */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-medium text-muted-foreground shrink-0">Shape:</span>
            {!empty && (
              <span className="text-xs font-semibold text-foreground font-mono truncate">
                {activePreset.label}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleRandomize}
            disabled={empty || currentPack.shapes.length === 0}
            title="Pick a random shape from this pack"
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 cursor-pointer shrink-0 ml-2"
          >
            <Dices size={14} />
            <span>Random</span>
          </button>
        </div>

        {/* Grid-ul de forme */}
        {currentPack.shapes.length > 0 ? (
          <div className="max-h-56 overflow-y-auto pr-0.5 grid grid-cols-6 gap-1 p-1 rounded-lg bg-card/60 border border-border">
            {currentPack.shapes.map((shape) => {
              const isSelected = !empty && currentShapeId === shape.id;

              return (
                <button
                  key={shape.id}
                  type="button"
                  disabled={empty}
                  onClick={() => onChange(shape.id)}
                  title={`${shape.label} · ${shape.description}`}
                  className={cn(
                    "group relative flex flex-col items-center justify-center h-8 rounded-md transition-all cursor-pointer outline-none",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-ring"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <ShapeIcon
                    shape={shape}
                    className={cn(
                      "size-4.5 transition-transform duration-150 group-hover:scale-110",
                      isSelected ? "text-primary-foreground scale-105" : "text-muted-foreground"
                    )}
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-4 px-2 text-center rounded-lg bg-card border border-dashed border-border text-[11px] text-muted-foreground">
            <p className="font-medium text-foreground mb-0.5">Pachet gol</p>
          </div>
        )}

        {/* Descriere subtilă a formei selectate */}
        {!empty && (
          <p className="text-[10px] text-muted-foreground px-0.5 line-clamp-1 italic">
            {activePreset.description}
          </p>
        )}
      </div>
    </div>
  );
};
