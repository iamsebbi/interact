import React, { useMemo } from "react";
import { TileConfig, BlobConfig } from "../../../types/gradient";
import { getBlobShapeStyle, BLOB_SHAPES } from "../../../constants/shapes";
import { ReorderList, ReorderDragHandle } from "../../reorder-list";
import { Button } from "../../ui/button";
import { ColorPickerControl, SliderControl } from "../StudioControls";
import { BlobShapePicker } from "../BlobShapePicker";
import { BlobTransformControl } from "../BlobTransformControl";
import { Switch } from "../../ui/switch";
import { cn } from "../../../utils/cn";
import {
  Add01,
  Copy01,
  Delete02,
  TrashIcon,
  Layers01,
  Sparkles,
  ChevronDown,
} from "../../icons";

interface BlobLayersTreeProps {
  blobs: BlobConfig[];
  activeBlobIndex: number;
  onSelectBlob: (idx: number) => void;
  onDoubleClickBlob?: (idx: number) => void;
  onHoverBlob: (idx: number) => void;
  onLeaveBlob: () => void;
  onReorderBlobs: (newBlobs: BlobConfig[]) => void;
  onDeleteBlob: (origIdx: number) => void;
}

function BlobLayersTree({
  blobs,
  activeBlobIndex,
  onSelectBlob,
  onDoubleClickBlob,
  onHoverBlob,
  onLeaveBlob,
  onReorderBlobs,
  onDeleteBlob,
}: BlobLayersTreeProps) {
  // Afișăm straturile de la Vârf (top) la Bază (bottom), ca în Figma
  const reversedBlobs = useMemo(() => {
    return (blobs || [])
      .map((b, origIndex) => ({ blob: b, origIndex }))
      .reverse();
  }, [blobs]);

  const handleReorderFinish = (newOrderElements: React.ReactElement[]) => {
    const blobMap = new Map(blobs.map((b) => [b.id!, b]));
    const newOrderIds = newOrderElements
      .map(
        (el) =>
          (el.props as any)["data-blob-id"] ||
          String(el.key).replace(/^(\.|\$)+/, "")
      )
      .filter(Boolean);

    // newOrderElements este Vârf -> Bază, deci pentru stiva tile.blobs (Bază -> Vârf) inversăm
    const nextBlobs = [...newOrderIds]
      .reverse()
      .map((id) => blobMap.get(id)!)
      .filter(Boolean);

    if (nextBlobs.length === blobs.length) {
      onReorderBlobs(nextBlobs);
    }
  };

  return (
    <ReorderList
      withDragHandle
      onReorderFinish={handleReorderFinish}
      itemClassName="rounded-xl overflow-hidden"
      className="w-full"
    >
      {reversedBlobs.map(({ blob, origIndex }) => {
        const isSelected = origIndex === activeBlobIndex;
        const shapeStyle = getBlobShapeStyle(blob);
        const shapePreset =
          BLOB_SHAPES.find((s) => s.id === shapeStyle.shapeId) || BLOB_SHAPES[0];

        return (
          <div
            key={blob.id}
            data-blob-id={blob.id}
            onClick={() => onSelectBlob(origIndex)}
            onDoubleClick={() => onDoubleClickBlob?.(origIndex)}
            onMouseEnter={() => onHoverBlob(origIndex)}
            onMouseLeave={onLeaveBlob}
            className={cn(
              "group flex items-center gap-2.5 h-9 px-2.5 rounded-xl border select-none cursor-pointer transition-colors duration-150",
              isSelected
                ? "bg-primary text-primary-foreground border-transparent shadow-xs ring-1 ring-ring"
                : "bg-secondary/70 border-border text-foreground hover:border-ring hover:bg-secondary"
            )}
          >
            {/* 1. DRAG */}
            <ReorderDragHandle />

            {/* 2. PREVIEW CULOARE & FORMĂ */}
            {shapeStyle.svgPath ? (
              <span
                title={`Shape: ${shapePreset.label}`}
                className="size-4 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105"
              >
                <svg viewBox="0 0 256 256" className="size-full">
                  <path d={shapeStyle.svgPath} fill={blob.color} />
                </svg>
              </span>
            ) : (
              <div
                className="size-4 shrink-0 border border-black/50 shadow-xs flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: blob.color,
                  borderRadius: shapeStyle.borderRadius ?? "50%",
                  clipPath: shapeStyle.clipPath,
                }}
                title={`Shape: ${shapePreset.label}`}
              />
            )}

            {/* 3. HEX & ETICHETĂ FORMĂ */}
            <span className="font-mono text-xs font-semibold tracking-wide uppercase whitespace-nowrap">
              {blob.color.toUpperCase()}
            </span>
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded-md border",
                isSelected
                  ? "bg-primary-foreground/15 border-primary-foreground/30 text-primary-foreground"
                  : "bg-card border-border text-muted-foreground"
              )}
            >
              {shapePreset.label}
            </span>

            {/* 4. DELETE */}
            <div className="ml-auto flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={blobs.length <= 1}
                onClick={(e) => {
                  e.stopPropagation();
                  if (blobs.length > 1) onDeleteBlob(origIndex);
                }}
                className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-20 rounded-md transition-colors"
                title="Delete this layer"
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </ReorderList>
  );
}

