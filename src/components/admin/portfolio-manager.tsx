"use client";

import { Check, ChevronDown, ChevronUp, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { Project, SiteContent } from "@/lib/content";

export function PortfolioManager({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [open, setOpen] = useState(content.projects[0]?.slug ?? "");
  const [status, setStatus] = useState<"idle" | "dirty" | "saving" | "saved" | "error">("idle");

  function setProjects(projects: Project[]) {
    setContent({ ...content, projects });
    setStatus("dirty");
  }

  function update<K extends keyof Project>(index: number, field: K, value: Project[K]) {
    const projects = [...content.projects];
    projects[index] = { ...projects[index], [field]: value };
    setProjects(projects);
  }

  function move(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= content.projects.length) return;
    const projects = [...content.projects];
    [projects[index], projects[destination]] = [projects[destination], projects[index]];
    setProjects(projects);
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
    setProjects([...content.projects, project]);
    setOpen(project.slug);
  }

  async function save() {
    try {
      setStatus("saving");
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      if (!response.ok) throw new Error("Save failed");
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
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
              <div className="project-editor__order" aria-label={`Reorder ${project.title}`}>
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0}><ChevronUp size={16} />Move up</button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === content.projects.length - 1}><ChevronDown size={16} />Move down</button>
              </div>
              <div className="admin-fields admin-fields--two">
                <label><span>Title</span><input value={project.title} onChange={(e) => update(index, "title", e.target.value)} /></label>
                <label><span>URL slug</span><input value={project.slug} onChange={(e) => update(index, "slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} /></label>
                <label><span>Category</span><input value={project.category} onChange={(e) => update(index, "category", e.target.value)} /></label>
                <label><span>Year</span><input value={project.year} onChange={(e) => update(index, "year", e.target.value)} /></label>
                <label><span>Location</span><input value={project.location} onChange={(e) => update(index, "location", e.target.value)} /></label>
                <label><span>Tags, comma separated</span><input value={project.tags.join(", ")} onChange={(e) => update(index, "tags", e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))} /></label>
                <label className="admin-fields__wide"><span>Summary</span><textarea rows={3} value={project.summary} onChange={(e) => update(index, "summary", e.target.value)} /></label>
                <label className="admin-fields__wide"><span>Project story</span><textarea rows={5} value={project.story} onChange={(e) => update(index, "story", e.target.value)} /></label>
                <div className="admin-fields__wide"><ImageUploadField label="Project image" value={project.image} onChange={(image) => update(index, "image", image)} /></div>
                <label className="admin-fields__wide"><span>Image description</span><input value={project.alt} onChange={(e) => update(index, "alt", e.target.value)} /></label>
                <label className="admin-checkbox"><input type="checkbox" checked={project.featured} onChange={(e) => update(index, "featured", e.target.checked)} /><span>Feature this project on the home page</span></label>
              </div>
              <button className="project-editor__delete" type="button" onClick={() => { if (window.confirm(`Remove ${project.title} from the public portfolio?`)) setProjects(content.projects.filter((_, itemIndex) => itemIndex !== index)); }}><Trash2 size={16} />Remove project</button>
            </div>
          )}
        </section>
      ))}

      <div className="admin-savebar">
        <p>{status === "error" ? "Unable to save. Check Blob storage configuration." : status === "dirty" ? "You have unpublished portfolio changes." : "Projects appear in this order on the portfolio page."}</p>
        <button className="button button--dark" onClick={save} disabled={status === "saving" || status === "idle" || status === "saved"}>
          {status === "saving" ? <LoaderCircle className="spin" size={17} /> : status === "saved" ? <Check size={17} /> : <Save size={17} />}
          {status === "saving" ? "Saving" : status === "saved" ? "Saved" : "Publish portfolio"}
        </button>
      </div>
    </div>
  );
}
