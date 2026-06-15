import { Metadata } from "next";
import { fetchClient } from "@/lib/api/client";
import { GithubSyncClient } from "./GithubSyncClient";

export const metadata: Metadata = {
  title: "GitHub Sync | Admin",
  description: "Sync your GitHub repositories to your portfolio.",
};

export default async function GithubSyncPage() {
  let repos = [];
  try {
    repos = (await fetchClient("/api/v1/admin/github/repositories", {
      next: { tags: ["github-repos"], revalidate: 0 }
    })) as any[];
  } catch (error) {
    console.error("Failed to load GitHub repositories:", error);
  }

  return <GithubSyncClient initialData={repos} />;
}