export interface StudioTabTileProps {
  isEmpty: boolean;
  tile: TileConfig;
  blobIdx: number;
  blob: BlobConfig;
  addBlob: () => void;
  duplicateBlob: () => void;
  removeBlob: () => void;
  removeSpecificBlob: (index: number) => void;
  setBi: (idx: number) => void;
  setHoveredBlob: (idx: number | null) => void;
  patchTile: (patch: Partial<TileConfig>) => void;
  patchBlob: (patch: Partial<BlobConfig>) => void;
  openAspect: boolean;
  setOpenAspect: React.Dispatch<React.SetStateAction<boolean>>;
  openTransform: boolean;
  setOpenTransform: React.Dispatch<React.SetStateAction<boolean>>;
  openFinishes: boolean;
  setOpenFinishes: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StudioTabTile: React.FC<StudioTabTileProps> = ({
  isEmpty,
  tile,
  blobIdx,
  blob,
  addBlob,
  duplicateBlob,
  removeBlob,
  removeSpecificBlob,
  setBi,
  setHoveredBlob,
  patchTile,
  patchBlob,
  openAspect,
  setOpenAspect,
  openTransform,
  setOpenTransform,
  openFinishes,
  setOpenFinishes,
}) => {
  return (
    <>
      {/* 1. LAYER STACK */}
      <div className="space-y-2 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-tight text-white flex items-center gap-1.5">
              <Layers01 size={16} className="text-foreground" />
              Blob Layers
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-secondary text-foreground border border-border">
              {tile.blobs.length}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={addBlob}
              disabled={isEmpty}
              aria-label="Add new layer"
              title="Add new layer"
              className="size-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Add01 size={16} />
            </button>
            <button
              type="button"
              onClick={duplicateBlob}
              disabled={isEmpty}
              aria-label="Duplicate selected layer"
              title="Duplicate selected layer (D key)"
              className="size-8 rounded-lg bg-secondary hover:bg-accent text-foreground flex items-center justify-center border border-border transition-colors cursor-pointer"
            >
              <Copy01 size={16} />
            </button>
            <button
              type="button"
              onClick={removeBlob}
              disabled={isEmpty || tile.blobs.length <= 1}
              aria-label="Delete selected layer"
              title="Delete selected layer (Delete)"
              className="size-8 rounded-lg bg-secondary hover:bg-accent disabled:opacity-30 text-muted-foreground flex items-center justify-center border border-border transition-colors cursor-pointer"
            >
              <Delete02 size={16} />
            </button>
          </div>
        </div>

        {/* Reorderable Layer Tree */}
        <div className="max-h-44 overflow-y-auto no-scrollbar pt-0.5">
          <BlobLayersTree
            blobs={tile.blobs}
            activeBlobIndex={blobIdx}
            onSelectBlob={(idx) => setBi(idx)}
            onHoverBlob={(idx) => !isEmpty && setHoveredBlob(idx)}
            onLeaveBlob={() => setHoveredBlob(null)}
            onReorderBlobs={(newBlobs) => {
              const activeBlobId = tile.blobs[blobIdx]?.id;
              patchTile({ blobs: newBlobs });
              if (activeBlobId) {
                const nextIdx = newBlobs.findIndex((b) => b.id === activeBlobId);
                if (nextIdx !== -1) setBi(nextIdx);
              }
            }}
            onDeleteBlob={(origIdx) => removeSpecificBlob(origIdx)}
          />
        </div>
      </div>

      {/* 2. SELECTED LAYER PROPERTIES */}
      <div className="space-y-3 pt-0.5">
        {/* Section 2A: Appearance (Color & Shape) */}
        <div className="rounded-2xl bg-secondary/40 border border-border p-3 space-y-3">
          <button
            type="button"
            onClick={() => setOpenAspect((p) => !p)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground transition-colors">
                Layer #{blobIdx + 1} Appearance
              </span>
              <span
                className="size-2.5 rounded-full border border-black/40 shadow-xs"
                style={{ backgroundColor: blob.color }}
              />
            </div>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200",
                !openAspect && "-rotate-90"
              )}
            />
          </button>

          {openAspect && (
            <div className="space-y-3 pt-1">
              <ColorPickerControl
                label="Color"
                value={blob.color}
                empty={isEmpty}
                onChange={(v) => patchBlob({ color: v })}
                alpha={true}
              />

              <BlobShapePicker
                value={blob.shape}
                pill={blob.pill}
                empty={isEmpty}
                onChange={(newShape) =>
                  patchBlob({
                    shape: newShape,
                    pill: newShape === "pill",
                  })
                }
              />
            </div>
          )}
        </div>

        {/* Section 2B: Transform */}
        <div className="rounded-2xl bg-secondary/40 border border-border p-3 space-y-3">
          <button
            type="button"
            onClick={() => setOpenTransform((p) => !p)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <span className="text-xs font-semibold text-foreground transition-colors">
              Transform
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200",
                !openTransform && "-rotate-90"
              )}
            />
          </button>

