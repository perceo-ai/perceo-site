import Link from "next/link";

export default function DocsTopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-5 md:px-8">
        <Link href="/docs" className="text-sm font-semibold text-zinc-950">
          Perceo Docs
        </Link>

        <button
          type="button"
          className="flex h-10 min-w-0 flex-1 items-center justify-between rounded-[8px] border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 transition hover:border-zinc-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300 md:max-w-md"
        >
          <span>Search documentation</span>
          <kbd className="ml-3 hidden rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-400 md:inline">
            ⌘K
          </kbd>
        </button>

        <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-500 md:flex">
          <Link href="/products" className="transition hover:text-zinc-950">
            Products
          </Link>
          <Link href="/" className="transition hover:text-zinc-950">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
