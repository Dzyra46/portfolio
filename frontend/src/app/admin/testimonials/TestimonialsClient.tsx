"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Plus, MessageCircleHeart, Trash2, Edit2, Star } from "lucide-react";
import { createTestimonialAction, deleteTestimonialAction, updateTestimonialAction } from "@/app/actions/portfolio";
import type { Testimonial } from "@/types/portfolio";

function TestimonialFormFields({ defaults }: { defaults?: Partial<Testimonial> }) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Quote / Content</label>
        <textarea name="content" required rows={4} defaultValue={defaults?.content} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" placeholder="What did they say?"></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Author Name</label>
          <input type="text" name="author_name" required defaultValue={defaults?.author_name} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Author Title (Optional)</label>
          <input type="text" name="author_title" defaultValue={defaults?.author_title} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" placeholder="e.g. CTO" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Author Company (Optional)</label>
          <input type="text" name="author_company" defaultValue={defaults?.author_company} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Rating (1-5)</label>
          <input type="number" name="rating" min="1" max="5" defaultValue={defaults?.rating ?? 5} required className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Avatar URL (Optional)</label>
        <input type="url" name="author_avatar_url" defaultValue={defaults?.author_avatar_url} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" placeholder="https://..." />
      </div>
      <div className="flex items-center space-x-4 pt-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="is_published" value="true" defaultChecked={defaults?.is_published ?? true} className="rounded bg-slate-950 border-slate-700" />
          <span className="text-sm text-slate-300">Publish</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="featured" value="true" defaultChecked={defaults?.featured} className="rounded bg-slate-950 border-slate-700" />
          <span className="text-sm text-slate-300">Featured</span>
        </label>
      </div>
    </>
  );
}

export function TestimonialsClient({ initialData }: { initialData: Testimonial[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(formData: FormData) {
    setIsSubmitting(true);
    await createTestimonialAction(null, formData);
    setIsSubmitting(false);
    setIsCreateOpen(false);
  }

  async function handleUpdate(formData: FormData) {
    if (!editingItem) return;
    setIsSubmitting(true);
    const data = {
      author_name: formData.get("author_name") as string,
      author_title: formData.get("author_title") as string || undefined,
      author_company: formData.get("author_company") as string || undefined,
      author_avatar_url: formData.get("author_avatar_url") as string || undefined,
      content: formData.get("content") as string,
      rating: parseInt(formData.get("rating") as string || "5", 10),
      is_published: formData.get("is_published") === "true",
      featured: formData.get("featured") === "true",
      sort_order: editingItem.sort_order,
    };
    await updateTestimonialAction(editingItem.id, data);
    setIsSubmitting(false);
    setEditingItem(null);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-slate-400 mt-2">Manage endorsements and feedback.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center space-x-2">
          <Plus size={16} /><span>Add Testimonial</span>
        </Button>
      </div>

      {initialData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
          <div className="p-4 bg-slate-800 rounded-full mb-4"><MessageCircleHeart size={32} className="text-slate-400" /></div>
          <h3 className="text-xl font-bold mb-2 text-white">No Testimonials Added</h3>
          <p className="text-slate-400 mb-6 max-w-md">Build trust by adding feedback from colleagues, managers, or clients.</p>
          <Button onClick={() => setIsCreateOpen(true)}>Add Testimonial</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialData.map((test) => (
            <Card key={test.id} className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < test.rating ? "fill-current" : "text-slate-700"} />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    {test.featured && <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">Featured</span>}
                    {test.is_published ? (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">Published</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs rounded border border-amber-500/20">Draft</span>
                    )}
                  </div>
                </div>
                <p className="text-slate-300 italic mb-6 leading-relaxed line-clamp-4">&ldquo;{test.content}&rdquo;</p>
                <div className="flex items-center space-x-4">
                  {test.author_avatar_url ? (
                    <img src={test.author_avatar_url} alt={test.author_name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700 font-bold">
                      {test.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-white leading-tight">{test.author_name}</h4>
                    <p className="text-xs text-slate-400">{test.author_title} {test.author_company && `at ${test.author_company}`}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end mt-4 pt-4 border-t border-slate-800 space-x-1">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2" onClick={() => setEditingItem(test)}>
                  <Edit2 size={16} />
                </Button>
                <ConfirmDialog
                  title="Delete Testimonial"
                  message={`Delete testimonial from "${test.author_name}"? This cannot be undone.`}
                  onConfirm={async () => { await deleteTestimonialAction(test.id); }}
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

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Testimonial">
        <form action={handleCreate} className="space-y-4">
          <TestimonialFormFields />
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Testimonial"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="Edit Testimonial">
        {editingItem && (
          <form action={handleUpdate} className="space-y-4">
            <TestimonialFormFields defaults={editingItem} />
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
