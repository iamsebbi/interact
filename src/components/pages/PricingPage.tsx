import React, { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Accordion } from "@animate-ui/react/primitives/base-ui/accordion";
import {
  Check,
  Cancel01,
  ChevronDown,
  ClaudeIcon,
  CursorIcon,
  OpenAIIcon,
  GeminiIcon,
  CopilotIcon,
  V0Icon,
  VercelIcon,
  LinearIcon,
  FigmaIcon,
  GitHubIcon,
  RaycastIcon,
  SupabaseIcon,
} from "../icons";
import { Button } from "../ui/button";
import {
  Tabs,
  TabsHighlight,
  TabsHighlightItem,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DotMatrixWave } from "../showcase/DotMatrixWave";
import { cn } from "../../utils/cn";

export interface PricingPageProps {
  onNavigateToStudio?: () => void;
  onNavigateToShowcase?: () => void;
}

type BillingCycle = "monthly" | "annual" | "lifetime";
type PlanId = "free" | "pro" | "business";

const AI_AGENTS = [
  { id: "claude", name: "Claude Code", Icon: ClaudeIcon },
  { id: "cursor", name: "Cursor", Icon: CursorIcon },
  { id: "codex", name: "OpenAI Codex", Icon: OpenAIIcon },
  { id: "gemini", name: "Gemini", Icon: GeminiIcon },
  { id: "copilot", name: "GitHub Copilot", Icon: CopilotIcon },
  { id: "v0", name: "v0 by Vercel", Icon: V0Icon },
] as const;

const TRUSTED_COMPANIES = [
  { id: "vercel", name: "Vercel", Icon: VercelIcon },
  { id: "linear", name: "Linear", Icon: LinearIcon },
  { id: "figma", name: "Figma", Icon: FigmaIcon },
  { id: "github", name: "GitHub", Icon: GitHubIcon },
  { id: "raycast", name: "Raycast", Icon: RaycastIcon },
  { id: "supabase", name: "Supabase", Icon: SupabaseIcon },
] as const;

const BILLING_TABS: { id: BillingCycle; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual" },
  { id: "lifetime", label: "Lifetime" },
];

const BILLING_TAB_TRIGGER_CLASS =
  "relative z-10 h-full px-4 rounded-full text-sm font-medium flex items-center justify-center transition-colors cursor-pointer text-muted-foreground hover:text-foreground data-[state=active]:text-primary-foreground data-[state=active]:font-semibold before:content-[''] before:absolute before:-inset-y-1 before:inset-x-0 md:before:hidden";

interface PlanFeatureItem {
  label: string;
  included: boolean;
}

interface PlanPrice {
  amount: number | null;
  period: string;
  note: string;
  disabled?: boolean;
}

interface PlanDef {
  id: PlanId;
  name: string;
  highlighted?: boolean;
  ctaLabel: string;
  pricing: Record<BillingCycle, PlanPrice>;
  features: PlanFeatureItem[];
}

