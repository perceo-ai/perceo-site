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
    <div className="space-y-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950">
          {backLabel}
        </Link>
      </div>

      <div className="max-w-[280px] rounded-[8px] border border-zinc-200 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <DocsProductSwitcher currentSlug={currentSlug} />

        <label className="mt-5 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Search docs
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Workflow, install, settings..."
            className="w-full rounded-[6px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium normal-case tracking-normal text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
          />
        </label>
      </div>

      <div className="max-w-[280px] space-y-6 rounded-[8px] border border-zinc-200 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Product docs
          </p>
          <nav className="flex flex-col gap-1 text-sm text-zinc-600">
            {filteredPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded-[6px] px-2 py-2 transition hover:bg-zinc-50 hover:text-zinc-950"
              >
                {page.title}
              </Link>
            ))}
          </nav>
        </div>

        {filteredToc.length ? (
          <div className="border-t border-zinc-200 pt-5 xl:hidden">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              On this page
            </p>
            <nav className="flex flex-col gap-2 text-sm text-zinc-500">
              {filteredToc.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="transition hover:text-zinc-950">
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
