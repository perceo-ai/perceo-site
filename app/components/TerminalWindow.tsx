"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  text: string;
  type: "command" | "output" | "success" | "muted";
  delay: number;
}

const terminalSequence: TerminalLine[] = [
  { text: "$ perceo init", type: "command", delay: 0 },
  { text: "", type: "output", delay: 800 },
  { text: "Scanning repository structure...", type: "muted", delay: 1200 },
  { text: "Detected framework: Next.js 16", type: "output", delay: 2000 },
  { text: "Detected 14 routes, 8 API endpoints", type: "output", delay: 2600 },
  { text: "", type: "output", delay: 3000 },
  { text: "Mapping user flows...", type: "muted", delay: 3200 },
  { text: "  /login → /dashboard → /settings", type: "output", delay: 3800 },
  { text: "  /signup → /onboarding → /dashboard", type: "output", delay: 4200 },
  { text: "  /products → /cart → /checkout", type: "output", delay: 4600 },
  { text: "  ... 12 more flows detected", type: "muted", delay: 5000 },
  { text: "", type: "output", delay: 5200 },
  { text: "Generating test graph...", type: "muted", delay: 5400 },
  { text: "Created perceo.graph.json (47 nodes, 83 edges)", type: "output", delay: 6200 },
  { text: "", type: "output", delay: 6400 },
  { text: "Ready. Run `perceo test` to start your first cycle.", type: "success", delay: 6800 },
];

export default function TerminalWindow({ active }: { active: boolean }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasRun = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (active && !hasRun.current) {
      hasRun.current = true;
      setVisibleLines(0);

      terminalSequence.forEach((line, i) => {
        const timer = setTimeout(() => {
          setVisibleLines(i + 1);
        }, line.delay);
        timersRef.current.push(timer);
      });
    }

    if (!active) {
      hasRun.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setVisibleLines(0);
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [active]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "text-white";
      case "success":
        return "text-[#8add84]";
      case "muted":
        return "text-zinc-500";
      default:
        return "text-zinc-300";
    }
  };

  return (
    <div
      className="w-full rounded-lg overflow-hidden"
      style={{
        background: "rgba(20, 20, 20, 0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="text-zinc-500 text-xs ml-2 font-mono">
          ~/project
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-sm leading-6 min-h-[320px]">
        <AnimatePresence>
          {terminalSequence.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className={getLineColor(line.type)}
            >
              {line.text || "\u00A0"}
            </motion.div>
          ))}
        </AnimatePresence>
        {visibleLines < terminalSequence.length && (
          <span
            className={`inline-block w-[8px] h-[14px] bg-white/70 translate-y-[2px] ${
              cursorVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>
    </div>
  );
}
