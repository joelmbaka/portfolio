export type ProjectContext = {
  domains: string[];
  expertiseSlugs: string[];
  roleLabel?: string;
};

export const projectContext: Record<string, ProjectContext> = {
  journpad: {
    domains: ['Voice AI', 'Consumer SaaS', 'Productivity', 'Subscription apps'],
    expertiseSlugs: [
      'react-native-mobile-engineering',
      'voice-ai-llm-engineering',
      'fastapi-postgresql-backends',
      'authentication-application-security',
      'automated-testing-quality-engineering',
      'mobile-app-release-ci-cd',
      'technical-seo-search-growth',
      'payments-fintech-saas',
    ],
  },
  rentpayor: {
    domains: ['PropTech', 'FinTech', 'Accounting software', 'Rent reconciliation', 'Property management'],
    expertiseSlugs: [
      'react-native-mobile-engineering',
      'fastapi-postgresql-backends',
      'api-engineering-integrations',
      'databases-data-modeling',
      'authentication-application-security',
      'automated-testing-quality-engineering',
      'payments-fintech-saas',
      'technical-seo-search-growth',
      'mobile-app-release-ci-cd',
    ],
  },
  'clivique-hmis': {
    domains: ['Healthcare', 'HMIS', 'Clinical operations', 'Health payments'],
    expertiseSlugs: [
      'nextjs-web-engineering',
      'fastapi-postgresql-backends',
      'api-engineering-integrations',
      'databases-data-modeling',
      'authentication-application-security',
      'automated-testing-quality-engineering',
      'payments-fintech-saas',
      'technical-seo-search-growth',
    ],
    roleLabel: 'Co-founder & Software Engineer',
  },
  macsim: {
    domains: ['Logistics', 'Transport', 'Fleet operations', 'Operational finance'],
    expertiseSlugs: [
      'react-native-mobile-engineering',
      'fastapi-postgresql-backends',
      'api-engineering-integrations',
      'databases-data-modeling',
      'payments-fintech-saas',
      'mobile-app-release-ci-cd',
    ],
  },
  'ai-stylist': {
    domains: ['Consumer AI', 'Fashion technology', 'Recommendation systems'],
    expertiseSlugs: [
      'react-native-mobile-engineering',
      'voice-ai-llm-engineering',
      'fastapi-postgresql-backends',
      'databases-data-modeling',
      'authentication-application-security',
      'mobile-app-release-ci-cd',
    ],
  },
};
