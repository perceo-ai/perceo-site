"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DocsNavProduct } from "@/lib/docs";
import DocsProductSwitcher from "./DocsProductSwitcher";

type DocsHeadingLink = {
  id: string;
  text: string;
};

type DocsSidebarProps = {
  backHref: string;
  backLabel: string;
  navProducts: DocsNavProduct[];
  toc: DocsHeadingLink[];
};

const sectionLabels = ["Get started", "Concepts", "Guides", "Reference"];

export default function DocsSidebar({
  backHref,
  backLabel,
  navProducts,
  toc,
}: DocsSidebarProps) {
  const [query, setQuery] = useState("");
  const currentProductSlug = navProducts[0]?.slug;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPages = useMemo(() => {
    if (!normalizedQuery) {
      return navProducts;
    }

    return navProducts
      .map((product) => ({
        ...product,
        sections: product.sections
          .map((section) => ({
            ...section,
            links: section.links.filter((page) =>
              `${product.title} ${section.title} ${page.title} ${page.description}`
                .toLowerCase()
                .includes(normalizedQuery),
            ),
          }))
          .filter((section) => section.links.length > 0),
      }))
      .filter((product) => product.sections.length > 0);
  }, [normalizedQuery, navProducts]);

  const filteredToc = useMemo(() => {
    if (!normalizedQuery) {
      return toc;
    }

    return toc.filter((item) => item.text.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery, toc]);

  return (
    <div className="space-y-7">
      <div className="px-2">
        <Link href={backHref} className="text-sm font-medium text-zinc-500 transition hover:text-white">
          {backLabel}
        </Link>
      </div>

      {currentProductSlug ? (
        <div className="px-2">
          <DocsProductSwitcher currentSlug={currentProductSlug} />
        </div>
      ) : null}

      <div className="px-2">
        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Search docs
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Workflow, concepts, API..."
            className="w-full rounded-[6px] border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium normal-case tracking-normal text-white outline-none placeholder:text-zinc-500 focus:border-white/25 focus:bg-white/[0.07]"
          />
        </label>
      </div>

      <nav className="space-y-8 text-sm" aria-label={`Docs navigation: ${sectionLabels.join(", ")}`}>
        {filteredPages.map((product) => (
          <div key={product.slug} className="space-y-5">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              {product.title}
            </p>
            {product.sections.map((section) => (
              <div key={`${product.slug}-${section.title}`} className="space-y-2">
                <p className="px-2 text-xs font-semibold text-zinc-200">{section.title}</p>
                <div className="space-y-0.5">
                  {section.links.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      className={`block rounded-[6px] px-2 py-1.5 leading-6 transition ${
                        page.active
                          ? "bg-white text-[#312F2F]"
                          : "text-zinc-500 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {page.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </nav>

      {filteredToc.length ? (
        <div className="border-t border-white/10 px-2 pt-5 xl:hidden">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            On this page
          </p>
          <nav className="flex flex-col gap-2 text-sm text-zinc-500">
            {filteredToc.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="transition hover:text-white">
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
