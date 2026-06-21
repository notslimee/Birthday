"use client";

import { useEffect, useRef, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function StarCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const smoothMouseRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef<TrailPoint[]>([]);
  const animFrameRef = useRef(0);
  const [isTouch, setIsTouch] = useState(false);
  const hoverScaleRef = useRef(1);
  const targetScaleRef = useRef(1);

  useEffect(() => {
    // Detect touch device — hide custom cursor on touch
    const checkTouch = () => {
      setIsTouch(true);
    };
    window.addEventListener("touchstart", checkTouch, { once: true, passive: true });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Spawn trail particles
      if (Math.random() > 0.4) {
        trailRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          life: 0,
          maxLife: 18 + Math.random() * 14,
          size: 1 + Math.random() * 2,
        });
      }
    };

    // Detect hover over interactive DOM elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [data-interactive]")) {
        document.body.classList.add("dom-hovering");
      }
    };
    const handleMouseOut = () => {
      document.body.classList.remove("dom-hovering");
    };

    handleResize();

    const drawStar = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      outerR: number,
      innerR: number,
      points: number,
      rotation: number
    ) => {
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / points) * i - Math.PI / 2 + rotation;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    let time = 0;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth interpolation toward the real mouse position
      const lerp = 0.18;
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * lerp;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * lerp;

      const mx = smoothMouseRef.current.x;
      const my = smoothMouseRef.current.y;

      // Update target scale based on hover classes
      const isHovering = document.body.classList.contains("canvas-hovering") || document.body.classList.contains("dom-hovering");
      targetScaleRef.current = isHovering ? 1.5 : 1;

      // Smooth scale
      hoverScaleRef.current += (targetScaleRef.current - hoverScaleRef.current) * 0.12;
      const scale = hoverScaleRef.current;

      // --- Draw trail particles ---
      const trail = trailRef.current;
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.life++;
        if (p.life >= p.maxLife) {
          trail.splice(i, 1);
          continue;
        }
        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * 0.35;
        const size = p.size * (1 - progress * 0.6);

        // Aurora-colored trail: cycle hue
        const hue = (time * 30 + i * 15) % 360;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 75%, ${alpha})`;
        ctx.fill();
      }

      // Don't draw cursor itself if mouse is off-screen
      if (mx < -50 || my < -50) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // --- Outer glow ---
      const glowRadius = 20 * scale;
      const glowGradient = ctx.createRadialGradient(mx, my, 0, mx, my, glowRadius);
      // Aurora-colored glow that slowly shifts
      const hue1 = (time * 20) % 360;
      const hue2 = (hue1 + 60) % 360;
      glowGradient.addColorStop(0, `hsla(${hue1}, 60%, 75%, 0.15)`);
      glowGradient.addColorStop(0.5, `hsla(${hue2}, 50%, 70%, 0.06)`);
      glowGradient.addColorStop(1, `hsla(${hue1}, 40%, 60%, 0)`);
      ctx.beginPath();
      ctx.arc(mx, my, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // --- Star shape ---
      const outerR = 7 * scale;
      const innerR = 3 * scale;
      const rotation = time * 0.3; // Slow rotation

      // Soft star glow
      ctx.save();
      ctx.shadowBlur = 12 * scale;
      ctx.shadowColor = `hsla(${hue1}, 60%, 80%, 0.5)`;
      drawStar(ctx, mx, my, outerR, innerR, 4, rotation);
      ctx.fillStyle = `hsla(0, 0%, 100%, 0.85)`;
      ctx.fill();
      ctx.restore();

      // Tiny inner highlight
      ctx.beginPath();
      ctx.arc(mx, my, 1.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    animFrameRef.current = requestAnimationFrame(animate);

    // Hide the default cursor globally
    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("touchstart", checkTouch);
      cancelAnimationFrame(animFrameRef.current);
      document.documentElement.style.cursor = "";
    };
  }, []);

  // Don't render on touch devices
  if (isTouch) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    />
  );
}
