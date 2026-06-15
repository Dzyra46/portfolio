import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
}

export function SectionWrapper({ className, id, children, ...props }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("w-full py-16 md:py-24 lg:py-32", className)}
      {...props}
    >
      {children}
    </section>
  );
}