const PLANS: PlanDef[] = [
  {
    id: "free",
    name: "Free",
    ctaLabel: "Browse Free",
    pricing: {
      monthly: { amount: 0, period: "forever", note: "Free forever, no card needed." },
      annual: { amount: 0, period: "forever", note: "Free forever, no card needed." },
      lifetime: { amount: 0, period: "forever", note: "Free forever, no card needed." },
    },
    features: [
      { label: "Free interactive UI components", included: true },
      { label: "Live playground & Quick Config", included: true },
      { label: "Copyable React / TSX code snippets", included: true },
      { label: "Standard CSS & 1x PNG export", included: true },
      { label: "Pro components & AI agent prompts", included: false },
      { label: "Full Studio & multi-format export", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    highlighted: true,
    ctaLabel: "Get Pro",
    pricing: {
      monthly: { amount: 12, period: "/month", note: "Full access for solo builders. Cancel anytime." },
      annual: { amount: 108, period: "/year", note: "Save 25% billed yearly. Cancel anytime." },
      lifetime: { amount: 149, period: "once", note: "Pay once, own every update forever." },
    },
    features: [
      { label: "All interactive React UI components", included: true },
      { label: "Copy-ready AI prompts for every component", included: true },
      { label: "Full Studio with 20+ WebGL2 & WebGPU shaders", included: true },
      { label: "Custom SVG shapes, echo trails & border beams", included: true },
      { label: "React/Tailwind & 4x Ultra PNG export", included: true },
      { label: "Commercial license for solo projects", included: true },
    ],
  },
  {
    id: "business",
    name: "Business",
    ctaLabel: "Get Business",
    pricing: {
      monthly: { amount: 29, period: "/month", note: "Up to 10 team seats. Cancel anytime." },
      annual: { amount: 288, period: "/year", note: "Up to 10 team seats. Save 17% yearly." },
      lifetime: {
        amount: null,
        period: "Monthly & Annual only",
        note: "Switch to Monthly or Annual to subscribe.",
        disabled: true,
      },
    },
    features: [
      { label: "Everything included in Pro", included: true },
      { label: "License for up to 10 team developers", included: true },
      { label: "Shared AI prompt rules & design tokens", included: true },
      { label: "Shared palette & JSON pack export", included: true },
      { label: "Multi-client & SaaS commercial rights", included: true },
      { label: "Priority support via Discord & email", included: true },
    ],
  },
];

const INCLUDED_PILLARS = [
  {
    id: "components",
    title: "Full Components Access",
    description:
      "Every interactive React component, micro-interaction, and copy-ready AI prompt built for production.",
  },
  {
    id: "studio",
    title: "Studio Access",
    description:
      "Complete access to the GPU gradient studio, shader presets, and high-resolution production exports.",
  },
] as const;

const FAQ_ITEMS = [
  {
    id: "commercial",
    question: "Can I use the components and Studio exports in commercial projects?",
    answer:
      "Yes! Pro covers unlimited personal and solo commercial projects, while Business includes commercial rights for teams of up to 10 developers and client SaaS work.",
  },
  {
    id: "billing",
    question: "What is the difference between Monthly, Annual, and Lifetime?",
    answer:
      "Monthly and Annual give full access while active (Annual saves 25% on Pro and 17% on Business), whereas Lifetime is a one-time payment on Pro that unlocks all future components and shader updates forever.",
  },
  {
    id: "business-seats",
    question: "How does the Business plan team license work?",
    answer:
      "Business covers up to 10 developers in your organization, including shared AI prompt rules, design token presets, and shared palette JSON packs across Monthly and Annual billing.",
  },
  {
    id: "updates",
    question: "Will I receive future components and shader updates?",
    answer:
      "Yes. All active Pro and Business subscribers—and all Pro Lifetime holders—get immediate access to every new React component, AI prompt, and WebGPU shader we ship.",
  },
] as const;

export function PricingPage({
  onNavigateToStudio,
  onNavigateToShowcase,
}: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const [activatedPlan, setActivatedPlan] = useState<PlanId | null>(null);
  const redirectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleSelectPlan = (planId: PlanId) => {
    const selected = PLANS.find((plan) => plan.id === planId);
    if (selected?.pricing[billingCycle].disabled) return;
    if (planId === "free") {
      onNavigateToShowcase?.();
      return;
    }
    setActivatedPlan(planId);
    if (redirectTimerRef.current !== null) {
      window.clearTimeout(redirectTimerRef.current);
    }
    redirectTimerRef.current = window.setTimeout(() => {
      setActivatedPlan(null);
      redirectTimerRef.current = null;
      onNavigateToStudio?.();
    }, 1500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-background text-foreground antialiased pb-20">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden min-h-[44vh] sm:min-h-[48vh] flex flex-col items-center justify-center text-center py-10 px-4">
        <DotMatrixWave variant="led" className="absolute inset-0 z-0" />
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center gap-3.5">
          <h1 className="max-w-2xl text-3xl sm:text-5xl font-medium leading-[1.08] tracking-tight text-primary">
            unlock PRO
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
            Full access to every interactive React component, copy-ready AI prompts, and the
            Studio—built to ship polished interfaces faster.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
            {AI_AGENTS.map(({ id, name, Icon }) => (
              <Tooltip key={id}>
                <TooltipTrigger
                  render={
                    <span
                      tabIndex={0}
                      aria-label={name}
                      className="size-10 md:size-9 rounded-full glass-control flex items-center justify-center text-muted-foreground hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-default"
                    >
                      <Icon className="size-[18px] md:size-4" />
                    </span>
                  }
                />
                <TooltipContent>{name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing-plans" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        {/* Billing Cycle Tab Bar */}
        <div className="flex justify-center mb-8">
          <Tabs
            value={billingCycle}
            onValueChange={(v) => setBillingCycle(v as BillingCycle)}
          >
            <TabsHighlight className="absolute inset-0 rounded-full bg-primary shadow-xs">
              <TabsList className="inline-flex h-9 items-center rounded-full bg-secondary/80 p-0.5 ring-1 ring-border">
                {BILLING_TABS.map((tab) => (
                  <TabsHighlightItem key={tab.id} value={tab.id} className="h-full">
                    <TabsTrigger value={tab.id} className={BILLING_TAB_TRIGGER_CLASS}>
                      {tab.label}
                    </TabsTrigger>
                  </TabsHighlightItem>
                ))}
              </TabsList>
            </TabsHighlight>
          </Tabs>
        </div>

        {activatedPlan && (
          <div className="mb-8 p-4 rounded-2xl bg-secondary border border-border text-foreground text-center text-sm font-medium flex items-center justify-center gap-2">
            <Check size={18} className="text-primary" />
            <span>
              Success! {activatedPlan === "pro" ? "Pro" : "Business"} plan activated. Redirecting to Studio...
            </span>
          </div>
        )}

        {/* 3 Tier Cards: Free, Pro, Business */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan) => {
            const price = plan.pricing[billingCycle];
            const isDisabled = Boolean(price.disabled);
            return (
              <div
                key={plan.id}
                aria-disabled={isDisabled || undefined}
                className={cn(
                  "rounded-[28px] bg-card p-6 sm:p-7 flex flex-col justify-between transition-all",
                  plan.highlighted
                    ? "border-2 border-primary"
                    : "border border-border",
                  isDisabled && "opacity-60"
                )}
              >
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {plan.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-baseline gap-1">
                    {price.amount !== null ? (
                      <NumberFlow
                        value={price.amount}
                        prefix="$"
                        format={{ maximumFractionDigits: 0 }}
                        className="text-5xl font-medium tracking-[-0.03em] text-foreground proportional-nums"
                      />
                    ) : (
                      <span className="text-5xl font-medium tracking-[-0.03em] text-muted-foreground proportional-nums">
                        —
                      </span>
                    )}
                    <span className="text-base text-muted-foreground">{price.period}</span>
                  </div>

                  <p className="mt-2 text-sm md:text-[13px] text-muted-foreground leading-relaxed">
                    {price.note}
                  </p>

                  <div className="mt-6 space-y-3 text-sm md:text-[13px]">
                    {plan.features.map((feat) => (
                      <div
                        key={feat.label}
                        className={cn(
                          "flex items-center gap-2.5",
                          feat.included ? "text-foreground" : "text-muted-foreground/45"
                        )}
                      >
                        {feat.included ? (
                          <Check
                            size={16}
                            className={cn(
                              "shrink-0",
                              plan.highlighted ? "text-primary" : "text-foreground"
                            )}
                          />
                        ) : (
                          <Cancel01 size={16} className="shrink-0" />
                        )}
                        <span>{feat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    variant={plan.highlighted ? "primary" : "outline"}
                    size="md"
                    disabled={isDisabled}
                    className="w-full h-11 md:h-9"
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {isDisabled ? "Unavailable on Lifetime" : plan.ctaLabel}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-sm md:text-[13px] text-muted-foreground mb-7">
          Used by designers and engineers at companies like
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {TRUSTED_COMPANIES.map(({ id, name, Icon }) => (
            <div
              key={id}
              className="inline-flex items-center gap-2.5 text-muted-foreground/75 hover:text-foreground transition-colors select-none"
            >
              <Icon className="size-5 sm:size-6" />
              <span className="text-base sm:text-lg font-semibold tracking-tight">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What you will get */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            What you will get
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {INCLUDED_PILLARS.map(({ id, title, description }) => (
            <div
              key={id}
              className="rounded-[28px] border border-border bg-card p-6 sm:p-8 flex flex-col gap-5"
            >
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm md:text-[13px] text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="w-full aspect-video" />
            </div>
          ))}
        </div>
      </section>

      {/* Licensing FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Licensing FAQ
          </h2>
        </div>

        <Accordion.Root
          defaultValue={[FAQ_ITEMS[0].id]}
          className="divide-y divide-border"
        >
          {FAQ_ITEMS.map((item) => (
            <Accordion.Item key={item.id} value={item.id}>
              <Accordion.Header>
                <Accordion.Trigger className="group w-full min-h-12 py-4 flex items-center justify-between gap-4 text-left text-base md:text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
                  <span>{item.question}</span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[panel-open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className="overflow-hidden">
                <div className="pb-4 text-sm md:text-[13px] text-muted-foreground leading-relaxed">
                  {item.answer}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>
    </div>
  );
}
