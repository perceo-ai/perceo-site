"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { siteConfig, type SuiteVisualKind } from "@/lib/site-config";
import SuiteProductVisual from "./SuiteProductVisual";

const features = siteConfig.homePage.features as Array<{
  visual: SuiteVisualKind;
  title: string;
  description: string;
}>;

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
              key={feature.visual}
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
