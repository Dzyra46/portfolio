import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";
import { fetchClient } from "@/lib/api/client";
import { Profile } from "@/types/portfolio";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import Link from "next/link";

export default async function Hero() {
  let profile: Profile | null = null;

  try {
    profile = await fetchClient<Profile>("/api/v1/public/profile");
  } catch (error) {
    console.error("Failed to fetch profile for Hero:", error);
  }

  // Elite fallback if backend hangs or is empty
  const fullName = profile?.full_name || "Software Engineer";
  const title = profile?.title || "Crafting digital experiences.";
  const bio = profile?.bio || "I build premium, fast, and accessible digital solutions focused on elegant code and stunning design.";
  const resumeUrl = profile?.resume_url || "#";

  return (
    <SectionWrapper id="hero" className="min-h-[90vh] flex items-center pt-32 lg:pt-48 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Container className="flex flex-col items-center text-center space-y-8 relative z-10">
        <ScrollReveal direction="down" delay={0.1}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{fullName}</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="text-2xl md:text-3xl font-semibold text-slate-300">
            {title}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="#projects"
              className={buttonVariants({ size: "lg", variant: "primary" })}
              data-track="hero_cta_click"
              data-track-id="hero-view-work"
            >
              View My Work
            </Link>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "lg", variant: "outline" })}
              data-track="cv_download_click"
              data-track-id="hero-download-cv"
            >
              Download CV
            </a>
          </div>
        </ScrollReveal>
      </Container>
    </SectionWrapper>
  );
}
