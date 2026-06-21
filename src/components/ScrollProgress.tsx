"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #fbbf24, #f472b6, #a78bfa, #60a5fa)",
      }}
    />
  );
}
