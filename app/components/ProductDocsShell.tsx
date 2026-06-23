import Link from "next/link";
import type { ReactNode } from "react";
import DocsProductSwitcher from "./DocsProductSwitcher";
import ProductTopNav from "./ProductTopNav";

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
    <div className="min-h-screen bg-[#0f1115] text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-80"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(113, 181, 255, 0.14), transparent 32%), radial-gradient(circle at top right, rgba(122, 209, 166, 0.14), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 220px)",
        }}
      />
      <ProductTopNav />
      <main className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5! py-24 md:grid-cols-[280px_minmax(0,1fr)] md:px-12.5! md:py-28">
        <aside className="md:sticky md:top-24 md:h-[calc(100vh-120px)]">
          <div className="docs-sidebar rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <Link href={backHref} className="text-sm text-zinc-400 transition hover:text-white">
              {backLabel}
            </Link>
            <div className="mt-6">
              <DocsProductSwitcher currentSlug={currentSlug} />
            </div>
            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Product docs
              </p>
              <nav className="mt-4 flex flex-col gap-1.5 text-sm text-zinc-300">
                {pages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="rounded-xl px-3 py-2 transition hover:bg-white/5 hover:text-white"
                  >
                    {page.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        <article className="min-w-0">
          <div className="rounded-[2rem] border border-white/10 bg-[#12161d] px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:px-10 md:py-10">
            <div className="max-w-3xl border-b border-white/10 pb-8">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8fc6ff]">
                {eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
                {description}
              </p>
              {pages.length > 1 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {pages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      {page.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            {toc.length ? (
              <div className="mt-6 flex flex-wrap gap-2 border-b border-white/10 pb-6">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-zinc-400 transition hover:border-white/20 hover:text-white"
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            ) : null}

            <div className="mt-8 space-y-2">
              {children}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
