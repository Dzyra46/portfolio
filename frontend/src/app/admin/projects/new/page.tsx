"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createProjectAction } from "@/app/actions/portfolio";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const initialState = {
  error: null as string | null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Project"}
    </Button>
  );
}

export default function NewProjectPage() {
  const [state, formAction] = useActionState(createProjectAction, initialState);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-slate-200">
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">New Project</h1>
      </div>

      <Card className="p-8">
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Project Title *</label>
              <input
                type="text"
                name="title"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-200 focus:outline-none focus:border-purple-500"
                placeholder="e.g. Portfolio V3"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">URL Slug *</label>
              <input
                type="text"
                name="slug"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-200 focus:outline-none focus:border-purple-500"
                placeholder="e.g. portfolio-v3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Summary / Description *</label>
            <textarea
              name="summary"
              required
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-200 focus:outline-none focus:border-purple-500"
              placeholder="Brief summary of the project..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Case Study Content (Markdown)</label>
            <textarea
              name="case_study"
              rows={8}
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-200 focus:outline-none focus:border-purple-500 font-mono text-sm"
              placeholder="## Overview&#10;Detailed case study using Markdown..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Cover Image URL</label>
            <input
              type="text"
              name="cover_image_url"
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-200 focus:outline-none focus:border-purple-500"
              placeholder="/uploads/image.png or https://..."
            />
          </div>

          <div className="flex flex-wrap gap-6 border-t border-slate-800 pt-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                value="true"
                defaultChecked
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-purple-500 focus:ring-purple-500"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-slate-300">Published</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                value="true"
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-purple-500 focus:ring-purple-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-slate-300">Featured on Home</label>
            </div>
            
            <div className="flex items-center space-x-2 ml-auto">
              <label className="text-sm font-medium text-slate-300">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue="0"
                className="w-20 bg-slate-800 border border-slate-700 rounded-md p-1 text-slate-200 focus:outline-none focus:border-purple-500 text-center"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Link href="/admin/projects" className="mr-4">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <SubmitButton />
          </div>
        </form>
      </Card>
    </div>
  );
}
