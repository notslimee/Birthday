"use client";

import { useEffect, useRef, useCallback } from "react";
import { MotionValue } from "framer-motion";
import { musicState } from "@/lib/musicState";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  baseColor: string;
  depth: number;
  interactive: boolean; // Keep for ripple effects but won't trigger click events
  revealed: boolean;
  revealType?: "like" | "quote" | "memory";
  revealContent?: string;
  pulseAmount: number;
}

interface SpecialStar {
  x: number;
  y: number;
  baseSize: number;
  pulseAmount: number;
  twinkleOffset: number;
  opacity: number;
  state: 'fading-in' | 'active' | 'fading-out';
  life: number;
  maxLife: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Nebula {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  color: string;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  depth: number;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  color: string;
  depth: number;
  shadowAngle: number;
  interactive?: boolean;
  rotationAngle: number;
  message?: string;
  rings?: boolean;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface TrailParticle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

interface SceneNode {
  x: number; // Local space -1 to 1
  y: number; // Local space -1 to 1
  size: number;
  color: string;
}

interface SceneEdge {
  from: number;
  to: number;
  isFractured?: boolean;
  isRepaired?: boolean;
}

interface ChapterScene {
  chapterIndex: number;
  originX: number; // Viewport ratio
  originY: number;
  scale: number;
  nodes: SceneNode[];
  edges: SceneEdge[];
}

const PARTICLE_COLORS = [
  "167, 139, 250", // violet
  "129, 140, 248", // indigo
  "244, 114, 182", // rose
  "251, 191, 36",  // gold
  "96, 165, 250",  // blue
  "232, 224, 240", // white
];

const NEBULA_COLORS = [
  { r: 100, g: 60, b: 180 },  
  { r: 60, g: 80, b: 160 },   
  { r: 120, g: 50, b: 100 },  
  { r: 40, g: 70, b: 130 },   
];

const SWEET_MESSAGES = [
  // Appreciation
  "You make ordinary days feel special.",
  "Thank you for being you.",
  "You make the world more beautiful just by existing.",
  "I notice every little thing you do, and I love it all.",
  "You're the kind of person the world needs more of.",
  "The way you care about things inspires me.",
  "You make people feel safe just by being near.",
  "Your energy is contagious in the best way.",
  "I admire how you handle everything with grace.",
  "You turn simple moments into memories.",
  // Affection
  "Talking to you is my favorite part of the day.",
  "I still smile when I see your messages.",
  "Some of my happiest moments started with a notification from you.",
  "You are one of the best things that happened to me this year.",
  "I never expected us, but I'm grateful for us.",
  "You make distance feel smaller.",
  "Every conversation with you feels like coming home.",
  "I feel lighter when I talk to you.",
  "You understand me in ways no one else does.",
  "My favorite hello is the one I say to you.",
  // Gratitude
  "Thank you for coming back.",
  "Thank you for not giving up on us.",
  "Thank you for every late-night conversation.",
  "Thank you for seeing me when I felt invisible.",
  "Thank you for your patience with me.",
  "Thank you for making me laugh when I needed it most.",
  "Thank you for choosing to stay.",
  "I'm grateful for every moment we've shared.",
  "You showed me what genuine kindness looks like.",
  "Thank you for believing in me even when I didn't.",
  // Birthday wishes
  "Happy birthday to my favorite person in the universe.",
  "Today the stars celebrate you.",
  "The universe made something wonderful the day you were born.",
  "Another year of you being amazing.",
  "May this year bring you everything you deserve.",
  "I hope today feels as special as you make me feel.",
  "Wishing you endless joy on your special day.",
  "Here's to another year of beautiful moments.",
  "The world is better because you were born.",
  "Cheers to the most extraordinary person I know.",
  // Memories
  "Remember when we talked until sunrise?",
  "I still think about the first time we really talked.",
  "That one message you sent still makes me smile.",
  "Some memories with you feel like a dream I never want to wake from.",
  "I replay our conversations in my head sometimes.",
  "Every moment with you becomes a favorite memory.",
  "We've built something beautiful without even trying.",
  "The little inside jokes we share mean the world to me.",
  "I treasure every shared silence between us.",
  "Our story is my favorite one to tell.",
  // Future hopes
  "I can't wait to see what we become.",
  "There are so many adventures waiting for us.",
  "One day, I'll make all of this up to you.",
  "I hope we never run out of things to talk about.",
  "The best chapters of our story haven't been written yet.",
  "I want to be part of your happiest memories.",
  "Wherever life takes us, I hope we're still in each other's story.",
  "There's so much more I want to share with you.",
  "I look forward to growing alongside you.",
  "We have a whole universe of moments ahead of us.",
  // Cute and playful
  "If you were a star, you'd be the brightest one.",
  "You're basically my favorite notification.",
  "I'd pick you in every universe.",
  "You're the plot twist I didn't see coming.",
  "My phone lights up differently when it's you.",
  "You're the reason I check my phone with a smile.",
  "If hearts could text, mine would only message you.",
  "You're the good kind of distraction.",
  "I'd choose talking to you over sleeping every time.",
  "You're my favorite what-if that became real.",
  // Encouragement
  "You are stronger than you think.",
  "It's okay to rest. You've done enough.",
  "I believe in you even on the days you don't.",
  "Your feelings are valid. Always.",
  "You don't have to be perfect to be wonderful.",
  "Take it one day at a time. You're doing great.",
  "The world is lucky to have your heart.",
  "Never forget how far you've come.",
  "You deserve every good thing heading your way.",
  "Even on hard days, you still shine.",
];

let lastMessageIndex = -1;
function getRandomMessage(): string {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * SWEET_MESSAGES.length);
  } while (idx === lastMessageIndex && SWEET_MESSAGES.length > 1);
  lastMessageIndex = idx;
  return SWEET_MESSAGES[idx];
}

