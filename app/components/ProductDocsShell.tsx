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
    <div className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      <div className="fixed inset-x-0 top-0 z-10 h-24 bg-[#312F2F]" aria-hidden="true" />
      <div className="dot-pattern dot-pattern-fade z-0" aria-hidden="true" />
      <Navbar />

      <main className="relative z-[15] mx-auto max-w-[1500px] px-5! pt-28 pb-10 md:px-8! md:pt-32">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_220px]">
          <aside className="order-2 border-t border-zinc-200 pt-8 lg:order-1 lg:sticky lg:top-28 lg:self-start lg:border-t-0 lg:pt-0">
            <DocsSidebar
              backHref={backHref}
              backLabel={backLabel}
              currentSlug={currentSlug}
              pages={pages}
              toc={toc}
            />
          </aside>

          <article className="order-1 min-w-0 lg:order-2">
            <div className="rounded-[8px] border border-zinc-200 bg-white px-5 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:px-10 md:py-10">
              <div className="max-w-4xl border-b border-zinc-200 pb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Perceo Suite Documentation / {eyebrow}
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg md:leading-8">
                  {description}
                </p>
              </div>

              {pages.length > 1 ? (
                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-3 border-b border-zinc-200 pb-6 text-sm text-zinc-500">
                  {pages.map((page) => (
                    <Link key={page.href} href={page.href} className="transition hover:text-zinc-950">
                      {page.title}
                    </Link>
                  ))}
                </div>
              ) : null}

              <div className="mt-8 max-w-4xl space-y-2">
                {children}
              </div>
            </div>
          </article>

          <aside className="hidden xl:order-3 xl:block xl:sticky xl:top-28 xl:self-start">
            {toc.length ? (
              <div className="rounded-[8px] border border-zinc-200 bg-white p-4 text-sm shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  On This Page
                </p>
                <nav className="flex flex-col gap-3 text-zinc-500">
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="transition hover:text-zinc-950">
                    {item.text}
                  </a>
                ))}
                </nav>
              </div>
            ) : null}
          </aside>
        </div>
      </main>

      <div className="bg-[#312F2F]">
        <Footer />
      </div>
    </div>
  );
}
