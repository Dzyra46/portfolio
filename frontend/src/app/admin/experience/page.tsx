import { fetchClient } from "@/lib/api/client";
import { ExperienceClient } from "./ExperienceClient";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await fetchClient<any[]>("/api/v1/admin/experiences");

  return (
    <div className="space-y-6">


      <ExperienceClient initialData={experiences} />
    </div>
  );
}
