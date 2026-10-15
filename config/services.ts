export type ServiceArea = {
  slug: string;
  eyebrow: string;
  title: string;
  searchTitle: string;
  description: string;
  summary: string;
  problems: string[];
  deliverables: string[];
  approach: string[];
  proofIds: string[];
};

export const services: ServiceArea[] = [
  {
    slug: 'react-native-app-development',
    eyebrow: 'Mobile applications',
    title: 'React Native mobile app development',
    searchTitle: 'React Native App Development | Joeltech Geek Systems',
    description: 'Build Android and iOS mobile applications with React Native, Expo and TypeScript. Kenya-based, globally available engineering for SaaS, operations and customer-facing apps.',
    summary: 'We specialize in React Native rather than splitting our mobile engineering across unrelated frameworks. One product architecture supports Android and iOS, with platform-specific testing, native integrations and releases where needed.',
    problems: [
      'Customers or field teams need a dependable mobile workflow instead of spreadsheets and disconnected messages.',
      'An existing app needs better navigation, API integration, payment handling or production stability.',
      'A founder needs to launch a cross-platform product and maintain one coherent codebase.',
    ],
    deliverables: [
      'React Native / Expo application design and implementation',
      'Android and iOS release engineering where supported by the project',
      'Authentication, offline-aware states, device capabilities and notifications',
      'API integration, testing, analytics and post-launch improvement',
    ],
    approach: [
      'Map the real user journeys and mobile device constraints first.',
      'Build with React Native, Expo and TypeScript; connect to tested backend contracts.',
      'Validate critical journeys and release for the agreed platforms.',
    ],
    proofIds: ['rentpayor', 'journpad', 'schoolpey', 'macsim', 'milliol'],
  },
  {
    slug: 'web-app-development',
    eyebrow: 'Web platforms',
    title: 'Next.js web application and dashboard development',
    searchTitle: 'Next.js Web Apps & Dashboards | Joeltech Geek Systems',
    description: 'Custom web applications, SaaS dashboards and business portals built with Next.js, React and TypeScript, with responsive workflows and secure API-backed operations.',
    summary: 'We create operational web applications rather than treating every project as a brochure website. Teams get clear permissions, actionable records, responsive interfaces and reliable connections to the systems behind them.',
    problems: [
      'Managers cannot reliably see financial, operational or customer activity in one place.',
      'The business has outgrown spreadsheet-based administration.',
      'A SaaS product needs authenticated workspaces and role-aware dashboards.',
    ],
    deliverables: [
      'Next.js and React dashboards, portals and administrative tools',
      'Responsive workflows, search, filters, reporting and permissions',
      'Backend integrations, validation, accessibility and testing',
      'Search-ready public-facing routes where the product needs them',
    ],
    approach: [
      'Define user roles, core tasks and data visibility before building screens.',
      'Implement interfaces alongside APIs and transaction-level business rules.',
      'Test real workflows in the browser at desktop and mobile widths.',
    ],
    proofIds: ['rentpayor', 'schoolpey', 'clivique-hmis', 'macsim'],
  },
  {
    slug: 'fastapi-backend-development',
    eyebrow: 'Backend engineering',
    title: 'Python, FastAPI and PostgreSQL backend development',
    searchTitle: 'FastAPI & PostgreSQL Development | Joeltech Geek Systems',
    description: 'Python FastAPI backend development, PostgreSQL data modeling, REST APIs, secure authorization, SQLAlchemy, Alembic migrations and production business workflows.',
    summary: 'Backend correctness matters when software manages invoices, patients, inventory or transactions. We build APIs and data models around enforceable business rules, clear authorization and reliable state changes.',
    problems: [
      'An application needs secure and maintainable backend APIs.',
      'Payment, billing and operational records need trustworthy state transitions.',
      'A growing product needs a clearer relational model and migrations.',
    ],
    deliverables: [
      'FastAPI and REST API design, implementation and documentation',
      'PostgreSQL, SQLAlchemy and Alembic database engineering',
      'Authentication, role-based access and tenant or facility isolation',
      'Webhooks, background workflows, idempotency and automated backend tests',
    ],
    approach: [
      'Model the business entities, authorization boundaries and failure cases.',
      'Implement explicit schemas, migrations, API contracts and tests.',
      'Validate transaction and callback behavior before production release.',
    ],
    proofIds: ['rentpayor', 'clivique-hmis', 'schoolpey', 'macsim'],
  },
  {
    slug: 'saas-product-development',
    eyebrow: 'Product engineering',
    title: 'SaaS and end-to-end product development',
    searchTitle: 'SaaS Product Development | Joeltech Geek Systems',
    description: 'From product requirements to production SaaS: mobile apps, web dashboards, backend APIs, tenancy, subscriptions, billing, testing and release.',
    summary: 'We develop complete products, including customer experiences and the internal operational systems that help teams run them. Our own products are practical evidence of this end-to-end approach.',
    problems: [
      'A founder has a product concept but needs a production-minded implementation.',
      'An MVP needs invoicing, permissions, reporting or subscription workflows to become commercially useful.',
      'A business wants a maintainable product rather than disconnected applications.',
    ],
    deliverables: [
      'Discovery, scope and technical architecture',
      'Web/mobile interfaces and backend/data engineering',
      'Account roles, billing, subscription and operational workflows',
      'Testing, launch support and iterative improvement',
    ],
    approach: [
      'Define the smallest complete customer workflow and success criteria.',
      'Build the user experience and its business-state foundation together.',
      'Launch with measured quality checks and iterate based on feedback.',
    ],
    proofIds: ['rentpayor', 'schoolpey', 'clivique-hmis', 'journpad'],
  },
  {
    slug: 'payment-integrations',
    eyebrow: 'Financial workflows',
    title: 'M-Pesa payments, invoicing and reconciliation',
    searchTitle: 'M-Pesa Payments & Reconciliation | Joeltech Geek Systems',
    description: 'Integrate M-Pesa payment collection into apps with invoice matching, webhooks, idempotent callbacks, receipts, partial payments and reconciliation.',
    summary: 'A successful payment prompt is only the beginning. Good payment software confirms the provider result, links it to the correct obligation, updates balances safely and leaves a usable audit trail.',
    problems: [
      'Payments arrive without a reliable connection to an invoice or customer.',
      'Partial payments and credits are difficult to account for.',
      'Duplicate or delayed callbacks create inconsistent financial records.',
    ],
    deliverables: [
      'Payment API integration including M-Pesa and supported providers',
      'Invoice-linked payment initiation, confirmation and receipts',
      'Reconciliation, balances, credits and duplicate-callback protection',
      'Permission-aware finance reports and operational testing',
    ],
    approach: [
      'Map financial states, provider results and reconciliation rules first.',
      'Implement validated callback and idempotency controls.',
      'Test successful, delayed, duplicate, partial and failed payment paths.',
    ],
    proofIds: ['rentpayor', 'schoolpey', 'clivique-hmis', 'macsim'],
  },
  {
    slug: 'ai-api-integrations',
    eyebrow: 'Applied AI',
    title: 'AI API integration and workflow automation',
    searchTitle: 'AI API & LLM Application Integration | Joeltech Geek Systems',
    description: 'Integrate existing AI, speech-to-text, image-understanding and LLM APIs into practical mobile and web products. Application engineering, not model training.',
    summary: 'We apply existing AI models through APIs to solve specific product problems. This includes transcription, document or image understanding, structured responses and human-reviewed automation—not building or training foundation models.',
    problems: [
      'Users need to turn voice or unstructured input into useful product records.',
      'Manual categorization, summarization or review slows down workflows.',
      'An AI proof of concept needs proper authentication, validation and product behavior.',
    ],
    deliverables: [
      'LLM and speech-to-text service integrations',
      'Structured outputs with application-level validation and review',
      'Voice, audio and image-aware user experiences',
      'Monitoring of quality, cost, latency and fallback behavior',
    ],
    approach: [
      'Start with the user task and decide whether AI genuinely improves it.',
      'Connect existing model APIs through clear, testable backend contracts.',
      'Keep sensitive data, failure modes and human review in scope.',
    ],
    proofIds: ['journpad', 'rentpayor'],
  },
];

export const findService = (slug: string) => services.find((service) => service.slug === slug);
