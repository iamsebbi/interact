import type { Metadata } from "next";
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
};

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
      <body
        className="bg-background text-foreground selection:bg-brand/30"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <GridHelper />
          {children}
          <ContactCTA />
          <Footer />
          {/* Floating Grid Toggle — bottom-right corner */}
          <div className="fixed bottom-6 right-6 z-50">
            <GridToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
