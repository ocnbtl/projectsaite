import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "light" | "dark" | "outline" | "clay";
  external?: boolean;
};

export function ButtonLink({ href, children, variant = "dark", external = false }: ButtonLinkProps) {
  const className = `button button--${variant}`;
  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight size={16} aria-hidden="true" />
    </>
  );

  return external ? (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <Link className={className} href={href}>
      {content}
    </Link>
  );
}