// Generate Storybook Constellation Scenes
function createStorybookScenes(): ChapterScene[] {
  const scenes: ChapterScene[] = [];
  const C = PARTICLE_COLORS;
  const rc = () => C[Math.floor(Math.random() * C.length)];

  // Helper to create a node
  const n = (x: number, y: number, size = 2): SceneNode => ({ x, y, size, color: rc() });
  // Helper to create an edge
  const e = (from: number, to: number, isFractured = false, isRepaired = false): SceneEdge => ({ from, to, isFractured, isRepaired });

  // Ch 1 (Index 0): Two isolated stars discovering each other
  scenes.push({
    chapterIndex: 0,
    originX: 0.2, originY: 0.4, scale: 100,
    nodes: [n(-0.5, -0.2, 2.5), n(0.5, 0.2, 2.5)],
    edges: [] // No lines yet
  });

  // Ch 2 (Index 1): A bridge-like constellation
  scenes.push({
    chapterIndex: 1,
    originX: 0.8, originY: 0.5, scale: 90,
    nodes: [n(-0.6, -0.4), n(0, 0, 3), n(0.6, 0.4)],
    edges: [e(0, 1), e(1, 2)]
  });

  // Ch 3 (Index 2): Partially breaks apart
  scenes.push({
    chapterIndex: 2,
    originX: 0.25, originY: 0.3, scale: 110,
    nodes: [n(0, -0.5, 3), n(-0.4, 0.2), n(0.4, 0.2), n(0, 0.8)],
    edges: [e(0, 1), e(0, 2), e(1, 3, true), e(2, 3)] // Edge to 3 is fractured
  });

  // Ch 4 (Index 3): The missing section returns
  scenes.push({
    chapterIndex: 3,
    originX: 0.75, originY: 0.6, scale: 110,
    nodes: [n(0, -0.5, 3), n(-0.4, 0.2), n(0.4, 0.2), n(0, 0.8)],
    edges: [e(0, 1), e(0, 2), e(1, 3, false, true), e(2, 3)] // Edge repaired
  });

  // Ch 5 (Index 4): Movie night (overlapping circles/eyes)
  scenes.push({
    chapterIndex: 4,
    originX: 0.2, originY: 0.65, scale: 120,
    nodes: [n(-0.4, 0), n(0, -0.3), n(0, 0.3), n(0.4, 0), n(0, 0, 3)],
    edges: [e(0, 1), e(0, 2), e(1, 3), e(2, 3), e(0, 4), e(3, 4)]
  });

  // Ch 6 (Index 5): Many new connections (web/star)
  scenes.push({
    chapterIndex: 5,
    originX: 0.8, originY: 0.3, scale: 100,
    nodes: [n(0, 0, 3.5), n(0, -0.8), n(0.7, -0.3), n(0.5, 0.6), n(-0.5, 0.6), n(-0.7, -0.3)],
    edges: [e(0, 1), e(0, 2), e(0, 3), e(0, 4), e(0, 5), e(1, 2), e(3, 4), e(4, 5)]
  });

  // Ch 7 (Index 6): Visible fractures between clusters
  scenes.push({
    chapterIndex: 6,
    originX: 0.3, originY: 0.45, scale: 130,
    nodes: [n(-0.6, -0.3), n(-0.4, -0.6), n(-0.2, -0.2), /* gap */ n(0.2, 0.2), n(0.4, 0.6), n(0.6, 0.3)],
    edges: [e(0, 1), e(1, 2), e(0, 2), e(3, 4), e(4, 5), e(3, 5), e(2, 3, true)] // Central bridge is fractured
  });

  // Ch 8 (Index 7): Fractures heal
  scenes.push({
    chapterIndex: 7,
    originX: 0.7, originY: 0.5, scale: 130,
    nodes: [n(-0.6, -0.3), n(-0.4, -0.6), n(-0.2, -0.2), n(0.2, 0.2), n(0.4, 0.6), n(0.6, 0.3)],
    edges: [e(0, 1), e(1, 2), e(0, 2), e(3, 4), e(4, 5), e(3, 5), e(2, 3, false, true)] // Repaired golden bridge
  });

  // Ch 9 (Index 8): The most complete beautiful constellation (Mandala)
  scenes.push({
    chapterIndex: 8,
    originX: 0.5, originY: 0.4, scale: 160,
    nodes: [
      n(0, 0, 4), 
      n(0, -0.5), n(0.4, -0.4), n(0.5, 0), n(0.4, 0.4), 
      n(0, 0.5), n(-0.4, 0.4), n(-0.5, 0), n(-0.4, -0.4)
    ],
    edges: [
      e(0, 1), e(0, 2), e(0, 3), e(0, 4), e(0, 5), e(0, 6), e(0, 7), e(0, 8),
      e(1, 2), e(2, 3), e(3, 4), e(4, 5), e(5, 6), e(6, 7), e(7, 8), e(8, 1)
    ]
  });

  return scenes;
}

