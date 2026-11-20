import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Plus, Check, Layers, Search, ArrowRight } from "../icons";
import { TileConfig, GlobalsConfig } from "../../types/gradient";
import { DEFAULT_TILES, PRESET_PACKS, PresetPack } from "../../constants/defaults";
import { GradientTile } from "../GradientTile";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  globals: GlobalsConfig;
  activeTileIndex: number | null;
  onApplyToSelected: (tile: TileConfig) => void;
  onAppendTile: (tile: TileConfig) => void;
  onLoadPack: (pack: PresetPack) => void;
}

export function PresetsModal({
  isOpen,
  onClose,
  globals,
  activeTileIndex,
  onApplyToSelected,
  onAppendTile,
  onLoadPack,
}: PresetsModalProps) {
  const [selectedPackId, setSelectedPackId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedIdx, setAppliedIdx] = useState<number | null>(null);

  // Filtrează lista de preseturi în funcție de pack și căutare
  const displayedPresets = useMemo(() => {
    let list = DEFAULT_TILES.map((tile, originalIdx) => ({
      tile,
      originalIdx,
    }));

    if (selectedPackId !== "all") {
      const pack = PRESET_PACKS.find((p) => p.id === selectedPackId);
      if (pack) {
        list = pack.tileIndices.map((idx) => ({
          tile: DEFAULT_TILES[idx],
          originalIdx: idx,
        }));
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(({ tile }) => {
        const nameMatch = (tile.name || "").toLowerCase().includes(q);
        const tagMatch =
          (tile.noise && "noise granulatie film".includes(q)) ||
          (tile.beamActive && "beam borderbeam laser".includes(q)) ||
          tile.blobs.some((b) => b.blendMode?.includes(q) || (b.echoCount && "echo trail unda".includes(q)));
        return nameMatch || tagMatch;
      });
    }

    return list;
  }, [selectedPackId, searchQuery]);

  const activePack = PRESET_PACKS.find((p) => p.id === selectedPackId);

  const handleApply = (tile: TileConfig, idx: number) => {
    onApplyToSelected(tile);
    setAppliedIdx(idx);
    setTimeout(() => setAppliedIdx(null), 1200);
  };

  const handleAppend = (tile: TileConfig, idx: number) => {
    onAppendTile(tile);
    setAppliedIdx(idx);
    setTimeout(() => setAppliedIdx(null), 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="w-full max-w-4xl max-h-[88vh] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between gap-4 shrink-0 bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-2xl bg-secondary border border-border flex items-center justify-center text-foreground">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
                  Preset Gallery
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground font-mono font-normal">
                    {DEFAULT_TILES.length} Styles
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select a preset for the current tile or load an entire pack onto the canvas
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-full bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search & Packs Tabs Toolbar */}
          <div className="p-3 sm:p-4 border-b border-border flex flex-wrap items-center justify-between gap-3 shrink-0 bg-card">
            {/* Pack Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setSelectedPackId("all")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                  selectedPackId === "all"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground border border-border"
                )}
              >
                All ({DEFAULT_TILES.length})
              </button>
              {PRESET_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => setSelectedPackId(pack.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                    selectedPackId === pack.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground border border-border"
                  )}
                >
                  {pack.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-input border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-hidden focus:border-ring"
              />
            </div>
          </div>

          {/* Active Pack Info Banner (if a specific pack is selected) */}
          {activePack && selectedPackId !== "all" && (
            <div className="px-4 py-2.5 bg-secondary/60 border-b border-border flex items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-foreground shrink-0" />
                <span className="text-foreground font-medium">{activePack.name}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{activePack.description}</span>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  onLoadPack(activePack);
                  onClose();
                }}
                iconRight={<ArrowRight />}
              >
                Load Pack into Canvas
              </Button>
            </div>
          )}

          {/* Presets Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {displayedPresets.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-xs">
                No presets found for "{searchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {displayedPresets.map(({ tile, originalIdx }) => {
                  const hasNoise = !!tile.noise;
                  const hasEcho = tile.blobs.some((b) => (b.echoCount || 0) > 0);
                  const hasPlusLighter = tile.blobs.some((b) => b.blendMode === "plus-lighter");
                  const isSuccess = appliedIdx === originalIdx;

                  return (
                    <div
                      key={originalIdx}
                      className="group p-3 rounded-2xl bg-secondary/40 border border-border hover:border-ring transition-all flex flex-col justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        {/* Mini Tile Preview */}
                        <div className="size-20 rounded-2xl overflow-hidden shrink-0 border border-border shadow-xs relative group-hover:scale-105 transition-transform">
                          <GradientTile
                            tile={tile}
                            globals={{
                              ...globals,
                              animate: false,
                              noise: tile.noise ?? globals.noise,
                              beamActive: false,
                            }}
                            size={80}
                          />
                        </div>

                        {/* Preset Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-foreground truncate">
                            {tile.name || `Preset #${originalIdx + 1}`}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <span>{tile.blobs.length} layers</span>
                            <span>·</span>
                            <span className="font-mono uppercase">{tile.base}</span>
                          </div>

                          {/* Feature Badges */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {hasNoise && (
                              <span className="px-1.5 py-0.5 rounded-sm bg-secondary border border-border text-muted-foreground text-[9px] font-medium">
                                Noise
                              </span>
                            )}
                            {hasEcho && (
                              <span className="px-1.5 py-0.5 rounded-sm bg-secondary border border-border text-muted-foreground text-[9px] font-medium">
                                Echo
                              </span>
                            )}
                            {hasPlusLighter && (
                              <span className="px-1.5 py-0.5 rounded-sm bg-secondary border border-border text-muted-foreground text-[9px] font-medium">
                                +Lighter
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => handleApply(tile, originalIdx)}
                          title="Apply this design to the selected tile"
                          iconLeft={isSuccess ? <Check /> : undefined}
                        >
                          {isSuccess ? "Applied!" : "Apply to Tile"}
                        </Button>

                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => handleAppend(tile, originalIdx)}
                          title="Add this preset as a new tile on the canvas"
                          iconLeft={<Plus />}
                        >
                          + Add
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-border bg-secondary/30 flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <div>
              Selected tile:{" "}
              <span className="text-foreground font-medium">
                {activeTileIndex !== null ? `#${activeTileIndex + 1}` : "None (apply uses the first tile)"}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-secondary hover:bg-accent border border-border text-foreground font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
