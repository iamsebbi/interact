"use client";

import NumberFlow from "@number-flow/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Button,
  SegmentedControl,
  SegmentedControlItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/controls";
import {
  Check,
  ClaudeIcon,
  CopilotIcon,
  CursorIcon,
  FigmaIcon,
  GeminiIcon,
  GitHubIcon,
  LinearIcon,
  OpenAIIcon,
  RaycastIcon,
  SupabaseIcon,
  V0Icon,
  VercelIcon,
  X,
} from "@/components/icons";
import { DotMatrixWave } from "@/components/showcase/DotMatrixWave";
import { cn } from "@/lib/utils";

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

const BILLING_TABS: readonly { id: BillingCycle; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual" },
  { id: "lifetime", label: "Lifetime" },
];

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
  features: readonly PlanFeatureItem[];
}

const PLANS: readonly PlanDef[] = [
  {
    id: "free",
    name: "Free",
    ctaLabel: "Browse Free",
    pricing: {
      monthly: {
        amount: 0,
        period: "forever",
        note: "Free forever, no card needed.",
      },
      annual: {
        amount: 0,
        period: "forever",
        note: "Free forever, no card needed.",
      },
      lifetime: {
        amount: 0,
        period: "forever",
        note: "Free forever, no card needed.",
      },
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
      monthly: {
        amount: 12,
        period: "/month",
        note: "Full access for solo builders. Cancel anytime.",
      },
      annual: {
        amount: 108,
        period: "/year",
        note: "Save 25% billed yearly. Cancel anytime.",
      },
      lifetime: {
        amount: 149,
        period: "once",
        note: "Pay once, own every update forever.",
      },
    },
    features: [
      { label: "All interactive React UI components", included: true },
      { label: "Copy-ready AI prompts for every component", included: true },
      {
        label: "Full Studio with 20+ WebGL2 & WebGPU shaders",
        included: true,
      },
      {
        label: "Custom SVG shapes, echo trails & border beams",
        included: true,
      },
      { label: "React/Tailwind & 4x Ultra PNG export", included: true },
      { label: "Commercial license for solo projects", included: true },
    ],
  },
  {
    id: "business",
    name: "Business",
    ctaLabel: "Get Business",
    pricing: {
      monthly: {
        amount: 29,
        period: "/month",
        note: "Up to 10 team seats. Cancel anytime.",
      },
      annual: {
        amount: 288,
        period: "/year",
        note: "Up to 10 team seats. Save 17% yearly.",
      },
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
    question:
      "Can I use the components and Studio exports in commercial projects?",
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

export function PricingContent() {
  const router = useRouter();
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
      router.push("/");
      return;
    }
    setActivatedPlan(planId);
    if (redirectTimerRef.current !== null) {
      window.clearTimeout(redirectTimerRef.current);
    }
    redirectTimerRef.current = window.setTimeout(() => {
      setActivatedPlan(null);
      redirectTimerRef.current = null;
      router.push("/studio");
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full bg-background pb-20 text-foreground antialiased">
      <section className="relative flex min-h-[44vh] w-full flex-col items-center justify-center overflow-hidden px-4 py-10 text-center sm:min-h-[48vh]">
        <DotMatrixWave variant="led" className="absolute inset-0 z-0" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-3.5">
          <h1 className="max-w-2xl text-3xl leading-[1.08] font-medium tracking-tight text-foreground sm:text-5xl">
            unlock PRO
          </h1>
          <p className="max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            Full access to every interactive React component, copy-ready AI
            prompts, and the Studio—built to ship polished interfaces faster.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 sm:gap-3">
            {AI_AGENTS.map(({ id, name, Icon }) => (
              <Tooltip key={id} type="label">
                <TooltipTrigger
                  aria-label={name}
                  className="control-chip flex size-10 cursor-default items-center justify-center rounded-pill text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:size-9"
                >
                  <Icon className="size-[18px] md:size-4" />
                </TooltipTrigger>
                <TooltipContent>{name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing-plans"
        aria-label="Pricing plans"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-6 pb-10 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex justify-center">
          <SegmentedControl
            aria-label="Billing cycle"
            value={billingCycle}
            onValueChange={(next) => {
              if (next) setBillingCycle(next as BillingCycle);
            }}
          >
            {BILLING_TABS.map((tab) => (
              <SegmentedControlItem
                key={tab.id}
                value={tab.id}
                className="px-4"
              >
                {tab.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>

        {activatedPlan && (
          <output className="surface-panel mb-8 flex items-center justify-center gap-2 rounded-lg p-4 text-center text-sm font-medium text-foreground">
            <Check size={18} className="text-foreground" aria-hidden="true" />
            <span>
              Success! {activatedPlan === "pro" ? "Pro" : "Business"} plan
              activated. Redirecting to Studio...
            </span>
          </output>
        )}

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {PLANS.map((plan) => {
            const price = plan.pricing[billingCycle];
            const isDisabled = Boolean(price.disabled);
            return (
              <div
                key={plan.id}
                aria-disabled={isDisabled || undefined}
                className={cn(
                  "surface-panel flex flex-col justify-between rounded-[28px] p-6 transition-all sm:p-7",
                  plan.highlighted && "ring-2 ring-primary",
                  isDisabled && "opacity-60",
                )}
              >
                <div>
                  <h2 className="text-lg font-medium tracking-tight text-foreground">
                    {plan.name}
                  </h2>

                  <div className="mt-4 flex flex-wrap items-baseline gap-1.5">
                    {price.amount !== null ? (
                      <NumberFlow
                        value={price.amount}
                        prefix="$"
                        format={{ maximumFractionDigits: 0 }}
                        className="proportional-nums text-5xl font-medium tracking-[-0.03em] text-foreground"
                      />
                    ) : (
                      <span className="proportional-nums text-5xl font-medium tracking-[-0.03em] text-muted-foreground">
                        —
                      </span>
                    )}
                    <span className="text-base text-muted-foreground">
                      {price.period}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[13px]">
                    {price.note}
                  </p>

                  <ul className="mt-6 space-y-3 text-sm md:text-[13px]">
                    {plan.features.map((feat) => (
                      <li
                        key={feat.label}
                        className={cn(
                          "flex items-center gap-2.5",
                          feat.included
                            ? "text-foreground"
                            : "text-muted-foreground/45",
                        )}
                      >
                        {feat.included ? (
                          <Check
                            size={16}
                            className="shrink-0 text-foreground"
                            aria-hidden="true"
                          />
                        ) : (
                          <X
                            size={16}
                            className="shrink-0"
                            aria-hidden="true"
                          />
                        )}
                        <span>{feat.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    variant={plan.highlighted ? "primary" : "chip"}
                    size="md"
                    disabled={isDisabled}
                    className="h-11 w-full md:h-9"
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

      <section
        aria-label="Trusted companies"
        className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <p className="mb-7 text-center text-sm text-muted-foreground md:text-[13px]">
          Used by designers and engineers at companies like
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {TRUSTED_COMPANIES.map(({ id, name, Icon }) => (
            <div
              key={id}
              className="inline-flex select-none items-center gap-2.5 text-muted-foreground/75 transition-colors hover:text-foreground"
            >
              <Icon className="size-5 sm:size-6" />
              <span className="text-base font-semibold tracking-tight sm:text-lg">
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="included-heading"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-10 text-center">
          <h2
            id="included-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
          >
            What you will get
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {INCLUDED_PILLARS.map(({ id, title, description }) => (
            <div
              key={id}
              className="surface-panel flex flex-col gap-3 rounded-[28px] p-6 sm:p-8"
            >
              <div>
                <h3 className="text-lg font-medium tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-[13px]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="licensing-faq-heading"
        className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-8 text-center">
          <h2
            id="licensing-faq-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
          >
            Licensing FAQ
          </h2>
        </div>

        <Accordion
          variant="flush"
          aria-label="Licensing FAQ"
          defaultValue={[FAQ_ITEMS[0].id]}
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id} variant="flush">
              <AccordionTrigger variant="flush">
                {item.question}
              </AccordionTrigger>
              <AccordionPanel variant="flush">{item.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
