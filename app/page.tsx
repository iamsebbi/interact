import { Hero } from "@/components/Hero";
import { ProjectMarquee } from "@/components/ProjectMarquee";
import { ProjectIndex, type ProjectCardSummary } from "@/components/ProjectIndex";
import { INDEX_PROJECTS } from "@/lib/index-projects";
import { DESIGN_MARQUEE_ITEMS } from "@/lib/marquee-data";
import { BrutalistDivider } from "@/components/BrutalistDivider";
import { Services } from "@/components/Services";
import { HomeLoader } from "@/components/HomeLoader";
import { Navbar } from "@/components/Navbar";

// Keep exactly 6 project cards on the homepage and omit case-study copy from RSC props
const HOME_PROJECT_CARDS: ProjectCardSummary[] = INDEX_PROJECTS.slice(0, 6).map(
  ({ id, slug, title, year, category, services, image, aspectClass, alt }) => ({
    id,
    slug,
    title,
    year,
    category,
    services,
    image,
    aspectClass,
    alt,
  }),
);

export default function Home() {
  return (
    <>
      <HomeLoader />
      <div className="relative min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <ProjectIndex projects={HOME_PROJECT_CARDS} />
          <BrutalistDivider />
          <Services />
          <ProjectMarquee
            id="design"
            badge="Design"
            title="Visual Design & Branding Architecture • 2024–2026"
            items={DESIGN_MARQUEE_ITEMS}
            baseSpeed={42}
          />
        </main>
      </div>
    </>
  );
}
