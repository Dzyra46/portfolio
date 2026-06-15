import { fetchClient } from "@/lib/api/client";
import { Project } from "@/types/portfolio";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { Link } from "next-view-transitions";
import { ArrowLeft } from "lucide-react";
import { LiveViewersBadge } from "@/components/analytics/AnalyticsTracker";
import { PremiumImage } from "@/components/ui/PremiumImage";

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  let project: Project | null = null;
  let allProjects: Project[] = [];
  
  try {
    project = await fetchClient<Project>(`/api/v1/public/projects/${slug}`);
    allProjects = await fetchClient<Project[]>("/api/v1/public/projects");
  } catch (error) {
    console.error("Failed to fetch project:", error);
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/" className="text-purple-400 hover:underline">
            &larr; Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Find next project
  const currentIndex = allProjects.findIndex(p => p.id === project!.id);
  const nextProject = currentIndex !== -1 && currentIndex < allProjects.length - 1 
    ? allProjects[currentIndex + 1] 
    : allProjects[0]; // Loop back to first

  return (
    <article className="min-h-screen pt-24 flex flex-col">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/#projects" 
            className="inline-flex items-center text-slate-400 hover:text-purple-400 transition-colors group"
          >
            <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
          <LiveViewersBadge />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          {project.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl leading-relaxed">
          {project.summary || project.description}
        </p>

        <div className="flex flex-wrap gap-3 mb-16">
          {project.skills?.map((skill) => (
            <span key={skill.id} className="px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 text-sm font-medium text-slate-300">
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full relative h-[40vh] md:h-[60vh] mb-16">
        {project.cover_image_url ? (
          <PremiumImage 
            fill
            src={project.cover_image_url} 
            alt={project.title}
            style={{ viewTransitionName: `project-image-${project.slug}` }}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <span className="text-slate-600 font-mono">[ No Cover Image ]</span>
          </div>
        )}
      </div>

      <div className="container mx-auto px-6 max-w-4xl mb-32 relative z-10 flex-1">
        {project.case_study ? (
          <MarkdownRenderer content={project.case_study} />
        ) : (
          <p className="text-slate-400 text-lg">Case study details coming soon.</p>
        )}
      </div>

      {/* Massive Kinetic Footer for Next Project */}
      {nextProject && nextProject.id !== project.id && (
        <div className="w-full bg-slate-950 border-t border-slate-900 overflow-hidden relative group cursor-pointer mt-auto">
          <Link href={`/projects/${nextProject.slug}`} className="block w-full py-32 md:py-48 relative z-10 px-6 transition-all duration-700">
            {/* Background Image Reveal */}
            {nextProject.cover_image_url && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000">
                <PremiumImage 
                  fill
                  src={nextProject.cover_image_url} 
                  alt="" 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
              </div>
            )}
            
            <div className="container mx-auto max-w-5xl text-center relative z-20">
              <span className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-6 block group-hover:text-purple-400 transition-colors">
                Next Project
              </span>
              <h2 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-700 transform translate-y-8 group-hover:translate-y-0">
                {nextProject.title}
              </h2>
            </div>
          </Link>
        </div>
      )}
    </article>
  );
}
