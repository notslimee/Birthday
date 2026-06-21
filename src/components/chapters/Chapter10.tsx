"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";
import { FadeIn } from "../AnimatedText";

export default function Chapter10() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { amount: 0.15, once: true });
  const isLetterInView = useInView(letterRef, { amount: 0.2, once: true });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Camera zoom inward as user scrolls into this chapter
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.95, 1, 1.02]);

  // Pre-generate floating hearts
  const floatingHearts = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      left: `${15 + (i / 8) * 70}%`,
      yEnd: -400 - ((i * 37) % 300),
      xDrift: (((i * 53) % 100) - 50),
      duration: 6 + ((i * 17) % 4),
      delay: i * 1.2,
    })), []);

  return (
    <section
      ref={sectionRef}
      id="chapter-10"
      className="relative w-full flex flex-col items-center justify-start"
      style={{
        minHeight: "120dvh",
        paddingTop: "8rem",
        paddingBottom: "6rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      {/* Chapter number indicator */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 chapter-number"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ color: "rgba(244, 114, 182, 0.5)" }}
      >
        chapter 10
      </motion.div>

      {/* === MAIN CONTENT with zoom === */}
      <motion.div
        ref={contentRef}
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center"
        style={{ scale }}
      >
        {/* Invisible anchor for the canvas to draw the binary stars at the exact correct scrolling position */}
        <div id="binary-star-anchor" className="w-full h-32 md:h-40" />

        {/* === TYPOGRAPHY — fades in progressively === */}
        <FadeIn delay={0.5}>
          <span
            className="chapter-number block mb-2"
            style={{ color: "rgba(244, 114, 182, 0.6)" }}
          >
            For You
          </span>
        </FadeIn>

        <FadeIn delay={1}>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-2 gradient-text">
            Happy Birthday
          </h2>
        </FadeIn>

        <FadeIn delay={1.5}>
          <motion.div
            className="text-4xl md:text-5xl mt-2 mb-8"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🎂
          </motion.div>
        </FadeIn>

        {/* === BIRTHDAY LETTER CARD === */}
        <div ref={letterRef}>
          <FadeIn delay={2} className="w-full max-w-2xl">
            <motion.div
              className="birthday-card p-8 md:p-12 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={
                isLetterInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 30 }
              }
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <div className="text-left space-y-5">
                <motion.p
                  className="font-serif text-lg md:text-xl text-white/80 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={isLetterInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  To the star that lights up my universe,
                </motion.p>

                <motion.p
                  className="font-light text-sm md:text-base text-white/55 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={isLetterInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  From that first &ldquo;hey&rdquo; in December, to the late-night
                  conversations, the silences and the returns, the movie nights and
                  the arguments — every single moment led to this. To us. To now.
                </motion.p>

                <motion.p
                  className="font-light text-sm md:text-base text-white/55 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={isLetterInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  You came into my life like a quiet notification, and before I knew
                  it, you became the part of my day I look forward to the most. Even
                  the hard parts — the distance, the misunderstandings — they only
                  proved that what we have is real.
                </motion.p>

                <motion.p
                  className="font-light text-sm md:text-base text-white/55 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={isLetterInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 2 }}
                >
                  On your birthday, I want you to know:
                  <br />
                  You deserve the world, and I&apos;ll spend every day trying to give
                  you at least a small piece of it. You make everything brighter just
                  by being you.
                </motion.p>

                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0 }}
                  animate={isLetterInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 2.4 }}
                >
                  <p className="font-serif text-lg md:text-xl text-accent-rose/80 mb-2">
                    Happy Birthday, beautiful. ✨
                  </p>
                  <p className="font-light text-sm text-white/40">
                    — From the other star in your sky
                  </p>
                </motion.div>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-accent-violet/20 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-6 h-6 border-r border-t border-accent-violet/20 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-accent-violet/20 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-accent-violet/20 rounded-br-lg" />
            </motion.div>
          </FadeIn>
        </div>

        {/* Final sparkle burst */}
        <motion.div
          className="mt-12 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={isLetterInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 3 }}
        >
          {["✦", "♡", "✦"].map((symbol, i) => (
            <motion.span
              key={i}
              className="text-accent-violet/50 text-sm"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {symbol}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* === FLOATING HEARTS === */}
      {isInView &&
        floatingHearts.map((h, i) => (
          <motion.div
            key={i}
            className="absolute text-accent-rose/20 text-lg z-10"
            style={{
              left: h.left,
              bottom: "5%",
            }}
            animate={{
              y: [0, h.yEnd],
              opacity: [0, 0.4, 0],
              x: [0, h.xDrift],
            }}
            transition={{
              duration: h.duration,
              repeat: Infinity,
              delay: h.delay,
              ease: "easeOut",
            }}
          >
            ♡
          </motion.div>
        ))}
    </section>
  );
}
