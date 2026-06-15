import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { fetchClient } from "@/lib/api/client";
import { Experience as ExperienceType } from "@/types/portfolio";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";

export default async function Experience() {
  let experiences: ExperienceType[] = [];

  try {
    experiences = await fetchClient<ExperienceType[]>("/api/v1/public/experience");
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <SectionWrapper id="experience" className="bg-slate-900/10">
      <Container>
        <ScrollReveal direction="up">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">Experience</h2>
        </ScrollReveal>

        {experiences.length === 0 ? (
          <ScrollReveal delay={0.2}>
            <div className="py-12 border-l-2 border-slate-800 pl-8 ml-4">
              <h3 className="text-xl font-bold text-slate-500 mb-2">Compiling work history...</h3>
              <p className="text-slate-600">Timeline is currently being generated.</p>
            </div>
          </ScrollReveal>
        ) : (
          <StaggerContainer className="space-y-12 max-w-4xl relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {experiences.map((exp, index) => (
              <StaggerItem key={exp.id}>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800 group-hover:bg-purple-500 group-hover:border-purple-500/30 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300">
                    <svg className="w-4 h-4 fill-current group-hover:text-white transition-colors" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /></svg>
                  </div>

                  <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 md:p-8 border-slate-800/60 bg-slate-900/40 hover:bg-slate-900/80 transition-colors">
                    <div className="flex flex-col mb-4">
                      <h3 className="text-xl font-bold text-slate-200">{exp.position}</h3>
                      <div className="text-purple-400 font-medium mt-1">
                        {exp.company} {exp.location && <span className="text-slate-500 text-sm ml-2 font-normal">• {exp.location}</span>}
                      </div>
                      <time className="text-sm font-mono text-slate-500 mt-2">
                        {formatDate(exp.start_date)} - {exp.is_current || !exp.end_date ? 'Present' : formatDate(exp.end_date)}
                      </time>
                    </div>
                    {exp.description && (
                      <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </Card>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </SectionWrapper>
  );
}
