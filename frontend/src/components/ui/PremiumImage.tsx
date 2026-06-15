"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function PremiumImage({ className, alt, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      className={cn(
        "transition-opacity duration-700 ease-in-out",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      onLoad={() => setIsLoaded(true)}
      alt={alt || "Image"}
      {...props}
    />
  );
}
