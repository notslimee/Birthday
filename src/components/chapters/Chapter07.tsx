"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ChapterSection from "../ChapterSection";
import Star from "../Star";
import { AnimatedText, FadeIn } from "../AnimatedText";

export default function Chapter07() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <ChapterSection
      id="chapter-07"
      chapterNumber={7}
      gradient="radial-gradient(ellipse at 50% 50%, rgba(40, 5, 15, 0.4) 0%, transparent 60%)"
    >
      <div ref={ref} className="relative w-full min-h-[50vh] flex flex-col items-center justify-center">
        {/* Stars pushed apart, flickering */}
        <div className="relative w-full h-48 md:h-56 mb-8">
          {/* Gold star - agitated */}
          <motion.div
            animate={
              isInView
                ? {
                    x: [0, -5, 3, -2, 0],
                    y: [0, 3, -4, 2, 0],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Star color="gold" size={11} x="25%" y="50%" delay={0.3} />
          </motion.div>

          {/* Blue star - agitated */}
          <motion.div
            animate={
              isInView
                ? {
                    x: [0, 4, -3, 5, 0],
                    y: [0, -3, 4, -2, 0],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            <Star color="blue" size={11} x="75%" y="50%" delay={0.6} />
          </motion.div>

          {/* Fractured connection */}
          <motion.div
            className="absolute top-1/2 left-[28%] right-[28%] flex items-center justify-center"
            style={{ height: 4 }}
          >
            {/* Lightning/crack effect */}
            <svg
              className="w-full h-8 absolute"
              viewBox="0 0 200 20"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,10 L30,10 L35,3 L45,17 L55,5 L65,15 L75,8 L85,12 L95,6 L100,10 L110,10 L115,14 L125,4 L135,16 L145,7 L155,13 L165,9 L175,11 L200,10"
                fill="none"
                stroke="rgba(244, 114, 182, 0.4)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  isInView
                    ? {
                        pathLength: [0, 1],
                        opacity: [0, 0.6, 0.3],
                      }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{ duration: 2, delay: 1 }}
              />
            </svg>
          </motion.div>
        </div>

        <FadeIn delay={0.3}>
          <span className="chapter-number block mb-4" style={{ color: "rgba(244, 114, 182, 0.5)" }}>
            The Storm
          </span>
        </FadeIn>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-glow-rose">
          <AnimatedText text="An Argument" delay={0.5} />
        </h2>

        <div
          className="cosmic-divider"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(244, 114, 182, 0.5), transparent)",
          }}
        />

        <FadeIn delay={1.2} className="max-w-lg">
          <p className="font-light text-base md:text-lg leading-relaxed text-white/50">
            Even stars collide.
            <br />
            Words that burned hotter than the core.
          </p>
        </FadeIn>

        {/* Shattered text fragments */}
        <motion.div
          className="mt-10 relative w-64 h-24"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2 }}
        >
          {[
            { text: "why", x: "10%", y: "20%", rot: -15 },
            { text: "don't", x: "50%", y: "10%", rot: 8 },
            { text: "you", x: "30%", y: "60%", rot: -5 },
            { text: "understand", x: "55%", y: "55%", rot: 12 },
            { text: "...", x: "80%", y: "35%", rot: -3 },
          ].map((frag, i) => (
            <motion.span
              key={i}
              className="absolute text-xs md:text-sm font-light text-accent-rose/40"
              style={{
                left: frag.x,
                top: frag.y,
                rotate: frag.rot,
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                y: [0, -3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            >
              {frag.text}
            </motion.span>
          ))}
        </motion.div>

        <FadeIn delay={3} className="mt-4">
          <p className="font-serif italic text-sm text-white/30">
            But the connection didn&apos;t break.
          </p>
        </FadeIn>
      </div>
    </ChapterSection>
  );
}
