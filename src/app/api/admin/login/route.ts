import { NextRequest, NextResponse } from "next/server";

import { createAdminSession, isAdminConfigured, passwordMatches } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) return NextResponse.json({ code: "not_configured" }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`admin:${ip}`, 8, 15 * 60 * 1000)) return NextResponse.json({ code: "rate_limited" }, { status: 429 });
  const body = (await request.json()) as { password?: unknown };
  if (typeof body.password !== "string" || !passwordMatches(body.password)) return NextResponse.json({ code: "invalid" }, { status: 401 });
  await createAdminSession();
  return NextResponse.json({ ok: true });
}
