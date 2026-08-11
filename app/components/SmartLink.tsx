import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type SmartLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  external?: boolean;
  children: ReactNode;
};

/**
 * Renders a plain anchor for off-site destinations (docs.perceo.ai, GitHub) and a
 * next/link for in-app routes, so prefetching never fires at an external host.
 */
export default function SmartLink({ href, external, children, ...rest }: SmartLinkProps) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
