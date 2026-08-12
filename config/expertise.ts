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
    title: 'React Native mobile engineering',
    searchTitle: 'React Native Engineer for Production Mobile Apps | Joel Mbaka',
    description:
      'React Native and Expo engineering for production iOS and Android products, including authentication, native device capabilities, payments, audio, location, testing, and store release work.',
    intro:
      'I build mobile products as complete systems rather than isolated screens: app architecture, navigation, secure authentication, native device capabilities, API integration, local state, analytics, testing, release, and the backend workflows required to support the product.',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Expo Router', 'SQLite', 'Firebase Auth', 'iOS', 'Android'],
    evidenceProjectIds: ['journpad', 'rentpayor', 'macsim', 'ai-stylist'],
    highlights: [
      'Voice recording, playback, reminders, goals, and secure account flows in JournPad.',
      'Invoice-linked rent payment and reconciliation workflows in RentPayor.',
      'Driver, cargo, location, reservation, and payment operations in Macsim Cargo.',
      'Wardrobe, image-analysis, location, and recommendation workflows in AI Stylist.',
    ],
  },
  {
    slug: 'nextjs-web-engineering',
    eyebrow: 'Web engineering',
    title: 'Next.js web application engineering',
    searchTitle: 'Next.js Full-Stack Web Engineer | Joel Mbaka',
    description:
      'Next.js and React engineering for workflow-heavy web applications, operational dashboards, public product websites, authenticated workspaces, and responsive data-rich interfaces.',
    intro:
      'My web work covers both public-facing product surfaces and authenticated operational systems. I focus on workflows, information architecture, data loading, permissions, responsive UI, and the backend contracts that make the interface reliable.',
    technologies: ['Next.js', 'React', 'TypeScript', 'TanStack Query', 'Tailwind CSS', 'shadcn/ui', 'Playwright'],
    evidenceProjectIds: ['clivique-hmis', 'rentpayor', 'macsim'],
    highlights: [
      'Multi-department hospital workflows and facility operations in CliviQue HMIS.',
      'Property-management lead intelligence and outbound operations in the RentPayor CRM.',
      'Cargo, fleet, driver, finance, and staff administration in Macsim back-office tooling.',
      'Search-oriented product websites with canonical metadata, structured data, sitemaps, robots controls, and intent-specific landing pages.',
    ],
  },
  {
    slug: 'fastapi-postgresql-backends',
    eyebrow: 'Backend & data',
    title: 'FastAPI and PostgreSQL backend engineering',
    searchTitle: 'FastAPI & PostgreSQL Backend Engineer | Joel Mbaka',
    description:
      'Python, FastAPI, SQLAlchemy, Alembic, and PostgreSQL backend engineering for transactional products, workflow systems, payments, APIs, and relational business data.',
    intro:
      'I design backend systems around the actual business state that must remain correct: invoices and balances, patient and facility scope, cargo and driver payments, journal entries, authentication, callbacks, and long-running operational workflows.',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'REST APIs', 'Docker'],
    evidenceProjectIds: ['rentpayor', 'clivique-hmis', 'macsim', 'journpad', 'ai-stylist'],
    highlights: [
      'Rent invoices, partial payments, carried-forward credits, receipts, and automatic reconciliation in RentPayor.',
      'Patient, facility, billing, clinical workflow, and M-Pesa payment state in CliviQue HMIS.',
      'Idempotent driver payouts, callback handling, and ledger accounting in Macsim Cargo.',
      'Voice-entry processing and AI-assisted metadata workflows in JournPad.',
    ],
  },
  {
    slug: 'ai-integrations-automation',
    eyebrow: 'AI & automation',
    title: 'AI integrations and product automation',
    searchTitle: 'AI Integration & Automation Engineer | Joel Mbaka',
    description:
      'Practical AI integration for voice processing, image understanding, recommendation systems, content automation, lead research, enrichment, and human-reviewed operational workflows.',
    intro:
      'I use AI where it removes real product friction or operational work. The focus is on reliable integration, structured outputs, review boundaries, data flow, and fitting model behavior into a broader application rather than treating the model as the product by itself.',
    technologies: ['Python', 'AI APIs', 'CrewAI', 'LLM integrations', 'Speech-to-text', 'Image understanding', 'Automation'],
    evidenceProjectIds: ['journpad', 'ai-stylist', 'rentpayor'],
    highlights: [
      'Voice transcription and AI-assisted organization for JournPad entries.',
      'Image analysis and weather-aware outfit recommendation workflows in AI Stylist.',
      'Lead discovery, enrichment, scoring, outreach drafting, and reply-review automation around RentPayor.',
      'Autonomous article planning, drafting, repair, quality checks, and publishing for JournPad’s content pipeline.',
    ],
  },
];

export function findExpertiseArea(slug: string) {
  return expertiseAreas.find((area) => area.slug === slug);
}
