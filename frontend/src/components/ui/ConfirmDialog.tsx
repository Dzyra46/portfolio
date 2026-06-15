"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  trigger: React.ReactNode;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  trigger,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="fixed inset-0"
            onClick={() => !isLoading && setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleConfirm}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 shadow-red-500/20"
              >
                {isLoading ? "Deleting..." : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
