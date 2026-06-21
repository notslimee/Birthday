"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ChapterSection from "../ChapterSection";
import Star from "../Star";
import { AnimatedText, FadeIn } from "../AnimatedText";
import ConnectionLine from "../ConnectionLine";

export default function Chapter08() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <ChapterSection
      id="chapter-08"
      chapterNumber={8}
      gradient="radial-gradient(ellipse at 50% 40%, rgba(26, 16, 61, 0.5) 0%, transparent 55%)"
    >
      <div ref={ref} className="relative w-full min-h-[50vh] flex flex-col items-center justify-center">
        {/* Stars coming back together gently */}
        <div className="relative w-full h-48 md:h-56 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <Star color="gold" size={13} x="42%" y="50%" delay={0.3} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <Star color="blue" size={13} x="58%" y="50%" delay={0.8} />
          </motion.div>

          {/* Healed connection with warm glow */}
          <motion.div
            className="absolute top-1/2 left-[43%] right-[43%]"
            style={{ height: 2 }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 2, delay: 1.5 }}
          >
            <motion.div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(251, 191, 36, 0.6), rgba(244, 114, 182, 0.6), rgba(96, 165, 250, 0.6))",
              }}
            />
            {/* Soft glow around connection */}
            <motion.div
              className="absolute -inset-2 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(251, 191, 36, 0.1), rgba(244, 114, 182, 0.15), rgba(96, 165, 250, 0.1))",
                filter: "blur(6px)",
              }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Healing particles merging around connection */}
          {isInView &&
            Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-accent-violet/60"
                style={{
                  left: `${44 + ((i * 17) % 12)}%`,
                  top: `${40 + ((i * 23) % 20)}%`,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -20 + ((i * 11) % 40)],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              />
            ))}
        </div>

        <FadeIn delay={0.3}>
          <span className="chapter-number block mb-4">Healing</span>
        </FadeIn>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-glow-violet">
          <AnimatedText text="Understanding" delay={0.5} />
        </h2>

        <ConnectionLine
          visible={isInView}
          glow
          color="rgba(167, 139, 250, 0.5)"
          className="mb-6"
        />

        <FadeIn delay={1.2} className="max-w-lg">
          <p className="font-light text-base md:text-lg leading-relaxed text-white/60">
            They learned to listen. To see each other&apos;s light.
            <br />
            The cracks became the places where understanding grew.
          </p>
        </FadeIn>

        <FadeIn delay={2} className="mt-8">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-10 h-10 rounded-full bg-star-gold/10 border border-star-gold/20 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-star-gold text-sm">♡</span>
            </motion.div>

            <motion.div
              className="text-accent-violet/40 text-xl tracking-[0.5em]"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ···
            </motion.div>

            <motion.div
              className="w-10 h-10 rounded-full bg-star-blue/10 border border-star-blue/20 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <span className="text-star-blue text-sm">♡</span>
            </motion.div>
          </div>
        </FadeIn>

        <FadeIn delay={2.8} className="mt-6">
          <p className="font-serif italic text-base md:text-lg text-white/40">
            &ldquo;What doesn&apos;t break us, binds us.&rdquo;
          </p>
        </FadeIn>
      </div>
    </ChapterSection>
  );
}