const storybookScenes = createStorybookScenes();

interface ParticleBackgroundProps {
  scrollYProgress?: MotionValue<number>;
}

export default function ParticleBackground({ scrollYProgress }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const planetsRef = useRef<Planet[]>([]);
  const burstParticlesRef = useRef<BurstParticle[]>([]);
  const trailParticlesRef = useRef<TrailParticle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  
  // Special Star Spawner
  const specialStarRef = useRef<SpecialStar | null>(null);
  const specialStarTimerRef = useRef<number>(0);
  const nextSpecialStarDelayRef = useRef<number>(6000);
  
  // Pre-loaded audio elements for interaction sounds
  const starAudioPoolRef = useRef<HTMLAudioElement[]>([]);
  const planetAudioPoolRef = useRef<HTMLAudioElement[]>([]);
  const poolIndexRef = useRef({ star: 0, planet: 0 });

  // Initialize audio pools (multiple instances for overlapping playback)
  useEffect(() => {
    const POOL_SIZE = 4;
    const starPool: HTMLAudioElement[] = [];
    const planetPool: HTMLAudioElement[] = [];
    const basePath = process.env.NODE_ENV === 'production' ? '/Birthday' : '';
    for (let i = 0; i < POOL_SIZE; i++) {
      const s = new Audio(`${basePath}/STAR.mp3`);
      s.volume = 0.12;
      s.preload = "auto";
      starPool.push(s);
      const p = new Audio(`${basePath}/PLANET.mp3`);
      p.volume = 0.10;
      p.preload = "auto";
      planetPool.push(p);
    }
    starAudioPoolRef.current = starPool;
    planetAudioPoolRef.current = planetPool;
    return () => {
      starPool.forEach(a => { a.pause(); a.src = ""; });
      planetPool.forEach(a => { a.pause(); a.src = ""; });
    };
  }, []);

  const playSfx = useCallback((type: 'star' | 'planet') => {
    try {
      const pool = type === 'star' ? starAudioPoolRef.current : planetAudioPoolRef.current;
      if (pool.length === 0) return;
      const idx = poolIndexRef.current[type] % pool.length;
      poolIndexRef.current[type]++;
      const audio = pool[idx];
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {
      // Ignore audio errors silently
    }
  }, []);

  const createParticles = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor((width * height) / 6000), 250);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: (Math.random() * 1.8 + 0.3) * (0.3 + depth * 0.7),
        speedX: (Math.random() - 0.5) * 0.2 * (0.3 + depth * 0.7),
        speedY: (Math.random() - 0.5) * 0.2 * (0.3 + depth * 0.7),
        opacity: (Math.random() * 0.4 + 0.1) * (0.4 + depth * 0.6),
        twinkleSpeed: Math.random() * 0.015 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
        baseColor: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        depth,
        interactive: false, // Normal stars are decorative
        revealed: false,
        revealType: undefined,
        revealContent: undefined,
        pulseAmount: 0,
      });
    }
    return particles;
  }, []);

  const createNebulae = useCallback((width: number, height: number) => {
    const nebulae: Nebula[] = [];
    for (let i = 0; i < 4; i++) {
      const nc = NEBULA_COLORS[i % NEBULA_COLORS.length];
      nebulae.push({
        x: Math.random() * width,
        y: Math.random() * height * 1.5,
        radiusX: 300 + Math.random() * 400,
        radiusY: 200 + Math.random() * 300,
        color: `rgba(${nc.r}, ${nc.g}, ${nc.b}, `,
        opacity: 0.015 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0002,
        depth: 0.1 + Math.random() * 0.2,
      });
    }
    return nebulae;
  }, []);

  const createPlanets = useCallback((width: number, height: number) => {
    return [
      {
        x: width * 0.8,
        y: height * 0.3,
        radius: 40,
        color: "40, 30, 80",
        depth: 0.05,
        shadowAngle: Math.PI * 1.2,
        interactive: true,
        rotationAngle: 0,
        message: "I remember the first time I saw you...",
        rings: true,
      },
      {
        x: width * 0.2,
        y: height * 1.2,
        radius: 80,
        color: "30, 40, 90",
        depth: 0.08,
        shadowAngle: Math.PI * 1.8,
        interactive: true,
        rotationAngle: 0,
        message: "Every moment with you is an adventure.",
        rings: false,
      },
      {
        x: width * 0.7,
        y: height * 2.5,
        radius: 25,
        color: "80, 40, 60",
        depth: 0.15,
        shadowAngle: Math.PI * 0.8,
        interactive: true,
        rotationAngle: 0,
        message: "You are my favorite discovery.",
        rings: true,
      }
    ];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const heightMultiplier = 3; // Virtual height for parallax scrolling

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = createParticles(canvas.width, canvas.height * heightMultiplier);
      nebulaeRef.current = createNebulae(canvas.width, canvas.height * heightMultiplier);
      planetsRef.current = createPlanets(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Add trail particle
      if (Math.random() > 0.5) {
        trailParticlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          life: 0,
          maxLife: 20 + Math.random() * 20
        });
      }

      // Check for hover state over canvas objects
      const progress = scrollYProgress ? scrollYProgress.get() : 0;
      const virtualScroll = progress * canvas.height * heightMultiplier;
      let isHovering = false;

      for (const p of planetsRef.current) {
        if (!p.interactive) continue;
        const pY = p.y - virtualScroll * p.depth;
        if (Math.sqrt((e.clientX - p.x) ** 2 + (e.clientY - pY) ** 2) < p.radius + 20) {
          isHovering = true;
          break;
        }
      }

      if (!isHovering && specialStarRef.current && specialStarRef.current.state !== 'fading-out') {
        const ss = specialStarRef.current;
        const drawY = ss.y - virtualScroll;
        if (Math.sqrt((e.clientX - ss.x) ** 2 + (e.clientY - drawY) ** 2) < 60) {
          isHovering = true;
          ss.pulseAmount = Math.max(ss.pulseAmount, 0.5);
        }
      }

      if (isHovering) {
        document.body.classList.add("canvas-hovering");
      } else {
        document.body.classList.remove("canvas-hovering");
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleInteraction = (clientX: number, clientY: number) => {
      const progress = scrollYProgress ? scrollYProgress.get() : 0;
      const virtualScroll = progress * canvas.height * heightMultiplier;
      
      let interactionFound = false;

      // Check planets first (they are larger)
      for (const p of planetsRef.current) {
        if (!p.interactive) continue;
        const pY = p.y - virtualScroll * p.depth;
        const dist = Math.sqrt((clientX - p.x) ** 2 + (clientY - pY) ** 2);
        
        if (dist < p.radius + 20) {
          p.rotationAngle += 0.5; // Spin it!
          playSfx('planet');
          
          window.dispatchEvent(new CustomEvent("star-reveal", {
            detail: { type: "birthday", content: p.message, x: clientX, y: clientY }
          }));
          
          // Spawn burst particles
          for(let j=0; j<30; j++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            burstParticlesRef.current.push({
              x: p.x, y: pY,
              vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
              life: 0, maxLife: 30 + Math.random() * 30,
              color: "244, 114, 182"
            });
          }
          
          interactionFound = true;
          break;
        }
      }

      if (interactionFound) return;

      // Check special star
      if (specialStarRef.current && specialStarRef.current.state !== 'fading-out') {
        const ss = specialStarRef.current;
        const drawY = ss.y - virtualScroll;
        const dist = Math.sqrt((clientX - ss.x) ** 2 + (clientY - drawY) ** 2);
        
        if (dist < 60) {
          playSfx('star');
          const message = getRandomMessage();
          
          window.dispatchEvent(new CustomEvent("star-reveal", {
            detail: { type: "like", content: message, x: clientX, y: clientY }
          }));

          // Chain reaction to nearby normal stars
          for (let j = 0; j < particlesRef.current.length; j++) {
            const p2 = particlesRef.current[j];
            const drawY2 = p2.y - virtualScroll * p2.depth;
            const d2 = Math.sqrt((ss.x - p2.x) ** 2 + (drawY - drawY2) ** 2);
            if (d2 < 150) {
              setTimeout(() => { p2.pulseAmount = 0.8; }, d2 * 2);
            }
          }

          // Gentle golden particle burst
          for (let j = 0; j < 25; j++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2;
            burstParticlesRef.current.push({
              x: ss.x, y: drawY,
              vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
              life: 0, maxLife: 30 + Math.random() * 20,
              color: "255, 230, 200"
            });
          }

          // Trigger fade out and reset timer
          ss.state = 'fading-out';
          specialStarTimerRef.current = 0;
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Ignore clicks on buttons or links
      if ((e.target as HTMLElement).closest('button, a')) return;
      handleInteraction(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('button, a')) return;
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouchStart);

    let time = 0;
    let shootingStarTimer = 0;

    const drawAurora = (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number, time: number) => {
      const musicBoost = musicState.overallEnergy * 0.5;
      
      let baseOpacity = 0.02; // Chapters 1-5
      if (progress > 0.6 && progress < 0.75) baseOpacity = 0.01; // Argument
      if (progress >= 0.75 && progress < 0.85) baseOpacity = 0.05; // Healing
      if (progress >= 0.85) baseOpacity = 0.12; // Birthday climax
      
      baseOpacity += musicBoost * 0.05;

      if (baseOpacity <= 0) return;

      const ribbons = progress >= 0.85 ? 5 : 3;
      
      for (let i = 0; i < ribbons; i++) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 50) {
          const xNorm = x / width;
          // Complex sine wave for ribbon
          const y = height * 0.4 
                  + Math.sin(xNorm * 3 + time * 0.001 + i) * 100 
                  + Math.sin(xNorm * 7 - time * 0.002) * 50
                  + Math.sin(xNorm * 2 + time * 0.003 + i * 2) * (150 * (musicBoost + 1));
                  
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, 0);
        ctx.lineTo(0, 0);
        
        const grad = ctx.createLinearGradient(0, height * 0.2, 0, height * 0.8);
        const hue = (time * 0.1 + i * 40) % 360;
        
        grad.addColorStop(0, `hsla(${hue}, 80%, 60%, 0)`);
        grad.addColorStop(0.5, `hsla(${hue}, 80%, 60%, ${baseOpacity})`);
        grad.addColorStop(1, `hsla(${hue}, 80%, 60%, 0)`);
        
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1 + musicState.overallEnergy * 1.5; // Speed up time slightly with music
      shootingStarTimer += 1 + musicState.overallEnergy * 2;

      const progress = scrollYProgress ? scrollYProgress.get() : 0;
      const virtualScroll = progress * canvas.height * heightMultiplier;

      // STORY DRIVEN VISUALS
      const avatarAmount = Math.max(0, 1 - Math.abs(progress - 0.4) * 5); 
      const coldAmount = Math.max(0, 1 - Math.abs(progress - 0.65) * 6);
      const birthdayAmount = Math.max(0, (progress - 0.85) * 6.66);

      // Global tint
      const fogOpacity = 0.03 + progress * 0.05 + birthdayAmount * 0.05 + musicState.bassLevel * 0.05;
      const r = 26 - coldAmount * 10;
      const g = 16 + avatarAmount * 20;
      const b = 61 + avatarAmount * 40 + coldAmount * 20;
      
      const fogGrad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.5, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
      );
      fogGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${fogOpacity})`);
      fogGrad.addColorStop(1, "transparent");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Aurora
      drawAurora(ctx, canvas.width, canvas.height, progress, time);

      // === SPECIAL STAR SPAWNER & RENDER ===
      const dt = 16.6; // Approx 60fps delta
      specialStarTimerRef.current += dt;
      if (specialStarTimerRef.current >= nextSpecialStarDelayRef.current && !specialStarRef.current) {
        // Safe zone: outer 25% of left or right side, vertically within the current viewport (with 10% padding)
        const isLeft = Math.random() > 0.5;
        const safeX = isLeft 
          ? Math.random() * (canvas.width * 0.25)
          : canvas.width * 0.75 + Math.random() * (canvas.width * 0.25);
        const safeY = virtualScroll + canvas.height * 0.1 + Math.random() * (canvas.height * 0.8);
        
        specialStarRef.current = {
          x: safeX,
          y: safeY,
          baseSize: Math.random() * 1.5 + 2.5,
          pulseAmount: 0,
          twinkleOffset: Math.random() * Math.PI * 2,
          opacity: 0,
          state: 'fading-in',
          life: 0,
          maxLife: Math.random() * 4000 + 6000 // 6-10 seconds
        };
        specialStarTimerRef.current = 0;
        // Increase frequency as progress increases
        const baseDelay = 5000 - (progress * 2000); 
        nextSpecialStarDelayRef.current = Math.random() * 5000 + baseDelay;
      }

      if (specialStarRef.current) {
        const ss = specialStarRef.current;
        ss.life += dt;
        ss.twinkleOffset += 0.05;
        ss.pulseAmount = Math.max(0, ss.pulseAmount - 0.02);
        
        if (ss.state === 'fading-in') {
          ss.opacity += 0.015;
          if (ss.opacity >= 1) ss.state = 'active';
        } else if (ss.state === 'active') {
          if (ss.life >= ss.maxLife) ss.state = 'fading-out';
        } else if (ss.state === 'fading-out') {
          ss.opacity -= 0.015;
          if (ss.opacity <= 0) specialStarRef.current = null;
        }

        if (specialStarRef.current) {
          const drawY = ss.y - virtualScroll;
          if (drawY > -50 && drawY < canvas.height + 50) {
            const size = ss.baseSize + Math.sin(ss.twinkleOffset) * 0.5 + ss.pulseAmount * 2;
            const alpha = ss.opacity * (0.8 + Math.sin(ss.twinkleOffset * 2) * 0.2);
            
            // Core
            ctx.beginPath();
            ctx.arc(ss.x, drawY, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();
            
            // Magical Glow
            ctx.beginPath();
            ctx.arc(ss.x, drawY, size * 5, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(ss.x, drawY, 0, ss.x, drawY, size * 5);
            gradient.addColorStop(0, `rgba(255, 230, 200, ${alpha * 0.6})`);
            gradient.addColorStop(1, 'rgba(255, 230, 200, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        }
      }

      // === PLANETS ===
      const planets = planetsRef.current;
      for (let i = 0; i < planets.length; i++) {
        const p = planets[i];
        const pY = p.y - virtualScroll * p.depth;
        
        if (pY > -200 && pY < canvas.height + 200) {
          ctx.save();
          ctx.translate(p.x, pY);
          ctx.rotate(p.rotationAngle);
          
          // Rings
          if (p.rings) {
            ctx.beginPath();
            ctx.ellipse(0, 0, p.radius * 1.8, p.radius * 0.4, Math.PI / 8, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`;
            ctx.lineWidth = 4;
            ctx.stroke();
          }

          const grad = ctx.createRadialGradient(
            -Math.cos(p.shadowAngle) * p.radius * 0.5,
            -Math.sin(p.shadowAngle) * p.radius * 0.5,
            0,
            0, 0, p.radius
          );
          grad.addColorStop(0, `rgba(${p.color}, 0.8)`);
          grad.addColorStop(1, `rgba(5, 5, 10, 0.9)`);
          
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          
          // Interactive glow
          if (p.interactive) {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius + 10, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + Math.sin(time * 0.05) * 0.05})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          ctx.restore();
          
          p.rotationAngle += 0.001; // slow auto rotation
        }
      }

      // === NEBULAE ===
      const nebulae = nebulaeRef.current;
      for (let i = 0; i < nebulae.length; i++) {
        const n = nebulae[i];
        n.rotation += n.rotSpeed;
        const nY = n.y - virtualScroll * n.depth;

        if (nY > -n.radiusY * 2 && nY < canvas.height + n.radiusY * 2) {
          ctx.save();
          ctx.translate(n.x, nY);
          ctx.rotate(n.rotation);
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(n.radiusX, n.radiusY));
          // Music boosts nebula opacity
          const pulseOpacity = n.opacity * (0.7 + 0.3 * Math.sin(time * 0.003 + i)) + (musicState.bassLevel * 0.02);
          grad.addColorStop(0, n.color + pulseOpacity + ")");
          grad.addColorStop(0.5, n.color + (pulseOpacity * 0.5) + ")");
          grad.addColorStop(1, n.color + "0)");
          ctx.fillStyle = grad;
          ctx.scale(1, n.radiusY / n.radiusX);
          ctx.beginPath();
          ctx.arc(0, 0, n.radiusX, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // === TWO MAIN STARS (Binary System for Final Chapter) ===
      if (birthdayAmount > 0) {
        let cx = canvas.width / 2;
        let cy = canvas.height / 2 - 100;
        
        const anchor = document.getElementById("binary-star-anchor");
        if (anchor) {
          const rect = anchor.getBoundingClientRect();
          cx = rect.left + rect.width / 2;
          cy = rect.top + rect.height / 2;
        }

        const orbitRadius = 40 + birthdayAmount * 20;
        const orbitSpeed = time * 0.005;

        const drawBinaryStar = (x: number, y: number, color: string, glow: string) => {
          ctx.beginPath();
          ctx.arc(x, y, 4 + birthdayAmount * 2 + musicState.midLevel * 5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowBlur = 20 + musicState.trebleLevel * 20;
          ctx.shadowColor = glow;
          ctx.fill();
          ctx.shadowBlur = 0;
        };

        const s1x = cx + Math.cos(orbitSpeed) * orbitRadius;
        const s1y = cy + Math.sin(orbitSpeed) * orbitRadius * 0.5;
        drawBinaryStar(s1x, s1y, `rgba(251, 191, 36, ${birthdayAmount})`, "rgba(251, 191, 36, 1)");

        const s2x = cx + Math.cos(orbitSpeed + Math.PI) * orbitRadius;
        const s2y = cy + Math.sin(orbitSpeed + Math.PI) * orbitRadius * 0.5;
        drawBinaryStar(s2x, s2y, `rgba(167, 139, 250, ${birthdayAmount})`, "rgba(167, 139, 250, 1)");

        ctx.beginPath();
        ctx.moveTo(s1x, s1y);
        ctx.lineTo(s2x, s2y);
        ctx.strokeStyle = `rgba(251, 191, 36, ${birthdayAmount * 0.3 + musicState.midLevel * 0.3})`;
        ctx.lineWidth = 1 + musicState.bassLevel * 2;
        ctx.stroke();
      }

      // === STORYBOOK CONSTELLATIONS ===
      ctx.save();
      storybookScenes.forEach(scene => {
        // Map progress to chapter progress
        const chapStart = scene.chapterIndex * 0.1;
        const chapEnd = chapStart + 0.1;
        
        // Chapter 10 (index 9) special logic: Ghostly memories
        if (progress > 0.85 && scene.chapterIndex !== 9) {
          // Fade in very briefly at 0.85-0.88, fade out 0.88-0.92
          let memOpacity = 0;
          if (progress >= 0.85 && progress <= 0.88) {
            memOpacity = (progress - 0.85) / 0.03 * 0.15;
          } else if (progress > 0.88 && progress <= 0.92) {
            memOpacity = (1 - (progress - 0.88) / 0.04) * 0.15;
          }
          
          if (memOpacity > 0) {
            const originX = scene.originX * canvas.width;
            const originY = scene.originY * canvas.height;
            // Draw nodes
            scene.nodes.forEach(n => {
              ctx.beginPath();
              ctx.arc(originX + n.x * scene.scale, originY + n.y * scene.scale, n.size, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${memOpacity})`;
              ctx.fill();
            });
            // Draw edges
            scene.edges.forEach(e => {
              const from = scene.nodes[e.from];
              const to = scene.nodes[e.to];
              ctx.beginPath();
              ctx.moveTo(originX + from.x * scene.scale, originY + from.y * scene.scale);
              ctx.lineTo(originX + to.x * scene.scale, originY + to.y * scene.scale);
              ctx.strokeStyle = `rgba(255, 255, 255, ${memOpacity * 0.5})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            });
          }
          return;
        }

        // Normal Chapter Rendering (Only draw if currently in chapter bounds + slight margin)
        if (progress < chapStart - 0.02 || progress > chapEnd + 0.02 || scene.chapterIndex === 9) return;

        // Calculate opacity based on enter/exit
        let sceneOpacity = 1;
        if (progress < chapStart + 0.02) {
           sceneOpacity = Math.max(0, (progress - (chapStart - 0.02)) / 0.04);
        } else if (progress > chapEnd - 0.02) {
           sceneOpacity = Math.max(0, 1 - (progress - (chapEnd - 0.02)) / 0.04);
        }

        const originX = scene.originX * canvas.width + Math.sin(time * 0.0005 + scene.chapterIndex) * 20;
        const originY = scene.originY * canvas.height + Math.cos(time * 0.0007 + scene.chapterIndex) * 20;

        // Calculate drawing progress (traveling starlight)
        // Draw between local progress 0.2 and 0.8
        const localProgress = (progress - chapStart) / 0.1;
        const drawProgress = Math.min(1, Math.max(0, (localProgress - 0.2) / 0.6));

        // Draw Edges
        scene.edges.forEach(edge => {
          const fromNode = scene.nodes[edge.from];
          const toNode = scene.nodes[edge.to];

          const startX = originX + fromNode.x * scene.scale;
          const startY = originY + fromNode.y * scene.scale;
          const endX = originX + toNode.x * scene.scale;
          const endY = originY + toNode.y * scene.scale;

          const currentEndX = startX + (endX - startX) * drawProgress;
          const currentEndY = startY + (endY - startY) * drawProgress;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(currentEndX, currentEndY);
          
          if (edge.isFractured) {
            ctx.setLineDash([4, 12]);
            ctx.strokeStyle = `rgba(100, 100, 150, ${0.4 * sceneOpacity})`;
          } else if (edge.isRepaired) {
            ctx.setLineDash([]);
            ctx.strokeStyle = `rgba(251, 191, 36, ${(0.4 + Math.sin(time * 0.003) * 0.2) * sceneOpacity})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(251, 191, 36, ${0.4 * sceneOpacity})`;
          } else {
            ctx.setLineDash([]);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * sceneOpacity})`;
            ctx.shadowBlur = 0;
          }

          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.setLineDash([]);

          // Traveling starlight
          if (drawProgress > 0 && drawProgress < 1 && !edge.isFractured) {
            ctx.beginPath();
            ctx.arc(currentEndX, currentEndY, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * sceneOpacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(255, 255, 255, ${1 * sceneOpacity})`;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            if (Math.random() > 0.7) {
               trailParticlesRef.current.push({
                 x: currentEndX + (Math.random() - 0.5) * 5,
                 y: currentEndY + (Math.random() - 0.5) * 5,
                 life: 0,
                 maxLife: 15 + Math.random() * 15
               });
            }
          }
        });

        // Draw Nodes
        scene.nodes.forEach((n, idx) => {
           // Fade node in before drawing lines
           const nodeOpacity = Math.min(1, Math.max(0, localProgress / 0.2)) * sceneOpacity;
           
           const nx = originX + n.x * scene.scale;
           const ny = originY + n.y * scene.scale;

           ctx.beginPath();
           ctx.arc(nx, ny, n.size, 0, Math.PI * 2);
           const alpha = 0.5 + Math.sin(time * 0.002 + idx) * 0.5;
           ctx.fillStyle = `rgba(255, 255, 255, ${(0.4 + alpha * 0.4) * nodeOpacity})`;
           ctx.fill();
        });
      });
      ctx.restore();

      // === PARTICLES & CONSTELLATIONS ===
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const silenceAmount = Math.max(0, 1 - Math.abs(progress - 0.25) * 8);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height * heightMultiplier;
        if (p.y > canvas.height * heightMultiplier) p.y = 0;

        const drawY = p.y - virtualScroll * p.depth;

        if (drawY < -50 || drawY > canvas.height + 50) continue;

        // Mouse proximity glow and repel
        const dx = mouse.x - p.x;
        const dy = mouse.y - drawY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let hoverGlow = 0;

        if (dist < 150) {
          hoverGlow = (150 - dist) / 150 * 0.5;
          if (dist < 100 && p.depth > 0.5) {
            const force = (100 - dist) / 100;
            p.x -= (dx / dist) * force * 0.5;
            p.y -= (dy / dist) * force * 0.5;
          }
        }

        // Pulse logic
        if (p.pulseAmount > 0) {
          p.pulseAmount -= 0.02; // fade out pulse
        } else {
          p.pulseAmount = 0;
        }

        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinkleOffset);
        let currentOpacity = p.opacity * (0.5 + 0.5 * twinkle);
        
        currentOpacity *= (1 - silenceAmount * 0.8);
        currentOpacity += avatarAmount * 0.2 * p.depth;
        currentOpacity += hoverGlow;
        currentOpacity += p.pulseAmount;
        currentOpacity += musicState.trebleLevel * 0.3 * p.depth; // Music flash

        const isArgument = coldAmount > 0.5;
        let finalColor = p.baseColor;
        if (avatarAmount > 0.1) finalColor = "96, 165, 250";
        if (coldAmount > 0.1) finalColor = "232, 224, 240";

        const drawSize = p.size + p.pulseAmount * 3 + hoverGlow * 2;

        ctx.beginPath();
        ctx.arc(p.x, drawY, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${finalColor}, ${Math.min(1, currentOpacity)})`;
        ctx.fill();

        // Interactive indicator halo
        if (p.interactive && !p.revealed) {
          ctx.beginPath();
          ctx.arc(p.x, drawY, drawSize * 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${finalColor}, ${0.1 + Math.sin(time * 0.05 + i) * 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        if (drawSize > 1 && p.depth > 0.5) {
          ctx.beginPath();
          ctx.arc(p.x, drawY, drawSize * 3 + p.pulseAmount * 10, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, drawSize * 3 + p.pulseAmount * 10);
          gradient.addColorStop(0, `rgba(${finalColor}, ${currentOpacity * 0.25})`);
          gradient.addColorStop(1, `rgba(${finalColor}, 0)`);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Constellations
        const connectionThreshold = 80 + progress * 40; 
        
        if (p.depth > 0.7) {
          for (let j = i + 1; j < Math.min(i + 15, particles.length); j++) {
            const p2 = particles[j];
            if (p2.depth < 0.7) continue;
            
            const drawY2 = p2.y - virtualScroll * p2.depth;
            if (drawY2 < -50 || drawY2 > canvas.height + 50) continue;

            const d = Math.sqrt((p.x - p2.x) ** 2 + (drawY - drawY2) ** 2);
            if (d < connectionThreshold) {
              if (isArgument && (i + j) % 3 === 0) continue;

              ctx.beginPath();
              ctx.moveTo(p.x, drawY);
              ctx.lineTo(p2.x, drawY2);
              
              let lineOpacity = 0.05 * (1 - d / connectionThreshold) * (0.2 + progress * 0.8);
              lineOpacity += Math.max(p.pulseAmount, p2.pulseAmount) * 0.5; // Flash connection if either star pulses
              lineOpacity += musicState.midLevel * 0.1; // Music boosts connections
              
              ctx.strokeStyle = `rgba(${finalColor}, ${Math.min(1, lineOpacity)})`;
              ctx.lineWidth = 0.5 + Math.max(p.pulseAmount, p2.pulseAmount);
              ctx.stroke();
            }
          }
        }
      }

      // === BURST PARTICLES ===
      const bursts = burstParticlesRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.life++;
        
        const bOpacity = 1 - (b.life / b.maxLife);
        
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${b.color}, ${bOpacity})`;
        ctx.fill();

        if (b.life >= b.maxLife) {
          bursts.splice(i, 1);
        }
      }

      // === CURSOR TRAIL ===
      const trails = trailParticlesRef.current;
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.life++;
        t.y -= 0.5; // drift up
        
        const tOpacity = (1 - (t.life / t.maxLife)) * 0.3;
        
        ctx.beginPath();
        ctx.arc(t.x, t.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${tOpacity})`;
        ctx.fill();

        if (t.life >= t.maxLife) {
          trails.splice(i, 1);
        }
      }

      // === SHOOTING STARS ===
      const shootingThreshold = 400 - (birthdayAmount * 300) - (musicState.overallEnergy * 200);
      if (shootingStarTimer > shootingThreshold + Math.random() * 300) {
        shootingStarTimer = 0;
        shootingStarsRef.current.push({
          x: Math.random() * canvas.width * 1.5,
          y: Math.random() * canvas.height * 0.5,
          length: 60 + Math.random() * 100,
          speed: 8 + Math.random() * 6 + (birthdayAmount * 10),
          angle: birthdayAmount > 0 ? (Math.random() * Math.PI * 2) : (Math.PI * 0.7 + Math.random() * 0.2), // Center focus at birthday
          opacity: 0,
          life: 0,
          maxLife: 50 + Math.random() * 30,
          color: Math.random() > 0.5 ? "rgba(232, 224, 240, " : "rgba(167, 139, 250, ",
        });
      }

      const shootingStars = shootingStarsRef.current;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life += 1;
        s.x -= Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const lifeProgress = s.life / s.maxLife;
        s.opacity = lifeProgress < 0.2
          ? lifeProgress / 0.2
          : 1 - ((lifeProgress - 0.2) / 0.8);

        const tailX = s.x + Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, s.color + "0)");
        grad.addColorStop(1, s.color + (s.opacity * 0.8) + ")");

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = s.color + (s.opacity * 0.9) + ")";
        ctx.fill();

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouchStart);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [createParticles, createNebulae, createPlanets, scrollYProgress, playSfx]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ background: "transparent", pointerEvents: "auto" }}
    />
  );
}
