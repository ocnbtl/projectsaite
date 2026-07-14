import { Wordmark } from "@/components/site/wordmark";

const colors = [
  ["Cocoa", "#3A322B"], ["Olive", "#6F7A5A"], ["Sage", "#9AA581"], ["Clay", "#C08552"],
  ["Bronze", "#B8895E"], ["Blush", "#E3C2B4"], ["Cream", "#F6F1E7"], ["Paper", "#FBF8F1"],
];

export default function AdminStyleGuidePage() {
  return (
    <div className="admin-page style-guide">
      <header className="admin-page__heading"><div><p className="ui-label">Brand system</p><h1>Warm, observant, and quietly assured.</h1><p>A practical reference for keeping every expression of Sage&apos;s work cohesive.</p></div></header>
      <section className="style-guide__wordmark">
        <div className="style-guide__wordmark-dark"><Wordmark /></div>
        <div className="style-guide__wordmark-light"><Wordmark /></div>
        <div><p className="ui-label">Wordmark</p><h2>The name is the identity.</h2><p>Use the stacked serif wordmark as the primary brand signature. Give it open space and never pair it with decorative botanical marks.</p></div>
      </section>
      <section className="style-guide__section">
        <div><p className="ui-label">Color</p><h2>Earthy without becoming muted.</h2></div>
        <div className="swatch-grid">{colors.map(([name, hex]) => <div key={name}><span style={{ backgroundColor: hex }} /><strong>{name}</strong><small>{hex}</small></div>)}</div>
      </section>
      <section className="style-guide__type">
        <div><p className="ui-label">Display · Cormorant Garamond</p><h2>Stories shaped by people and place.</h2></div>
        <div><p className="ui-label">Interface · Hanken Grotesk</p><h3>Clear enough for business. Warm enough to feel personal.</h3><p>Use the sans serif for navigation, paragraphs, labels, buttons, and operational interfaces.</p></div>
      </section>
      <section className="style-guide__voice">
        <div><p className="ui-label">Voice</p><h2>Specific, human, and composed.</h2></div>
        <div><p><strong>Do:</strong> speak directly, name useful details, and make collaboration feel easy to understand.</p><p><strong>Avoid:</strong> inflated claims, trend language, generic luxury phrasing, and copy that feels like a corporate agency.</p></div>
      </section>
    </div>
  );
}
