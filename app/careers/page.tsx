import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, BriefcaseBusiness, GraduationCap, Mail, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Software Engineering Careers, Internships & SaaS Sales | Joeltech Geek Systems',
  description: 'Learn about software engineering collaborations, practical developer internships and SaaS sales opportunities with Joeltech Geek Systems, a Kenya-based software business serving clients globally.',
  alternates: { canonical: '/careers' },
};

const engineeringSubject = encodeURIComponent('Software Engineering Collaboration — Joeltech Geek Systems');
const internshipSubject = encodeURIComponent('Software Development Internship Interest — Joeltech Geek Systems');
const salesSubject = encodeURIComponent('SaaS Sales Representative Interest — Joeltech Geek Systems');

const opportunities = [
  {
    id: 'engineering',
    eyebrow: 'Professional software engineering',
    title: 'Software Engineers & Technical Collaborators',
    icon: BriefcaseBusiness,
    intro: 'We welcome qualified engineers interested in paid, production-level collaborations when a suitable project or position is available. Remote collaboration can be considered internationally.',
    details: ['React Native / Expo / TypeScript mobile application engineering', 'Next.js web applications, Python/FastAPI services and PostgreSQL', 'Architecture, code review, automated testing and production delivery'],
    note: 'This is an expression-of-interest channel, not an advertised open vacancy. Paid work is governed by an agreed project contract or employment terms, including compensation, location and eligibility. We do not guarantee a placement, sponsorship or relocation.',
    subject: engineeringSubject,
    application: 'Share your engineering focus, links to shipped projects or code, preferred engagement model, timezone and availability.',
    cta: 'Express engineering interest',
  },
  {
    id: 'internships',
    eyebrow: 'Engineering & learning',
    title: 'Software Development Internships',
    icon: GraduationCap,
    intro: 'For emerging developers ready to strengthen their craft through meaningful software engineering practice and guidance.',
    details: ['Frontend or mobile development with React, Next.js or React Native', 'APIs, backend services, databases and testing', 'Code review, product thinking and real-world engineering habits'],
    note: 'Duration, availability, working arrangements and any stipend will be discussed before an internship is agreed. An expression of interest is not a placement guarantee.',
    subject: internshipSubject,
    application: 'Introduce yourself, what you are learning, your availability and a GitHub profile or portfolio if available.',
    cta: 'Express internship interest',
  },
  {
    id: 'sales',
    eyebrow: 'Business growth & products',
    title: 'SaaS Sales Representatives',
    icon: BriefcaseBusiness,
    intro: 'Help organisations discover software that solves real operational problems, from property management to school-fee collection.',
    details: ['Prospect for relevant customers and understand their needs', 'Introduce and demonstrate eligible solutions such as RentPayor or SchoolPey', 'Coordinate qualified enquiries, follow-ups and customer onboarding'],
    note: 'Remuneration, commissions and any reimbursements vary by SaaS solution and agreement. Exact eligibility, rates, expenses and payment conditions are communicated before an engagement begins; no fixed salary is implied.',
    subject: salesSubject,
    application: 'Share your location, any sales experience, preferred industries, and the Joeltech Geek Systems product you would like to represent.',
    cta: 'Express sales interest',
  },
];

export default function CareersPage() {
  return (
    <main className="site-container pb-16 pt-28">
      <header className="max-w-4xl">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-palm-green"><Sparkles className="h-4 w-4" aria-hidden /> Opportunities</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">Work on real software. Grow your skills. Help products reach their users.</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">Joeltech Geek Systems believes good technology businesses can also create learning and earning opportunities. We distinguish paid software engineering opportunities, learning-focused internships and SaaS sales roles. We welcome enquiries from qualified remote collaborators, emerging developers and people helping customers adopt useful software.</p>
        <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">Kenya-based · Remote collaboration can be international · Positions and compensation depend on the actual opening</p>
      </header>

      <section className="mt-14 grid gap-6 lg:grid-cols-2" aria-label="Careers opportunities">
        {opportunities.map(({id,eyebrow,title,icon:Icon,intro,details,note,subject,application,cta}) => (
          <article key={id} id={id} className="flex flex-col rounded-3xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900/60 sm:p-9">
            <Icon className="h-10 w-10 text-palm-green" aria-hidden />
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-palm-green">{eyebrow}</p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{title}</h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">{intro}</p>
            <h3 className="mt-7 text-sm font-bold text-gray-900 dark:text-white">What you could work on</h3>
            <ul className="mt-3 space-y-3">
              {details.map((detail)=><li key={detail} className="flex gap-3 text-sm leading-7 text-gray-600 dark:text-gray-300"><span className="font-bold text-palm-green" aria-hidden>✓</span>{detail}</li>)}
            </ul>
            <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-sm leading-7 text-gray-600 dark:bg-gray-950/70 dark:text-gray-300">{note}</div>
            <div className="mt-auto pt-8">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">How to express interest</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">{application}</p>
              <a href={`mailto:mbakajoe26@gmail.com?subject=${subject}`} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-palm-green px-5 py-3 font-semibold text-white hover:opacity-90">
                <Mail className="h-4 w-4" aria-hidden /> {cta}
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-16 grid gap-7 rounded-3xl bg-gray-50 p-8 dark:bg-gray-900/60 md:grid-cols-[auto_1fr] sm:p-10">
        <BookOpen className="h-10 w-10 text-palm-green" aria-hidden />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mentorship is a separate learning pathway.</h2>
          <p className="mt-3 text-base leading-8 text-gray-600 dark:text-gray-300">Founder Joel Mbaka mentors emerging developers through practical projects, feedback and production engineering habits. Mentorship does not itself constitute employment, an accredited school course, certification or a guaranteed internship.</p>
          <Link href="/mentorship" className="mt-5 inline-flex items-center gap-2 font-semibold text-palm-green hover:underline">Explore mentorship <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <span>For other enquiries:</span>
        <Link href="/contact" className="font-semibold text-palm-green hover:underline">Contact Joeltech Geek Systems</Link>
      </div>
    </main>
  );
}
