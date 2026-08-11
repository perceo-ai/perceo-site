"use client";

import { useId } from "react";
import type { HeroCard } from "@/lib/site-config";

const stepColor: Record<HeroCard["steps"][number], string> = {
  done: "bg-[#8add84]",
  active: "bg-[#60a5fa]",
  idle: "bg-zinc-600",
};

export default function WorkspaceCard({
  title,
  badge,
  tone,
  steps,
  left,
  right,
}: HeroCard) {
  const isActive = tone === "active";
  const noiseId = useId();

  return (
    <div
      className="relative overflow-clip rounded-[5px] p-[15px] w-[275px] flex flex-col gap-[10px]"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* Gradient border overlay */}
      <div
        className="absolute inset-0 rounded-[5px] pointer-events-none"
        style={{
          padding: "1px",
          background: "linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Noise overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] mix-blend-overlay" aria-hidden="true">
        <filter id={noiseId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
      </svg>

      {/* Header row */}
      <div className="flex gap-[5px] items-center w-full relative">
        <div
          className={`w-[7px] h-[7px] rounded-full shrink-0 ${isActive ? "bg-[#60a5fa]" : "bg-[#8add84]"
            }`}
        />
        <span className="text-white text-[15px] font-mono font-medium truncate flex-1 min-w-0">
          {title}
        </span>
        <span
          className={`text-[12px] px-[10px] py-[4px] rounded-full font-semibold shrink-0 text-black ${isActive ? "bg-[#9ec5fb]" : "bg-[#8add84]"
            }`}
        >
          {badge}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-[5px] relative">
        {steps.map((step, index) => (
          <div key={index} className={`w-[12px] h-[12px] rounded-full ${stepColor[step]}`} />
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/10 relative" />

      {/* Stats row */}
      <div className="flex justify-between text-[12px] text-[#848484] relative">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}
