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
          <h1>Privacy Disclosure</h1>
        </header>
        <div className="privacy-page__summary">
          <section>
            <h2>Your Messages</h2>
            <p>We use your details to reply to your inquiry. We never sell them.</p>
          </section>
          <section>
            <h2>Site Insights</h2>
            <p>Analytics and error reports help us improve this site.</p>
          </section>
        </div>
        <PrivacySettings environment={process.env.VERCEL_ENV ?? "local"} />
        <details className="privacy-page__details">
          <summary>What we collect &amp; protect</summary>
          <p>Vercel provides basic traffic counts. PostHog starts only after you opt in. It processes visits, traffic sources, actions, form outcomes, errors and device information in the US, using random identifiers without identified profiles or IP-based location enrichment.</p>
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
