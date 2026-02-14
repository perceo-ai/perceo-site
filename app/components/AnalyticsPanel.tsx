"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlowMetric {
  name: string;
  personaColor: string;
  synthetic: number;
  production: number;
  delta: number;
  volume: string;
  health: "healthy" | "warning" | "critical";
}

const MOCK_METRICS: FlowMetric[] = [
  {
    name: "Authenticate User",
    personaColor: "#64748B",
    synthetic: 0.99,
    production: 0.97,
    delta: -2,
    volume: "4.3k",
    health: "healthy",
  },
  {
    name: "Browse Listings",
    personaColor: "#10B981",
    synthetic: 0.96,
    production: 0.94,
    delta: -2,
    volume: "3.1k",
    health: "healthy",
  },
  {
    name: "Accept Offer & Close",
    personaColor: "#F59E0B",
    synthetic: 0.93,
    production: 0.71,
    delta: -22,
    volume: "890",
    health: "critical",
  },
  {
    name: "Complete Checkout",
    personaColor: "#10B981",
    synthetic: 0.95,
    production: 0.92,
    delta: -3,
    volume: "1.2k",
    health: "healthy",
  },
  {
    name: "View Dashboard",
    personaColor: "#64748B",
    synthetic: 0.99,
    production: 0.98,
    delta: -1,
    volume: "2.8k",
    health: "healthy",
  },
  {
    name: "Update Settings",
    personaColor: "#F59E0B",
    synthetic: 0.97,
    production: 0.89,
    delta: -8,
    volume: "1.5k",
    health: "warning",
  },
];

const HEALTH_STYLES = {
  healthy: { bg: "rgba(34,197,94,0.15)", text: "#4ade80", label: "HEALTHY" },
  warning: { bg: "rgba(234,179,8,0.15)", text: "#facc15", label: "WARNING" },
  critical: { bg: "rgba(239,68,68,0.15)", text: "#f87171", label: "CRITICAL" },
};

function HealthBadge({ health }: { health: FlowMetric["health"] }) {
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

function MetricRow({
  metric,
  delay,
  active,
}: {
  metric: FlowMetric;
  delay: number;
  active: boolean;
}) {
  const isCritical = metric.health === "critical";

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
            style={{ backgroundColor: metric.personaColor }}
          />
          <span
            className={`text-[12px] truncate max-w-[120px] ${
              isCritical ? "text-red-300 font-semibold" : "text-zinc-300"
            }`}
          >
            {metric.name}
          </span>
        </div>
      </td>
      <td className="py-2 px-2 text-[12px] text-zinc-300 tabular-nums text-right">
        {(metric.synthetic * 100).toFixed(0)}%
      </td>
      <td className="py-2 px-2 text-[12px] text-zinc-300 tabular-nums text-right">
        {(metric.production * 100).toFixed(0)}%
      </td>
      <td className="py-2 px-2 text-right">
        <span
          className={`text-[12px] font-mono ${
            metric.delta >= 0 ? "text-green-400" : Math.abs(metric.delta) > 10 ? "text-red-400" : "text-zinc-400"
          }`}
        >
          {metric.delta > 0 ? "+" : ""}
          {metric.delta}%
        </span>
      </td>
      <td className="py-2 px-2 text-[12px] text-zinc-500 tabular-nums text-right">
        {metric.volume}
      </td>
      <td className="py-2 pl-2 text-right">
        <HealthBadge health={metric.health} />
      </td>
    </motion.tr>
  );
}

export default function AnalyticsPanel({ active }: { active: boolean }) {
  const healthyCount = MOCK_METRICS.filter((m) => m.health === "healthy").length;
  const criticalCount = MOCK_METRICS.filter((m) => m.health === "critical").length;
  const warningCount = MOCK_METRICS.filter((m) => m.health === "warning").length;
  const overallScore = healthyCount / MOCK_METRICS.length;

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
            Synthetic vs Production
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-zinc-500">
            <span className="text-green-400 font-mono">{healthyCount}</span> healthy
          </span>
          {warningCount > 0 && (
            <span className="text-[11px] text-zinc-500">
              <span className="text-yellow-400 font-mono">{warningCount}</span> warning
            </span>
          )}
          {criticalCount > 0 && (
            <span className="text-[11px] text-zinc-500">
              <span className="text-red-400 font-mono">{criticalCount}</span> critical
            </span>
          )}
        </div>
      </div>

      {/* Score bar */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center gap-3">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
          Health Score
        </span>
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor:
                overallScore >= 0.9
                  ? "#4ade80"
                  : overallScore >= 0.7
                  ? "#facc15"
                  : "#f87171",
            }}
            initial={{ width: 0 }}
            animate={active ? { width: `${overallScore * 100}%` } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />
        </div>
        <span
          className="text-[13px] font-mono font-semibold"
          style={{
            color:
              overallScore >= 0.9
                ? "#4ade80"
                : overallScore >= 0.7
                ? "#facc15"
                : "#f87171",
          }}
        >
          {(overallScore * 100).toFixed(0)}%
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-4 py-2">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-left pb-2 font-normal">
                Flow
              </th>
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-right pb-2 font-normal px-2">
                Synth
              </th>
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-right pb-2 font-normal px-2">
                Prod
              </th>
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-right pb-2 font-normal px-2">
                Delta
              </th>
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-right pb-2 font-normal px-2">
                Vol 24h
              </th>
              <th className="text-[10px] text-zinc-500 uppercase tracking-wider text-right pb-2 font-normal pl-2">
                Health
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_METRICS.map((metric, i) => (
              <MetricRow
                key={metric.name}
                metric={metric}
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
            Accept Offer & Close — production 22pts below synthetic (mobile Safari timeout)
          </span>
        </div>
      </div>
    </div>
  );
}
