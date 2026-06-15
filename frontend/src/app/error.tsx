"use client";

import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="p-4 bg-red-500/10 rounded-full mb-6">
        <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-2.694-.834-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4 font-[family-name:var(--font-outfit)]">
        Something went wrong
      </h2>
      <p className="text-slate-400 mb-8 max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </main>
  );
}