          {openTransform && (
            <div className="pt-1">
              <BlobTransformControl
                x={blob.x}
                y={blob.y}
                w={blob.w}
                h={blob.h}
                rot={blob.rot}
                blur={blob.blur}
                empty={isEmpty}
                onChange={(patch) => patchBlob(patch)}
              />
            </div>
          )}
        </div>

        {/* Section 2C: Blend & Echo */}
        <div className="rounded-2xl bg-secondary/40 border border-border p-3 space-y-3">
          <button
            type="button"
            onClick={() => setOpenFinishes((p) => !p)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <span className="text-xs font-semibold text-foreground transition-colors">
              Blend & Echo
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200",
                !openFinishes && "-rotate-90"
              )}
            />
          </button>

          {openFinishes && (
            <div className="space-y-3 pt-1">
              {/* Blend Mode */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Blend Mode</label>
                  {blob.blendMode && blob.blendMode !== "normal" && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card text-foreground border border-border">
                      {blob.blendMode}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(
                    [
                      ["normal", "Normal"],
                      ["plus-lighter", "✦ Plus Lighter"],
                      ["screen", "Screen"],
                      ["overlay", "Overlay"],
                      ["color-dodge", "Color Dodge"],
                      ["soft-light", "Soft Light"],
                    ] as const
                  ).map(([modeVal, modeLabel]) => {
                    const isCurrent = (blob.blendMode || "normal") === modeVal;
                    return (
                      <button
                        key={modeVal}
                        type="button"
                        onClick={() => patchBlob({ blendMode: modeVal })}
                        className={cn(
                          "px-1.5 py-1 text-[11px] font-medium rounded-md border transition-colors cursor-pointer text-center",
                          isCurrent
                            ? "bg-primary text-primary-foreground border-transparent shadow-xs"
                            : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {modeLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Echo & Shockwave */}
              <div className="pt-2 border-t border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Sparkles size={16} className="text-amber-400" />
                    Echo & Shockwave
                  </span>
                  {(blob.echoCount ?? 0) > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {blob.echoCount} steps
                    </span>
                  )}
                </div>

                <SliderControl
                  label="Echo Steps"
                  value={blob.echoCount ?? 0}
                  min={0}
                  max={8}
                  step={1}
                  defaultValue={0}
                  empty={isEmpty}
                  onChange={(v) => patchBlob({ echoCount: Math.round(v) })}
                />

                {(blob.echoCount ?? 0) > 0 && (
                  <div className="space-y-2.5 pl-2 border-l border-amber-500/30">
                    <SliderControl
                      label="Step Distance"
                      unit="%"
                      value={blob.echoOffset ?? 12}
                      min={4}
                      max={35}
                      defaultValue={12}
                      empty={isEmpty}
                      onChange={(v) => patchBlob({ echoOffset: v })}
                    />

                    {/* Echo Direction Selector */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Propagation Direction</label>
                      <div className="grid grid-cols-4 gap-1">
                        {(
                          [
                            ["right", "→ Right"],
                            ["left", "← Left"],
                            ["top", "↑ Top"],
                            ["bottom", "↓ Bottom"],
                          ] as const
                        ).map(([dirVal, dirLabel]) => (
                          <button
                            key={dirVal}
                            type="button"
                            onClick={() => patchBlob({ echoDirection: dirVal })}
                            className={cn(
                              "px-1.5 py-1 text-[10px] font-medium rounded border transition-colors cursor-pointer text-center",
                              (blob.echoDirection || "right") === dirVal
                                ? "bg-amber-500/20 text-amber-200 border-amber-500/40"
                                : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                            )}
                          >
                            {dirLabel}
                          </button>
                        ))}
                      </div>
                    </div>

                    <SliderControl
                      label="Progressive Scale"
                      unit="×"
                      value={blob.echoScaleStep ?? 1.15}
                      min={0.9}
                      max={1.4}
                      step={0.02}
                      defaultValue={1.15}
                      empty={isEmpty}
                      onChange={(v) => patchBlob({ echoScaleStep: v })}
                    />

                    <SliderControl
                      label="Opacity Fade"
                      unit="%"
                      value={Math.round((blob.echoFade ?? 0.75) * 100)}
                      min={30}
                      max={95}
                      step={5}
                      defaultValue={75}
                      empty={isEmpty}
                      onChange={(v) => patchBlob({ echoFade: v / 100 })}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
