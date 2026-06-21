"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DiscoveryEvent {
  type: string;
  content: string;
  x: number;
  y: number;
}

interface ActiveCard extends DiscoveryEvent {
  id: string;
  timestamp: number;
}

export default function DiscoverySystem() {
  const [activeCards, setActiveCards] = useState<ActiveCard[]>([]);
  const [totalFound, setTotalFound] = useState(0);

  const dismissCard = useCallback((id: string) => {
    setActiveCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  useEffect(() => {
    // Load count from local storage
    try {
      const saved = localStorage.getItem("forher-discovery-count");
      if (saved) setTotalFound(parseInt(saved, 10) || 0);
    } catch { /* ignore */ }

    const handleReveal = (e: Event) => {
      const customEvent = e as CustomEvent<DiscoveryEvent>;
      const { type, content, x, y } = customEvent.detail;
      
      if (!content) return;

      // Increment discovery counter
      setTotalFound((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem("forher-discovery-count", String(next));
          
          // Secret unlock milestone
          if (next === 5) {
            const hasSecret = localStorage.getItem("forher-secret-unlocked") === "true";
            if (!hasSecret) {
              localStorage.setItem("forher-secret-unlocked", "true");
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent("star-reveal", {
                  detail: { 
                    type: "secret", 
                    content: "To the brightest star in my universe... Happy Birthday. I promise to keep discovering new things to love about you every single day.", 
                    x: window.innerWidth / 2, 
                    y: window.innerHeight / 2 
                  }
                }));
              }, 2500);
            }
          }
        } catch { /* ignore */ }
        return next;
      });

      // Create card with unique ID
      const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      const card: ActiveCard = { type, content, x, y, id, timestamp: Date.now() };
      
      setActiveCards((prev) => {
        // Keep max 2 cards visible at once to avoid clutter
        const next = prev.length >= 2 ? prev.slice(1) : [...prev];
        return [...next, card];
      });

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setActiveCards((prev) => prev.filter((c) => c.id !== id));
      }, 5000);
    };

    window.addEventListener("star-reveal", handleReveal);
    return () => window.removeEventListener("star-reveal", handleReveal);
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case "like": return "♡";
      case "birthday": return "🎂";
      case "memory": return "✨";
      case "quote": return "✦";
      case "secret": return "👑";
      default: return "✧";
    }
  };

  const getLabel = (type: string) => {
    switch(type) {
      case "like": return "For You";
      case "birthday": return "Birthday Message";
      case "memory": return "A Memory";
      case "quote": return "A Thought";
      case "secret": return "Secret Discovered";
      default: return "Discovery";
    }
  };

  return (
    <>
      {/* Floating discovery counter */}
      {totalFound > 0 && (
        <motion.div 
          className="fixed top-6 right-6 z-50 pointer-events-none select-none"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/25 uppercase">
            {totalFound} {totalFound === 1 ? 'star' : 'stars'} found
          </span>
        </motion.div>
      )}

      {/* Floating Cards */}
      <AnimatePresence mode="popLayout">
        {activeCards.map((card) => {
          // Position card near the click but keep it inside the viewport
          const cardWidth = 320;
          const cardHeight = 140;
          const padding = 24;
          
          let left = card.x - cardWidth / 2;
          let top = card.y - cardHeight - 30; // Above the click point

          // Clamp to viewport
          if (left < padding) left = padding;
          if (left > window.innerWidth - cardWidth - padding) left = window.innerWidth - cardWidth - padding;
          if (top < padding) top = card.y + 30; // Flip below if too high
          if (top > window.innerHeight - cardHeight - padding) top = window.innerHeight - cardHeight - padding;

          return (
            <motion.div
              key={card.id}
              className="fixed z-50 pointer-events-auto cursor-pointer select-none"
              style={{ left, top }}
              onClick={() => dismissCard(card.id)}
              initial={{ opacity: 0, scale: 0.85, y: 15, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, y: -8, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 200, damping: 22, mass: 0.8 }}
            >
              {/* Card glow background */}
              <div 
                className="absolute -inset-3 rounded-3xl opacity-30 blur-xl pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(167, 139, 250, 0.15), rgba(244, 114, 182, 0.08), transparent 70%)"
                }}
              />
              
              {/* Card body */}
              <div 
                className={`relative px-7 py-5 rounded-2xl border shadow-2xl ${card.type === 'secret' ? 'border-amber-500/20' : 'border-white/[0.06]'}`}
                style={{
                  background: card.type === 'secret' 
                    ? "linear-gradient(145deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05), rgba(20, 10, 20, 0.85))"
                    : "linear-gradient(145deg, rgba(167, 139, 250, 0.06), rgba(244, 114, 182, 0.04), rgba(20, 10, 40, 0.7))",
                  backdropFilter: "blur(24px) saturate(1.2)",
                  WebkitBackdropFilter: "blur(24px) saturate(1.2)",
                  maxWidth: `${cardWidth}px`,
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-base opacity-70">{getIcon(card.type)}</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/30">
                    {getLabel(card.type)}
                  </span>
                </div>
                
                {/* Message */}
                <p className="font-serif text-white/85 text-sm leading-relaxed tracking-wide">
                  {card.content}
                </p>

                {/* Subtle close hint */}
                <div className="mt-3 text-[8px] font-mono tracking-[0.2em] text-white/15 uppercase text-right">
                  tap to close
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
}
