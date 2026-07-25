import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { hasAdminSession, isAdminConfigured } from "@/lib/auth";

export const metadata = { title: "Owner Login" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");
  return (
    <main className="admin-login admin-login--minimal">
      <section className="admin-login__panel admin-login__panel--minimal" aria-label="Admin login">
        <div>
          <LoginForm configured={isAdminConfigured()} />
        </div>
      </section>
    </main>
  );
}
