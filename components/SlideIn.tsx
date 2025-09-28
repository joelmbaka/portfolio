"use client";
import React, { useMemo, PropsWithChildren } from "react";
import { motion } from "framer-motion";

interface SlideInProps {
  direction?: "auto" | "left" | "right"; // auto = random 50/50
  distance?: number; // px
  duration?: number; // seconds (used for non-spring)
  className?: string;
}

export default function SlideIn({
  children,
  direction = "auto",
  distance = 64,
  duration = 0.45,
  className,
}: PropsWithChildren<SlideInProps>) {
  const dx = useMemo(() => {
    if (direction === "left") return -distance;
    if (direction === "right") return distance;
    return Math.random() < 0.5 ? -distance : distance;
  }, [direction, distance]);

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
