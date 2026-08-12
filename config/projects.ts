export type ProjectType = 'SaaS' | 'Enterprise';

export interface ProjectScreenshots {
  web?: string[];
  app?: string[];
}

export interface ProjectStorePreview {
  src: string;
  platform: 'ios' | 'android' | 'web';
  crop?: 'details' | 'title';
}

export interface ProjectEnhancement {
  title: string;
  description: string;
  tech: string[];
  screenshots?: string[];
  url?: string;
  note?: string;
}

export interface Project {
  id: string;
  aliases?: string[];
  title: string;
  description: string;
  updatedAt: string;
  tech: string[];
  type: ProjectType;
  url?: string;
  icon?: string;
  iconBackground?: string;
  storePreview?: ProjectStorePreview;
  screenshots?: ProjectScreenshots;
  enhancements?: ProjectEnhancement[];
  appStore?: {
    url: string;
  };
  playStore?: {
    url: string;
  };
}

export const projects: Project[] = [
  {
    id: 'journpad',
    title: 'JournPad: Voice Journal',
    description:
      'Voice-first journaling app that preserves the original recording, transcribes spoken entries, and uses AI to generate useful titles, summaries, and categories. Entries can be searched and revisited by date, linked to goals, supported by reminders and prompts, and protected with account, deletion, and optional biometric controls.',
    updatedAt: '2026-08-12',
    tech: [
      'Expo',
      'React Native',
      'TypeScript',
      'Google Cloud',
      'Python',
      'Docker',
      'AI APIs',
    ],
    type: 'SaaS',
    url: 'https://journpad.com',
    icon: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/icon.png',
    storePreview: {
      platform: 'ios',
      src: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/store/card-focused-v2.png',
    },
    screenshots: {
      app: [
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/app-screenshots/01_home_weekly_entries.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/app-screenshots/02_new_entry_goal_prompt.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/app-screenshots/03_entry_detail_playback_summary.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/app-screenshots/04_goals_list.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/app-screenshots/05_career_goal_detail.png',
      ],
    },
    enhancements: [
      {
        title: 'AI Blog Writing Agent',
        description:
          'Autonomous publishing pipeline that plans JournPad topics, drafts articles, repairs structure, improves titles and excerpts, polishes voice, quality-checks the final post, and publishes up to two articles per day.',
        tech: [
          'Python',
          'CrewAI',
          'FastAPI',
          'SQLAlchemy',
          'PostgreSQL',
          'Vercel Blob',
          'Pillow',
          'systemd',
        ],
        screenshots: [
          'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/enhancements/blog-writer/blog.png',
        ],
        url: 'https://journpad.com/blog',
        note: 'Code available upon request.',
      },
    ],
    appStore: {
      url: 'https://apps.apple.com/ke/app/journpad/id6754232534',
    },
    playStore: {
      url: 'https://play.google.com/store/apps/details?id=com.joelmbaka.journal',
    },
  },
  {
    id: 'rentpayor',
    title: 'RentPayor',
    description:
      'Rent collection and reconciliation software for landlords and property managers. RentPayor creates rent invoices, lets tenants pay KES rent through an invoice-linked M-Pesa flow, automatically reconciles confirmed payments, and keeps partial balances, carried-forward credits, receipts, leases, units, tenants, and manual payment records in one rent ledger.',
    updatedAt: '2026-08-12',
    tech: [
      'Expo',
      'React Native',
      'TypeScript',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Firebase Auth',
      'M-Pesa',
      'Expo Router',
      'Jest',
    ],
    type: 'Enterprise',
    url: 'https://rentpayor.com',
    icon: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/rentpayor/icon.png',
    storePreview: {
      platform: 'android',
      src: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/rentpayor/store/card-focused-v2.png',
    },
    screenshots: {
      app: [
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/rentpayor/app-screenshots/01_know_who_has_paid.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/rentpayor/app-screenshots/02_match_rent_payments.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/rentpayor/app-screenshots/03_manage_every_rental_property.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/rentpayor/app-screenshots/04_track_leases_and_occupancy.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/rentpayor/app-screenshots/05_tenant_payment_records.png',
      ],
    },
    enhancements: [
      {
        title: 'CRM Dashboard',
        description:
          'Web CRM for inspecting property-management leads, tracking calls, due follow-ups, contact status, outreach drafts, reply reviews, competitor leads, and lead intelligence from one sales workspace.',
        tech: [
          'Next.js',
          'React',
          'TypeScript',
          'Tailwind CSS',
          'shadcn/ui',
          'TanStack Table',
          'Recharts',
          'Playwright',
        ],
        screenshots: [
          'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/rentpayor/enhancements/crm/dashboard.png',
        ],
        note: 'Code available upon request.',
      },
      {
        title: 'Lead Generation and Enrichment',
        description:
          'Agent-assisted pipeline that discovers property-management firms, reads public website/search evidence, classifies fit, extracts contacts, detects competitor-software risk, scores priority, and prepares reliable targets for review.',
        tech: [
          'Python',
          'FastAPI',
          'SQLAlchemy',
          'PostgreSQL',
          'httpx',
          'Litellm',
          'OpenAI',
          'Serper',
        ],
        note: 'Code available upon request.',
      },
      {
        title: 'Sales Automation',
        description:
          'Outbound workflow that generates personalized email drafts, queues daily outreach within limits, tracks delivery/open/click/reply events, reviews replies with AI, and schedules reminders for follow-up.',
        tech: [
          'Python',
          'FastAPI',
          'PostgreSQL',
          'SQLAlchemy',
          'Litellm',
          'OpenAI',
          'SMTP/Webhooks',
        ],
        note: 'Code available upon request.',
      },
    ],
    appStore: {
      url: 'https://apps.apple.com/ke/app/rentpayor/id6765710822',
    },
    playStore: {
      url: 'https://play.google.com/store/apps/details?id=com.joelmbaka.rentpayor',
    },
  },
  {
    id: 'macsim',
    title: 'Macsim Cargo',
    description:
      'Cargo and logistics operations platform spanning mobile field workflows and back-office administration. Macsim handles loads, reservations, driver assignments, trip tracking, documents, notifications, fleet operations and finance, with a guarded M-Pesa/Daraja flow for funding a collection-account ledger and paying drivers in full or partial load installments.',
    updatedAt: '2026-07-31',
    tech: [
      'Expo',
      'React Native',
      'TypeScript',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Firebase Auth',
      'React Query',
      'M-Pesa Daraja',
    ],
    type: 'Enterprise',
    icon: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/icon.png',
    storePreview: {
      platform: 'android',
      src: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/store/card-focused-v2.png',
    },
    screenshots: {
      app: [
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/app-screenshots/01_admin_load_board.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/app-screenshots/02_active_trip_tracking.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/app-screenshots/03_assignment_detail.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/app-screenshots/04_driver_cargo_board.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/app-screenshots/05_driver_reservation_detail.png',
      ],
    },
    enhancements: [
      {
        title: 'Admin Dashboard',
        description:
          'Backoffice dashboard for cargo operations with load-board oversight, active and completed load counts, fleet and driver management, finance access, staff controls, locations, consignees, and quick operational actions.',
        tech: [
          'Next.js',
          'React',
          'TypeScript',
          'Tailwind CSS',
          'Python',
          'FastAPI',
          'PostgreSQL',
          'Firebase Auth',
          'Vercel Blob',
        ],
        screenshots: [
          'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/enhancements/admin-dashboard/dashboard.png',
        ],
        url: 'https://macsim-website.vercel.app/admin',
        note: 'Code available upon request.',
      },
    ],
    playStore: {
      url: 'https://play.google.com/store/apps/details?id=com.joelmbaka.macsim',
    },
  },
  {
    id: 'ai-stylist',
    title: 'AI Stylist',
    description:
      'Mobile wardrobe-management and outfit-recommendation product. Users create wardrobes, upload clothing photos for AI-assisted category, tag, and description analysis, and generate one-time, daily, or weekly outfit suggestions that can use precise local weather; recommendation history is stored locally in SQLite and designed to sync with the cloud.',
    updatedAt: '2026-05-20',
    tech: [
      'Expo',
      'React Native',
      'TypeScript',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'SQLAlchemy',
      'Alembic',
      'SQLite',
      'Expo Location',
      'OAuth',
    ],
    type: 'SaaS',
    icon: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/ai-stylist/icon.png',
    iconBackground: '#2E1A47',
    storePreview: {
      platform: 'android',
      src: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/ai-stylist/store/card-focused-v2.png',
      crop: 'title',
    },
    screenshots: {
      app: [
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/ai-stylist/app-screenshots/01_home.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/ai-stylist/app-screenshots/02_wardrobe_items.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/ai-stylist/app-screenshots/03_burgundy_blouse_detail.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/ai-stylist/app-screenshots/04_olive_vest_detail.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/ai-stylist/app-screenshots/05_weekly_casual_outfit.png',
      ],
    },
  },
  {
    id: 'clivique-hmis',
    aliases: ['taifa-hmis'],
    title: 'CliviQue HMIS',
    description:
      'Hospital management information system connecting patient registration, OPD, emergency, inpatient care, orders, referrals, theatre, billing, ambulance, mortuary, duty coverage, patient movement, documents, and facility operations. Its latest public draft also adds facility-bound M-Pesa patient invoice collection with encrypted merchant credentials, callback verification, idempotent receipt handling, and invoice reconciliation.',
    updatedAt: '2026-08-02',
    tech: [
      'Next.js',
      'TypeScript',
      'React',
      'TanStack Query',
      'Tailwind CSS',
      'Python',
      'FastAPI',
      'SQLAlchemy',
      'Alembic',
      'PostgreSQL',
      'Playwright',
      'M-Pesa Daraja',
    ],
    type: 'Enterprise',
    url: 'https://clivique.com',
    icon: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/clivique-hmis/frame-16.png',
    screenshots: {
      web: [
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/clivique-hmis/web/doctor-encounters.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/clivique-hmis/web/admin-facility.png',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/clivique-hmis/web/billing-workspace.png',
      ],
    },
  },
];
