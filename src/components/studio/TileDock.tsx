import React from "react";
import { Plus, Dices, Eye, EyeOff, Download, Code2, Loader2, Check } from "../icons";
import { cn } from "../../utils/cn";

export interface TileDockProps {
  onAddBlob: () => void;
  onShuffle: () => void;
  disableBlur: boolean;
  onToggleBlur: () => void;
  onCopyCSS: () => void;
  copiedCSS: boolean;
  onExportModal?: () => void;
  onQuickDownload?: () => void;
  isDownloading?: boolean;
  className?: string;
}

export const TileDock: React.FC<TileDockProps> = ({
  onAddBlob,
  onShuffle,
  disableBlur,
  onToggleBlur,
  onCopyCSS,
  copiedCSS,
  onExportModal,
  onQuickDownload,
  isDownloading = false,
  className,
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "pointer-events-auto select-none flex items-center gap-0.5 p-1 rounded-full",
        "bg-card/95 backdrop-blur-xl border border-border",
        "shadow-md",
        "animate-in fade-in zoom-in-95 duration-200",
        className
      )}
    >
      {/* 1. Add Blob */}
      <button
        type="button"
        onClick={onAddBlob}
        title="Add a new Blob"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95 transition-all cursor-pointer outline-none"
      >
        <Plus size={15} />
        <span>Blob</span>
      </button>

      {/* 2. Shuffle */}
      <button
        type="button"
        onClick={onShuffle}
        title="Randomize colors & positions"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95 transition-all cursor-pointer outline-none"
      >
        <Dices size={15} />
        <span>Shuffle</span>
      </button>

      {/* 3. Toggle Blur */}
      <button
        type="button"
        onClick={onToggleBlur}
        title={disableBlur ? "Enable Blur" : "Disable Blur"}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95 transition-all cursor-pointer outline-none"
      >
        {disableBlur ? (
          <EyeOff size={15} />
        ) : (
          <Eye size={15} />
        )}
        <span>Blur</span>
      </button>

      {/* 4. Copy CSS */}
      <button
        type="button"
        onClick={onCopyCSS}
        title="Copy CSS code to clipboard"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95 transition-all cursor-pointer outline-none"
      >
        {copiedCSS ? (
          <Check size={15} className="text-emerald-500" />
        ) : (
          <Code2 size={15} />
        )}
        <span>{copiedCSS ? "Copied!" : "CSS"}</span>
      </button>

      {/* Fine Vertical Separator */}
      <div className="w-px h-3.5 bg-border mx-1" />

      {/* 5. Quick Download PNG */}
      {onQuickDownload && (
        <button
          type="button"
          disabled={isDownloading}
          onClick={onQuickDownload}
          title="Quick download high-res PNG (2× HD)"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95 transition-all disabled:opacity-50 cursor-pointer outline-none"
        >
          {isDownloading ? (
            <Loader2 size={15} className="text-foreground" />
          ) : (
            <Download size={15} />
          )}
          <span>PNG 2x</span>
        </button>
      )}

      {/* 6. Export Code Modal */}
      {onExportModal && (
        <button
          type="button"
          onClick={onExportModal}
          title="Export code (React, CSS, SVG) & images"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all cursor-pointer outline-none shadow-xs"
        >
          <Code2 size={15} />
          <span>Export</span>
        </button>
      )}
    </div>
  );
};

export default TileDock;
