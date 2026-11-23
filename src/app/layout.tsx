import type { Metadata, Viewport } from "next";
import { Google_Sans_Code, Google_Sans_Flex } from "next/font/google";
import type { ReactNode } from "react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-google-sans-flex",
});

const googleSansCode = Google_Sans_Code({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-google-sans-code",
});

export const metadata: Metadata = {
  title: {
    default: "interact.dev — Interactive React UI Components & Studio",
    template: "%s — interact.dev",
  },
  description:
    "Interactive React UI components built on ui-sdk, Tailwind CSS v4, and Motion — with a live customization Studio and shadcn registry.",
  metadataBase: new URL("https://interact.dev"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#fdfdfd" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${googleSansFlex.variable} ${googleSansCode.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground font-sans antialiased selection:bg-pro selection:text-pro-foreground">
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
