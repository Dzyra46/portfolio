import { fetchClient } from "@/lib/api/client";
import { ProfileClient } from "./ProfileClient";
import { SocialLinksClient } from "./SocialLinksClient";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  let profile: any = null;
  try {
    profile = await fetchClient("/api/v1/admin/profile", { next: { revalidate: 0 } });
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Failed to fetch profile", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-slate-400 mt-2">Manage your public developer profile.</p>
      </div>

      <ProfileClient initialData={profile} />
      
      <SocialLinksClient initialLinks={profile?.social_links || []} />
    </div>
  );
}
