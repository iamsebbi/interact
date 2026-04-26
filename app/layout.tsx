import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Google_Sans,
  Special_Gothic_Expanded_One,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GridHelper } from "@/components/GridHelper";
import { GridToggle } from "@/components/GridToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const specialGothic = Special_Gothic_Expanded_One({
  variable: "--font-special",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "iamsebbi | Creative Developer",
  description: "A premium digital experience built by iamsebbi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${googleSans.variable} ${specialGothic.variable} antialiased transition-colors duration-300`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground selection:bg-brand/30"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <GridHelper />
          {children}
          {/* Floating Grid Toggle — bottom-right corner */}
          <div className="fixed bottom-6 right-6 z-50">
            <GridToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
