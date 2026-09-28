import { PrivacySettings } from "@/components/site/privacy-settings";

export const metadata = {
  title: "Privacy",
  description: "How the Sage Burress website handles contact-form information and analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <article className="privacy-page__inner">
        <header className="privacy-page__intro">
          <p className="ui-label">Sage Burress</p>
          <h1>Your privacy.</h1>
          <p>The essentials, and your choices.</p>
        </header>
        <div className="privacy-page__summary">
          <section>
            <h2>Your messages</h2>
            <p>Your contact details and message are used to respond to your inquiry. They are not sold.</p>
          </section>
          <section>
            <h2>Site insights</h2>
            <p>Vercel provides basic traffic counts. With permission, PostHog measures site usage and records masked interactions to help improve the experience.</p>
          </section>
        </div>
        <PrivacySettings environment={process.env.VERCEL_ENV ?? "local"} />
        <details className="privacy-page__details">
          <summary>What we collect &amp; protect</summary>
          <p>PostHog starts only after you opt in. It processes page visits, general traffic sources, clicks, engagement, form outcomes, and browser/device information in the United States, using random session identifiers without identified profiles or IP-based location enrichment.</p>
          <p>Recordings mask text and block images and forms. Contact, privacy and admin pages are not recorded. Form entries, uploaded files, sensitive URLs, network contents and console logs are excluded from PostHog.</p>
          <p>Your preferences are saved in browser storage. Do Not Track and Global Privacy Control keep optional tracking off. Opting out stops future collection; it does not delete previously collected data. See <a href="https://posthog.com/privacy" target="_blank" rel="noreferrer">PostHog’s privacy policy</a>.</p>
        </details>
        <div className="privacy-page__contact">
          <p>Questions or deletion requests? <a href="mailto:contact@sageburress.com">contact@sageburress.com</a></p>
          <p className="privacy-page__date">Updated September 28, 2026</p>
        </div>
      </article>
    </div>
  );
}
