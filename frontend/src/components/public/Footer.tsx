import { Container } from "@/components/ui/Container";
import { fetchClient } from "@/lib/api/client";
import { Profile } from "@/types/portfolio";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Github, Linkedin, Twitter, Instagram, Facebook, Youtube, Link as LinkIcon, Mail } from "lucide-react";

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <Github className="w-5 h-5" />;
  if (p.includes("linkedin")) return <Linkedin className="w-5 h-5" />;
  if (p.includes("twitter") || p.includes("x")) return <Twitter className="w-5 h-5" />;
  if (p.includes("instagram")) return <Instagram className="w-5 h-5" />;
  if (p.includes("facebook")) return <Facebook className="w-5 h-5" />;
  if (p.includes("youtube")) return <Youtube className="w-5 h-5" />;
  if (p.includes("mail") || p.includes("email")) return <Mail className="w-5 h-5" />;
  return <LinkIcon className="w-5 h-5" />;
};

export default async function Footer() {
  let profile: Profile | null = null;

  try {
    profile = await fetchClient<Profile>("/api/v1/public/profile", { next: { tags: ["profile"] } });
  } catch (error) {
    console.error("Failed to fetch profile for Footer:", error);
  }

  const socialLinks = profile?.social_links?.sort((a, b) => a.sort_order - b.sort_order) || [];

  return (
    <footer className="w-full py-12 border-t border-slate-800/50 bg-slate-950 overflow-hidden">
      <Container className="flex flex-col items-center justify-center gap-4">
        <ScrollReveal direction="left" viewportMargin="0px">
          <p className="text-slate-500 text-sm font-mono">
            &copy; {new Date().getFullYear()} {profile?.full_name || "Portfolio"}. All rights reserved.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="right" viewportMargin="0px">
          <div className="flex gap-6 text-slate-400">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-purple-400 uppercase text-sm font-bold tracking-wider hover:-translate-y-1 transition-all duration-300 ease-out"
                data-track="social_link_click"
                data-track-id={link.platform}
                aria-label={link.platform}
                title={link.platform}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
            {socialLinks.length === 0 && (
              <span className="text-slate-600 text-sm">No social links configured.</span>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </footer>
  );
}
