import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/**
 * The Perceo lockup: the swarm mark clipped to a rounded square, followed by the
 * name in italic Playfair. Used in the navbar and footer so both stay in sync.
 */
export default function Wordmark({
  size = "md",
  href = "/",
}: {
  size?: "sm" | "md";
  href?: string | null;
}) {
  const mark = size === "sm" ? 22 : 26;

  const content = (
    <span className="flex items-center gap-2.5">
      <Image
        src="/perceo-mark.png"
        alt=""
        width={mark}
        height={mark}
        className="rounded-[6px]"
        priority={size === "md"}
      />
      <span
        className={`font-serif font-bold italic tracking-tight text-white ${
          size === "sm" ? "text-lg" : "text-xl md:text-2xl"
        }`}
      >
        {siteConfig.site.name}
      </span>
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} aria-label={siteConfig.site.name}>
      {content}
    </Link>
  );
}
