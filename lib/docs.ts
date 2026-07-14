import { readFileSync } from "node:fs";
import path from "node:path";
import docsIndex from "@/content/docs/index.json";

export type DocsPage = {
  slug: string[];
  title: string;
  description: string;
  file: string;
  section: "Get started" | "Concepts" | "Guides" | "Reference";
};

export type DocsProduct = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  visibility: "public" | "locked";
  backHref: string;
  backLabel: string;
  pages: DocsPage[];
};

export type DocsNavLink = {
  href: string;
  title: string;
  description: string;
  active: boolean;
};

export type DocsNavProduct = {
  slug: string;
  title: string;
  sections: Array<{
    title: DocsPage["section"];
    links: DocsNavLink[];
  }>;
};

const docsRoot = path.join(process.cwd(), "content", "docs");
const products = docsIndex.products as DocsProduct[];
const publicProducts = products.filter((product) => product.visibility === "public");

const docsHref = (productSlug: string, page: DocsPage) =>
  page.slug.length ? `/docs/${productSlug}/${page.slug.join("/")}` : `/docs/${productSlug}`;

const sectionOrder: DocsPage["section"][] = ["Get started", "Concepts", "Guides", "Reference"];

export function getDocsProducts() {
  return publicProducts;
}

export function getDocsNavProducts(currentProductSlug?: string, currentSlugParts: string[] = []): DocsNavProduct[] {
  return publicProducts
    .filter((product) => !currentProductSlug || product.slug === currentProductSlug)
    .map((product) => ({
      slug: product.slug,
      title: product.title.replace(/ Docs$/, ""),
      sections: sectionOrder
        .map((section) => ({
          title: section,
          links: product.pages
            .filter((page) => page.section === section)
            .map((page) => ({
              href: docsHref(product.slug, page),
              title: page.title,
              description: page.description,
              active:
                product.slug === currentProductSlug &&
                page.slug.join("/") === currentSlugParts.join("/"),
            })),
        }))
        .filter((section) => section.links.length > 0),
    }));
}

export function getDocsProduct(productSlug: string) {
  return publicProducts.find((product) => product.slug === productSlug);
}

export function getDocsPage(productSlug: string, slugParts: string[]) {
  const product = getDocsProduct(productSlug);

  if (!product) {
    return null;
  }

  const page = product.pages.find((item) => item.slug.join("/") === slugParts.join("/"));

  if (!page) {
    return null;
  }

  return {
    product,
    page,
    markdown: readFileSync(path.join(docsRoot, product.slug, page.file), "utf8"),
  };
}

export function getDocsNeighbors(productSlug: string, slugParts: string[]) {
  const product = getDocsProduct(productSlug);

  if (!product) {
    return {
      previous: null,
      next: null,
    };
  }

  const allPages = product.pages.map((page) => ({
    product,
    page,
    href: docsHref(product.slug, page),
  }));
  const currentIndex = allPages.findIndex(
    (entry) => entry.product.slug === productSlug && entry.page.slug.join("/") === slugParts.join("/"),
  );

  return {
    previous: currentIndex > 0 ? allPages[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
  };
}

type ParsedBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "callout"; tone: "Info" | "Warning" | "Tip"; text: string }
  | { type: "card"; title: string; description: string; href: string }
  | { type: "code"; language: string; code: string };

export function parseMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const blocks: ParsedBlock[] = [];
  const toc: Array<{ id: string; text: string }> = [];
  let index = 0;

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  while (index < lines.length) {
    const line = lines[index].trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const calloutMatch = trimmed.match(/^> (Info|Warning|Tip):\s+(.+)$/);
    if (calloutMatch) {
      blocks.push({
        type: "callout",
        tone: calloutMatch[1] as "Info" | "Warning" | "Tip",
        text: calloutMatch[2],
      });
      index += 1;
      continue;
    }

    const cardMatch = trimmed.match(/^::card\s+(.+?)\s+\|\s+(.+?)\s+\|\s+(.+)$/);
    if (cardMatch) {
      blocks.push({
        type: "card",
        title: cardMatch[1].trim(),
        description: cardMatch[2].trim(),
        href: cardMatch[3].trim(),
      });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({ type: "code", language, code: codeLines.join("\n") });
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3;
      const text = headingMatch[2].trim();
      const id = slugify(text);
      blocks.push({ type: "heading", level, text, id });
      if (level === 2) {
        toc.push({ id, text });
      }
      index += 1;
      continue;
    }

    const unordered = trimmed.startsWith("- ");
    const ordered = /^\d+\.\s+/.test(trimmed);
    if (unordered || ordered) {
      const items: string[] = [];
      while (index < lines.length) {
        const current = lines[index].trim();
        const itemText = unordered
          ? current.match(/^- (.+)$/)
          : current.match(/^\d+\.\s+(.+)$/);
        if (!itemText) {
          break;
        }
        items.push(itemText[1]);
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const paragraph: string[] = [trimmed];
    index += 1;
    while (index < lines.length) {
      const current = lines[index].trim();
      if (
        !current ||
        current.startsWith("> ") ||
        current.startsWith("::card ") ||
        current.startsWith("```") ||
        current.startsWith("#") ||
        current.startsWith("- ") ||
        /^\d+\.\s+/.test(current)
      ) {
        break;
      }
      paragraph.push(current);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return { blocks, toc };
}

export function renderInlineMarkdown(text: string) {
  const parts: Array<
    | { type: "text"; value: string }
    | { type: "code"; value: string }
    | { type: "strong"; value: string }
    | { type: "link"; label: string; href: string }
  > = [];

  const pattern = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const token = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, start) });
    }

    if (token.startsWith("`")) {
      parts.push({ type: "code", value: token.slice(1, -1) });
    } else if (token.startsWith("**")) {
      parts.push({ type: "strong", value: token.slice(2, -2) });
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        parts.push({ type: "link", label: linkMatch[1], href: linkMatch[2] });
      }
    }

    lastIndex = start + token.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts;
}
