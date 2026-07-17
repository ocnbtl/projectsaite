"use client";

import { Download, FolderOpen, RotateCcw, Save } from "lucide-react";
import { useMemo, useState } from "react";

type Pitch = {
  service: string;
  brand: string;
  contactName: string;
  concept: string;
  audience: string;
  deliverables: string;
  fee: string;
  closing: string;
};

const templates: Record<string, Pick<Pitch, "concept" | "audience" | "deliverables" | "closing">> = {
  "Content Creation": {
    concept: "A warm, editorial content series that introduces the experience through a credible personal point of view.",
    audience: "Design-minded women interested in travel, style, beauty, and considered experiences.",
    deliverables: "1 short-form video, 1 photo carousel, 5 edited story frames, and 30-day organic usage.",
    closing: "I would love to shape the concept around your upcoming priorities and create work that feels natural to both audiences.",
  },
  Modeling: {
    concept: "A refined image series built around the campaign mood, product, and intended customer.",
    audience: "Your existing customer and a broader style-conscious audience.",
    deliverables: "Half-day shoot, agreed look count, and campaign usage to be scoped with the brief.",
    closing: "Please share the brief, usage, dates, and location so I can confirm availability and provide an exact quote.",
  },
  "Face Painting": {
    concept: "A polished, guest-friendly face painting experience tailored to the event theme and age range.",
    audience: "Event guests and families looking for a memorable interactive detail.",
    deliverables: "On-site service, custom design menu, professional materials, and event setup.",
    closing: "Please share the date, guest count, age range, and theme so I can recommend the right package.",
  },
  "Travel Collaborations": {
    concept: "A guest-perspective travel story focused on the details, atmosphere, and local moments that make the experience memorable.",
    audience: "Experience-led travelers looking for distinctive places and thoughtful recommendations.",
    deliverables: "Short-form travel content, edited photography, story coverage, and usage scoped to the brief.",
    closing: "I would be glad to align the travel dates and creative plan with your availability and current priorities.",
  },
};

const initialPitch: Pitch = {
  service: "Content Creation",
  brand: "Brand name",
  contactName: "Partnerships team",
  fee: "Available upon scope confirmation",
  ...templates["Content Creation"],
};

export function PitchKitBuilder() {
  const [pitch, setPitch] = useState<Pitch>(initialPitch);
  const [saved, setSaved] = useState(false);
  const date = useMemo(() => new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date()), []);

  function loadDraft() {
    const stored = window.localStorage.getItem("saite-pitch-kit");
    if (stored) {
      try { setPitch(JSON.parse(stored) as Pitch); } catch { /* Ignore malformed local drafts. */ }
    }
  }

  function setService(service: string) {
    setPitch({ ...pitch, service, ...templates[service] });
  }

  function saveDraft() {
    window.localStorage.setItem("saite-pitch-kit", JSON.stringify(pitch));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="pitch-builder">
      <div className="pitch-builder__controls">
        <div className="pitch-builder__toolbar">
          <button type="button" onClick={() => setPitch(initialPitch)} title="Reset draft"><RotateCcw size={17} /></button>
          <button type="button" onClick={loadDraft}><FolderOpen size={17} />Load draft</button>
          <button type="button" onClick={saveDraft}><Save size={17} />{saved ? "Saved" : "Save draft"}</button>
          <button type="button" onClick={() => window.print()}><Download size={17} />Print or PDF</button>
        </div>
        <div className="admin-fields">
          <label><span>Pitch type</span><select value={pitch.service} onChange={(event) => setService(event.target.value)}>{Object.keys(templates).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Brand or property</span><input value={pitch.brand} onChange={(event) => setPitch({ ...pitch, brand: event.target.value })} /></label>
          <label><span>Contact name</span><input value={pitch.contactName} onChange={(event) => setPitch({ ...pitch, contactName: event.target.value })} /></label>
          <label><span>Campaign idea</span><textarea rows={5} value={pitch.concept} onChange={(event) => setPitch({ ...pitch, concept: event.target.value })} /></label>
          <label><span>Audience</span><textarea rows={3} value={pitch.audience} onChange={(event) => setPitch({ ...pitch, audience: event.target.value })} /></label>
          <label><span>Deliverables</span><textarea rows={4} value={pitch.deliverables} onChange={(event) => setPitch({ ...pitch, deliverables: event.target.value })} /></label>
          <label><span>Fee or exchange</span><input value={pitch.fee} onChange={(event) => setPitch({ ...pitch, fee: event.target.value })} /></label>
          <label><span>Closing</span><textarea rows={4} value={pitch.closing} onChange={(event) => setPitch({ ...pitch, closing: event.target.value })} /></label>
        </div>
      </div>

      <div className="pitch-builder__preview-wrap">
        <article className="pitch-preview">
          <header>
            <div><strong>Sage</strong><strong>Burress</strong></div>
            <p>{pitch.service}<br />Partnership proposal</p>
          </header>
          <div className="pitch-preview__title">
            <p>{date}</p>
            <h1>{pitch.brand}</h1>
            <span>Prepared for {pitch.contactName}</span>
          </div>
          <section>
            <p className="ui-label">The opportunity</p>
            <h2>A thoughtful story, made to feel real.</h2>
            <p>{pitch.concept}</p>
          </section>
          <div className="pitch-preview__split">
            <section><p className="ui-label">Audience</p><p>{pitch.audience}</p></section>
            <section><p className="ui-label">Deliverables</p><p>{pitch.deliverables}</p></section>
          </div>
          <section className="pitch-preview__terms">
            <p className="ui-label">Investment</p>
            <p>{pitch.fee}</p>
          </section>
          <footer>
            <p>{pitch.closing}</p>
            <div><span>contact@sageburress.com</span><span>sageburress.com</span></div>
          </footer>
        </article>
      </div>
    </div>
  );
}
