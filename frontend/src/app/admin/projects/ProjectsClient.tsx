"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, FolderGit2 } from "lucide-react";
import { deleteProjectAction, updateProjectAction } from "@/app/actions/portfolio";
import type { Project } from "@/types/portfolio";

function ProjectEditFields({ defaults }: { defaults: Project }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Title</label>
          <input type="text" name="title" required defaultValue={defaults.title} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Slug</label>
          <input type="text" name="slug" required defaultValue={defaults.slug} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Summary</label>
        <textarea name="summary" rows={3} defaultValue={defaults.summary} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2"></textarea>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Cover Image URL</label>
        <input type="text" name="cover_image_url" defaultValue={defaults.cover_image_url} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Live URL</label>
          <input type="url" name="live_url" defaultValue={defaults.live_url} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">GitHub URL</label>
          <input type="url" name="github_url" defaultValue={defaults.github_url} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Case Study (Markdown)</label>
        <textarea name="case_study" rows={6} defaultValue={defaults.case_study} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 font-mono text-sm"></textarea>
      </div>
      <div className="flex items-center space-x-4 pt-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="is_published" value="true" defaultChecked={defaults.is_published} className="rounded bg-slate-950 border-slate-700" />
          <span className="text-sm text-slate-300">Published</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="featured" value="true" defaultChecked={defaults.featured} className="rounded bg-slate-950 border-slate-700" />
          <span className="text-sm text-slate-300">Featured</span>
        </label>
        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-400">Sort</label>
          <input type="number" name="sort_order" defaultValue={defaults.sort_order} className="w-16 bg-slate-950 border border-slate-700 rounded-md p-1 text-center text-sm" />
        </div>
      </div>
    </>
  );
}

export function ProjectsClient({ initialData }: { initialData: Project[] }) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleUpdate(formData: FormData) {
    if (!editingProject) return;
    setIsSubmitting(true);
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      summary: formData.get("summary") as string || undefined,
      cover_image_url: formData.get("cover_image_url") as string || undefined,
      live_url: formData.get("live_url") as string || undefined,
      github_url: formData.get("github_url") as string || undefined,
      case_study: formData.get("case_study") as string || undefined,
      is_published: formData.get("is_published") === "true",
      featured: formData.get("featured") === "true",
      sort_order: parseInt(formData.get("sort_order") as string || "0", 10),
    };
    await updateProjectAction(editingProject.id, data);
    setIsSubmitting(false);
    setEditingProject(null);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-slate-400 mt-2">Manage your portfolio projects.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="flex items-center space-x-2">
            <Plus size={16} /><span>Add Project</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-16 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="p-4 bg-slate-800 rounded-full mb-4">
              <FolderGit2 size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">No Projects Found</h3>
            <p className="text-slate-400 mb-6 max-w-md">Get started by creating your first project to showcase your work.</p>
            <Link href="/admin/projects/new"><Button>Create Project</Button></Link>
          </div>
        ) : (
          initialData.map((project) => (
            <Card key={project.id} className="flex flex-col h-full overflow-hidden">
              {project.cover_image_url && (
                <div className="h-40 bg-cover bg-center border-b border-slate-800" style={{ backgroundImage: `url(${project.cover_image_url})` }} />
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <div className="flex space-x-2">
                    {project.featured && <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">Featured</span>}
                    {project.is_published ? (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">Published</span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded border border-amber-500/20">Draft</span>
                    )}
                  </div>
                </div>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">{project.summary}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingProject(project)}>
                      <Edit2 size={14} />
                    </Button>
                    <ConfirmDialog
                      title="Delete Project"
                      message={`Delete "${project.title}"? This cannot be undone.`}
                      onConfirm={async () => { await deleteProjectAction(project.id); }}
                      trigger={
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2">
                          <Trash2 size={14} />
                        </Button>
                      }
                    />
                  </div>
                  {project.slug && (
                    <Link href={`/projects/${project.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-slate-200">
                        <ExternalLink size={14} className="mr-2" /> View
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)} title="Edit Project">
        {editingProject && (
          <form action={handleUpdate} className="space-y-4">
            <ProjectEditFields defaults={editingProject} />
            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
              <Button type="button" variant="ghost" onClick={() => setEditingProject(null)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
