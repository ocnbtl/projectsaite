"use client";

import { Check, ExternalLink, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { FeaturedBrand, SiteContent, SiteLink } from "@/lib/content";

type Status = "idle" | "dirty" | "saving" | "saved" | "error";

export function LinksManager({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<Status>("idle");

  function updateLinks(links: SiteLink[]) {
    setContent({ ...content, links });
    setStatus("dirty");
  }

  function updateBrands(featuredBrands: FeaturedBrand[]) {
    setContent({ ...content, featuredBrands });
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
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="admin-editor admin-editor--stacked">
      <section className="admin-editor__section admin-editor__section--stacked">
        <header className="admin-editor__section-heading">
          <div><p className="ui-label">Links page</p><h2>Storefronts and platforms</h2><p>Leave an item off until its destination is ready, then activate it.</p></div>
          <Link href="/links" target="_blank">Preview page <ExternalLink size={16} /></Link>
        </header>
        <div className="admin-repeat-list">
          {content.links.map((item, index) => (
            <article key={item.id}>
              <div className="admin-fields admin-fields--two">
                <label><span>Label</span><input value={item.label} onChange={(event) => updateLinks(content.links.map((link, itemIndex) => itemIndex === index ? { ...link, label: event.target.value } : link))} /></label>
                <label><span>Destination URL</span><input type="url" value={item.href} placeholder="https://" onChange={(event) => updateLinks(content.links.map((link, itemIndex) => itemIndex === index ? { ...link, href: event.target.value } : link))} /></label>
                <label className="admin-fields__wide"><span>Description</span><input value={item.description} onChange={(event) => updateLinks(content.links.map((link, itemIndex) => itemIndex === index ? { ...link, description: event.target.value } : link))} /></label>
                <label className="admin-checkbox"><input type="checkbox" checked={item.active} onChange={(event) => updateLinks(content.links.map((link, itemIndex) => itemIndex === index ? { ...link, active: event.target.checked } : link))} /><span>Show as an active link</span></label>
              </div>
              <button className="project-editor__delete" type="button" onClick={() => updateLinks(content.links.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15} />Remove link</button>
            </article>
          ))}
        </div>
        <button className="button button--outline admin-add-button" type="button" onClick={() => updateLinks([...content.links, { id: `link-${Date.now()}`, label: "New link", href: "", description: "", active: false }])}><Plus size={16} />Add link</button>
      </section>

      <section className="admin-editor__section admin-editor__section--stacked">
        <div className="admin-editor__section-heading"><div><p className="ui-label">Home-page logo rail</p><h2>Clients and collaborators</h2><p>Names stay visible when a logo is unavailable.</p></div></div>
        <div className="admin-repeat-list admin-repeat-list--brands">
          {content.featuredBrands.map((brand, index) => (
            <article key={brand.id}>
              <div className="admin-fields">
                <label><span>Brand name</span><input value={brand.name} onChange={(event) => updateBrands(content.featuredBrands.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} /></label>
                <ImageUploadField label="Logo image" value={brand.logo ?? ""} onChange={(logo) => updateBrands(content.featuredBrands.map((item, itemIndex) => itemIndex === index ? { ...item, logo } : item))} />
                <label className="admin-checkbox"><input type="checkbox" checked={Boolean(brand.invert)} onChange={(event) => updateBrands(content.featuredBrands.map((item, itemIndex) => itemIndex === index ? { ...item, invert: event.target.checked } : item))} /><span>Invert a light logo for the rail</span></label>
              </div>
              <button className="project-editor__delete" type="button" onClick={() => updateBrands(content.featuredBrands.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15} />Remove brand</button>
            </article>
          ))}
        </div>
        <button className="button button--outline admin-add-button" type="button" onClick={() => updateBrands([...content.featuredBrands, { id: `brand-${Date.now()}`, name: "New brand" }])}><Plus size={16} />Add brand</button>
      </section>

      <div className="admin-savebar">
        <p>{status === "error" ? "Unable to publish. Check Blob storage configuration." : status === "dirty" ? "You have unpublished link or brand changes." : "Links and the logo rail publish together."}</p>
        <button className="button button--dark" onClick={save} disabled={status === "saving" || status === "idle" || status === "saved"}>
          {status === "saving" ? <LoaderCircle className="spin" size={17} /> : status === "saved" ? <Check size={17} /> : <Save size={17} />}
          {status === "saving" ? "Saving" : status === "saved" ? "Saved" : "Publish links"}
        </button>
      </div>
    </div>
  );
}
