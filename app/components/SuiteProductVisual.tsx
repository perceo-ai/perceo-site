"use client";

import { motion } from "framer-motion";
import {
  BookOpenText,
  CirclesThree,
  Code,
  Desktop,
  FlowArrow,
  GitBranch,
  GitPullRequest,
  HardDrives,
  MagnifyingGlass,
  TerminalWindow,
} from "@phosphor-icons/react";

import type { SuiteVisualKind } from "@/lib/site-config";

export type { SuiteVisualKind };

type SuiteProductVisualProps = {
  kind: SuiteVisualKind;
  active: boolean;
};

const panelSurface =
  "rounded-[8px] border border-white/10 bg-white/[0.055] backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.24)]";
const panelBase = `absolute ${panelSurface}`;

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
  const pages = ["Project brief", "Repo notes", "Decision log", "Release notes"];
  const links = ["citations", "search", "agent context"];

  return (
    <VisualShell active={active} product="Archivum" role="Knowledge">
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
          Context capture
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-200">
          Convert notes, links, and repo docs into durable pages agents can actually use.
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
          Connected notes
        </div>
        <div className="relative h-[92px]">
          {[
            ["Brief", "left-4 top-8", "bg-[#8add84]"],
            ["Repo", "left-[126px] top-2", "bg-[#60a5fa]"],
            ["Agent", "right-6 top-10", "bg-[#c4b5fd]"],
            ["Review", "left-[148px] bottom-1", "bg-[#facc15]"],
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

function ArchductorVisual({ active }: { active: boolean }) {
  return (
    <VisualShell active={active} product="Archductor" role="Coding agents">
      <div className="grid h-full grid-cols-[220px_1fr] gap-4 p-5">
        <motion.div className={`${panelSurface} p-3`} animate={active ? { opacity: 1 } : { opacity: 0.55 }}>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <GitBranch size={17} weight="bold" />
            Workspaces
          </div>
          {["docs-refresh", "pricing-copy", "setup-flow"].map((workspace, index) => (
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
              <p>$ archductor session start docs-refresh</p>
              <p className="text-zinc-500">loading project brief...</p>
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

function ArchfleetVisual({ active }: { active: boolean }) {
  const nodes = ["Open app", "Sign in", "Upload", "Verify"];
  const guests = [
    { name: "guest-01", state: "running", tone: "bg-[#8add84]" },
    { name: "guest-02", state: "takeover", tone: "bg-[#facc15]" },
    { name: "guest-03", state: "queued", tone: "bg-zinc-600" },
  ];

  return (
    <VisualShell active={active} product="Archfleet" role="Computer-use agents">
      <div className="grid h-full grid-cols-[1fr_200px] gap-4 p-5">
        <div className="relative">
          <motion.div
            className={`${panelBase} left-0 top-0 h-[150px] w-full p-4`}
            animate={active ? { opacity: 1 } : { opacity: 0.5 }}
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <FlowArrow size={17} weight="bold" />
              Workflow
            </div>
            <div className="flex items-center gap-2">
              {nodes.map((node, index) => (
                <motion.div
                  key={node}
                  className="flex items-center gap-2"
                  animate={active ? { opacity: 1 } : { opacity: 0.45 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <span className="rounded-[6px] border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-[11px] text-zinc-200">
                    {node}
                  </span>
                  {index < nodes.length - 1 ? (
                    <span className="h-px w-3 bg-white/20" aria-hidden="true" />
                  ) : null}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className={`${panelBase} bottom-0 left-0 w-full p-4`}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
            transition={{ delay: 0.14 }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Desktop size={17} weight="bold" />
              Guest desktop
            </div>
            <div className="mt-3 font-mono text-[12px] leading-6 text-zinc-300">
              <p className="text-zinc-500">agent-s: clicking &ldquo;Continue&rdquo;</p>
              <p className="text-[#facc15]">stalled &mdash; XRDP takeover available</p>
            </div>
          </motion.div>
        </div>

        <motion.div className={`${panelSurface} p-3`} animate={active ? { opacity: 1 } : { opacity: 0.55 }}>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <HardDrives size={17} weight="bold" />
            Fleet
          </div>
          {guests.map((guest, index) => (
            <motion.div
              key={guest.name}
              className="mb-2 rounded-[6px] border border-white/10 bg-white/[0.045] p-2"
              animate={active ? { x: 0, opacity: 1 } : { x: 8, opacity: 0.5 }}
              transition={{ delay: index * 0.08 }}
            >
              <p className="font-mono text-xs text-zinc-200">{guest.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-500">
                <span className={`h-1.5 w-1.5 rounded-full ${guest.tone}`} />
                {guest.state}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </VisualShell>
  );
}

export default function SuiteProductVisual({ kind, active }: SuiteProductVisualProps) {
  if (kind === "archivum") {
    return <ArchivumVisual active={active} />;
  }

  if (kind === "archfleet") {
    return <ArchfleetVisual active={active} />;
  }

  return <ArchductorVisual active={active} />;
}
