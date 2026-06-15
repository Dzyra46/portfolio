"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { loginAction } from "@/app/actions/auth";

const initialState = {
  error: null as string | null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}

export default function AdminLogin() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              name="username"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2"
              placeholder="admin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2"
              placeholder="••••••••"
            />
          </div>
          <SubmitButton />
        </form>
      </Card>
    </div>
  );
}
