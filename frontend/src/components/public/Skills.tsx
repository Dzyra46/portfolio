import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { fetchClient } from "@/lib/api/client";
import { Skill } from "@/types/portfolio";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";

export default async function Skills() {
  let skills: Skill[] = [];

  try {
    skills = await fetchClient<Skill[]>("/api/v1/public/skills");
  } catch (error) {
    console.error("Failed to fetch skills:", error);
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = Object.keys(groupedSkills);

  return (
    <SectionWrapper id="skills" className="bg-slate-900/30 border-y border-slate-800/50">
      <Container>
        <ScrollReveal direction="down">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">Skills</h2>
        </ScrollReveal>

        {categories.length === 0 ? (
          <ScrollReveal delay={0.2}>
            <div className="py-16 text-center">
              <h3 className="text-2xl font-bold text-slate-400 mb-2">Analyzing dependencies...</h3>
              <p className="text-slate-600">Tech stack is currently being indexed.</p>
            </div>
          </ScrollReveal>
        ) : (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <StaggerItem key={category}>
                <Card className="p-8 h-full border-slate-800/60 bg-slate-950/50 hover:border-cyan-500/30 transition-colors">
                  <h3 className="text-xl font-bold mb-6 text-cyan-400">{category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {groupedSkills[category]
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="px-3 py-1 text-sm bg-cyan-950/30">
                          {skill.name}
                        </Badge>
                      ))}
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </SectionWrapper>
  );
}
