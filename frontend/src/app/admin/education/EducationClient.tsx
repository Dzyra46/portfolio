"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Plus, GraduationCap, Trash2, Edit2 } from "lucide-react";
import { createEducationAction, deleteEducationAction, updateEducationAction } from "@/app/actions/portfolio";
import type { Education } from "@/types/portfolio";

function EducationFormFields({ defaults }: { defaults?: Partial<Education> }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Institution</label>
          <input type="text" name="institution" required defaultValue={defaults?.institution} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Degree</label>
          <input type="text" name="degree" required defaultValue={defaults?.degree} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Field of Study (Optional)</label>
        <input type="text" name="field_of_study" defaultValue={defaults?.field_of_study} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
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
      <label className="flex items-center space-x-2 pt-2">
        <input type="checkbox" name="is_published" value="true" defaultChecked={defaults?.is_published ?? true} className="rounded bg-slate-950 border-slate-700" />
        <span className="text-sm text-slate-300">Publish immediately</span>
      </label>
    </>
  );
}

export function EducationClient({ initialData }: { initialData: Education[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(formData: FormData) {
    setIsSubmitting(true);
    await createEducationAction(null, formData);
    setIsSubmitting(false);
    setIsCreateOpen(false);
  }

  async function handleUpdate(formData: FormData) {
    if (!editingItem) return;
    setIsSubmitting(true);
    const data = {
      institution: formData.get("institution") as string,
      degree: formData.get("degree") as string,
      field_of_study: formData.get("field_of_study") as string || undefined,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string || undefined,
      description: formData.get("description") as string || undefined,
      is_published: formData.get("is_published") === "true",
      sort_order: editingItem.sort_order,
    };
    await updateEducationAction(editingItem.id, data);
    setIsSubmitting(false);
    setEditingItem(null);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Education</h1>
          <p className="text-slate-400 mt-2">Manage your academic background.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center space-x-2">
          <Plus size={16} /><span>Add Education</span>
        </Button>
      </div>

      {initialData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
          <div className="p-4 bg-slate-800 rounded-full mb-4"><GraduationCap size={32} className="text-slate-400" /></div>
          <h3 className="text-xl font-bold mb-2 text-white">No Education Added</h3>
          <p className="text-slate-400 mb-6 max-w-md">Start by adding your first degree or school.</p>
          <Button onClick={() => setIsCreateOpen(true)}>Add Education</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {initialData.map((edu) => (
            <Card key={edu.id} className="p-6 flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                  {edu.is_published ? (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs rounded border border-amber-500/20">Draft</span>
                  )}
                </div>
                <div className="text-purple-400 font-medium mb-2">{edu.degree} {edu.field_of_study && <span className="text-slate-500 font-normal">&middot; {edu.field_of_study}</span>}</div>
                <div className="text-sm font-mono text-slate-400 mb-4">{edu.start_date} — {edu.end_date || "Present"}</div>
                {edu.description && <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-3">{edu.description}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2" onClick={() => setEditingItem(edu)}>
                  <Edit2 size={16} />
                </Button>
                <ConfirmDialog
                  title="Delete Education"
                  message={`Delete "${edu.institution} - ${edu.degree}"? This cannot be undone.`}
                  onConfirm={async () => { await deleteEducationAction(edu.id); }}
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

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Education">
        <form action={handleCreate} className="space-y-4">
          <EducationFormFields />
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Education"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="Edit Education">
        {editingItem && (
          <form action={handleUpdate} className="space-y-4">
            <EducationFormFields defaults={editingItem} />
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
