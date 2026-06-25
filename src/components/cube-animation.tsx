"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Isometric 3D Cube SVG Component
export function IsometricCube({ className = "", size = 30, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size * 1.066}
      viewBox="0 0 30 32"
      className={className}
    >
      {/* Top Face */}
      <path
        d="M 15 4 L 27 10 L 15 16 L 3 10 Z"
        fill={color}
        className="opacity-95"
      />
      {/* Left Face */}
      <path
        d="M 3 10 L 15 16 L 15 28 L 3 22 Z"
        fill={color}
        className="opacity-75"
      />
      {/* Right Face */}
      <path
        d="M 15 16 L 27 10 L 27 22 L 15 28 Z"
        fill={color}
        className="opacity-55"
      />
    </svg>
  );
}

// 1. Horizontal Chain of 3D cubes connected with pulsing lines
export function CubeChain({ maxCubes = 5 }) {
  const [cubes, setCubes] = React.useState<number[]>([1, 2, 3, 4]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCubes((prev) => {
        const nextVal = prev[prev.length - 1] + 1;
        const base = prev.length >= maxCubes ? prev.slice(1) : prev;
        return [...base, nextVal];
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [maxCubes]);

  return (
    <div className="flex justify-center items-center relative min-h-[50px] w-full py-2 select-none">
      <div className="flex items-center gap-2 md:gap-3 relative z-10">
        <AnimatePresence mode="popLayout">
          {cubes.map((cId, idx) => {
            const isLast = idx === cubes.length - 1;
            
            return (
              <React.Fragment key={cId}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0, x: 20, y: -5 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0, x: -20, y: 5 }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  className="relative shrink-0 flex items-center justify-center"
                >
                  <IsometricCube
                    size={28}
                    color="currentColor"
                    className={isLast ? "text-accent" : "text-neutral-700 hover:text-accent transition-colors duration-300"}
                  />

                  {/* Ping glow behind active block */}
                  {isLast && (
                    <span className="absolute w-8 h-8 bg-accent/20 rounded-full blur-md animate-ping z-[-1]" />
                  )}
                </motion.div>

                {/* Connector line between cubes */}
                {!isLast && (
                  <motion.div
                    layout
                    className="w-4 sm:w-6 h-[2px] bg-neutral-200/80 rounded-full relative overflow-hidden shrink-0"
                  >
                    {/* Glowing pulse animation running from left to right along all links */}
                    <motion.div
                      animate={{
                        left: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.25,
                      }}
                      className="absolute top-0 w-3 h-full bg-accent/60 blur-[0.5px]"
                    />
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// 2. Floating floating 3D cubes for page background decoration
export function FloatingCubesBackground({ count = 8 }) {
  const [elements, setElements] = React.useState<Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }>>([]);

  React.useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 90 + 5,
      top: Math.random() * 85 + 10,
      size: Math.random() * 16 + 12, // 12px to 28px
      delay: Math.random() * 4,
      duration: Math.random() * 6 + 7, // 7s to 13s
    }));
    setElements(generated);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-[0.07]">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ y: 15, opacity: 0 }}
          animate={{ 
            y: [-15, 15, -15],
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            left: `${el.left}%`,
            top: `${el.top}%`,
          }}
        >
          <IsometricCube size={el.size} color="currentColor" className="text-neutral-500" />
        </motion.div>
      ))}
    </div>
  );
}
