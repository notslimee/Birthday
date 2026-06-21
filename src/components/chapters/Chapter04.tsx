"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ChapterSection from "../ChapterSection";
import Star from "../Star";
import { AnimatedText, FadeIn } from "../AnimatedText";

export default function Chapter04() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <ChapterSection
      id="chapter-04"
      chapterNumber={4}
      gradient="radial-gradient(ellipse at 50% 50%, rgba(26, 16, 61, 0.5) 0%, transparent 60%)"
    >
      <div ref={ref} className="relative w-full min-h-[50vh] flex flex-col items-center justify-center">
        {/* Stars reuniting */}
        <div className="relative w-full h-48 md:h-56 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Star color="gold" size={12} x="38%" y="50%" delay={0.3} />
          </motion.div>

          {/* Blue star returning with a dramatic entrance */}
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 200 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, x: 0 }
                : { opacity: 0, scale: 0, x: 200 }
            }
            transition={{
              duration: 2,
              delay: 1,
              type: "spring",
              stiffness: 60,
              damping: 15,
            }}
          >
            <Star color="blue" size={12} x="62%" y="50%" delay={1.5} />
          </motion.div>

          {/* Connection re-forming with sparkle */}
          <motion.div
            className="absolute top-1/2 left-[40%] right-[40%]"
            style={{ height: 2 }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={
              isInView
                ? { opacity: 0.6, scaleX: 1 }
                : { opacity: 0, scaleX: 0 }
            }
            transition={{ duration: 1.5, delay: 2.5 }}
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(251, 191, 36, 0.5), rgba(244, 114, 182, 0.5), rgba(96, 165, 250, 0.5))",
              }}
            />
          </motion.div>
        </div>

        {/* Burst of particles when she returns */}
        {isInView && (
          <motion.div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: "62%",
                  top: "35%",
                  background:
                    i % 2 === 0
                      ? "rgba(96, 165, 250, 0.8)"
                      : "rgba(167, 139, 250, 0.8)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i / 20) * Math.PI * 2) * (80 + ((i * 37) % 60)),
                  y: Math.sin((i / 20) * Math.PI * 2) * (80 + ((i * 53) % 60)),
                }}
                transition={{
                  duration: 2,
                  delay: 1.5 + (i % 5) * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}

        <FadeIn delay={0.3}>
          <span className="chapter-number block mb-4">The Return</span>
        </FadeIn>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-glow-blue">
          <AnimatedText text="She Comes Back" delay={0.5} />
        </h2>

        <div className="cosmic-divider" />

        <FadeIn delay={1.2} className="max-w-lg">
          <p className="font-light text-base md:text-lg leading-relaxed text-white/60">
            And just like that, the second star reignited.
            <br />
            Brighter than before. Closer than before.
          </p>
        </FadeIn>

        <FadeIn delay={2} className="mt-8">
          <motion.div
            className="bg-star-blue/10 border border-star-blue/25 rounded-2xl rounded-tl-sm px-5 py-3"
            animate={{
              borderColor: [
                "rgba(96, 165, 250, 0.25)",
                "rgba(96, 165, 250, 0.5)",
                "rgba(96, 165, 250, 0.25)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <p className="text-sm md:text-base text-star-blue/90 font-light">
              Hey, sorry I was gone... I&apos;m back! 💙
            </p>
          </motion.div>
        </FadeIn>
      </div>
    </ChapterSection>
  );
}
