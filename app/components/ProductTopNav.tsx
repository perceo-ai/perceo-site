import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/#install", label: "Download" },
];

export default function ProductTopNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 mx-auto max-w-[1920px] px-5 py-5 backdrop-blur-xl md:px-12.5">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-white md:text-2xl">
          Archductor
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-400 md:gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-white ${item.label === "Download" ? "hidden sm:inline" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
