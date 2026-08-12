# Joel Mbaka — Senior Full-Stack Engineer, Web & Mobile

Portfolio source for [joelmbaka.com](https://joelmbaka.com).

I build production software products end-to-end across mobile, web, backend, data, integrations, and release. The portfolio is organized around engineering case studies rather than technology lists so the work shows what I owned, what systems were involved, and how the pieces fit together.

## Core engineering scope

- **Mobile:** React Native, Expo, TypeScript, iOS, Android, authentication, native capabilities, local persistence, store releases
- **Web:** Next.js, React, TypeScript, responsive product interfaces, operational dashboards, public product sites
- **Backend & data:** Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic, APIs, relational and transactional data models
- **Production:** payment integrations, AI APIs, testing, deployment, observability, cloud services, automation

## Selected work

The homepage deliberately highlights three projects that show different dimensions of the stack:

- **JournPad** — voice-first mobile journaling with preserved audio, transcription, AI-assisted titles/summaries/categories, playback, search, goals, reminders, account controls, and public mobile releases
- **CliviQue HMIS** — a full-stack hospital information system spanning patient and facility workflows, Next.js, FastAPI, PostgreSQL, role/facility-scoped access, browser testing, and facility-bound M-Pesa patient invoice collection
- **RentPayor** — rent invoicing, invoice-linked M-Pesa collection, automatic payment reconciliation, partial balances, carried-forward credits, receipts, leases, tenants, units, and internal CRM/outbound tooling

The complete project index remains available at **`/work`**, including Macsim Cargo and AI Stylist. Individual project URLs remain public and indexable.

## Additional projects

- **Macsim Cargo** — logistics and cargo operations across mobile and back-office systems, including load/trip workflows and guarded Daraja collection-account funding plus B2C driver payouts
- **AI Stylist** — mobile wardrobe management with AI-assisted clothing analysis, weather-aware outfit recommendations, OAuth, SQLite history, and a Python/PostgreSQL backend model

## Public SEO architecture

The public portfolio now has a deliberate crawlable information architecture:

- **`/`** — primary profile and selected work
- **`/full-stack-web-mobile-engineer`** — primary positioning/search-intent page
- **`/work`** — complete engineering case-study index
- **`/expertise`** — engineering expertise hub
- **`/expertise/react-native-mobile-engineering`**
- **`/expertise/nextjs-web-engineering`**
- **`/expertise/fastapi-postgresql-backends`**
- **`/expertise/ai-integrations-automation`**
- **`/about`**
- **`/contact`**
- Individual project case-study URLs

Public pages use canonical metadata, Open Graph/Twitter metadata, structured data, internal linking, and real content-update dates where available. `sitemap.xml` contains the public portfolio surface with meaningful priorities and modification dates. `robots.txt` permits the public site while excluding API routes, the internal CRM, the placeholder blog, and private website-requirements tooling.

The repository also includes a generated Open Graph image, a web manifest, Vercel Analytics, and Speed Insights. The internal job-hunt CRM remains deliberately outside the search surface.

## Portfolio stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Vercel Analytics and Speed Insights
- Supabase for internal authentication features

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Contact

- Website: [joelmbaka.com](https://joelmbaka.com)
- GitHub: [github.com/joelmbaka](https://github.com/joelmbaka)
- LinkedIn: [linkedin.com/in/joelmbaka](https://linkedin.com/in/joelmbaka)
