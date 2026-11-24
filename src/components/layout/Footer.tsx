import Link from "next/link";
import { Button } from "@/components/controls";
import { AsteriskSymbol } from "@/components/icons";
import { cn } from "@/lib/utils";
import { CATALOG_META } from "@/registry";

export interface FooterProps {
  showCta?: boolean;
  className?: string;
}

const GITHUB_URL = "https://github.com/iamsebbi/interact";
const CONTACT_EMAIL = "hello@interact.dev";

const FEATURED_SLUGS = [
  "select-menu",
  "segmented-control",
  "distortion-waves",
  "voice-assistant-card",
  "expandable-tabs",
] as const;

export function Footer({ showCta = true, className }: FooterProps) {
  const linkClass =
    "w-fit text-[13px] text-muted-foreground transition-colors duration-150 ease-smooth hover:text-foreground";
  const featuredComponents = FEATURED_SLUGS.map((slug) =>
    CATALOG_META.find((item) => item.slug === slug),
  ).filter((item): item is (typeof CATALOG_META)[number] => Boolean(item));

  return (
    <div className={cn("w-full bg-background text-foreground", className)}>
      {showCta && (
        <section className="mx-auto flex max-w-[1240px] flex-col items-center gap-4 px-4 pt-20 pb-12 text-center sm:px-6 sm:pt-28">
          <AsteriskSymbol size={28} className="mb-1 text-foreground" />
          <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground sm:text-4xl">
            Ready to Level Up your Design?
          </h2>
          <p className="max-w-md text-balance text-sm leading-relaxed text-muted-foreground">
            Explore free interactive components or unlock Studio Pro for full
            customization and AI-ready prompts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Button
              variant="chip"
              size="md"
              render={<Link href="/#products-grid" />}
            >
              Browse Components
            </Button>
            <Button
              variant="primary"
              size="md"
              render={<Link href="/pricing" />}
            >
              Get Pro
            </Button>
          </div>
        </section>
      )}

      <footer className="w-full select-none pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-col justify-between gap-12 md:flex-row md:gap-10">
            <div className="flex flex-col justify-between gap-10 md:min-h-40">
              <div className="space-y-2.5">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-sm py-0.5 text-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <AsteriskSymbol size={20} className="shrink-0" />
                  <span className="text-[17px] font-medium tracking-tight sm:text-[18px]">
                    <span className="text-foreground">interact</span>
                    <span className="text-muted-foreground">.dev</span>
                  </span>
                </Link>
                <p className="max-w-[260px] text-[13px] leading-relaxed text-muted-foreground">
                  Interactive UI components and micro-interactions crafted for
                  modern products.
                </p>
              </div>

              <p className="text-[13px] text-faint-foreground">
                Created by{" "}
                <a
                  href="https://github.com/iamsebbi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground-secondary underline decoration-current/40 underline-offset-2 transition-colors hover:text-foreground hover:decoration-current"
                >
                  iamsebbi
                </a>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3 lg:gap-x-16">
              <div>
                <h3 className="mb-3 text-[13px] font-medium text-foreground-strong">
                  Site
                </h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/" className={linkClass}>
                      Components
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-to-use" className={linkClass}>
                      How to use
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className={linkClass}>
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/studio" className={linkClass}>
                      Studio
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-[13px] font-medium text-foreground-strong">
                  Components
                </h3>
                <ul className="flex flex-col gap-2">
                  {featuredComponents.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/components/${item.slug}`}
                        className={linkClass}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/#products-grid" className={linkClass}>
                      View all ({CATALOG_META.length})
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-[13px] font-medium text-foreground-strong">
                  Connect
                </h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${GITHUB_URL}/issues`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      Issues & Support
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                      Email
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
