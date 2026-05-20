export type ProjectType = 'SaaS' | 'Enterprise';

export interface ProjectScreenshots {
  ios?: string[];
  android?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  type: ProjectType;
  url?: string;
  icon?: string;
  iconBackground?: string;
  screenshots?: ProjectScreenshots;
  appStore?: {
    url: string;
    rating?: number; // 0-5
    reviewsCount?: number;
  };
  playStore?: {
    url: string;
    rating?: number; // 0-5
    reviewsCount?: number;
  };
}

export const projects: Project[] = [
  {
    id: 'journpad',
    title: 'JournPad: AI Voice Journal',
    description:
      'JournPad is an AI-assisted voice journaling app that turns your spoken thoughts into organized, searchable entries. Record hands-free and get automatic titles, summaries, subjects, keywords, and smart categories, plus an insights dashboard that visualizes your journaling patterns over time.',
    tech: [
      'Expo',
      'React Native',
      'TypeScript',
      'Google Cloud',
      'Python',
      'Docker',
      'OpenAI',
    ],
    type: 'SaaS',
    url: 'https://journpad.com',
    icon: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/icon.png',
    screenshots: {
      ios: [
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/ios/iphone-01.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/ios/iphone-02.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/ios/iphone-03.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/ios/iphone-04.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/ios/iphone-05.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/ios/iphone-06.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/ios/iphone-07.jpeg',
      ],
      android: [
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/android/android-01.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/android/android-02.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/android/android-03.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/android/android-04.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/android/android-05.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/android/android-06.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/android/android-07.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/android/android-08.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/android/android-09.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/journpad/android/android-10.jpeg',
      ],
    },
    appStore: {
      url: 'https://apps.apple.com/ke/app/journpad/id6754232534',
      // You can update these as real ratings come in
      rating: 4.9,
      reviewsCount: 50,
    },
    playStore: {
      url: 'https://play.google.com/store/apps/details?id=com.joelmbaka.journal',
      rating: 4.9,
      reviewsCount: 50,
    },
  },
  {
    id: 'taifa-hmis',
    title: 'Taifa HMIS',
    description:
      'Hospital operations platform built around real facility workflows across reception, triage, doctor review, lab, imaging, pharmacy, billing, admissions, and insurance-aware care delivery.',
    tech: [
      'Next.js',
      'TypeScript',
      'Python',
      'FastAPI',
      'SQLAlchemy',
      'Alembic',
      'PostgreSQL',
      'Tailwind CSS',
    ],
    type: 'Enterprise',
    icon: '/images/projects/taifa-hmis-icon.png',
    screenshots: {
      ios: ['/images/projects/taifa-hmis-icon.png'],
      android: ['/images/projects/taifa-hmis-icon.png'],
    },
  },
  {
    id: 'rentpayor',
    title: 'RentPayor',
    description:
      'Rent collection and reconciliation system for landlords, designed to match messy M-Pesa, bank, and cash payments against invoices while keeping landlords in control of final approval.',
    tech: [
      'Expo',
      'React Native',
      'TypeScript',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Firebase Auth',
      'Expo Router',
      'Jest',
    ],
    type: 'Enterprise',
    icon: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/rentpayor/icon.png',
    screenshots: {
      ios: ['/images/projects/rentpayor-icon.png'],
      android: ['/images/projects/rentpayor-icon.png'],
    },
  },
  {
    id: 'macsim',
    title: 'Macsim Cargo',
    description:
      'Logistics and cargo operations app with live location features, booking support, document scanning, notifications, and payment-related operational tooling for transport workflows.',
    tech: [
      'Expo',
      'React Native',
      'TypeScript',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Firebase Auth',
      'React Query',
    ],
    type: 'Enterprise',
    icon: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/icon.png',
    screenshots: {
      ios: ['/images/projects/macsim-welcome.png'],
      android: [
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/android/android-01.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/android/android-02.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/android/android-03.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/android/android-04.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/android/android-05.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/android/android-06.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/android/android-07.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/android/android-08.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/android/android-09.jpeg',
        'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/macsim/android/android-10.jpeg',
      ],
    },
  },
  {
    id: 'taxipoa',
    title: 'TaxiPoa',
    description:
      'Kenya-focused ride-hailing platform with rider and driver flows, map and location support, document-based KYC, secure authentication, and payments-aware transport operations.',
    tech: [
      'Expo',
      'React Native',
      'TypeScript',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Firebase Auth',
      'Google Maps',
    ],
    type: 'SaaS',
    icon: '/images/projects/taxipoa-icon.png',
    screenshots: {
      ios: ['/images/projects/taxipoa-icon.png'],
      android: ['/images/projects/taxipoa-icon.png'],
    },
  },
  {
    id: 'ai-stylist',
    title: 'AI Stylist',
    description:
      'AI-powered wardrobe assistant that analyzes clothing items, organizes a personal closet, and generates outfit recommendations using image understanding, subscriptions, and weather-aware suggestions.',
    tech: [
      'Expo',
      'React Native',
      'TypeScript',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'SQLite',
      'OAuth',
    ],
    type: 'SaaS',
    icon: 'https://cwfjswqaokrwlegr.public.blob.vercel-storage.com/ai-stylist/icon.png',
    iconBackground: '#2E1A47',
    screenshots: {
      ios: ['/images/projects/ai-stylist-icon.png'],
      android: ['/images/projects/ai-stylist-icon.png'],
    },
  },
];
