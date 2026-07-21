"use client";

import { Check, ExternalLink, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { Service, ServiceImage, SiteContent } from "@/lib/content";

type Status = "idle" | "dirty" | "saving" | "saved" | "error";

export function ServiceManager({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [selected, setSelected] = useState(initialContent.services[0]?.slug ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const serviceIndex = content.services.findIndex((service) => service.slug === selected);
  const service = content.services[serviceIndex];

  function setServices(services: Service[]) {
    setContent({ ...content, services });
    setStatus("dirty");
  }

  function updateService(next: Service) {
    const services = [...content.services];
    services[serviceIndex] = next;
    setServices(services);
  }

  function updateImage(index: number, next: ServiceImage) {
    if (!service) return;
    const images = [...service.images];
    images[index] = next;
    updateService({ ...service, images });
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

  if (!service) return null;

  return (
    <div className="service-manager">
      <nav className="service-manager__tabs" aria-label="Choose a service to edit">
        {content.services.map((item) => (
          <button
            className={item.slug === selected ? "is-active" : undefined}
            key={item.slug}
            type="button"
            onClick={() => setSelected(item.slug)}
          >
            <span>{item.number}</span>{item.title}
          </button>
        ))}
      </nav>

      <section className="service-manager__editor">
        <header>
          <div><p className="ui-label">Service page</p><h2>{service.title}</h2></div>
          <Link href={`/services/${service.slug}`} target="_blank">Preview page <ExternalLink size={16} /></Link>
        </header>

        <div className="admin-fields admin-fields--two">
          <label><span>Service name</span><input value={service.title} onChange={(event) => updateService({ ...service, title: event.target.value, shortTitle: event.target.value })} /></label>
          <label><span>Home-page summary</span><input value={service.summary} onChange={(event) => updateService({ ...service, summary: event.target.value })} /></label>
          <label className="admin-fields__wide"><span>Service description</span><textarea rows={5} value={service.description} onChange={(event) => updateService({ ...service, description: event.target.value })} /></label>
          <label className="admin-fields__wide"><span>What I offer, one item per line</span><textarea rows={5} value={service.deliverables.join("\n")} onChange={(event) => updateService({ ...service, deliverables: event.target.value.split("\n").filter(Boolean) })} /></label>
        </div>

        <div className="service-manager__media-heading">
          <div><p className="ui-label">Page gallery</p><h3>Images and future slots</h3></div>
          <button type="button" className="button button--outline" onClick={() => updateService({ ...service, images: [...service.images, { id: `${service.slug}-${Date.now()}`, src: "", alt: "", placeholder: true }] })}>
            <Plus size={16} />Add image slot
          </button>
        </div>

        <div className="service-manager__media-grid">
          {service.images.map((image, index) => (
            <article key={image.id}>
              <ImageUploadField label={`Image ${String(index + 1).padStart(2, "0")}`} value={image.src} onChange={(src) => updateImage(index, { ...image, src, placeholder: !src })} />
              <label><span>Image description</span><input value={image.alt} onChange={(event) => updateImage(index, { ...image, alt: event.target.value })} /></label>
              <label className="admin-checkbox"><input type="checkbox" checked={image.placeholder} onChange={(event) => updateImage(index, { ...image, placeholder: event.target.checked })} /><span>Show as a future image slot</span></label>
              <button className="project-editor__delete" type="button" onClick={() => updateService({ ...service, images: service.images.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={15} />Remove slot</button>
            </article>
          ))}
        </div>
      </section>

      <div className="admin-savebar">
        <p>{status === "error" ? "Unable to publish. Check Blob storage configuration." : status === "dirty" ? "You have unpublished service changes." : "Service copy and images publish together."}</p>
        <button className="button button--dark" onClick={save} disabled={status === "saving" || status === "idle" || status === "saved"}>
          {status === "saving" ? <LoaderCircle className="spin" size={17} /> : status === "saved" ? <Check size={17} /> : <Save size={17} />}
          {status === "saving" ? "Saving" : status === "saved" ? "Saved" : "Publish services"}
        </button>
      </div>
    </div>
  );
}
