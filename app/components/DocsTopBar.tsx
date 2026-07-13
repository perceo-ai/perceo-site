import Link from "next/link";

export default function DocsTopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#312F2F]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-5 md:px-8">
        <Link href="/docs" className="font-serif text-lg font-bold text-white">
          Perceo Docs
        </Link>

        <button
          type="button"
          className="flex h-10 min-w-0 flex-1 items-center justify-between rounded-[8px] border border-white/10 bg-white/[0.05] px-3 text-sm text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20 md:max-w-md"
        >
          <span>Search documentation</span>
          <kbd className="ml-3 hidden rounded border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-zinc-400 md:inline">
            ⌘K
          </kbd>
        </button>

        <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-500 md:flex">
          <Link href="/products" className="transition hover:text-white">
            Products
          </Link>
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
