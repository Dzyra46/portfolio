"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Plus, Award, Trash2, Edit2, ExternalLink } from "lucide-react";
import { createCertificateAction, deleteCertificateAction, updateCertificateAction } from "@/app/actions/portfolio";
import Link from "next/link";
import type { Certificate } from "@/types/portfolio";

function CertificateFormFields({ defaults }: { defaults?: Partial<Certificate> }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Certificate Name</label>
          <input type="text" name="name" required defaultValue={defaults?.name} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Issuing Organization</label>
          <input type="text" name="issuer" required defaultValue={defaults?.issuer} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Issue Date</label>
          <input type="date" name="issue_date" defaultValue={defaults?.issue_date} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Expiration Date</label>
          <input type="date" name="expiry_date" defaultValue={defaults?.expiry_date} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Credential ID</label>
          <input type="text" name="credential_id" defaultValue={defaults?.credential_id} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Credential URL</label>
          <input type="url" name="credential_url" defaultValue={defaults?.credential_url} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Image URL (Optional)</label>
        <input type="url" name="image_url" defaultValue={defaults?.image_url} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2" />
      </div>
      <label className="flex items-center space-x-2 pt-2">
        <input type="checkbox" name="is_published" value="true" defaultChecked={defaults?.is_published ?? true} className="rounded bg-slate-950 border-slate-700" />
        <span className="text-sm text-slate-300">Publish immediately</span>
      </label>
    </>
  );
}

export function CertificatesClient({ initialData }: { initialData: Certificate[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certificate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(formData: FormData) {
    setIsSubmitting(true);
    await createCertificateAction(null, formData);
    setIsSubmitting(false);
    setIsCreateOpen(false);
  }

  async function handleUpdate(formData: FormData) {
    if (!editingItem) return;
    setIsSubmitting(true);
    const data = {
      name: formData.get("name") as string,
      issuer: formData.get("issuer") as string,
      credential_id: formData.get("credential_id") as string || undefined,
      credential_url: formData.get("credential_url") as string || undefined,
      issue_date: formData.get("issue_date") as string || undefined,
      expiry_date: formData.get("expiry_date") as string || undefined,
      image_url: formData.get("image_url") as string || undefined,
      is_published: formData.get("is_published") === "true",
      sort_order: editingItem.sort_order,
    };
    await updateCertificateAction(editingItem.id, data);
    setIsSubmitting(false);
    setEditingItem(null);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-slate-400 mt-2">Showcase your professional certifications.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center space-x-2">
          <Plus size={16} /><span>Add Certificate</span>
        </Button>
      </div>

      {initialData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
          <div className="p-4 bg-slate-800 rounded-full mb-4"><Award size={32} className="text-slate-400" /></div>
          <h3 className="text-xl font-bold mb-2 text-white">No Certificates Added</h3>
          <p className="text-slate-400 mb-6 max-w-md">Showcase your achievements by adding certifications.</p>
          <Button onClick={() => setIsCreateOpen(true)}>Add Certificate</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {initialData.map((cert) => (
            <Card key={cert.id} className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white leading-tight">{cert.name}</h3>
                  {cert.is_published ? (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20 ml-2">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs rounded border border-amber-500/20 ml-2">Draft</span>
                  )}
                </div>
                <div className="text-purple-400 font-medium mb-4">{cert.issuer}</div>
                <div className="text-sm font-mono text-slate-400 space-y-1 mb-4">
                  <div>Issued: {cert.issue_date || "N/A"}</div>
                  {cert.expiry_date && <div>Expires: {cert.expiry_date}</div>}
                  {cert.credential_id && <div>ID: {cert.credential_id}</div>}
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2" onClick={() => setEditingItem(cert)}>
                    <Edit2 size={16} />
                  </Button>
                  <ConfirmDialog
                    title="Delete Certificate"
                    message={`Delete "${cert.name}"? This cannot be undone.`}
                    onConfirm={async () => { await deleteCertificateAction(cert.id); }}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2">
                        <Trash2 size={16} />
                      </Button>
                    }
                  />
                </div>
                {cert.credential_url && (
                  <Link href={cert.credential_url} target="_blank">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <ExternalLink size={14} className="mr-2" /> Verify
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Certificate">
        <form action={handleCreate} className="space-y-4">
          <CertificateFormFields />
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Certificate"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="Edit Certificate">
        {editingItem && (
          <form action={handleUpdate} className="space-y-4">
            <CertificateFormFields defaults={editingItem} />
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
