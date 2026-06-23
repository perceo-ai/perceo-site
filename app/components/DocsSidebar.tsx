"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DocsProductSwitcher from "./DocsProductSwitcher";

type DocsLink = {
  href: string;
  title: string;
};

type DocsHeadingLink = {
  id: string;
  text: string;
};

type DocsSidebarProps = {
  backHref: string;
  backLabel: string;
  currentSlug: string;
  pages: DocsLink[];
  toc: DocsHeadingLink[];
};

export default function DocsSidebar({
  backHref,
  backLabel,
  currentSlug,
  pages,
  toc,
}: DocsSidebarProps) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPages = useMemo(() => {
    if (!normalizedQuery) {
      return pages;
    }

    return pages.filter((page) => page.title.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery, pages]);

  const filteredToc = useMemo(() => {
    if (!normalizedQuery) {
      return toc;
    }

    return toc.filter((item) => item.text.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery, toc]);

  return (
    <div className="space-y-8">
      <div>
        <Link href={backHref} className="text-sm text-zinc-500 transition hover:text-white">
          {backLabel}
        </Link>
      </div>

      <div className="max-w-[260px] space-y-6">
        <DocsProductSwitcher currentSlug={currentSlug} />

        <label className="flex flex-col gap-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Search docs
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Workflow, install, settings..."
            className="w-full border-b border-white/10 bg-transparent px-0 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none placeholder:text-zinc-600 focus:border-white/25"
          />
        </label>
      </div>

      <div className="space-y-8">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
            Product docs
          </p>
          <nav className="flex flex-col gap-3 text-sm text-zinc-500">
            {filteredPages.map((page) => (
              <Link key={page.href} href={page.href} className="transition hover:text-white">
                {page.title}
              </Link>
            ))}
          </nav>
        </div>

        {filteredToc.length ? (
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              On this page
            </p>
            <nav className="flex flex-col gap-3 text-sm text-zinc-600">
              {filteredToc.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="transition hover:text-white">
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </div>
  );
}
