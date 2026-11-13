import type { Metadata, Viewport } from "next";
import {
  Google_Sans_Flex,
  Lekton,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GridHelper } from "@/components/GridHelper";
import { GridToggle } from "@/components/GridToggle";
import { ContactCTA } from "@/components/ContactCTA";
import { Footer } from "@/components/Footer";
import "./globals.css";

const googleSansFlex = Google_Sans_Flex({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

const lekton = Lekton({
  variable: "--font-lekton",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "iamsebbi | Creative Developer",
  description: "A premium digital experience built by iamsebbi.",
  appleWebApp: {
    capable: true,
    title: "iamsebbi",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
};

const themeInitScript = `
(function() {
  try {
    var savedTheme = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = (savedTheme === "dark" || savedTheme === "light") ? savedTheme : (prefersDark ? "dark" : "light");
    var root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
    var themeColor = theme === "dark" ? "#0d0d0d" : "#ffffff";
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      metas[i].setAttribute("content", themeColor);
    }
    var savedLang = localStorage.getItem("language");
    if (savedLang === "RO") root.lang = "ro";
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${googleSansFlex.variable} ${lekton.variable} antialiased transition-colors duration-300`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className="bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <GridHelper />
          {children}
          <ContactCTA />
          <Footer />
          {/* Floating Grid Toggle — bottom-right corner */}
          <div
            className="fixed z-50"
            style={{
              bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
              right: "calc(1.5rem + env(safe-area-inset-right))",
            }}
          >
            <GridToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
