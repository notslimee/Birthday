"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ChapterSection from "../ChapterSection";
import Star from "../Star";
import { AnimatedText, FadeIn } from "../AnimatedText";

export default function Chapter03() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <ChapterSection
      id="chapter-03"
      chapterNumber={3}
      gradient="radial-gradient(ellipse at 70% 40%, rgba(10, 5, 32, 0.6) 0%, transparent 70%)"
    >
      <div ref={ref} className="relative w-full min-h-[50vh] flex flex-col items-center justify-center">
        {/* Stars - gold stays, blue fades and drifts */}
        <div className="relative w-full h-48 md:h-56 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Star color="gold" size={10} x="40%" y="50%" delay={0.3} />
          </motion.div>

          {/* Blue star fading / drifting away */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              isInView
                ? { opacity: [1, 0.3, 0.1], x: [0, 40, 80] }
                : { opacity: 0 }
            }
            transition={{ duration: 4, delay: 1, ease: "easeOut" }}
          >
            <Star color="blue" size={8} x="65%" y="45%" delay={0.6} pulse={false} />
          </motion.div>

          {/* Broken connection line */}
          <motion.div
            className="absolute top-1/2 left-[42%] w-[20%]"
            style={{ height: 1 }}
            initial={{ opacity: 0.3 }}
            animate={
              isInView
                ? {
                    opacity: [0.3, 0.1, 0],
                    scaleX: [1, 0.5, 0],
                  }
                : { opacity: 0 }
            }
            transition={{ duration: 3, delay: 1.5 }}
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "repeating-linear-gradient(90deg, rgba(167, 139, 250, 0.3) 0px, rgba(167, 139, 250, 0.3) 6px, transparent 6px, transparent 12px)",
              }}
            />
          </motion.div>
        </div>

        <FadeIn delay={0.3}>
          <span className="chapter-number block mb-4">The Silence</span>
        </FadeIn>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-white/40">
          <AnimatedText text="She Goes Quiet" delay={0.5} />
        </h2>

        <div className="cosmic-divider" style={{ opacity: 0.3 }} />

        <FadeIn delay={1.2} className="max-w-lg">
          <p className="font-light text-base md:text-lg leading-relaxed text-white/40">
            One star dimmed. The messages stopped.
            <br />
            The digital space felt a little colder.
          </p>
        </FadeIn>

        {/* Fading message indicators */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          {/* Unread messages */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              animate={{ opacity: [0.5, 0.2, 0.5] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-star-gold/30" />
              <div
                className="h-[1px] bg-white/10"
                style={{ width: `${100 - i * 20}px` }}
              />
            </motion.div>
          ))}

          <FadeIn delay={2.8}>
            <p className="text-xs text-white/20 mt-4 font-mono tracking-wider">
              seen · no reply
            </p>
          </FadeIn>
        </motion.div>

        {/* Ellipsis waiting animation */}
        <motion.div
          className="mt-8 flex gap-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : { opacity: 0 }}
          transition={{ delay: 3.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-white/30"
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1, 0.8] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </ChapterSection>
  );
}
