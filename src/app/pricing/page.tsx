import type { Metadata } from "next";
import { PricingContent } from "@/app/pricing/PricingContent";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Full access to every interactive React component, copy-ready AI prompts, and the Studio—built to ship polished interfaces faster.",
};

export default function PricingPage() {
  return (
    <main>
      <PricingContent />
    </main>
  );
}
