import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20",
  secondary: "bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg shadow-cyan-500/20",
  outline: "border border-purple-500/50 text-purple-400 hover:bg-purple-500/10",
  ghost: "text-slate-300 hover:text-white hover:bg-slate-800",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export function buttonVariants({ variant = "primary", size = "md", className }: { variant?: keyof typeof variants; size?: keyof typeof sizes; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        aria-disabled={props.disabled}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
