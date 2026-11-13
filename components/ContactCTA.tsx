"use client";

import { useState, useRef, useEffect } from "react";
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
  website: string; // honeypot
}

const INITIAL_FORM_STATE: FormState = {
  services: [],
  budget: "",
  timeline: "",
  description: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactCTA() {
  const { language } = useTheme();
  const isRO = language === "RO";

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formMountedAtRef = useRef<number | null>(null);
  const isSubmittingRef = useRef(false);

  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);

  useEffect(() => {
    formMountedAtRef.current = Date.now();
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

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
    setErrorMessage(null);

    if (currentStep === 3 && form.description.trim().length < 10) {
      setErrorMessage(
        isRO
          ? "Te rog să descrii proiectul în cel puțin 10 caractere înainte de a continua."
          : "Please describe your project in at least 10 characters before continuing.",
      );
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || submitStatus === "submitting") return;

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedDescription = form.description.trim();

    if (trimmedDescription.length < 10) {
      setErrorMessage(
        isRO
          ? "Descrierea proiectului trebuie să aibă cel puțin 10 caractere (Pasul 3)."
          : "Project overview must be at least 10 characters (Step 3).",
      );
      return;
    }

    if (trimmedName.length < 2 || !trimmedEmail) {
      setErrorMessage(
        isRO
          ? "Te rog să completezi un nume valid și adresa de email."
          : "Please fill in a valid name and email address.",
      );
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage(
        isRO
          ? "Adresa de email introdusă nu pare validă."
          : "Please enter a valid email address.",
      );
      return;
    }

    isSubmittingRef.current = true;
    setErrorMessage(null);
    setSubmitStatus("submitting");

    const elapsedMs = formMountedAtRef.current
      ? Date.now() - formMountedAtRef.current
      : 0;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: form.services,
          budget: form.budget,
          timeline: form.timeline,
          description: trimmedDescription,
          name: trimmedName,
          email: trimmedEmail,
          phone: form.phone.trim(),
          company: form.company.trim(),
          website: form.website,
          elapsedMs,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
      };

      if (!response.ok) {
        setSubmitStatus("error");
        if (data.code === "MISSING_API_KEY") {
          setErrorMessage(
            isRO
              ? "Serviciul de email nu este configurat încă. Scrie-mi direct pe hello.iamsebbi@gmail.com."
              : "Email service is not configured yet. Please reach out directly at hello.iamsebbi@gmail.com.",
          );
        } else if (data.code === "RATE_LIMITED") {
          setErrorMessage(
            isRO
              ? "Ai trimis prea multe cereri într-un timp scurt. Încearcă din nou peste câteva minute."
              : "Too many requests in a short time. Please wait a few minutes and try again.",
          );
        } else {
          setErrorMessage(
            data.error ||
              (isRO
                ? "Nu am putut trimite mesajul. Încearcă din nou."
                : "Could not send message. Please try again."),
          );
        }
        return;
      }

      setSubmitStatus("success");
      setForm(INITIAL_FORM_STATE);

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = setTimeout(() => {
        setSubmitStatus("idle");
        setCurrentStep(1);
        formMountedAtRef.current = Date.now();
      }, 3000);
    } catch {
      setSubmitStatus("error");
      setErrorMessage(
        isRO
          ? "Eroare de rețea la trimitere. Încearcă din nou sau folosește emailul direct."
          : "Network error while sending. Please try again or email directly.",
      );
    } finally {
      isSubmittingRef.current = false;
    }
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
              {isRO ? "ÎNCEPE PROIECTUL TĂU" : "START YOUR OWN PROJECT"}
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
                href="https://wa.me/40769695933"
                target="_blank"
                rel="noopener noreferrer"
                title="+40 769 695 933"
                className="font-heading text-xs sm:text-sm uppercase tracking-tight text-foreground hover:text-primary transition-colors truncate-ellipsis"
              >
                +40 769 695 933
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
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col justify-between min-h-[470px] sm:min-h-[490px]"
        >
          {/* Off-screen honeypot field for spam bots */}
          <div
            className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden opacity-0 pointer-events-none"
            aria-hidden="true"
          >
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>

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
                <label
                  htmlFor="contact-description"
                  className="font-heading text-xs sm:text-sm uppercase tracking-editorial text-foreground/75 block"
                >
                  {isRO ? "Descrierea proiectului (obligatoriu)" : "Project Overview (required)"}
                </label>
                <textarea
                  id="contact-description"
                  rows={6}
                  required
                  value={form.description}
                  onChange={(e) => {
                    if (errorMessage) setErrorMessage(null);
                    setForm({ ...form, description: e.target.value });
                  }}
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
                    <label
                      htmlFor="contact-name"
                      className="font-heading text-xs uppercase tracking-editorial text-foreground/60"
                    >
                      {isRO ? "Nume (obligatoriu)" : "Name (required)"}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => {
                        if (errorMessage) setErrorMessage(null);
                        setForm({ ...form, name: e.target.value });
                      }}
                      placeholder={isRO ? "Numele tău" : "Your Name"}
                      className="w-full bg-transparent font-heading text-base text-foreground focus:outline-none placeholder:text-foreground/25"
                    />
                  </div>

                  <div className="flex flex-col space-y-1 border-b border-border/80 focus-within:border-foreground pb-1.5 transition-colors">
                    <label
                      htmlFor="contact-email"
                      className="font-heading text-xs uppercase tracking-editorial text-foreground/60"
                    >
                      {isRO ? "Email (obligatoriu)" : "Email (required)"}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => {
                        if (errorMessage) setErrorMessage(null);
                        setForm({ ...form, email: e.target.value });
                      }}
                      placeholder="hello@domain.com"
                      className="w-full bg-transparent font-heading text-base text-foreground focus:outline-none placeholder:text-foreground/25"
                    />
                  </div>

                  <div className="flex flex-col space-y-1 border-b border-border/80 focus-within:border-foreground pb-1.5 transition-colors">
                    <label
                      htmlFor="contact-phone"
                      className="font-heading text-xs uppercase tracking-editorial text-foreground/60"
                    >
                      {isRO ? "Telefon (Opțional)" : "Phone (Optional)"}
                    </label>
                    <input
                      id="contact-phone"
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
                    <label
                      htmlFor="contact-company"
                      className="font-heading text-xs uppercase tracking-editorial text-foreground/60"
                    >
                      {isRO ? "Companie / URL (Opțional)" : "Company / URL (Optional)"}
                    </label>
                    <input
                      id="contact-company"
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

            {errorMessage && (
              <p
                role="alert"
                className="mt-3 font-lekton text-xs text-accent leading-relaxed"
              >
                {errorMessage}
              </p>
            )}

            {submitStatus === "success" && (
              <p
                role="status"
                className="mt-3 font-lekton text-xs text-secondary leading-relaxed"
              >
                {isRO
                  ? "Mesajul a fost trimis! Revin către tine în cel mai scurt timp."
                  : "Message sent! I’ll get back to you shortly."}
              </p>
            )}
          </div>

          {/* NAVIGATION CONTROLS */}
          <div className="flex items-center justify-between pt-5">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={submitStatus === "submitting"}
                className="font-heading text-xs sm:text-sm uppercase tracking-editorial text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer group disabled:opacity-50"
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
                type="submit"
                disabled={submitStatus === "submitting" || submitStatus === "success"}
                className={`font-heading text-xs sm:text-sm uppercase tracking-widest px-7 py-2.5 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group ${
                  submitStatus === "success"
                    ? "bg-foreground text-background"
                    : "bg-primary text-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                <span>
                  {submitStatus === "submitting"
                    ? isRO
                      ? "Se trimite..."
                      : "Submitting..."
                    : submitStatus === "success"
                      ? isRO
                        ? "Trimis"
                        : "Submitted"
                      : isRO
                        ? "Trimite"
                        : "Submit"}
                </span>
                {submitStatus === "submitting" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : submitStatus === "success" ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                )}
              </button>
            )}
          </div>
        </form>
      </GridItem>
    </Section>
  );
}
