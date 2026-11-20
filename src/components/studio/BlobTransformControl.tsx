import React, { useState } from "react";
import { SliderControl } from "./StudioControls";
import { cn } from "../../utils/cn";
import { Lock, Unlock } from "../icons";

interface BlobTransformControlProps {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  blur: number;
  empty?: boolean;
  onChange: (patch: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    rot?: number;
    blur?: number;
  }) => void;
}

const ANCHORS_3X3 = [
  { id: "top-left", x: 20, y: 20, label: "Top-Left" },
  { id: "top-center", x: 50, y: 15, label: "Top" },
  { id: "top-right", x: 80, y: 20, label: "Top-Right" },
  { id: "center-left", x: 15, y: 50, label: "Left" },
  { id: "center", x: 50, y: 50, label: "Center" },
  { id: "center-right", x: 85, y: 50, label: "Right" },
  { id: "bottom-left", x: 20, y: 80, label: "Bottom-Left" },
  { id: "bottom-center", x: 50, y: 85, label: "Bottom" },
  { id: "bottom-right", x: 80, y: 80, label: "Bottom-Right" },
];

export const BlobTransformControl: React.FC<BlobTransformControlProps> = ({
  x,
  y,
  w,
  h,
  rot,
  blur,
  empty = false,
  onChange,
}) => {
  const [lockedRatio, setLockedRatio] = useState<boolean>(true);

  // Raport curent W / H (garantat valid)
  const currentRatio = h > 0 ? w / h : 1;

  const handleWidthChange = (newW: number) => {
    if (lockedRatio && currentRatio > 0) {
      const newH = Math.max(5, Math.min(200, Math.round(newW / currentRatio)));
      onChange({ w: newW, h: newH });
    } else {
      onChange({ w: newW });
    }
  };

  const handleHeightChange = (newH: number) => {
    if (lockedRatio && currentRatio > 0) {
      const newW = Math.max(5, Math.min(200, Math.round(newH * currentRatio)));
      onChange({ w: newW, h: newH });
    } else {
      onChange({ h: newH });
    }
  };

  // Detectare punct de ancorare activ pentru grila 3x3
  const activeAnchor = ANCHORS_3X3.find(
    (a) => Math.hypot(a.x - x, a.y - y) <= 8
  )?.id;

  return (
    <div className="space-y-3.5">
      {/* 1. Antet Transformare + Mini-Grilă Aliniere 3x3 discretă */}
      <div className="flex items-center justify-between pb-1 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-tight text-foreground">
            Position & Size
          </span>
          <span className="text-[11px] font-mono text-muted-foreground font-medium">
            X:{Math.round(x)}% Y:{Math.round(y)}%
          </span>
        </div>

        {/* Mini-Grilă 3x3 compactă de aliniere */}
        <div
          className="grid grid-cols-3 gap-0.5 p-1 rounded-md bg-secondary border border-border shrink-0"
          title="Quick alignment (3×3)"
        >
          {ANCHORS_3X3.map((a) => {
            const isActive = activeAnchor === a.id;
            return (
              <button
                key={a.id}
                type="button"
                disabled={empty}
                onClick={() => onChange({ x: a.x, y: a.y })}
                title={`Align: ${a.label}`}
                className={cn(
                  "size-3 rounded-xs transition-colors cursor-pointer flex items-center justify-center",
                  isActive
                    ? "bg-foreground shadow-xs"
                    : "bg-input hover:bg-muted-foreground"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Poziție X și Y */}
      <div className="grid grid-cols-1 gap-1">
        <SliderControl
          label="Position X"
          unit="%"
          value={x}
          min={-20}
          max={120}
          defaultValue={50}
          empty={empty}
          onChange={(v) => onChange({ x: v })}
        />
        <SliderControl
          label="Position Y"
          unit="%"
          value={y}
          min={-20}
          max={120}
          defaultValue={50}
          empty={empty}
          onChange={(v) => onChange({ y: v })}
        />
      </div>

      {/* 3. Dimensiuni W / H cu Proporții Conectate */}
      <div className="space-y-1 pt-1.5 border-t border-border">
        <div className="flex items-center justify-between pb-0.5">
          <span className="text-xs font-medium text-muted-foreground">Dimensions (W × H)</span>
          <button
            type="button"
            disabled={empty}
            onClick={() => setLockedRatio(!lockedRatio)}
            title={
              lockedRatio
                ? "Aspect ratio locked (W and H scale together)"
                : "Free proportions (W and H independent)"
            }
            className={cn(
              "flex items-center gap-1.5 h-6 px-2 rounded-md text-[11px] font-medium border transition-colors cursor-pointer",
              lockedRatio
                ? "bg-secondary border-border text-foreground"
                : "bg-input border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {lockedRatio ? <Lock size={14} /> : <Unlock size={14} />}
            <span>{lockedRatio ? "Locked" : "Free"}</span>
          </button>
        </div>

        <SliderControl
          label="Width (W)"
          unit="%"
          value={w}
          min={5}
          max={200}
          defaultValue={60}
          empty={empty}
          onChange={handleWidthChange}
        />
        <SliderControl
          label="Height (H)"
          unit="%"
          value={h}
          min={5}
          max={200}
          defaultValue={60}
          empty={empty}
          onChange={handleHeightChange}
        />
      </div>

      {/* 4. Rotație & Blur */}
      <div className="space-y-1 pt-1.5 border-t border-border">
        <SliderControl
          label="Rotation"
          unit="°"
          value={rot}
          min={-180}
          max={180}
          defaultValue={0}
          empty={empty}
          onChange={(v) => onChange({ rot: v })}
          ticks={[-180, -90, 0, 90, 180]}
        />
        <SliderControl
          label="Blur"
          unit="px"
          value={blur}
          min={0}
          max={200}
          defaultValue={14}
          ticks={[0, 50, 100, 150, 200]}
          empty={empty}
          onChange={(v) => onChange({ blur: v })}
        />
      </div>
    </div>
  );
};
