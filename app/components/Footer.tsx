import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import SmartLink from "./SmartLink";

export default function Footer() {
  const { site } = siteConfig;

  return (
    <footer className="relative z-[15] border-t border-white/5 mt-20">
      {/* CTA */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-12.5 py-16 md:py-24 text-center">
        <h2 className="font-serif italic text-3xl md:text-5xl font-bold text-white mb-4">
          {site.footer.headline}
        </h2>
        <p className="text-zinc-400 text-lg max-w-lg mx-auto mb-8">
          {site.footer.description}
        </p>
        <div className="flex items-center justify-center gap-3">
          <SmartLink
            href={site.nav.secondaryCta.href}
            external={site.nav.secondaryCta.external}
            className="rounded-[5px] px-[20px] py-[10px] text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {site.nav.secondaryCta.label}
          </SmartLink>
          <Link
            href={site.nav.primaryCta.href}
            className="rounded-[5px] bg-gradient-to-b from-[#8b5cf6] to-[#7848e6] px-[20px] py-[10px] text-sm font-semibold text-white transition-colors hover:from-[#7c3aed] hover:to-[#6d28d9]"
          >
            {site.nav.primaryCta.label}
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12.5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold font-serif text-white tracking-tight">
            {site.name}
          </div>

          <nav className="flex items-center gap-6">
            {site.footer.links.map((link) => (
              <SmartLink
                key={link.href}
                href={link.href}
                external={link.external}
                className="text-zinc-500 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </SmartLink>
            ))}
          </nav>

          <span className="text-zinc-600 text-xs">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
