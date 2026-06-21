"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const chapters = [
  { id: "hero", label: "Prologue" },
  { id: "chapter-01", label: "December" },
  { id: "chapter-02", label: "Socials" },
  { id: "chapter-03", label: "Silence" },
  { id: "chapter-04", label: "Return" },
  { id: "chapter-05", label: "Avatar" },
  { id: "chapter-06", label: "Daily" },
  { id: "chapter-07", label: "Storm" },
  { id: "chapter-08", label: "Healing" },
  { id: "chapter-09", label: "Now" },
  { id: "chapter-10", label: "Birthday" },
];

export default function ChapterNav() {
  const [active, setActive] = useState("hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero
      setVisible(window.scrollY > window.innerHeight * 0.5);

      // Determine active chapter
      const sections = chapters
        .map((ch) => {
          const el = document.getElementById(ch.id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { id: ch.id, top: rect.top, bottom: rect.bottom };
        })
        .filter(Boolean);

      const viewportCenter = window.innerHeight / 2;
      for (const section of sections) {
        if (section && section.top <= viewportCenter && section.bottom >= viewportCenter) {
          setActive(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
    >
      {chapters.map((ch) => (
        <button
          key={ch.id}
          onClick={() => scrollTo(ch.id)}
          className="group flex items-center gap-2 cursor-pointer"
          aria-label={`Go to ${ch.label}`}
        >
          {/* Label on hover */}
          <span
            className={`text-[10px] font-mono tracking-wider transition-all duration-300 
              ${
                active === ch.id
                  ? "opacity-60 text-accent-violet"
                  : "opacity-0 group-hover:opacity-40 text-white"
              }`}
          >
            {ch.label}
          </span>

          {/* Dot */}
          <motion.div
            className={`rounded-full transition-all duration-300 ${
              active === ch.id
                ? "w-2.5 h-2.5 bg-accent-violet shadow-[0_0_8px_rgba(167,139,250,0.5)]"
                : "w-1.5 h-1.5 bg-white/20 group-hover:bg-white/40"
            }`}
            layout
          />
        </button>
      ))}
    </motion.nav>
  );
}
