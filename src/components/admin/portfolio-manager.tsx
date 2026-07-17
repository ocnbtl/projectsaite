"use client";

import { Check, ChevronDown, ChevronUp, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

import type { Project, SiteContent } from "@/lib/content";

export function PortfolioManager({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [open, setOpen] = useState(content.projects[0]?.slug ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update(index: number, field: keyof Project, value: string | boolean) {
    const projects = [...content.projects];
    projects[index] = { ...projects[index], [field]: value };
    setContent({ ...content, projects });
  }

  function addProject() {
    const project: Project = {
      slug: `new-project-${content.projects.length + 1}`,
      title: "New project",
      category: "Content Creation",
      year: String(new Date().getFullYear()),
      location: "",
      summary: "Add a concise project summary.",
      story: "Add the story, brief, and outcome.",
      image: "/media/sage/v1/sage-001.webp",
      alt: "Project image",
      tags: ["Campaign"],
      featured: false,
    };
    setContent({ ...content, projects: [...content.projects, project] });
    setOpen(project.slug);
  }

  async function save() {
    setStatus("saving");
    const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    setStatus(response.ok ? "saved" : "error");
    if (response.ok) window.setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="portfolio-manager">
      <div className="portfolio-manager__toolbar">
        <p>{content.projects.length} projects</p>
        <button type="button" className="button button--outline" onClick={addProject}><Plus size={17} />Add project</button>
      </div>

      {content.projects.map((project, index) => (
        <section className="project-editor" key={`${project.slug}-${index}`}>
          <button className="project-editor__summary" type="button" onClick={() => setOpen(open === project.slug ? "" : project.slug)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{project.title}</strong>
            <small>{project.category}</small>
            {open === project.slug ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {open === project.slug && (
            <div className="project-editor__body">
              <div className="admin-fields admin-fields--two">
                <label><span>Title</span><input value={project.title} onChange={(e) => update(index, "title", e.target.value)} /></label>
                <label><span>URL slug</span><input value={project.slug} onChange={(e) => update(index, "slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} /></label>
                <label><span>Category</span><input value={project.category} onChange={(e) => update(index, "category", e.target.value)} /></label>
                <label><span>Location</span><input value={project.location} onChange={(e) => update(index, "location", e.target.value)} /></label>
                <label className="admin-fields__wide"><span>Summary</span><textarea rows={3} value={project.summary} onChange={(e) => update(index, "summary", e.target.value)} /></label>
                <label className="admin-fields__wide"><span>Project story</span><textarea rows={5} value={project.story} onChange={(e) => update(index, "story", e.target.value)} /></label>
                <label className="admin-fields__wide"><span>Image URL</span><input value={project.image} onChange={(e) => update(index, "image", e.target.value)} /></label>
                <label className="admin-checkbox"><input type="checkbox" checked={project.featured} onChange={(e) => update(index, "featured", e.target.checked)} /><span>Feature this project on the home page</span></label>
              </div>
              <button className="project-editor__delete" type="button" onClick={() => setContent({ ...content, projects: content.projects.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={16} />Remove project</button>
            </div>
          )}
        </section>
      ))}

      <div className="admin-savebar">
        <p>{status === "error" ? "Unable to save. Check Blob storage configuration." : "Projects appear in this order on the portfolio page."}</p>
        <button className="button button--dark" onClick={save} disabled={status === "saving"}>
          {status === "saving" ? <LoaderCircle className="spin" size={17} /> : status === "saved" ? <Check size={17} /> : <Save size={17} />}
          {status === "saving" ? "Saving" : status === "saved" ? "Saved" : "Publish portfolio"}
        </button>
      </div>
    </div>
  );
}
