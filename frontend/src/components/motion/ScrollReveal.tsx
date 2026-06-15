"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  viewportMargin?: string;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  viewportMargin = "-50px",
}: ScrollRevealProps) {
  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration: 0.7,
        ease: [0.21, 0.47, 0.32, 0.98], // Custom sleek easing
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = "",
  delayChildren = 0.1,
  staggerChildren = 0.1,
  viewportMargin = "-50px",
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  viewportMargin?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: viewportMargin }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerChildren,
            delayChildren: delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
