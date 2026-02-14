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
}

export default function SwarmingVectors() {
  const [vectors, setVectors] = useState<Vector[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const hasMouseMoved = useRef(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize vectors in center-bottom area of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.65;

    const initialVectors: Vector[] = Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 80,
      vx: 0,
      vy: 0,
      rotation: Math.random() * 360,
      scale: 1,
    }));
    setVectors(initialVectors);

    // Set initial mouse position to center
    mousePos.current = { x: centerX, y: centerY };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      hasMouseMoved.current = true;
    };

    // Touch move handler for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        hasMouseMoved.current = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (vectors.length === 0) return;

    const animate = () => {
      setVectors((prevVectors) =>
        prevVectors.map((vector, index) => {
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

          // Smooth rotation toward movement direction
          let targetRotation = vector.rotation;
          if (speed > 0.5) {
            targetRotation = Math.atan2(newVy, newVx) * (180 / Math.PI) + 90;
          }

          // Lerp rotation
          let rotationDiff = targetRotation - vector.rotation;
          if (rotationDiff > 180) rotationDiff -= 360;
          if (rotationDiff < -180) rotationDiff += 360;
          const newRotation = vector.rotation + rotationDiff * 0.1;

          return {
            ...vector,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [vectors.length]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    >
      {vectors.map((vector) => (
        <svg
          key={vector.id}
          className="absolute"
          style={{
            left: vector.x - 4,
            top: vector.y - 4,
          }}
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
        >
          <circle
            cx="4"
            cy="4"
            r="3.5"
            fill="#8b5cf6"
            opacity="0.7"
          />
        </svg>
      ))}
    </div>
  );
}
