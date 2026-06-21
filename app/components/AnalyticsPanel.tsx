"use client";

import { motion } from "framer-motion";

interface ReviewItem {
  name: string;
  personaColor: string;
  surface: string;
  status: string;
  attention: number;
  age: string;
  health: "healthy" | "warning" | "critical";
}

const REVIEW_ITEMS: ReviewItem[] = [
  {
    name: "Workspace berlin",
    personaColor: "#64748B",
    surface: "Diff",
    status: "+42 / -8",
    attention: 0,
    age: "12m",
    health: "healthy",
  },
  {
    name: "PR checks",
    personaColor: "#10B981",
    surface: "GitHub",
    status: "1 failed",
    attention: 1,
    age: "4m",
    health: "critical",
  },
  {
    name: "Review comments",
    personaColor: "#F59E0B",
    surface: "PR #18",
    status: "3 open",
    attention: 3,
    age: "9m",
    health: "warning",
  },
  {
    name: "Workspace tokyo",
    personaColor: "#10B981",
    surface: "Agent",
    status: "ready",
    attention: 0,
    age: "18m",
    health: "healthy",
  },
  {
    name: "Sibling conflict",
    personaColor: "#64748B",
    surface: "Files",
    status: "1 overlap",
    attention: 1,
    age: "now",
    health: "warning",
  },
  {
    name: "Archive state",
    personaColor: "#F59E0B",
    surface: "Workspace",
    status: "waiting",
    attention: 0,
    age: "post-merge",
    health: "healthy",
  },
];

const HEALTH_STYLES = {
  healthy: { bg: "rgba(34,197,94,0.15)", text: "#4ade80", label: "CLEAR" },
  warning: { bg: "rgba(234,179,8,0.15)", text: "#facc15", label: "REVIEW" },
  critical: { bg: "rgba(239,68,68,0.15)", text: "#f87171", label: "BLOCKED" },
};

function HealthBadge({ health }: { health: ReviewItem["health"] }) {
  const s = HEALTH_STYLES[health];
  return (
    <span
      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

function ReviewRow({
  item,
  delay,
  active,
}: {
  item: ReviewItem;
  delay: number;
  active: boolean;
}) {
  const isCritical = item.health === "critical";

  return (
    <motion.tr
      className={`border-b border-white/5 ${isCritical ? "bg-red-950/20" : ""}`}
      initial={{ opacity: 0, x: -10 }}
      animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.3, delay }}
    >
      <td className="py-2 pr-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-[5px] h-[5px] rounded-full shrink-0"
            style={{ backgroundColor: item.personaColor }}
          />
          <span
            className={`text-[12px] truncate max-w-[120px] ${
              isCritical ? "text-red-300 font-semibold" : "text-zinc-300"
            }`}
          >
            {item.name}
          </span>
        </div>
      </td>
      <td className="py-2 px-2 text-[12px] text-zinc-300 tabular-nums text-right">
        {item.surface}
      </td>
      <td className="py-2 px-2 text-[12px] text-zinc-300 tabular-nums text-right">
        {item.status}
      </td>
      <td className="py-2 px-2 text-right">
        <span
          className={`text-[12px] font-mono ${item.attention > 0 ? "text-amber-300" : "text-zinc-500"}`}
        >
          {item.attention}
        </span>
      </td>
      <td className="py-2 pl-2 text-right">
        <HealthBadge health={item.health} />
      </td>
    </motion.tr>
  );
}

export default function AnalyticsPanel({ active }: { active: boolean }) {
  const clearCount = REVIEW_ITEMS.filter((m) => m.health === "healthy").length;
  const blockedCount = REVIEW_ITEMS.filter((m) => m.health === "critical").length;
  const reviewCount = REVIEW_ITEMS.filter((m) => m.health === "warning").length;
  const readinessScore = clearCount / REVIEW_ITEMS.length;

  return (
    <div
      className="w-full h-full rounded-lg flex flex-col"
      style={{
        background: "rgba(10, 10, 10, 0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-zinc-300 text-[13px] font-semibold">
            Review & PR readiness
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-zinc-500">
            <span className="text-green-400 font-mono">{clearCount}</span> clear
          </span>
          {reviewCount > 0 && (
            <span className="text-[11px] text-zinc-500">
              <span className="text-yellow-400 font-mono">{reviewCount}</span> review
            </span>
          )}
          {blockedCount > 0 && (
            <span className="text-[11px] text-zinc-500">
              <span className="text-red-400 font-mono">{blockedCount}</span> blocked
            </span>
          )}
        </div>
      </div>

      {/* Score bar */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center gap-3">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
          Merge readiness
        </span>
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor:
                readinessScore >= 0.8
                  ? "#4ade80"
                  : readinessScore >= 0.5
                  ? "#facc15"
                  : "#f87171",
            }}
            initial={{ width: 0 }}
            animate={active ? { width: `${readinessScore * 100}%` } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />
        </div>
        <span
          className="text-[13px] font-mono font-semibold"
          style={{
            color:
              readinessScore >= 0.8
                ? "#4ade80"
                : readinessScore >= 0.5
                ? "#facc15"
                : "#f87171",
          }}
        >
          {(readinessScore * 100).toFixed(0)}%
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-4 py-2">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-left pb-2 font-normal">
                Item
              </th>
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-right pb-2 font-normal px-2">
                Surface
              </th>
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-right pb-2 font-normal px-2">
                Status
              </th>
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-right pb-2 font-normal px-2">
                Attn
              </th>
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-right pb-2 font-normal pl-2">
                Health
              </th>
            </tr>
          </thead>
          <tbody>
            {REVIEW_ITEMS.map((item, i) => (
              <ReviewRow
                key={item.name}
                item={item}
                delay={0.15 + i * 0.08}
                active={active}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Alert footer */}
      <div className="px-4 py-2.5 border-t border-white/5 bg-red-950/10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[11px] text-red-300">
            PR checks — failing check staged for the selected Codex session.
          </span>
        </div>
      </div>
    </div>
  );
}
