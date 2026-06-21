"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { updateMusicState, decayMusicState, setMusicPlaying } from "@/lib/musicState";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>(0);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  
  useEffect(() => {
    const basePath = process.env.NODE_ENV === 'production' ? '/Birthday' : '';
    const audio = new Audio(`${basePath}/Christina-Perri-Thousand-Years.mp3`);
    audio.loop = true;
    audio.volume = 0.4;
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    
    audioRef.current.onerror = () => {
      console.warn("Audio file missing. Music player will fail gracefully and hide.");
      setHasError(true);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const initAudioCtx = () => {
    if (!audioCtxRef.current && audioRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);

        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
      } catch (e) {
        console.warn("Web Audio API not supported or initialization failed", e);
      }
    }
  };

  const updateProgress = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress(audioRef.current.currentTime / audioRef.current.duration);
    }
    
    // Web Audio API analysis
    if (analyserRef.current && isPlayingRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate bands
      let bass = 0, mid = 0, treble = 0;
      for (let i = 0; i < 10; i++) bass += dataArray[i];
      for (let i = 10; i < 50; i++) mid += dataArray[i];
      for (let i = 50; i < 128; i++) treble += dataArray[i];
      
      bass = bass / (10 * 255);
      mid = mid / (40 * 255);
      treble = treble / (78 * 255);
      
      const energy = (bass + mid + treble) / 3;
      
      // Smooth the values (simple low-pass filter)
      updateMusicState(bass, mid, treble, energy);
    } else if (!isPlayingRef.current) {
      // Decay state when paused
      decayMusicState();
    }
    
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (audioCtxRef.current && audioCtxRef.current.state === "running") {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
      setMusicPlaying(false);
      cancelAnimationFrame(animationRef.current);
    } else {
      try {
        initAudioCtx();
        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          await audioCtxRef.current.resume();
        }
        await audioRef.current.play();
        setIsPlaying(true);
        isPlayingRef.current = true;
        setMusicPlaying(true);
        updateProgress();
      } catch (err) {
        console.warn("Audio playback failed", err);
      }
    }
  };

  // Constellation points for the record design
  const constellationPoints = [
    { cx: 18, cy: 8 },
    { cx: 28, cy: 14 },
    { cx: 22, cy: 24 },
    { cx: 12, cy: 20 },
    { cx: 8, cy: 12 },
  ];

  if (hasError) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Expanded info panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 left-0 mb-2"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="px-4 py-3 rounded-xl whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(244, 114, 182, 0.06))",
                border: "1px solid rgba(167, 139, 250, 0.15)",
                backdropFilter: "blur(20px)",
              }}
            >
              <p className="text-[10px] font-mono tracking-widest text-accent-violet/50 uppercase mb-1">
                Now Playing
              </p>
              <p className="text-sm font-light text-white/70">
                A Thousand Years
              </p>
              <p className="text-xs font-light text-white/40">
                Christina Perri
              </p>

              {/* Mini progress bar */}
              <div className="mt-2 w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: "linear-gradient(90deg, #a78bfa, #f472b6)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        className="relative w-12 h-12 rounded-full cursor-pointer group"
        style={{
          background: "linear-gradient(135deg, rgba(167, 139, 250, 0.12), rgba(244, 114, 182, 0.08))",
          border: "1px solid rgba(167, 139, 250, 0.2)",
          backdropFilter: "blur(12px)",
        }}
        onClick={togglePlay}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {/* Outer pulse ring when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(167, 139, 250, 0.3)",
            }}
            animate={{
              scale: [1, 1.6, 1.6],
              opacity: [0.4, 0, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}

        {/* Rotating constellation / vinyl disc */}
        <motion.svg
          viewBox="0 0 36 36"
          className="absolute inset-0 w-full h-full p-2"
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isPlaying
              ? { duration: 8, repeat: Infinity, ease: "linear" }
              : { duration: 0.5 }
          }
        >
          {/* Constellation lines */}
          {constellationPoints.map((p, i) => {
            const next = constellationPoints[(i + 1) % constellationPoints.length];
            return (
              <line
                key={`line-${i}`}
                x1={p.cx}
                y1={p.cy}
                x2={next.cx}
                y2={next.cy}
                stroke={isPlaying ? "rgba(167, 139, 250, 0.5)" : "rgba(167, 139, 250, 0.25)"}
                strokeWidth="0.5"
              />
            );
          })}

          {/* Constellation stars */}
          {constellationPoints.map((p, i) => (
            <circle
              key={`star-${i}`}
              cx={p.cx}
              cy={p.cy}
              r={isPlaying ? 1.5 : 1}
              fill={isPlaying ? "rgba(232, 224, 240, 0.8)" : "rgba(232, 224, 240, 0.4)"}
            />
          ))}

          {/* Center dot */}
          <circle
            cx="18"
            cy="16"
            r={isPlaying ? 2 : 1.5}
            fill={isPlaying ? "rgba(244, 114, 182, 0.6)" : "rgba(244, 114, 182, 0.3)"}
          />
        </motion.svg>

        {/* Play/Pause icon overlay (very subtle) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="rgba(255,255,255,0.7)">
              <rect x="2" y="1" width="3" height="10" rx="0.5" />
              <rect x="7" y="1" width="3" height="10" rx="0.5" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="rgba(255,255,255,0.7)">
              <path d="M3 1 L10 6 L3 11 Z" />
            </svg>
          )}
        </div>

        {/* Equalizer bars when playing */}
        {isPlaying && (
          <div className="absolute -right-1 -top-1 flex items-end gap-[2px]">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-[2px] rounded-full bg-accent-violet/60"
                animate={{
                  height: ["4px", `${6 + ((i * 3) % 6)}px`, "3px", `${5 + ((i * 5) % 5)}px`, "4px"],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </motion.button>
    </div>
  );
}
