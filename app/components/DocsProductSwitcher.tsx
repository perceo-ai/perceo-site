"use client";

import { usePathname, useRouter } from "next/navigation";
import { products } from "../data/products";

type DocsProductSwitcherProps = {
  currentSlug: string;
};

export default function DocsProductSwitcher({ currentSlug }: DocsProductSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
      Switch product
      <select
        aria-label="Switch product docs"
        className="docs-select w-full rounded-[6px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium normal-case tracking-normal text-zinc-950 outline-none transition focus:border-zinc-400 focus:bg-white"
        value={currentSlug}
        onChange={(event) => {
          const nextProduct = products.find((product) => product.slug === event.target.value);
          if (!nextProduct || nextProduct.docsHref === pathname) {
            return;
          }

          router.push(nextProduct.docsHref);
        }}
      >
        {products.map((product) => (
          <option key={product.slug} value={product.slug}>
            {product.name}
            {product.status === "concept" ? " (Concept)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
