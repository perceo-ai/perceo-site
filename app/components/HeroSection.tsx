"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import StatusCard from "./StatusCard";

function AnimatedHeading({
  children,
  className,
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="overflow-hidden">
      <h1 className={className}>
        {children.split("").map((char, i) =>
          char === " " ? (
            <span key={i}> </span>
          ) : (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: "1.2em" }}
              animate={isInView ? { y: 0 } : { y: "1.2em" }}
              transition={{
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1],
                delay: delay + i * 0.025,
              }}
            >
              {char}
            </motion.span>
          )
        )}
      </h1>
    </div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const passedCardY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const failedCardY = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <main
      ref={containerRef}
      className="relative px-5! md:px-12.5! min-h-screen flex flex-col justify-center"
    >
      <AnimatedHeading className="font-bold relative z-30 font-sans">
        Archductor
      </AnimatedHeading>
      <AnimatedHeading
        className="italic font-serif relative z-30 font-bold w-full text-right"
        delay={0.3}
      >
        for Linux.
      </AnimatedHeading>
      <p className="text-zinc-500 text-right text-sm leading-relaxed mt-4">
        Run coding agents in isolated
        <br />
        Git worktree workspaces on{" "}
        <span className="text-white">Linux</span>
      </p>

      <motion.div
        className="absolute left-5 md:left-12 top-[58vh] z-10 hidden md:block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        style={{ y: failedCardY }}
      >
        <StatusCard
          title="Workspace berlin"
          status="Passed"
          successRate="Checks clear"
          frequency="PR ready"
        />
      </motion.div>

      <motion.div
        className="absolute right-5 md:right-12 top-[35vh] z-10 hidden md:block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        style={{ y: passedCardY }}
      >
        <StatusCard
          title="Codex session"
          status="Passed"
          successRate="Diff reviewed"
          frequency="2 files"
        />
      </motion.div>
    </main>
  );
}
