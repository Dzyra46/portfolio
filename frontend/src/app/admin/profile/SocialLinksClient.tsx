"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createSocialLinkAction, updateSocialLinkAction, deleteSocialLinkAction } from "@/app/actions/portfolio";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";

export function SocialLinksClient({ initialLinks = [] }: { initialLinks: any[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ platform: "", url: "", sort_order: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClassName = "bg-slate-900 border border-slate-700 rounded-md p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500";

  const handleSave = async () => {
    if (!formData.platform || !formData.url) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateSocialLinkAction(editingId, formData);
        setLinks(links.map(l => l.id === editingId ? { ...l, ...formData } : l));
        setEditingId(null);
      } else {
        const result: any = await createSocialLinkAction(formData);
        if (result.success && result.data) {
          setLinks([...links, result.data]);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsSubmitting(false);
    setIsAdding(false);
    setFormData({ platform: "", url: "", sort_order: 0 });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      await deleteSocialLinkAction(id);
      setLinks(links.filter(l => l.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card className="p-6 max-w-xl mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-200">Social Links</h2>
        {!isAdding && !editingId && (
          <Button size="sm" onClick={() => setIsAdding(true)} className="flex items-center gap-2">
            <Plus size={16} /> Add Link
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {links.sort((a, b) => a.sort_order - b.sort_order).map((link) => (
          <div key={link.id} className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex-wrap gap-2">
            {editingId === link.id ? (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 mr-2">
                <input
                  type="text"
                  placeholder="Platform (e.g. GitHub)"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className={inputClassName}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className={inputClassName}
                />
                <input
                  type="number"
                  placeholder="Order"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className={inputClassName}
                />
              </div>
            ) : (
              <div>
                <p className="font-bold text-slate-200">{link.platform}</p>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline">
                  {link.url}
                </a>
              </div>
            )}

            <div className="flex items-center gap-2">
              {editingId === link.id ? (
                <>
                  <button disabled={isSubmitting} onClick={handleSave} className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded">
                    <Check size={18} />
                  </button>
                  <button disabled={isSubmitting} onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-800 rounded">
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setEditingId(link.id);
                      setFormData({ platform: link.platform, url: link.url, sort_order: link.sort_order || 0 });
                      setIsAdding(false);
                    }} 
                    className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(link.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded">
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {isAdding && (
          <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex-wrap gap-2">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 mr-2">
              <input
                type="text"
                placeholder="Platform (e.g. GitHub)"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className={inputClassName}
              />
              <input
                type="url"
                placeholder="URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className={inputClassName}
              />
              <input
                type="number"
                placeholder="Order"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className={inputClassName}
              />
            </div>
            <div className="flex items-center gap-2">
              <button disabled={isSubmitting} onClick={handleSave} className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded">
                <Check size={18} />
              </button>
              <button disabled={isSubmitting} onClick={() => setIsAdding(false)} className="p-2 text-slate-400 hover:bg-slate-800 rounded">
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {links.length === 0 && !isAdding && (
        <p className="text-slate-500 text-sm italic text-center py-4">No social links added yet.</p>
      )}
    </Card>
  );
}
