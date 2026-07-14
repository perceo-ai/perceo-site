"use client";

import { usePathname, useRouter } from "next/navigation";
import { products } from "../data/products";

const docsProducts = products.filter((product) => product.docsVisibility !== "locked");

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
        className="docs-select w-full rounded-[6px] border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-white/25 focus:bg-white/[0.07]"
        value={currentSlug}
        onChange={(event) => {
          const nextProduct = products.find((product) => product.slug === event.target.value);
          if (!nextProduct || nextProduct.docsHref === pathname) {
            return;
          }

          router.push(nextProduct.docsHref);
        }}
      >
        {docsProducts.map((product) => (
          <option key={product.slug} value={product.slug}>
            {product.name}
            {product.status === "concept" ? " (Concept)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
