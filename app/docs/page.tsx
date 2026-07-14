import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getDocsProducts } from "@/lib/docs";
import { siteConfig } from "@/lib/site-config";

export const metadata = siteConfig.docsPage.metadata;

export default function DocsPage() {
  const { docsPage } = siteConfig;
  const products = getDocsProducts();
  const archductor = products.find((product) => product.slug === "archductor");

  return (
    <div className="docs-surface relative min-h-screen bg-[#312F2F] text-white">
      <div className="docs-backdrop z-0" aria-hidden="true" />
      <Navbar />

      <main className="relative z-[15] mx-auto max-w-[1180px] px-5! pb-12 pt-32 md:px-8! md:pb-16 md:pt-36">
        <section className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {docsPage.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold italic tracking-tight text-white md:text-6xl">
            {docsPage.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            {docsPage.description}
          </p>
        </section>

        <section className="mt-10 grid gap-3 md:grid-cols-2">
          {docsPage.cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                {card.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-xl font-bold italic">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {card.description}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {docsPage.productsEyebrow}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold italic">{docsPage.productsTitle}</h2>
            </div>
            {archductor ? (
              <Link href={docsPage.workflowLink.href} className="text-sm font-medium text-zinc-500 hover:text-white">
                {docsPage.workflowLink.label}
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
            {docsPage.reference.eyebrow}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {docsPage.reference.description}
          </p>
        </section>
      </main>

      <div className="bg-[#312F2F]">
        <Footer />
      </div>
    </div>
  );
}
