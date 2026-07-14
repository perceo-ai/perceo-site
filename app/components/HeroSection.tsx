"use client";

import { useRef, type ComponentProps } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { siteConfig } from "@/lib/site-config";
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
  const { hero } = siteConfig.homePage;
  const [failedCard, passedCard] = hero.cards as Array<ComponentProps<typeof StatusCard>>;
  const secondDescriptionLine = hero.descriptionLines[1] ?? "";
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
        {hero.title}
      </AnimatedHeading>
      <AnimatedHeading
        className="italic font-serif relative z-30 font-bold w-full text-right"
        delay={0.3}
      >
        {hero.subtitle}
      </AnimatedHeading>
      <p className="text-zinc-500 text-right text-sm leading-relaxed mt-4">
        {hero.descriptionLines[0]}
        <br />
        {secondDescriptionLine.startsWith("and verify ") ? (
          <>
            and <span className="text-white">verify</span>{" "}
            {secondDescriptionLine.slice("and verify ".length)}
          </>
        ) : (
          secondDescriptionLine
        )}
      </p>

      <motion.div
        className="absolute left-5 md:left-12 top-[58vh] z-10 hidden md:block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        style={{ y: failedCardY }}
      >
        <StatusCard
          title={failedCard.title}
          status={failedCard.status}
          successRate={failedCard.successRate}
          frequency={failedCard.frequency}
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
          title={passedCard.title}
          status={passedCard.status}
          successRate={passedCard.successRate}
          frequency={passedCard.frequency}
        />
      </motion.div>
    </main>
  );
}
