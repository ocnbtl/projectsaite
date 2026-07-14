import Link from "next/link";

import { Wordmark } from "@/components/site/wordmark";

export default function NotFound() {
  return (
    <main className="not-found">
      <div>
        <p className="ui-label">404 · Page not found</p>
        <Wordmark />
        <h1>This page wandered off set.</h1>
        <Link className="button button--light" href="/">Return home</Link>
      </div>
    </main>
  );
}
