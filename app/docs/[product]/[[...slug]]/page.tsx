import Link from "next/link";
import { notFound } from "next/navigation";
import DocsCopyButton from "@/app/components/DocsCopyButton";
import DocsPagination from "@/app/components/DocsPagination";
import ProductDocsShell from "@/app/components/ProductDocsShell";
import {
  getDocsPage,
  getDocsNavProducts,
  getDocsNeighbors,
  getDocsProducts,
  parseMarkdown,
  renderInlineMarkdown,
} from "@/lib/docs";

export function generateStaticParams() {
  return getDocsProducts().flatMap((product) =>
    product.pages.map((page) => ({
      product: product.slug,
      slug: page.slug,
    })),
  );
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ product: string; slug?: string[] }>;
}) {
  return params.then(({ product, slug }) => {
    const entry = getDocsPage(product, slug ?? []);
    if (!entry) {
      return {};
    }

    return {
      title: `${entry.page.title} | ${entry.product.title}`,
      description: entry.page.description,
    };
  });
}

function InlineMarkdown({ text }: { text: string }) {
  return renderInlineMarkdown(text).map((part, index) => {
    if (part.type === "text") {
      return <span key={index}>{part.value}</span>;
    }
    if (part.type === "code") {
      return (
        <code key={index} className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-900">
          {part.value}
        </code>
      );
    }
    if (part.type === "strong") {
      return (
        <strong key={index} className="font-semibold text-zinc-950">
          {part.value}
        </strong>
      );
    }
    return (
      <Link key={index} href={part.href} className="font-medium text-[#6d28d9] hover:text-[#4c1d95]">
        {part.label}
      </Link>
    );
  });
}

export default async function ProductDocsPage({
  params,
}: {
  params: Promise<{ product: string; slug?: string[] }>;
}) {
  const { product, slug } = await params;
  const entry = getDocsPage(product, slug ?? []);

  if (!entry) {
    notFound();
  }

  const { blocks, toc } = parseMarkdown(entry.markdown);
  const neighbors = getDocsNeighbors(product, slug ?? []);
  const pageUrl = entry.page.slug.length
    ? `/docs/${entry.product.slug}/${entry.page.slug.join("/")}`
    : `/docs/${entry.product.slug}`;

  return (
    <ProductDocsShell
      backHref={entry.product.backHref}
      backLabel={entry.product.backLabel}
      eyebrow={entry.product.eyebrow}
      title={entry.page.title}
      description={entry.page.description}
      pages={entry.product.pages.map((page) => ({
        title: page.title,
        href: page.slug.length ? `/docs/${entry.product.slug}/${page.slug.join("/")}` : `/docs/${entry.product.slug}`,
      }))}
      navProducts={getDocsNavProducts(entry.product.slug, slug ?? [])}
      toc={toc}
      pageUrl={pageUrl}
    >
      <div className="docs-prose space-y-5 text-[15px] leading-7 text-zinc-600">
        {blocks.map((block, index) => {
          if (block.type === "card" && blocks[index - 1]?.type !== "card") {
            const cards = [];
            let cursor = index;
            while (blocks[cursor]?.type === "card") {
              cards.push(blocks[cursor]);
              cursor += 1;
            }

            return (
              <div key={index} className="card-grid my-6 grid gap-3 md:grid-cols-2">
                {cards.map((card) =>
                  card.type === "card" ? (
                    <Link
                      key={`${card.title}-${card.href}`}
                      href={card.href}
                      className="rounded-[8px] border border-zinc-200 bg-white p-4 no-underline transition hover:border-zinc-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
                    >
                      <span className="block text-sm font-semibold text-zinc-950">{card.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-zinc-500">{card.description}</span>
                    </Link>
                  ) : null,
                )}
              </div>
            );
          }

          if (block.type === "card") {
            return null;
          }

          if (block.type === "heading") {
            if (block.level === 1) {
              return null;
            }

            if (block.level === 2) {
              return (
                <h2
                  key={`${block.id}-${index}`}
                  id={block.id}
                  className="scroll-mt-28 pt-8 text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl"
                >
                  {block.text}
                </h2>
              );
            }

            return (
              <h3 key={`${block.id}-${index}`} className="pt-5 text-lg font-semibold text-zinc-950 md:text-xl">
                {block.text}
              </h3>
            );
          }

          if (block.type === "paragraph") {
            return (
              <p key={index} className="leading-7">
                <InlineMarkdown text={block.text} />
              </p>
            );
          }

          if (block.type === "list") {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={block.ordered ? "list-decimal space-y-2 pl-5" : "space-y-2"}
              >
                {block.items.map((item) => (
                  <li key={item} className={block.ordered ? "" : "relative pl-5 before:absolute before:left-0 before:top-[0.72em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-zinc-300"}>
                    <InlineMarkdown text={item} />
                  </li>
                ))}
              </ListTag>
            );
          }

          if (block.type === "callout") {
            const callout = block;
            const toneClass =
              callout.tone === "Warning"
                ? "border-amber-200 bg-amber-50 text-amber-950"
                : callout.tone === "Tip"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                  : "border-blue-200 bg-blue-50 text-blue-950";

            return (
              <div key={index} className={`callout rounded-[8px] border p-4 ${toneClass}`}>
                <p className="text-sm font-semibold">{callout.tone}</p>
                <p className="mt-1 text-sm leading-6">
                  <InlineMarkdown text={callout.text} />
                </p>
              </div>
            );
          }

          return (
            <div key={index} className="overflow-hidden rounded-[8px] border border-zinc-800 bg-[#101014]">
              <div className="docs-code-header flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2">
                <span className="font-mono text-xs text-zinc-400">{block.language || "text"}</span>
                <DocsCopyButton value={block.code} />
              </div>
              <pre className="docs-code border-0">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        })}
      </div>
      <DocsPagination previous={neighbors.previous} next={neighbors.next} />
    </ProductDocsShell>
  );
}
