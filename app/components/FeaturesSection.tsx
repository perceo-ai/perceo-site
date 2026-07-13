"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import SuiteProductVisual, { type SuiteVisualKind } from "./SuiteProductVisual";

const features = [
  {
    visual: "archivum",
    title: "Archivum stores human knowledge.",
    description:
      "Archivum is the calm second brain: Markdown pages, wiki navigation, backlinks, daily and project notes, AI ingest, semantic search, graph views, and MCP access for assistants.",
  },
  {
    visual: "archgraph",
    title: "Archgraph structures project knowledge.",
    description:
      "Archgraph is the future GraphRAG layer: products, repos, branches, commits, issues, docs, source areas, freshness, confidence, and provenance exposed through API and MCP.",
  },
  {
    visual: "archductor",
    title: "Archductor executes with that context.",
    description:
      "Archductor turns memory into work: isolated workspaces, branches, PTYs, Codex/Claude/Cursor-style workers, checks, diffs, reviews, PR flow, and archived execution traces.",
  },
  {
    visual: "testing",
    title: "Computer-use testing verifies behavior.",
    description:
      "Computer-use testing is the future QA layer: autonomous agents run browser, desktop, mobile, and voice flows so shipped work is evaluated against real product behavior.",
  },
] satisfies Array<{ visual: SuiteVisualKind; title: string; description: string }>;

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
              mobileVisual={<SuiteProductVisual kind={feature.visual} active={true} />}
            />
          ))}
        </div>

        {/* Right column - sticky visual (desktop only) */}
        <div className="hidden md:block">
          <div className="sticky top-0 h-screen flex items-center pt-16">
            <div className="relative w-[130%] -mr-[30%] aspect-[4/3] rounded-l-lg" style={{ clipPath: "inset(0 0 0 -20px round 8px 0 0 8px)" }}>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.visual}
                  className="absolute inset-0"
                  animate={{ opacity: activeIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <SuiteProductVisual kind={feature.visual} active={activeIndex === index} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
