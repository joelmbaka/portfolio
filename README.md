# Joeltech Geek Systems

Official Next.js website for **Joeltech Geek Systems**, a Kenya-registered, founder-led software development business serving clients remotely worldwide.

- Production address: https://joeltechgeek.com
- Founder & lead engineer: Joel Mbaka
- Business registration: BN-P7SEWW57 (Kenya)
- Branch-based development: `brand/joeltechgeek` until review and manual merge.

## Core pages

- `/` — company identity and featured solutions
- `/services` — mobile, web, SaaS, backend and payment integrations
- `/work` — original products and client engineering case studies
- `/expertise` — engineering capabilities
- `/about` — company story and founder
- `/careers` — internship and SaaS sales expressions of interest
- `/contact` — direct business enquiries

The business is sole-founder-led. Do not invent company headcount, team roles, customers, endorsements or compensation figures.

## Software

Next.js 15, React 19, TypeScript, Tailwind CSS and Vercel. The legacy Python job-discovery directory is **not** part of the Vercel deployment. The internal CRM and demo routes must not be exposed or indexed.

## Local development and validation

```bash
npm install
npm run build
npm run dev
```

The website is **deployed manually** after review with `vercel --prod`. Never automatically deploy or merge into `main`.

## SEO and Search Console

The canonical origin is https://joeltechgeek.com and is defined in `lib/site.ts`. All metadata, structured data, sitemap and robots references should use that origin. After manually deploying to production, verify `https://joeltechgeek.com/robots.txt`, `https://joeltechgeek.com/sitemap.xml` and `https://joeltechgeek.com/google8bd8d4697948ac6c.html`. Preserve the Google Search Console ownership verification file at `public/google8bd8d4697948ac6c.html`. In Vercel, add `www.joeltechgeek.com` and configure a permanent redirect to `joeltechgeek.com`; add a Search Console domain property and submit the new sitemap.

## Contact

Founder: Joel Mbaka · mbakajoe26@gmail.com · https://linkedin.com/in/joelmbaka
