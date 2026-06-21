"use client";

import { motion } from "framer-motion";
import Star from "./Star";
import { AnimatedText, FadeIn } from "./AnimatedText";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="chapter-section relative"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(26, 16, 61, 0.4) 0%, transparent 70%)",
      }}
    >
      {/* Two distant stars */}
      <div className="absolute inset-0 pointer-events-none">
        <Star color="gold" size={8} x="25%" y="30%" delay={1} />
        <Star color="blue" size={8} x="75%" y="65%" delay={1.5} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Small pre-title */}
        <FadeIn delay={0.5}>
          <span className="font-mono text-[10px] md:text-xs tracking-[0.5em] text-accent-violet/50 uppercase mb-6 block">
            A story written in starlight
          </span>
        </FadeIn>

        {/* Main title */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl font-light mb-4">
          <AnimatedText text="Two Stars" delay={0.8} stagger={0.15} />
        </h1>

        <FadeIn delay={1.8}>
          <div className="cosmic-divider" />
        </FadeIn>

        <FadeIn delay={2.2}>
          <p className="font-light text-base md:text-lg text-white/40 max-w-md leading-relaxed mt-4">
            In the infinite digital sky, two lights found each other.
            <br />
            This is the story of how they became a constellation.
          </p>
        </FadeIn>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">
            Scroll to begin
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-accent-violet/30"
            >
              <path
                d="M12 5 L12 19 M7 14 L12 19 L17 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--color-cosmic-dark), transparent)",
        }}
      />
    </section>
  );
}
