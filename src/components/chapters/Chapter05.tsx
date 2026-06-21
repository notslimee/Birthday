"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ChapterSection from "../ChapterSection";
import Star from "../Star";
import { AnimatedText, FadeIn } from "../AnimatedText";

export default function Chapter05() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <ChapterSection
      id="chapter-05"
      chapterNumber={5}
      gradient="radial-gradient(ellipse at 50% 30%, rgba(10, 30, 80, 0.4) 0%, transparent 60%)"
    >
      <div ref={ref} className="relative w-full min-h-[50vh] flex flex-col items-center justify-center">
        {/* Stars close together - watching a movie */}
        <div className="relative w-full h-40 md:h-48 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Star color="gold" size={12} x="44%" y="50%" delay={0.3} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Star color="blue" size={12} x="56%" y="50%" delay={0.6} />
          </motion.div>

          {/* Strong glowing connection */}
          <motion.div
            className="absolute top-1/2 left-[45%] right-[45%]"
            style={{ height: 2 }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(251, 191, 36, 0.6), rgba(96, 165, 250, 0.6))",
                boxShadow: "0 0 8px rgba(167, 139, 250, 0.3)",
              }}
              animate={{
                boxShadow: [
                  "0 0 8px rgba(167, 139, 250, 0.3)",
                  "0 0 16px rgba(167, 139, 250, 0.5)",
                  "0 0 8px rgba(167, 139, 250, 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </div>

        <FadeIn delay={0.3}>
          <span className="chapter-number block mb-4">January 18</span>
        </FadeIn>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6">
          <span className="text-glow-blue">
            <AnimatedText text="The Way of Water" delay={0.5} />
          </span>
        </h2>

        <div className="cosmic-divider" />

        <FadeIn delay={1.2} className="max-w-lg">
          <p className="font-light text-base md:text-lg leading-relaxed text-white/60">
            A shared experience. A movie that meant something.
            <br />
            Two stars, side by side, watching the same sky.
          </p>
        </FadeIn>

        {/* Water effect / waves */}
        <motion.div
          className="mt-10 relative w-64 h-20 overflow-hidden rounded-xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2 }}
        >
          {/* Water waves */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-[200%] h-12"
              style={{
                bottom: i * 6,
                left: "-50%",
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  rgba(96, 165, 250, ${0.08 - i * 0.02}) 25%, 
                  rgba(96, 165, 250, ${0.15 - i * 0.04}) 50%, 
                  rgba(96, 165, 250, ${0.08 - i * 0.02}) 75%, 
                  transparent 100%)`,
                borderRadius: "50%",
              }}
              animate={{
                x: [0, 60, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}

          {/* Avatar text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.p
              className="font-serif text-sm md:text-base text-star-blue/60 tracking-[0.3em]"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              AVATAR
            </motion.p>
          </div>
        </motion.div>

        <FadeIn delay={2.5} className="mt-6">
          <p className="font-serif italic text-base md:text-lg text-white/40">
            &ldquo;The way of water has no beginning and no end.&rdquo;
          </p>
        </FadeIn>
      </div>
    </ChapterSection>
  );
}
