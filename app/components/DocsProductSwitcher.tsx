"use client";

import { CaretDown, Check } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { products } from "../data/products";

const docsProducts = products.filter((product) => product.docsVisibility !== "locked");

type DocsProductSwitcherProps = {
  currentSlug: string;
};

export default function DocsProductSwitcher({ currentSlug }: DocsProductSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const currentProduct = docsProducts.find((product) => product.slug === currentSlug) ?? docsProducts[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (switcherRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function selectProduct(slug: string) {
    const nextProduct = docsProducts.find((product) => product.slug === slug);
    setIsOpen(false);

    if (!nextProduct || nextProduct.docsHref === pathname) {
      return;
    }

    router.push(nextProduct.docsHref);
  }

  return (
    <div
      ref={switcherRef}
      className="relative flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500"
    >
      <span id={labelId}>Switch product</span>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-[8px] border border-white/10 bg-[#211f1f] px-3 py-2 text-left text-sm font-semibold normal-case tracking-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition hover:border-white/20 hover:bg-[#292626] focus:border-white/30 focus:ring-2 focus:ring-white/15"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="min-w-0">
          <span className="block truncate">{currentProduct?.name ?? "Select product"}</span>
          <span className="mt-0.5 block text-[11px] font-medium text-zinc-500">
            {currentProduct?.status === "concept" ? "Concept docs" : "Product docs"}
          </span>
        </span>
        <CaretDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-zinc-400 transition ${isOpen ? "rotate-180" : ""}`}
          weight="bold"
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-labelledby={labelId}
          className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-[8px] border border-white/10 bg-[#211f1f] p-1 shadow-[0_18px_50px_rgba(0,0,0,0.36)]"
        >
          {docsProducts.map((product) => {
            const isSelected = product.slug === currentSlug;

            return (
              <button
                key={product.slug}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`flex w-full items-center justify-between gap-3 rounded-[6px] px-3 py-2 text-left text-sm normal-case tracking-normal transition ${
                  isSelected
                    ? "bg-white text-[#312f2f]"
                    : "text-zinc-300 hover:bg-white/[0.07] hover:text-white"
                }`}
                onClick={() => selectProduct(product.slug)}
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{product.name}</span>
                  <span className={`mt-0.5 block text-[11px] font-medium ${isSelected ? "text-[#312f2f]/70" : "text-zinc-500"}`}>
                    {product.status === "concept" ? "Concept docs" : "Product docs"}
                  </span>
                </span>
                {isSelected ? <Check aria-hidden="true" className="h-4 w-4 shrink-0" weight="bold" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
