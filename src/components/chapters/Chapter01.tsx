"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ChapterSection from "../ChapterSection";
import Star from "../Star";
import { AnimatedText, FadeIn } from "../AnimatedText";

export default function Chapter01() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <ChapterSection
      id="chapter-01"
      chapterNumber={1}
      gradient="radial-gradient(ellipse at 50% 50%, rgba(26, 16, 61, 0.5) 0%, transparent 70%)"
    >
      <div ref={ref} className="relative w-full min-h-[60vh] flex flex-col items-center justify-center">
        {/* Two stars far apart */}
        <div className="relative w-full h-40 md:h-48 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Star color="gold" size={10} x="20%" y="50%" label="him" delay={0.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
          >
            <Star color="blue" size={10} x="80%" y="50%" label="her" delay={1} />
          </motion.div>

          {/* Faint connection forming */}
          <motion.div
            className="absolute top-1/2 left-[25%] right-[25%]"
            style={{ height: 1 }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={
              isInView
                ? { opacity: 0.15, scaleX: 1 }
                : { opacity: 0, scaleX: 0 }
            }
            transition={{ duration: 2, delay: 1.5 }}
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(251, 191, 36, 0.3), transparent 30%, transparent 70%, rgba(96, 165, 250, 0.3))",
              }}
            />
          </motion.div>
        </div>

        {/* Month title */}
        <FadeIn delay={0.3}>
          <span className="chapter-number block mb-4">December</span>
        </FadeIn>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-glow-violet">
          <AnimatedText text="The First Message" delay={0.5} />
        </h2>

        <div className="cosmic-divider" />

        <FadeIn delay={1.2} className="max-w-lg">
          <p className="font-light text-base md:text-lg leading-relaxed text-white/60">
            In the vast expanse of the digital universe,
            <br />
            two stars blinked into each other&apos;s existence.
          </p>
        </FadeIn>

        <FadeIn delay={1.8} className="mt-8">
          <p className="font-serif italic text-lg md:text-xl text-accent-violet/80">
            &ldquo;A simple hello that would change everything.&rdquo;
          </p>
        </FadeIn>

        {/* Floating message bubbles */}
        <div className="mt-12 space-y-3">
          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            <div className="bg-star-gold/10 border border-star-gold/20 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[200px] md:max-w-[260px]">
              <p className="text-sm text-star-gold/90 font-light">Hey! 👋</p>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ delay: 3.3, duration: 0.8 }}
          >
            <div className="bg-star-blue/10 border border-star-blue/20 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[200px] md:max-w-[260px]">
              <p className="text-sm text-star-blue/90 font-light">Hi! 😊</p>
            </div>
          </motion.div>
        </div>
      </div>
    </ChapterSection>
  );
}
