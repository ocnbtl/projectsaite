import { ArrowDownRight, Clock3, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/site/contact-form";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact",
  description: "Start a modeling, content, scouting, face painting, or hospitality collaboration with Sage Burress.",
};

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container contact-hero__grid">
          <div>
            <p className="ui-label">Start a conversation</p>
            <h1>{content.contact.title}</h1>
          </div>
          <div className="contact-hero__intro">
            <p>{content.contact.intro}</p>
            <ArrowDownRight size={34} strokeWidth={1.2} />
          </div>
        </div>
      </section>

      <section className="contact-workspace">
        <div className="container contact-workspace__grid">
          <aside className="contact-details">
            <p className="ui-label">Direct details</p>
            <a href={`mailto:${content.contact.email}`}><Mail size={18} />{content.contact.email}</a>
            <p><MapPin size={18} />Based in Ohio, available worldwide</p>
            <p><Clock3 size={18} />Replies within two business days</p>
            <div className="contact-details__note">
              <span>Helpful to include</span>
              <p>Dates, location, creative direction, usage, deliverables, and budget range.</p>
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
