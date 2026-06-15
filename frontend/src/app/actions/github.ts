"use server";

import { revalidatePath } from "next/cache";
import { fetchClient } from "@/lib/api/client";

export async function syncGithubRepositoriesAction() {
  try {
    const res = (await fetchClient("/api/v1/admin/github/sync", {
      method: "POST",
    })) as any;
    
    // In a real scenario, you might wait or rely on a webhook.
    // Since it's background, we revalidate the path now, but the user might need to refresh later.
    revalidatePath("/admin/github");
    return { success: true, message: res.message || "Sync started" };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error("Error syncing GitHub repos:", error);
    return { error: error.message || "Failed to start GitHub sync" };
  }
}

export async function importGithubRepositoryAction(githubId: number) {
  try {
    const res = (await fetchClient(`/api/v1/admin/github/import/${githubId}`, {
      method: "POST",
    })) as any;
    
    revalidatePath("/admin/github");
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    
    return { success: true, status: res.status, projectId: res.project_id };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error("Error importing GitHub repo:", error);
    return { error: error.message || "Failed to import repository" };
  }
}
