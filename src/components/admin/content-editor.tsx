"use client";

import { Check, LoaderCircle, Save } from "lucide-react";
import { useState } from "react";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { SiteContent } from "@/lib/content";

type Status = "idle" | "dirty" | "saving" | "saved" | "error";

export function ContentEditor({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<Status>("idle");

  function update(next: SiteContent) {
    setContent(next);
    setStatus("dirty");
  }

  async function save() {
    try {
      setStatus("saving");
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error("Save failed");
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 2400);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="admin-editor">
      <div className="admin-editor__section">
        <div>
          <p className="ui-label">Home</p>
          <h2>Hero message</h2>
          <p>The first statement visitors see. Keep it concise and specific.</p>
        </div>
        <div className="admin-fields">
          <label><span>Eyebrow</span><input value={content.hero.kicker} onChange={(event) => update({ ...content, hero: { ...content.hero, kicker: event.target.value } })} /></label>
          <label><span>Name</span><input value={content.hero.title} onChange={(event) => update({ ...content, hero: { ...content.hero, title: event.target.value } })} /></label>
          <label><span>Search and sharing summary</span><textarea rows={4} value={content.hero.lead} onChange={(event) => update({ ...content, hero: { ...content.hero, lead: event.target.value } })} /></label>
          <ImageUploadField label="Hero image" value={content.hero.image} onChange={(image) => update({ ...content, hero: { ...content.hero, image } })} />
          <label><span>Image description</span><input value={content.hero.imageAlt} onChange={(event) => update({ ...content, hero: { ...content.hero, imageAlt: event.target.value } })} /></label>
        </div>
      </div>

      <div className="admin-editor__section">
        <div>
          <p className="ui-label">Profile</p>
          <h2>Saved positioning</h2>
          <p>Keep a concise profile on hand for future page and pitch-kit use.</p>
        </div>
        <div className="admin-fields">
          <label><span>Heading</span><input value={content.about.title} onChange={(event) => update({ ...content, about: { ...content.about, title: event.target.value } })} /></label>
          <label><span>Introduction</span><textarea rows={4} value={content.about.intro} onChange={(event) => update({ ...content, about: { ...content.about, intro: event.target.value } })} /></label>
          <label><span>Full story</span><textarea rows={7} value={content.about.story} onChange={(event) => update({ ...content, about: { ...content.about, story: event.target.value } })} /></label>
        </div>
      </div>

      <div className="admin-editor__section">
        <div>
          <p className="ui-label">Contact</p>
          <h2>Inquiry invitation</h2>
        </div>
        <div className="admin-fields">
          <label><span>Heading</span><input value={content.contact.title} onChange={(event) => update({ ...content, contact: { ...content.contact, title: event.target.value } })} /></label>
          <label><span>Introduction</span><textarea rows={4} value={content.contact.intro} onChange={(event) => update({ ...content, contact: { ...content.contact, intro: event.target.value } })} /></label>
          <label><span>Public email</span><input type="email" value={content.contact.email} onChange={(event) => update({ ...content, contact: { ...content.contact, email: event.target.value } })} /></label>
        </div>
      </div>

      <div className="admin-savebar">
        <p>{status === "error" ? "Content storage is not available. Check Blob configuration." : status === "dirty" ? "You have unpublished changes." : "Published changes appear across the site immediately."}</p>
        <button className="button button--dark" onClick={save} disabled={status === "saving" || status === "idle" || status === "saved"}>
          {status === "saving" ? <LoaderCircle className="spin" size={17} /> : status === "saved" ? <Check size={17} /> : <Save size={17} />}
          {status === "saving" ? "Saving" : status === "saved" ? "Saved" : "Publish changes"}
        </button>
      </div>
    </div>
  );
}
