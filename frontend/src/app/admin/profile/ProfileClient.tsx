"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { updateProfileAction } from "@/app/actions/portfolio";
import { User } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Profile"}
    </Button>
  );
}

export function ProfileClient({ initialData }: { initialData: any }) {
  const [state, formAction] = useActionState(updateProfileAction, { error: null });
  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar_url || "");

  const inputClassName = "w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200";

  return (
    <Card className="p-6 max-w-xl">
      <form action={formAction} className="space-y-4">
        {/* Avatar Preview */}
        <div className="flex flex-col items-center pb-6 mb-2">
          <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center overflow-hidden mb-3 transition-all duration-300 hover:border-purple-500/50">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Avatar preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  setAvatarPreview("");
                }}
              />
            ) : (
              <User size={40} className="text-slate-500" />
            )}
          </div>
          <p className="text-sm font-medium text-slate-400">Profile Picture</p>
        </div>

        {/* Transient State Alerts */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${state?.error || state?.success ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded mb-2">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 text-sm p-3 rounded mb-2">
              Profile updated successfully!
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <input
              type="text"
              name="full_name"
              defaultValue={initialData?.full_name}
              required
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={initialData?.title}
              required
              className={inputClassName}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Bio</label>
          <textarea
            name="bio"
            defaultValue={initialData?.bio}
            rows={4}
            className={inputClassName}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={initialData?.location}
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              name="email"
              defaultValue={initialData?.email}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Avatar URL (Optional)</label>
            <input
              type="url"
              name="avatar_url"
              defaultValue={initialData?.avatar_url}
              onChange={(e) => setAvatarPreview(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Resume URL (Optional)</label>
            <input
              type="url"
              name="resume_url"
              defaultValue={initialData?.resume_url}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <SubmitButton />
        </div>
      </form>
    </Card>
  );
}
