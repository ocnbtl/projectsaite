import type { ReactNode } from "react";
import type { Metadata } from "next";

import "./admin.css";

export const metadata: Metadata = { robots: { index: false, follow: false }, alternates: { canonical: null } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
