import { fetchClient } from "@/lib/api/client";
import { SkillsClient } from "./SkillsClient";
import type { Skill } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await fetchClient<Skill[]>("/api/v1/admin/skills");
  return <SkillsClient initialData={skills} />;
}
