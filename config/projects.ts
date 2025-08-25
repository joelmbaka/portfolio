export type ProjectType = 'SaaS' | 'Enterprise';

export interface Project {
  title: string;
  description: string;
  tech: string[];
  type: ProjectType;
  url?: string;
  screenshots?: string[];
}

export const projects: Project[] = [
  {
    title: "AI Journal",
    description: "A smart journaling app that converts speech to written journal entries using AI transcription. Features semantic search to retrieve past entries by meaning, mood tracking, and intelligent insights about your thoughts and patterns.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "OpenAI Whisper",
      "OpenAI Embeddings",
      "Pinecone Vector DB",
      "Supabase",
      "Expo Router"
    ],
    type: "SaaS",
    url: "https://aijournal.joelmbaka.site"
  },
  {
    title: "AI Python Kids Tutor",
    description: "An interactive AI-powered learning platform that teaches Python programming to kids aged 8-18. Features gamified lessons, real-time code assistance, and adaptive learning paths tailored to each child's skill level.",
    tech: [
      "Expo",
      "React Native",
      "TypeScript",
      "OpenAI GPT-5",
      "Python",
      "Firebase",
      "Tailwind CSS"
    ],
    type: "SaaS",
    url: "https://pythontutor.joelmbaka.site"
  },
  {
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
    url: "https://fitness.joelmbaka.site"
  },
  {
    title: "Health Care Delivery App",
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
    url: "https://healthcare.joelmbaka.site"
  },
  {
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
    url: "https://hotels.joelmbaka.site"
  },
  {
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
    url: "https://rentals.joelmbaka.site"
  }
];
