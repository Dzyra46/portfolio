"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Trash2, Edit2, Plus, Code2 } from "lucide-react";
import { createSkillAction, deleteSkillAction, updateSkillAction } from "@/app/actions/portfolio";
import type { Skill } from "@/types/portfolio";

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Other"];

function SkillFormFields({ defaults }: { defaults?: Partial<Skill> }) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Name *</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={defaults?.name}
          className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 focus:outline-none focus:border-purple-500"
          placeholder="e.g. React"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Category *</label>
        <select
          name="category"
          required
          defaultValue={defaults?.category || "Frontend"}
          className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 focus:outline-none focus:border-purple-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Proficiency (0-100)</label>
        <input
          type="number"
          name="proficiency"
          min="0"
          max="100"
          defaultValue={defaults?.proficiency_level ?? 80}
          className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Icon (Optional)</label>
        <input
          type="text"
          name="icon"
          defaultValue={defaults?.icon}
          className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 focus:outline-none focus:border-purple-500"
          placeholder="e.g. react, python, docker"
        />
      </div>
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_published"
            value="true"
            defaultChecked={defaults?.is_published ?? true}
            className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-purple-500"
          />
          <span className="text-sm text-slate-300">Published</span>
        </label>
        <div className="flex items-center space-x-2">
          <label className="text-xs font-medium text-slate-400">Sort</label>
          <input
            type="number"
            name="sort_order"
            defaultValue={defaults?.sort_order ?? 0}
            className="w-16 bg-slate-950 border border-slate-700 rounded-md p-1 text-slate-200 text-center text-sm"
          />
        </div>
      </div>
    </>
  );
}

export function SkillsClient({ initialData }: { initialData: Skill[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(formData: FormData) {
    setIsSubmitting(true);
    await createSkillAction(null, formData);
    setIsSubmitting(false);
    setIsCreateOpen(false);
  }

  async function handleUpdate(formData: FormData) {
    if (!editingSkill) return;
    setIsSubmitting(true);
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      proficiency_level: parseInt(formData.get("proficiency") as string || "80", 10),
      icon: formData.get("icon") as string || undefined,
      is_published: formData.get("is_published") === "true",
      sort_order: parseInt(formData.get("sort_order") as string || "0", 10),
    };
    await updateSkillAction(editingSkill.id, data);
    setIsSubmitting(false);
    setEditingSkill(null);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Skills & Technologies</h1>
          <p className="text-slate-400 mt-2">Manage your tech stack and proficiencies.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Skill</span>
        </Button>
      </div>

      {initialData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
          <div className="p-4 bg-slate-800 rounded-full mb-4">
            <Code2 size={32} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">No Skills Added</h3>
          <p className="text-slate-400 mb-6 max-w-md">Add your first skill to showcase your technical stack.</p>
          <Button onClick={() => setIsCreateOpen(true)}>Add Skill</Button>
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-xl font-bold">Current Stack</h2>
            <span className="text-slate-400 text-sm">{initialData.length} total</span>
          </div>
          <ul className="divide-y divide-slate-800">
            {initialData.map((skill) => (
              <li key={skill.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                    {skill.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{skill.name}</p>
                    <p className="text-xs text-slate-400">{skill.category} • Proficiency: {skill.proficiency_level}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {!skill.is_published && (
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] rounded border border-amber-500/20 uppercase font-bold tracking-wider">Draft</span>
                  )}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white" onClick={() => setEditingSkill(skill)}>
                    <Edit2 size={14} />
                  </Button>
                  <ConfirmDialog
                    title="Delete Skill"
                    message={`Are you sure you want to delete "${skill.name}"? This action cannot be undone.`}
                    onConfirm={async () => { await deleteSkillAction(skill.id); }}
                    trigger={
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <Trash2 size={14} />
                      </Button>
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Skill">
        <form action={handleCreate} className="space-y-4">
          <SkillFormFields />
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Add Skill"}</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingSkill} onClose={() => setEditingSkill(null)} title="Edit Skill">
        {editingSkill && (
          <form action={handleUpdate} className="space-y-4">
            <SkillFormFields defaults={editingSkill} />
            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
              <Button type="button" variant="ghost" onClick={() => setEditingSkill(null)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
