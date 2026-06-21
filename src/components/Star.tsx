"use client";

import { motion } from "framer-motion";

interface StarProps {
  color: "gold" | "blue";
  size?: number;
  x?: string;
  y?: string;
  delay?: number;
  label?: string;
  pulse?: boolean;
}

export default function Star({
  color,
  size = 12,
  x = "50%",
  y = "50%",
  delay = 0,
  label,
  pulse = true,
}: StarProps) {
  const colorMap = {
    gold: {
      core: "#fbbf24",
      glow: "rgba(251, 191, 36, 0.6)",
      outerGlow: "rgba(251, 191, 36, 0.15)",
    },
    blue: {
      core: "#60a5fa",
      glow: "rgba(96, 165, 250, 0.6)",
      outerGlow: "rgba(96, 165, 250, 0.15)",
    },
  };

  const c = colorMap[color];

  return (
    <motion.div
      className="absolute z-10"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 6,
          height: size * 6,
          left: -(size * 6 - size) / 2,
          top: -(size * 6 - size) / 2,
          background: `radial-gradient(circle, ${c.outerGlow} 0%, transparent 70%)`,
        }}
        animate={
          pulse
            ? {
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      />

      {/* Middle glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 3,
          height: size * 3,
          left: -(size * 3 - size) / 2,
          top: -(size * 3 - size) / 2,
          background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`,
        }}
        animate={
          pulse
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }
            : {}
        }
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.3,
        }}
      />

      {/* Core */}
      <motion.div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 30%, white, ${c.core})`,
          boxShadow: `0 0 ${size}px ${c.glow}, 0 0 ${size * 2}px ${c.outerGlow}`,
        }}
        animate={
          pulse
            ? {
                boxShadow: [
                  `0 0 ${size}px ${c.glow}, 0 0 ${size * 2}px ${c.outerGlow}`,
                  `0 0 ${size * 1.5}px ${c.glow}, 0 0 ${size * 3}px ${c.outerGlow}`,
                  `0 0 ${size}px ${c.glow}, 0 0 ${size * 2}px ${c.outerGlow}`,
                ],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Label */}
      {label && (
        <motion.span
          className="absolute whitespace-nowrap text-xs font-light tracking-widest"
          style={{
            top: size + 16,
            left: "50%",
            transform: "translateX(-50%)",
            color: c.core,
            textShadow: `0 0 10px ${c.glow}`,
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: delay + 1, duration: 1 }}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}
