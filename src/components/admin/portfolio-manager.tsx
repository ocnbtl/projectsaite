"use client";

import { Check, ChevronDown, ChevronUp, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

import { getAvailableProjectSlug, normalizeSiteContentForSave, type ContentEditingState, type Project, type SiteContent } from "@/lib/content";
import { getContentSaveError } from "@/lib/content-save-error";

type PortfolioManagerProps = {
  initialContent: SiteContent;
  editingState: ContentEditingState;
};

export function PortfolioManager({ initialContent, editingState }: PortfolioManagerProps) {
  const [content, setContent] = useState(initialContent);
  const [open, setOpen] = useState(content.projects[0]?.slug ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update(index: number, field: keyof Project, value: string | boolean) {
    const projects = [...content.projects];
    projects[index] = { ...projects[index], [field]: value };
    setContent({ ...content, projects });
  }

  function addProject() {
    const project: Project = {
      slug: getAvailableProjectSlug(content.projects),
      title: "New project",
      category: "Content Creation",
      year: String(new Date().getFullYear()),
      location: "",
      summary: "Add a concise project summary.",
      story: "Add the story, brief, and outcome.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=88",
      alt: "Project image",
      tags: ["Campaign"],
      featured: false,
    };
    setContent({ ...content, projects: [...content.projects, project] });
    setOpen(project.slug);
  }

  async function save() {
    if (!editingState.canSave) return;

    const payload = normalizeSiteContentForSave(content);
    setStatus("saving");
    setErrorMessage("");
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) {
        setErrorMessage(await getContentSaveError(response));
        setStatus("error");
        return;
      }

      setContent(payload);
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setErrorMessage("Unable to connect. Your edits remain here; check the connection and retry.");
      setStatus("error");
    }
  }

  const statusMessage = status === "error"
    ? errorMessage
    : status === "saving"
      ? "Validating and publishing the portfolio…"
      : status === "saved"
        ? "Portfolio published successfully."
        : editingState.message;

  return (
    <div className="portfolio-manager">
      <div className="portfolio-manager__toolbar">
        <p>{content.projects.length} projects</p>
        <button type="button" className="button button--outline" onClick={addProject} disabled={!editingState.canSave}><Plus size={17} />Add project</button>
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
              <fieldset className="admin-fields admin-fields--two" disabled={!editingState.canSave} aria-label={`${project.title} fields`}>
                <label><span>Title</span><input value={project.title} onChange={(e) => update(index, "title", e.target.value)} /></label>
                <label><span>URL slug</span><input value={project.slug} onChange={(e) => update(index, "slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} /></label>
                <label><span>Category</span><input value={project.category} onChange={(e) => update(index, "category", e.target.value)} /></label>
                <label><span>Location</span><input value={project.location} onChange={(e) => update(index, "location", e.target.value)} /></label>
                <label className="admin-fields__wide"><span>Summary</span><textarea rows={3} value={project.summary} onChange={(e) => update(index, "summary", e.target.value)} /></label>
                <label className="admin-fields__wide"><span>Project story</span><textarea rows={5} value={project.story} onChange={(e) => update(index, "story", e.target.value)} /></label>
                <label className="admin-fields__wide"><span>Image URL</span><input value={project.image} onChange={(e) => update(index, "image", e.target.value)} /></label>
                <label className="admin-checkbox"><input type="checkbox" checked={project.featured} onChange={(e) => update(index, "featured", e.target.checked)} /><span>Feature this project on the home page</span></label>
              </fieldset>
              <button className="project-editor__delete" type="button" disabled={!editingState.canSave} onClick={() => setContent({ ...content, projects: content.projects.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={16} />Remove project</button>
            </div>
          )}
        </section>
      ))}

      <div className="admin-savebar">
        <p role="status" aria-live="polite">{statusMessage}</p>
        <button type="button" className="button button--dark" onClick={save} disabled={!editingState.canSave || status === "saving"}>
          {status === "saving" ? <LoaderCircle className="spin" size={17} /> : status === "saved" ? <Check size={17} /> : <Save size={17} />}
          {status === "saving" ? "Saving" : status === "saved" ? "Saved" : editingState.canSave ? "Publish portfolio" : "Publishing unavailable"}
        </button>
      </div>
    </div>
  );
}
