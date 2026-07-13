"use client";

import { motion } from "framer-motion";
import {
  BookOpenText,
  CheckCircle,
  CirclesThree,
  Code,
  GitBranch,
  GitPullRequest,
  Graph,
  MagnifyingGlass,
  MonitorPlay,
  Robot,
  TerminalWindow,
} from "@phosphor-icons/react";

export type SuiteVisualKind = "archivum" | "archgraph" | "archductor" | "testing";

type SuiteProductVisualProps = {
  kind: SuiteVisualKind;
  active: boolean;
};

const panelBase =
  "absolute rounded-[8px] border border-white/10 bg-white/[0.055] backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.24)]";

function VisualShell({
  active,
  product,
  role,
  children,
}: {
  active: boolean;
  product: string;
  role: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[8px] border border-white/10 bg-[#171616]/90">
      <div className="absolute inset-0 opacity-40 grid-lines" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {role}
            </p>
            <h3 className="mt-0.5 font-serif text-xl font-bold italic text-white">{product}</h3>
          </div>
          <motion.div
            className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold text-zinc-300"
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 4 }}
            transition={{ duration: 0.3 }}
          >
            {active ? "Synced" : "Idle"}
          </motion.div>
        </div>
        <div className="relative flex-1">{children}</div>
      </div>
    </div>
  );
}

