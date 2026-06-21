import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perceo Legacy",
  description: "Archived Perceo launch page.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PerceoLegacyPage() {
  return (
    <div className="min-h-screen bg-[#312F2F] grid-lines relative text-white">
      <div className="dot-pattern dot-pattern-fade z-0" aria-hidden="true" />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-[1920px] flex-col justify-center px-5! md:px-12.5!">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Legacy archived page</p>
        <h1 className="mt-6 text-6xl font-bold leading-none md:text-8xl">
          Zero Code,
        </h1>
        <h2 className="mt-2 text-right font-serif text-5xl font-bold italic leading-none md:text-8xl">
          Infinite confidence.
        </h2>
        <p className="mt-8 max-w-md self-end text-right text-sm leading-relaxed text-zinc-500">
          Agent swarms dedicated to testing your products in ways that{" "}
          <span className="text-white">matter</span>
        </p>
      </main>
    </div>
  );
}

