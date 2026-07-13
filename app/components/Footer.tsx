import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-[15] border-t border-white/5 mt-20">
      {/* CTA */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-12.5 py-16 md:py-24 text-center">
        <h2 className="font-serif italic text-3xl md:text-5xl font-bold text-white mb-4">
          Build with memory, execution, and verification.
        </h2>
        <p className="text-zinc-400 text-lg max-w-lg mx-auto mb-8">
          Perceo is the stack for teams that want AI agents to use real context, produce reviewable work, and prove behavior before release.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/docs"
            className="rounded-[5px] px-[20px] py-[10px] text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            Read Docs
          </Link>
          <Link
            href="/products"
            className="rounded-[5px] bg-gradient-to-b from-[#8b5cf6] to-[#7848e6] px-[20px] py-[10px] text-sm font-semibold text-white transition-colors hover:from-[#7c3aed] hover:to-[#6d28d9]"
          >
            View Suite
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12.5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold font-serif text-white tracking-tight">
            Perceo
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm">
              Home
            </Link>
            <Link href="/products/archductor" className="text-zinc-500 hover:text-white transition-colors text-sm">
              Products
            </Link>
            <Link href="/docs" className="text-zinc-500 hover:text-white transition-colors text-sm">
              Docs
            </Link>
            <a href="https://github.com/pranavkannepalli/conductor-arch" className="text-zinc-500 hover:text-white transition-colors text-sm">
              GitHub
            </a>
          </nav>

          <span className="text-zinc-600 text-xs">
            &copy; {new Date().getFullYear()} Perceo. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
