"use client";

import dynamic from "next/dynamic";
import { useScroll } from "framer-motion";
import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ScrollProgress from "@/components/ScrollProgress";
import ChapterNav from "@/components/ChapterNav";
import Chapter01 from "@/components/chapters/Chapter01";
import Chapter02 from "@/components/chapters/Chapter02";
import Chapter03 from "@/components/chapters/Chapter03";
import Chapter04 from "@/components/chapters/Chapter04";
import Chapter05 from "@/components/chapters/Chapter05";
import Chapter06 from "@/components/chapters/Chapter06";
import Chapter07 from "@/components/chapters/Chapter07";
import Chapter08 from "@/components/chapters/Chapter08";
import Chapter09 from "@/components/chapters/Chapter09";
import Chapter10 from "@/components/chapters/Chapter10";

// Dynamically import heavy background layers to avoid SSR issues with canvas/window
const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  { ssr: false }
);
const MusicPlayer = dynamic(
  () => import("@/components/MusicPlayer"),
  { ssr: false }
);
const DiscoverySystem = dynamic(
  () => import("@/components/DiscoverySystem"),
  { ssr: false }
);
const StarCursor = dynamic(
  () => import("@/components/StarCursor"),
  { ssr: false }
);

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <main className="relative" ref={containerRef}>
      {/* Fixed background layers */}
      <StarCursor />
      <ParticleBackground scrollYProgress={scrollYProgress} />

      {/* UI overlays */}
      <ScrollProgress />
      <ChapterNav />
      <MusicPlayer />
      <DiscoverySystem />

      {/* Story sections */}
      <HeroSection />

      <div className="relative">
        <Chapter01 />
        <Chapter02 />
        <Chapter03 />
        <Chapter04 />
        <Chapter05 />
        <Chapter06 />
        <Chapter07 />
        <Chapter08 />
        <Chapter09 />
        <Chapter10 />
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-16 text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] text-white/15 uppercase">
          Written in starlight · Made with ♡
        </p>
      </footer>
    </main>
  );
}
