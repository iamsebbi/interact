"use client";

import { toast } from "@ui-sdk/react/toast";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/controls";
import {
  AsteriskSymbol,
  Check,
  EllipsisVertical,
  LifeBuoy,
  Mail,
  Moon,
  Share2,
  Sun,
} from "@/components/icons";
import { useTheme } from "@/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";

const GITHUB_URL = "https://github.com/iamsebbi/interact";
const CONTACT_EMAIL = "hello@interact.dev";

const NAV_LINKS = [
  { href: "/", label: "Components" },
  { href: "/how-to-use", label: "How to use" },
  { href: "/pricing", label: "Pricing" },
  { href: "/studio", label: "Studio", pro: true },
] as const;

const subscribe = () => () => {};

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/components");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const { resolvedTheme, setTheme } = useTheme();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isDark = mounted ? resolvedTheme !== "light" : true;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      toast("Link copied to clipboard");
      window.setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      toast("Could not copy link");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6 md:gap-8">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-sm py-1 text-foreground transition-opacity duration-150 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <AsteriskSymbol size={20} className="shrink-0 text-foreground" />
            <span className="text-[17px] font-medium tracking-tight whitespace-nowrap sm:text-[18px]">
              <span className="text-foreground">interact</span>
              <span className="text-muted-foreground">.dev</span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1.5 md:flex"
          >
            {NAV_LINKS.map((item) => {
              const active = isRouteActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-pill px-3.5 text-[13px] font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-150 ease-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    active
                      ? "bg-control-active text-control-active-foreground shadow-control"
                      : "text-muted-foreground hover:bg-control hover:text-foreground",
                  )}
                >
                  <span>{item.label}</span>
                  {"pro" in item && item.pro && (
                    <span className="ml-1.5 inline-flex h-[18px] items-center rounded-pill bg-pro px-1.5 font-mono text-[10px] font-medium text-pro-foreground shadow-material">
                      PRO
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="control-chip inline-flex h-9 items-center gap-2 rounded-pill px-3 text-[13px] font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <svg
                className="size-4 shrink-0 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>

            <Button
              variant="primary"
              size="md"
              render={<Link href="/pricing" />}
            >
              Get Pro
            </Button>

            <Menu>
              <MenuTrigger
                aria-label="More options"
                className="control-chip inline-flex size-9 cursor-pointer items-center justify-center rounded-pill text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <EllipsisVertical size={16} aria-hidden="true" />
              </MenuTrigger>
              <MenuContent align="end">
                <MenuItem value="share" onSelect={handleCopyUrl}>
                  {copiedUrl ? (
                    <Check size={14} aria-hidden="true" />
                  ) : (
                    <Share2 size={14} aria-hidden="true" />
                  )}
                  <span>{copiedUrl ? "Link copied" : "Copy page link"}</span>
                </MenuItem>
                <MenuItem
                  value="theme"
                  onSelect={() => setTheme(isDark ? "light" : "dark")}
                >
                  {isDark ? (
                    <Sun size={14} aria-hidden="true" />
                  ) : (
                    <Moon size={14} aria-hidden="true" />
                  )}
                  <span>{isDark ? "Light theme" : "Dark theme"}</span>
                </MenuItem>
                <MenuSeparator />
                <MenuItem
                  value="support"
                  render={
                    <a
                      href={`${GITHUB_URL}/issues`}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <LifeBuoy size={14} aria-hidden="true" />
                  <span>Support & Issues</span>
                </MenuItem>
                <MenuItem
                  value="contact"
                  render={<a href={`mailto:${CONTACT_EMAIL}`} />}
                >
                  <Mail size={14} aria-hidden="true" />
                  <span>Contact</span>
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
              <DialogTrigger
                aria-label="Open navigation menu"
                className="control-chip inline-flex size-9 cursor-pointer items-center justify-center rounded-pill text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <EllipsisVertical size={16} aria-hidden="true" />
              </DialogTrigger>
              <DialogBackdrop />
              <DialogContent className="w-[min(calc(100vw-1.5rem),22rem)] p-5">
                <DialogTitle className="mb-4 flex items-center gap-1.5">
                  <AsteriskSymbol size={18} />
                  <span>interact.dev</span>
                </DialogTitle>
                <nav
                  aria-label="Mobile navigation"
                  className="flex flex-col gap-1"
                >
                  {NAV_LINKS.map((item) => {
                    const active = isRouteActive(pathname, item.href);
                    return (
                      <DialogClose
                        key={item.href}
                        render={<Link href={item.href} />}
                        className={cn(
                          "flex h-10 items-center justify-between rounded-sm px-3 text-sm font-medium no-underline transition-colors",
                          active
                            ? "bg-control-active text-control-active-foreground shadow-control"
                            : "text-muted-foreground hover:bg-menu-hover hover:text-foreground",
                        )}
                      >
                        <span>{item.label}</span>
                        {"pro" in item && item.pro && (
                          <span className="rounded-pill bg-pro px-2 py-0.5 font-mono text-[10px] text-pro-foreground">
                            PRO
                          </span>
                        )}
                      </DialogClose>
                    );
                  })}
                </nav>
                <div className="mt-3 flex flex-col gap-1 border-t border-menu-divider pt-3">
                  <button
                    type="button"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className="flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-sm px-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-menu-hover hover:text-foreground"
                  >
                    {isDark ? (
                      <Sun size={15} aria-hidden="true" />
                    ) : (
                      <Moon size={15} aria-hidden="true" />
                    )}
                    <span>{isDark ? "Light theme" : "Dark theme"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-sm px-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-menu-hover hover:text-foreground"
                  >
                    {copiedUrl ? (
                      <Check size={15} aria-hidden="true" />
                    ) : (
                      <Share2 size={15} aria-hidden="true" />
                    )}
                    <span>{copiedUrl ? "Link copied" : "Copy page link"}</span>
                  </button>
                </div>
                <div className="mt-3 flex flex-col gap-2 border-t border-menu-divider pt-3">
                  <DialogClose
                    render={<Link href="/pricing" />}
                    className="flex h-10 items-center justify-center rounded-pill bg-primary text-sm font-medium text-primary-foreground shadow-primary no-underline transition-colors hover:bg-primary-hover active:bg-primary-active"
                  >
                    Get Pro
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
}
