import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { fetchClient } from "@/lib/api/client";
import { Profile } from "@/types/portfolio";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { PremiumImage } from "@/components/ui/PremiumImage";

export default async function About() {
  let profile: Profile | null = null;

  try {
    profile = await fetchClient<Profile>("/api/v1/public/profile");
  } catch (error) {
    console.error("Failed to fetch profile for About:", error);
  }

  // Fallback if empty/error
  const bio = profile?.bio || "I am a passionate software engineer specializing in full-stack development, with a focus on modern web technologies.\n\nMy goal is to create products that are not only functional but also visually stunning and accessible to everyone.";

  return (
    <SectionWrapper id="about" className="overflow-hidden">
      <Container>
        <ScrollReveal direction="right">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">About Me</h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal delay={0.2} direction="up">
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
              {bio}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4} direction="left">
            <Card className="p-2 flex items-center justify-center min-h-[400px] border-slate-800/60 bg-slate-900/40 shadow-2xl relative overflow-hidden group">
              {profile?.avatar_url ? (
                <PremiumImage
                  fill
                  src={profile.avatar_url}
                  alt={profile.full_name || "Profile"}
                  className="object-cover rounded-lg filter grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="text-slate-600 font-mono text-sm">[ Avatar Placeholder ]</div>
              )}
            </Card>
          </ScrollReveal>
        </div>
      </Container>
    </SectionWrapper>
  );
}
