export interface Project {
  title: string;
  description: string;
  tech: string[];
  url?: string;
  artifact?: string;
  screenshots?: string[];
}

export const projects: Project[] = [
  {
    title: "Health Care",
    description: "Cross-platform virtual-care platform connecting patients to licensed doctors for real-time video consultations, booking, and payments. 12,000 monthly users.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "Supabase",
      "Stripe",
      "WebRTC",
      "EAS CI/CD"
    ],
    url: "https://healthcare.joelmbaka.site",
    artifact: "https://expo.dev/artifacts/eas/mE6g54tAXQLNh3TTe4XJn6.aab"
  },
  {
    title: "Hotel Management",
    description: "Hospitality app enabling resort discovery, bookings, dining orders, and payments. 11,800 monthly users.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "Supabase",
      "Stripe",
      "Zustand",
      "Expo Router",
      "EAS CI/CD"
    ],
    url: "https://hotels.joelmbaka.site",
    artifact: "https://expo.dev/artifacts/eas/9aRCBPYmUD2Ti4pw86fy2t.aab"
  },
  {
    title: "Property Management",
    description: "Cross-platform React Native app allowing property owners to list, book, and manage rentals operations—from pricing to payments—in one mobile dashboard. 700 monthly users.",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "Firebase",
      "Stripe",
      "Expo Router",
      "EAS CI/CD"
    ],
    url: "https://rentals.joelmbaka.site",
    artifact: "https://expo.dev/artifacts/eas/taAS15n6khE5A2dQPactuH.aab"
  },
  
  {
    title: "FitnessCoach",
    description: "A modern fitness tracking application built with TypeScript and Firebase for tracking workout sessions, progress, and goals with personalized recommendations.",
    tech: [
      "TypeScript",
      "Firebase",
      "Firestore",
      "Authentication"
    ],
    url: "https://fitness.joelmbaka.site",
    artifact: "https://expo.dev/artifacts/eas/uq7EpfPR7C9dSXgW1gCZmg.aab",
    screenshots: []
  }
];