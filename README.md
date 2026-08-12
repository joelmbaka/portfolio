# Joel Mbaka — Senior Full-Stack Engineer, Web & Mobile

Source for [joelmbaka.com](https://joelmbaka.com), my engineering portfolio and selected product case studies.

The site is designed to show end-to-end product engineering across mobile applications, web platforms, backend services, relational data, third-party integrations, testing, and production release.

## Engineering focus

- **Mobile:** React Native, Expo, TypeScript, iOS, Android
- **Web:** Next.js, React, TypeScript, Tailwind CSS, TanStack tooling
- **Backend:** Python, FastAPI, REST APIs, background and integration workflows
- **Data:** PostgreSQL, SQLAlchemy, Alembic, relational domain modeling
- **Production:** Vercel, Docker, cloud APIs, authentication, testing, release workflows
- **Applied AI:** transcription, LLM integrations, agents, recommendation and automation systems

## Featured case studies

### JournPad

AI-assisted voice journaling product spanning a React Native mobile application, Python services, AI processing, cloud infrastructure, and an automated publishing pipeline.

### CliviQue HMIS

Hospital operations platform built with Next.js, React, FastAPI, SQLAlchemy, Alembic, PostgreSQL, and Playwright across interconnected clinical and facility workflows.

### RentPayor

Rent collection and reconciliation product spanning React Native, FastAPI, PostgreSQL, authentication, internal CRM tooling, lead intelligence, and sales automation.

Additional work includes Macsim Cargo and AI Stylist.

## Portfolio architecture

This repository uses:

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase for internal authenticated tooling
- Vercel Analytics and Speed Insights

Public portfolio routes are intentionally separated from internal tooling at the crawler level. Internal CRM and placeholder-content routes are marked `noindex` and excluded from the public search surface.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production build:

```bash
npm run build
npm run start
```

## Contact

- Website: [joelmbaka.com](https://joelmbaka.com)
- GitHub: [github.com/joelmbaka](https://github.com/joelmbaka)
- LinkedIn: [linkedin.com/in/joelmbaka](https://linkedin.com/in/joelmbaka)
- Email: mbakajoe26@gmail.com
