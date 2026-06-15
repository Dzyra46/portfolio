import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { fetchClient } from "@/lib/api/client";
import { Education as EducationType } from "@/types/portfolio";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";

export default async function Education() {
  let educations: EducationType[] = [];

  try {
    educations = await fetchClient<EducationType[]>("/api/v1/public/education");
  } catch (error) {
    console.error("Failed to fetch education:", error);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric' });
  };

  return (
    <SectionWrapper id="education" className="border-t border-slate-800/50 bg-slate-900/20">
      <Container>
        <ScrollReveal direction="down">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">
            Education
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Academic background and institutional learning.
          </p>
        </ScrollReveal>

        {educations.length === 0 ? (
          <ScrollReveal delay={0.2}>
            <p className="text-slate-600 text-center italic">Academic records pending...</p>
          </ScrollReveal>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educations.map((edu) => (
              <StaggerItem key={edu.id}>
                <Card className="p-8 h-full border-slate-800/60 bg-slate-900/40 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-xl font-bold text-slate-200 mb-1">{edu.degree}</h3>
                  <div className="text-purple-400 font-medium mb-3">{edu.institution}</div>
                  <p className="text-sm font-mono text-slate-500 mb-4">
                    {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                  </p>
                  {edu.description && (
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {edu.description}
                    </p>
                  )}
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </SectionWrapper>
  );
}
