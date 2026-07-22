import type { Metadata } from "next";

import { ContactForm } from "@/components/site/contact-form";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a modeling, content creation, makeup, travel promotion, henna, or face painting project with Sage Burress.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ inquiry?: string | string[] }>;
}) {
  const content = await getSiteContent();
  const params = await searchParams;
  const initialInquiry = typeof params.inquiry === "string" ? params.inquiry : undefined;

  return (
    <>
      <section className="editorial-page-hero editorial-page-hero--contact">
        <h1>{content.contact.title}</h1>
        <p>{content.contact.intro}</p>
      </section>

      <section className="editorial-contact-layout">
        <aside>
          <p>Direct email</p>
          <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
          <dl>
            <div>
              <dt>Useful details</dt>
              <dd>
                Share whatever you know so far. The idea, timing, location, goals, and budget are
                all helpful. But none are required to start.
              </dd>
            </div>
            <div>
              <dt>Services</dt>
              <dd>
                <ul className="editorial-contact-services">
                  <li>Modeling</li>
                  <li>Content Creation</li>
                  <li>Makeup Artist</li>
                  <li>Travel Promotions</li>
                  <li>Henna</li>
                  <li>Face Painting</li>
                </ul>
              </dd>
            </div>
          </dl>
        </aside>
        <ContactForm initialInquiry={initialInquiry} />
      </section>
    </>
  );
}
