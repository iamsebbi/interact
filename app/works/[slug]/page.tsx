import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDEX_PROJECTS } from "@/lib/index-projects";
import { ProjectDetailClient } from "@/components/ProjectDetailClient";

export function generateStaticParams() {
  return INDEX_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = INDEX_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found | iamsebbi",
    };
  }

  return {
    title: `${project.title} | iamsebbi`,
    description:
      project.summary?.en ||
      `${project.title} — ${project.category} (${project.services})`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectIndex = INDEX_PROJECTS.findIndex((p) => p.slug === slug);

  if (projectIndex === -1) {
    notFound();
  }

  const project = INDEX_PROJECTS[projectIndex];
  const next = INDEX_PROJECTS[(projectIndex + 1) % INDEX_PROJECTS.length];

  return (
    <ProjectDetailClient
      project={project}
      nextProject={{ slug: next.slug, title: next.title }}
    />
  );
}
