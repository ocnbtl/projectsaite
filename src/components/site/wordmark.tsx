import Link from "next/link";

type WordmarkProps = {
  compact?: boolean;
  className?: string;
  linked?: boolean;
};

export function Wordmark({ compact = false, className = "", linked = false }: WordmarkProps) {
  const mark = (
    <span className={`wordmark ${compact ? "wordmark--compact" : ""} ${className}`.trim()} aria-label="Sage Burress">
      <span>Sage</span>
      <span>Burress</span>
    </span>
  );

  return linked ? (
    <Link href="/" className="wordmark-link" aria-label="Sage Burress home">
      {mark}
    </Link>
  ) : (
    mark
  );
}
