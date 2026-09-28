# Sage Burress: owner-operated Google setup

Reviewed September 28, 2026. No Google settings were changed. These are instructions for you to complete; send screenshots at each decision point. Keep passwords, verification codes, private addresses and DNS verification values out of chat when not needed.

## 1. Google Business Profile

**Eligibility:** The confirmed in-person services and travel to clients support a service-area business around Cincinnati and Mason, Ohio. An online-only influencer/portfolio would not qualify on that basis alone. Google makes the verification decision.

1. Sign in to the Google account you intend to manage the business with. Check [Business Profile Manager](https://business.google.com/locations) and search Google Maps for the exact business name, website and any existing business phone. My public Maps check found no matching Sage Burress listing, but this is not proof that no claimed or unverified profile exists. If an existing listing belongs to Sage, manage it or request access rather than making a duplicate.
2. Use **Sage Burress**, provided that is her actual public business name. Do not add SAITE, city names, keywords or a made-up agency name. For the primary category, choose the closest category offered by Google for her main in-person paid service. For example, Makeup artist is a candidate only if makeup is the main service. Send the category screen before choosing if uncertain; do not call her a modeling agency unless she operates one.
3. Choose the option indicating she visits customers. Do not show a home address as a storefront. If Google privately requests a real operating address for verification, enter it yourself. No virtual office, borrowed storefront or LA/New York location based only on occasional travel.
4. Start with the confirmed Cincinnati and Mason service areas. Google's normal guidance is an overall area within roughly two hours of the operating base. Choose actual cities/postcodes served, not a nationwide radius.
5. Add https://sageburress.com/ and only a confirmed business phone, working hours and services. Use actual services offered, such as makeup, henna and face painting where applicable. Do not invent prices or guarantees. Add real, approved work photos and the SB logo; obtain permission for identifiable client photos.
6. You and Sage complete whichever verification method Google offers. For video verification, prepare evidence of the real operating area, professional tools/work and authority to run the business. Record through Google's requested flow, not an edited promotional video. Keep IDs, banking information, private client information and other people's faces out of the video. Do not promise approval or timing.

You can operate the account now as requested. Keep owner access recoverable and coordinate verification with Sage. Do not share passwords; use Google's owner/manager access controls when adding her.

Official guidance: [eligibility and ownership](https://support.google.com/business/answer/13763036?hl=en), [service areas](https://support.google.com/business/answer/9157481?hl=en), [business representation](https://support.google.com/business/answer/3038177?hl=en), [video verification](https://support.google.com/business/answer/14271705?hl=en).

## 2. Google Search Console

1. Open [Search Console](https://search.google.com/search-console/) using the intended owner account. Open the top-left property selector first. Look for **sageburress.com** or **https://sageburress.com/**. If one exists but you lack access, ask its owner for access instead of assuming it must be recreated. Send that screenshot first.
2. If no appropriate property exists, prefer a **Domain property** containing only `sageburress.com`. It covers protocols and subdomains and requires DNS verification. If DNS access is unavailable, a **URL-prefix property** for `https://sageburress.com/` covers the canonical HTTPS site and offers alternative verification methods. Do not substitute the Vercel preview hostname.
3. You copy Google's exact verification record into the authoritative DNS provider. Add the requested TXT record without deleting existing records or changing nameservers. Return to Search Console and select Verify after it is visible. Keep the verification record afterward. For a URL-prefix method, follow only the method Google offers and preserve the proof file/tag. I will not add DNS, files or verification tags without separate authorization.
4. Once verified, open **Sitemaps** and submit https://sageburress.com/sitemap.xml (or `sitemap.xml` if the UI already supplies the prefix). Its live response is 200 with 11 public URLs. Check that processing succeeds; submission does not guarantee indexing.
5. Use **URL Inspection** for the homepage, `/services/content-creation`, `/services/modeling`, `/portfolio` and `/contact`. Compare the declared and Google-selected canonical, indexing status and any crawl/robots issues. Use Test live URL when needed. You can request indexing for eligible important pages; avoid repeated requests and do not submit admin/API URLs.

Read-only findings: robots.txt points to the sitemap; the sampled public pages return 200 with self-canonicals and index/follow. HTTP redirects to HTTPS and www redirects to apex. `/about` and `/services` are redirects and need not be submitted as destination pages.

**Recommended fix, not implemented:** `/admin/login` currently inherits `index, follow` and the homepage canonical. Give admin routes explicit noindex directives in a separately authorized change. robots.txt disallow is not a substitute for noindex/removal, and can prevent Google from seeing a noindex directive. Check actual indexing before deciding whether removal is needed.

Official guidance: [property types and setup](https://support.google.com/webmasters/answer/34592?hl=en), [ownership verification](https://support.google.com/webmasters/answer/9008080?hl=en), [sitemap submission](https://support.google.com/webmasters/answer/7451001?hl=en), [URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en).

Search Console measures search visibility; PostHog measures consented on-site behavior. Neither a property nor a Business Profile guarantees indexing, rankings, inquiries or bookings.
