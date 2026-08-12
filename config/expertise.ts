export type ExpertiseArea = {
  slug: string;
  eyebrow: string;
  title: string;
  searchTitle: string;
  description: string;
  intro: string;
  technologies: string[];
  evidenceProjectIds: string[];
  highlights: string[];
};

export const expertiseAreas: ExpertiseArea[] = [
  {
    slug: 'react-native-mobile-engineering',
    eyebrow: 'Mobile engineering',
    title: 'React Native & Expo mobile engineering',
    searchTitle: 'React Native & Expo Engineer for Production Apps | Joel Mbaka',
    description:
      'React Native and Expo engineering for production iOS and Android apps, including authentication, audio, payments, location, local persistence, testing, EAS builds, OTA updates, and App Store / Play Store release work.',
    intro:
      'I build mobile products as complete systems rather than isolated screens: app architecture, navigation, secure authentication, native device capabilities, API integration, local persistence, analytics, testing, release, and the backend workflows required to support the product.',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Expo Router', 'EAS Build', 'Expo Updates', 'SQLite', 'SecureStore', 'AsyncStorage', 'iOS', 'Android'],
    evidenceProjectIds: ['journpad', 'rentpayor', 'macsim', 'ai-stylist'],
    highlights: [
      'Voice recording, playback, reminders, goals, biometrics, secure token storage, and store release workflows in JournPad.',
      'Invoice-linked rent payment and reconciliation workflows in RentPayor.',
      'Driver, cargo, location, reservation, and payment operations in Macsim Cargo.',
      'Wardrobe, image-analysis, location, OAuth, and recommendation workflows in AI Stylist.',
    ],
  },
  {
    slug: 'nextjs-web-engineering',
    eyebrow: 'Web engineering',
    title: 'Next.js & React web application engineering',
    searchTitle: 'Next.js Full-Stack Web Engineer | Joel Mbaka',
    description:
      'Next.js and React engineering for workflow-heavy applications, operational dashboards, public product websites, authenticated workspaces, responsive interfaces, and search-oriented product surfaces.',
    intro:
      'My web work covers public product websites and authenticated operational systems. I focus on workflows, information architecture, data loading, permissions, responsive UI, search visibility, and the backend contracts that make the interface reliable.',
    technologies: ['Next.js', 'React', 'TypeScript', 'TanStack Query', 'Tailwind CSS', 'shadcn/ui', 'Playwright', 'Vercel'],
    evidenceProjectIds: ['clivique-hmis', 'rentpayor', 'macsim'],
    highlights: [
      'Multi-department hospital workflows and facility operations in CliviQue HMIS.',
      'Property-management lead intelligence and outbound operations in the RentPayor CRM.',
      'Cargo, fleet, driver, finance, and staff administration in Macsim back-office tooling.',
      'Public product websites with canonical metadata, structured data, sitemaps, robots controls, and intent-specific landing pages.',
    ],
  },
  {
    slug: 'fastapi-postgresql-backends',
    eyebrow: 'Backend & data',
    title: 'Python, FastAPI & PostgreSQL backend engineering',
    searchTitle: 'Python FastAPI & PostgreSQL Backend Engineer | Joel Mbaka',
    description:
      'Python, FastAPI, SQLAlchemy, Alembic, PostgreSQL, REST API, authentication, callbacks, and transactional backend engineering for real product workflows.',
    intro:
      'I design backend systems around business state that must remain correct: invoices and balances, patient and facility scope, cargo and driver payments, journal entries, authentication, callbacks, and long-running operational workflows.',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'SQL', 'SQLAlchemy', 'Alembic', 'REST APIs', 'Webhooks', 'JWT'],
    evidenceProjectIds: ['rentpayor', 'clivique-hmis', 'macsim', 'journpad', 'ai-stylist'],
    highlights: [
      'Rent invoices, partial payments, carried-forward credits, receipts, and automatic reconciliation in RentPayor.',
      'Patient, facility, billing, clinical workflow, and M-Pesa payment state in CliviQue HMIS.',
      'Idempotent driver payouts, callback handling, and ledger accounting in Macsim Cargo.',
      'Voice-entry processing and AI-assisted metadata workflows in JournPad.',
    ],
  },
  {
    slug: 'api-engineering-integrations',
    eyebrow: 'APIs & integrations',
    title: 'REST API, GraphQL & third-party integration engineering',
    searchTitle: 'REST API, GraphQL & Integration Engineer | Joel Mbaka',
    description:
      'API engineering across FastAPI REST services, GraphQL, webhooks, callbacks, payment providers, authentication, cloud services, and third-party product integrations.',
    intro:
      'For most non-trivial products, the API layer is where user-facing behavior becomes durable business logic. I design and integrate APIs around clear contracts, authentication, validation, idempotency, failure states, callbacks, observability, and the relational state behind them.',
    technologies: ['REST APIs', 'GraphQL', 'FastAPI', 'Apollo', 'Webhooks', 'OAuth', 'JWT', 'M-Pesa Daraja', 'Third-party APIs'],
    evidenceProjectIds: ['rentpayor', 'clivique-hmis', 'macsim', 'journpad', 'ai-stylist'],
    highlights: [
      'Payment initiation, provider callbacks, verification, and reconciliation across RentPayor and CliviQue.',
      'Daraja STK Push and B2C payout integration with idempotent state transitions in Macsim Cargo.',
      'Voice transcription and AI service integration behind JournPad.',
      'GraphQL and Neo4j experience in conversational application work alongside REST-first production systems.',
    ],
  },
  {
    slug: 'databases-data-modeling',
    eyebrow: 'Databases & data modeling',
    title: 'SQL, PostgreSQL, graph & application data engineering',
    searchTitle: 'PostgreSQL, SQL & Data Modeling Engineer | Joel Mbaka',
    description:
      'Relational and application data modeling with PostgreSQL, SQL, SQLAlchemy, Alembic, SQLite, graph databases, local persistence, caching patterns, migrations, and transactional business state.',
    intro:
      'I treat the data model as part of the product design. Invoices, tenant credit, patient context, payment ledgers, cargo assignments, journal entries, local mobile state, and recommendation history all become easier to reason about when the database expresses the real business relationships clearly.',
    technologies: ['PostgreSQL', 'SQL', 'SQLAlchemy', 'Alembic', 'SQLite', 'Neo4j', 'Graph data', 'AsyncStorage', 'Caching patterns'],
    evidenceProjectIds: ['rentpayor', 'clivique-hmis', 'macsim', 'journpad', 'ai-stylist'],
    highlights: [
      'Accounting-oriented invoice, payment, credit, lease, property, unit, and tenant relationships in RentPayor.',
      'Patient, encounter, facility, billing, orders, movement, and receipt state in CliviQue HMIS.',
      'Operational load, reservation, driver, fleet, payout, and immutable ledger state in Macsim Cargo.',
      'SQLite/local state and cloud-backed application data patterns in mobile products.',
    ],
  },
  {
    slug: 'voice-ai-llm-engineering',
    eyebrow: 'Voice AI & LLM products',
    title: 'Voice apps, speech-to-text & LLM integration engineering',
    searchTitle: 'Voice AI, Speech-to-Text & LLM Integration Engineer | Joel Mbaka',
    description:
      'Application engineering for voice capture, speech-to-text, Whisper, LLM reasoning, structured outputs, AI agents, image understanding, telephony/voice APIs, and open-source inference workflows.',
    intro:
      'My AI work is application engineering, not model training or data science. I use capable models as reasoning and media-processing services inside broader products, with strong attention to prompts, structured outputs, review boundaries, cost, latency, fallbacks, and how model behavior fits the rest of the system.',
    technologies: ['LLM integrations', 'Whisper', 'Speech-to-text', 'Voice apps', 'AI agents', 'Open-source models', 'NVIDIA inference', 'Modal', 'Image understanding'],
    evidenceProjectIds: ['journpad', 'ai-stylist', 'rentpayor'],
    highlights: [
      'Voice capture, transcription, playback, and AI-assisted organization in JournPad.',
      'Image understanding and recommendation workflows in AI Stylist.',
      'LLM-assisted lead research, scoring, outreach drafting, and reply review around RentPayor.',
      'Agentic content pipelines that plan, draft, repair, review, and publish content with human-controlled product boundaries.',
    ],
  },
  {
    slug: 'authentication-application-security',
    eyebrow: 'Authentication & application security',
    title: 'Secure authentication, authorization & application security',
    searchTitle: 'Authentication & Application Security Engineer | Joel Mbaka',
    description:
      'Practical application security across OAuth, Google/Apple sign-in, access and refresh tokens, SecureStore, biometrics, password hashing, role-based access, tenant/facility isolation, KYC/KYB, and sensitive workflow controls.',
    intro:
      'I prefer the backend to remain the central source of identity and authorization truth. On mobile, sensitive tokens belong in secure storage while non-sensitive state can use ordinary local persistence. For higher-risk products, I design around permissions, isolation, verification, auditability, and explicit revocation rather than trusting the client.',
    technologies: ['OAuth', 'Google Sign-In', 'Apple Sign-In', 'JWT', 'Access tokens', 'Refresh tokens', 'Expo SecureStore', 'Biometrics', 'Password hashing', 'RBAC', 'KYC/KYB'],
    evidenceProjectIds: ['journpad', 'rentpayor', 'clivique-hmis', 'ai-stylist'],
    highlights: [
      'Google/Apple authentication, secure token storage, biometrics, and account-lifecycle controls in mobile apps.',
      'Facility- and role-scoped clinical access in CliviQue HMIS.',
      'Financial-account verification, KYC/KYB-oriented onboarding, and payment controls in RentPayor workflows.',
      'Idempotency, callback verification, and explicit authorization boundaries around payment state.',
    ],
  },
  {
    slug: 'payments-fintech-saas',
    eyebrow: 'Payments, FinTech & SaaS',
    title: 'Payment integration, subscription & reconciliation engineering',
    searchTitle: 'FinTech, Payment Integration & SaaS Engineer | Joel Mbaka',
    description:
      'Payment and SaaS engineering across M-Pesa/Daraja, invoice reconciliation, ledgers, callbacks, receipts, subscriptions, RevenueCat, KYC/KYB, and financial workflow design.',
    intro:
      'I have built payment workflows where moving money is only one part of the problem. The system also needs invoice state, provider verification, callbacks, idempotency, receipts, balances, credits, permissions, and a clean audit trail. That makes payment integration closely connected to accounting and product data modeling.',
    technologies: ['M-Pesa', 'Daraja', 'Payment APIs', 'Reconciliation', 'Ledgers', 'Subscriptions', 'RevenueCat', 'KYC/KYB', 'Webhooks'],
    evidenceProjectIds: ['rentpayor', 'macsim', 'clivique-hmis', 'journpad'],
    highlights: [
      'RentPayor combines PropTech, FinTech, invoicing, tenant balances, receipts, and automatic rent reconciliation.',
      'Macsim uses Daraja collection funding and B2C driver payouts with guarded ledger accounting.',
      'CliviQue connects facility-bound M-Pesa patient payments to hospital invoices and receipts.',
      'JournPad includes subscription infrastructure using the RevenueCat React Native SDK.',
    ],
  },
  {
    slug: 'mobile-app-release-ci-cd',
    eyebrow: 'CI/CD & app release',
    title: 'GitHub, Vercel, Expo EAS & mobile release engineering',
    searchTitle: 'CI/CD, Expo EAS, App Store & Play Store Release Engineer | Joel Mbaka',
    description:
      'Practical CI/CD and release work with Git/GitHub branches and merges, Vercel, Expo EAS Build, TestFlight, App Store Connect, Google Play Console, closed testing, production builds, and OTA updates.',
    intro:
      'Shipping is part of engineering. I work in branch-based GitHub workflows, deploy web and FastAPI services to managed cloud environments such as Vercel, and use Expo/EAS for mobile build, signing, submission, testing, and update workflows. I am comfortable with the operational work required to move an app through both Apple and Google release systems repeatedly.',
    technologies: ['Git', 'GitHub', 'Branches & PRs', 'Vercel', 'Expo EAS', 'EAS Build', 'App Store Connect', 'TestFlight', 'Google Play Console', 'OTA updates'],
    evidenceProjectIds: ['journpad', 'rentpayor', 'macsim', 'ai-stylist'],
    highlights: [
      'Production, preview, development, and internal EAS build profiles across iOS and Android.',
      'App Store Connect/TestFlight and Google Play testing/release workflows for published mobile products.',
      'Expo OTA update workflows for rapid production fixes where appropriate.',
      'GitHub branch/merge workflows and Vercel deployments for web applications and APIs.',
    ],
  },
  {
    slug: 'technical-seo-search-growth',
    eyebrow: 'Technical SEO & search growth',
    title: 'Technical SEO, search discovery & Google Ads engineering',
    searchTitle: 'Technical SEO, Search Console & Google Ads Specialist | Joel Mbaka',
    description:
      'Technical SEO and intent marketing across Next.js metadata, canonical URLs, structured data, XML sitemaps, robots directives, internal linking, Google Search Console, Bing Webmaster Tools, Screaming Frog, and Google Ads search campaigns.',
    intro:
      'I approach search as part of product distribution. That means building crawlable information architecture, matching pages to real search intent, validating metadata and indexability, submitting sitemaps, inspecting coverage, and using paid search when the goal is to appear precisely when someone is already looking for the product or service.',
    technologies: ['Technical SEO', 'Next.js metadata', 'Schema.org', 'XML sitemaps', 'robots.txt', 'Google Search Console', 'Bing Webmaster Tools', 'Screaming Frog SEO Spider', 'Google Ads'],
    evidenceProjectIds: ['journpad', 'rentpayor', 'clivique-hmis'],
    highlights: [
      'Search-oriented product sites with intent-specific landing pages, canonical metadata, structured data, sitemaps, robots controls, and internal linking.',
      'Google Search Console and Bing Webmaster Tools workflows for discovery, indexing, sitemap submission, and diagnostics.',
      'Screaming Frog SEO Spider audits on Linux for crawlability, metadata, links, and technical SEO checks.',
      'Google Ads search campaigns focused on high-intent queries rather than broad awareness advertising.',
    ],
  },
];

export function findExpertiseArea(slug: string) {
  return expertiseAreas.find((area) => area.slug === slug);
}
