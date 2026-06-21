"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedText, FadeIn } from "../AnimatedText";

export default function Chapter09() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { amount: 0.3 });

  // Scroll-driven zoom effect as user approaches the end of this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subtle zoom as user scrolls through
  const scale = useTransform(scrollYProgress, [0.3, 0.9], [1, 1.05]);

  return (
    <section
      ref={sectionRef}
      id="chapter-09"
      className="relative w-full flex flex-col items-center justify-center"
      style={{
        minHeight: "100dvh",
        padding: "2rem",
        // No background or hard edges — pure transparency
      }}
    >
      {/* Chapter number indicator */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 chapter-number"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        chapter 09
      </motion.div>

      {/* Chapter number indicator */}

      <motion.div
        ref={contentRef}
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center"
        style={{ scale }}
      >

        <FadeIn delay={0.3}>
          <span className="chapter-number block mb-4">Now</span>
        </FadeIn>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6">
          <span className="gradient-text">
            <AnimatedText text="Present Day" delay={0.5} />
          </span>
        </h2>

        <div className="cosmic-divider" />

        <FadeIn delay={1.2} className="max-w-lg">
          <p className="font-light text-base md:text-lg leading-relaxed text-white/60">
            Two stars, now a constellation.
            <br />
            A binary system — bound by gravity, lit by each other.
          </p>
        </FadeIn>

        <FadeIn delay={2} className="mt-8 max-w-md">
          <p className="font-light text-sm md:text-base leading-relaxed text-white/40">
            From a simple message in December to this moment —
            every chapter made the light stronger. Every silence made
            the words more meaningful. Every argument made the
            bond more real.
          </p>
        </FadeIn>

        {/* Scroll down hint */}
        <motion.div
          className="mt-12"
          animate={{ y: [0, 8, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/30 font-mono tracking-widest">
              one more thing
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-accent-violet/40"
            >
              <path
                d="M10 4 L10 16 M5 11 L10 16 L15 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
