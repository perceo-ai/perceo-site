import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { products } from "../data/products";
import { siteConfig } from "@/lib/site-config";

export const metadata = siteConfig.productsPage.metadata;

export default function ProductsPage() {
  const { productsPage } = siteConfig;

  return (
    <div className="min-h-screen bg-[#312F2F] grid-lines relative text-white">
      <div className="dot-pattern dot-pattern-fade z-0" aria-hidden="true" />
      <Navbar />

      <main className="relative z-[15] mx-auto max-w-[1400px] px-5! pt-32 pb-10 md:px-12.5! md:pt-40">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            {productsPage.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold italic leading-tight text-white md:text-7xl">
            {productsPage.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            {productsPage.description}
          </p>
        </div>

        <section className="mt-14 grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <article
              id={product.slug}
              key={product.slug}
              className="rounded-[8px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-md transition hover:border-white/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                    {product.role}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{product.name}</h2>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-zinc-300">
                  {productsPage.statusLabels[product.status]}
                </span>
              </div>
              <p className="mt-4 text-base leading-7 text-zinc-300">{product.pitch}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={product.docsHref}
                  className="rounded-[5px] bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  {product.primaryCta}
                </Link>
                {product.slug === "archductor" ? (
                  <Link
                    href="/products/archductor"
                    className="rounded-[5px] border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {productsPage.archductorProductLinkLabel}
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
