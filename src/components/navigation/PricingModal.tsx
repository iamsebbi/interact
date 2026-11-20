import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cancel01, Check, Sparkles } from "../icons";
import { Button } from "../ui/button";

export interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: string) => void;
}

export function PricingModal({ isOpen, onClose, onSelectPlan }: PricingModalProps) {
  if (!isOpen) return null;

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
          className="relative w-full max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-card-foreground z-10 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 size-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-border relative">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                <Sparkles size={14} />
                <span>Simple & Transparent Pricing</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Unlock Studio Pro
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Everything you need for generative gradients, GPU shaders, and unlimited code export.
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

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6 relative">
            {/* Free Starter Plan */}
            <div className="rounded-xl border border-border bg-background/60 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Starter</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Ideal for quick exploration and basic gradients.
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground">$0</span>
                  <span className="text-xs text-muted-foreground">free forever</span>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-500 shrink-0" />
                    <span>Access to 10+ preset collections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-500 shrink-0" />
                    <span>Standard CSS & 1x PNG export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-500 shrink-0" />
                    <span>Basic position and blur controls</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground/50">
                    <span className="size-4 shrink-0 text-center font-bold">✕</span>
                    <span>WebGL & WebGPU shader pipeline</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={onClose}
                >
                  Current Plan
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-xl border-2 border-primary/60 bg-gradient-to-b from-primary/5 via-background/80 to-background p-5 sm:p-6 flex flex-col justify-between shadow-lg">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold tracking-wide uppercase shadow-sm">
                Popular
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  Studio Pro
                  <Sparkles size={16} className="text-primary" />
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  For designers, web developers, and advanced creators.
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground">$29</span>
                  <span className="text-xs text-muted-foreground">one-time · lifetime access</span>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-foreground">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>20+ GPU Shaders (GLSL WebGL2 & WGSL WebGPU)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Multi-tile Canvas & full SVG layer editor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>React/Next.js, Tailwind, SVG & 4x Ultra PNG export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Stroboscopic echo, rim glint/bloom & border-beam</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Lifetime updates and unlimited commercial license</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full font-semibold"
                  onClick={() => {
                    onSelectPlan?.("pro");
                    onClose();
                  }}
                  iconLeft={<Sparkles size={16} />}
                >
                  Get Lifetime Pro
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Guarantee */}
          <div className="text-center pt-2 text-xs text-muted-foreground">
            Secured by Stripe / LemonSqueezy · 14-day money-back guarantee, no questions asked.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
