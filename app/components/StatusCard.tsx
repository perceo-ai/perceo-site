"use client";

import { useId } from "react";

interface StatusCardProps {
  title: string;
  status: "Passed" | "Failed";
  successRate: string;
  frequency: string;
}

export default function StatusCard({
  title,
  status,
  successRate,
  frequency,
}: StatusCardProps) {
  const isPassed = status === "Passed";
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
          className={`w-[7px] h-[7px] rounded-full shrink-0 ${isPassed ? "bg-[#8add84]" : "bg-[#848484]"
            }`}
        />
        <span className="text-white text-[16px] font-semibold truncate flex-1 min-w-0">
          {title}
        </span>
        <span
          className={`text-[12px] px-[10px] py-[4px] rounded-full font-semibold shrink-0 text-black ${isPassed ? "bg-[#8add84]" : "bg-[#dd9384]"
            }`}
        >
          {status}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-[5px] relative">
        <div className="w-[12px] h-[12px] rounded-full bg-[#8add84]" />
        <div className="w-[12px] h-[12px] rounded-full bg-[#8add84]" />
        <div className="w-[12px] h-[12px] rounded-full bg-[#8add84]" />
        <div className="w-[12px] h-[12px] rounded-full bg-[#60a5fa]" />
        <div className="w-[12px] h-[12px] rounded-full bg-zinc-600" />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/10 relative" />

      {/* Stats row */}
      <div className="flex justify-between text-[12px] text-[#848484] relative">
        <span>{successRate}</span>
        <span>{frequency}</span>
      </div>
    </div>
  );
}
