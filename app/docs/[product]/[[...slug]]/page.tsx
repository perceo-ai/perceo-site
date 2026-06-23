import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDocsShell from "@/app/components/ProductDocsShell";
import {
  getDocsPage,
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
        <code key={index} className="rounded bg-white/8 px-1.5 py-0.5 text-zinc-100">
          {part.value}
        </code>
      );
    }
    if (part.type === "strong") {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.value}
        </strong>
      );
    }
    return (
      <Link key={index} href={part.href} className="text-[#8fc6ff] hover:text-[#c5e2ff]">
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

  return (
    <ProductDocsShell
      currentSlug={entry.product.slug}
      backHref={entry.product.backHref}
      backLabel={entry.product.backLabel}
      eyebrow={entry.product.eyebrow}
      title={entry.page.title}
      description={entry.page.description}
      pages={entry.product.pages.map((page) => ({
        title: page.title,
        href: page.slug.length ? `/docs/${entry.product.slug}/${page.slug.join("/")}` : `/docs/${entry.product.slug}`,
      }))}
      toc={toc}
    >
      <div className="docs-prose space-y-5 text-sm leading-7 text-zinc-300">
        {blocks.map((block, index) => {
          if (block.type === "heading") {
            if (block.level === 1) {
              return null;
            }

            if (block.level === 2) {
              return (
                <h2
                  key={`${block.id}-${index}`}
                  id={block.id}
                  className="scroll-mt-28 pt-6 text-2xl font-semibold tracking-tight text-white md:text-3xl"
                >
                  {block.text}
                </h2>
              );
            }

            return (
              <h3 key={`${block.id}-${index}`} className="pt-4 text-lg font-semibold text-white md:text-xl">
                {block.text}
              </h3>
            );
          }

          if (block.type === "paragraph") {
            return (
              <p key={index}>
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
                  <li key={item}>
                    {!block.ordered ? "- " : null}
                    <InlineMarkdown text={item} />
                  </li>
                ))}
              </ListTag>
            );
          }

          return (
            <pre key={index} className="docs-code">
              <code>{block.code}</code>
            </pre>
          );
        })}
      </div>
    </ProductDocsShell>
  );
}
