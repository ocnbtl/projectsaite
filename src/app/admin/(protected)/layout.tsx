import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { hasAdminSession } from "@/lib/auth";

export const metadata = { title: "Owner Studio" };

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  if (!(await hasAdminSession())) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
