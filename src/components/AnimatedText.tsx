"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  type?: "words" | "chars" | "lines";
  once?: boolean;
}

export function AnimatedText({
  text,
  className = "",
  delay = 0,
  stagger = 0.05,
  type = "words",
  once = false,
}: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.5, once });

  const items =
    type === "chars"
      ? text.split("")
      : type === "lines"
      ? text.split("\n")
      : text.split(" ");

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {items.map((item, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 30, filter: "blur(4px)" }
          }
          transition={{
            duration: 0.6,
            delay: delay + i * stagger,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {item}
          {type !== "chars" && "\u00A0"}
        </motion.span>
      ))}
    </span>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
  duration?: number;
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = false,
  duration = 0.8,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once });

  const directionMap = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
    none: {},
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        filter: "blur(4px)",
        ...directionMap[direction],
      }}
      animate={
        isInView
          ? { opacity: 1, y: 0, x: 0, filter: "blur(0px)" }
          : {
              opacity: 0,
              filter: "blur(4px)",
              ...directionMap[direction],
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

interface TypewriterProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function Typewriter({
  text,
  className = "",
  delay = 0,
  speed = 0.04,
}: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.5, once: false });

  return (
    <span ref={ref} className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.05,
            delay: delay + i * speed,
          }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block ml-0.5"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
}
