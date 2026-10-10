# Search and editorial content

## October 10, 2026 source ledger

The owner authorized the brief biography, homepage credibility section, six sets of FAQs, technical SEO, and release. Main identity remains Sage Burress. Local makeup, henna and face painting use Sage’s Shenanigans; these are not separate websites or duplicate city pages.

- Owner: a decade of modeling, magazine publications, the recent Highest on the Runway show in Paris, NYFW work for Donny’s Devils and Diyanni Surf Swimwear, and educational-video modeling for both universities.
- Agency credits checked: https://www.heymantalent.com/talent/includes/talent_display/master.cfm?t=tl28t3600drfds . Includes Xavier educational video, UC educational video, NYFW Model X/Diyanni Surf, Donny’s Devils NYFW, Highest on the Runway/Dope Tavio, Fashion Week Columbus, Miami Swim Week, and Miami Art Basel event work.
- Preserve distinction: Miami Swim Week is not Miami Fashion Week. Shows during Paris/NY fashion weeks are not a claim of official FHCM/CFDA affiliation. The earlier generic Miami Fashion Week statement is not used in this release.
- No new magazine titles, publication dates, awards, booking rates, licenses, office locations, performance metrics or guarantees inferred.

## Asset provenance

- Xavier University SVG: exact `xavier-logo` symbol from https://www.xavier.edu/; wrapped as standalone SVG without changing artwork. Brand guidance: https://www.xavier.edu/brand/.
- University of Cincinnati SVG: exact `svg-logo` from https://www.uc.edu/. Academic wordmark, not athletic mark. Guidance: https://www.uc.edu/about/marketing-communications/brand-guide/logos-marks.html.
- Fashion Week Columbus PNG: official dark RGB artwork linked by https://fashionweekcolumbus.org/, Squarespace CDN, downloaded at 500px width for legibility on the light rail.
- Highest on the Runway, Donny’s Devils and Diyanni Surf use plain text in the rail, not invented logos. Exact approved artwork remains an owner-supplied follow-up. Official Paris/NYFW umbrella marks and Art Basel marks are not used.
- Rail describes selected work, publications and runway experience; it does not claim sponsorship or endorsement. New university alternative text specifies educational-video work.

## Maintenance and boundaries

`src/lib/editorial-content.ts` supplies the owner-approved biography and service FAQs to both HTML and Markdown. Keep future factual edits in this source. Existing admin-managed content and Blob persistence are untouched. New brand defaults merge with stored content using existing normalization.

Structured data uses Person, WebSite, Service and the named local-services Organization. No private/fabricated street address, fake LocalBusiness rich-result eligibility, ratings, or pricing. FAQs are visible, native expandable HTML; no Google FAQ rich-result promise (the feature was retired in May 2026).

Markdown is selected by the request’s explicit Accept preference, not crawler identity. HTML remains normal browser behavior, RSC navigation and mutations bypass rewriting, and private routes/APIs are excluded. Unknown Markdown page requests return 404, not fabricated content. Markdown responses are uncached, use Vary: Accept and carry a canonical Link header; the internal representation endpoint is not in the sitemap. Next.js overwrites HTML's Vary header, so the public layout uses dynamic rendering/no-store to prevent intermediary caches mixing formats. Most public pages were already dynamic. llms.txt is a convenience for other readers, not a Google ranking requirement.

No Google property/profile creation, DNS writes, sitemap submissions, indexing requests, outreach or paid changes are authorized by the website deployment alone. Search Console and Business Profile setup are guided owner actions.

## Score interpretation

Baseline Is Agentic report: 66/100, scanned_at 2026-10-10T20:51:45.725Z, https://is-agentic.com/scan/sageburress.com. This third-party snapshot is not a Google score. A fresh rescan is required after deployment; do not equate a cached score with current behavior. Never invent an address or expand a page with filler just to satisfy a generic organization/content-ratio check.
