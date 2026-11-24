import Link from "next/link";
import { Button } from "@/components/controls";
import { AsteriskSymbol } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-16rem)] w-full max-w-[1240px] flex-col items-center justify-center gap-5 px-4 py-20 text-center sm:px-6">
      <div className="surface-panel flex size-14 items-center justify-center rounded-2xl text-foreground">
        <AsteriskSymbol size={24} />
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          404 · Not found
        </p>
        <h1 className="text-balance text-2xl font-medium tracking-tight text-foreground-strong sm:text-4xl">
          This page doesn&apos;t exist.
        </h1>
        <p className="mx-auto max-w-md text-balance text-sm leading-relaxed text-muted-foreground">
          The component or route you&apos;re looking for may have moved or been
          renamed.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
        <Button
          variant="primary"
          size="md"
          render={<Link href="/#products-grid" />}
        >
          Browse Components
        </Button>
        <Button variant="chip" size="md" render={<Link href="/studio" />}>
          Open Studio
        </Button>
      </div>
    </main>
  );
}
