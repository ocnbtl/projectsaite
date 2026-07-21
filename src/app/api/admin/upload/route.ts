import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { hasAdminSession } from "@/lib/auth";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ code: "unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ code: "storage_not_configured" }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ code: "missing_file" }, { status: 400 });
  }
  if (!allowedTypes.has(file.type) || file.size < 1 || file.size > maxFileSize) {
    return NextResponse.json({ code: "invalid_file" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isWebp =
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if ((file.type === "image/jpeg" && !isJpeg) || (file.type === "image/png" && !isPng) || (file.type === "image/webp" && !isWebp)) {
    return NextResponse.json({ code: "invalid_file" }, { status: 400 });
  }

  const safeStem = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "image";
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const result = await put(`project-saite/site-media/${safeStem}.${extension}`, new Blob([buffer], { type: file.type }), {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: result.url });
}
