"use client";

import { useParams, notFound } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import { Navbar } from "@/components/Navbar";
import { DesignProjectLayout } from "@/components/DesignProjectLayout";
import { WebProjectLayout } from "@/components/WebProjectLayout";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {project.category === "web" ? (
        <WebProjectLayout project={project} />
      ) : (
        <DesignProjectLayout project={project} />
      )}
    </div>
  );
}
