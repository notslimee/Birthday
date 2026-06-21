"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ChapterSection from "../ChapterSection";
import Star from "../Star";
import { AnimatedText, FadeIn } from "../AnimatedText";

export default function Chapter02() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <ChapterSection
      id="chapter-02"
      chapterNumber={2}
      gradient="radial-gradient(ellipse at 30% 60%, rgba(26, 16, 61, 0.4) 0%, transparent 60%)"
    >
      <div ref={ref} className="relative w-full min-h-[50vh] flex flex-col items-center justify-center">
        {/* Stars slightly closer */}
        <div className="relative w-full h-40 md:h-48 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Star color="gold" size={11} x="30%" y="50%" delay={0.3} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Star color="blue" size={11} x="70%" y="50%" delay={0.6} />
          </motion.div>

          {/* Connection growing */}
          <motion.div
            className="absolute top-1/2 left-[33%] right-[33%]"
            style={{ height: 1 }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={
              isInView
                ? { opacity: 0.3, scaleX: 1 }
                : { opacity: 0, scaleX: 0 }
            }
            transition={{ duration: 1.5, delay: 1 }}
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(251, 191, 36, 0.4), rgba(167, 139, 250, 0.3), rgba(96, 165, 250, 0.4))",
              }}
            />
          </motion.div>
        </div>

        <FadeIn delay={0.3}>
          <span className="chapter-number block mb-4">Taking a Step</span>
        </FadeIn>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-glow-rose">
          <AnimatedText text="Asking for Socials" delay={0.5} />
        </h2>

        <div className="cosmic-divider" />

        <FadeIn delay={1.2} className="max-w-lg">
          <p className="font-light text-base md:text-lg leading-relaxed text-white/60">
            The conversation grew beyond the platform.
            <br />
            A leap of faith — reaching across the digital void.
          </p>
        </FadeIn>

        {/* Social icons floating animation */}
        <motion.div
          className="mt-10 flex items-center gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          {["@", "#", "💬"].map((icon, i) => (
            <motion.div
              key={i}
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-accent-violet/20 bg-accent-violet/5 
                         flex items-center justify-center text-xl md:text-2xl"
              animate={{
                y: [0, -8, 0],
                borderColor: [
                  "rgba(167, 139, 250, 0.2)",
                  "rgba(167, 139, 250, 0.5)",
                  "rgba(167, 139, 250, 0.2)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            >
              <span className="text-accent-violet/60">{icon}</span>
            </motion.div>
          ))}
        </motion.div>

        <FadeIn delay={2.3} className="mt-8">
          <p className="font-serif italic text-lg md:text-xl text-accent-rose/70">
            &ldquo;Can I get your socials?&rdquo;
          </p>
        </FadeIn>

        {/* Check mark appearing */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0 }
          }
          transition={{
            delay: 3,
            duration: 0.6,
            type: "spring",
            stiffness: 200,
          }}
        >
          <span className="text-3xl">✓</span>
        </motion.div>
      </div>
    </ChapterSection>
  );
}
