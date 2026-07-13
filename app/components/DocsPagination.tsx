import Link from "next/link";

type DocsNeighbor = {
  href: string;
  page: {
    title: string;
    description: string;
  };
} | null;

type DocsPaginationProps = {
  previous: DocsNeighbor;
  next: DocsNeighbor;
};

export default function DocsPagination({ previous, next }: DocsPaginationProps) {
  return (
    <nav className="mt-12 grid gap-3 border-t border-white/10 pt-6 md:grid-cols-2">
      {previous ? (
        <Link
          href={previous.href}
          className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Previous
          </span>
          <span className="mt-2 block text-sm font-semibold text-white">{previous.page.title}</span>
          <span className="mt-1 block text-sm leading-6 text-zinc-500">{previous.page.description}</span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.07] md:text-right"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Next
          </span>
          <span className="mt-2 block text-sm font-semibold text-white">{next.page.title}</span>
          <span className="mt-1 block text-sm leading-6 text-zinc-500">{next.page.description}</span>
        </Link>
      ) : null}
    </nav>
  );
}
