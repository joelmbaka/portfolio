export interface Project {
  title: string;
  description: string;
  tech: string[];
  url?: string;

  screenshots?: string[];
}

export const projects: Project[] = [
  {
    title: "My Personal Blog",
    description: "A clean, responsive portfolio built with typed React components and Next.js. Showcases my skills, projects, and professional profile in a fast, engaging format.",
    tech: [
      "Next.js 15",
      "React 19",
      "TypeScript 5",
      "Tailwind CSS 3",
      "Framer Motion",
      "Lucide-React"
    ],
    url: "https://joelmbaka.site",
    screenshots: [
    //  "/images/personal_blog1.webp",
    ]
  },
  {
    title: "Weight Loss & Fitness App",
    description: "A modern fitness tracking application built with TypeScript and Firebase.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "Firebase",
      "Expo Router",
      "EAS CI/CD"
    ],
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
    url: "https://healthcare.joelmbaka.site"
  },
  {
    title: "Landlord Monthly Invoicing & Utilities App",
    description: "A cross-platform React Native app that lets property owners list, book, and manage every rental’s operations—from pricing to payments—in one mobile dashboard.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "Firebase",
      "Stripe",
      "Expo Router",
      "EAS CI/CD"
    ],
    url: "https://rentals.joelmbaka.site"
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
    url: "https://hotels.joelmbaka.site"
  }
];