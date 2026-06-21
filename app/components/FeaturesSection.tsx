"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import TerminalWindow from "./TerminalWindow";
import FlowGraph from "./FlowGraph";
import AnalyticsPanel from "./AnalyticsPanel";

const features = [
  {
    title: "One repo. Many workspaces.",
    description:
      "Add an existing repository or clone a Git URL. Archductor gives every task its own Git worktree, branch, .context directory, and stable port range.",
  },
  {
    title: "Run agents in parallel.",
    description:
      "Start Shell, Codex, Claude Code, or Cursor sessions inside isolated workspaces. Keep setup, run logs, process state, and terminal output visible while work happens.",
  },
  {
    title: "Review, merge, archive.",
    description:
      "Inspect diffs, todos, PR checks, comments, and sibling conflicts. Create, merge, restore, and archive GitHub PR work without leaving the Linux app.",
  },
];

function FeatureBlock({
  feature,
  index,
  onActive,
  mobileVisual,
}: {
  feature: (typeof features)[0];
  index: number;
  onActive: (index: number) => void;
  mobileVisual: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  useEffect(() => {
    if (isInView) onActive(index);
  }, [isInView, index, onActive]);

  return (
    <div
      ref={ref}
      className="min-h-screen md:min-h-screen flex flex-col justify-center py-16 md:py-20"
    >
      {/* Mobile visual */}
      <div className="md:hidden mb-8 w-full aspect-[4/3] relative rounded-lg overflow-hidden">
        {mobileVisual}
      </div>

      <h2
        className={`text-3xl md:text-4xl font-bold font-serif italic mb-4 transition-colors duration-500 ${isInView ? "text-white" : "text-zinc-600"
          }`}
      >
        {feature.title}
      </h2>
      <p
        className={`text-lg leading-relaxed max-w-md transition-colors duration-500 ${isInView ? "text-zinc-300" : "text-zinc-700"
          }`}
      >
        {feature.description}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const mobileVisuals = [
    <TerminalWindow key="terminal" active={true} />,
    <FlowGraph key="flowgraph" active={true} />,
    <AnalyticsPanel key="analytics" active={true} />,
  ];

  return (
    <section className="relative z-[15] mx-5 overflow-x-clip md:mx-12.5">
      <div className="md:grid md:grid-cols-2 md:gap-16">
        {/* Left column - scrolling text */}
        <div>
          {features.map((feature, i) => (
            <FeatureBlock
              key={i}
              feature={feature}
              index={i}
              onActive={setActiveIndex}
              mobileVisual={mobileVisuals[i]}
            />
          ))}
        </div>

        {/* Right column - sticky visual (desktop only) */}
        <div className="hidden md:block">
          <div className="sticky top-0 h-screen flex items-center pt-16">
            <div className="relative w-[130%] -mr-[30%] aspect-[4/3] rounded-l-lg" style={{ clipPath: "inset(0 0 0 -20px round 8px 0 0 8px)" }}>
              {/* Feature 1: Terminal */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: activeIndex === 0 ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <TerminalWindow active={activeIndex === 0} />
              </motion.div>

              {/* Feature 2: Flow Graph */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: activeIndex === 1 ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <FlowGraph active={activeIndex === 1} />
              </motion.div>

              {/* Feature 3: Analytics Panel */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: activeIndex === 2 ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <AnalyticsPanel active={activeIndex === 2} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
