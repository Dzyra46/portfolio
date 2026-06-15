import { fetchClient } from "@/lib/api/client";
import { CertificatesClient } from "./CertificatesClient";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await fetchClient<any[]>("/api/v1/admin/certificates");

  return (
    <div className="space-y-6">


      <CertificatesClient initialData={certificates} />
    </div>
  );
}
