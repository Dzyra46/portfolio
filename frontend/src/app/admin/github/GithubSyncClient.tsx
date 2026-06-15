"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RefreshCw, Download, Github, Star, GitFork } from "lucide-react";
import { syncGithubRepositoriesAction, importGithubRepositoryAction } from "@/app/actions/github";
import { useRouter } from "next/navigation";

export function GithubSyncClient({ initialData }: { initialData: any[] }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);
  const router = useRouter();
  async function handleSync() {
    setIsSyncing(true);
    setMessage({ text: "Syncing repositories from GitHub...", type: "success" });
    const result = await syncGithubRepositoriesAction();
    setIsSyncing(false);
    if (result.error) {
      setMessage({ text: result.error, type: "error" });
    } else {
      setMessage({ text: result.message || "Sync complete! Repositories have been updated.", type: "success" });
      router.refresh();
    }
  }

  async function handleImport(githubId: number) {
    setImportingId(githubId);
    setMessage(null);
    const result = await importGithubRepositoryAction(githubId);
    setImportingId(null);
    if (result.error) {
      setMessage({ text: result.error, type: "error" });
    } else {
      setMessage({ text: `Project ${result.status}! (Check Projects tab)`, type: "success" });
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Github /> GitHub Integrations</h1>
          <p className="text-slate-400 mt-2">Sync and import your public GitHub repositories as portfolio projects.</p>
        </div>
        <Button onClick={handleSync} disabled={isSyncing} className="flex items-center space-x-2">
          <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
          <span>{isSyncing ? "Syncing..." : "Sync from GitHub"}</span>
        </Button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-16 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="p-4 bg-slate-800 rounded-full mb-4">
              <Github size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">No Repositories Synced</h3>
            <p className="text-slate-400 mb-6 max-w-md">Click the Sync button above to fetch your repositories from GitHub.</p>
          </div>
        ) : (
          initialData.map((repo) => (
            <Card key={repo.github_id} className="flex flex-col h-full overflow-hidden border-slate-800/60 bg-slate-900/40">
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold truncate pr-2">{repo.name}</h3>
                  {repo.project_id && (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20 whitespace-nowrap">
                      Imported
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">{repo.description || "No description provided."}</p>
                
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  {repo.language && <span>{repo.language}</span>}
                  <span className="flex items-center gap-1"><Star size={12} /> {repo.stars}</span>
                  <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks}</span>
                </div>
                
                {!repo.is_active && (
                  <div className="mb-4 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                    Archived/Deleted on GitHub. Portfolio project drafted if linked.
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 mt-auto">
                  <Button 
                    variant={repo.project_id ? "outline" : "primary"} 
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => handleImport(repo.github_id)}
                    disabled={importingId === repo.github_id}
                  >
                    {importingId === repo.github_id ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    <span>
                      {importingId === repo.github_id ? "Importing..." : (repo.project_id ? "Update Project" : "Import to Portfolio")}
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
