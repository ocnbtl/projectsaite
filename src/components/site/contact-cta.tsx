import { ButtonLink } from "@/components/site/button-link";

type ContactCtaProps = {
  title?: string;
  copy?: string;
  tone?: "cream" | "olive" | "cocoa";
};

export function ContactCta({
  title = "Let’s make something considered.",
  copy = "Tell Sage what you are building, where it needs to live, and what you want people to feel.",
  tone = "cream",
}: ContactCtaProps) {
  return (
    <section className={`contact-cta contact-cta--${tone}`}>
      <div className="container contact-cta__inner">
        <p className="ui-label">Bookings & collaborations</p>
        <h2>{title}</h2>
        <p>{copy}</p>
        <ButtonLink href="/contact" variant={tone === "cocoa" ? "light" : "dark"}>
          Start a conversation
        </ButtonLink>
      </div>
    </section>
  );
}
