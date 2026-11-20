import React, { useState } from "react";
import { TileConfig, GlobalsConfig } from "../../types/gradient";
import {
  generateReactSnippet,
  generateHtmlCssSnippet,
  generateSvgSnippet,
  downloadTileAsPng,
  downloadSvgString,
} from "../../utils/exportCode";
import { cn } from "../../utils/cn";
import { Button } from "../ui/button";
import { CodeBlock } from "../ui/code-block";
import {
  X,
  Copy,
  Check,
  Download,
  Code2,
  FileCode,
  ImageIcon,
  Layers,
  Sparkles,
  Loader2,
} from "../icons";
import { motion, AnimatePresence } from "motion/react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tile: TileConfig;
  globals: GlobalsConfig;
  tileElement: HTMLElement | null;
}

type ExportTab = "image" | "react" | "css" | "svg" | "json";

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  tile,
  globals,
  tileElement,
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>("image");
  const [resolution, setResolution] = useState<number>(2);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const baseFileName = (tile.name || "gradient-tile")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const reactCode = generateReactSnippet(tile, globals);
  const htmlCssCode = generateHtmlCssSnippet(tile, globals);
  const svgCode = generateSvgSnippet(tile, globals);
  const jsonCode = JSON.stringify(tile, null, 2);

  const handleCopy = async (text: string, tabKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tabKey);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadPng = async () => {
    if (!tileElement) return;
    try {
      setIsDownloading(true);
      await downloadTileAsPng(
        tileElement,
        `${baseFileName}-${resolution}x`,
        resolution
      );
    } catch (e) {
      console.error("Failed to download PNG:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSvg = () => {
    downloadSvgString(svgCode, `${baseFileName}-vector`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden text-card-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div
                className="size-4 rounded-full border border-border shadow-xs"
                style={{ backgroundColor: tile.base }}
              />
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Export: {tile.name || "Gradient Tile"}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Download image or generate production-ready code
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs Selector */}
          <div className="flex items-center gap-1 px-6 pt-3 border-b border-border bg-secondary/30">
            {[
              { id: "image", label: "Image (PNG/SVG)", icon: ImageIcon },
              { id: "react", label: "React / Tailwind", icon: Code2 },
              { id: "css", label: "HTML & CSS", icon: FileCode },
              { id: "svg", label: "SVG Code", icon: Sparkles },
              { id: "json", label: "JSON Config", icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ExportTab)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-all cursor-pointer",
                    isActive
                      ? "border-foreground text-foreground bg-secondary/80 rounded-t-lg"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeTab === "image" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-1">
                      PNG Export Resolution
                    </h4>
                    <p className="text-[11px] text-muted-foreground mb-3">
                      Choose the resolution of the exported canvas image:
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 1, label: "1× Standard", desc: `~${globals.size}px` },
                        { val: 2, label: "2× HD Retina", desc: `~${globals.size * 2}px (Recommended)` },
                        { val: 4, label: "4× Ultra 4K", desc: `~${globals.size * 4}px (Crisp)` },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setResolution(item.val)}
                          className={cn(
                            "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                            resolution === item.val
                              ? "bg-primary text-primary-foreground border-transparent shadow-xs"
                              : "bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          <span className="text-xs font-medium">{item.label}</span>
                          <span className="text-[10px] opacity-70">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      disabled={!tileElement}
                      loading={isDownloading}
                      onClick={handleDownloadPng}
                      className="flex-1"
                      iconLeft={<Download />}
                    >
                      Download PNG ({resolution}×)
                    </Button>

                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleDownloadSvg}
                      title="Download vector SVG file compatible with Figma & Illustrator"
                      iconLeft={<Sparkles />}
                    >
                      Download SVG
                    </Button>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground leading-relaxed bg-secondary/30 p-3 rounded-xl border border-border">
                  <p>
                    💡 <strong className="text-foreground">Pro Tip:</strong> The exported PNG preserves all blur, saturation, contrast, and rim glow effects at studio quality.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "react" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Standalone React component, ready to drop into your project
                  </span>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => handleCopy(reactCode, "react")}
                    iconLeft={copiedTab === "react" ? <Check /> : <Copy />}
                  >
                    {copiedTab === "react" ? "Copied!" : "Copy Component"}
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-input/40 border border-border overflow-x-auto max-h-96">
                  <CodeBlock code={reactCode} lang="tsx" className="text-[11px]" />
                </div>
              </div>
            )}

            {activeTab === "css" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Clean HTML + CSS styles
                  </span>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => handleCopy(htmlCssCode, "css")}
                    iconLeft={copiedTab === "css" ? <Check /> : <Copy />}
                  >
                    {copiedTab === "css" ? "Copied!" : "Copy HTML & CSS"}
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-input/40 border border-border overflow-x-auto max-h-96">
                  <CodeBlock code={htmlCssCode} lang="css" className="text-[11px]" />
                </div>
              </div>
            )}

            {activeTab === "svg" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Standalone SVG code with feGaussianBlur filters
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleDownloadSvg}
                      iconLeft={<Download />}
                    >
                      Download .svg
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleCopy(svgCode, "svg")}
                      iconLeft={copiedTab === "svg" ? <Check /> : <Copy />}
                    >
                      {copiedTab === "svg" ? "Copied!" : "Copy SVG"}
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-input/40 border border-border overflow-x-auto max-h-96">
                  <CodeBlock code={svgCode} lang="tsx" className="text-[11px]" />
                </div>
              </div>
            )}

            {activeTab === "json" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Full JSON configuration of the tile
                  </span>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => handleCopy(jsonCode, "json")}
                    iconLeft={copiedTab === "json" ? <Check /> : <Copy />}
                  >
                    {copiedTab === "json" ? "Copied!" : "Copy JSON"}
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-input/40 border border-border overflow-x-auto max-h-96">
                  <CodeBlock code={jsonCode} lang="json" className="text-[11px]" />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
