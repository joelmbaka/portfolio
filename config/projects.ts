export interface Project {
  title: string;
  description: string;
  tech: string[];
  url?: string;
}

export const projects: Project[] = [
  {
    title: "AI Ecommerce Builder",
    description: "AI-powered ecommerce builder",
    tech: ["GRANDSTACK", "Typescript", "OpenAI"],
    url: "https://joelmbaka.site"
  },
];