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
    <label className="flex flex-col gap-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
      Switch product
      <select
        aria-label="Switch product docs"
        className="docs-select rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium tracking-normal text-white outline-none transition focus:border-white/25"
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
          <option key={product.slug} value={product.slug} disabled={product.status !== "current"}>
            {product.name}
            {product.status !== "current" ? " (Coming soon)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
