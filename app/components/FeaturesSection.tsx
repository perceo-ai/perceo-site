"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import TerminalWindow from "./TerminalWindow";
import FlowGraph from "./FlowGraph";
import AnalyticsPanel from "./AnalyticsPanel";

const features = [
  {
    title: "One command. Full coverage.",
    description:
      "Run perceo init in any repo*. Our CLI scans your codebase, detects every user flow, and generates a complete test graph — no config files, no boilerplate. Your agent swarms know exactly what to test from day one.",
    footnote:
      "We only support React-based frameworks for testing and are expanding the frameworks we support quickly.",
  },
  {
    title: "See every path your users take.",
    description:
      "Perceo maps your detected flows into a live dependency graph. Watch agent swarms validate each step in real time — passing, running, and pending — so you always know exactly where your product stands.",
  },
  {
    title: "Synthetic meets reality.",
    description:
      "Correlate your agent test results with real production analytics from Google Analytics. Instantly spot where synthetic tests pass but real users fail — like a mobile Safari timeout your desktop tests would never catch.",
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
      {"footnote" in feature && feature.footnote && (
        <p
          className={`mt-2 text-sm text-zinc-500 transition-colors duration-500 ${isInView ? "text-zinc-400" : "text-zinc-600"
            }`}
        >
          *{feature.footnote}
        </p>
      )}
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
    <section id="features" className="relative z-[15] mx-5 md:mx-12.5">
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
