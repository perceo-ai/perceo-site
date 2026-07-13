import Link from "next/link";
import type { ReactNode } from "react";
import type { DocsNavProduct } from "@/lib/docs";
import DocsCopyButton from "./DocsCopyButton";
import DocsSidebar from "./DocsSidebar";
import DocsTopBar from "./DocsTopBar";
import Footer from "./Footer";

type DocsPageLink = {
  href: string;
  title: string;
};

type DocsHeadingLink = {
  id: string;
  text: string;
};

type ProductDocsShellProps = {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  pages: DocsPageLink[];
  navProducts: DocsNavProduct[];
  toc: DocsHeadingLink[];
  pageUrl: string;
  children: ReactNode;
};

export default function ProductDocsShell({
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  pages,
  navProducts,
  toc,
  pageUrl,
  children,
}: ProductDocsShellProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950">
      <DocsTopBar />

      <main className="relative z-[15] mx-auto max-w-[1500px] px-5! py-8 md:px-8!">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_220px]">
          <aside className="order-2 border-t border-zinc-200 pt-8 lg:order-1 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:border-t-0 lg:pt-0">
            <DocsSidebar
              backHref={backHref}
              backLabel={backLabel}
              navProducts={navProducts}
              toc={toc}
            />
          </aside>

          <article className="order-1 min-w-0 lg:order-2">
            <div className="mx-auto max-w-3xl">
              <div className="border-b border-zinc-200 pb-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Perceo Suite Documentation / {eyebrow}
                  </p>
                  <DocsCopyButton value={pageUrl} label="Copy page" />
                </div>
                <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-5 text-base leading-7 text-zinc-600 md:text-lg md:leading-8">
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

              <div className="mt-8 space-y-2">
                {children}
              </div>
            </div>
          </article>

          <aside className="hidden xl:order-3 xl:block xl:sticky xl:top-24 xl:self-start">
            {toc.length ? (
              <div className="border-l border-zinc-200 pl-5 text-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  On this page
                </p>
                <nav className="flex flex-col gap-2 text-zinc-500">
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

      <div className="mt-12 bg-[#312F2F]">
        <Footer />
      </div>
    </div>
  );
}
