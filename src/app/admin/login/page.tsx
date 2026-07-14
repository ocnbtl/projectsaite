import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { Wordmark } from "@/components/site/wordmark";
import { hasAdminSession, isAdminConfigured } from "@/lib/auth";

export const metadata = { title: "Owner Login" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");
  return (
    <main className="admin-login">
      <section className="admin-login__brand">
        <Wordmark />
        <p>Private studio for content, portfolio, pitches, and performance.</p>
      </section>
      <section className="admin-login__panel">
        <div>
          <p className="ui-label">Owner access</p>
          <h1>Welcome back.</h1>
          <p>Sign in to manage the Sage Burress website.</p>
          <LoginForm configured={isAdminConfigured()} />
        </div>
      </section>
    </main>
  );
}
