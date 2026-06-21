"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ChapterSectionProps {
  id: string;
  chapterNumber: number;
  children: ReactNode;
  className?: string;
  gradient?: string;
}

export default function ChapterSection(props: ChapterSectionProps) {
  const { id, chapterNumber, children, className = "" } = props;
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });

  return (
    <section
      ref={ref}
      id={id}
      className={`chapter-section ${className}`}
    >
      {/* Chapter number indicator */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 chapter-number"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        chapter {String(chapterNumber).padStart(2, "0")}
      </motion.div>

      {/* Content container */}
      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
