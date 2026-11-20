import React from "react";
import { TileConfig } from "../../types/gradient";
import { cn } from "../../utils/cn";

export interface BlobHandlesOverlayProps {
  tile: TileConfig;
  radius: number;
  blobIdx: number;
  draggingBlob: number | null;
  hoveredBlob: number | null;
  onBlobPointerDown: (
    e: React.PointerEvent<HTMLDivElement>,
    blobIndex: number,
    tileContainer: HTMLElement
  ) => void;
  onBlobWheel: (
    e: React.WheelEvent<HTMLDivElement>,
    blobIndex: number
  ) => void;
}

export const BlobHandlesOverlay: React.FC<BlobHandlesOverlayProps> = ({
  tile,
  radius,
  blobIdx,
  draggingBlob,
  hoveredBlob,
  onBlobPointerDown,
  onBlobWheel,
}) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-40 overflow-visible"
      style={{
        borderRadius: `${radius}%`,
      }}
    >
      {/* Guidelines for actively dragged blob */}
      {draggingBlob !== null && tile.blobs[draggingBlob] && (
        <>
          <div
            className="absolute left-0 right-0 border-t border-dashed border-white/50 pointer-events-none transition-none"
            style={{ top: `${tile.blobs[draggingBlob].y}%` }}
          />
          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-white/50 pointer-events-none transition-none"
            style={{ left: `${tile.blobs[draggingBlob].x}%` }}
          />
        </>
      )}

      {/* Blob Handles */}
      {tile.blobs.map((b, bi) => {
        const isCurrentBlob = bi === blobIdx;
        const isBeingDragged = draggingBlob === bi;
        const isHoveredFromPanel = hoveredBlob === bi;

        return (
          <div
            key={b.id || bi}
            style={{
              position: "absolute",
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
            }}
            onPointerDown={(e) =>
              onBlobPointerDown(
                e,
                bi,
                e.currentTarget.parentElement as HTMLElement
              )
            }
            onWheel={(e) => onBlobWheel(e, bi)}
            onClick={(e) => e.stopPropagation()}
            title={`Blob #${bi + 1} (${b.x}%, ${b.y}%) · Drag to move · Scroll = Size · Shift+Scroll = Rotate`}
            className={cn(
              "group/handle size-6 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-[transform,box-shadow]",
              isCurrentBlob
                ? "ring-2 ring-white ring-offset-2 ring-offset-black/70 scale-110 z-50 shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                : "hover:scale-110 z-40 opacity-85 hover:opacity-100 shadow-md",
              isHoveredFromPanel &&
                "scale-135 ring-4 ring-ring ring-offset-2 ring-offset-background z-50 shadow-md",
              isBeingDragged && "scale-125 cursor-grabbing"
            )}
          >
            {/* Inner badge with color and number */}
            <span
              className="size-full rounded-full border border-white/80 flex items-center justify-center text-[10px] font-bold font-mono text-white shadow-inner"
              style={{
                backgroundColor: b.color,
                textShadow: "0 1px 2px rgba(0,0,0,0.9)",
              }}
            >
              {bi + 1}
            </span>

            {/* Floating Live Coordinates Tag on hover or drag */}
            <div
              className={cn(
                "absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-popover/90 border border-border text-[10px] font-mono text-popover-foreground shadow-xl pointer-events-none whitespace-nowrap transition-opacity",
                isBeingDragged || isHoveredFromPanel
                  ? "opacity-100 bg-secondary border-ring text-foreground font-semibold"
                  : "opacity-0 group-hover/handle:opacity-100"
              )}
            >
              {b.x}% · {b.y}%
            </div>
          </div>
        );
      })}
    </div>
  );
};
