# Project Saite

Production website and private client workspace for Sage Burress.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The public site works from the checked-in seed content. Direct contact delivery requires Resend, and persistent admin edits require a Vercel Blob store. Without those integrations, the contact form offers an email-app fallback and the admin clearly reports read-only seed mode.

## Core routes

- `/` home
- `/about`
- `/services`
- `/portfolio`
- `/contact`
- `/links`
- `/admin/login`
- `/admin`
- `/admin/pitch-kit`
- `/admin/portfolio`
- `/admin/content`
- `/admin/analytics`
- `/admin/style-guide`
- `/admin/settings`

## Deployment

The canonical repository is `ocnbtl/projectsaite`. Vercel should deploy the repository root as a Next.js project. Configure the variables from `.env.example` in Vercel before promoting a preview to production.
