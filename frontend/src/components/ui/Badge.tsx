import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "primary" | "secondary" | "subtle";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-slate-800 text-slate-300",
    outline: "border border-slate-700 text-slate-300",
    primary: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    secondary: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    subtle: "bg-slate-800/50 text-slate-400 border border-slate-700/50",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
