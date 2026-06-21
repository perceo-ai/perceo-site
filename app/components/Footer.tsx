import Link from "next/link";
import Button from "./Button";

export default function Footer() {
  return (
    <footer className="relative z-[15] border-t border-white/5 mt-20">
      {/* CTA */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-12.5 py-16 md:py-24 text-center">
        <h2 className="font-serif italic text-3xl md:text-5xl font-bold text-white mb-4">
          Ready to run agents in parallel?
        </h2>
        <p className="text-zinc-400 text-lg max-w-lg mx-auto mb-8">
          Start isolated Git worktree workspaces, review the diff, and merge when ready.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary">Read Docs</Button>
          <Button variant="primary">Download</Button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12.5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold font-serif text-white tracking-tight">
            Archductor
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm">
              Home
            </Link>
            <a href="/products/archductor" className="text-zinc-500 hover:text-white transition-colors text-sm">
              Archductor
            </a>
            <a href="/docs" className="text-zinc-500 hover:text-white transition-colors text-sm">
              Docs
            </a>
            <a href="https://github.com/pranavkannepalli/conductor-arch" className="text-zinc-500 hover:text-white transition-colors text-sm">
              GitHub
            </a>
          </nav>

          <span className="text-zinc-600 text-xs">
            &copy; {new Date().getFullYear()} Archductor. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