function ArchivumVisual({ active }: { active: boolean }) {
  const pages = ["Daily note", "Product brief", "API limits", "Customer call"];
  const links = ["backlinks", "semantic search", "MCP access"];

  return (
    <VisualShell active={active} product="Archivum" role="Knowledge workspace">
      <motion.div
        className={`${panelBase} left-5 top-5 w-[190px] p-3`}
        animate={active ? { opacity: 1, x: 0 } : { opacity: 0.55, x: -16 }}
      >
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <BookOpenText size={17} weight="bold" />
          Markdown wiki
        </div>
        <div className="space-y-2">
          {pages.map((page, index) => (
            <motion.div
              key={page}
              className="flex items-center justify-between rounded-[6px] bg-white/[0.04] px-2 py-1.5 text-xs text-zinc-300"
              animate={active ? { opacity: 1 } : { opacity: 0.45 }}
              transition={{ delay: index * 0.08 }}
            >
              <span>{page}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#8add84]" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={`${panelBase} right-6 top-8 w-[300px] p-4`}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0.45, y: 14 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          <MagnifyingGlass size={15} weight="bold" />
          AI ingest
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-200">
          Convert files, URLs, meeting notes, and repo docs into durable pages with citations.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map((link) => (
            <span key={link} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-400">
              {link}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={`${panelBase} bottom-6 left-[160px] h-[150px] w-[330px] p-4`}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0.55, scale: 0.98 }}
        transition={{ delay: 0.18 }}
      >
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <CirclesThree size={18} weight="bold" />
          Knowledge graph
        </div>
        <div className="relative h-[92px]">
          {[
            ["Wiki", "left-4 top-8", "bg-[#8add84]"],
            ["Search", "left-[126px] top-2", "bg-[#60a5fa]"],
            ["MCP", "right-6 top-10", "bg-[#c4b5fd]"],
            ["Notes", "left-[148px] bottom-1", "bg-[#facc15]"],
          ].map(([label, pos, color], index) => (
            <motion.div
              key={label}
              className={`absolute ${pos} rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs text-white`}
              animate={active ? { y: [0, -4, 0] } : { y: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.2 }}
            >
              <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${color}`} />
              {label}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </VisualShell>
  );
}

function ArchgraphVisual({ active }: { active: boolean }) {
  const nodes = [
    { label: "Product", x: 65, y: 46, color: "#c4b5fd" },
    { label: "Repo", x: 248, y: 38, color: "#60a5fa" },
    { label: "Branch", x: 420, y: 92, color: "#8add84" },
    { label: "Issue", x: 140, y: 185, color: "#facc15" },
    { label: "Commit", x: 330, y: 214, color: "#f87171" },
    { label: "Docs", x: 510, y: 186, color: "#38bdf8" },
  ];

  return (
    <VisualShell active={active} product="Archgraph" role="Memory/retrieval infrastructure">
      <div className="absolute inset-0">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 650 350" aria-hidden="true">
          {[
            [65, 46, 248, 38],
            [248, 38, 420, 92],
            [248, 38, 140, 185],
            [420, 92, 330, 214],
            [330, 214, 510, 186],
            [140, 185, 330, 214],
          ].map(([x1, y1, x2, y2], index) => (
            <motion.line
              key={index}
              x1={x1 + 48}
              y1={y1 + 16}
              x2={x2 + 48}
              y2={y2 + 16}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={active ? { pathLength: 1 } : { pathLength: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
            />
          ))}
        </svg>

        {nodes.map((node, index) => (
          <motion.div
            key={node.label}
            className="absolute rounded-[8px] border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white"
            style={{ left: node.x, top: node.y }}
            animate={active ? { opacity: 1, scale: 1 } : { opacity: 0.55, scale: 0.96 }}
            transition={{ delay: index * 0.06 }}
          >
            <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: node.color }} />
            {node.label}
          </motion.div>
        ))}
      </div>

      <motion.div
        className={`${panelBase} bottom-5 right-5 w-[310px] p-4`}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0.45, y: 12 }}
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          <Graph size={16} weight="bold" />
          typed GraphRAG
        </div>
        <p className="mt-3 font-mono text-[12px] leading-6 text-zinc-300">
          query: context before touching auth
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-zinc-400">
          <span className="rounded bg-white/[0.05] px-2 py-1">freshness</span>
          <span className="rounded bg-white/[0.05] px-2 py-1">confidence</span>
          <span className="rounded bg-white/[0.05] px-2 py-1">provenance</span>
        </div>
      </motion.div>
    </VisualShell>
  );
}

function ArchductorVisual({ active }: { active: boolean }) {
  return (
    <VisualShell active={active} product="Archductor" role="Agent execution workbench">
      <div className="grid h-full grid-cols-[220px_1fr] gap-4 p-5">
        <motion.div className={`${panelBase} relative p-3`} animate={active ? { opacity: 1 } : { opacity: 0.55 }}>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <GitBranch size={17} weight="bold" />
            Workspaces
          </div>
          {["berlin / Codex", "tokyo / Claude", "oslo / Cursor"].map((workspace, index) => (
            <motion.div
              key={workspace}
              className="mb-2 rounded-[6px] border border-white/10 bg-white/[0.045] p-2"
              animate={active ? { x: 0, opacity: 1 } : { x: -8, opacity: 0.5 }}
              transition={{ delay: index * 0.08 }}
            >
              <p className="text-xs font-semibold text-zinc-200">{workspace}</p>
              <p className="mt-1 text-[11px] text-zinc-500">branch + worktree + port</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="relative">
          <motion.div className={`${panelBase} left-0 top-0 h-[165px] w-full p-4`} animate={active ? { opacity: 1 } : { opacity: 0.5 }}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <TerminalWindow size={17} weight="bold" />
              PTY agents
            </div>
            <div className="font-mono text-[12px] leading-6 text-zinc-300">
              <p>$ archductor session start berlin --codex</p>
              <p className="text-zinc-500">pulling Archgraph context...</p>
              <p className="text-[#8add84]">workspace ready, checks attached</p>
            </div>
          </motion.div>

          <motion.div
            className={`${panelBase} bottom-0 left-0 w-[48%] p-4`}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
            transition={{ delay: 0.12 }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Code size={17} weight="bold" />
              Diff
            </div>
            <p className="mt-3 text-sm text-zinc-300">+128 / -34</p>
            <p className="mt-1 text-xs text-zinc-500">2 comments staged</p>
          </motion.div>

          <motion.div
            className={`${panelBase} bottom-0 right-0 w-[48%] p-4`}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <GitPullRequest size={17} weight="bold" />
              PR flow
            </div>
            <p className="mt-3 text-sm text-[#8add84]">checks clear</p>
            <p className="mt-1 text-xs text-zinc-500">archive after merge</p>
          </motion.div>
        </div>
      </div>
    </VisualShell>
  );
}

function TestingVisual({ active }: { active: boolean }) {
  const runs = [
    ["Browser", "sign in + create project", "pass"],
    ["Desktop", "open workspace + run command", "pass"],
    ["Mobile", "responsive setup flow", "review"],
    ["Voice", "agent handoff prompt", "queued"],
  ];

  return (
    <VisualShell active={active} product="Computer-use testing" role="Future QA/eval layer">
      <div className="grid h-full grid-cols-[1fr_260px] gap-4 p-5">
        <div className="relative">
          <motion.div className={`${panelBase} inset-x-0 top-0 h-[205px] p-4`} animate={active ? { opacity: 1 } : { opacity: 0.55 }}>
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <MonitorPlay size={18} weight="bold" />
              autonomous QA
            </div>
            <div className="grid grid-cols-2 gap-3">
              {runs.map(([surface, flow, status], index) => (
                <motion.div
                  key={surface}
                  className="rounded-[6px] border border-white/10 bg-white/[0.045] p-3"
                  animate={active ? { opacity: 1, y: 0 } : { opacity: 0.45, y: 8 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <p className="text-xs font-semibold text-white">{surface}</p>
                  <p className="mt-1 text-[11px] leading-4 text-zinc-500">{flow}</p>
                  <p className={`mt-2 text-[11px] font-semibold ${status === "pass" ? "text-[#8add84]" : status === "review" ? "text-amber-300" : "text-zinc-500"}`}>
                    {status}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className={`${panelBase} bottom-0 left-0 right-0 p-4`}
            animate={active ? { opacity: 1 } : { opacity: 0.5 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CheckCircle size={18} weight="bold" />
              Evidence captured
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-[#8add84]"
                initial={{ width: 0 }}
                animate={active ? { width: "72%" } : { width: "18%" }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div className={`${panelBase} relative p-4`} animate={active ? { opacity: 1, x: 0 } : { opacity: 0.5, x: 12 }}>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Robot size={18} weight="bold" />
            Regression agent
          </div>
          <div className="space-y-2 text-xs text-zinc-400">
            <p className="rounded bg-white/[0.045] p-2">observe UI state</p>
            <p className="rounded bg-white/[0.045] p-2">compare expected result</p>
            <p className="rounded bg-white/[0.045] p-2">feed failure to Archductor</p>
          </div>
          <div className="mt-4 rounded-[6px] border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">next layer</p>
            <p className="mt-1 text-sm text-zinc-200">verify behavior before release</p>
          </div>
        </motion.div>
      </div>
    </VisualShell>
  );
}

export default function SuiteProductVisual({ kind, active }: SuiteProductVisualProps) {
  if (kind === "archivum") {
    return <ArchivumVisual active={active} />;
  }

  if (kind === "archgraph") {
    return <ArchgraphVisual active={active} />;
  }

  if (kind === "archductor") {
    return <ArchductorVisual active={active} />;
  }

  return <TestingVisual active={active} />;
}
