"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  text: string;
  type: "command" | "output" | "success" | "muted";
  delay: number;
}

const terminalSequence: TerminalLine[] = [
  { text: "$ archductor workspace create app-repo --name berlin", type: "command", delay: 0 },
  { text: "", type: "output", delay: 800 },
  { text: "Creating isolated Git worktree...", type: "muted", delay: 1200 },
  { text: "Branch: lc/berlin-archductor-page", type: "output", delay: 2000 },
  { text: "Workspace: .conductor/workspaces/berlin", type: "output", delay: 2600 },
  { text: "", type: "output", delay: 3000 },
  { text: "Starting Codex session...", type: "muted", delay: 3200 },
  { text: "  context: .context/brief.md", type: "output", delay: 3800 },
  { text: "  setup: pnpm install", type: "output", delay: 4200 },
  { text: "  run: pnpm dev --port $CONDUCTOR_PORT", type: "output", delay: 4600 },
  { text: "  linked directories: none", type: "muted", delay: 5000 },
  { text: "", type: "output", delay: 5200 },
  { text: "Review surface ready...", type: "muted", delay: 5400 },
  { text: "Diffs, checks, todos, and PR comments available", type: "output", delay: 6200 },
  { text: "", type: "output", delay: 6400 },
  { text: "Ready. Create the PR when the workspace is clean.", type: "success", delay: 6800 },
];

export default function TerminalWindow({ active }: { active: boolean }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasRun = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (active && !hasRun.current) {
      hasRun.current = true;
      const resetTimer = setTimeout(() => setVisibleLines(0), 0);
      timersRef.current.push(resetTimer);

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
      const resetTimer = setTimeout(() => setVisibleLines(0), 0);
      timersRef.current.push(resetTimer);
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
