export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <article className="container legal-page__inner">
        <p className="ui-label">Privacy</p>
        <h1>A clear, minimal approach to your information.</h1>
        <p>When you submit the contact form, the details you provide are used only to review and respond to your inquiry. They are delivered to Sage Burress and are not sold.</p>
        <h2>Website analytics</h2>
        <p>This site uses Vercel Analytics to understand aggregate website usage and improve the experience. It does not create advertising profiles.</p>
        <h2>Contact and deletion</h2>
        <p>To ask about, update, or delete information submitted through this website, email <a href="mailto:contact@sageburress.com">contact@sageburress.com</a>.</p>
        <p className="legal-page__date">Last updated July 14, 2026.</p>
      </article>
    </div>
  );
}
