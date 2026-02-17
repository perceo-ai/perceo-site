"use client";

import { useState, useEffect } from "react";
import { List, X } from "@phosphor-icons/react";
import Button from "./Button";

export default function Navbar() {
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
          <div className="text-xl md:text-2xl font-bold font-serif text-white tracking-tight">
            Perceo
          </div>

          {/* Desktop Nav - absolutely centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="secondary" className="hidden md:block">
              Watch Demo
            </Button>
            <Button variant="primary">
              Contact Sales
            </Button>
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
          <div className="text-xl font-bold font-serif text-white tracking-tight">
            Perceo
          </div>
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
          <a
            href="#"
            className="text-white text-2xl font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#"
            className="text-white text-2xl font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </a>
        </nav>

        {/* Watch Demo at bottom of list */}
        <div className="mt-auto pb-12">
          <Button variant="secondary" className="w-full" onClick={() => setMenuOpen(false)}>
            Watch Demo
          </Button>
        </div>
      </div>
    </>
  );
}
