import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

import { fetchClient } from "@/lib/api/client";
import { Profile } from "@/types/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profile = await fetchClient<Profile>("/api/v1/public/profile");
    if (!profile) throw new Error("No profile");

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
      title: {
        default: `${profile.full_name} | ${profile.title}`,
        template: `%s | ${profile.full_name}`
      },
      description: profile.bio || "Award-winning interactive portfolio",
      openGraph: {
        title: `${profile.full_name} | ${profile.title}`,
        description: profile.bio,
        url: 'https://portfolio.dev',
        siteName: `${profile.full_name} Portfolio`,
        images: [
          {
            url: profile.avatar_url || '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: `${profile.full_name} Portfolio`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${profile.full_name} | ${profile.title}`,
        description: profile.bio,
        images: [profile.avatar_url || '/og-image.jpg'],
      },
    };
  } catch (error) {
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
      title: "Software Engineer Portfolio",
      description: "Award-winning interactive portfolio",
    };
  }
}

import Header from "@/components/public/Header";
import { ViewTransitions } from "next-view-transitions";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let profile: Profile | null = null;
  try {
    profile = await fetchClient<Profile>("/api/v1/public/profile");
  } catch (error) {
    console.error("Failed to fetch profile for RootLayout:", error);
  }

  return (
    <ViewTransitions>
      <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`} data-scroll-behavior="smooth">
        <body className="antialiased text-slate-200 bg-slate-950 selection:bg-purple-500/30">
          <AnalyticsTracker />
          <Header resumeUrl={profile?.resume_url} />
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}
