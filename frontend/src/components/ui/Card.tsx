import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden",
        glass ? "glass-card" : "bg-slate-900 border border-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
