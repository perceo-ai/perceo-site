import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SmartLink from "../../components/SmartLink";
import SuiteProductVisual from "../../components/SuiteProductVisual";
import { getProduct, products, siteConfig, type SuiteVisualKind } from "@/lib/site-config";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | Perceo`,
    description: product.summary,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const { detail } = product;
  const statusLabel = siteConfig.productsPage.statusLabels[product.status];

  return (
    <div className="min-h-screen bg-[#312F2F] grid-lines relative text-white">
      <div className="dot-pattern dot-pattern-fade z-0" aria-hidden="true" />
      <Navbar />

      <main className="relative z-[15] mx-auto max-w-[1180px] px-5! pt-32 pb-10 md:px-12.5! md:pt-40">
        <SmartLink
          href="/products"
          className="text-sm font-medium text-zinc-500 transition hover:text-white"
        >
          &larr; All products
        </SmartLink>

        <header className="mt-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              {product.role}
            </p>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-zinc-300">
              {statusLabel}
            </span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold italic leading-tight text-white md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-4 text-xl leading-8 text-zinc-300">{detail.tagline}</p>
          <p className="mt-4 text-lg leading-8 text-zinc-400">{detail.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <SmartLink
              href={product.docsHref}
              external
              className="rounded-[5px] bg-gradient-to-b from-[#8b5cf6] to-[#7848e6] px-5 py-2.5 text-sm font-semibold text-white transition hover:from-[#7c3aed] hover:to-[#6d28d9]"
            >
              Read the docs
            </SmartLink>
            <SmartLink
              href={product.repoUrl}
              external
              className="rounded-[5px] border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View on GitHub
            </SmartLink>
          </div>
        </header>

        <div className="mt-14 aspect-[4/3] w-full overflow-hidden rounded-[8px] md:aspect-[16/9]">
          <SuiteProductVisual kind={product.slug as SuiteVisualKind} active />
        </div>

        <p className="mt-6 rounded-[8px] border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-zinc-400">
          {detail.note}
        </p>

        <section className="mt-14 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-bold italic text-white">What it does</h2>
            <ul className="mt-5 space-y-3">
              {detail.points.map((point) => (
                <li key={point} className="relative pl-5 text-base leading-7 text-zinc-300 before:absolute before:left-0 before:top-[0.72em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-zinc-500">
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold italic text-white">The loop</h2>
            <ol className="mt-5 space-y-3">
              {detail.workflow.map((step, index) => (
                <li key={step} className="flex gap-3 text-base leading-7 text-zinc-300">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs font-semibold text-zinc-400">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {detail.installTargets?.length ? (
          <section className="mt-14">
            <h2 className="font-serif text-2xl font-bold italic text-white">Install</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {detail.installTargets.map((target) => (
                <div
                  key={target.name}
                  className="overflow-hidden rounded-[8px] border border-white/10 bg-black/25"
                >
                  <div className="border-b border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
                    {target.name}
                  </div>
                  <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-6 text-zinc-300">
                    <code>{target.command}</code>
                  </pre>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-bold italic text-white">Requirements</h2>
            <ul className="mt-5 space-y-3">
              {detail.requirements.map((requirement) => (
                <li key={requirement} className="relative pl-5 text-base leading-7 text-zinc-300 before:absolute before:left-0 before:top-[0.72em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-zinc-500">
                  {requirement}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold italic text-white">Documentation</h2>
            <div className="mt-5 grid gap-3">
              {detail.docsLinks.map((link) => (
                <SmartLink
                  key={link.href}
                  href={link.href}
                  external
                  className="rounded-[8px] border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  {link.label}
                </SmartLink>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
