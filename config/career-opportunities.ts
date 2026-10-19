export type CareerSlug = 'engineers' | 'internships' | 'saas' | 'agents';

export type CareerOpportunity = {
  slug: CareerSlug;
  anchor: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  summary: string;
  introduction: string;
  highlights: string[];
  responsibilities: string[];
  suitableFor: string[];
  steps: { title: string; description: string }[];
  termsHeading: string;
  terms: string[];
  examples?: { name: string; need: string }[];
  faqs: { question: string; answer: string }[];
  interestInstructions: string;
};

export const careerOpportunities: CareerOpportunity[] = [
  {
    slug: 'engineers',
    anchor: 'engineering',
    eyebrow: 'Engineering collaborations',
    title: 'Software Engineers',
    seoTitle: 'Software Engineering Opportunities | Joeltech Geek Systems',
    description: 'Explore engineering collaborations at Joeltech Geek Systems for React Native, Expo, Next.js, FastAPI and PostgreSQL developers.',
    summary: 'Collaborate on mobile, web and backend software when a suitable engineering project or position becomes available.',
    introduction: 'We welcome experienced engineers who want to help deliver dependable software for customers and our own products. Projects may involve complete applications, specific modules or long-term product improvements.',
    highlights: ['React Native, Expo and TypeScript', 'Next.js, FastAPI and PostgreSQL', 'Testing, code review and production delivery'],
    responsibilities: [
      'Implement, review and test features within an agreed project scope.',
      'Work with business requirements, API contracts and reliable data handling.',
      'Communicate engineering trade-offs, progress and delivery risks clearly.',
    ],
    suitableFor: [
      'Engineers who can demonstrate working software or code contributions.',
      'Specialists in one or more core technologies, not necessarily every technology in our stack.',
      'Reliable collaborators comfortable with agreed milestones and feedback.',
    ],
    steps: [
      { title: 'Share your work', description: 'Send your focus areas, portfolio and availability.' },
      { title: 'Discuss project fit', description: 'We review interest when relevant engineering work becomes available.' },
      { title: 'Agree written terms', description: 'Compensation, scope and working arrangements are confirmed before work.' },
    ],
    termsHeading: 'Engineering engagement',
    terms: [
      'This is an expression-of-interest channel, not an advertised current job vacancy.',
      'Paid project work or employment, when available, is subject to a written agreement covering duties, location, schedule and compensation.',
      'A submission does not guarantee a placement, employment, relocation or visa sponsorship.',
    ],
    faqs: [
      { question: 'Is there an open salaried position?', answer: 'No specific salaried opening is advertised here. We welcome enquiries for appropriate future work.' },
      { question: 'Can I work remotely?', answer: 'Potentially. Remote collaboration and time-zone requirements depend on the actual project.' },
      { question: 'Do I need to know every technology?', answer: 'No. Demonstrable strength in a relevant area is more important than listing every tool.' },
      { question: 'What should I include?', answer: 'A short introduction, core engineering skills, links to projects or code, time zone and availability.' },
    ],
    interestInstructions: 'Share your engineering focus, a CV or portfolio, examples of shipped projects, your location or time zone, and availability.',
  },
  {
    slug: 'internships',
    anchor: 'internships',
    eyebrow: 'Engineering & learning',
    title: 'Internships',
    seoTitle: 'Software Development Internships | Joeltech Geek Systems',
    description: 'Express interest in software engineering internships involving React Native, Next.js, APIs, databases, testing and practical development skills.',
    summary: 'Build practical software development skills through guided work and feedback when an internship is available.',
    introduction: 'Our internship pathway is intended for emerging developers who want to learn how requirements become tested, working software. An opportunity depends on our capacity to supervise meaningful project work.',
    highlights: ['Frontend and mobile development', 'APIs, databases and tests', 'Engineering feedback and product thinking'],
    responsibilities: [
      'Learn to turn requirements into manageable development tasks.',
      'Practice building interfaces, backend features or tests under guidance.',
      'Share progress, ask questions and improve work through review.',
    ],
    suitableFor: [
      'Students, recent graduates and self-taught developers with programming fundamentals.',
      'Applicants with coursework, independent projects or GitHub work to discuss.',
      'People ready to learn consistently and take feedback seriously.',
    ],
    steps: [
      { title: 'Introduce yourself', description: 'Share what you know, have built and want to learn.' },
      { title: 'Check capacity', description: 'We consider whether suitable tasks and supervision are available.' },
      { title: 'Confirm placement', description: 'Any placement is agreed with clear duration, expectations and conditions.' },
    ],
    termsHeading: 'Placement conditions',
    terms: [
      'Expression of interest does not guarantee an available internship, placement or later employment.',
      'Duration, location, schedule, supervision and any stipend are confirmed before an internship begins.',
      'The internship pathway is not an accredited training programme or qualification.',
    ],
    faqs: [
      { question: 'Are you accepting interns right now?', answer: 'You can express interest, but an actual opening depends on projects and supervision capacity.' },
      { question: 'Do I need professional experience?', answer: 'No. Show us a programming foundation and examples of your learning or projects.' },
      { question: 'Is there a stipend?', answer: 'Any stipend and other conditions must be confirmed for a specific placement. None is assumed here.' },
      { question: 'Is this mentorship?', answer: 'No. General developer mentorship is separate; internships involve an agreed placement when one is available.' },
    ],
    interestInstructions: 'Tell us your current skill level, projects, learning goals, location and availability. A GitHub link is welcome.',
  },
  {
    slug: 'saas',
    anchor: 'sales',
    eyebrow: 'Existing products',
    title: 'SaaS Sales Partners',
    seoTitle: 'SaaS Sales Partnerships | Joeltech Geek Systems',
    description: 'Help businesses discover existing Joeltech Geek Systems software products such as RentPayor and SchoolPey through a product-specific partnership.',
    summary: 'Introduce businesses to existing products such as RentPayor and SchoolPey, with rewards under product-specific partner terms.',
    introduction: 'This pathway is for people who can connect customers with software products we already offer. Rather than commissioning something new, the customer selects a suitable existing product.',
    highlights: ['Products with defined customer workflows', 'Qualified introductions and follow-up', 'Partner terms specific to each product'],
    responsibilities: [
      'Identify businesses whose needs match an eligible product.',
      'Explain verified features accurately and arrange qualified introductions.',
      'Support demonstrations or customer follow-ups where agreed.',
    ],
    suitableFor: [
      'People with useful connections to landlords, property managers or schools.',
      'Independent sales professionals or customer-facing business developers.',
      'Partners willing to understand a product before discussing it with customers.',
    ],
    steps: [
      { title: 'Learn a product', description: 'Understand the customer problem and current product capabilities.' },
      { title: 'Introduce customers', description: 'Refer qualified and interested decision-makers.' },
      { title: 'Earn eligible rewards', description: 'Any reward follows that product’s written partnership conditions.' },
    ],
    termsHeading: 'Partner rewards',
    terms: [
      'This is an independent partnership opportunity, not an advertised salaried position.',
      'Rates, attribution rules, customer eligibility and payout timing differ by SaaS product and are agreed in writing.',
      'Partners must not promise unapproved prices, features, discounts or implementation timelines.',
    ],
    faqs: [
      { question: 'Which products can I introduce?', answer: 'Examples include RentPayor for property operations and SchoolPey for fee management. Eligibility is confirmed before outreach.' },
      { question: 'Is this the same as Sales Agents?', answer: 'No. SaaS Sales Partners introduce customers to existing products. Sales Agents identify customers needing new custom software.' },
      { question: 'How much commission can I earn?', answer: 'Rates and eligibility vary by product. We confirm the applicable partner terms before you refer customers.' },
      { question: 'Do I need to be a developer?', answer: 'No. Understanding the product and the customer’s problem matters more than programming knowledge.' },
    ],
    interestInstructions: 'Share your town, sales or customer-facing experience, customer network and which existing product interests you.',
  },
  {
    slug: 'agents',
    anchor: 'agents',
    eyebrow: 'Custom software referrals',
    title: 'Sales Agents',
    seoTitle: 'Sales Agents — Custom Software Referrals | Joeltech Geek Systems',
    description: 'Connect businesses in Kenya with custom mobile apps, web dashboards, portals, POS systems and operational software development projects.',
    summary: 'Identify businesses that need custom software built for them and earn commission on successful, eligible development projects.',
    introduction: 'Businesses often rely on disconnected systems, paper records or manual processes. You identify those needs and introduce interested decision-makers. Joeltech Geek Systems handles technical discovery, proposals, pricing, contracts and delivery.',
    highlights: ['Web dashboards, mobile apps, POS and portals', 'Potential customers across Kenyan industries', 'Proposed 5%–10% success-based commission'],
    responsibilities: [
      'Talk with business owners or managers to understand operational challenges.',
      'Secure permission for an introduction to a relevant decision-maker.',
      'Share qualified opportunities and support agreed follow-up, without making technical or pricing promises.',
    ],
    suitableFor: [
      'Independent salespeople or business developers anywhere in Kenya.',
      'People who know local businesses and can discuss their challenges professionally.',
      'Reliable partners who respect customer information and follow through.',
    ],
    steps: [
      { title: 'Identify a need', description: 'Find a business struggling with manual processes, inaccessible data or disconnected software.' },
      { title: 'Introduce the client', description: 'We assess the need, budget, fit and technical scope with the decision-maker.' },
      { title: 'Contract and earn', description: 'We agree and deliver qualifying projects; commission follows collected payments under written terms.' },
    ],
    termsHeading: 'Commission and payment terms',
    terms: [
      'Proposed pilot rates: 5% for an accepted, qualified introduction or 10% for an agent who actively qualifies the customer and supports the agreed sales process. Rates are not guaranteed until confirmed in a written agreement.',
      'Commission is calculated only on eligible software development fees actually collected, excluding VAT, hosting, hardware, third-party licences and other pass-through expenses.',
      'When a client pays in milestones, eligible commissions follow the collected milestones subject to agreed terms. Leads, meetings and unsigned proposals alone do not earn commission.',
      'Each introduction must be attributable, accepted and new to the business. Maintenance, renewals, expenses and unusually large contracts require separate written terms.',
      'This is independent, performance-based work, not a salaried vacancy. Agents may not quote prices or promise features, dates or discounts.',
    ],
    examples: [
      { name: 'Schools & academies', need: 'Fees, records, parent portals and school management' },
      { name: 'Pharmacies & clinics', need: 'Inventory, expiry alerts, appointments and billing' },
      { name: 'Contractors & architects', need: 'Site reporting, materials, project progress and approvals' },
      { name: 'Retail shops', need: 'POS, stock, purchasing and customer history' },
      { name: 'Wholesalers', need: 'Order portals, debts, delivery notes and dispatch' },
      { name: 'Property managers', need: 'Tenant portals, rent records and maintenance requests' },
      { name: 'Logistics companies', need: 'Driver apps, trip tracking and delivery confirmation' },
      { name: 'Hospitality & services', need: 'Bookings, scheduling and operating dashboards' },
    ],
    faqs: [
      { question: 'Do I need programming experience?', answer: 'No. You identify business challenges and introduce qualified customers. Our engineers scope and build the software.' },
      { question: 'What commission is proposed?', answer: 'The proposed pilot is 5% for qualified introductions or 10% for active agents, based on qualifying development fees collected. The written agreement determines what applies.' },
      { question: 'When will I get paid?', answer: 'Following actual collection of eligible development fees and satisfaction of the referral agreement. For milestone projects, commission can follow collected milestones.' },
      { question: 'Can I work outside Nairobi?', answer: 'Yes. Relevant businesses may be anywhere in Kenya, and appropriate overseas introductions may also be considered.' },
      { question: 'Can I quote prices or sign clients?', answer: 'No. Joeltech Geek Systems is responsible for pricing, proposals, contracts, technical commitments and project delivery.' },
      { question: 'What counts as a qualified referral?', answer: 'A new, accepted introduction to an authorised decision-maker with a specific software need and willingness to discuss it.' },
    ],
    interestInstructions: 'Introduce yourself, your town or county, industries you know, and how you would find relevant business customers. No technical CV is required.',
  },
];

export function findCareerOpportunity(slug: string): CareerOpportunity | undefined {
  return careerOpportunities.find((item) => item.slug === slug);
}
