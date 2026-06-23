import Link from "next/link";
import type { ReactNode } from "react";
import DocsProductSwitcher from "./DocsProductSwitcher";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SwarmingVectors from "./SwarmingVectors";

type DocsPageLink = {
  href: string;
  title: string;
};

type DocsHeadingLink = {
  id: string;
  text: string;
};

type ProductDocsShellProps = {
  currentSlug: string;
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  pages: DocsPageLink[];
  toc: DocsHeadingLink[];
  children: ReactNode;
};

export default function ProductDocsShell({
  currentSlug,
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  pages,
  toc,
  children,
}: ProductDocsShellProps) {
  return (
    <div className="min-h-screen bg-[#312F2F] grid-lines relative text-white">
      <div className="dot-pattern dot-pattern-fade z-0" aria-hidden="true" />
      <SwarmingVectors />
      <Navbar />

      <main className="relative z-[15] mx-auto max-w-[1920px] px-5! pt-28 pb-10 md:px-12.5! md:pt-36">
        <div className="grid gap-14 md:grid-cols-[220px_minmax(0,1fr)] md:gap-16">
          <aside className="md:sticky md:top-28 md:self-start">
            <Link href={backHref} className="text-sm text-zinc-500 transition hover:text-white">
              {backLabel}
            </Link>
            <div className="mt-6 max-w-[220px]">
              <DocsProductSwitcher currentSlug={currentSlug} />
            </div>
            <nav className="mt-10 flex flex-col gap-3 text-sm text-zinc-500">
              {pages.map((page) => (
                <Link key={page.href} href={page.href} className="transition hover:text-white">
                  {page.title}
                </Link>
              ))}
            </nav>
          </aside>

          <article className="min-w-0">
            <div className="max-w-4xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                {eyebrow}
              </p>
              <h1 className="mt-4 font-serif text-5xl font-bold italic leading-none tracking-tight text-white md:text-7xl">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                {description}
              </p>
            </div>

            {pages.length > 1 ? (
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-white/10 pb-8 text-sm text-zinc-500">
                {pages.map((page) => (
                  <Link key={page.href} href={page.href} className="transition hover:text-white">
                    {page.title}
                  </Link>
                ))}
              </div>
            ) : null}

            {toc.length ? (
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-b border-white/10 pb-8 text-xs uppercase tracking-[0.14em] text-zinc-600">
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="transition hover:text-white">
                    {item.text}
                  </a>
                ))}
              </div>
            ) : null}

            <div className="mt-10 max-w-4xl space-y-2">
              {children}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
