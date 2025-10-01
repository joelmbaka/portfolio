"use client";
import React, { useMemo, PropsWithChildren, useId } from "react";
import { motion } from "framer-motion";

interface SlideInProps {
  direction?: "auto" | "left" | "right"; // auto = random 50/50
  distance?: number; // px
  className?: string;
}

export default function SlideIn({
  children,
  direction = "auto",
  distance = 64,
  className,
}: PropsWithChildren<SlideInProps>) {
  const id = useId();
  const dx = useMemo(() => {
    if (direction === "left") return -distance;
    if (direction === "right") return distance;
    // Deterministic left/right based on stable id to avoid SSR/CSR mismatch
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0; // to 32-bit int
    }
    return (hash & 1) === 0 ? -distance : distance;
  }, [direction, distance, id]);

  return (
    <motion.div
      initial={{ x: dx, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
