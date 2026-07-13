import Link from "next/link";
import DocsTopBar from "../components/DocsTopBar";
import Footer from "../components/Footer";
import { getDocsProducts } from "@/lib/docs";

export const metadata = {
  title: "Perceo Suite Docs",
  description: "Product documentation for the Perceo Suite.",
};

export default function DocsPage() {
  const products = getDocsProducts();
  const archductor = products.find((product) => product.slug === "archductor");

  return (
    <div className="grid-lines relative min-h-screen bg-[#312F2F] text-white">
      <div className="dot-pattern dot-pattern-fade z-0" aria-hidden="true" />
      <DocsTopBar />

      <main className="relative z-[15] mx-auto max-w-[1180px] px-5! py-12 md:px-8! md:py-16">
        <section className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Perceo Suite Documentation
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold italic tracking-tight text-white md:text-6xl">
            Start with the suite.
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            Guides, concepts, and references for the Perceo stack: human knowledge,
            project memory, agent execution, and future computer-use verification.
          </p>
        </section>

        <section className="mt-10 grid gap-3 md:grid-cols-2">
          <Link
            href="/docs/archivum"
            className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Quickstart
            </p>
            <h2 className="mt-3 font-serif text-xl font-bold italic">Read the suite overview</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Start with Archivum, then move through graph memory, execution, and verification.
            </p>
          </Link>

          <Link
            href="/docs/archductor"
            className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Popular guides
            </p>
            <h2 className="mt-3 font-serif text-xl font-bold italic">Run agent workspaces</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Learn how Archductor turns repository work into isolated workspaces and PRs.
            </p>
          </Link>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Products
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold italic">Documentation index</h2>
            </div>
            {archductor ? (
              <Link href="/docs/archductor/workflow" className="text-sm font-medium text-zinc-500 hover:text-white">
                Reference workflow
              </Link>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/docs/${product.slug}`}
                className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  {product.eyebrow}
                </p>
                <h3 className="mt-3 font-serif text-lg font-bold italic">{product.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{product.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Reference
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Use reference pages when you need exact behavior, install targets, release readiness,
            limits, or known constraints.
          </p>
        </section>
      </main>

      <div className="bg-[#312F2F]">
        <Footer />
      </div>
    </div>
  );
}
