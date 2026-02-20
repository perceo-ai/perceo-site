import Button from "./Button";

export default function Footer() {
  return (
    <footer className="relative z-[15] border-t border-white/5 mt-20">
      {/* CTA */}
      <div id="contact" className="max-w-[1400px] mx-auto px-5 md:px-12.5 py-16 md:py-24 text-center">
        <h2 className="font-serif italic text-3xl md:text-5xl font-bold text-white mb-4">
          Ready to ship with confidence?
        </h2>
        <p className="text-zinc-400 text-lg max-w-lg mx-auto mb-8">
          One command to know everything that could break — before your users do.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="#features"><Button variant="secondary">Watch Demo</Button></a>
          <a href="mailto:sales@perceo.ai"><Button variant="primary">Contact Sales</Button></a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12.5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold font-serif text-white tracking-tight">
            Perceo
          </div>

          <nav className="flex items-center gap-6">
            <a href="#hero" className="text-zinc-500 hover:text-white transition-colors text-sm">
              Home
            </a>
            <a href="#features" className="text-zinc-500 hover:text-white transition-colors text-sm">
              Pricing
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">
              Docs
            </a>
            <a href="https://github.com/perceo-ai" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors text-sm">
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
