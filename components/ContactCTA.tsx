"use client";

import { useState, useTransition, useOptimistic } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, Loader2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Section, GridItem } from "./Section";

interface FormState {
  services: string[];
  budget: string;
  timeline: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export function ContactCTA() {
  const { language } = useTheme();
  const isRO = language === "RO";

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [isPending, startTransition] = useTransition();

  // React 19 Optimistic State on submit action
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    submitStatus,
    (_current, next: "idle" | "submitting" | "success") => next
  );

  const [form, setForm] = useState<FormState>({
    services: [],
    budget: "",
    timeline: "",
    description: "",
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const serviceOptions = isRO
    ? [
        "Dezvoltare Web & Next.js",
        "Design UI/UX & Produs",
        "Arhitectură de Brand & Vizuală",
        "Inginerie Creativă & Animații",
        "Consultanță & Direcție Tehnică",
        "Proiect Personalizat",
      ]
    : [
        "Web Development & Next.js",
        "UI/UX & Product Design",
        "Brand & Visual Architecture",
        "Creative Engineering & Motion",
        "Technical Direction & Advisory",
        "Bespoke Digital System",
      ];

  const budgetOptions = [
    "< €2,500",
    "€2,500 – €5,000",
    "€5,000 – €10,000",
    "€10,000+",
  ];

  const timelineOptions = isRO
    ? [
        "Urgent (< 3 săptămâni)",
        "1 – 2 luni",
        "3+ luni",
        "Termen flexibil",
      ]
    : [
        "Urgent (< 3 weeks)",
        "1 – 2 months",
        "3+ months",
        "Flexible timeline",
      ];

  const toggleService = (service: string) => {
    setForm((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || optimisticStatus !== "idle") return;

    startTransition(async () => {
      // 1. Optimistic feedback: immediately show submitting state
      setOptimisticStatus("submitting");

      // 2. Simulated response latency (mail logic to be added later)
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 3. Optimistic success feedback in button
      setOptimisticStatus("success");
      setSubmitStatus("success");

      // 4. Reset button back to idle after 3s
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    });
  };

  return (
    <Section
      id="contact-cta"
      className="bg-background text-foreground"
    >
      {/* LEFT COLUMN: STANDARDIZED EDITORIAL TYPOGRAPHY */}
      <GridItem
        span="col-span-full lg:col-span-4"
        className="flex flex-col justify-between space-y-6 lg:min-h-[490px]"
      >
        <div className="space-y-4">
          <div>
            <span className="font-lekton text-xs uppercase tracking-editorial font-normal text-foreground/60 block">
              {isRO ? "CONTACT & DISCUȚIE" : "GET IN TOUCH"}
            </span>
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-normal uppercase tracking-tight text-foreground leading-tight mt-1">
              {isRO ? "START YOUR OWN PROJECT" : "START YOUR OWN PROJECT"}
            </h2>
          </div>

          <div className="space-y-3 pt-3 font-lekton text-sm leading-relaxed text-foreground/80">
            <p>
              {isRO
                ? "Spune-mi ce construiești, în ce etapă te afli și cu ce ai nevoie de ajutor."
                : "Tell us what you're building, where you are in the process, and what you need help with."}
            </p>
            <p>
              {isRO
                ? "Completează formularul și preiau eu de acolo."
                : "Fill out the form and we'll take it from there."}
            </p>
          </div>
        </div>

        <div className="pt-6 space-y-3">
          <span className="font-lekton text-xs uppercase tracking-editorial font-normal text-foreground/60 block">
            {isRO ? "CONTACT DIRECT" : "DIRECT INQUIRY"}
          </span>

          <div className="space-y-2 pt-1">
            {/* ROW 1: MAIL */}
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="font-lekton text-xs uppercase tracking-editorial text-foreground/50 shrink-0">
                MAIL:
              </span>
              <a
                href="mailto:hello.iamsebbi@gmail.com"
                title="hello.iamsebbi@gmail.com"
                className="font-heading text-xs sm:text-sm uppercase tracking-tight text-foreground hover:text-primary transition-colors truncate-ellipsis"
              >
                HELLO.IAMSEBBI@GMAIL.COM
              </a>
            </div>

            {/* ROW 2: WHATSAPP */}
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="font-lekton text-xs uppercase tracking-editorial text-foreground/50 shrink-0">
                WHATSAPP:
              </span>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                title="CLICK TO CHAT"
                className="font-heading text-xs sm:text-sm uppercase tracking-tight text-foreground hover:text-primary transition-colors truncate-ellipsis"
              >
                CLICK TO CHAT
              </a>
            </div>
          </div>
        </div>
      </GridItem>

      {/* CENTER COLUMN: BRAND ASTERISK MOTIF */}
      <GridItem
        span="col-span-full lg:col-span-4"
        className="flex items-center justify-center py-8 lg:py-0 self-center lg:min-h-[490px]"
      >
        <svg
          viewBox="0 0 150 150"
          className="w-20 h-20 sm:w-24 sm:h-24 lg:w-36 lg:h-36 xl:w-44 xl:h-44 text-foreground select-none"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g transform="translate(75, 75)">
            <rect x="-13" y="-57" width="26" height="57" transform="rotate(0)" />
            <rect x="-13" y="-57" width="26" height="57" transform="rotate(72)" />
            <rect x="-13" y="-57" width="26" height="57" transform="rotate(144)" />
            <rect x="-13" y="-57" width="26" height="57" transform="rotate(216)" />
            <rect x="-13" y="-57" width="26" height="57" transform="rotate(288)" />
            <circle r="13" />
          </g>
        </svg>
      </GridItem>

      {/* RIGHT COLUMN: EDITORIAL STEP-BY-STEP FORM (GOOGLE SANS FONT) */}
      <GridItem
        span="col-span-full lg:col-span-4"
        className="mt-8 lg:mt-0"
      >
        <div className="flex flex-col justify-between min-h-[470px] sm:min-h-[490px]">
            {/* STEP PROGRESS HEADER */}
            <div className="flex items-center justify-between pb-3">
              <span className="font-lekton text-xs uppercase tracking-editorial font-normal text-foreground/60">
                {currentStep === 1 && (isRO ? "SERVICII & SCOP" : "SCOPE OF WORK")}
                {currentStep === 2 && (isRO ? "BUGET & TERMEN" : "BUDGET & TIMELINE")}
                {currentStep === 3 && (isRO ? "DETALII PROIECT" : "PROJECT BRIEF")}
                {currentStep === 4 && (isRO ? "DATE DE CONTACT" : "YOUR DETAILS")}
              </span>

              {/* Minimal line progress */}
              <div className="w-20 sm:w-28 h-px bg-border/80 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP CONTENT WRAPPER */}
            <div className="flex-1 py-4 flex flex-col justify-start min-h-[350px]">
              {/* STEP 1: SERVICES */}
              {currentStep === 1 && (
                <div className="space-y-3 pt-1">
                  <span className="font-heading text-xs sm:text-sm uppercase tracking-editorial text-foreground/75 block">
                    {isRO ? "Ce tip de proiect construim?" : "What are we collaborating on?"}
                  </span>

                  <div className="flex flex-col gap-2 pt-1">
                    {serviceOptions.map((service) => {
                      const selected = form.services.includes(service);
                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          className={`group w-full flex items-center justify-between py-2 px-3.5 border rounded-none text-left font-heading text-xs sm:text-sm uppercase tracking-editorial font-medium transition-colors duration-150 cursor-pointer ${
                            selected
                              ? "bg-foreground text-background border-foreground"
                              : "bg-transparent text-foreground/80 border-border/80 hover:border-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]"
                          }`}
                        >
                          <span>{service}</span>
                          <span className="shrink-0 flex items-center justify-center pl-2 w-5 h-5">
                            {selected ? (
                              <Check className="w-3.5 h-3.5 text-background" strokeWidth={2.5} />
                            ) : (
                              <Plus className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: BUDGET & TIMELINE */}
              {currentStep === 2 && (
                <div className="space-y-4 pt-1">
                  <div>
                    <span className="font-heading text-xs sm:text-sm uppercase tracking-editorial text-foreground/75 block mb-2">
                      {isRO ? "Buget estimat" : "Anticipated Investment"}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {budgetOptions.map((b) => {
                        const selected = form.budget === b;
                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setForm({ ...form, budget: b })}
                            className={`py-2 px-3 border rounded-none text-center font-heading text-xs sm:text-sm uppercase tracking-editorial font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                              selected
                                ? "bg-foreground text-background border-foreground"
                                : "bg-transparent text-foreground/80 border-border/80 hover:border-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]"
                            }`}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2.5">
                    <span className="font-heading text-xs sm:text-sm uppercase tracking-editorial text-foreground/75 block mb-2">
                      {isRO ? "Termen dorit" : "Desired Timeline"}
                    </span>
                    <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                      {timelineOptions.map((t) => {
                        const selected = form.timeline === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setForm({ ...form, timeline: t })}
                            className={`group w-full flex items-center justify-between py-2 px-3.5 border rounded-none text-left font-heading text-xs sm:text-sm uppercase tracking-editorial font-medium transition-colors duration-150 cursor-pointer ${
                              selected
                                ? "bg-foreground text-background border-foreground"
                                : "bg-transparent text-foreground/80 border-border/80 hover:border-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]"
                            }`}
                          >
                            <span>{t}</span>
                            <span className="shrink-0 flex items-center justify-center pl-2 w-5 h-5">
                              {selected ? (
                                <Check className="w-3.5 h-3.5 text-background" strokeWidth={2.5} />
                              ) : (
                                <Plus className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: BRIEF */}
              {currentStep === 3 && (
                <div className="space-y-2 pt-1 flex-1 flex flex-col">
                  <span className="font-heading text-xs sm:text-sm uppercase tracking-editorial text-foreground/75 block">
                    {isRO ? "Descrierea proiectului (obligatoriu)" : "Project Overview (required)"}
                  </span>
                  <textarea
                    rows={6}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder={
                      isRO
                        ? "Spune-mi pe scurt despre scopul, viziunea sau provocările proiectului tău..."
                        : "Tell us a bit about your goals, audience, or the challenge you want to solve..."
                    }
                    className="w-full flex-1 min-h-[160px] py-2 bg-transparent border-b border-border/80 focus:border-foreground text-foreground font-heading text-base focus:outline-none transition-colors resize-none placeholder:text-foreground/25 leading-relaxed"
                  />
                </div>
              )}

              {/* STEP 4: DETAILS */}
              {currentStep === 4 && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
                    <div className="flex flex-col space-y-1 border-b border-border/80 focus-within:border-foreground pb-1.5 transition-colors">
                      <label className="font-heading text-xs uppercase tracking-editorial text-foreground/60">
                        {isRO ? "Nume (obligatoriu)" : "Name (required)"}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder={isRO ? "Numele tău" : "Your Name"}
                        className="w-full bg-transparent font-heading text-base text-foreground focus:outline-none placeholder:text-foreground/25"
                      />
                    </div>

                    <div className="flex flex-col space-y-1 border-b border-border/80 focus-within:border-foreground pb-1.5 transition-colors">
                      <label className="font-heading text-xs uppercase tracking-editorial text-foreground/60">
                        {isRO ? "Email (obligatoriu)" : "Email (required)"}
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="hello@domain.com"
                        className="w-full bg-transparent font-heading text-base text-foreground focus:outline-none placeholder:text-foreground/25"
                      />
                    </div>

                    <div className="flex flex-col space-y-1 border-b border-border/80 focus-within:border-foreground pb-1.5 transition-colors">
                      <label className="font-heading text-xs uppercase tracking-editorial text-foreground/60">
                        {isRO ? "Telefon (Opțional)" : "Phone (Optional)"}
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="+40 7..."
                        className="w-full bg-transparent font-heading text-base text-foreground focus:outline-none placeholder:text-foreground/25"
                      />
                    </div>

                    <div className="flex flex-col space-y-1 border-b border-border/80 focus-within:border-foreground pb-1.5 transition-colors">
                      <label className="font-heading text-xs uppercase tracking-editorial text-foreground/60">
                        {isRO ? "Companie / URL (Opțional)" : "Company / URL (Optional)"}
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) =>
                          setForm({ ...form, company: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full bg-transparent font-heading text-base text-foreground focus:outline-none placeholder:text-foreground/25"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* NAVIGATION CONTROLS */}
            <div className="flex items-center justify-between pt-5">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="font-heading text-xs sm:text-sm uppercase tracking-editorial text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
                  <span>{isRO ? "Înapoi" : "Previous"}</span>
                </button>
              ) : (
                <span />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="font-heading text-xs sm:text-sm uppercase tracking-widest bg-foreground text-background hover:bg-primary hover:text-foreground px-6 py-2.5 transition-colors flex items-center gap-2 font-medium cursor-pointer group"
                >
                  <span>{isRO ? "Continuă" : "Continue"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!form.name || !form.email || optimisticStatus === "submitting"}
                  className={`font-heading text-xs sm:text-sm uppercase tracking-widest px-7 py-2.5 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group ${
                    optimisticStatus === "success"
                      ? "bg-foreground text-background"
                      : "bg-primary text-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  <span>
                    {optimisticStatus === "submitting"
                      ? isRO
                        ? "Se trimite..."
                        : "Submitting..."
                      : optimisticStatus === "success"
                      ? isRO
                        ? "Trimis"
                        : "Submitted"
                      : isRO
                      ? "Trimite"
                      : "Submit"}
                  </span>
                  {optimisticStatus === "submitting" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : optimisticStatus === "success" ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                  )}
                </button>
              )}
            </div>

          </div>
        </GridItem>
      </Section>
    );
  }
