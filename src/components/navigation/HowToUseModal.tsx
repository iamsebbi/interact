import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cancel01,
  Sparkles,
  Layers01,
  Play,
  Download04,
  Code01,
  ArrowRight01,
} from "../icons";
import { Button } from "../ui/button";

export interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStudio?: () => void;
}

export function HowToUseModal({
  isOpen,
  onClose,
  onNavigateToStudio,
}: HowToUseModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      step: "01",
      title: "Pick a Starting Preset",
      description:
        "Choose from over 10 curated themes (Riptide, Aurora, Acid Wave, Solar Flare) in Products or use the Palette generator for instant variations.",
      icon: <Sparkles size={20} className="text-primary" />,
    },
    {
      step: "02",
      title: "Customize Layers & Shapes",
      description:
        "In Studio, select each organic blob, drag directly on the canvas to reposition, choose shapes (circle, squircle, drop, star), blur, and blend mode.",
      icon: <Layers01 size={20} className="text-cyan-400" />,
    },
    {
      step: "03",
      title: "Add Motion & Rim Glows",
      description:
        "Enable smooth motion animations (scale, lift, rotate), neon rim effects (bloom, glint, breathe), and traveling border beams.",
      icon: <Play size={20} className="text-amber-400" />,
    },
    {
      step: "04",
      title: "Export Code or Image",
      description:
        "Use Export to copy production-ready CSS, Tailwind, or React / Next.js code, or download high-resolution 2x/4x PNG images.",
      icon: <Code01 size={20} className="text-emerald-400" />,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-card-foreground z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-border">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2">
                <span>Quick Guide</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                How Gradient Blob Works
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Learn the simple 4-step workflow to craft high-impact visual effects.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              aria-label="Close"
            >
              <Cancel01 size={20} />
            </button>
          </div>

          {/* Steps List */}
          <div className="my-6 space-y-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="size-10 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                      {item.step}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="ghost" size="md" onClick={onClose}>
              Got it
            </Button>

            {onNavigateToStudio && (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  onClose();
                  onNavigateToStudio();
                }}
                iconRight={<ArrowRight01 size={18} />}
              >
                Open Studio Pro
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
