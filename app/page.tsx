import { Hero } from "@/components/Hero";
import { Info } from "@/components/Info";
import { Works } from "@/components/Works";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Hero />
      <Info />
      <Works />
      <Experience />
      <Contact />
    </main>
  );
}

