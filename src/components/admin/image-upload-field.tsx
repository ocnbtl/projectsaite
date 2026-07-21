"use client";

import { ImageUp, LoaderCircle } from "lucide-react";
import { useId, useState } from "react";

async function prepareForWeb(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image preparation is unavailable in this browser.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => result ? resolve(result) : reject(new Error("Image preparation failed.")),
      "image/webp",
      0.9,
    );
  });
  const stem = file.name.replace(/\.[^.]+$/, "") || "site-image";
  return new File([blob], `${stem}.webp`, { type: "image/webp" });
}

export function ImageUploadField({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "preparing" | "uploading" | "error">("idle");

  async function upload(file: File) {
    try {
      setStatus("preparing");
      const prepared = await prepareForWeb(file);
      setStatus("uploading");
      const formData = new FormData();
      formData.append("file", prepared);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Upload failed");
      const result = (await response.json()) as { url: string };
      onChange(result.url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="admin-image-field">
      <label htmlFor={`${id}-url`}><span>{label}</span></label>
      {value ? (
        <div className="admin-image-field__preview" style={{ backgroundImage: `url(${JSON.stringify(value)})` }} role="img" aria-label={`${label} preview`} />
      ) : (
        <div className="admin-image-field__preview is-empty"><span>No image selected</span></div>
      )}
      <div className="admin-image-field__controls">
        <input id={`${id}-url`} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Image URL or site path" />
        <label className="admin-upload-button" htmlFor={`${id}-file`}>
          {status === "preparing" || status === "uploading" ? <LoaderCircle className="spin" size={16} /> : <ImageUp size={16} />}
          {status === "preparing" ? "Preparing" : status === "uploading" ? "Uploading" : "Upload image"}
        </label>
        <input
          className="admin-visually-hidden"
          id={`${id}-file`}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />
      </div>
      <p className={`admin-field-note${status === "error" ? " is-error" : ""}`} aria-live="polite">
        {status === "error" ? "Upload failed. Try a JPG, PNG, or WebP under 10 MB." : "Uploads are resized for the web and saved without the original photo metadata."}
      </p>
    </div>
  );
}
