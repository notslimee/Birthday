"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ConnectionLineProps {
  visible?: boolean;
  color?: string;
  dashed?: boolean;
  glow?: boolean;
  className?: string;
}

export default function ConnectionLine({
  visible = true,
  color = "rgba(167, 139, 250, 0.4)",
  dashed = false,
  glow = false,
  className = "",
}: ConnectionLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`relative w-48 md:w-64 mx-auto ${className}`}
      style={{ height: 2 }}
      initial={{ opacity: 0 }}
      animate={isInView && visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Main line */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0px, ${color} 8px, transparent 8px, transparent 16px)`
            : `linear-gradient(90deg, transparent, ${color}, transparent)`,
          height: 1,
          top: "50%",
        }}
        initial={{ scaleX: 0 }}
        animate={isInView && visible ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />

      {/* Glow effect */}
      {glow && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            height: 6,
            top: "calc(50% - 3px)",
            filter: "blur(4px)",
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Traveling light */}
      {visible && (
        <motion.div
          className="absolute"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "white",
            boxShadow: `0 0 12px ${color}, 0 0 24px ${color}`,
            top: "calc(50% - 4px)",
          }}
          animate={{
            left: ["-4px", "calc(100% - 4px)", "-4px"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
}
