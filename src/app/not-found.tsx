import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div>
        <Link className="not-found__brand" href="/">Sage Burress</Link>
        <p>404 · Page not found</p>
        <h1>This page is not part of the portfolio.</h1>
        <Link className="not-found__return" href="/">Return home</Link>
      </div>
    </main>
  );
}
