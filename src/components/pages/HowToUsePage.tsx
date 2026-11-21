import React, { useState } from "react";
import {
  Sparkles,
  Layers01,
  Play,
  Code01,
  Copy01,
  Check,
  ArrowRight01,
  Terminal,
} from "../icons";
import { Button } from "../ui/button";
import { CodeBlock, type CodeLanguage } from "../ui/code-block";
import { getRegistryBaseUrl } from "../studio/registry";

export interface HowToUsePageProps {
  onNavigateToStudio?: () => void;
  onNavigateToShowcase?: () => void;
  onNavigateToPricing?: () => void;
}

interface GuideSnippet {
  title: string;
  lang: CodeLanguage;
  code: string;
}

export function HowToUsePage({
  onNavigateToStudio,
  onNavigateToShowcase,
  onNavigateToPricing,
}: HowToUsePageProps) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const handleCopyCode = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeIdx(idx);
      setTimeout(() => setCopiedCodeIdx(null), 2000);
    } catch {}
  };

  const registryBaseUrl = getRegistryBaseUrl();

  const codeSnippets: GuideSnippet[] = [
    {
      title: "1. Install any component via shadcn CLI",
      lang: "bash",
      code: `# Install directly by registry URL
npx shadcn@latest add ${registryBaseUrl}/bot-avatar.json
npx shadcn@latest add ${registryBaseUrl}/color-picker.json
npx shadcn@latest add ${registryBaseUrl}/palette.json
npx shadcn@latest add ${registryBaseUrl}/wake-slider.json
npx shadcn@latest add ${registryBaseUrl}/gradient.json
npx shadcn@latest add ${registryBaseUrl}/download-button.json`,
    },
    {
      title: "2. Optional: Add @interact namespace in components.json",
      lang: "json",
      code: `{
  "registries": {
    "@interact": "${registryBaseUrl}/{name}.json"
  }
}`,
    },
    {
      title: "3. Render configured components in React / TSX",
      lang: "tsx",
      code: `import { BotAvatar } from "@/components/bot-avatar";
import { WakeSlider } from "@/components/ui/wake-slider";

export function InteractiveCard() {
  return (
    <div className="flex flex-col items-center gap-6 p-8 rounded-3xl border bg-card">
      <BotAvatar shape="squircle" expression="happy" size={160} />
      <WakeSlider defaultValue={64} min={0} max={100} unit="%" />
    </div>
  );
}`,
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-background text-foreground antialiased pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-border/60 py-16 sm:py-24 bg-gradient-to-b from-muted/30 via-background to-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <Sparkles size={14} />
            <span>Usage & Integration Guide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
            Install, customize & ship <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Interactive React UI Components
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore Bot Avatar, Color Picker, OKLCH Palette, Wake Slider, Squircle Gradient, and Download Button in Studio, then install straight into your project with one shadcn CLI command.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {onNavigateToStudio && (
              <Button
                variant="primary"
                size="lg"
                onClick={onNavigateToStudio}
                iconRight={<ArrowRight01 size={18} />}
              >
                Open Studio
              </Button>
            )}
            {onNavigateToShowcase && (
              <Button
                variant="outline"
                size="lg"
                onClick={onNavigateToShowcase}
              >
                Explore Products
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 4 Steps Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            4-Step Workflow
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Zero lock-in, full source ownership, and copy-ready configs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1 */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-primary/15 text-primary">
                  STEP 01
                </span>
                <Terminal size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Install via shadcn CLI
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Every component is distributed as a self-contained registry item. Run <code>npx shadcn@latest add</code> to pull source files and dependencies automatically.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span>Full TypeScript source copied into your repo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span>Automatic npm dependency resolution</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-400">
                  STEP 02
                </span>
                <Layers01 size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Tune Live in Studio
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Open any component in <strong>Studio</strong> to adjust shapes, expressions, OKLCH ramps, kinetic slider physics, or multi-layer squircle gradient blobs.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-cyan-400" />
                  <span>Dedicated inspectors & direct canvas handles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-cyan-400" />
                  <span>Local persistence & undo history</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400">
                  STEP 03
                </span>
                <Play size={20} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Tactile Motion & Accessibility
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Built on <strong>Motion</strong>, <strong>Base UI</strong>, and <strong>Animate UI</strong> icons with spring physics, keyboard navigation, and <code>prefers-reduced-motion</code> support.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-amber-400" />
                  <span>3D gaze tracking, spring loupes & elastic SVG goo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-amber-400" />
                  <span>Keyboard accessible sliders & color channels</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400">
                  STEP 04
                </span>
                <Code01 size={20} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Export JSX, AI Prompts or Assets
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Copy tuned React JSX, an agent-ready AI prompt (with CLI command & props), HTML/CSS, SVG, or high-DPI PNG exports.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Ready for Claude Code, Cursor, Codex & v0</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>All 6 components currently free to install</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            CLI & Integration Examples
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Install via shadcn CLI and drop directly into your React, Vite, or Next.js project.
          </p>
        </div>

        <div className="space-y-6">
          {codeSnippets.map((snippet, idx) => (
            <div
              key={snippet.title}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground font-mono">
                  {snippet.title}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCode(snippet.code, idx)}
                  iconLeft={
                    copiedCodeIdx === idx ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy01 size={14} />
                    )
                  }
                >
                  <span>{copiedCodeIdx === idx ? "Copied!" : "Copy"}</span>
                </Button>
              </div>
              <div className="p-4 sm:p-5 overflow-x-auto bg-secondary/35">
                <CodeBlock code={snippet.code} lang={snippet.lang} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ & Tips */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            FAQ & Technical Notes
          </h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground">
              Do I need an npm package to use interact.dev components?
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              No. Using the <strong>shadcn</strong> registry model, components are copied straight into your codebase so you own and customize every line, while peer libraries like <code>motion</code> or <code>@number-flow/react</code> are installed automatically.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground">
              How does the OKLCH Palette generator avoid muddy colors?
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Standard sRGB/HSL ramps produce uneven brightness and dull midtones. Our <strong>Palette</strong> component computes perceptually uniform ramps in OKLCH space and maps chroma cleanly inside the sRGB gamut.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground">
              Are the components compatible with Tailwind CSS & Next.js?
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Yes. Components use semantic Tailwind tokens and standard React hooks, and <strong>BotAvatar</strong> works even without Tailwind CSS.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-background to-cyan-500/10 p-8 sm:p-12 text-center relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Ready to customize your first component?
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Jump into Studio to tweak every prop visually and copy the CLI command, React JSX, or AI prompt.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {onNavigateToStudio && (
              <Button
                variant="primary"
                size="lg"
                onClick={onNavigateToStudio}
                iconRight={<ArrowRight01 size={18} />}
              >
                Launch Studio
              </Button>
            )}
            {onNavigateToPricing && (
              <Button
                variant="outline"
                size="lg"
                onClick={onNavigateToPricing}
              >
                View Plans & FAQ
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
