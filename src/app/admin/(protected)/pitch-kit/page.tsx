import { PitchKitBuilder } from "@/components/admin/pitch-kit-builder";

export default function AdminPitchKitPage() {
  return <div className="admin-page admin-page--wide"><header className="admin-page__heading"><div><p className="ui-label">Pitch kit</p><h1>Build a clear, personal brand proposal.</h1><p>Choose a service, tailor the language, and export a presentation-ready PDF.</p></div></header><PitchKitBuilder /></div>;
}
