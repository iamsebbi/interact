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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://interact.dev";

export const metadata: Metadata = {
  title: {
    default: "interact.dev — Interactive React UI Components & Studio",
    template: "%s — interact.dev",
  },
  description:
    "Interactive UI components and micro-interactions crafted for modern products.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: "interact.dev",
    title: "interact.dev — Interactive React UI Components & Studio",
    description:
      "Interactive UI components and micro-interactions crafted for modern products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "interact.dev — Interactive React UI Components & Studio",
    description:
      "Interactive UI components and micro-interactions crafted for modern products.",
  },
  appleWebApp: {
    capable: true,
    title: "interact.dev",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#fdfdfd" },
  ],
};

const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("theme");var t=(s==="light"||s==="dark")?s:"dark";var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t;var c=t==="dark"?"#121212":"#fdfdfd";var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++)m[i].setAttribute("content",c);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${googleSansFlex.variable} ${googleSansCode.variable}`}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script prevents theme and status-bar color flash before hydration */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground font-sans antialiased selection:bg-pro selection:text-pro-foreground">
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
