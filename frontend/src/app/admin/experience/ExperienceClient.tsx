"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Plus, Briefcase, Trash2, Edit2 } from "lucide-react";
import { createExperienceAction, deleteExperienceAction, updateExperienceAction } from "@/app/actions/portfolio";
import type { Experience } from "@/types/portfolio";

function ExperienceFormFields({ defaults }: { defaults?: Partial<Experience> }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Company</label>
          <input type="text" name="company" required defaultValue={defaults?.company} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Position</label>
          <input type="text" name="position" required defaultValue={defaults?.position} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Location (Optional)</label>
        <input type="text" name="location" defaultValue={defaults?.location} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Start Date</label>
          <input type="date" name="start_date" required defaultValue={defaults?.start_date} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">End Date</label>
          <input type="date" name="end_date" defaultValue={defaults?.end_date} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Description</label>
        <textarea name="description" rows={4} defaultValue={defaults?.description} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2"></textarea>
      </div>
      <div className="flex items-center space-x-4 pt-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="is_current" value="true" defaultChecked={defaults?.is_current} className="rounded bg-slate-950 border-slate-700" />
          <span className="text-sm text-slate-300">I currently work here</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="is_published" value="true" defaultChecked={defaults?.is_published ?? true} className="rounded bg-slate-950 border-slate-700" />
          <span className="text-sm text-slate-300">Publish</span>
        </label>
      </div>
    </>
  );
}

export function ExperienceClient({ initialData }: { initialData: Experience[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(formData: FormData) {
    setIsSubmitting(true);
    await createExperienceAction(null, formData);
    setIsSubmitting(false);
    setIsCreateOpen(false);
  }

  async function handleUpdate(formData: FormData) {
    if (!editingItem) return;
    setIsSubmitting(true);
    const data = {
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      location: formData.get("location") as string || undefined,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string || undefined,
      description: formData.get("description") as string || undefined,
      is_current: formData.get("is_current") === "true",
      is_published: formData.get("is_published") === "true",
      sort_order: editingItem.sort_order,
    };
    await updateExperienceAction(editingItem.id, data);
    setIsSubmitting(false);
    setEditingItem(null);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Work Experience</h1>
          <p className="text-slate-400 mt-2">Build your professional timeline.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center space-x-2">
          <Plus size={16} /><span>Add Experience</span>
        </Button>
      </div>

      {initialData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
          <div className="p-4 bg-slate-800 rounded-full mb-4"><Briefcase size={32} className="text-slate-400" /></div>
          <h3 className="text-xl font-bold mb-2 text-white">No Experience Added</h3>
          <p className="text-slate-400 mb-6 max-w-md">Start building your timeline by adding your first role.</p>
          <Button onClick={() => setIsCreateOpen(true)}>Add Work Experience</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {initialData.map((exp) => (
            <Card key={exp.id} className="p-6 flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                  {exp.is_published ? (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs rounded border border-amber-500/20">Draft</span>
                  )}
                </div>
                <div className="text-purple-400 font-medium mb-2">{exp.company} {exp.location && <span className="text-slate-500 font-normal">&middot; {exp.location}</span>}</div>
                <div className="text-sm font-mono text-slate-400 mb-4">{exp.start_date} — {exp.is_current ? "Present" : exp.end_date}</div>
                {exp.description && <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-3">{exp.description}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2" onClick={() => setEditingItem(exp)}>
                  <Edit2 size={16} />
                </Button>
                <ConfirmDialog
                  title="Delete Experience"
                  message={`Delete "${exp.position} at ${exp.company}"? This cannot be undone.`}
                  onConfirm={async () => { await deleteExperienceAction(exp.id); }}
                  trigger={
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2">
                      <Trash2 size={16} />
                    </Button>
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Work Experience">
        <form action={handleCreate} className="space-y-4">
          <ExperienceFormFields />
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Experience"}</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="Edit Experience">
        {editingItem && (
          <form action={handleUpdate} className="space-y-4">
            <ExperienceFormFields defaults={editingItem} />
            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
              <Button type="button" variant="ghost" onClick={() => setEditingItem(null)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
