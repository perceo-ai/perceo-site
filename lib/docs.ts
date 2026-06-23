import { readFileSync } from "node:fs";
import path from "node:path";

export type DocsPage = {
  slug: string[];
  title: string;
  description: string;
  file: string;
};

export type DocsProduct = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  backHref: string;
  backLabel: string;
  pages: DocsPage[];
};

const docsRoot = path.join(process.cwd(), "content", "docs");

const products: DocsProduct[] = [
  {
    slug: "archductor",
    title: "Archductor Docs",
    eyebrow: "Linux Conductor docs",
    description:
      "Install, understand, and run the Linux-native Conductor workflow with a docs shell that behaves like a real product manual instead of a loose marketing page.",
    backHref: "/products/archductor",
    backLabel: "Back to Archductor",
    pages: [
      {
        slug: [],
        title: "Overview",
        description: "What Archductor is and why the workflow exists.",
        file: "overview.md",
      },
      {
        slug: ["workflow"],
        title: "Workflow",
        description: "How repositories, workspaces, and sessions fit together.",
        file: "workflow.md",
      },
      {
        slug: ["project-setup"],
        title: "Project setup",
        description: "Shared settings, prompts, scripts, and repo defaults.",
        file: "project-setup.md",
      },
      {
        slug: ["install"],
        title: "Install",
        description: "Install channels and source build steps.",
        file: "install.md",
      },
      {
        slug: ["release-readiness"],
        title: "Release readiness",
        description: "Review flow, verification, and known limits.",
        file: "release-readiness.md",
      },
    ],
  },
];

export function getDocsProducts() {
  return products;
}

export function getDocsProduct(productSlug: string) {
  return products.find((product) => product.slug === productSlug);
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

type ParsedBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
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
