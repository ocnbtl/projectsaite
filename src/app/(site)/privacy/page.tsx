export const metadata = {
  title: "Privacy",
  description: "How the Sage Burress website handles contact-form information and analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <article className="container legal-page__inner">
        <p className="ui-label">Privacy</p>
        <h1>A clear, minimal approach to your information.</h1>
        <p>When you submit the contact form, the details you provide are used only to review and respond to your inquiry. They are delivered to Sage Burress and are not sold.</p>
        <h2>Website analytics</h2>
        <p>This site uses Vercel Analytics to understand aggregate website usage and improve the experience. It does not create advertising profiles.</p>
        <h2>Optional analytics and recordings</h2>
        <p>With your permission, we also use PostHog to understand page visits, general traffic sources, time spent engaging with pages, important link clicks, and whether the contact form succeeds or encounters a problem. Clicking a link is not counted as a completed inquiry or booking. A successful form submission means our email provider accepted the message, not that a booking has been made.</p>
        <p>You can allow analytics alone, separately allow masked session recordings, or decline both using Privacy choices. PostHog is not loaded before you opt in. Your choice is saved in this browser. We respect browser Do Not Track and Global Privacy Control signals for this optional tracking. You can withdraw permission at any time; withdrawal stops future collection and does not automatically delete previously collected data.</p>
        <p>Recordings show masked page interactions. All text and element attributes are masked, images and form elements are blocked, and contact, privacy, admin, and unrecognized pages are excluded from recording. Pages containing query strings or URL fragments are also excluded. We do not send form names, email addresses, messages, uploaded files, full referral URLs, or URL query strings to PostHog. Network request bodies, headers, and console logs are not recorded.</p>
        <p>Optional analytics use random anonymous identifiers during your browsing session, without creating an identified person profile. Your privacy preference and internal-browser exclusion choice are stored in this browser. Page information, general device/browser information, and sanitized event categories are processed by PostHog in the United States. Our configuration disables IP-based location enrichment. See <a href="https://posthog.com/privacy" target="_blank" rel="noreferrer">PostHog’s privacy policy</a> for its service practices. Optional analytics reflect consenting visitors and may differ from aggregate Vercel counts.</p>
        <h2>Contact and deletion</h2>
        <p>To ask about, update, or delete information submitted through this website, email <a href="mailto:contact@sageburress.com">contact@sageburress.com</a>.</p>
        <p className="legal-page__date">Last updated September 28, 2026.</p>
      </article>
    </div>
  );
}
