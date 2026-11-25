import Link from "next/link";
import { Button } from "@/components/controls";
import { ComponentsGrid } from "@/components/showcase/ComponentsGrid";
import { DotMatrixWave } from "@/components/showcase/DotMatrixWave";
import { FeaturedProductBanner } from "@/components/showcase/FeaturedProductBanner";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] w-full flex-col gap-6 bg-background pb-12 text-foreground antialiased">
      <section className="relative flex min-h-[44vh] w-full flex-col items-center justify-center overflow-hidden px-4 py-10 text-center sm:min-h-[48vh]">
        <DotMatrixWave className="absolute inset-0 z-0" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-3.5">
          <h1 className="max-w-2xl text-3xl leading-[1.08] font-medium tracking-tight text-foreground sm:text-5xl">
            next-gen interactive
            <br />
            UI components
          </h1>
          <p className="max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            A library of interactive React components and
            micro-interactions—ready to drop into your product and built for
            your AI agents.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Button
              variant="chip"
              size="md"
              render={<Link href="#products-grid" />}
            >
              Browse
            </Button>
            <Button
              variant="primary"
              size="md"
              render={<Link href="/pricing" />}
            >
              Get Full Access
            </Button>
          </div>
        </div>
      </section>

      <FeaturedProductBanner />

      <ComponentsGrid />
    </main>
  );
}
