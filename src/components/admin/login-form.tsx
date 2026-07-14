"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!response.ok) {
      setError(response.status === 503 ? "Admin access has not been configured for this deployment." : "That password was not accepted.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="admin-login__form" onSubmit={submit}>
      <label>
        <span>Admin password</span>
        <input name="password" type="password" autoComplete="current-password" required disabled={!configured} />
      </label>
      <button className="button button--dark" type="submit" disabled={!configured || loading}>
        {loading ? <LoaderCircle className="spin" size={18} /> : <ArrowRight size={18} />}
        Enter studio
      </button>
      {error && <p role="alert">{error}</p>}
      {!configured && <p role="status">Add the admin environment variables in Vercel to enable sign-in.</p>}
    </form>
  );
}
