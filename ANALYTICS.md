# Sage Burress analytics

## Account and release boundary

- Canonical checkout: `C:\Code\projectsaite`, remote `ocnbtl/projectsaite`.
- Verified pre-change GitHub main and Vercel production: `272df0a06a145ea44334e9739f47820aacb4990b` (September 28, 2026).
- Vercel: Sage Burress team, `projectsaite`, project `prj_mN62M3IzJzPvCPUYA4IfGhYFL1Lu`. Both Ocean and Sage have owner access.
- PostHog US: Sage Burress organization, project `632957` (currently called Default project), Ocean owner/operator.
- Dashboard: https://us.posthog.com/project/632957/dashboard/2144020
- Local work is not a production release. Obtain explicit approval before pushing main, deploying, or changing Vercel production variables.

## Configuration

Use the public project ingestion token for `NEXT_PUBLIC_POSTHOG_KEY` and `https://us.i.posthog.com` for `NEXT_PUBLIC_POSTHOG_HOST`. Never use a personal API key in the browser. Local configuration is in ignored `.env`; existing `.env.local` and `.env.development.local` were preserved.

Production requires `VERCEL_ENV=production` and the `sageburress.com` or `www.sageburress.com` hostname. Vercel provides its deployment environment. Previews and normal localhost visits do not collect. Only isolated localhost tests may set `NEXT_PUBLIC_POSTHOG_TEST_MODE=true`; never set it on Vercel, and intercept every PostHog request during these tests.

Owner approved publication and project settings on September 28. Applied and read back: IP anonymization on; automatic click/error/console/performance collection off; replay enabled with 30-day retention; recording domains restricted to https://sageburress.com and https://www.sageburress.com; reporting timezone America/New_York. Existing test-cohort filters were preserved. Billing UI confirms the free plan (1M analytics events and 5K web recordings per cycle); no billing changes, upgrades or terms acceptance. Public key/host were added to Vercel Production only; test mode was not added.

## Privacy behavior

- No PostHog SDK initialization or requests until explicit opt-in. Separate choices: decline, analytics only, analytics plus masked recordings.
- A compact notice offers Accept, Decline and Settings. Accept enables analytics and masked recordings; the privacy page has individual switches. The footer's Privacy & settings link remains available after a choice. Withdrawal stops future collection. DNT and Global Privacy Control disable optional tracking. Existing saved choices are preserved.
- Internal visitors can exclude their browser. This also excludes their Vercel pageviews.
- PostHog persistence is in memory, with no identified profiles. Counts are anonymous sessions, not unique people. Refreshes can reset identity.
- Only approved public paths and predefined source/action/error categories leave the browser. Queries, fragments, raw referral URLs, form values, names, emails, messages and provider IDs are excluded.
- Replay masks all text and element attributes and blocks all forms, inputs, images, videos, canvases, iframes and contact links. It never records contact/privacy/admin/unrecognized routes or pages with query strings/fragments. Network bodies/headers, console logs and exception text are disabled.
- Existing Vercel Analytics remains installed. Its pageviews are production-only, omit internal browsers, and use sanitized public URLs. Its aggregate counts will differ from consented PostHog counts.
- No uploads or booking/payment workflow are added.

## Event dictionary

| Event | Meaning |
| --- | --- |
| `$pageview` | One per consented public route entry; query-only changes are not extra pageviews |
| `page_engaged` | At least 15 visible, consented seconds on the route |
| `key_action_clicked` | Contact, email, service, portfolio or external-link click; not an inquiry |
| `contact_form_started` | First input interaction in a form instance while tracking is allowed |
| `contact_validation_failed` | Browser validation rejected the form; no delivery attempt |
| `contact_submit_attempted` | Valid browser form attempted submission |
| `contact_submit_succeeded` | Server reports email-provider acceptance with a provider message ID; not inbox delivery, qualified lead or booking |
| `contact_submit_failed` | Invalid form, rate limit, unavailable delivery, provider failure, network error or unexpected response |
| `site_problem` | Categorical runtime error/unhandled rejection; no message, stack or sensitive URL |

The eight dashboard charts cover traffic, sources, pages, engagement, actions, submission problems, site problems and the form funnel. Every chart filters `environment=production`. No historical analytics are imported or combined.

## Verification

```powershell
npm.cmd ci
npm.cmd run test:analytics
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd audit
```

`test:analytics` runs pure privacy/environment tests and the real contact handler against an in-memory mock Resend provider. No real credentials or network are available in that test.

For browser tests, start a localhost-only server on port 3107 with empty `RESEND_API_KEY` and `BLOB_READ_WRITE_TOKEN`, and test mode enabled. Use a fresh isolated browser (the replay suite intentionally installs a browser privacy signal):

```powershell
npm.cmd exec --yes --package=@playwright/cli -- playwright-cli -s=saite-check open http://127.0.0.1:3107
npm.cmd exec --yes --package=@playwright/cli -- playwright-cli -s=saite-check run-code --filename scripts/verify-analytics.browser.js
npm.cmd exec --yes --package=@playwright/cli -- playwright-cli -s=saite-check run-code --filename scripts/verify-replay.browser.js
```

All PostHog traffic and contact submissions are intercepted. Never run submission tests against production. Screenshots go to ignored `output/playwright/`. Build with test mode false/unset for a release.

The release-mode check uses `scripts/verify-release.browser.js` against `npm run start` on the same localhost port, with test mode false. It verifies that ordinary local browsing sends no analytics, and checks desktop/mobile confirmations, failure recovery and consent-control keyboard focus.

Verified locally on September 28: security-patched build, lint, TypeScript, all three browser suites, privacy policy tests, mocked contact-handler tests, and full npm audit (zero reported vulnerabilities). Next.js 16.3.6 generated `AGENTS.md`, `CLAUDE.md` and its root-parameter type reference. No production deployment, real inquiry/email, Google profile/property, DNS update, or sitemap/indexing submission was performed.

## Google setup findings (read-only, September 28, 2026)

- Sitemap: https://sageburress.com/sitemap.xml, 200, 11 public URLs.
- robots.txt: 200, allows public crawling, disallows `/admin/` and `/api/`, points to the correct sitemap.
- Home/contact/portfolio/modeling: 200, correct self-canonicals and index/follow.
- HTTP redirects 308 to HTTPS; www redirects 301 to apex; `/services` redirects 308 to modeling; `/about` redirects 307 home.
- Existing issue: `/admin/login` inherits index/follow and the home canonical. Recommend explicit noindex for admin routes. Do not treat robots disallow as a removal/noindex mechanism. No SEO changes made in this implementation.
- GBP eligibility is supported by owner-confirmed in-person services around Cincinnati/Mason, with travel to clients. Use a service-area profile with a non-public address; occasional LA/New York travel does not establish separate locations.
- Google profile/property creation, DNS changes, sitemap submission and indexing requests remain user-operated. No indexing or ranking guarantee.
