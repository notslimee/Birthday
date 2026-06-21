"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ChapterSection from "../ChapterSection";
import Star from "../Star";
import { AnimatedText, FadeIn } from "../AnimatedText";
import ConnectionLine from "../ConnectionLine";

export default function Chapter06() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <ChapterSection
      id="chapter-06"
      chapterNumber={6}
      gradient="radial-gradient(ellipse at 50% 50%, rgba(26, 16, 61, 0.5) 0%, transparent 55%)"
    >
      <div ref={ref} className="relative w-full min-h-[50vh] flex flex-col items-center justify-center">
        {/* Stars orbiting each other */}
        <div className="relative w-full h-48 md:h-56 mb-8 flex items-center justify-center">
          {/* Orbital path hint */}
          <motion.div
            className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border border-accent-violet/10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 2 }}
          />

          {/* Gold star orbiting */}
          <motion.div
            className="absolute"
            style={{ left: "50%", top: "50%", marginLeft: -6, marginTop: -6 }}
            animate={
              isInView
                ? {
                    x: [0, 60, 0, -60, 0],
                    y: [-40, 0, 40, 0, -40],
                  }
                : {}
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Star color="gold" size={12} x="0" y="0" delay={0.3} />
          </motion.div>

          {/* Blue star orbiting (opposite) */}
          <motion.div
            className="absolute"
            style={{ left: "50%", top: "50%", marginLeft: -6, marginTop: -6 }}
            animate={
              isInView
                ? {
                    x: [0, -60, 0, 60, 0],
                    y: [40, 0, -40, 0, 40],
                  }
                : {}
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Star color="blue" size={12} x="0" y="0" delay={0.6} />
          </motion.div>
        </div>

        <FadeIn delay={0.3}>
          <span className="chapter-number block mb-4">Every Day</span>
        </FadeIn>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-glow-gold">
          <AnimatedText text="Daily Conversations" delay={0.5} />
        </h2>

        <ConnectionLine visible={isInView} glow color="rgba(244, 114, 182, 0.5)" />

        <FadeIn delay={1.2} className="max-w-lg mt-6">
          <p className="font-light text-base md:text-lg leading-relaxed text-white/60">
            Good mornings. Late nights. Inside jokes.
            <br />
            Two orbits that became inseparable.
          </p>
        </FadeIn>

        {/* Message timeline */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2 }}
        >
          {[
            { time: "8:02 AM", text: "Good morning ☀️", align: "right", color: "star-gold" },
            { time: "8:05 AM", text: "Good morning! 🌸", align: "left", color: "star-blue" },
            { time: "2:30 PM", text: "Look at this 😂", align: "right", color: "star-gold" },
            { time: "2:31 PM", text: "LMAOOO 💀", align: "left", color: "star-blue" },
            { time: "11:47 PM", text: "Goodnight 🌙", align: "right", color: "star-gold" },
            { time: "11:48 PM", text: "Sweet dreams ✨", align: "left", color: "star-blue" },
          ].map((msg, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-3 ${
                msg.align === "right" ? "flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, x: msg.align === "right" ? 20 : -20 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: msg.align === "right" ? 20 : -20 }
              }
              transition={{ delay: 2.2 + i * 0.3, duration: 0.5 }}
            >
              <span className="text-[10px] text-white/20 font-mono w-16 text-center">
                {msg.time}
              </span>
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-light border ${
                  msg.color === "star-gold"
                    ? "bg-star-gold/8 border-star-gold/15 text-star-gold/80"
                    : "bg-star-blue/8 border-star-blue/15 text-star-blue/80"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ChapterSection>
  );
}
