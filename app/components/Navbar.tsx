"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { siteConfig } from "@/lib/site-config";

export default function Navbar() {
  const { site } = siteConfig;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed left-0 right-0 z-20 px-5 md:px-12.5 py-5 transition-[background-color,backdrop-filter] duration-300 max-w-[1920px] mx-auto"
        style={
          scrolled
            ? {
              background: "rgba(49, 47, 47, 0.7)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }
            : {
              background: "transparent",
            }
        }
      >
        <div className="flex items-center justify-between md:relative">
          <Link href="/" className="text-xl md:text-2xl font-bold font-serif text-white tracking-tight">
            {site.name}
          </Link>

          {/* Desktop Nav - absolutely centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {site.nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={site.nav.secondaryCta.href}
              className="hidden rounded-[5px] px-[20px] py-[10px] text-sm font-semibold text-white transition-colors hover:bg-white/[0.08] md:block"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              {site.nav.secondaryCta.label}
            </Link>
            <Link
              href={site.nav.primaryCta.href}
              className="rounded-[5px] bg-gradient-to-b from-[#8b5cf6] to-[#7848e6] px-[20px] py-[10px] text-sm font-semibold text-white transition-colors hover:from-[#7c3aed] hover:to-[#6d28d9]"
            >
              {site.nav.primaryCta.label}
            </Link>
            <button
              className="md:hidden text-white p-1"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <List size={28} weight="bold" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      {/* Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sheet */}
      <div
        className={`md:hidden fixed inset-0 z-50 flex flex-col px-6 py-5 transition-transform duration-300 ease-out ${menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        style={{
          background: "rgba(30, 28, 28, 0.65)",
          WebkitBackdropFilter: "blur(24px)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Sheet Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif text-white tracking-tight">
            {site.name}
          </Link>
          <button
            className="text-white p-1"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} weight="bold" />
          </button>
        </div>

        {/* Sheet Links */}
        <nav className="flex flex-col gap-6 mt-12">
          {site.nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-2xl font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile CTA at bottom of list */}
        <div className="mt-auto pb-12">
          <Link
            href={site.nav.secondaryCta.href}
            className="block w-full rounded-[5px] px-[20px] py-[12px] text-center text-sm font-semibold text-white"
            onClick={() => setMenuOpen(false)}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {site.nav.secondaryCta.label}
          </Link>
        </div>
      </div>
    </>
  );
}
