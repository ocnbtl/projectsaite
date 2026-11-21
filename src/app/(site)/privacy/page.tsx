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
          <p>Vercel traffic analytics and PostHog start only after you opt in using the independent controls above. PostHog processes public-page visits, traffic-source categories, actions, fixed error categories and device information in the US, using random session identifiers without identified profiles or IP-based location enrichment. This site does not currently use Google Analytics.</p>
          <p>Recordings show public page content and interactions, with private areas and form inputs hidden. Contact, privacy and admin pages are not recorded. Form entries, uploaded files, sensitive URLs, network contents and console logs are excluded from PostHog.</p>
          <p>With your permission, a random identifier and traffic-source category last for your browser tab’s session. We measure public-page speed and use click heatmaps without form contents or raw error messages. Contact and other sensitive routes are excluded from optional analytics. Replay preserves approved static text, styling and checked-in public photographs; unrecognized text, attributes and uploaded media are masked or removed before transmission.</p>
          <p>Your preferences are saved in browser storage. Do Not Track and Global Privacy Control keep optional tracking off. Opting out stops future collection; it does not delete previously collected data. See <a href="https://posthog.com/privacy" target="_blank" rel="noreferrer">PostHog’s privacy policy</a>.</p>
        </details>
        <div className="privacy-page__contact">
          <p>Questions or deletion requests? <a href="mailto:contact@sageburress.com">contact@sageburress.com</a></p>
          <p className="privacy-page__date">Updated November 20, 2026</p>
        </div>
      </article>
    </div>
  );
}
