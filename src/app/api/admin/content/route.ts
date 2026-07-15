import { NextResponse } from "next/server";

import { hasAdminSession } from "@/lib/auth";
import {
  getContentEditingState,
  getSiteContent,
  getSiteContentSnapshot,
  isPersistentContentConfigured,
  saveSiteContent,
} from "@/lib/content-store";
import { siteContentSchema } from "@/lib/content-schema";

export async function GET() {
  if (!(await hasAdminSession())) return NextResponse.json({ code: "unauthorized" }, { status: 401 });
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ code: "unauthorized" }, { status: 401 });

  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return NextResponse.json({ code: "invalid_json" }, { status: 400 });
  }

  const parsed = siteContentSchema.safeParse(value);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((issue) => issue.path.join(".")).filter(Boolean))];
    return NextResponse.json({ code: "invalid_content", fields }, { status: 400 });
  }

  if (!isPersistentContentConfigured()) {
    return NextResponse.json({ code: "storage_not_configured" }, { status: 503 });
  }

  const snapshot = await getSiteContentSnapshot();
  if (!getContentEditingState(snapshot.source).canSave) {
    return NextResponse.json({ code: "content_write_blocked" }, { status: 409 });
  }

  try {
    await saveSiteContent(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ code: "content_save_failed" }, { status: 500 });
  }
}
