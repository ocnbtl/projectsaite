import { NextRequest, NextResponse } from "next/server";

import { contactSchema, deliverContactMessage } from "@/lib/contact";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) return NextResponse.json({ code: "rate_limited" }, { status: 429 });

  try {
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ code: "invalid_form" }, { status: 400 });

    if (parsed.data.website) return NextResponse.json({ ok: true });
    const delivery = await deliverContactMessage(parsed.data);
    if (!delivery.configured) {
      return NextResponse.json({ code: "delivery_not_configured" }, { status: 503 });
    }
    return NextResponse.json({ ok: true, id: delivery.id });
  } catch (error) {
    console.error("Contact delivery failed", error);
    return NextResponse.json({ code: "delivery_failed" }, { status: 500 });
  }
}
