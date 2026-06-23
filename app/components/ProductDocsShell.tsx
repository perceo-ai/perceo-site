import Link from "next/link";
import type { ReactNode } from "react";
import DocsSidebar from "./DocsSidebar";
import Footer from "./Footer";
import Navbar from "./Navbar";

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
      <Navbar />

      <main className="relative z-[15] mx-auto max-w-[1920px] px-5! pt-28 pb-10 md:px-12.5! md:pt-36">
        <div className="grid gap-12 md:grid-cols-[240px_minmax(0,1fr)] md:gap-16">
          <aside className="order-2 border-t border-white/10 pt-8 md:order-1 md:sticky md:top-28 md:self-start md:border-t-0 md:pt-0">
            <DocsSidebar
              backHref={backHref}
              backLabel={backLabel}
              currentSlug={currentSlug}
              pages={pages}
              toc={toc}
            />
          </aside>

          <article className="order-1 min-w-0 md:order-2">
            <div className="max-w-4xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                {eyebrow}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-bold italic leading-none tracking-tight text-white sm:text-5xl md:text-7xl">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg md:leading-8">
                {description}
              </p>
            </div>

            {pages.length > 1 ? (
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-b border-white/10 pb-6 text-sm text-zinc-500 md:mt-10 md:pb-8">
                {pages.map((page) => (
                  <Link key={page.href} href={page.href} className="transition hover:text-white">
                    {page.title}
                  </Link>
                ))}
              </div>
            ) : null}

            {toc.length ? (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-b border-white/10 pb-6 text-[11px] uppercase tracking-[0.14em] text-zinc-600 md:mt-8 md:pb-8 md:text-xs">
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="transition hover:text-white">
                    {item.text}
                  </a>
                ))}
              </div>
            ) : null}

            <div className="mt-8 max-w-4xl space-y-2 md:mt-10">
              {children}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
