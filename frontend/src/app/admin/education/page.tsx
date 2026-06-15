import { fetchClient } from "@/lib/api/client";
import { EducationClient } from "./EducationClient";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const educations = await fetchClient<any[]>("/api/v1/admin/educations");

  return (
    <div className="space-y-6">


      <EducationClient initialData={educations} />
    </div>
  );
}
