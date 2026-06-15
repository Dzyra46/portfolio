import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { fetchClient } from "@/lib/api/client";
import { Project } from "@/types/portfolio";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import { Link } from "next-view-transitions";
import { PremiumImage } from "@/components/ui/PremiumImage";

export default async function Projects() {
  let projects: Project[] = [];

  try {
    projects = await fetchClient<Project[]>("/api/v1/public/projects?featured=true");
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return (
    <SectionWrapper id="projects">
      <Container>
        <ScrollReveal direction="left">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Selected Work</h2>
            <a href="/archive" className="text-purple-400 hover:text-purple-300 transition-colors underline-offset-4 hover:underline hidden sm:block">
              View All Archive &rarr;
            </a>
          </div>
        </ScrollReveal>

        {projects.length === 0 ? (
          <ScrollReveal delay={0.2}>
            <div className="py-24 text-center border border-slate-800 rounded-2xl bg-slate-900/30">
              <h3 className="text-2xl font-bold text-slate-300 mb-2">Compiling latest deployments...</h3>
              <p className="text-slate-500">Currently architecting behind the scenes. Check back soon for updated case studies.</p>
            </div>
          </ScrollReveal>
        ) : (
          <StaggerContainer className="grid lg:grid-cols-2 gap-10">
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <Link href={`/projects/${project.slug}`} className="block h-full" data-track="project_card_click" data-track-id={project.slug}>
                  <Card className="flex flex-col h-full group overflow-hidden border-slate-800/60 bg-slate-900/40 hover:border-purple-500/50 transition-all duration-500">
                    <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
                      {project.cover_image_url ? (
                        <PremiumImage
                          fill
                          src={project.cover_image_url}
                          alt={project.title}
                          style={{ viewTransitionName: `project-image-${project.slug}` }}
                          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 text-slate-600 font-mono text-sm">
                          [ No Cover Image Provided ]
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                    </div>

                    <div className="p-8 flex-1 flex flex-col justify-between relative z-10 -mt-12 bg-gradient-to-b from-transparent to-slate-900/90">
                      <div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed mb-6">
                          {project.summary || project.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.skills?.map((skill) => (
                          <Badge key={skill.id} variant="outline" className="border-slate-700 bg-slate-800/50">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <div className="mt-12 text-center sm:hidden">
          <a href="/archive" className="text-purple-400 hover:text-purple-300 transition-colors underline-offset-4 hover:underline">
            View All Archive &rarr;
          </a>
        </div>
      </Container>
    </SectionWrapper>
  );
}
