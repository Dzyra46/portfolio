import { fetchClient } from "@/lib/api/client";
import { ProjectsClient } from "./ProjectsClient";
import type { Project } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await fetchClient<Project[]>("/api/v1/admin/projects");
  return <ProjectsClient initialData={projects} />;
}
