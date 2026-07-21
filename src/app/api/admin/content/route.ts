import { NextResponse } from "next/server";

import { hasAdminSession } from "@/lib/auth";
import { getSiteContent, saveSiteContent } from "@/lib/content-store";
import { isSiteContent, normalizeSiteContent } from "@/lib/content";

export async function GET() {
  if (!(await hasAdminSession())) return NextResponse.json({ code: "unauthorized" }, { status: 401 });
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ code: "unauthorized" }, { status: 401 });
  const content: unknown = await request.json();
  if (!isSiteContent(content)) return NextResponse.json({ code: "invalid_content" }, { status: 400 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ code: "storage_not_configured" }, { status: 503 });
  await saveSiteContent(normalizeSiteContent(content));
  return NextResponse.json({ ok: true });
}
