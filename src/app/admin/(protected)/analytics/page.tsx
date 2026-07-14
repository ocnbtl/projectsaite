import { Activity, ArrowUpRight, BarChart3, CheckCircle2, Gauge, MousePointerClick } from "lucide-react";

const dashboardUrl = "https://vercel.com/sage-burress/projectsaite/analytics";

export default function AdminAnalyticsPage() {
  return (
    <div className="admin-page">
      <header className="admin-page__heading admin-overview__heading">
        <div><p className="ui-label">Analytics</p><h1>See how people find and use the site.</h1><p>Privacy-friendly traffic reporting is provided by Vercel Analytics.</p></div>
        <a className="button button--dark" href={dashboardUrl} target="_blank" rel="noreferrer">Open live analytics<ArrowUpRight size={17} /></a>
      </header>
      <section className="analytics-status">
        <div><CheckCircle2 size={20} /><span>Vercel Analytics is installed on every public page.</span></div>
        <p>Live visitor totals and referrer data remain in Vercel so the website does not duplicate or expose private reporting credentials.</p>
      </section>
      <section className="analytics-grid">
        <article><BarChart3 size={22} /><p className="ui-label">Traffic</p><h2>Visitors and page views</h2><p>Compare unique visitors, total views, and changes over time.</p></article>
        <article><MousePointerClick size={22} /><p className="ui-label">Interest</p><h2>Most-viewed pages</h2><p>Learn which services and portfolio stories attract the most attention.</p></article>
        <article><Activity size={22} /><p className="ui-label">Discovery</p><h2>Sources and locations</h2><p>Understand where visitors arrive from and the regions they represent.</p></article>
        <article><Gauge size={22} /><p className="ui-label">Quality</p><h2>Core Web Vitals</h2><p>Use Vercel Speed Insights after launch to monitor real-world performance.</p></article>
      </section>
      <section className="admin-note admin-note--light"><p className="ui-label">Reporting boundary</p><h2>Inquiry content stays in email.</h2><p>The site intentionally does not store contact messages in analytics or the admin area. Conversion measurement can be added later without exposing the contents of client conversations.</p></section>
    </div>
  );
}
