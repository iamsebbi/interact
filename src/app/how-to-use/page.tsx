import type { Metadata } from "next";
import { HowToUseContent } from "./HowToUseContent";

export const metadata: Metadata = {
  title: "How to use",
  description:
    "Every component ships as a CLI command and an AI prompt. Copy it, paste it into your coding agent, and make it yours.",
};

export default function HowToUsePage() {
  return <HowToUseContent />;
}
