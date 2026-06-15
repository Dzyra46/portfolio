import { fetchClient } from "@/lib/api/client";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { Certificate } from "@/types/portfolio";
import { Award, ExternalLink } from "lucide-react";

export default async function Certificates() {
  let certificates: Certificate[] = [];
  try {
    certificates = await fetchClient<Certificate[]>("/api/v1/public/certificates");
  } catch {
    return null;
  }

  if (certificates.length === 0) return null;

  return (
    <SectionWrapper id="certificates">
      <Container>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">
          Certifications
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Professional certifications and achievements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group relative p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-purple-500/30 transition-all duration-300"
              data-track="certificate_click"
              data-track-id={cert.id}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg shrink-0">
                  <Award size={24} className="text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1 leading-tight">
                    {cert.name}
                  </h3>
                  <p className="text-purple-400 text-sm font-medium mb-3">
                    {cert.issuer}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                    {cert.issue_date && (
                      <Badge variant="subtle">Issued: {cert.issue_date}</Badge>
                    )}
                    {cert.credential_id && (
                      <Badge variant="subtle">ID: {cert.credential_id}</Badge>
                    )}
                  </div>
                </div>
              </div>
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  data-track="certificate_verify_click"
                  data-track-id={cert.id}
                >
                  <ExternalLink size={14} />
                  Verify Credential
                </a>
              )}
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
