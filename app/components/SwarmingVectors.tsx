"use client";

import { useEffect, useRef, useState } from "react";

interface Vector {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  /** Unwrapped target angle (deg). Stored to avoid discontinuity when crossing ±180°. */
  lastTargetRotation: number;
}

function createInitialVectors(): Vector[] {
  const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 400;
  const centerY = typeof window !== "undefined" ? window.innerHeight * 0.65 : 400;
  return Array.from({ length: 7 }, (_, i) => ({
    id: i,
    x: centerX + (Math.random() - 0.5) * 100,
    y: centerY + (Math.random() - 0.5) * 80,
    vx: 0,
    vy: 0,
    rotation: Math.random() * 360,
    scale: 1,
    lastTargetRotation: 0,
  }));
}

export default function SwarmingVectors() {
  const [mounted, setMounted] = useState(false);
  const [vectors, setVectors] = useState<Vector[]>([]);
  const vectorsRef = useRef<Vector[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const initial = createInitialVectors();
    queueMicrotask(() => {
      setMounted(true);
      setVectors(initial);
    });
  }, []);

  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.65;
    mousePos.current = { x: centerX, y: centerY };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    vectorsRef.current = vectors;
  }, [vectors]);

  useEffect(() => {
    if (!mounted) return;
    const animate = () => {
      const prevVectors = vectorsRef.current;
      const nextVectors = prevVectors.map((vector, index) => {
        const dx = mousePos.current.x - vector.x;
        const dy = mousePos.current.y - vector.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Swarming behavior parameters
        const attractionStrength = 0.002;
        const dampening = 0.96;
        const minDistance = 40 + index * 8; // Stagger distances
        const maxSpeed = 1.5;

        let ax = 0;
        let ay = 0;

        if (distance > minDistance) {
          // Attraction to mouse
          ax = (dx / distance) * attractionStrength * Math.min(distance, 250);
          ay = (dy / distance) * attractionStrength * Math.min(distance, 250);
        } else if (distance > 0) {
          // Gentle orbit when close
          const angle = Math.atan2(dy, dx) + Math.PI / 2;
          ax = Math.cos(angle) * 0.08 - (dx / distance) * 0.05;
          ay = Math.sin(angle) * 0.08 - (dy / distance) * 0.05;
        }

        // Minimal organic drift
        ax += (Math.random() - 0.5) * 0.02;
        ay += (Math.random() - 0.5) * 0.02;

        // Separation from other vectors
        prevVectors.forEach((other, otherIndex) => {
          if (index !== otherIndex) {
            const sepDx = vector.x - other.x;
            const sepDy = vector.y - other.y;
            const sepDist = Math.sqrt(sepDx * sepDx + sepDy * sepDy);
            if (sepDist < 30 && sepDist > 0) {
              ax += (sepDx / sepDist) * 0.15;
              ay += (sepDy / sepDist) * 0.15;
            }
          }
        });

        let newVx = (vector.vx + ax) * dampening;
        let newVy = (vector.vy + ay) * dampening;

        // Clamp speed
        const speed = Math.sqrt(newVx * newVx + newVy * newVy);
        if (speed > maxSpeed) {
          newVx = (newVx / speed) * maxSpeed;
          newVy = (newVy / speed) * maxSpeed;
        }

        const newX = vector.x + newVx;
        const newY = vector.y + newVy;

        // Target: arrow points toward cursor (heading from vector to mouse)
        const rawTarget = Math.atan2(dy, dx) * (180 / Math.PI);

        // Unwrap target relative to last frame so crossing ±180° doesn't cause a flip.
        // (atan2 jumps 180→-180 at the boundary; we keep target continuous.)
        let targetRotation = rawTarget;
        const prevTarget = vector.lastTargetRotation;
        if (prevTarget !== 0 || vector.rotation !== 0) {
          // Align rawTarget to the same "branch" as prevTarget (within ±180)
          let d = rawTarget - prevTarget;
          while (d > 180) {
            targetRotation -= 360;
            d -= 360;
          }
          while (d < -180) {
            targetRotation += 360;
            d += 360;
          }
        }

        const rotationDiff = targetRotation - vector.rotation;
        const newRotation = vector.rotation + rotationDiff * 0.1;

        return {
          ...vector,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: newRotation,
          lastTargetRotation: targetRotation,
        };
      });

      vectorsRef.current = nextVectors;
      animationRef.current = requestAnimationFrame(animate);
      queueMicrotask(() => setVectors(nextVectors));
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mounted]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
      suppressHydrationWarning
    >
      {vectors.map((vector) => (
        <svg
          key={vector.id}
          className="absolute"
          style={{
            left: vector.x,
            top: vector.y,
            transform: `translate(-50%, -50%) rotate(${vector.rotation}deg)`,
            transformOrigin: "center center",
          }}
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <image href="/point.svg" x="0" y="0" width="17" height="16" preserveAspectRatio="xMidYMid meet" />
        </svg>
      ))}
    </div>
  );
}
