"use client";

import { Check, LoaderCircle, Save } from "lucide-react";
import { useState } from "react";

import { normalizeSiteContentForSave, type ContentEditingState, type Service, type SiteContent } from "@/lib/content";
import { getContentSaveError } from "@/lib/content-save-error";

type Status = "idle" | "saving" | "saved" | "error";
type SocialLink = SiteContent["social"][number];

type ContentEditorProps = {
  initialContent: SiteContent;
  editingState: ContentEditingState;
};

export function ContentEditor({ initialContent, editingState }: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function updateService(index: number, changes: Partial<Service>) {
    const services = [...content.services];
    services[index] = { ...services[index], ...changes };
    setContent({ ...content, services });
  }

  function updateSocial(index: number, changes: Partial<SocialLink>) {
    const social = [...content.social];
    social[index] = { ...social[index], ...changes };
    setContent({ ...content, social });
  }

  async function save() {
    if (!editingState.canSave) return;

    const payload = normalizeSiteContentForSave(content);
    setStatus("saving");
    setErrorMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setErrorMessage(await getContentSaveError(response));
        setStatus("error");
        return;
      }

      setContent(payload);
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 2400);
    } catch {
      setErrorMessage("Unable to connect. Your edits remain here; check the connection and retry.");
      setStatus("error");
    }
  }

  const statusMessage = status === "error"
    ? errorMessage
    : status === "saving"
      ? "Validating and publishing content…"
      : status === "saved"
        ? "Changes published successfully."
        : editingState.message;

  return (
    <div className="admin-editor">
      <div className="admin-editor__section">
        <div>
          <p className="ui-label">Home</p>
          <h2>Hero message</h2>
          <p>The first statement visitors see. Keep it concise and specific.</p>
        </div>
        <fieldset className="admin-fields" disabled={!editingState.canSave} aria-label="Hero content fields">
          <label><span>Eyebrow</span><input value={content.hero.kicker} onChange={(event) => setContent({ ...content, hero: { ...content.hero, kicker: event.target.value } })} /></label>
          <label><span>Lead</span><textarea rows={4} value={content.hero.lead} onChange={(event) => setContent({ ...content, hero: { ...content.hero, lead: event.target.value } })} /></label>
          <label><span>Hero image URL</span><input type="url" value={content.hero.image} onChange={(event) => setContent({ ...content, hero: { ...content.hero, image: event.target.value } })} /></label>
          <label><span>Image description</span><input value={content.hero.imageAlt} onChange={(event) => setContent({ ...content, hero: { ...content.hero, imageAlt: event.target.value } })} /></label>
        </fieldset>
      </div>

      <div className="admin-editor__section">
        <div>
          <p className="ui-label">About</p>
          <h2>Story and positioning</h2>
          <p>The short introduction appears early. The story and image support the full About page.</p>
        </div>
        <fieldset className="admin-fields" disabled={!editingState.canSave} aria-label="About content fields">
          <label><span>Heading</span><input value={content.about.title} onChange={(event) => setContent({ ...content, about: { ...content.about, title: event.target.value } })} /></label>
          <label><span>Introduction</span><textarea rows={4} value={content.about.intro} onChange={(event) => setContent({ ...content, about: { ...content.about, intro: event.target.value } })} /></label>
          <label><span>Full story</span><textarea rows={7} value={content.about.story} onChange={(event) => setContent({ ...content, about: { ...content.about, story: event.target.value } })} /></label>
          <label><span>About image URL</span><input type="url" value={content.about.image} onChange={(event) => setContent({ ...content, about: { ...content.about, image: event.target.value } })} /></label>
          <label><span>Image description</span><input value={content.about.imageAlt} onChange={(event) => setContent({ ...content, about: { ...content.about, imageAlt: event.target.value } })} /></label>
        </fieldset>
      </div>

      <div className="admin-editor__section">
        <div>
          <p className="ui-label">Services</p>
          <h2>Offer details</h2>
          <p>Edit the public copy and deliverables. Service order, links, and visual accents stay fixed to preserve the current page design.</p>
        </div>
        <div className="admin-collection">
          {content.services.map((service, index) => (
            <fieldset className="admin-collection__item" disabled={!editingState.canSave} key={service.slug}>
              <legend><span>{service.number}</span>{service.title}</legend>
              <div className="admin-fields">
                <label><span>Title</span><input value={service.title} onChange={(event) => updateService(index, { title: event.target.value })} /></label>
                <label><span>Short title</span><input value={service.shortTitle} onChange={(event) => updateService(index, { shortTitle: event.target.value })} /></label>
                <label><span>Summary</span><textarea rows={3} value={service.summary} onChange={(event) => updateService(index, { summary: event.target.value })} /></label>
                <label><span>Description</span><textarea rows={5} value={service.description} onChange={(event) => updateService(index, { description: event.target.value })} /></label>
                <label>
                  <span>Deliverables — one per line</span>
                  <textarea rows={5} value={service.deliverables.join("\n")} onChange={(event) => updateService(index, { deliverables: event.target.value.split("\n") })} />
                </label>
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="admin-editor__section">
        <div>
          <p className="ui-label">Social</p>
          <h2>Public links</h2>
          <p>These links appear on the dedicated Links page and in the site footer.</p>
        </div>
        <div className="admin-collection">
          {content.social.map((item, index) => (
            <fieldset className="admin-collection__item" disabled={!editingState.canSave} key={`${item.label}-${index}`}>
              <legend>{item.label}</legend>
              <div className="admin-fields">
                <label><span>Platform label</span><input value={item.label} onChange={(event) => updateSocial(index, { label: event.target.value })} /></label>
                <label><span>HTTPS profile URL</span><input type="url" value={item.href} onChange={(event) => updateSocial(index, { href: event.target.value })} /></label>
                <label><span>Public handle</span><input value={item.handle} onChange={(event) => updateSocial(index, { handle: event.target.value })} /></label>
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="admin-editor__section">
        <div>
          <p className="ui-label">Contact</p>
          <h2>Inquiry invitation</h2>
        </div>
        <fieldset className="admin-fields" disabled={!editingState.canSave} aria-label="Contact content fields">
          <label><span>Heading</span><input value={content.contact.title} onChange={(event) => setContent({ ...content, contact: { ...content.contact, title: event.target.value } })} /></label>
          <label><span>Introduction</span><textarea rows={4} value={content.contact.intro} onChange={(event) => setContent({ ...content, contact: { ...content.contact, intro: event.target.value } })} /></label>
          <label><span>Public email</span><input type="email" value={content.contact.email} onChange={(event) => setContent({ ...content, contact: { ...content.contact, email: event.target.value } })} /></label>
        </fieldset>
      </div>

      <div className="admin-savebar">
        <p role="status" aria-live="polite">{statusMessage}</p>
        <button type="button" className="button button--dark" onClick={save} disabled={!editingState.canSave || status === "saving"}>
          {status === "saving" ? <LoaderCircle className="spin" size={17} /> : status === "saved" ? <Check size={17} /> : <Save size={17} />}
          {status === "saving" ? "Saving" : status === "saved" ? "Saved" : editingState.canSave ? "Publish changes" : "Publishing unavailable"}
        </button>
      </div>
    </div>
  );
}
