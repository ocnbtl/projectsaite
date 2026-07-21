import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const adminCookieName = "saite_admin_session";

function hasValidAdminToken(token: string | undefined) {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!process.env.ADMIN_PASSWORD || secret.length < 32 || !token) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  const expected = createHmac("sha256", secret).update(encoded).digest("base64url");
  const suppliedSignature = Buffer.from(signature);
  const expectedSignature = Buffer.from(expected);
  if (
    suppliedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as {
      exp?: number;
      role?: string;
    };
    return payload.role === "admin" && typeof payload.exp === "number" && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(adminCookieName)?.value;
  if (!hasValidAdminToken(token)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
