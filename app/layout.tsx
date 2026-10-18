import type { Metadata } from "next";
import {
  Google_Sans,
  Special_Gothic_Expanded_One,
  Lekton,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GridHelper } from "@/components/GridHelper";
import { GridToggle } from "@/components/GridToggle";
import "./globals.css";

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

const lekton = Lekton({
  variable: "--font-lekton",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${googleSans.variable} ${specialGothic.variable} ${lekton.variable} antialiased transition-colors duration-300`}
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
