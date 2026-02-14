"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type StepStatus = "passed" | "running" | "pending";

interface FlowNode {
  id: string;
  name: string;
  status: "passing" | "running" | "pending";
  steps: StepStatus[];
  successRate: string;
  volume: string;
  x: number;
  y: number;
  connectsTo?: string[];
}

const MOCK_FLOWS: FlowNode[] = [
  {
    id: "auth",
    name: "Authenticate User",
    status: "passing",
    steps: ["passed", "passed", "passed", "passed", "passed"],
    successRate: "100%",
    volume: "4.3k/day",
    x: 130,
    y: 20,
    connectsTo: ["browse", "dashboard"],
  },
  {
    id: "browse",
    name: "Browse Listings",
    status: "running",
    steps: ["passed", "passed", "running", "pending", "pending"],
    successRate: "92%",
    volume: "3.1k/day",
    x: 410,
    y: 0,
    connectsTo: ["checkout"],
  },
  {
    id: "dashboard",
    name: "View Dashboard",
    status: "passing",
    steps: ["passed", "passed", "passed", "passed", "passed"],
    successRate: "99%",
    volume: "2.8k/day",
    x: 410,
    y: 140,
    connectsTo: ["settings"],
  },
  {
    id: "checkout",
    name: "Complete Checkout",
    status: "running",
    steps: ["passed", "passed", "passed", "running", "pending"],
    successRate: "87%",
    volume: "1.2k/day",
    x: 690,
    y: 0,
  },
  {
    id: "settings",
    name: "Update Settings",
    status: "pending",
    steps: ["pending", "pending", "pending", "pending", "pending"],
    successRate: "—",
    volume: "890/day",
    x: 690,
    y: 140,
  },
];

const STATUS_STYLES = {
  passing: {
    bg: "rgba(34, 197, 94, 0.08)",
    border: "rgba(34, 197, 94, 0.3)",
    badge: "#22c55e",
    label: "Passing",
  },
  running: {
    bg: "rgba(59, 130, 246, 0.08)",
    border: "rgba(59, 130, 246, 0.3)",
    badge: "#3b82f6",
    label: "Running",
  },
  pending: {
    bg: "rgba(107, 114, 128, 0.08)",
    border: "rgba(107, 114, 128, 0.3)",
    badge: "#6b7280",
    label: "Pending",
  },
};

function AnimatedDot({
  targetStatus,
  delay,
  active,
}: {
  targetStatus: StepStatus;
  delay: number;
  active: boolean;
}) {
  const [currentStatus, setCurrentStatus] = useState<StepStatus>("pending");
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    if (!active) {
      setCurrentStatus("pending");
      return;
    }

    if (targetStatus === "pending") {
      setCurrentStatus("pending");
      return;
    }

    // pending → running (blue)
    const t1 = setTimeout(() => setCurrentStatus("running"), delay);
    timerRef.current.push(t1);

    if (targetStatus === "passed") {
      // running → passed (green)
      const t2 = setTimeout(() => setCurrentStatus("passed"), delay + 600);
      timerRef.current.push(t2);
    }

    return () => {
      timerRef.current.forEach(clearTimeout);
      timerRef.current = [];
    };
  }, [active, targetStatus, delay]);

  const colors: Record<StepStatus | "passed", string> = {
    passed: "#4ade80",
    running: "#60a5fa",
    pending: "#3f3f46",
  };

  return (
    <motion.div
      className="w-[8px] h-[8px] rounded-full"
      animate={{ backgroundColor: colors[currentStatus] }}
      transition={{ duration: 0.3 }}
    />
  );
}

function FlowCard({
  node,
  active,
  animDelay,
}: {
  node: FlowNode;
  active: boolean;
  animDelay: number;
}) {
  const style = STATUS_STYLES[node.status];

  return (
    <motion.div
      className="absolute w-[240px] rounded-md p-3 flex flex-col gap-2"
      style={{
        left: node.x,
        top: node.y,
        background: style.bg,
        border: `1px solid ${style.border}`,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animDelay }}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-[6px] h-[6px] rounded-full shrink-0"
          style={{ backgroundColor: style.badge }}
        />
        <span className="text-white text-[13px] font-semibold truncate flex-1 min-w-0">
          {node.name}
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-black shrink-0"
          style={{ backgroundColor: style.badge }}
        >
          {style.label}
        </span>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-1.5">
        {node.steps.map((step, i) => (
          <AnimatedDot
            key={i}
            targetStatus={step}
            delay={animDelay * 1000 + 800 + i * 400}
            active={active}
          />
        ))}
        <span className="text-zinc-500 text-[10px] ml-auto">
          {node.steps.filter((s) => s === "passed").length}/{node.steps.length}
        </span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/5" />

      {/* Stats */}
      <div className="flex justify-between text-[11px] text-[#848484]">
        <span>{node.successRate} Success</span>
        <span>{node.volume}</span>
      </div>
    </motion.div>
  );
}

function EdgeLine({
  from,
  to,
  animated,
  delay,
}: {
  from: FlowNode;
  to: FlowNode;
  animated: boolean;
  delay: number;
}) {
  const x1 = from.x + 240; // right edge of source card
  const y1 = from.y + 50; // vertical center-ish
  const x2 = to.x; // left edge of target card
  const y2 = to.y + 50;
  const midX = (x1 + x2) / 2;

  const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

  return (
    <path
      d={path}
      fill="none"
      stroke="#4B5563"
      strokeWidth={1.5}
    />
  );
}

export default function FlowGraph({ active }: { active: boolean }) {
  const flowMap = Object.fromEntries(MOCK_FLOWS.map((f) => [f.id, f]));

  const edges: { from: FlowNode; to: FlowNode; animated: boolean }[] = [];
  MOCK_FLOWS.forEach((node) => {
    node.connectsTo?.forEach((targetId) => {
      const target = flowMap[targetId];
      if (target) {
        edges.push({
          from: node,
          to: target,
          animated: target.status === "running",
        });
      }
    });
  });

  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden relative"
      style={{
        background: "rgba(10, 10, 10, 0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1f2937 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Flow cards + edges */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative p-5" style={{ minHeight: 280, minWidth: 860 }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {active &&
              edges.map((edge, i) => (
                <EdgeLine
                  key={`${edge.from.id}-${edge.to.id}`}
                  from={edge.from}
                  to={edge.to}
                  animated={edge.animated}
                  delay={0.3 + i * 0.15}
                />
              ))}
          </svg>
          {MOCK_FLOWS.map((node, i) => (
            <FlowCard
              key={node.id}
              node={node}
              active={active}
              animDelay={active ? 0.1 + i * 0.15 : 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
