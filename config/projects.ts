export type ProjectType = 'SaaS' | 'Enterprise';

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  type: ProjectType;
  url?: string;
  screenshots?: string[];
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

// Base site URL for building project links. Use NEXT_PUBLIC_SITE_URL for flexibility across envs.
// Trailing slash is trimmed to avoid double slashes when concatenating paths.
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.site').replace(/\/$/, '');

export const projects: Project[] = [
  {
    id: "python-tutor",
    title: "AI Python Tutor App",
    description: "An interactive mobile application that teaches Python programming to kids using AI-powered tutoring with CrewAI. Features age-appropriate interfaces, adaptive learning paths, and real-time code execution.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "CrewAI",
      "Python",
      "FastAPI",
      "Tailwind CSS"
    ],
    type: "SaaS",
    url: `${BASE_URL}/python-tutor`,
    screenshots: [
      "/images/projects/python-tutor/welcome.jpeg",
      "/images/projects/python-tutor/run-code.jpeg"
    ],
    appStore: {
      url: "https://apps.apple.com/app/id1234567890",
      rating: 4.8,
      reviewsCount: 124
    },
    playStore: {
      url: "https://play.google.com/store/apps/details?id=com.joel.python_tutor",
      rating: 4.7,
      reviewsCount: 210
    }
  },
  {
    id: "ai-journal",
    title: "AI-Powered Journal",
    description: "A revolutionary journaling experience combining voice interactions, intelligent insights, and semantic search. Transforms daily entries into an interactive personal knowledge base with AI-powered summaries and pattern recognition.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "CrewAI",
      "Speech Recognition",
      "Vector DB",
      "Supabase"
    ],
    type: "SaaS",
    url: `${BASE_URL}/ai-journal`,
    screenshots: [
      "/images/projects/ai-journal/settings.jpeg",
      "/images/projects/ai-journal/entry.jpeg",
      "/images/projects/ai-journal/dark-mode-entry.jpeg",
      "/images/projects/ai-journal/report.jpeg",
      "/images/projects/ai-journal/the-report.jpeg"
    ],
    appStore: {
      url: "https://apps.apple.com/app/id9876543210",
      rating: 4.9,
      reviewsCount: 356
    },
    playStore: {
      url: "https://play.google.com/store/apps/details?id=com.joel.ai_journal",
      rating: 4.8,
      reviewsCount: 502
    }
  },
  {
    id: "fitness",
    title: "Personalized AI Workout Plans App",
    description: "A modern fitness tracking application built with TypeScript and Firebase.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "Firebase",
      "Expo Router",
      "EAS CI/CD"
    ],
    type: "SaaS",
    url: `${BASE_URL}/fitness`,
    screenshots: [
      "/images/projects/fitness/completed.jpeg",
      "/images/projects/fitness/week-2.jpeg",
      "/images/projects/fitness/profile.jpeg",
      "/images/projects/fitness/progress.jpeg"
    ],
    appStore: {
      url: "#",
      rating: 4.7,
      reviewsCount: 98
    },
    playStore: {
      url: "#",
      rating: 4.6,
      reviewsCount: 152
    }
  },
  {
    id: "healthcare",
    title: "Remote Physicists Consultation App",
    description: "Cross-platform virtual-care platform that connects patients to licensed doctors for real-time video consultations, booking, and payments.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "Supabase (Auth/RLS/Postgres)",
      "Stripe",
      "WebRTC",
      "EAS CI/CD"
    ],
    type: "SaaS",
    url: `${BASE_URL}/healthcare`,
    screenshots: [
    ],
    appStore: {
      url: "#",
      rating: 4.8,
      reviewsCount: 64
    },
    playStore: {
      url: "#",
      rating: 4.7,
      reviewsCount: 89
    }
  },
  {
    id: "hospitality",
    title: "Hospitality & Bookings App",
    description: "Hospitality app enabling resort discovery, bookings, dining orders, and payments.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "Supabase (Auth/RLS/Postgres)",
      "Stripe",
      "Zustand",
      "Expo Router",
      "EAS CI/CD"
    ],
    type: "Enterprise",
    url: `${BASE_URL}/hotels`,
    screenshots: [
    ],
    appStore: {
      url: "#",
      rating: 4.6,
      reviewsCount: 43
    },
    playStore: {
      url: "#",
      rating: 4.5,
      reviewsCount: 57
    }
  },
  {
    id: "property-management",
    title: "Landlord Monthly Invoicing & Utilities App",
    description: "A cross-platform React Native app that lets property owners list, book, and manage every rental's operations—from pricing to payments—in one mobile dashboard.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "Firebase",
      "Stripe",
      "Expo Router",
      "EAS CI/CD"
    ],
    type: "Enterprise",
    url: `${BASE_URL}/rentals`,
    screenshots: [
    ],
    appStore: {
      url: "#",
      rating: 4.7,
      reviewsCount: 72
    },
    playStore: {
      url: "#",
      rating: 4.6,
      reviewsCount: 95
    }
  }
];
